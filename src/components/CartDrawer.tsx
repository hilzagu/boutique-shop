"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function CartDrawer() {
  const { items, isOpen, removeItem, updateQuantity, subtotalCents, toggleCart } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" onClick={toggleCart} />

      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-lg font-medium">Your Cart</h2>
          <button onClick={toggleCart} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">Your cart is empty</p>
              <button onClick={toggleCart} className="text-brand-600 hover:text-brand-700 text-sm">
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-4">
                  <div className="w-20 h-24 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                    {item.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">{item.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {item.size} / {item.color}
                    </p>
                    <p className="text-sm font-medium mt-2">${(item.unitPriceCents / 100).toFixed(2)}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.size, item.color, Math.max(1, item.quantity - 1))
                        }
                        className="w-6 h-6 border border-gray-300 rounded flex items-center justify-center text-xs hover:bg-gray-50"
                      >
                        -
                      </button>
                      <span className="text-sm">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.size, item.color, item.quantity + 1)
                        }
                        className="w-6 h-6 border border-gray-300 rounded flex items-center justify-center text-xs hover:bg-gray-50"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId, item.size, item.color)}
                    className="text-gray-400 hover:text-red-500 self-start"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 p-6">
            <div className="flex justify-between mb-4">
              <span className="text-sm text-gray-600">Subtotal</span>
              <span className="font-medium">${(subtotalCents / 100).toFixed(2)}</span>
            </div>
            <Link
              href="/checkout"
              onClick={toggleCart}
              className="block w-full bg-gray-900 text-white text-center py-3 rounded hover:bg-gray-800 transition text-sm"
            >
              Proceed to Checkout
            </Link>
            <button
              onClick={toggleCart}
              className="block w-full text-center text-sm text-gray-500 hover:text-gray-700 mt-3"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
