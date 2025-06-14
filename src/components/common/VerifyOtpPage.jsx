// src/pages/auth/VerifyOtp.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaArrowLeft, FaCopy } from 'react-icons/fa';
import { motion } from 'framer-motion';
import axios from 'axios';
import Swal from 'sweetalert2';

const VerifyOtpPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const urlEmail = searchParams.get('email');
    const urlToken = searchParams.get('token');
    
    if (urlEmail) setEmail(urlEmail);
    if (urlToken) {
      setToken(urlToken);
      // Auto-fill OTP from URL token
      const tokenChars = urlToken.split('').slice(0, 6);
      const newOtp = [...otp];
      tokenChars.forEach((char, i) => {
        newOtp[i] = char;
      });
      setOtp(newOtp);
    }
  }, [searchParams]);

  const handleOtpChange = (value, index) => {
    if (!/^[a-zA-Z0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullOtp = otp.join('');

    if (fullOtp.length < 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/auth/password/reset-password', {
        token: fullOtp,
        newPassword,
        confirmPassword
      });

      if (response.data.statusCode === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: response.data.message,
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          navigate('/login');
        });
      } else {
        setError(response.data.message || 'Password reset failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Password reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-white p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl max-w-md w-full p-6 shadow-lg"
      >
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-pink-600 hover:text-pink-800 mb-4"
        >
          <FaArrowLeft /> Back
        </button>

        <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">
          Reset Your Password
        </h2>
        <p className="text-center text-sm text-gray-500 mb-6">
          Enter the OTP sent to {email} and your new password
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              OTP Code
            </label>
            <div className="flex justify-between gap-2 mb-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, index)}
                  className="w-12 h-12 text-center text-xl border rounded-md uppercase focus:ring-2 focus:ring-pink-500 focus:outline-none"
                />
              ))}
            </div>
            {token && (
              <div className="flex items-center justify-end gap-2 text-sm text-gray-500">
                <span>Prefilled from link</span>
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(token)}
                  className="flex items-center gap-1 text-pink-600 hover:text-pink-800"
                >
                  <FaCopy size={12} /> Copy
                </button>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
              required
              minLength="6"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
              required
              minLength="6"
            />
          </div>

          {error && (
            <div className="text-sm text-red-500 text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 px-4 rounded-lg font-medium transition duration-300 disabled:opacity-70"
          >
            {loading ? 'Resetting Password...' : 'Reset Password'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default VerifyOtpPage;