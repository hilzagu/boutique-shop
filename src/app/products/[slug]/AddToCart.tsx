"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Product } from "@/lib/products";

export default function AddToCart({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "");
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || "");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem({
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
  };

  return (
    <div className="space-y-6">
      {/* Size selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
        <div className="flex flex-wrap gap-2">
          {product.sizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`px-4 py-2 border text-sm transition ${
                selectedSize === size
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-gray-300 hover:border-gray-900"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Color selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
        <div className="flex flex-wrap gap-2">
          {product.colors.map((color) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`px-4 py-2 border text-sm transition ${
                selectedColor === color
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-gray-300 hover:border-gray-900"
              }`}
            >
              {color}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
        <div className="flex items-center border border-gray-300 w-fit">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-4 py-2 text-gray-600 hover:bg-gray-50"
          >
            -
          </button>
          <span className="px-4 py-2 text-sm min-w-[3rem] text-center">{quantity}</span>
          <button
            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
            className="px-4 py-2 text-gray-600 hover:bg-gray-50"
          >
            +
          </button>
        </div>
      </div>

      {/* Add to Cart button */}
      <button
        onClick={handleAdd}
        disabled={product.stock === 0}
        className={`w-full py-4 text-sm font-medium transition ${
          product.stock === 0
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : added
            ? "bg-green-600 text-white"
            : "bg-gray-900 text-white hover:bg-gray-800"
        }`}
      >
        {product.stock === 0
          ? "Out of Stock"
          : added
          ? "Added to Cart!"
          : "Add to Cart"}
      </button>
    </div>
  );
}
