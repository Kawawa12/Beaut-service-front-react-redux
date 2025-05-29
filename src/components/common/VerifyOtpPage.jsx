import { useRef, useState } from "react";
import { motion } from "framer-motion";

const VerifyOtpPage = ({ onVerifyOTP }) => {
  const inputRefs = useRef([]);
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [error, setError] = useState("");

  const handleChange = (value, index) => {
    if (!/^[a-zA-Z0-9]?$/.test(value)) return;

    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (updatedOtp.every((char) => char)) {
      const fullOtp = updatedOtp.join("");
      onVerifyOTP(fullOtp);
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").slice(0, 6).split("");
    if (!pasted.every((ch) => /^[a-zA-Z0-9]$/.test(ch))) return;

    const newOtp = new Array(6).fill("");
    pasted.forEach((char, i) => {
      newOtp[i] = char;
      if (inputRefs.current[i]) {
        inputRefs.current[i].value = char;
      }
    });
    setOtp(newOtp);
    onVerifyOTP(newOtp.join(""));
    e.preventDefault();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white max-w-md w-full rounded-xl shadow-lg p-8"
      >
        <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">
          Enter OTP
        </h2>
        <p className="text-center text-sm text-gray-500 mb-6">
          Enter the 6-character code sent to your email.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const fullOtp = otp.join("");
            if (fullOtp.length < 6) {
              setError("Please enter all 6 characters.");
              return;
            }
            setError("");
            onVerifyOTP(fullOtp);
          }}
        >
          <div className="flex justify-between gap-2 mb-4">
            {otp.map((char, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={char}
                onChange={(e) => handleChange(e.target.value, index)}
                onPaste={index === 0 ? handlePaste : undefined}
                ref={(el) => (inputRefs.current[index] = el)}
                className="w-12 h-12 text-center text-xl border rounded-md uppercase focus:ring-2 focus:ring-pink-500 focus:outline-none"
              />
            ))}
          </div>
          {error && <p className="text-sm text-red-500 text-center mb-2">{error}</p>}

          <button
            type="submit"
            className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 px-4 rounded-lg font-medium transition duration-300"
          >
            Verify OTP
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600">
          Didn't receive the code?{" "}
          <button
            type="button"
            onClick={() => console.log("Resend OTP")}
            className="text-pink-600 hover:underline font-medium"
          >
            Resend
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default VerifyOtpPage;
