import { useEffect } from "react";

export default function Snackbar({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 2500); // 2.5 sec hide
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 
      bg-black/80 text-white px-5 py-3 rounded-xl shadow-lg
      backdrop-blur-md animate-fadeIn">
      {message}
    </div>
  );
}
