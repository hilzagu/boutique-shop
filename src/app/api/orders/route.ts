import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createOrder, updateOrderStatus } from "@/lib/orders";
import { sendOrderConfirmationEmail, logEmailToDatabase } from "@/lib/mailgun";
import { supabaseAdmin } from "@/lib/supabase";
import { verifyTransaction } from "@/lib/paystack";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { reference, items, shipping, subtotalCents, shippingCents, taxCents, totalCents } = body;

    // Verify the Paystack transaction
    const verification = await verifyTransaction(reference);

    if (!verification.status || verification.data.status !== "success") {
      return NextResponse.json(
        { error: "Payment verification failed" },
        { status: 400 }
      );
    }

    // Get session (user may be guest or logged in)
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id || null;

    // Create order in database
    const order = await createOrder({
      userId,
      userEmail: shipping.email,
      userName: shipping.name,
      shippingName: shipping.name,
      shippingAddress: shipping.address,
      shippingCity: shipping.city,
      shippingState: shipping.state,
      shippingZip: shipping.zip,
      shippingCountry: shipping.country,
      items: items.map((item: any) => ({
        product_id: item.productId,
        product_name: item.name,
        product_image: item.image,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        unit_price_cents: item.unitPriceCents,
        total_price_cents: item.unitPriceCents * item.quantity,
      })),
      subtotalCents,
      shippingCents,
      taxCents,
      totalCents,
      stripePaymentIntentId: reference,
    });

    // Update order status to paid
    await updateOrderStatus(order.id, "paid");

    // Send confirmation email via Mailgun
    const emailResult = await sendOrderConfirmationEmail({
      orderNumber: order.order_number,
      customerName: shipping.name,
      customerEmail: shipping.email,
      items: items.map((item: any) => ({
        name: item.name,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        price: item.unitPriceCents * item.quantity,
      })),
      subtotal: subtotalCents,
      shipping: shippingCents,
      tax: taxCents,
      total: totalCents,
      shippingAddress: {
        name: shipping.name,
        address: shipping.address,
        city: shipping.city,
        state: shipping.state,
        zip: shipping.zip,
        country: shipping.country,
      },
    });

    // Log email to database
    await logEmailToDatabase(supabaseAdmin, {
      orderId: order.id,
      toEmail: shipping.email,
      subject: `Order Confirmation #${order.order_number}`,
      template: "order_confirmation",
      status: emailResult.success ? "sent" : "failed",
      mailgunMessageId: emailResult.messageId,
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.order_number,
      emailSent: emailResult.success,
    });
  } catch (error: any) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create order" },
      { status: 500 }
    );
  }
}
