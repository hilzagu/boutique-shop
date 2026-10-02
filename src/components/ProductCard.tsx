import Link from "next/link";
import { Product } from "@/lib/products";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.slug}`} className="group">
      <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden mb-4 relative">
        {product.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}
        {/* Color variants */}
        <div className="absolute bottom-3 left-3 flex gap-1.5">
          {product.colors.slice(0, 4).map((color, i) => (
            <span
              key={color}
              className="w-4 h-4 rounded-full border border-white shadow-sm"
              style={{ backgroundColor: getColorHex(color) }}
              title={color}
            />
          ))}
        </div>
      </div>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-500 transition">
            {product.name}
          </h3>
          <p className="text-xs text-gray-500 mt-1 capitalize">{product.category}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-gray-900">${(product.price_cents / 100).toFixed(2)}</p>
        </div>
      </div>
    </Link>
  );
}

function getColorHex(color: string): string {
  const colors: Record<string, string> = {
    Black: "#1a1a1a",
    White: "#ffffff",
    Grey: "#9ca3af",
    Gray: "#9ca3af",
    Camel: "#c19a6b",
    Emerald: "#046a38",
    Burgundy: "#800020",
    Navy: "#1e3a5f",
    Cream: "#fffdd0",
    Beige: "#f5f5dc",
    Blush: "#de5d83",
    Sage: "#9dc183",
    Olive: "#808000",
    Sand: "#c2b280",
    Charcoal: "#36454f",
    "Light Wash": "#a8c3d1",
    "Dark Wash": "#2c3e50",
    "Medium Wash": "#5dade2",
    Champagne: "#f7e7ce",
    "Dusty Rose": "#c4a4a4",
    Silver: "#c0c0c0",
    "Pale Blue": "#afcdf5",
    "Forest": "#228b22",
    "Oatmeal": "#d6c6a5",
    "Light Beige Tone": "#e8dcc8",
    "Soft Minty Green": "#b8e0d2",
    "Dark Navy": "#1a2744",
    "Steel Greyish Blue": "#6c7a89",
    "Orange Shade": "#e8a87c",
    "Light Beige": "#e8dcc8",
  };
  return colors[color] || "#e5e7eb";
}
