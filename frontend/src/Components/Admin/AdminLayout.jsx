// src/Components/Admin/AdminLayout.jsx
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function AdminLayout({ title, children }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    navigate("/admin/login");
  };

  const menuItems = [
    { name: "📊 Dashboard", path: "/admin/dashboard" },
    { name: "📦 Products", path: "/admin/products" },
    // { name: "➕ Add Product", path: "/admin/add-product" },   // ⭐ ADDED
    { name: "🛒 Orders", path: "/admin/orders" },
    { name: "🚴 Delivery Boys", path: "/admin/delivery" },
    { name: "💹 Sales & Revenue", path: "/admin/sales" },
  ];

  return (
    <div className="min-h-screen flex bg-[#0b0f19] text-white">

      {/* ==== MOBILE NAVBAR ==== */}
      <div className="lg:hidden flex items-center justify-between px-5 py-4 bg-[#0d1220] border-b border-white/10 shadow-sm fixed w-full z-50">
        <h1 className="text-lg font-bold">Admin Panel</h1>

        <button
          onClick={() => setOpen(true)}
          className="p-2 bg-white/10 rounded-lg border border-white/10"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* ==== SIDEBAR (Desktop) ==== */}
      <motion.aside
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="hidden lg:flex w-64 p-6 flex-col border-r border-white/10 bg-[#0d1220] fixed h-full"
      >
        <Sidebar pathname={pathname} menuItems={menuItems} logout={logout} />
      </motion.aside>

      {/* ==== MOBILE SIDEBAR (Slide) ==== */}
      {open && (
        <motion.div
          initial={{ x: -200 }}
          animate={{ x: 0 }}
          transition={{ type: "spring", stiffness: 120 }}
          className="fixed top-0 left-0 w-64 h-full bg-[#0d1220] p-6 shadow-xl z-50 lg:hidden"
        >
          <button
            onClick={() => setOpen(false)}
            className="absolute top-3 right-3 p-2 rounded-lg bg-white/10 border border-white/10"
          >
            <X size={22} />
          </button>

          <Sidebar pathname={pathname} menuItems={menuItems} logout={logout} />
        </motion.div>
      )}

      {/* ==== MAIN CONTENT ==== */}
      <main className="flex-1 lg:ml-64">
        
        {/* ==== TOP HEADER ==== */}
        <header className="hidden lg:flex w-full px-8 py-5 items-center justify-between border-b border-white/10 bg-[#0d1220]">
          <h1 className="text-xl font-semibold tracking-wide">{title}</h1>

          <div className="flex items-center gap-4">

            {/* ⭐ ADD PRODUCT BUTTON */}
            <button
              onClick={() => navigate("/admin/add-product")}
              className="px-4 py-2 rounded-lg bg-lime-500 text-black font-semibold hover:bg-lime-400"
            >
              + Add Product
            </button>

            <span className="px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-sm">
              Admin
            </span>
          </div>
        </header>

        {/* ==== PAGE BODY ==== */}
        <div className="pt-20 lg:pt-8 px-5 lg:px-8 pb-8">
          {children}
        </div>
      </main>
    </div>
  );
}

/* ---------------------------------------------
   SIDEBAR COMPONENT
---------------------------------------------- */
function Sidebar({ pathname, menuItems, logout }) {
  return (
    <>
      <h1 className="text-[22px] font-extrabold leading-tight">
        GreenBasket
        <span className="text-lime-400 block text-[20px] font-bold">Admin</span>
      </h1>

      <p className="text-[12px] text-slate-400 mt-1 tracking-wide">
        Inventory & orders control panel
      </p>

      <nav className="mt-8 flex flex-col gap-1">
        {menuItems.map((item, i) => (
          <Link
            key={i}
            to={item.path}
            className={`px-4 py-2.5 rounded-lg font-medium transition flex items-center gap-2 ${
              pathname === item.path
                ? "bg-lime-500/10 text-lime-400 border border-lime-500/20"
                : "text-slate-300 hover:bg-white/5"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>

      <button
        onClick={logout}
        className="mt-auto py-2.5 rounded-lg bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30"
      >
        Logout
      </button>
    </>
  );
}
