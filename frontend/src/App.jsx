import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./Components/Navbar";
import HeroSection from "./Components/HeroSection";
import FeaturedCategories from "./Components/FeaturedCategories";
import Footer from "./Components/Footer";
import OffersBanner from "./Components/OffersBanner";
import Testimonials from "./Components/Testimonials";
import ProductGrid from "./Components/ProductGrid";
import UserProfile from "./Components/Userprofile";
import SuperMarketBanner from "./Components/SuperMarketBanner";
import AdvancedBannerSlider from "./Components/AdvancedBannerSlider";
import ContactUs from "./Components/ContactUs";
import BlogSection from "./Components/Blogs";
export default function App() {

  useEffect(() => {
    const saved = localStorage.getItem("ui-theme");
    if (saved === "dark") document.documentElement.classList.add("dark");
    if (saved === "light") document.documentElement.classList.remove("dark");
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen relative overflow-hidden bg-[#e5f7ee] dark:bg-[#05070c] transition-all">
        
        {/* Glow Effects */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -left-20 w-[350px] h-[350px] bg-green-300 dark:bg-green-500 opacity-40 dark:opacity-10 blur-[120px] rounded-full animate-pulse"/>
          <div className="absolute -top-10 right-0 w-[280px] h-[280px] bg-yellow-300 dark:bg-yellow-600 opacity-30 dark:opacity-10 blur-[130px] rounded-full animate-pulse"/>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-green-400 dark:bg-blue-700 opacity-30 dark:opacity-20 blur-[150px] rounded-full animate-bounce"/>
        </div>

        {/* Main UI Card */}
        <div className="min-h-screen rounded-3xl shadow-2xl mx-4 mt-4 mb-4 overflow-hidden relative z-10 transition-all">

          <Navbar />

          <Routes>

            {/* 🏠 HOME PAGE */}
            <Route 
              path="/" 
              element={
                <>
                  <HeroSection />
                  <FeaturedCategories />
                  <ProductGrid />
                  <OffersBanner />
                  <SuperMarketBanner />
                  <Testimonials />
                  <AdvancedBannerSlider />
                  <Footer />
                </>
              } 
            />

            {/* 👤 USER PROFILE */}
            <Route path="/Userprofile" element={<UserProfile />} />

            {/* 📩 CONTACT PAGE ONLY */}
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/Blog" element={<BlogSection />} />

          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
