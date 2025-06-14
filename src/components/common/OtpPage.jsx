import { useLocation, useNavigate } from 'react-router-dom';
import { FaCopy, FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';

const OtpDisplayPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { email, token, existing } = state || {};

  const copyToClipboard = () => {
    navigator.clipboard.writeText(token);
    Swal.fire({
      icon: 'success',
      title: 'Copied!',
      text: 'OTP has been copied to clipboard',
      timer: 1500,
      showConfirmButton: false
    });
  };

  const handleProceed = () => {
    navigate('/reset-password', { state: { email, token } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-white p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl max-w-md w-full p-6 shadow-lg"
      >
        <h2 className="text-2xl font-bold text-center text-pink-600 mb-2">
          {existing ? 'Existing Valid OTP' : 'Your OTP Code'}
        </h2>
        <p className="text-center text-gray-600 mb-6">
          {existing 
            ? 'Your previous OTP is still valid'
            : 'For testing purposes, here is your OTP:'}
        </p>
        
        <div className="mb-6">
          <div className="text-4xl font-mono tracking-wider bg-gray-100 px-6 py-4 rounded-lg text-center">
            {token}
          </div>
          <button
            onClick={copyToClipboard}
            className="mt-4 w-full flex items-center justify-center gap-2 text-pink-600 hover:text-pink-800"
          >
            <FaCopy /> Copy OTP
          </button>
        </div>

        <button
          onClick={handleProceed}
          className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2"
        >
          Proceed to Reset Password <FaArrowRight />
        </button>
      </motion.div>
    </div>
  );
};

export default OtpDisplayPage;