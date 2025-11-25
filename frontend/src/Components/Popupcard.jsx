import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoginPopup from "../pages/LoginPopup";
import SignupPopup from "../pages/SignupPopup";
import ForgotPasswordPopup from "../pages/ForgotPasswordPopup";

export default function Popupcard({ open, onClose }) {
  const [mode, setMode] = useState("login"); 
  // login | signup | forgot

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.65 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-[9998]"
            onClick={onClose}
          />

          {/* POPUP CARD */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.85 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="
              fixed left-1/2 top-1/2 
              -translate-x-1/2 -translate-y-1/2
              w-[92%] md:w-[470px] lg:w-[520px]
              p-10 rounded-3xl z-[9999]
              bg-white/10 backdrop-blur-2xl
              border border-white/20 shadow-[0_0_45px_rgba(0,255,180,0.3)]
              overflow-hidden
            "
          >

            {/* AURORA BG */}
            <motion.div
              initial={{ opacity: 0.4 }}
              animate={{ opacity: 0.6, x: [-40, 40, -40] }}
              transition={{ duration: 6, repeat: Infinity }}
              className="absolute inset-0 bg-gradient-to-br
                from-green-300/20 via-lime-200/10 to-transparent
                blur-2xl"
            />

            {/* NEON BORDER */}
            <div className="absolute -inset-[2px] rounded-3xl bg-gradient-to-r 
                from-green-400 to-lime-500 blur-xl opacity-30"></div>

            {/* CONTENT */}
            <div className="relative z-50">

              {mode === "login" && (
                <LoginPopup
                  switchToSignup={() => setMode("signup")}
                  switchToForgot={() => setMode("forgot")}
                />
              )}

              {mode === "signup" && (
                <SignupPopup
                  switchToLogin={() => setMode("login")}
                />
              )}

              {mode === "forgot" && (
                <ForgotPasswordPopup
                  switchToLogin={() => setMode("login")}
                />
              )}

            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
