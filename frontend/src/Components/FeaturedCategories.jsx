import React from "react";
import { motion } from "framer-motion";
import veg from "../../public/assets/icons/vagetable.png";
import fruits from "../../public/assets/icons/fruites.png";
import milk from "../../public/assets/icons/milk.png";
import house from "../../public/assets/icons/house-hold.png";
import bakery from "../../public/assets/icons/bakery.png";
 

const categories = [
  { title: "Vegetables", count: "32 Products", icon: veg, color: "from-green-400 to-green-600" },
  { title: "Fresh Fruits", count: "48 Products", icon: fruits, color: "from-orange-400 to-red-500" },
  { title: "Milk & Eggs", count: "12 Products", icon: milk, color: "from-blue-400 to-blue-600" },
  { title: "Bakery", count: "62 Products", icon: bakery, color: "from-yellow-400 to-yellow-600" },
  { title: "House Hold", count: "25 Products", icon: house, color: "from-purple-400 to-purple-600" },
  { title: "Dry Fruits", count: "8 Products", icon: "/mnt/data/dryfruits.png", color: "from-amber-400 to-amber-600" }
];

export default function FeaturedCategories() {
  return (
    <div className="py-20 px-4 md:px-20 bg-transparent dark:bg-transparent transition-colors">

      {/* Heading */}
      <div className="text-center mb-14">
        <p className="text-gray-500 dark:text-gray-400">Categories</p>

        <h2 className="text-4xl font-bold text-green-700 dark:text-green-300">
          Featured <span className="text-black dark:text-white">Categories</span>
        </h2>
      </div>

      {/* Categories */}
      <div className="
        grid grid-cols-3 
        sm:grid-cols-3 md:grid-cols-6 
        gap-10 place-items-center
      ">
        {categories.map((item, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.15, y: -10 }}
            transition={{ type: "spring", stiffness: 150, damping: 10 }}
            className="
              relative p-6 cursor-pointer
              w-32 h-32 rounded-3xl
              bg-white/5 dark:bg-white/[0.03]
              backdrop-blur-xl
              shadow-[0_8px_30px_rgba(0,0,0,0.15)]
              dark:shadow-[0_8px_30px_rgba(0,255,200,0.12)]
              border border-white/30 dark:border-white/10
              flex flex-col items-center justify-center
              overflow-hidden
            "
          >

            {/* ROUND GRADIENT GLOW FIXED */}
            <div
              className={`
                absolute inset-0 
                bg-gradient-to-br ${item.color}
                blur-[60px] opacity-40 rounded-3xl
                dark:opacity-20
              `}
            ></div>

            {/* Floating Icon */}
            <motion.img
              src={item.icon}
              alt={item.title}
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="w-12 h-12 relative z-10"
            />

            <h3 className="mt-3 text-sm font-semibold text-gray-900 dark:text-gray-200 relative z-10">
              {item.title}
            </h3>

            <p className="text-xs text-gray-500 dark:text-gray-400 relative z-10">
              {item.count}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
