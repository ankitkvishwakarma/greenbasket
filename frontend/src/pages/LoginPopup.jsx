import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPopup({ switchToSignup, switchToForgot }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <h2 className="text-3xl font-extrabold text-white mb-8 tracking-wide drop-shadow-lg">
        Login
      </h2>

      {/* EMAIL */}
      <div className="relative mb-5 group">
        <input
          type="email"
          placeholder=" "
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

      {/* PASSWORD */}
      <div className="relative mb-2 group">
        <input
          type={showPassword ? "text" : "password"}
          placeholder=" "
          className="w-full p-4 pr-12 rounded-xl bg-white/10 backdrop-blur-md 
            border border-white/20 text-white placeholder-transparent 
            outline-none focus:border-green-400 transition shadow-inner shadow-black/20"
        />

        <label
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 
            transition-all duration-200 pointer-events-none 
            group-focus-within:top-2 group-focus-within:text-green-300 
            group-focus-within:text-sm"
        >
          Password
        </label>

        {/* EYE ICON */}
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
        className="text-green-300 text-sm underline hover:text-green-400 transition mb-6"
      >
        Forgot Password?
      </button>

      {/* LOGIN BUTTON */}
      <button
        className="relative w-full py-3.5 rounded-xl font-semibold text-black 
          bg-gradient-to-r from-lime-400 to-green-500
          shadow-[0_0_25px_rgba(0,255,140,0.5)]
          hover:shadow-[0_0_35px_rgba(0,255,160,0.8)]
          transition-all duration-300 hover:-translate-y-0.5"
      >
        Login
      </button>

      <p className="text-gray-300 text-sm text-center mt-6">
        Don’t have an account?
        <button
          onClick={switchToSignup}
          className="text-green-300 underline hover:text-green-400 transition ml-1"
        >
          Sign up
        </button>
      </p>
    </>
  );
}
