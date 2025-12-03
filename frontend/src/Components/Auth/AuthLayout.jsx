import { Link } from "react-router-dom";

export default function AuthLayout({ title, children }) {
  return (
    <div className="flex items-center justify-center min-h-screen px-4 
      bg-gradient-to-br from-blue-600 to-blue-800 dark:from-black dark:to-gray-900">

      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 
        border border-white/20 backdrop-blur-md">

        <h1 className="text-3xl font-bold text-center text-blue-700 dark:text-blue-400 mb-6">
          {title}
        </h1>

        {children}

        <p className="text-center text-xs mt-6 text-gray-600 dark:text-gray-400">
          © {new Date().getFullYear()} <b>GreenBasket</b> — All Rights Reserved.
        </p>
      </div>
    </div>
  );
}
