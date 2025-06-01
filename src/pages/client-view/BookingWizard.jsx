import { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { fetchTimeSlots } from "../../../features/slot-slice";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { createBooking } from "../../../features/booking-slice";

const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const formatTime = (time) => {
  if (!time) return "Invalid time";
  try {
    const formatted = dayjs(`1970-01-01T${time}`);
    return formatted.isValid() ? formatted.format("h:mm A") : "Invalid time";
  } catch {
    return "Invalid time";
  }
};

const formatTimeRange = (startTime, endTime) => {
  if (!startTime || !endTime) return "Invalid time";
  try {
    const start = dayjs(`1970-01-01T${startTime}`);
    const end = dayjs(`1970-01-01T${endTime}`);
    return start.isValid() && end.isValid() 
      ? `${start.format("h:mm A")} - ${end.format("h:mm A")}`
      : "Invalid time";
  } catch {
    return "Invalid time";
  }
};

const BookingWizard = () => {
  const { id: serviceId } = useParams();
  const { state: locationState } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    items: slots,
    status: slotsStatus,
    error: slotsError,
  } = useSelector((state) => state.timeSlots);

  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [email, setEmail] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [amount, setAmount] = useState("");

  const serviceData = locationState || {
    serviceName: "Beauty Service",
    price: 0,
    image: null,
  };

  const handleNext = () => setStep((prev) => Math.min(prev + 1, 5));
  
  const handleBack = () => {
    if (step === 1) {
      navigate('/services');
    } else {
      setStep((prev) => Math.max(prev - 1, 1));
    }
  };

  const handleSubmit = async () => {
    if (!confirm || !isValidEmail(email)) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Email or Confirmation',
        text: 'Please confirm and provide a valid email.',
      });
      return;
    }

    const bookingData = {
      serviceId: Number(serviceId),
      slotId: selectedSlot?.id,
      date: selectedDate,
      email,
      paymentMethod,
      amount: amount || serviceData.price,
    };

 
    try {
      const response = await dispatch(createBooking(bookingData)).unwrap();

      const message = response?.message || '';

      if (message.toLowerCase().includes('already booked')) {
        Swal.fire({
          icon: 'warning',
          title: 'Booking Not Allowed',
          text: message,
        });
        return;
      }

      if (message.toLowerCase().includes('fully booked')) {
        Swal.fire({
          icon: 'warning',
          title: 'Time Slot Full',
          text: message,
        });
        return;
      }

      Swal.fire({
        icon: 'success',
        title: 'Booking Successful!',
        text: message + (response?.data ? `\n${response.data}` : ''),
      });

    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Booking Failed',
        text: err?.message || 'Something went wrong. Please try again.',
      });
    }
  }



  useEffect(() => {
    if (step === 2 && serviceId) {
      dispatch(
        fetchTimeSlots({
          serviceId: Number(serviceId),
          date: selectedDate,
        })
      );
    }
  }, [step, selectedDate, serviceId, dispatch]);

  if (!serviceId) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md mt-8">
        <h2 className="text-2xl font-semibold text-center text-red-600">
          Service Not Selected
        </h2>
        <p className="text-center mt-4 text-gray-600">
          Please select a service to book from our services page.
        </p>
        <button
          onClick={() => navigate("/services")}
          className="mt-6 mx-auto block px-6 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition-colors"
        >
          Browse Services
        </button>
      </div>
    );
  }

  const steps = [
    "Choose Date", 
    "Select Time", 
    "Your Email", 
    "Confirmation",
    "Payment"
  ];

  return (
    <div className="max-w-5xl mx-auto p-12 bg-white rounded-xl shadow-md mt-24">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {steps.map((stepTitle, index) => (
            <div
              key={index}
              className={`text-sm ${
                step > index + 1
                  ? "text-green-600"
                  : step === index + 1
                  ? "font-bold text-pink-600"
                  : "text-gray-500"
              }`}
            >
              {stepTitle}
            </div>
          ))}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-pink-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* Step 1: Date Selection */}
      {step === 1 && (
        <div className="space-y-6 mt-24">
          <h2 className="text-2xl font-semibold text-center">
            🗓️ Choose Date for{" "}
            <span className="text-pink-600">{serviceData.serviceName}</span>
          </h2>

          <div className="flex justify-center mt-4">
            <input
              type="date"
              value={selectedDate}
              min={dayjs().format("YYYY-MM-DD")}
              max={dayjs().add(3, "month").format("YYYY-MM-DD")}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-4 text-2xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          <div className="flex justify-between pt-8">
            <button
              onClick={handleBack}
              className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
            >
              ← Back to Services
            </button>
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition-colors"
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Time Selection */}
      {step === 2 && (
        <div className="space-y-6 mt-6">
          <h2 className="text-2xl font-semibold text-center">
            🕐 Choose Time for{" "}
            <span className="text-pink-600">{serviceData.serviceName}</span>
          </h2>
          <p className="text-center text-gray-600 mt-2">
            {dayjs(selectedDate).format("dddd, MMMM D, YYYY")}
          </p>

          {slotsStatus === "loading" ? (
            <div className="mt-8">
              <LoadingSpinner message="Loading available time slots..." />
            </div>
          ) : slotsError ? (
            <div className="text-red-500 text-center py-8">{slotsError}</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6">
              {slots.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => setSelectedSlot(slot)}
                  disabled={slot.status === "NOT_AVAILABLE"}
                  className={`p-3 border rounded-lg transition-all ${
                    selectedSlot?.id === slot.id
                      ? "bg-pink-600 text-white border-pink-600"
                      : slot.status === "NOT_AVAILABLE"
                      ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                      : "bg-white hover:bg-pink-50 border-gray-200"
                  }`}
                >
                  {formatTimeRange(slot.startTime, slot.endTime)}
                  <div className="text-xs">
                    {slot.status === "NOT_AVAILABLE" ? "Not available" : "Available"}
                  </div>
                </button>
              ))}
            </div>
          )}

          <div className="flex justify-between pt-8">
            <button
              onClick={handleBack}
              className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
            >
              ← Back
            </button>
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition-colors"
              disabled={!selectedSlot}
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Email Input */}
      {step === 3 && (
        <div className="space-y-6 mt-6">
          <h2 className="text-2xl font-semibold text-center">
            ✉️ Enter Your Email
          </h2>

          <div className="space-y-4 mt-6">
            <div>
              <label className="block text-gray-700 mb-1">Email Address *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value.trim())}
                className="w-full border border-gray-300 rounded-sm px-4 py-4 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="your@email.com"
                required
              />
              {email && !isValidEmail(email) && (
                <p className="text-red-500 text-sm mt-1">Please enter a valid email address</p>
              )}
            </div>
          </div>

          <div className="flex justify-between pt-8">
            <button
              onClick={handleBack}
              className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
            >
              ← Back
            </button>
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition-colors"
              disabled={!isValidEmail(email)}
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Confirmation */}
      {step === 4 && (
        <div className="space-y-6 mt-6">
          <h2 className="text-2xl font-semibold text-center">
            🧾 Confirm Your Booking
          </h2>

          <div className="bg-gray-50 p-6 rounded-lg space-y-3 mt-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Service:</span>
              <span className="font-medium">{serviceData.serviceName}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span className="font-medium">
                {dayjs(selectedDate).format("dddd, MMMM D, YYYY")}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Time:</span>
              <span className="font-medium">
                {selectedSlot && formatTime(selectedSlot.startTime)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium">{email}</span>
            </div>
          </div>

          <label className="flex items-center mt-6">
            <input
              type="checkbox"
              checked={confirm}
              onChange={() => setConfirm(!confirm)}
              className="h-5 w-5 text-pink-600 rounded focus:ring-pink-500"
            />
            <span className="ml-2 text-gray-700">
              I confirm the above details are correct
            </span>
          </label>

          <div className="flex justify-between pt-8">
            <button
              onClick={handleBack}
              className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
            >
              ← Back
            </button>
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              disabled={!confirm}
            >
              Proceed to Payment →
            </button>
          </div>
        </div>
      )}

      {/* Step 5: Payment */}
      {step === 5 && (
        <div className="space-y-6 mt-6">
          <h2 className="text-2xl font-semibold text-center">
            💳 Payment Information
          </h2>

          <div className="space-y-4 mt-6">
            <div>
              <label className="block text-gray-700 mb-1">Payment Method *</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full border border-gray-300 rounded-sm px-4 py-4 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                required
              >
                <option value="">Select payment method</option>
                <option className="text-xl" value="CRDB">CRDB</option>
                <option className="text-xl" value="NMB">NMB</option>
                <option className="text-xl" value="NBC">NBC</option>
                <option className="text-xl" value="MPESA">M-Pesa</option>
                <option className="text-xl" value="AIRTEL">Airtel Money</option>
                <option className="text-xl" value="PAYPAL">PayPal</option>
                <option className="text-xl" value="HALOPESA">Halo-Pesa</option>
                <option className="text-xl" value="TIGOPESA">Tigo-Pesa</option>
                <option className="text-xl" value="CASH">Cash</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Amount (₦) *</label>
              <input
                type="number"
                value={amount || serviceData.price}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full border border-gray-300 rounded-sm px-4 py-4 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="flex justify-between pt-8">
            <button
              onClick={handleBack}
              className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
            >
              ← Back
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              disabled={!paymentMethod}
            >
              Complete Booking
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingWizard;