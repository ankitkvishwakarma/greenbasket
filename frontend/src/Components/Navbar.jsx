import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useFlyToCart } from "../hooks/useFlyToCart";
import { Link, useNavigate } from "react-router-dom";
import icon from "../../public/assets/icons/icon.png";

const MENU_ITEMS = [
  { label: "Menu", path: "/" },
  { label: "Vegetable", path: "/vegetables" },
  { label: "Fruits", path: "/fruits" },
  { label: "Blog", path: "/blog" },
  { label: "Contact Us", path: "/contact" },
];

export default function Navbar() {

  const navigate = useNavigate();
  const { cartRef } = useFlyToCart();

  const isLoggedIn = localStorage.getItem("loggedIn") === "true";
  const role = localStorage.getItem("role");  // ⬅ user / admin detect

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [isDark, setIsDark] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const [visible, setVisible] = useState(true);
  const [isShrunk, setIsShrunk] = useState(false);
  const lastScrollY = useRef(0);


  /* ⬇ Logout function */
  function logoutNow() {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("role");
    navigate("/login");
    window.location.reload();
  }

  /* Scroll effect */
  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      setIsAtTop(y <= 12);
      setVisible(y < lastScrollY.current || y < 80);
      setIsShrunk(y > 60);
      lastScrollY.current = y;
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem("ui-theme", next ? "dark" : "light");
    document.documentElement.classList.toggle("dark", next);
  };


  return (
    <>
      <motion.header
        initial={{ y: 0 }}
        animate={{ y: visible ? 0 : -120 }}
        transition={{ duration: 0.25 }}
        className={`fixed ${isAtTop ? "top-4" : "top-2"} left-1/2 -translate-x-1/2
        w-[96%] md:w-[92%] z-50 rounded-xl transition-all
        ${isAtTop ? "bg-transparent" : "backdrop-blur-xl bg-white/30 dark:bg-black/40 shadow-lg"}`}
      >

        <div className={`flex items-center justify-between px-4 md:px-8 ${isShrunk ? "py-2" : "py-4"}`}>

          {/* LOGO */}
          <div className="flex items-center gap-3">
            <motion.div animate={isShrunk ? { scale: .9 } : { scale: 1 }} className="flex items-center gap-3">
              <img src={icon} className={`${isShrunk ? "w-8 h-8" : "w-10 h-10"} rounded-md`} />
              <span className="font-bold text-lg text-gray-900 dark:text-white">GreenBasket</span>
            </motion.div>
          </div>

          {/* MIDDLE MENU */}
          <nav className="hidden md:flex gap-8">
            {MENU_ITEMS.map((m, i) => (
              <Link key={i} to={m.path}
                className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition">
                {m.label}
              </Link>
            ))}
          </nav>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-4">

            {/* Login button (only when loggedOut) */}
            {!isLoggedIn && (
              <Link to="/login" 
                className="px-7 py-2.5 rounded-xl font-semibold bg-gradient-to-r from-lime-400 to-green-500
                shadow-[0_0_18px_rgba(0,255,120,0.45)] hover:shadow-[0_0_28px_rgba(0,255,120,0.75)]
                transition-all hover:scale-105 text-black">
                Login
              </Link>
            )}

            {/* Logged in navigation */}
            {isLoggedIn && (
              <>
                <div ref={cartRef} className="text-2xl cursor-pointer">🛒</div>

                <div className="relative group">
                  <div className="w-9 h-9 bg-green-500 rounded-full flex justify-center items-center text-white cursor-pointer">
                    {role === "admin" ? "A" : "U"}
                  </div>

                  {/* DROPDOWN */}
                  <div className="hidden group-hover:flex flex-col absolute right-0 top-10
                   bg-white dark:bg-gray-900 text-sm rounded-md shadow-lg p-3 w-40">

                    {/* user profile page */}
                    {role !== "admin" && <Link to="/userprofile" className="py-2 hover:text-green-500">My Profile</Link>}

                    {/* admin panel button */}
                    {role === "admin" && <Link to="/admin/dashboard" className="py-2 hover:text-yellow-400">Admin Dashboard</Link>}

                    <button onClick={logoutNow} className="text-left py-2 text-red-500 font-semibold">
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* THEME */}
            <button onClick={toggleTheme} className="p-2 rounded-full border bg-white/10 dark:bg-black/20">
              {isDark ? "🌞" : "🌙"}
            </button>
          </div>
        </div>
      </motion.header>
    </>
  );
}
