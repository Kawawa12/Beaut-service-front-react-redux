import axios from 'axios';
import { useState } from 'react';
import { FaTimes, FaEnvelope } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email) {
      setError('Email is required');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    
    try {
      const response = await axios.post('http://localhost:8080/api/auth/password/reset-token', 
        null,
        { params: { email } }
      );

      const { statusCode, message, data } = response.data;

      if (statusCode === 200) {
        if (message.includes('already exists')) {
          Swal.fire({
            icon: 'info',
            title: 'Existing OTP Found',
            text: 'A valid OTP already exists. Please check your previous OTP or wait for it to expire.',
            confirmButtonText: 'Continue with Existing OTP'
          }).then((result) => {
            if (result.isConfirmed) {
              navigate('/otp-display', { state: { email, token: data, existing: true } });
            }
          });
        } else {
          navigate('/otp-display', { state: { email, token: data, existing: false } });
        }
      } else {
        setError(message || 'Failed to send OTP');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 ${isOpen ? '' : 'hidden'}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl max-w-md w-full p-6 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <FaTimes size={20} />
        </button>

        <h2 className="text-2xl font-bold text-pink-600 mb-4">
          Reset Password
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="reset-email" className="block text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="text-gray-400" />
              </div>
              <input
                type="email"
                id="reset-email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 px-4 rounded-lg font-medium transition duration-300 disabled:opacity-70"
          >
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordModal;