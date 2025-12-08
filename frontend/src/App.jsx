import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "./context/CartContext";

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
import CartPage from "./Components/CartPage";
import ChangePassword from "./Components/Auth/ChangePassword";

/******** AUTH ********/
import Login from "./Components/Auth/Login";
import Signup from "./Components/Auth/Signup";
import ForgotPassword from "./Components/Auth/ForgotPassword";
import AdminLogin from "./Components/Auth/AdminLogin";

/******** SECURITY ********/
import ProtectedRoute from "./Components/Auth/ProtectedRoute";
import AdminRoute from "./Components/Auth/AdminRoute";

/******** ADMIN PAGES ********/
import AdminDashboard from "./Components/Admin/AdminDashboard";
import ManageProducts from "./Components/Admin/ManageProducts";
import AddProduct from "./Components/Admin/AddProduct";
import EditProduct from "./Components/Admin/EditProduct";

import Orders from "./Components/Admin/Orders";
import AdminOrderDetails from "./Components/Admin/AdminOrderDetails";
import AdminOrderUpdate from "./Components/Admin/AdminOrderUpdate";

import AdminSales from "./Components/Admin/AdminSales";

import DeliveryBoyList from "./Components/Admin/DeliveryBoyList";
import DeliveryProfile from "./Components/Admin/DeliveryProfile";
import DeliveryHistory from "./Components/Admin/DeliveryHistory";
import DeliveryMap from "./Components/Admin/DeliveryMap";
import RatingsSalary from "./Components/Admin/RatingsSalary";
import AdminDeliveryAssign from "./Components/Admin/AdminDeliveryAssign";

import EmployeeList from "./Components/Admin/EmployeeList";

/******** HIDE NAV+FOOTER ********/
function LayoutControl({ children }) {
  const { pathname } = useLocation();

  const AUTH_PAGES = ["/login", "/signup", "/forgot", "/admin/login"];
  const isAdmin = pathname.startsWith("/admin");

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
    document.documentElement.classList.toggle(
      "dark",
      localStorage.getItem("ui-theme") === "dark"
    );
  }, []);

  return (
    <CartProvider>
      <BrowserRouter>
        <LayoutControl>

          <Routes>

            {/* 🔐 AUTH */}
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
            <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
            <Route path="/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />

            {/* 🛡 ADMIN PANEL */}			

            {/* Dashboard */}
            <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

            {/* Products */}
            <Route path="/admin/products" element={<AdminRoute><ManageProducts /></AdminRoute>} />
            <Route path="/admin/add-product" element={<AdminRoute><AddProduct /></AdminRoute>} />
            <Route path="/admin/products/:id/edit" element={<AdminRoute><EditProduct /></AdminRoute>} />

            {/* Orders */}
            <Route path="/admin/orders" element={<AdminRoute><Orders /></AdminRoute>} />
            <Route path="/admin/orders/:id" element={<AdminRoute><AdminOrderDetails /></AdminRoute>} />
            <Route path="/admin/orders/update/:id" element={<AdminRoute><AdminOrderUpdate /></AdminRoute>} />

            {/* Sales */}
            <Route path="/admin/sales" element={<AdminRoute><AdminSales /></AdminRoute>} />

            {/* Delivery */}
            <Route path="/admin/delivery" element={<AdminRoute><DeliveryBoyList /></AdminRoute>} />
            <Route path="/admin/delivery/:id" element={<AdminRoute><DeliveryProfile /></AdminRoute>} />
            <Route path="/admin/delivery/:id/history" element={<AdminRoute><DeliveryHistory /></AdminRoute>} />
            <Route path="/admin/delivery/:id/map" element={<AdminRoute><DeliveryMap /></AdminRoute>} />
            <Route path="/admin/delivery/:id/pay" element={<AdminRoute><RatingsSalary /></AdminRoute>} />
            <Route path="/admin/delivery/assign/:orderId" element={<AdminRoute><AdminDeliveryAssign /></AdminRoute>} />

            {/* Employees */}
            <Route path="/admin/employees" element={<AdminRoute><EmployeeList /></AdminRoute>} />

          </Routes>

        </LayoutControl>
      </BrowserRouter>
    </CartProvider>
  );
}
