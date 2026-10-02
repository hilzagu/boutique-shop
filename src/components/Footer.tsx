export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Brand */}
          <div className="md:col-span-4">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Stride</h3>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              At Stride, we craft streetwear that seamlessly blends high performance with everyday style.
              Whether you&apos;re running errands or conquering your next workout, we&apos;re here to help you feel confident,
              comfortable, and fierce in every movement
            </p>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Newsletter Sign up</h4>
            <p className="text-xs text-gray-500 mb-4">Stay updated with our latest features and travel tips.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your Email Address"
                className="flex-1 border-b border-gray-300 pb-2 text-sm focus:outline-none focus:border-gray-900 bg-transparent"
              />
              <button className="bg-blue-500 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-blue-600 transition">
                Submit
              </button>
            </div>
          </div>

          {/* Menu */}
          <div className="md:col-span-2">
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Menu</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><a href="/" className="hover:text-gray-900">Product</a></li>
              <li><a href="/?category=new" className="hover:text-gray-900">New Arrival</a></li>
              <li><a href="/?category=dresses" className="hover:text-gray-900">Collection</a></li>
            </ul>
          </div>

          {/* Security */}
          <div className="md:col-span-2">
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Security</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><a href="#" className="hover:text-gray-900">Terms of Service</a></li>
              <li><a href="#" className="hover:text-gray-900">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-100 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <a href="#" className="text-gray-400 hover:text-gray-900 transition">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-900 transition">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
          </div>
          <p className="text-xs text-gray-400">All rights reserved.</p>
        </div>

        {/* Bottom links */}
        <div className="flex justify-between items-center mt-8 text-xs text-gray-400">
          <a href="#" className="hover:text-gray-600">Privacy policy</a>
          <a href="#" className="hover:text-gray-600">Terms of service</a>
        </div>
      </div>
    </footer>
  );
}
