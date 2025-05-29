import { useState } from "react";
import { FaUser, FaEnvelope, FaPhone, FaLock } from "react-icons/fa";
import { Link } from "react-router-dom";
import Header from "../../components/common/Header";
import { motion } from "framer-motion"; // ✅ Framer Motion import

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = "Full name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.phone) newErrors.phone = "Phone is required";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords don't match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const { confirmPassword, ...submitData } = formData;
      console.log("Register form submitted:", submitData);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-white p-4">
      <Header />

      {/*  Center container */}
      <div className="flex-grow flex items-center justify-center px-4 py-12">
        {/* Framer Motion animated form */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-xl bg-white rounded-xl shadow-md p-8"
        >
          <h1 className="text-3xl font-bold text-center text-pink-600 mb-8">
            Create Account
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ... all input fields stay the same ... */}

            {/* Full Name Field */}
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="fullName">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  autoComplete="off"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`pl-10 w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                    errors.fullName ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="John Mashauri"
                />
              </div>
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
              )}
            </div>

            {/* ... rest of your fields (email, phone, password, etc.) ... */}
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
              <label className="block text-gray-700 mb-2" htmlFor="phone">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaPhone className="text-gray-400" />
                </div>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`pl-10 w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="+1 234 567 890"
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
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

            <div>
              <label className="block text-gray-700 mb-2" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`pl-10 w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                    errors.confirmPassword ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="••••••••"
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 px-4 rounded-lg font-medium transition duration-300"
              >
                Register
              </button>
            </div>

            <div className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-pink-600 hover:text-pink-700 text-lg font-medium"
              >
                Login
              </Link>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
