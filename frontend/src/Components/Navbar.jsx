import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFlyToCart } from "../hooks/useFlyToCart";
import { useNavigate } from "react-router-dom";
import icon from "../../public/assets/icons/icon.png";
import { Link } from "react-router-dom";

import PopupCard from "./Popupcard";
import LoginPopup from "../pages/LoginPopup";
import SignupPopup from "../pages/SignupPopup";

const MENU_ITEMS = [
  { id: "menu", label: "Menu", path: "/" },
  { id: "about", label: "Vegetable", path: "/vegetables" },
  { id: "locations", label: "Fruits", path: "/fruits" },
  { id: "resources", label: "Blog", path: "/blog" },
  { id: "contact", label: "Contact Us", path: "/contact" },  // 👈 Yahi se navigate hoga
];

const SEARCH_DATA = [
  "Fresh Fruits",
  "Vegetables",
  "Milk & Eggs",
  "Dry Fruits",
  "Household Items",
  "Bakery",
  "Snacks",
  "Beverages",
  "Organic Products",
];

const toSlug = (text) =>
  text.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");

export default function Navbar() {
  const navigate = useNavigate();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  // ⭐ POPUP STATES
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  const [isDark, setIsDark] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const [visible, setVisible] = useState(true);
  const [isShrunk, setIsShrunk] = useState(false);

  const lastScrollY = useRef(0);
  const { cartRef } = useFlyToCart();

  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("loggedIn") === "true"
  );

  const filtered = SEARCH_DATA.filter((i) =>
    i.toLowerCase().includes(searchText.toLowerCase())
  );

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
        className={`fixed ${isAtTop ? "top-4" : "top-2"
          } left-1/2 -translate-x-1/2 w-[96%] md:w-[92%] z-50 rounded-xl
        transition-all duration-300 ${isAtTop
            ? "bg-transparent"
            : "backdrop-blur-xl bg-white/30 dark:bg-black/40 shadow-lg"
          }`}
      >
        <div
          className={`flex items-center justify-between px-4 md:px-8 ${isShrunk ? "py-2" : "py-4"
            }`}
        >
          {/* LEFT SECTION */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDrawerOpen(true)}
              className="p-2 rounded-md hover:bg-white/30 dark:hover:bg-white/10 md:hidden"
            >
              ☰
            </button>

            <motion.div
              animate={isShrunk ? { scale: 0.9 } : { scale: 1 }}
              className="flex items-center gap-3"
            >
              <img
                src={icon}
                className={`${isShrunk ? "w-8 h-8" : "w-10 h-10"} rounded-md`}
              />
              <span className="font-bold text-lg text-gray-900 dark:text-white">
                GreenBasket
              </span>
            </motion.div>
          </div>

          {/* MIDDLE MENU */}
          <nav className="hidden md:flex gap-8 items-center">
            {MENU_ITEMS.map((m) => (
              <Link
                key={m.id}
                to={m.path}
                className="cursor-pointer text-gray-700 dark:text-gray-300 
                 hover:text-black dark:hover:text-white transition"
              >
                {m.label}
              </Link>
            ))}
          </nav>

          {/* RIGHT SECTION */}
          <div className="flex items-center gap-4 relative">

            {!searchOpen && (
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-full border dark:border-gray-600"
              >
                🔍
              </button>
            )}

            {searchOpen && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "200px", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="flex items-center bg-white dark:bg-gray-800 border dark:border-gray-700 px-3 py-1 rounded-full"
              >
                <input
                  autoFocus
                  className="bg-transparent outline-none text-gray-900 dark:text-white w-full"
                  placeholder="Search..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />

                <button
                  onClick={() => {
                    if (searchText.trim().length > 0) {
                      const slug = toSlug(searchText);
                      window.location.href = `/search/${slug}`;
                    }
                  }}
                  className="ml-2 text-xl"
                >
                  🔎
                </button>

                <button
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchText("");
                  }}
                  className="ml-2"
                >
                  ❌
                </button>
              </motion.div>
            )}

            {/* LOGIN BUTTON → NOW OPENS POPUP */}
            {!isLoggedIn && (
              // <button
              //   onClick={() => setShowLogin(true)}
              //   className="px-4 py-2 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition"
              // >
              //   Login
              // </button>
              <button
                onClick={() => setShowLogin(true)}
                className="
    group relative px-7 py-2.5 rounded-xl 
    font-semibold text-black
    bg-gradient-to-r from-lime-400 to-green-500
    shadow-[0_0_22px_rgba(0,255,120,0.5)]
    hover:shadow-[0_0_30px_rgba(0,255,140,0.8)]
    transition-all duration-300
    overflow-hidden
    hover:-translate-y-0.5
  "
              >
                {/* Animated Diagonal Shine */}
                <span
                  className="
      absolute inset-0 
      bg-gradient-to-r from-white/10 via-white/40 to-white/10 
      -translate-x-full group-hover:translate-x-full
      transition-transform duration-700 
      skew-x-12
    "
                ></span>

                {/* Soft Prism Inner Glow */}
                <span className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/10 to-transparent opacity-30"></span>

                {/* Neon Aura Pulse */}
                <span className="absolute -inset-1 rounded-xl border border-green-300/40 blur-sm opacity-40"></span>

                <span className="relative z-10 tracking-wide font-bold text-black">
                  Login
                </span>
              </button>


            )}

            {/* CART */}
            {isLoggedIn && (
              <div ref={cartRef} className="text-2xl cursor-pointer">
                🛒
              </div>
            )}

            {/* PROFILE */}
            {isLoggedIn && (
              <div
                className="w-9 h-9 cursor-pointer rounded-full bg-green-500 flex justify-center items-center text-white text-lg font-bold"
                onClick={() => alert("Profile Clicked!")}
              >
                P
              </div>
            )}

            {/* THEME */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full border bg-white/10 dark:bg-black/20"
            >
              {isDark ? "🌞" : "🌙"}
            </button>
          </div>
        </div>

        {/* SEARCH DROPDOWN */}
        {searchOpen && searchText && (
          <div className="bg-white dark:bg-gray-900 shadow-xl rounded-xl mx-6 mt-2 p-3 max-h-60 overflow-auto">
            {filtered.length > 0 ? (
              filtered.map((item, i) => {
                const slug = toSlug(item);
                return (
                  <a
                    key={i}
                    href={`/${slug}`}
                    className="block p-2 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
                  >
                    {item}
                  </a>
                );
              })
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No results found
              </p>
            )}
          </div>
        )}
      </motion.header>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.45 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 bg-black/40 z-40"
            />

            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              className="fixed top-0 left-0 w-64 h-full z-50 p-6 bg-white dark:bg-gray-900 shadow-xl"
            >
              <h2 className="text-xl font-semibold mb-4 dark:text-white">
                Menu
              </h2>

              {MENU_ITEMS.map((m) => (
                <p
                  key={m.id}
                  className="text-gray-800 dark:text-gray-200 text-lg py-2"
                >
                  {m.label}
                </p>
              ))}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ⭐ LOGIN POPUP */}
      <PopupCard open={showLogin} onClose={() => setShowLogin(false)}>
        <LoginPopup
          switchToSignup={() => {
            setShowLogin(false);
            setShowSignup(true);
          }}
        />
      </PopupCard>

      {/* ⭐ SIGNUP POPUP */}
      <PopupCard open={showSignup} onClose={() => setShowSignup(false)}>
        <SignupPopup
          switchToLogin={() => {
            setShowSignup(false);
            setShowLogin(true);
          }}
        />
      </PopupCard>
    </>
  );
}
