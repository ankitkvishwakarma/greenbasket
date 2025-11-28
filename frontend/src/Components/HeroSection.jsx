import React from "react";
import { motion } from "framer-motion";
import banner from "../../public/assets/herosection.png";

export default function HeroSection() {
  return (
    <section
      className="
      relative overflow-hidden rounded-3xl mx-3 md:mx-5 mt-4
      min-h-[90vh] flex items-center justify-center
      bg-gradient-to-br from-green-200 to-green-300
      dark:from-[#08121f] dark:to-[#0f192c]
      p-6 sm:p-10 lg:p-16
      shadow-[0_12px_45px_rgba(0,0,0,0.18)]
      dark:shadow-[0_12px_60px_rgba(0,255,160,0.08)]
      transition-all
    "
    >

      {/* Background Glow Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 bg-green-400/25 dark:bg-green-500/10 blur-[120px]" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-yellow-300/25 dark:bg-yellow-500/10 blur-[130px]" />
        <div className="absolute -bottom-10 left-1/3 w-52 h-52 bg-green-200/20 blur-[85px]" />
      </div>

      {/* HERO GRID — MOBILE FIRST */}
      <div
        className="
        max-w-7xl w-full grid 
        grid-cols-1 md:grid-cols-2
        gap-10 sm:gap-14 md:gap-20
        items-center relative z-10
      "
      >

        {/* IMAGE FIRST on Mobile */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="flex justify-center order-1 md:order-none"
        >
          <motion.img
            src={banner}
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
            className="
            w-60 sm:w-72 md:w-96 lg:w-[470px]
            drop-shadow-[0_15px_35px_rgba(0,0,0,0.25)]
            dark:drop-shadow-[0_15px_35px_rgba(0,255,150,0.25)]
            rounded-xl"
          />
        </motion.div>

        {/* TEXT RIGHT ON DESKTOP */}
        <div className="space-y-5 sm:space-y-6 text-center md:text-left">
          <motion.h1
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="
            font-serif font-extrabold 
            text-3xl sm:text-4xl md:text-5xl lg:text-6xl
            text-green-900 dark:text-green-200 leading-tight drop-shadow
          "
          >
            Eat Fresh,
            <br />
            Live <span className="text-green-700 dark:text-green-300">Healthy</span>
          </motion.h1>

          <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base md:text-lg max-w-md mx-auto md:mx-0 leading-relaxed">
            Fresh fruits, vegetables & organic groceries delivered at your door.
          </p>

          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center md:justify-start pt-2">
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="
              bg-black text-white dark:bg-white dark:text-black
              px-7 sm:px-8 py-2.5 sm:py-3 rounded-full
              shadow-lg hover:shadow-[0_0_25px_rgba(0,255,150,0.6)]
              transition text-sm sm:text-base font-medium"
            >
              Order Now
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="
              border border-black dark:border-gray-400
              text-black dark:text-gray-200
              px-7 sm:px-8 py-2.5 sm:py-3 rounded-full
              shadow hover:shadow-lg transition
              text-sm sm:text-base"
            >
              View Menu
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
}
