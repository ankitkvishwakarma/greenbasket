import React from "react";
import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";

export default function SuperMarketBanner() {

  return (
    <section className="relative w-full min-h-[280px] md:min-h-[330px] overflow-hidden flex items-center">

      {/* 🔥 Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute w-full h-full object-cover"
        onError={() => console.log("⚠ Video path STILL WRONG")}
      >
        <source src="/assets/video/suparmarket.mp4" type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-green-700/60 to-transparent backdrop-blur-[2px]"></div>

      {/* Content */}
      <div className="relative z-10 px-6 md:px-12 py-6 text-white max-w-[600px]">

        <motion.div initial={{ opacity: 0, x: -60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9 }}>
          
          <h2 className="text-lg md:text-xl font-medium">
            <Typewriter
              words={["How To Smart Shopping In", "Save More While Buying"]}
              loop={0}
              cursor
              cursorStyle="|"
              typeSpeed={60}
              deleteSpeed={40}
              delaySpeed={1400}
            />
          </h2>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: .3, duration: .9 }}
            className="text-3xl md:text-5xl font-bold mt-1"
          >
            SUPER MARKET
          </motion.h1>

          <p className="mt-2 text-sm md:text-base opacity-90 leading-relaxed">
            Learn the smart way to shop — Save money, pick quality & buy the best.
            Join our live webinar with expert guidance.
          </p>
        </motion.div>

      </div>
    </section>
  );
}
