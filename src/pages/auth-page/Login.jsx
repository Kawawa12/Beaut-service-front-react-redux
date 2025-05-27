import { useEffect, useState } from "react";
import { FaEnvelope, FaLock, FaTimes,FaSpinner } from "react-icons/fa";
import { clearAuthStatus, loginUser } from "../../../features/auth-slice/index";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

 

const LoginForm = ({ onClose, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const { status, role } = useSelector((state) => state.auth); // Added role to selector
  const navigate = useNavigate();

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
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };


// Reset auth status when component mounts
  useEffect(() => {
    dispatch(clearAuthStatus());
    return () => {
      // Cleanup if needed
    };
  }, [dispatch]);

const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const response = await dispatch(loginUser(formData)).unwrap();
      
      const successMsg = response.message || "Login successful";
      const userRole = response.role;

      await Swal.fire({
        icon: "success",
        title: "Success",
        text: successMsg,
        timer: 1500,
        showConfirmButton: false,
      });

      // Clear the loading status
      dispatch(clearAuthStatus());

      // Redirect based on role
      switch (userRole) {
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

      onClose?.();
    } catch (error) {
      const errorMsg = error || "Login failed. Please try again.";
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: errorMsg,
      });
      // Clear the loading status on error too
      dispatch(clearAuthStatus());
    }
  };



  return (
    <div className="fixed inset-0 bg-white/10 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl animate-fadeIn">
        <div className="flex justify-between items-center mb-6">
          <span className="text-3xl font-bold text-pink-600">Sign in</span>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="email">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
            <label className="block text-gray-700 mb-2" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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

          <div className="pt-2">
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
          </div>

          <div className="text-center text-sm text-gray-600 pt-2">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-pink-600 hover:text-pink-700 font-medium"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
 

export default LoginForm;
