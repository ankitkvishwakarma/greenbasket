import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

/******** USER UI ********/
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import HeroSection from "./Components/HeroSection";
import FeaturedCategories from "./Components/FeaturedCategories";
import ProductGrid from "./Components/ProductGrid";
import OffersBanner from "./Components/OffersBanner";
import SuperMarketBanner from "./Components/SuperMarketBanner";
import Testimonials from "./Components/Testimonials";
import AdvancedBannerSlider from "./Components/AdvancedBannerSlider";
import ContactUs from "./Components/ContactUs";
import BlogSection from "./Components/Blogs";
import VegetablesPage from "./Components/VegetablesPage";
import FruitsPage from "./Components/FruitsPage";
import UserProfile from "./Components/Userprofile";
import Success from "./Components/Auth/Success";

/******** AUTH SCREENS ********/
import Login from "./Components/Auth/Login";
import Signup from "./Components/Auth/Signup";
import ForgotPassword from "./Components/Auth/ForgotPassword";
import AdminLogin from "./Components/Auth/AdminLogin";

/******** SECURITY MIDDLEWARE ********/
import ProtectedRoute from "./Components/Auth/ProtectedRoute";
import AdminRoute from "./Components/Auth/AdminRoute";

/******** ADMIN PAGES ********/
import AdminDashboard from "./Components/Admin/AdminDashboard";
import ManageProducts from "./Components/Admin/ManageProducts";
import AddProduct from "./Components/Admin/AddProduct";
import EditProduct from "./Components/Admin/EditProduct";
import Orders from "./Components/Admin/Orders";
import AdminSales from "./Components/Admin/AdminSales";
import DeliveryBoyList from "./Components/Admin/DeliveryBoyList";
import AddDeliveryBoy from "./Components/Admin/AddDeliveryBoy";
import AssignOrder from "./Components/Admin/AssignOrder";
import DeliveryHistory from "./Components/Admin/DeliveryHistory";
import DeliveryMap from "./Components/Admin/DeliveryMap";
import RatingsSalary from "./Components/Admin/RatingsSalary";
import AssignOrderModal from "./Components/Admin/AssignOrderModal";




/******** HIDE NAV+FOOTER ********/
function LayoutControl({ children }) {
  const { pathname } = useLocation();

  // JIN ROUTES PAR NAVBAR/FOOTER HIDE HOGA 👇
  const AUTH_PAGES = ["/login", "/signup", "/forgot", "/admin/login"];
  const isAdmin = pathname.startsWith("/admin");  // FULL ADMIN UI HIDE

  const hideUI = AUTH_PAGES.includes(pathname) || isAdmin;

  return (
    <>
      {!hideUI && <Navbar />}
      {children}
      {!hideUI && <Footer />}
    </>
  );
}


export default function App() {

  useEffect(() => {
    document.documentElement.classList.toggle("dark", localStorage.getItem("ui-theme") === "dark");
  }, []);

  return (
    <BrowserRouter>
      <LayoutControl>

        <Routes>

          {/* 🔐 AUTH SCREENS */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signup-success" element={<Success />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* 🏠 HOME */}
          <Route path="/" element={
            <>
              <HeroSection />
              <FeaturedCategories />
              <ProductGrid />
              <OffersBanner />
              <SuperMarketBanner />
              <Testimonials />
              <AdvancedBannerSlider />
            </>
          } />

          {/* 🌍 PUBLIC */}
          <Route path="/vegetables" element={<VegetablesPage />} />
          <Route path="/fruits" element={<FruitsPage />} />
          <Route path="/blog" element={<BlogSection />} />
          <Route path="/contact" element={<ContactUs />} />

          {/* 👤 USER PROTECTED */}

          <Route path="/userprofile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
          

          {/* 🛡 ADMIN PROTECTED */}
          <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/products" element={<AdminRoute><ManageProducts /></AdminRoute>} />
          <Route path="/admin/add-product" element={<AdminRoute><AddProduct /></AdminRoute>} />
          <Route path="/admin/edit/:id" element={<AdminRoute><EditProduct /></AdminRoute>} />
          <Route path="/admin/delivery/:id/history" element={<AdminRoute><DeliveryHistory /></AdminRoute>} />
          <Route path="/admin/delivery/assign/:id" element={<AdminRoute><AssignOrderModal /></AdminRoute>} />
          <Route path="/admin/delivery/:id/map" element={<AdminRoute><DeliveryMap /></AdminRoute>} />
          <Route path="/admin/delivery/:id/pay" element={<AdminRoute><RatingsSalary /></AdminRoute>} />
          <Route path="/admin/orders" element={<AdminRoute><Orders /></AdminRoute>} />
          <Route path="/admin/sales" element={<AdminRoute><AdminSales /></AdminRoute>} />
          <Route path="/admin/delivery" element={<AdminRoute><DeliveryBoyList /></AdminRoute>} />
          <Route path="/admin/delivery/add" element={<AdminRoute><AddDeliveryBoy /></AdminRoute>} />
          <Route path="/admin/delivery/assign/:id" element={<AdminRoute><AssignOrder /></AdminRoute>} />


        </Routes>

      </LayoutControl>
    </BrowserRouter>
  );
}
