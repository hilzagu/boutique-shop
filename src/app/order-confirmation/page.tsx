import { getOrderById } from "@/lib/orders";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

async function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: { orderId?: string };
}) {
  if (!searchParams.orderId) notFound();

  const order = await getOrderById(searchParams.orderId);
  if (!order) notFound();

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
            <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full capitalize">
              {order.status}
            </span>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h2 className="font-medium mb-4">Items</h2>
          <div className="space-y-4">
            {order.items.map((item: any) => (
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
