import React, { useState } from "react";
import { Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";

export default function SignupPopup({ switchToLogin }) {
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const isMatch = password === confirm && confirm.length > 0;
  const isWeak = password.length < 6 && password.length > 0;

  return (
    <div className="animate-fadeInSlow">

      {/* Heading */}
      <h2 className="text-[30px] font-bold text-white text-center mb-6">
        Create Your Account 🚀
      </h2>

      <div className="space-y-4">

        {/* Full Name */}
        <InputField label="Full Name" type="text" />

        {/* Email */}
        <InputField label="Email Address" type="email" />

        {/* Password */}
        <div className="relative">
          <InputField
            label="Password"
            type={showPass ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            borderColor={
              isWeak ? "border-red-400" : isMatch ? "border-green-400" : "border-white/25"
            }
          />

          {/* Show/Hide Button */}
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-green-300"
          >
            {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <InputField
            label="Confirm Password"
            type={showConfirm ? "text" : "password"}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            borderColor={
              confirm.length > 0
                ? isMatch
                  ? "border-green-400"
                  : "border-red-400"
                : "border-white/25"
            }
          />

          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-green-300"
          >
            {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Hints — Fast Readable */}
        {isWeak && (
          <p className="flex items-center gap-1 text-xs text-red-400">
            <AlertCircle size={14}/> Minimum 6 characters required
          </p>
        )}

        {confirm.length > 0 && isMatch && (
          <p className="flex items-center gap-1 text-xs text-green-300">
            <CheckCircle size={14}/> Passwords match
          </p>
        )}

        {/* Signup Button */}
        <button
          disabled={!isMatch || isWeak}
          className="
            mt-2 w-full py-3 rounded-xl font-semibold text-black text-[17px]
            bg-gradient-to-r from-lime-400 to-green-500
            hover:scale-[1.02] active:scale-[0.98]
            transition-all duration-300 shadow-[0_0_28px_#00ff8875]
            disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100
          "
        >
          Sign Up
        </button>

        {/* Switch to Login */}
        <p className="text-gray-300 text-sm text-center pt-2">
          Already have an account?
          <span
            onClick={switchToLogin}
            className="text-green-300 font-medium ml-1 hover:text-green-400 cursor-pointer"
          >Login</span>
        </p>
      </div>
    </div>
  );
}

/* 🔽 Reusable Input Component — cleaner UI */
function InputField({ label, type, value, onChange, borderColor }) {
  return (
    <div className="relative group">
      <input
        type={type}
        value={value}
        onChange={onChange}
        className={`w-full p-4 rounded-xl bg-white/10 text-white outline-none
          placeholder-transparent backdrop-blur-md shadow-inner shadow-black/30
          border ${borderColor || "border-white/25"}
          focus:border-green-400 transition
        `}
        placeholder=" "
      />
      <label className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300
        pointer-events-none transition-all duration-200
        group-focus-within:top-2 group-focus-within:text-green-300 group-focus-within:text-xs">
        {label}
      </label>
    </div>
  );
}
