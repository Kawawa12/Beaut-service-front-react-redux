import { useEffect, useState } from "react";
import { FaEnvelope, FaLock, FaSpinner } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { clearAuthStatus, loginUser } from "../../../features/auth-slice/index";
import Header from "../../components/common/Header";
import ForgotPasswordModal from "../../components/common/ForgotPassword";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status } = useSelector((state) => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);


  useEffect(() => {
    dispatch(clearAuthStatus());
  }, [dispatch]);

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const response = await dispatch(loginUser(formData)).unwrap();

      await Swal.fire({
        icon: "success",
        title: "Success",
        text: response.message || "Login successful",
        timer: 1500,
        showConfirmButton: false,
      });

      dispatch(clearAuthStatus());

      switch (response.role) {
        case "ADMIN":
          navigate("/admin/dashboard");
          break;
        case "RECEPTIONIST":
          navigate("/reception/dashboard");
          break;
        case "CUSTOMER":
          navigate("/service-page");
          break;
        default:
          navigate("/");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error || "Login failed. Please try again.",
      });
      dispatch(clearAuthStatus());
    }
  };

  const handleForgotPassword = () => {
    // You can redirect to your forgot password route or show a modal
    navigate("/forgot-password");
  };

    const handleSendOTP = (email) => {
    console.log("OTP sent to:", email);
    setIsModalOpen(false);
    // Show success message or redirect to OTP entry page
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-white p-4">
      <Header />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl"
      >
        <h1 className="text-4xl font-bold text-pink-600 mb-6 text-center">
          Sign in
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <FaEnvelope className="text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                autoComplete="off"
                value={formData.email}
                onChange={handleChange}
                className={`pl-10 w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="your@email.com"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <FaLock className="text-gray-400" />
              </div>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`pl-10 w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="••••••••"
              />
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          <div className="text-right text-lg py-2 text-pink-600 mb-2">
            <button
              type="button"
              onClick={()=> setIsModalOpen(true)}
              className="hover:underline"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 px-4 rounded-lg font-medium transition duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {status === "loading" ? (
              <>
                <FaSpinner className="animate-spin" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>

          <div className="text-center text-sm text-gray-600 pt-2">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="text-pink-600 hover:text-pink-700 text-lg font-medium"
            >
              Register
            </button>
          </div>
        </form>
      </motion.div>

      <ForgotPasswordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSendOTP={handleSendOTP}
      />
    </div>
  );
};

export default LoginPage;
