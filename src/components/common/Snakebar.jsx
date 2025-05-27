// components/Snackbar.jsx
import { useEffect } from "react";

export const Snackbar = ({ message, variant = "success", onClose }) => {
  useEffect(() => {
    if (variant === "success") {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [variant, onClose]);

  const bgColor = variant === "success" ? "bg-green-500" : "bg-red-500";

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[60]">
      <div
        className={`${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-slideDown`}
      >
        <span>{message}</span>
      </div>
    </div>
  );
};