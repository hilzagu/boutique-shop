"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useSession } from "next-auth/react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function MobileCartPage() {
  const { data: session } = useSession();
  const { items, removeItem, updateQuantity, totalItems, subtotalCents, loading } = useCart();
  const router = useRouter();

  if (!session) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Please log in</h2>
        <p className="text-gray-500 text-center mb-6">Sign in to view your cart</p>
        <button
          onClick={() => signIn("google", { callbackUrl: "/mobile/cart" })}
          className="w-full flex items-center justify-center gap-3 bg-blue-500 text-white py-4 rounded-xl font-medium hover:bg-blue-600 transition"
        >
          Sign in with Google
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
        <Link href="/mobile" className="text-blue-500 font-medium">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-gray-900">Cart ({totalItems})</h1>
      </div>

      <div className="p-4 space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3 p-3 bg-gray-50 rounded-xl">
            <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
              {item.product_image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.product_image}
                  alt={item.product_name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-gray-900 truncate">{item.product_name}</h3>
              <p className="text-xs text-gray-500 mt-1">{item.size} / {item.color}</p>
              <p className="text-sm font-semibold text-gray-900 mt-1">
                ${((item.unit_price_cents * item.quantity) / 100).toFixed(2)}
              </p>
              <div className="flex items-center gap-3 mt-2">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center"
                >
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="text-sm font-medium">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center"
                >
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
                <button onClick={() => removeItem(item.id)} className="ml-auto">
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="fixed bottom-16 left-0 right-0 p-4 bg-white border-t border-gray-100">
        <div className="flex justify-between mb-3">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-semibold text-gray-900">${(subtotalCents / 100).toFixed(2)}</span>
        </div>
        <button
          onClick={() => router.push("/checkout")}
          className="w-full bg-gray-900 text-white py-4 rounded-xl font-semibold"
        >
          Checkout
        </button>
      </div>

      {/* Bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-2 flex justify-around">
        <Link href="/mobile" className="flex flex-col items-center text-gray-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-xs mt-1">Shop</span>
        </Link>
        <Link href="/mobile/cart" className="flex flex-col items-center text-blue-500">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <span className="text-xs mt-1">Cart</span>
        </Link>
        <Link href="/mobile/profile" className="flex flex-col items-center text-gray-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-xs mt-1">Profile</span>
        </Link>
      </div>
    </div>
  );
}
