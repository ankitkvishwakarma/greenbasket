import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useFlyToCart } from "../hooks/useFlyToCart";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import API from "../../api/axios";
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
  const { count } = useCart();

  const isLoggedIn = localStorage.getItem("loggedIn") === "true";
  const role = localStorage.getItem("role");

  const [user, setUser] = useState(null);
  const [isDark, setIsDark] = useState(false);
  const [logoutPopup, setLogoutPopup] = useState(false);

  // Scroll animation states
  const [isAtTop, setIsAtTop] = useState(true);
  const [visible, setVisible] = useState(true);
  const [isShrunk, setIsShrunk] = useState(false);
  const lastScrollY = useRef(0);

  // ⭐ NEW — Dropdown Delay State
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const hideTimeout = useRef(null);

  function handleEnter() {
    clearTimeout(hideTimeout.current);
    setDropdownOpen(true);
  }

  function handleLeave() {
    hideTimeout.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 300);
  }

  /* ==========================
      LOAD USER AVATAR
  =========================== */
  useEffect(() => {
    async function fetchUser() {
      try {
        const { data } = await API.get("/auth/me");
        setUser(data.user);
      } catch {}
    }

    if (isLoggedIn) fetchUser();
  }, [isLoggedIn]);

  /* ==========================
      SCROLL ANIMATION
  =========================== */
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

  /* ==========================
      THEME TOGGLE
  =========================== */
  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);

    document.documentElement.classList.add("transition-all", "duration-300");

    localStorage.setItem("ui-theme", next ? "dark" : "light");
    document.documentElement.classList.toggle("dark", next);
  };

  /* ==========================
      LOGOUT CONFIRMATION
  =========================== */
  function logoutNow() {
    localStorage.clear();
    window.location.href = "/login";
  }

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
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <motion.div animate={isShrunk ? { scale: .9 } : { scale: 1 }} className="flex items-center gap-3">
              <img src={icon} className={`${isShrunk ? "w-8 h-8" : "w-10 h-10"} rounded-md`} />
              <span className="font-bold text-lg text-gray-900 dark:text-white">GreenBasket</span>
            </motion.div>
          </div>

          {/* MENU */}
          <nav className="hidden md:flex gap-8">
            {MENU_ITEMS.map((m, i) => (
              <Link
                key={i}
                to={m.path}
                className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition"
              >
                {m.label}
              </Link>
            ))}
          </nav>

          {/* ACTION BUTTONS */}
          <div className="flex items-center gap-6">

            {!isLoggedIn && (
              <Link
                to="/login"
                className="px-7 py-2.5 rounded-xl font-semibold bg-gradient-to-r from-lime-400 to-green-500
                shadow-[0_0_18px_rgba(0,255,120,0.45)] hover:shadow-[0_0_28px_rgba(0,255,120,0.75)]
                transition-all hover:scale-105 text-black"
              >
                Login
              </Link>
            )}

            {/* LOGGED-IN */}
            {isLoggedIn && (
              <>
                {/* CART */}
                <div
                  ref={cartRef}
                  onClick={() => navigate("/cart")}
                  className="relative cursor-pointer text-2xl"
                >
                  🛒
                  {count > 0 && (
                    <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs px-2 py-0.5 rounded-full shadow-lg">
                      {count}
                    </span>
                  )}
                </div>

                {/* ⭐ UPDATED DROPDOWN WITH DELAY ⭐ */}
                <div
                  className="relative"
                  onMouseEnter={handleEnter}
                  onMouseLeave={handleLeave}
                >
                  <img
                    src={user?.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                    className="w-10 h-10 rounded-full object-cover cursor-pointer border-2 border-green-500"
                  />

                  {dropdownOpen && (
                    <div className="flex flex-col absolute right-0 top-12
                      bg-white dark:bg-gray-900 text-sm rounded-md shadow-lg p-3 w-44 transition-all duration-200">

                      {role !== "ADMIN" && (
                        <Link to="/userprofile" className="py-2 hover:text-green-500">
                          My Profile
                        </Link>
                      )}

                      {role === "ADMIN" && (
                        <Link to="/admin/dashboard" className="py-2 hover:text-yellow-400">
                          Admin Dashboard
                        </Link>
                      )}

                      <button
                        onClick={() => setLogoutPopup(true)}
                        className="text-left py-2 text-red-500 font-semibold"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* THEME BUTTON */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full border bg-white/10 dark:bg-black/20"
            >
              {isDark ? "🌞" : "🌙"}
            </button>
          </div>
        </div>
      </motion.header>

      {/* LOGOUT POPUP */}
      {logoutPopup && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl w-80 shadow-xl">
            <h2 className="text-lg font-bold mb-3 text-gray-900 dark:text-gray-100">
              Logout?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to logout?
            </p>

            <button
              onClick={logoutNow}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg mb-2"
            >
              Yes, Logout
            </button>

            <button
              onClick={() => setLogoutPopup(false)}
              className="w-full bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
