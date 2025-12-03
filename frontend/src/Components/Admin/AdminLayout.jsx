import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function AdminLayout({ title, children }) {
  const location = useLocation();
  const navigate = useNavigate();

  /* 🔥 MAIN SIDEBAR MENU */
  const menuItems = [
    { label: "Dashboard", path: "/admin/dashboard", icon: "📊" },
    { label: "Products", path: "/admin/products", icon: "📦" },
    { label: "Add Product", path: "/admin/add-product", icon: "➕" },
  ];

  /* 🔥 DELIVERY MANAGEMENT MENU */
  const deliveryMenu = [
    { label: "Delivery Boys", path: "/admin/delivery", icon: "🚴" },
    { label: "Add Delivery Boy", path: "/admin/delivery/add", icon: "➕" },
    { label: "Assign Orders", path: "/admin/delivery/assign", icon: "📨" },
  ];

  const logout = () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("role");
    localStorage.removeItem("admin_token");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen flex bg-slate-900 text-slate-100">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col">
        
        <div className="px-6 py-5 border-b border-slate-800">
          <h1 className="text-xl font-bold tracking-wide">
            GreenBasket <span className="text-lime-400">Admin</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Inventory & orders control panel
          </p>
        </div>

        {/* MENU LIST */}
        <nav className="flex-1 px-3 py-4 space-y-1">

          {/* MAIN MENU */}
          {menuItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition
                  ${
                    active
                      ? "bg-lime-500/20 text-lime-300 border border-lime-500/40"
                      : "text-slate-300 hover:bg-slate-800/80"
                  }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}

          {/* SECTION TITLE */}
          <p className="text-xs text-slate-500 mt-5 mb-1 px-3">
            DELIVERY MANAGEMENT
          </p>

          {/* DELIVERY MENU */}
          {deliveryMenu.map((item) => {
            const active = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition
                  ${
                    active
                      ? "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                      : "text-slate-300 hover:bg-slate-800/80"
                  }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* LOGOUT SECTION */}
        <div className="px-4 py-4 border-t border-slate-800 text-xs text-slate-400">
          <button
            onClick={logout}
            className="w-full mb-3 text-sm font-semibold text-red-400 border border-red-500/40 rounded-lg py-2 hover:bg-red-500/10 transition"
          >
            Logout
          </button>
          © {new Date().getFullYear()} GreenBasket
        </div>

      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col">
        
        {/* TOP BAR */}
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-900/80 backdrop-blur">
          <h2 className="text-lg font-semibold">{title}</h2>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="hidden sm:inline">Admin Panel</span>
            <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-200">
              Admin
            </span>
          </div>
        </header>

        {/* CONTENT SLOT */}
        <div className="flex-1 overflow-y-auto bg-slate-900 p-6">
          {children}
        </div>

      </main>

    </div>
  );
}
