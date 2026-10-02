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
        <section className="relative bg-gradient-to-br from-blue-50 to-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-xs text-gray-500 font-medium tracking-wide mb-4">/2024</p>
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
                  Dynamic Fashion For A Life In Motion
                </h1>
                <p className="text-gray-600 mb-8 max-w-md">
                  From the gym to the streets, discover style that&apos;s as high-performance as you are
                </p>
                <Link
                  href="#products"
                  className="inline-flex items-center gap-2 bg-blue-500 text-white px-8 py-4 rounded-full text-sm font-medium hover:bg-blue-600 transition-colors"
                >
                  Shop Now
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              <div className="relative">
                <div className="aspect-[4/5] bg-gray-200 rounded-2xl overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800"
                    alt="Hero"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Product overlay */}
                <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
                  <p className="text-xs text-gray-500">FlexPro Sweat</p>
                  <p className="text-sm font-semibold text-gray-900">Jacket</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-400 line-through">$80</span>
                    <span className="text-sm font-bold text-gray-900">$59.99</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Category Header */}
      {category && (
        <div className="bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-xs text-gray-500 font-medium tracking-wide mb-2">/2024</p>
            <h1 className="text-3xl font-bold capitalize">{category}</h1>
            <p className="text-gray-500 mt-2">
              {products.length} {products.length === 1 ? "item" : "items"}
            </p>
          </div>
        </div>
      )}

      {/* Featured Section */}
      {!category && featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Featured</h2>
            <Link href="/" className="text-sm text-blue-500 hover:text-blue-600 font-medium">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {featured.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* All Products */}
      <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">
            {category ? "" : "All Products"}
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {products.length === 0 && (
          <p className="text-center text-gray-400 py-12">No products found in this category.</p>
        )}
      </section>

      {/* CTA Section */}
      {!category && (
        <section className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Feel the Freedom, Power, and the Hustle
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              At Stride, we craft streetwear that seamlessly blends high performance with everyday style.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-blue-500 text-white px-8 py-4 rounded-full text-sm font-medium hover:bg-blue-600 transition-colors"
            >
              Learn more
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}

export default ProductsPage;
