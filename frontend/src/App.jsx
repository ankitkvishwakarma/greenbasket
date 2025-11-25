import React from "react";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import FeaturedCategories from "./components/FeaturedCategories";
import Footer from "./components/Footer";
import OffersBanner from "./components/OffersBanner";
import Testimonials from "./components/Testimonials";
import ProductGrid from "./components/ProductGrid";

export default function App() {


  useEffect(() => {
    const saved = localStorage.getItem("ui-theme");
    if (saved === "dark") document.documentElement.classList.add("dark");
    if (saved === "light") document.documentElement.classList.remove("dark");
  }, []);
  return (
    <div
      className="
        min-h-screen 
        relative 
        overflow-hidden
        bg-[#e5f7ee] dark:bg-[#05070c]
        transition-all
      "
    >

      {/* PREMIUM GLOW EFFECTS */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        {/* TOP LEFT GLOW */}
        <div
          className="
            absolute -top-20 -left-20 
            w-[350px] h-[350px]
            bg-green-300 dark:bg-green-500
            opacity-40 dark:opacity-10
            blur-[120px] rounded-full
            animate-pulse
          "
        />

        {/* TOP RIGHT GLOW */}
        <div
          className="
            absolute -top-10 right-0 
            w-[280px] h-[280px]
            bg-yellow-300 dark:bg-yellow-600
            opacity-30 dark:opacity-10
            blur-[130px] rounded-full
            animate-pulse
          "
        />

        {/* BOTTOM CENTER GLOW */}
        <div
          className="
            absolute bottom-0 left-1/2 -translate-x-1/2 
            w-[400px] h-[400px]
            bg-green-400 dark:bg-blue-700
            opacity-30 dark:opacity-20
            blur-[150px] rounded-full
            animate-bounce
          "
        />
      </div>

      {/* ROUNDED MAIN CONTENT CARD */}
      <div
        className="
          min-h-screen
         
          rounded-3xl
          shadow-2xl 
          mx-4 mt-4 mb-4
          overflow-hidden
          relative z-10
          transition-all
        "
      >
        <Navbar />
        <HeroSection />
        <FeaturedCategories />
        <ProductGrid />
        <OffersBanner/>
        <Testimonials/>
        <Footer/>
      </div>
    </div>
  );
}  