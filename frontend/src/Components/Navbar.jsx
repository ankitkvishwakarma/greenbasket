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
  const searchRef = useRef(null);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

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
    hideTimeout.current = setTimeout(() => setDropdownOpen(false), 150);
  }

  useEffect(() => {
    async function fetchUser() {
      try {
        const { data } = await API.get("/auth/me");
        setUser(data.user);
      } catch {}
    }
    if (isLoggedIn) fetchUser();
  }, [isLoggedIn]);

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

  useEffect(() => {
    function clickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

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
      setResults(res.data.products || []);
      setShowResults(true);
    } catch {
      setResults([]);
      setShowResults(true);
    }
  }

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem("ui-theme", next ? "dark" : "light");
    document.documentElement.classList.toggle("dark", next);
  };

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
        ${isAtTop ? "bg-transparent" : "backdrop-blur-xl bg-white/30 dark:bg-black/40 shadow-lg"}
      `}
      >
        <div className={`flex items-center justify-between px-4 md:px-8 ${isShrunk ? "py-2" : "py-4"}`}>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="md:hidden text-3xl text-gray-700 dark:text-gray-200"
          >
            ☰
          </button>

          {/* LOGO */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <motion.div animate={isShrunk ? { scale: 0.9 } : { scale: 1 }} className="flex items-center gap-3">
              <img src={icon} className={`${isShrunk ? "w-8 h-8" : "w-10 h-10"} rounded-md`} />
              <span className="font-bold text-lg text-gray-900 dark:text-white">GreenBasket</span>
            </motion.div>
          </div>

          {/* MENU (DESKTOP ONLY) */}
          <nav className="hidden md:flex gap-8">
            {MENU_ITEMS.map((m, i) => (
              <Link key={i} to={m.path} className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white">
                {m.label}
              </Link>
            ))}
          </nav>

          {/* ACTIONS */}
          <div className="flex items-center gap-6">

            {/* DESKTOP SEARCH */}
            <div ref={searchRef} className="relative hidden md:flex items-center">
              <input
                type="text"
                value={query}
                onChange={handleSearch}
                placeholder="Search..."
                className="px-3 py-2 rounded-lg bg-white/20 dark:bg-black/20 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-200 pr-10 backdrop-blur-md outline-none"
              />

              <button
                onClick={() => results[0] && navigate(`/product/${results[0]._id}`)}
                className="absolute right-2 text-lg"
              >
                🔍
              </button>

              {showResults && (
                <div className="absolute top-12 w-full bg-white dark:bg-gray-900 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
                  {results.length === 0 ? (
                    <div className="p-3 text-red-500">❌ No products found</div>
                  ) : (
                    results.map((item) => (
                      <div
                        key={item._id}
                        onClick={() => navigate(`/product/${item._id}`)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer flex items-center gap-3"
                      >
                        <img src={item.images?.[0]} className="w-8 h-8 rounded object-cover" />
                        {item.name}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* MOBILE SEARCH ICON */}
            <button onClick={() => setMobileSearchOpen(true)} className="md:hidden text-2xl">
              🔍
            </button>

            {/* LOGIN (DESKTOP ONLY) */}
            {!isLoggedIn && (
              <Link
                to="/login"
                className="px-7 py-2.5 rounded-xl font-semibold bg-gradient-to-r from-lime-400 to-green-500 shadow-lg hover:scale-105 text-black hidden md:block"
              >
                Login
              </Link>
            )}

            {/* CART */}
            {isLoggedIn && (
              <div ref={cartRef} onClick={() => navigate("/cart")} className="relative cursor-pointer text-2xl">
                🛒
                {count > 0 && (
                  <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs px-2 py-0.5 rounded-full">
                    {count}
                  </span>
                )}
              </div>
            )}

            {/* PROFILE DROPDOWN */}
            {isLoggedIn && (
              <div className="relative" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
                <img
                  src={user?.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                  className="w-10 h-10 rounded-full border-2 border-green-500 cursor-pointer"
                />

                {dropdownOpen && (
                  <div className="absolute right-0 top-12 bg-white dark:bg-gray-900 w-44 rounded-lg shadow-lg p-3">
                    {role !== "ADMIN" && (
                      <Link to="/userprofile" className="block py-2 hover:text-green-500">
                        My Profile
                      </Link>
                    )}
                    {role === "ADMIN" && (
                      <Link to="/admin/dashboard" className="block py-2 hover:text-yellow-500">
                        Admin Dashboard
                      </Link>
                    )}
                    <button onClick={() => setLogoutPopup(true)} className="w-full text-left py-2 text-red-500">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* MOBILE LOGIN BUTTON (INSIDE DRAWER ONLY) */}

            {/* DARK MODE */}
            <button onClick={toggleTheme} className="p-2 rounded-full border bg-white/10 dark:bg-black/20">
              {isDark ? "🌞" : "🌙"}
            </button>
          </div>
        </div>
      </motion.header>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 180, damping: 20 }}
            className="fixed top-0 left-0 w-[75%] h-full bg-white dark:bg-gray-900 shadow-xl z-[999]"
          >
            <div className="p-5">
              <button onClick={() => setDrawerOpen(false)} className="text-3xl mb-6">✖</button>

              {MENU_ITEMS.map((m) => (
                <Link
                  key={m.path}
                  to={m.path}
                  onClick={() => setDrawerOpen(false)}
                  className="block py-3 text-lg text-gray-800 dark:text-gray-200"
                >
                  {m.label}
                </Link>
              ))}

              {!isLoggedIn && (
                <button
                  onClick={() => {
                    navigate("/login");
                    setDrawerOpen(false);
                  }}
                  className="block w-full text-left py-3 text-green-500 font-bold"
                >
                  Login
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MOBILE SEARCH PANEL */}
      <AnimatePresence>
        {mobileSearchOpen && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-xl z-[1000]"
          >
            <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-3xl p-6 shadow-xl">
              <div className="flex items-center gap-3">
                <button onClick={() => setMobileSearchOpen(false)} className="text-2xl">✖</button>

                <input
                  autoFocus
                  value={query}
                  onChange={handleSearch}
                  placeholder="Search..."
                  className="flex-1 px-4 py-3 rounded-2xl bg-gray-100 dark:bg-gray-800 outline-none shadow-inner"
                />
              </div>

              <div className="max-h-[60vh] mt-4 overflow-y-auto">
                {results.length === 0 ? (
                  <div className="text-center text-red-500 py-6">❌ No products found</div>
                ) : (
                  results.map((item) => (
                    <div
                      key={item._id}
                      onClick={() => {
                        setMobileSearchOpen(false);
                        navigate(`/product/${item._id}`);
                      }}
                      className="flex items-center gap-4 p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl cursor-pointer"
                    >
                      <img src={item.images?.[0]} className="w-12 h-12 rounded-lg object-cover" />
                      {item.name}
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LOGOUT POPUP */}
      {logoutPopup && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[2000]">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl w-80 shadow-xl">
            <h2 className="text-lg font-bold mb-3">Logout?</h2>
            <button onClick={logoutNow} className="w-full bg-red-600 text-white py-2 rounded-lg mb-2">Logout</button>
            <button onClick={() => setLogoutPopup(false)} className="w-full bg-gray-200 dark:bg-gray-800 py-2 rounded-lg">Cancel</button>
          </div>
        </div>
      )}
    </>
  );
}
