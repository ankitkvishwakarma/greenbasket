import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFlyToCart } from "../hooks/useFlyToCart";
import icon from "../../public/assets/icons/icon.png";

const MENU_ITEMS = [
  { id: "menu", label: "Menu" },
  { id: "about", label: "Vegetable" },
  { id: "locations", label: "Fruits" },
  { id: "resources", label: "Blog" },
  { id: "contact", label: "Contact Us" },
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

// 🔥 Convert search text into URL slug
const toSlug = (text) =>
  text.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [isDark, setIsDark] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const [visible, setVisible] = useState(true);
  const [isShrunk, setIsShrunk] = useState(false);

  const lastScrollY = useRef(0);
  const { cartRef } = useFlyToCart();

  const filtered = SEARCH_DATA.filter((i) =>
    i.toLowerCase().includes(searchText.toLowerCase())
  );

  // NAVBAR SCROLL EFFECT
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

  // THEME
  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem("ui-theme", next ? "dark" : "light");
    document.documentElement.classList.toggle("dark", next);
  };

  return (
    <>
      {/* NAVBAR */}
      <motion.header
        initial={{ y: 0 }}
        animate={{ y: visible ? 0 : -120 }}
        transition={{ duration: 0.25 }}
        className={`fixed ${
          isAtTop ? "top-4" : "top-2"
        } left-1/2 -translate-x-1/2 w-[96%] md:w-[92%] z-50 rounded-xl
        transition-all duration-300 ${
          isAtTop
            ? "bg-transparent"
            : "backdrop-blur-xl bg-white/30 dark:bg-black/40 shadow-lg"
        }`}
      >
        <div
          className={`flex items-center justify-between px-4 md:px-8 ${
            isShrunk ? "py-2" : "py-4"
          }`}
        >
          {/* LEFT — LOGO + HAMBURGER */}
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

          {/* MIDDLE MENU (Desktop Only) */}
          <nav className="hidden md:flex gap-8 items-center">
            {MENU_ITEMS.map((m) => (
              <span
                key={m.id}
                className="cursor-pointer text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white"
              >
                {m.label}
              </span>
            ))}
          </nav>

          {/* RIGHT SECTION — SEARCH + CART + THEME */}
          <div className="flex items-center gap-4 relative">

            {/* 🔍 SEARCH ICON → SHOW ONLY IF SEARCH CLOSED */}
            {!searchOpen && (
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-full border dark:border-gray-600"
              >
                🔍
              </button>
            )}

            {/* INLINE SEARCH INPUT + SEARCH BUTTON */}
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

                {/* 🔎 CLICKABLE SEARCH BUTTON */}
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

                {/* ❌ CLOSE SEARCH */}
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

            {/* CART ICON */}
            <div ref={cartRef} className="text-2xl cursor-pointer">
              🛒
            </div>

            {/* 🌗 THEME TOGGLE */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full border bg-white/10 dark:bg-black/20"
            >
              {isDark ? "🌞" : "🌙"}
            </button>
          </div>
        </div>

        {/* SEARCH DROPDOWN RESULTS */}
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
    </>
  );
}
