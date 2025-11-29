export default function Footer() {
  return (
    <footer className="bg-[#0d1117] text-gray-300 pt-14 pb-8 mt-16">

      {/* TOP GRID */}
      <div className="px-8 md:px-20 grid md:grid-cols-4 gap-10">

        {/* 🥬 Brand / About */}
        <div>
          <h2 className="text-2xl font-bold text-green-500">GreenBasket</h2>
          <p className="text-sm mt-3 text-gray-400">
            Fresh organic groceries delivered directly to your doorstep.
          </p>
          <p className="mt-3 text-sm">Quality | Purity | Trust 🌱</p>
        </div>

        {/* 🌱 Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white">Quick Links</h3>
          <ul className="mt-3 space-y-2">
            <li className="hover:text-green-400 cursor-pointer duration-200">Home</li>
            <li className="hover:text-green-400 cursor-pointer duration-200">About</li>
            <li className="hover:text-green-400 cursor-pointer duration-200">Products</li>
            <li className="hover:text-green-400 cursor-pointer duration-200">Contact</li>
          </ul>
        </div>

        {/* 🍎 Categories */}
        <div>
          <h3 className="text-lg font-semibold text-white">Categories</h3>
          <ul className="mt-3 space-y-2">
            <li className="hover:text-green-400 cursor-pointer duration-200">Vegetables</li>
            <li className="hover:text-green-400 cursor-pointer duration-200">Fruits</li>
            <li className="hover:text-green-400 cursor-pointer duration-200">Dairy Items</li>
            <li className="hover:text-green-400 cursor-pointer duration-200">Organic Foods</li>
          </ul>
        </div>

        {/* 🔥 Image Section (Newsletter area replaced) */}
        <div>
          

          <div className="
      flex justify-center items-center
      hover:scale-[1.08] duration-300 
  ">
            <img
              src="/assets/banner/icon.png"
              alt="store-image"
              className="w-36 md:w-40 object-contain"
            />
          </div>

          <p className="text-gray-400 text-xs mt-3 text-center">
            Visit us for fresh organic groceries.
          </p>
        </div>


      </div>

      {/* BOTTOM SECTION */}
      <div className="border-t border-gray-800 mt-12 pt-6 px-8 md:px-20 flex flex-col md:flex-row justify-between text-sm text-gray-400">
        <p>© 2025 GreenBasket — All Rights Reserved.</p>

        <div className="flex gap-4 mt-4 md:mt-0">
          <span className="hover:text-white cursor-pointer">Privacy Policy</span>
          <span className="hover:text-white cursor-pointer">Terms & Conditions</span>
          <span className="hover:text-white cursor-pointer">Help</span>
        </div>
      </div>
    </footer>
  );
}
