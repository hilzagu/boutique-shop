import { getProductBySlug, Product } from "@/lib/products";
import { notFound } from "next/navigation";
import AddToCart from "./AddToCart";

export const dynamic = "force-dynamic";

async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image */}
        <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
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
        <div className="flex flex-col">
          <h1 className="text-3xl font-light text-gray-900">{product.name}</h1>
          <p className="text-2xl font-normal mt-4">${(product.price_cents / 100).toFixed(2)}</p>

          <div className="border-t border-gray-200 mt-6 pt-6">
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          <div className="mt-6">
            <p className="text-sm text-gray-500">
              <span className="font-medium text-gray-700">Category:</span>{" "}
              <span className="capitalize">{product.category}</span>
            </p>
            <p className="text-sm text-gray-500 mt-1">
              <span className="font-medium text-gray-700">Availability:</span>{" "}
              {product.stock > 0 ? (
                <span className="text-green-600">In Stock ({product.stock})</span>
              ) : (
                <span className="text-red-500">Out of Stock</span>
              )}
            </p>
          </div>

          {/* Add to Cart */}
          <div className="mt-8">
            <AddToCart product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
