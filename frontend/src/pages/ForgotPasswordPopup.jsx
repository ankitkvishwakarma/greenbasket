import React, { useState } from "react";

export default function ForgotPasswordPopup({ switchToLogin }) {
  const [email, setEmail] = useState("");

  return (
    <>
      <h2 className="text-3xl font-extrabold text-white mb-6 tracking-wide drop-shadow-lg">
        Reset Password
      </h2>

      <p className="text-gray-300 text-sm mb-6">
        Enter your registered email to receive a password reset link.
      </p>

      <div className="relative mb-8 group">
        <input
          type="email"
          placeholder=" "
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-4 rounded-xl bg-white/10 backdrop-blur-md 
           border border-white/20 text-white placeholder-transparent 
           outline-none focus:border-green-400 transition shadow-inner shadow-black/20"
        />

        <label
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 
          transition-all duration-200 pointer-events-none 
          group-focus-within:top-2 group-focus-within:text-green-300 
          group-focus-within:text-sm"
        >
          Email
        </label>
      </div>

      <button
        className="relative w-full py-3.5 rounded-xl font-semibold text-black 
          bg-gradient-to-r from-lime-400 to-green-500
          shadow-[0_0_25px_rgba(0,255,140,0.5)]
          hover:shadow-[0_0_35px_rgba(0,255,160,0.8)]
          transition-all duration-300 hover:-translate-y-0.5"
      >
        Send Reset Link
      </button>

      <p className="text-gray-300 text-sm text-center mt-6">
        Back to{" "}
        <button
          onClick={switchToLogin}
          className="text-green-300 underline hover:text-green-400 transition"
        >
          Login
        </button>
      </p>
    </>
  );
}
