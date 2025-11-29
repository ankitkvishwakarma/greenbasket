import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoginPopup from "../pages/LoginPopup";
import SignupPopup from "../pages/SignupPopup";
import ForgotPasswordPopup from "../pages/ForgotPasswordPopup";

export default function Popupcard({ open, onClose }) {
  const [mode, setMode] = useState("login"); // login | signup | forgot

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* 🔻 BACKDROP SCREEN DARK + GLASS BLUR */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.75 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[9998]"
            onClick={onClose}
          />

          {/* 🔥 POPUP MAIN CARD */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.85 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="
              fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
              w-[92%] md:w-[470px] lg:w-[520px]
              p-10 rounded-3xl z-[9999] overflow-hidden

              bg-[#0e1613]/95 backdrop-blur-xl
              shadow-[0_0_60px_rgba(0,255,160,0.25)]
              border border-green-400/15
            "
          >

            {/* 🌌 AURORA MOVING BACKLIGHT */}
            <motion.div
              initial={{ opacity: 0.3 }}
              animate={{ opacity: 0.55, x: [-60, 60, -60] }}
              transition={{ duration: 8, repeat: Infinity }}
              className="absolute inset-0 bg-gradient-to-br
                from-[#00ff9e1a] via-[#00ffbf08] to-transparent
                blur-[90px]"
            />

            {/* FOG GLOW LAYERS */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 
              w-[260px] h-[260px] bg-green-400/25 blur-[130px] rounded-full opacity-40"/>

            <div className="absolute bottom-0 right-0 
              w-[180px] h-[180px] bg-lime-400/20 blur-[120px] rounded-full"/>

            {/* CONTENT HOLDER */}
            <div className="relative z-50">

              {mode === "login" && (
                <LoginPopup
                  switchToSignup={() => setMode("signup")}
                  switchToForgot={() => setMode("forgot")}
                />
              )}

              {mode === "signup" && (
                <SignupPopup switchToLogin={() => setMode("login")} />
              )}

              {mode === "forgot" && (
                <ForgotPasswordPopup switchToLogin={() => setMode("login")} />
              )}

            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
