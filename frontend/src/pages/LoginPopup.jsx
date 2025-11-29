import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPopup({ switchToSignup, switchToForgot }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      {/* Heading */}
      <h2 className="text-4xl font-black text-white mb-6 tracking-wide text-center">
        Login
      </h2>

      {/* EMAIL */}
      <div className="relative mb-6 group">
        <input
          type="email"
          placeholder="Enter Email"
          className="w-full p-4 rounded-xl bg-white/15 text-white
          border border-white/25 outline-none
          focus:border-green-400 focus:bg-white/20
          transition-all duration-300"
        />

        <label
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300
          transition-all duration-200 pointer-events-none text-sm
          group-focus-within:top-2 group-focus-within:text-xs group-focus-within:text-green-300"
        >
          Email
        </label>
      </div>

      {/* PASSWORD */}
      <div className="relative mb-3 group">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Enter Password"
          className="w-full p-4 pr-12 rounded-xl bg-white/15 text-white
          border border-white/25 outline-none
          focus:border-green-400 focus:bg-white/20
          transition-all duration-300"
        />

        <label
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300
          transition-all duration-200 pointer-events-none text-sm
          group-focus-within:top-2 group-focus-within:text-xs group-focus-within:text-green-300"
        >
          Password
        </label>

        {/* Eye Toggle */}
        <button
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-green-300 transition"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      {/* FORGOT PASSWORD */}
      <button
        onClick={switchToForgot}
        className="text-green-300 text-sm underline hover:text-green-400 transition block mb-6"
      >
        Forgot Password?
      </button>

      {/* LOGIN BUTTON */}
      <button
        className="w-full py-3.5 rounded-xl font-bold text-black text-lg
        bg-gradient-to-r from-lime-400 to-green-500
        shadow-[0_0_20px_rgba(34,197,94,0.6)]
        hover:shadow-[0_0_35px_rgba(34,197,94,0.9)]
        transition-all duration-300 hover:-translate-y-0.5"
      >
        Login
      </button>

      <p className="text-gray-300 text-sm text-center mt-6">
        Don’t have an account?
        <button
          onClick={switchToSignup}
          className="text-green-300 underline hover:text-green-400 transition ml-1 font-medium"
        >
          Sign up
        </button>
      </p>
    </>
  );
}
