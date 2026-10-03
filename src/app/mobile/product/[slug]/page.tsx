"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/context/CartContext";
import { Product } from "@/lib/products";

export default function MobileProductPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [params.slug]);

  const fetchProduct = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", params.slug)
      .single();

    if (!error && data) {
      setProduct(data);
      setSelectedSize(data.sizes[0] || "");
      setSelectedColor(data.colors[0] || "");
    }
    setLoading(false);
  };

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      await addItem({
        productId: product.id,
        slug: product.slug,
        name: product.name,
        image: product.image_url,
        size: selectedSize,
        color: selectedColor,
        quantity,
        unitPriceCents: product.price_cents,
      });
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <p className="text-gray-500">Product not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="fixed top-4 left-4 z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center"
      >
        <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Image */}
      <div className="aspect-square bg-gray-100">
        {product.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Details */}
      <div className="p-4">
        <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
        <p className="text-xl font-semibold text-gray-900 mt-2">
          ${(product.price_cents / 100).toFixed(2)}
        </p>
        <p className="text-gray-600 mt-3 leading-relaxed">{product.description}</p>

        {/* Size selector */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Size</h3>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 rounded-lg border text-sm transition ${
                  selectedSize === size
                    ? "bg-gray-900 text-white border-gray-900"
                    : "border-gray-300 text-gray-700"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Color selector */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Color</h3>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`px-4 py-2 rounded-lg border text-sm transition ${
                  selectedColor === color
                    ? "bg-gray-900 text-white border-gray-900"
                    : "border-gray-300 text-gray-700"
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Quantity</h3>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <span className="text-lg font-medium">{quantity}</span>
            <button
              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Add to cart button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100">
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`w-full py-4 rounded-xl text-center font-semibold transition ${
            added
              ? "bg-green-500 text-white"
              : product.stock === 0
              ? "bg-gray-200 text-gray-400"
              : "bg-gray-900 text-white"
          }`}
        >
          {added ? "Added to Cart!" : product.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
