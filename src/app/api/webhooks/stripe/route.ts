import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { updateOrderStatus } from "@/lib/orders";
import { sendOrderConfirmationEmail, logEmailToDatabase } from "@/lib/mailgun";
import { supabaseAdmin } from "@/lib/supabase";
import { getOrderById } from "@/lib/orders";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20" as any,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error: any) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const orderId = paymentIntent.metadata.orderId;

        if (orderId) {
          await updateOrderStatus(orderId, "paid", paymentIntent.latest_charge as string);

          // Fetch order and send email
          const order = await getOrderById(orderId);
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
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const orderId = paymentIntent.metadata.orderId;
        if (orderId) {
          await updateOrderStatus(orderId, "cancelled");
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Stripe webhook error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
