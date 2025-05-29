import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaEnvelope, FaSpinner } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function ForgotPasswordModal({ isOpen, onClose, onSendOTP }) {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setError("Email is required");
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Invalid email address");
    } else {
      setError("");
      onSendOTP(email); // Pass email back to parent
    }
      navigate("/my-otp");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 bg-opacity-40 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.3 }}
            className="bg-white w-full max-w-md rounded-xl shadow-xl p-6 relative"
          >
            <button
              className="absolute top-2 right-3 text-gray-400 hover:text-gray-600 text-xl"
              onClick={onClose}
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
              Forgot Password
            </h2>
            <p className="text-sm text-gray-600 text-center mb-6">
              Enter your email address
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="pl-10 w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent border-gray-300"
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 px-4 rounded-lg font-medium transition duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {status === "loading" ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Processing ...
                  </>
                ) : (
                  "Submit"
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default ForgotPasswordModal;
