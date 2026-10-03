"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

interface Order {
  id: string;
  order_number: string;
  status: string;
  total_cents: number;
  created_at: string;
  items: any[];
}

export default function MobileOrdersPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetchOrders();
    }
  }, [session]);

  const fetchOrders = async () => {
    if (!session?.user?.id) return;

    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setOrders(data);
    }
    setLoading(false);
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Please log in</h2>
        <p className="text-gray-500 text-center mb-6">Sign in to view your orders</p>
        <Link
          href="/mobile/auth"
          className="w-full flex items-center justify-center gap-3 bg-blue-500 text-white py-4 rounded-xl font-medium hover:bg-blue-600 transition"
        >
          Sign in with Google
        </Link>
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

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
      </div>

      {orders.length === 0 ? (
        <div className="p-4 text-center">
          <p className="text-gray-500">No orders yet</p>
        </div>
      ) : (
        <div className="p-4 space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="p-4 bg-gray-50 rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-900">#{order.order_number}</span>
                <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full capitalize">
                  {order.status}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                {new Date(order.created_at).toLocaleDateString()}
              </p>
              <p className="text-lg font-semibold text-gray-900 mt-2">
                ${(order.total_cents / 100).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-2 flex justify-around">
        <Link href="/mobile" className="flex flex-col items-center text-gray-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-xs mt-1">Shop</span>
        </Link>
        <Link href="/mobile/cart" className="flex flex-col items-center text-gray-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <span className="text-xs mt-1">Cart</span>
        </Link>
        <Link href="/mobile/profile" className="flex flex-col items-center text-blue-500">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-xs mt-1">Profile</span>
        </Link>
      </div>
    </div>
  );
}
