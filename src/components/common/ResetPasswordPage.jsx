import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaLock, FaCheck, FaArrowLeft, FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import Swal from 'sweetalert2';

const ResetPasswordPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState(state?.email || '');
  const [otp, setOtp] = useState(state?.token || '');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setError('');

    // Validation checks
    if (!email) {
      setError('Email is required');
      return;
    }

    if (otp.length < 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    
    try {
      const response = await axios.post('http://localhost:8080/api/auth/password/reset-password', {
        email: email,
        otp: otp,
        newPassword: newPassword
      });

      if (response.data.statusCode === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Password Reset Successful',
          text: 'You can now login with your new password',
          confirmButtonText: 'Go to Login',
          allowOutsideClick: false,
          allowEscapeKey: false
        }).then(() => {
          navigate('/login', { replace: true });
        });
      } else {
        setError(response.data.message || 'Password reset failed');
      }
    } catch (err) {
      // Handle different error scenarios
      if (err.response) {
        setError(err.response.data.message || 'Password reset failed');
      } else if (err.request) {
        setError('Network error - please try again');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-white p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-pink-600 mb-4 hover:text-pink-800 transition-colors"
          disabled={loading}
        >
          <FaArrowLeft /> Back
        </button>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Reset Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Your email address"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
              OTP Code
            </label>
            <input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => {
                const value = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
                setOtp(value);
                setError('');
              }}
              maxLength={6}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Enter 6-digit OTP"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-gray-400" />
              </div>
              <input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setError('');
                }}
                className="pl-10 pr-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Enter new password"
                disabled={loading}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                disabled={loading}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 px-4 rounded-lg font-medium transition duration-300 disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;