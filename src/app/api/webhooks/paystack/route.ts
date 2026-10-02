import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";
import { updateOrderStatus, getOrderByNumber } from "@/lib/orders";
import { sendOrderConfirmationEmail, logEmailToDatabase } from "@/lib/mailgun";
import { supabaseAdmin } from "@/lib/supabase";

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY!;

// Verify Paystack webhook signature
function verifySignature(payload: string, signature: string): boolean {
  const hash = createHmac("sha512", PAYSTACK_SECRET)
    .update(payload)
    .digest("hex");
  return hash === signature;
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("x-paystack-signature") || "";

  // Verify the webhook signature
  if (!verifySignature(body, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(body);

  try {
    switch (event.event) {
      case "charge.success": {
        const reference = event.data.reference;
        // Find order by reference (stored in stripe_payment_intent_id field)
        const { data: orders, error } = await supabaseAdmin
          .from("orders")
          .select("*")
          .eq("stripe_payment_intent_id", reference)
          .single();

        if (error || !orders) {
          console.error("Order not found for reference:", reference);
          break;
        }

        await updateOrderStatus(orders.id, "paid", event.data.id?.toString());

        // Fetch order items and send email
        const order = await getOrderByNumber(orders.order_number);
        if (order) {
          const emailResult = await sendOrderConfirmationEmail({
            orderNumber: order.order_number,
            customerName: order.user_name,
            customerEmail: order.user_email,
            items: order.items.map((item: any) => ({
              name: item.product_name,
              size: item.size,
              color: item.color,
              quantity: item.quantity,
              price: item.total_price_cents,
            })),
            subtotal: order.subtotal_cents,
            shipping: order.shipping_cents,
            tax: order.tax_cents,
            total: order.total_cents,
            shippingAddress: {
              name: order.shipping_name,
              address: order.shipping_address,
              city: order.shipping_city,
              state: order.shipping_state,
              zip: order.shipping_zip,
              country: order.shipping_country,
            },
          });

          await logEmailToDatabase(supabaseAdmin, {
            orderId: order.id,
            toEmail: order.user_email,
            subject: `Order Confirmation #${order.order_number}`,
            template: "order_confirmation",
            status: emailResult.success ? "sent" : "failed",
            mailgunMessageId: emailResult.messageId,
          });
        }
        break;
      }

      case "charge.failed": {
        const reference = event.data.reference;
        const { data: orders } = await supabaseAdmin
          .from("orders")
          .select("id")
          .eq("stripe_payment_intent_id", reference)
          .single();

        if (orders) {
          await updateOrderStatus(orders.id, "cancelled");
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Paystack webhook error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
