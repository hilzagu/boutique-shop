import { getProducts, getFeaturedProducts, getProductsByCategory } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const category = searchParams.category;
  const products = category
    ? await getProductsByCategory(category)
    : await getProducts();
  const featured = category ? [] : await getFeaturedProducts();

  return (
    <div>
      {/* Hero */}
      {!category && (
        <section className="relative bg-gray-900 text-white">
          <div className="absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600"
              alt="Hero"
              className="w-full h-full object-cover opacity-50"
            />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-48">
            <h1 className="text-4xl md:text-6xl font-light tracking-wide mb-6">
              New Season
              <br />
              <span className="font-normal">Essentials</span>
            </h1>
            <p className="text-lg text-gray-200 mb-8 max-w-md">
              Discover our curated collection of timeless pieces designed for the modern woman.
            </p>
            <Link
              href="#products"
              className="inline-block bg-white text-gray-900 px-8 py-3 text-sm font-medium hover:bg-gray-100 transition"
            >
              Shop Now
            </Link>
          </div>
        </section>
      )}

      {/* Category Header */}
      {category && (
        <div className="bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-light capitalize">{category}</h1>
            <p className="text-gray-500 mt-2">
              {products.length} {products.length === 1 ? "item" : "items"}
            </p>
          </div>
        </div>
      )}

      {/* Featured Section */}
      {!category && featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-light mb-8">Featured</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {featured.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* All Products */}
      <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-light mb-8">
          {category ? "" : "All Products"}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {products.length === 0 && (
          <p className="text-center text-gray-400 py-12">No products found in this category.</p>
        )}
      </section>
    </div>
  );
}

export default ProductsPage;
