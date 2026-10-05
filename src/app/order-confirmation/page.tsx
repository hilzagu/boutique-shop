import { getOrderById, updateOrderStatus } from "@/lib/orders";
import { verifyTransaction } from "@/lib/paystack";
import { sendOrderConfirmationEmail, logEmailToDatabase } from "@/lib/mailgun";
import { supabaseAdmin } from "@/lib/supabase";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

async function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: { reference?: string; orderId?: string };
}) {
  // Handle Paystack callback (reference-based)
  if (searchParams.reference && !searchParams.orderId) {
    const verification = await verifyTransaction(searchParams.reference);

    if (!verification.status || verification.data.status !== "success") {
      return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-3xl font-light mb-2">Payment Failed</h1>
          <p className="text-gray-500 mb-8">
            Your payment could not be processed. Please try again.
          </p>
          <Link
            href="/"
            className="inline-block bg-gray-900 text-white px-8 py-3 text-sm font-medium hover:bg-gray-800 transition"
          >
            Back to Shop
          </Link>
        </div>
      );
    }

    // Payment successful - find order by reference
    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("stripe_payment_intent_id", searchParams.reference)
      .single();

    if (error || !order) {
      return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-3xl font-light mb-2">Order Not Found</h1>
          <p className="text-gray-500 mb-8">
            We couldn&apos;t find your order. Please contact support.
          </p>
          <Link
            href="/"
            className="inline-block bg-gray-900 text-white px-8 py-3 text-sm font-medium hover:bg-gray-800 transition"
          >
            Back to Shop
          </Link>
        </div>
      );
    }

    // Fetch order items
    const { data: orderItems } = await supabaseAdmin
      .from("order_items")
      .select("*")
      .eq("order_id", order.id);

    const items = orderItems || [];

    // Mark the order as paid (if not already) and send the confirmation email
    if (order.status !== "paid") {
      await updateOrderStatus(order.id, "paid");

      const emailResult = await sendOrderConfirmationEmail({
        orderNumber: order.order_number,
        customerName: order.user_name,
        customerEmail: order.user_email,
        items: items.map((item: any) => ({
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

      order.status = "paid";
    }

    return (
      <OrderConfirmationView order={order} items={items} />
    );
  }

  // Handle direct order ID access
  if (!searchParams.orderId) notFound();

  const order = await getOrderById(searchParams.orderId);
  if (!order) notFound();

  return <OrderConfirmationView order={order} items={order.items} />;
}

function OrderConfirmationView({ order, items }: { order: any; items: any[] }) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-light mb-2">Order Confirmed!</h1>
        <p className="text-gray-500">
          Thank you for your purchase. A confirmation email has been sent to{" "}
          <span className="font-medium text-gray-700">{order.user_email}</span>.
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-8 mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-sm text-gray-500">Order Number</p>
            <p className="text-lg font-medium">#{order.order_number}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Status</p>
            <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full capitalize">
              {order.status}
            </span>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h2 className="font-medium mb-4">Items</h2>
          <div className="space-y-4">
            {items.map((item: any) => (
              <div key={item.id} className="flex justify-between">
                <div>
                  <p className="font-medium text-sm">{item.product_name}</p>
                  <p className="text-xs text-gray-500">
                    {item.size} / {item.color} x {item.quantity}
                  </p>
                </div>
                <span className="text-sm">${((item.total_price_cents) / 100).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4 mt-6 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span>${(order.subtotal_cents / 100).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Shipping</span>
            <span>${(order.shipping_cents / 100).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tax</span>
            <span>${(order.tax_cents / 100).toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-medium text-lg border-t border-gray-200 pt-2 mt-2">
            <span>Total</span>
            <span>${(order.total_cents / 100).toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-8 mb-8">
        <h2 className="font-medium mb-4">Shipping Address</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          {order.shipping_name}<br />
          {order.shipping_address}<br />
          {order.shipping_city}, {order.shipping_state} {order.shipping_zip}<br />
          {order.shipping_country}
        </p>
      </div>

      <div className="text-center">
        <Link
          href="/"
          className="inline-block bg-gray-900 text-white px-8 py-3 text-sm font-medium hover:bg-gray-800 transition"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default OrderConfirmationPage;
