import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const searchRef = useRef(null);

  const [isAtTop, setIsAtTop] = useState(true);
  const [visible, setVisible] = useState(true);
  const [isShrunk, setIsShrunk] = useState(false);
  const lastScrollY = useRef(0);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const hideTimeout = useRef(null);

  function handleEnter() {
    clearTimeout(hideTimeout.current);
    setDropdownOpen(true);
  }

  function handleLeave() {
    hideTimeout.current = setTimeout(() => setDropdownOpen(false), 200);
  }

  /* LOAD USER */
  useEffect(() => {
    async function fetchUser() {
      try {
        const { data } = await API.get("/auth/me");
        setUser(data.user);
      } catch {}
    }
    if (isLoggedIn) fetchUser();
  }, [isLoggedIn]);

  /* SCROLL EFFECT */
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

  /* OUTSIDE CLICK (DESKTOP SEARCH CLOSE) */
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* iOS STYLE SEARCH - ESC CLOSE */
  useEffect(() => {
    const closeOnEsc = (e) => {
      if (e.key === "Escape") {
        setMobileSearchOpen(false);
      }
    };
    document.addEventListener("keydown", closeOnEsc);
    return () => document.removeEventListener("keydown", closeOnEsc);
  }, []);

  /* THEME TOGGLE */
  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.add("transition-all", "duration-300");
    localStorage.setItem("ui-theme", next ? "dark" : "light");
    document.documentElement.classList.toggle("dark", next);
  };

  /* SEARCH FUNCTION */
  async function handleSearch(e) {
    const value = e.target.value;
    setQuery(value);

    if (!value.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }

    try {
      const res = await API.get(`/products?search=${value}`);
      const list = res.data.products || [];

      setResults(list);
      setShowResults(true);
    } catch {
      setResults([]);
      setShowResults(true);
    }
  }

  /* LOGOUT */
  function logoutNow() {
    localStorage.clear();
    window.location.href = "/login";
  }

  return (
    <>
      {/* NAVBAR */}
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
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <motion.div
              animate={isShrunk ? { scale: 0.9 } : { scale: 1 }}
              className="flex items-center gap-3"
            >
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

            {/* DESKTOP SEARCH */}
            <div ref={searchRef} className="relative hidden md:flex items-center">
              <input
                type="text"
                placeholder="Search..."
                value={query}
                onChange={handleSearch}
                onFocus={() => query.length > 0 && setShowResults(true)}
                className="px-3 py-2 rounded-lg bg-white/20 dark:bg-black/20 
                border border-gray-300 dark:border-gray-700
                text-gray-800 dark:text-gray-200 backdrop-blur-md 
                outline-none w-48 pr-10"
              />

              {/* 🔍 BUTTON */}
              <button
                onClick={() => {
                  if (results.length > 0) navigate(`/product/${results[0]._id}`);
                }}
                className="absolute right-2 text-lg text-gray-700 dark:text-gray-300"
              >
                🔍
              </button>

              {/* DROPDOWN */}
              {showResults && (
                <div className="absolute top-12 w-full bg-white dark:bg-gray-900 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
                  {results.length === 0 ? (
                    <div className="px-4 py-3 text-red-500 font-semibold">
                      ❌ No products found
                    </div>
                  ) : (
                    results.map((item) => (
                      <div
                        key={item._id}
                        className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer flex items-center gap-3"
                        onClick={() => navigate(`/product/${item._id}`)}
                      >
                        <img src={item.images?.[0]} className="w-8 h-8 rounded object-cover" />
                        <span>{item.name}</span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* MOBILE SEARCH BUTTON */}
            <button
              onClick={() => setMobileSearchOpen(true)}
              className="md:hidden text-2xl text-gray-800 dark:text-gray-300"
            >
              🔍
            </button>

            {/* LOGIN */}
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

            {/* LOGGED IN */}
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

                {/* PROFILE DROPDOWN */}
                <div
                  className="relative"
                  onMouseEnter={handleEnter}
                  onMouseLeave={handleLeave}
                >
                  <img
                    src={user?.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                    className="w-10 h-10 rounded-full cursor-pointer border-2 border-green-500"
                  />

                  {dropdownOpen && (
                    <div className="absolute right-0 top-12 bg-white dark:bg-gray-900 p-3 rounded-md shadow-lg w-44">
                      {role !== "ADMIN" && (
                        <Link to="/userprofile" className="py-2 block hover:text-green-500">
                          My Profile
                        </Link>
                      )}

                      {role === "ADMIN" && (
                        <Link to="/admin/dashboard" className="py-2 block hover:text-yellow-400">
                          Admin Dashboard
                        </Link>
                      )}

                      <button
                        onClick={() => setLogoutPopup(true)}
                        className="text-left py-2 text-red-500 font-semibold w-full"
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

      {/* ⭐ ULTRA PREMIUM iOS STYLE SEARCH PANEL (MOBILE) */}
      <AnimatePresence>
        {mobileSearchOpen && (
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-xl z-[999]"
          >
            {/* Panel */}
            <motion.div
              initial={{ y: 80 }}
              animate={{ y: 0 }}
              exit={{ y: 80 }}
              transition={{ type: "spring", stiffness: 140, damping: 22 }}
              className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-3xl p-6 shadow-2xl max-h-[85vh]"
            >
              {/* Search Bar */}
              <div className="flex items-center gap-3 mb-4">
                <button
                  onClick={() => setMobileSearchOpen(false)}
                  className="text-2xl text-gray-700 dark:text-gray-300"
                >
                  ✖
                </button>

                <input
                  type="text"
                  value={query}
                  onChange={handleSearch}
                  placeholder="Search products..."
                  autoFocus
                  className="flex-1 px-4 py-3 rounded-2xl bg-gray-100 dark:bg-gray-800 
                  text-gray-900 dark:text-gray-200 outline-none shadow-inner"
                />
              </div>

              {/* Suggestions */}
              <div className="overflow-y-auto max-h-[60vh]">
                {results.length === 0 ? (
                  <div className="text-center py-6 text-red-500 font-semibold">
                    ❌ No products found
                  </div>
                ) : (
                  results.map((item) => (
                    <div
                      key={item._id}
                      onClick={() => {
                        navigate(`/product/${item._id}`);
                        setMobileSearchOpen(false);
                      }}
                      className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-100 
                      dark:hover:bg-gray-800 cursor-pointer transition"
                    >
                      <img
                        src={item.images?.[0]}
                        className="w-12 h-12 rounded-lg object-cover shadow"
                      />
                      <span className="text-gray-900 dark:text-gray-200 text-lg">
                        {item.name}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LOGOUT POPUP */}
      {logoutPopup && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl w-80 shadow-xl">
            <h2 className="text-lg font-bold mb-3">Logout?</h2>

            <button
              onClick={logoutNow}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg mb-2"
            >
              Yes, Logout
            </button>

            <button
              onClick={() => setLogoutPopup(false)}
              className="w-full bg-gray-200 dark:bg-gray-800 py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
