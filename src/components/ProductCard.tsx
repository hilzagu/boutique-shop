import Link from "next/link";
import { Product } from "@/lib/products";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.slug}`} className="group">
      <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden mb-4">
        {product.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}
      </div>
      <h3 className="text-sm font-medium text-gray-900 group-hover:text-brand-600 transition">
        {product.name}
      </h3>
      <p className="text-sm text-gray-500 mt-1">${(product.price_cents / 100).toFixed(2)}</p>
      <div className="flex gap-1 mt-2">
        {product.colors.slice(0, 3).map((color) => (
          <span key={color} className="text-xs text-gray-400">
            {color}
            {product.colors.indexOf(color) < Math.min(product.colors.length, 3) - 1 ? ", " : ""}
          </span>
        ))}
        {product.colors.length > 3 && (
          <span className="text-xs text-gray-400">+{product.colors.length - 3}</span>
        )}
      </div>
    </Link>
  );
}
