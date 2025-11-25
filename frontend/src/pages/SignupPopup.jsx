import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function SignupPopup({ switchToLogin }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const isMatch = password === confirmPass && confirmPass.length > 0;
  const isError = confirmPass.length > 0 && password !== confirmPass;

  return (
    <>
      {/* HEADING */}
      <h2 className="text-3xl font-extrabold text-white mb-8 tracking-wide drop-shadow-lg">
        Create Account
      </h2>

      {/* FULL NAME */}
      <div className="relative mb-5 group">
        <input
          type="text"
          placeholder=" "
          className="w-full p-4 rounded-xl bg-white/10 backdrop-blur-md
            border border-white/20 text-white
            placeholder-transparent outline-none
            focus:border-green-400 transition
            shadow-inner shadow-black/20"
        />
        <label
          className="absolute left-4 top-1/2 -translate-y-1/2
            text-gray-300 pointer-events-none
            transition-all duration-200
            group-focus-within:top-2 
            group-focus-within:text-green-300 
            group-focus-within:text-sm"
        >
          Full Name
        </label>
      </div>

      {/* EMAIL */}
      <div className="relative mb-5 group">
        <input
          type="email"
          placeholder=" "
          className="w-full p-4 rounded-xl bg-white/10 backdrop-blur-md
            border border-white/20 text-white
            placeholder-transparent outline-none
            focus:border-green-400 transition
            shadow-inner shadow-black/20"
        />
        <label
          className="absolute left-4 top-1/2 -translate-y-1/2
            text-gray-300 pointer-events-none
            transition-all duration-200
            group-focus-within:top-2 
            group-focus-within:text-green-300 
            group-focus-within:text-sm"
        >
          Email
        </label>
      </div>

      {/* PASSWORD */}
      <div className="relative mb-5 group">
        <input
          type={showPassword ? "text" : "password"}
          placeholder=" "
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`w-full p-4 pr-12 rounded-xl bg-white/10 backdrop-blur-md 
            border 
            ${
              isError
                ? "border-red-400"
                : isMatch
                ? "border-green-400"
                : "border-white/20"
            }
            text-white outline-none
            placeholder-transparent 
            focus:border-green-400 transition
            shadow-inner shadow-black/20`}
        />

        {/* FLOATING LABEL */}
        <label
          className="absolute left-4 top-1/2 -translate-y-1/2
            text-gray-300 pointer-events-none
            transition-all duration-200
            group-focus-within:top-2 
            group-focus-within:text-green-300 
            group-focus-within:text-sm"
        >
          Password
        </label>

        {/* EYE BUTTON */}
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2
            text-gray-300 hover:text-green-300 transition"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      {/* CONFIRM PASSWORD */}
      <div className="relative mb-2 group">
        <input
          type={showConfirm ? "text" : "password"}
          placeholder=" "
          value={confirmPass}
          onChange={(e) => setConfirmPass(e.target.value)}
          className={`w-full p-4 pr-12 rounded-xl bg-white/10 backdrop-blur-md 
            border 
            ${
              isError
                ? "border-red-400"
                : isMatch
                ? "border-green-400"
                : "border-white/20"
            }
            text-white outline-none
            placeholder-transparent 
            focus:border-green-400 transition
            shadow-inner shadow-black/20`}
        />

        <label
          className="absolute left-4 top-1/2 -translate-y-1/2
            text-gray-300 pointer-events-none
            transition-all duration-200
            group-focus-within:top-2 
            group-focus-within:text-green-300 
            group-focus-within:text-sm"
        >
          Confirm Password
        </label>

        {/* EYE BUTTON */}
        <button
          type="button"
          onClick={() => setShowConfirm(!showConfirm)}
          className="absolute right-4 top-1/2 -translate-y-1/2
            text-gray-300 hover:text-green-300 transition"
        >
          {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      {/* MATCHING MESSAGE */}
      {isError && (
        <p className="text-red-400 text-xs mb-4">Passwords do not match</p>
      )}

      {isMatch && (
        <p className="text-green-300 text-xs mb-4">Passwords match ✓</p>
      )}

      {/* SIGNUP BUTTON */}
      <button
        disabled={!isMatch}
        className="
          relative w-full py-3.5 rounded-xl font-semibold text-black
          bg-gradient-to-r from-lime-400 to-green-500
          shadow-[0_0_25px_rgba(0,255,140,0.5)]
          hover:shadow-[0_0_35px_rgba(0,255,160,0.8)]
          transition-all duration-300 overflow-hidden
          hover:-translate-y-0.5
          disabled:opacity-40 disabled:cursor-not-allowed
        "
      >
        Signup
      </button>

      {/* SWITCH TO LOGIN */}
      <p className="text-gray-300 text-sm text-center mt-6">
        Already have an account?{" "}
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
