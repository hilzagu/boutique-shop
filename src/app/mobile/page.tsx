"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabase";
import { Product } from "@/lib/products";
import Link from "next/link";

export default function MobileShopPage() {
  const { data: session } = useSession();
  const { totalItems, toggleCart } = useCart();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = ["All", "Dresses", "Tops", "Bottoms", "Outerwear"];

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    let query = supabase.from("products").select("*").order("created_at", { ascending: false });

    if (selectedCategory && selectedCategory !== "All") {
      query = query.eq("category", selectedCategory.toLowerCase());
    }

    const { data, error } = await query;
    if (!error && data) {
      setProducts(data);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-100">
        <div className="flex justify-between items-center px-4 py-3">
          <Link href="/mobile" className="text-xl font-bold text-gray-900">
            Stride
          </Link>
          <div className="flex items-center gap-3">
            {session ? (
              <Link href="/mobile/profile" className="text-sm text-gray-600">
                Hi, {session.user?.name?.split(" ")[0]}
              </Link>
            ) : (
              <Link href="/mobile/auth" className="text-sm text-blue-500 font-medium">
                Sign In
              </Link>
            )}
            <button onClick={toggleCart} className="relative p-2">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Category filters */}
        <div className="flex gap-2 px-4 pb-3 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition ${
                selectedCategory === cat
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 p-4">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/mobile/product/${product.slug}`}
              className="bg-gray-50 rounded-xl overflow-hidden"
            >
              <div className="aspect-square bg-gray-200">
                {product.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="p-3">
                <h3 className="text-sm font-medium text-gray-900 truncate">{product.name}</h3>
                <p className="text-sm font-semibold text-gray-900 mt-1">
                  ${(product.price_cents / 100).toFixed(2)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-2 flex justify-around">
        <Link href="/mobile" className="flex flex-col items-center text-blue-500">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-xs mt-1">Shop</span>
        </Link>
        <button onClick={toggleCart} className="flex flex-col items-center text-gray-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <span className="text-xs mt-1">Cart</span>
        </button>
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
