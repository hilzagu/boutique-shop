export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-light tracking-widest text-gray-900 uppercase mb-4">Boutique</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Curated women&apos;s clothing for the modern wardrobe. Quality fabrics, timeless designs.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><a href="/?category=dresses" className="hover:text-gray-900">Dresses</a></li>
              <li><a href="/?category=tops" className="hover:text-gray-900">Tops</a></li>
              <li><a href="/?category=bottoms" className="hover:text-gray-900">Bottoms</a></li>
              <li><a href="/?category=outerwear" className="hover:text-gray-900">Outerwear</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-4">Help</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><a href="#" className="hover:text-gray-900">Shipping & Returns</a></li>
              <li><a href="#" className="hover:text-gray-900">Size Guide</a></li>
              <li><a href="#" className="hover:text-gray-900">Contact Us</a></li>
              <li><a href="#" className="hover:text-gray-900">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-4">Connect</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><a href="#" className="hover:text-gray-900">Instagram</a></li>
              <li><a href="#" className="hover:text-gray-900">Pinterest</a></li>
              <li><a href="#" className="hover:text-gray-900">Newsletter</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-10 pt-8 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} Boutique. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
