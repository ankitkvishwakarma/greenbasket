import React from "react";
import { motion } from "framer-motion";
import banner from "../../public/assets/herosection.png";

export default function HeroSection() {
  return (
    <div
      className="
  pt-16     
  min-h-[90vh] 
  relative
  overflow-hidden
  flex items-center justify-center 
  bg-gradient-to-br 
  from-green-100 to-green-300 
  dark:from-[#0a0f1e] dark:to-[#111827]
  p-10 rounded-3xl mt-2 mx-4   <!-- mt कम कर दिया -->
  shadow-[0_8px_40px_rgba(0,0,0,0.15)]
  dark:shadow-[0_8px_40px_rgba(255,255,255,0.08)]
  transition-colors
  "
    >


      {/* FLOATING GLOW EFFECT (Dark Mode) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-10 -left-10 w-72 h-72 bg-green-300 opacity-25 dark:bg-green-400 dark:opacity-10 blur-[100px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-yellow-300 opacity-20 dark:bg-yellow-500 dark:opacity-10 blur-[100px] rounded-full animate-pulse"></div>
      </div>

      {/* CONTENT GRID */}
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-20 items-center relative z-10">

        {/* LEFT CONTENT */}
        <div className="space-y-8">

          {/* HEADING */}
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="
              text-5xl md:text-6xl font-serif font-bold leading-tight
              text-green-900 dark:text-green-200
              drop-shadow-sm dark:drop-shadow-[0_0_20px_rgba(0,255,160,0.2)]
            "
          >
            FUEL Your day <br />
            the <span className="text-green-700 dark:text-green-300">HEALTHY</span> way
          </motion.h1>

          {/* SUBTEXT */}
          <p className="text-gray-700 dark:text-gray-300 max-w-md text-lg leading-relaxed">
            Discover our customizable salads and bowls made from the freshest
            ingredients, sourced from local farms.
          </p>

          {/* BUTTONS */}
          <div className="flex gap-4 items-center pt-4">
            {/* Primary Button */}
            <motion.button
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.95 }}
              className="
                bg-black text-white 
                dark:bg-white dark:text-black
                px-8 py-3 rounded-full text-lg font-medium
                shadow-lg hover:shadow-xl 
                transition
              "
            >
              Order Food
            </motion.button>

            {/* Secondary Button */}
            <motion.button
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.95 }}
              className="
                bg-white dark:bg-transparent 
                border dark:border-gray-500 
                dark:text-gray-200
                px-8 py-3 rounded-full text-lg font-medium
                shadow hover:shadow-lg transition
              "
            >
              View Menu
            </motion.button>
          </div>

        </div>

        {/* RIGHT IMAGE with FLOAT ANIMATION */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="relative flex justify-center"
        >
          <motion.img
            src={banner}
            alt="Healthy Food"
            animate={{ y: [0, -12, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="
              rounded-2xl 
              w-full max-w-lg 
              drop-shadow-[0_20px_40px_rgba(0,0,0,0.25)]
              dark:drop-shadow-[0_15px_35px_rgba(255,255,255,0.18)]
              transition
            "
          />
        </motion.div>

      </div>
    </div>
  );
}
