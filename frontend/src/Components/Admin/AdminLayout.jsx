// src/Components/Admin/AdminLayout.jsx

import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Bell } from "lucide-react";
import socket from "../../socket";

export default function AdminLayout({ title, children }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  // ================================
  // NOTIFICATION STATES
  // ================================
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [notificationOpen, setNotificationOpen] = useState(false);

  // ================================
  // SOCKET.IO ADMIN NOTIFICATIONS
  // ================================
  useEffect(() => {
    // Connect socket if disconnected
    if (!socket.connected) {
      socket.connect();
    }

    // Admin joins private admin room
    socket.emit("join-admin-room");

    console.log("🔔 Admin joining notification room");

    // Handle new order
    const handleNewOrder = (newOrder) => {
      console.log("🛒 New order received:", newOrder);

      // Increase notification badge
      setNotificationCount((prev) => prev + 1);

      // Add notification to beginning of list
      setNotifications((prev) => [
        {
          ...newOrder,
          receivedAt: new Date().toISOString(),
        },
        ...prev,
      ]);

      // Play notification sound
      const audio = new Audio("/audio/notification.wav");

      audio.volume = 0.8;

      audio.play().catch((error) => {
        console.log(
          "🔇 Browser blocked notification sound:",
          error
        );
      });
    };

    // Listen for backend event
    socket.on("new-order", handleNewOrder);

    // Cleanup listener
    return () => {
      socket.off("new-order", handleNewOrder);
    };
  }, []);

  // ================================
  // OPEN NOTIFICATION PANEL
  // ================================
  const handleNotificationClick = () => {
    setNotificationOpen((prev) => !prev);

    // Clear unread badge when opened
    setNotificationCount(0);
  };

  // ================================
  // ORDER NOTIFICATION CLICK
  // ================================
  const handleOrderClick = (orderId) => {
    setNotificationOpen(false);

    // Navigate to admin orders page
    navigate("/admin/orders");

    console.log("Opening order:", orderId);
  };

  // ================================
  // LOGOUT
  // ================================
  const logout = () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("role");
    localStorage.removeItem("token");

    socket.disconnect();

    navigate("/admin/login");
  };

  const menuItems = [
    {
      name: "📊 Dashboard",
      path: "/admin/dashboard",
    },
    {
      name: "📦 Products",
      path: "/admin/products",
    },
    {
      name: "🛒 Orders",
      path: "/admin/orders",
    },
    {
      name: "🚴 Delivery Boys",
      path: "/admin/delivery",
    },
    {
      name: "💹 Sales & Revenue",
      path: "/admin/sales",
    },
  ];

  return (
    <div className="min-h-screen flex bg-[#0b0f19] text-white">

      {/* =================================
              MOBILE NAVBAR
      ================================= */}
      <div className="lg:hidden flex items-center justify-between px-5 py-4 bg-[#0d1220] border-b border-white/10 shadow-sm fixed w-full z-50">

        <h1 className="text-lg font-bold">
          Admin Panel
        </h1>

        <div className="flex items-center gap-3">

          {/* MOBILE NOTIFICATION BELL */}
          <NotificationBell
            notificationCount={notificationCount}
            onClick={handleNotificationClick}
          />

          <button
            onClick={() => setOpen(true)}
            className="p-2 bg-white/10 rounded-lg border border-white/10"
          >
            <Menu size={22} />
          </button>

        </div>
      </div>


      {/* =================================
              DESKTOP SIDEBAR
      ================================= */}
      <motion.aside
        initial={{
          x: -50,
          opacity: 0,
        }}
        animate={{
          x: 0,
          opacity: 1,
        }}
        className="hidden lg:flex w-64 p-6 flex-col border-r border-white/10 bg-[#0d1220] fixed h-full"
      >
        <Sidebar
          pathname={pathname}
          menuItems={menuItems}
          logout={logout}
        />
      </motion.aside>


      {/* =================================
              MOBILE SIDEBAR
      ================================= */}
      {open && (
        <motion.div
          initial={{
            x: -200,
          }}
          animate={{
            x: 0,
          }}
          transition={{
            type: "spring",
            stiffness: 120,
          }}
          className="fixed top-0 left-0 w-64 h-full bg-[#0d1220] p-6 shadow-xl z-50 lg:hidden"
        >

          <button
            onClick={() => setOpen(false)}
            className="absolute top-3 right-3 p-2 rounded-lg bg-white/10 border border-white/10"
          >
            <X size={22} />
          </button>

          <Sidebar
            pathname={pathname}
            menuItems={menuItems}
            logout={logout}
          />

        </motion.div>
      )}


      {/* =================================
                MAIN CONTENT
      ================================= */}
      <main className="flex-1 lg:ml-64">

        {/* =================================
                  DESKTOP HEADER
        ================================= */}
        <header className="hidden lg:flex w-full px-8 py-5 items-center justify-between border-b border-white/10 bg-[#0d1220]">

          <h1 className="text-xl font-semibold tracking-wide">
            {title}
          </h1>

          <div className="flex items-center gap-4">

            {/* ADD PRODUCT BUTTON */}
            <button
              onClick={() =>
                navigate("/admin/add-product")
              }
              className="px-4 py-2 rounded-lg bg-lime-500 text-black font-semibold hover:bg-lime-400"
            >
              + Add Product
            </button>


            {/* NOTIFICATION BELL */}
            <div className="relative">

              <NotificationBell
                notificationCount={notificationCount}
                onClick={handleNotificationClick}
              />

            </div>


            {/* ADMIN BADGE */}
            <span className="px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-sm">
              Admin
            </span>

          </div>
        </header>


        {/* =================================
              NOTIFICATION DROPDOWN
        ================================= */}
        <AnimatePresence>

          {notificationOpen && (

            <motion.div
              initial={{
                opacity: 0,
                y: -10,
                scale: 0.95,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: -10,
                scale: 0.95,
              }}
              className="
                fixed
                top-20
                right-5
                lg:right-8
                w-[350px]
                max-w-[90vw]
                bg-[#111827]
                border
                border-white/10
                rounded-2xl
                shadow-2xl
                z-[100]
                overflow-hidden
              "
            >

              {/* DROPDOWN HEADER */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">

                <h3 className="font-semibold text-white">
                  Notifications
                </h3>

                <span className="text-xs text-slate-400">
                  {notifications.length} orders
                </span>

              </div>


              {/* NOTIFICATION LIST */}
              <div className="max-h-[400px] overflow-y-auto">

                {notifications.length === 0 ? (

                  <div className="py-10 text-center text-slate-400">

                    <Bell
                      size={35}
                      className="mx-auto mb-3 opacity-50"
                    />

                    <p>No new notifications</p>

                  </div>

                ) : (

                  notifications.map((notification, index) => (

                    <button
                      key={
                        notification.orderId ||
                        index
                      }
                      onClick={() =>
                        handleOrderClick(
                          notification.orderId
                        )
                      }
                      className="
                        w-full
                        text-left
                        px-5
                        py-4
                        border-b
                        border-white/5
                        hover:bg-white/5
                        transition
                      "
                    >

                      <div className="flex gap-3">

                        <div className="w-10 h-10 rounded-full bg-lime-500/10 flex items-center justify-center shrink-0">
                          🛒
                        </div>

                        <div className="flex-1">

                          <p className="text-sm font-semibold text-white">
                            {notification.message ||
                              "New order received!"}
                          </p>

                          <p className="text-sm text-lime-400 mt-1">
                            ₹
                            {notification.totalAmount ||
                              0}
                          </p>

                          <p className="text-xs text-slate-500 mt-1">
                            Order ID:{" "}
                            {notification.orderId
                              ?.toString()
                              .slice(-8)}
                          </p>

                          <p className="text-xs text-slate-500 mt-1">
                            {notification.createdAt
                              ? new Date(
                                  notification.createdAt
                                ).toLocaleString()
                              : "Just now"}
                          </p>

                        </div>

                      </div>

                    </button>

                  ))

                )}

              </div>


              {/* VIEW ALL ORDERS */}
              {notifications.length > 0 && (

                <button
                  onClick={() => {
                    setNotificationOpen(false);
                    navigate("/admin/orders");
                  }}
                  className="
                    w-full
                    py-3
                    text-sm
                    font-semibold
                    text-lime-400
                    hover:bg-white/5
                    transition
                    border-t
                    border-white/10
                  "
                >
                  View All Orders
                </button>

              )}

            </motion.div>

          )}

        </AnimatePresence>


        {/* =================================
                  PAGE BODY
        ================================= */}
        <div className="pt-20 lg:pt-8 px-5 lg:px-8 pb-8">
          {children}
        </div>

      </main>

    </div>
  );
}


/* ==========================================
            NOTIFICATION BELL
========================================== */
function NotificationBell({
  notificationCount,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className="
        relative
        p-2.5
        rounded-xl
        bg-white/5
        border
        border-white/10
        hover:bg-white/10
        transition
      "
      aria-label="Notifications"
    >

      <Bell
        size={22}
        className={
          notificationCount > 0
            ? "text-yellow-300"
            : "text-slate-300"
        }
      />


      {/* NOTIFICATION BADGE */}
      {notificationCount > 0 && (

        <motion.span
          initial={{
            scale: 0,
          }}
          animate={{
            scale: 1,
          }}
          className="
            absolute
            -top-2
            -right-2
            min-w-[20px]
            h-5
            px-1
            rounded-full
            bg-red-500
            text-white
            text-[11px]
            font-bold
            flex
            items-center
            justify-center
            border-2
            border-[#0d1220]
          "
        >
          {notificationCount > 99
            ? "99+"
            : notificationCount}
        </motion.span>

      )}

    </button>
  );
}


/* ==========================================
                SIDEBAR
========================================== */
function Sidebar({
  pathname,
  menuItems,
  logout,
}) {
  return (
    <>
      <h1 className="text-[22px] font-extrabold leading-tight">
        GreenBasket

        <span className="text-lime-400 block text-[20px] font-bold">
          Admin
        </span>

      </h1>


      <p className="text-[12px] text-slate-400 mt-1 tracking-wide">
        Inventory & orders control panel
      </p>


      <nav className="mt-8 flex flex-col gap-1">

        {menuItems.map((item, i) => (

          <Link
            key={i}
            to={item.path}
            className={`
              px-4
              py-2.5
              rounded-lg
              font-medium
              transition
              flex
              items-center
              gap-2
              ${
                pathname === item.path
                  ? "bg-lime-500/10 text-lime-400 border border-lime-500/20"
                  : "text-slate-300 hover:bg-white/5"
              }
            `}
          >
            {item.name}
          </Link>

        ))}

      </nav>


      <button
        onClick={logout}
        className="
          mt-auto
          py-2.5
          rounded-lg
          bg-red-500/20
          text-red-300
          border
          border-red-500/30
          hover:bg-red-500/30
        "
      >
        Logout
      </button>

    </>
  );
}