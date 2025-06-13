import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaEdit,
  FaBell,
  FaCalendarAlt,
  FaUserClock,
  FaSearch,
  FaSyncAlt,
} from "react-icons/fa";
import { confirmBookingByPin, fetchAllBookings } from "../../../features/booking-slice";
import Modal from 'react-modal';
import Swal from "sweetalert2";

Modal.setAppElement('#root');

// Modal styles moved outside the component
const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  content: {
    background: 'white',
    padding: 0,
    borderRadius: '8px',
    maxWidth: '500px',
    width: '90%',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  }
};

function ReceptionDashboard() {
  const dispatch = useDispatch();
  const { bookings, loading, error } = useSelector((state) => state.bookings);

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [pin, setPin] = useState("");
  const [showPinPrompt, setShowPinPrompt] = useState(false);
  const [status, setStatus] = useState("");
  const [isConfirmPinOpen, setIsConfirmPinOpen] = useState(false);
  const [confirmPin, setConfirmPin] = useState("");

  useEffect(() => {
    dispatch(fetchAllBookings());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchAllBookings());
  };

  const filteredBookings = bookings.filter((booking) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      booking.clientName.toLowerCase().includes(searchLower) ||
      booking.serviceName.toLowerCase().includes(searchLower) ||
      booking.status.toLowerCase().includes(searchLower) ||
      booking.bookingDate.includes(searchTerm) ||
      booking.timeSlot.toLowerCase().includes(searchLower)
    );
  });

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  const openBookingModal = (booking) => {
    setSelectedBooking(booking);
    setStatus(booking.status);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
    setShowPinPrompt(false);
    setPin("");
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    setShowPinPrompt(true);
  };

  const confirmStatusChange = () => {
    if (!pin) {
      alert('Please enter a PIN');
      return;
    }
    console.log(`Updating booking ${selectedBooking.id} to status ${status} with PIN ${pin}`);
    closeModal();
  };

  const openConfirmPinPrompt = (booking) => {
    setSelectedBooking(booking);
    setIsConfirmPinOpen(true);
  };

  const closeConfirmPinPrompt = () => {
    setIsConfirmPinOpen(false);
    setConfirmPin("");
    setSelectedBooking(null);
  };

  const submitConfirmPin = async () => {
    if (!confirmPin) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing PIN',
        text: 'Please enter a confirmation PIN.',
      });
      return;
    }

    try {
      const result = await dispatch(
        confirmBookingByPin({ bookingId: selectedBooking.id, pin: confirmPin })
      ).unwrap();

      switch (result.message) {
        case 'Invalid confirmation PIN.':
          Swal.fire({
            icon: 'error',
            title: 'Invalid PIN',
            text: 'The confirmation PIN entered is incorrect.',
          });
          break;

        case 'PIN has expired.':
          Swal.fire({
            icon: 'warning',
            title: 'Expired PIN',
            text: 'The confirmation PIN has expired. Please ask the client to rebook.',
          });
          break;

        case 'Booking is already confirmed.':
          Swal.fire({
            icon: 'info',
            title: 'Already Confirmed',
            text: 'This booking was already confirmed.',
          });
          break;

        case 'Booking confirmed successfully.':
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'The booking has been confirmed successfully.',
          });
          dispatch(fetchAllBookings()); // Refresh bookings list
          closeConfirmPinPrompt();
          break;

        default:
          Swal.fire({
            icon: 'error',
            title: 'Invalid!',
            text: result.message || 'Something went wrong.',
          });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error || 'Something went wrong while confirming the booking.',
      });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row bg-gray-50 min-h-screen max-h-screen overflow-y-auto p-4 lg:p-6 gap-6">
      <div className="flex-1 order-1 lg:order-1">
        {/* Dashboard cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <DashboardCard
            icon={<FaCalendarAlt className="text-pink-600 text-2xl" />}
            bgColor="bg-pink-100"
            title="Today's Appointments"
            count={
              bookings.filter(
                (b) => b.bookingDate === new Date().toISOString().split("T")[0]
              ).length
            }
          />
          <DashboardCard
            icon={<FaUserClock className="text-yellow-600 text-2xl" />}
            bgColor="bg-yellow-100"
            title="Pending Approvals"
            count={bookings.filter((b) => b.status === "PENDING").length}
          />
          <DashboardCard
            icon={<FaBell className="text-blue-600 text-2xl" />}
            bgColor="bg-blue-100"
            title="Notifications"
            count={5}
          />
        </div>

        {/* Search & bookings */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-4 md:p-6 border-b flex flex-col md:flex-row md:items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-gray-800">
              Upcoming Bookings
            </h2>
            <div className="flex items-center gap-3">
              <div className="relative w-full md:w-64">
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search bookings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:ring-pink-500 focus:border-pink-500 text-sm"
                />
              </div>
              <button
                onClick={handleRefresh}
                className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2"
                title="Refresh bookings"
              >
                <FaSyncAlt />
                <span className="hidden md:inline">Refresh</span>
              </button>
            </div>
          </div>

          {loading ? (
            <div className="p-6 text-center">Loading bookings...</div>
          ) : error ? (
            <div className="p-6 text-center text-red-500">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                  <tr>
                    <th className="px-3 py-3">Client</th>
                    <th className="px-3 py-3">Service</th>
                    <th className="px-3 py-3">Time</th>
                    <th className="px-3 py-3">Date</th>
                    <th className="px-3 py-3">Status</th>
                    <th className="px-3 py-3">PIN</th>
                    <th className="px-3 py-3">Expired</th>
                    <th className="px-3 py-3">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {filteredBookings.length > 0 ? (
                    filteredBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-gray-50">
                        <td className="px-3 py-4">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-pink-500 flex items-center justify-center text-white font-medium">
                              {getInitials(booking.clientName)}
                            </div>
                            <div className="ml-3 text-sm font-medium text-gray-900 truncate max-w-[100px] sm:max-w-none">
                              {booking.clientName}
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-4 text-gray-900 truncate">
                          {booking.serviceName}
                        </td>
                        <td className="px-3 py-4">{booking.timeSlot}</td>
                        <td className="px-3 py-4">
                          {formatDate(booking.bookingDate)}
                        </td>
                        <td className="px-3 py-4 capitalize">
                          {booking.status.toLowerCase()}
                        </td>
                        <td className="px-3 py-4">{booking.confirmationPin}</td>
                        <td className="px-3 py-4">
                          {booking.pinExpired ? (
                            <span className="text-green-500">✅</span>
                          ) : (
                            <span className="text-red-500">No</span>
                          )}
                        </td>
                        <td className="px-3 py-4 flex space-x-2">
                          <button
                            onClick={() => openBookingModal(booking)}
                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                          >
                            View
                          </button>
                          <button
                            onClick={() => openConfirmPinPrompt(booking)}
                            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                          >
                            Confirm
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center py-4 text-gray-500">
                        No bookings found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Profile sidebar */}
      <div className="w-full lg:w-80 flex-shrink-0 order-2 lg:order-2">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-6 text-center text-white">
            <h2 className="text-xl font-semibold">My Profile</h2>
          </div>
          <div className="p-6 flex flex-col items-center">
            <div className="relative mb-4">
              <img
                className="h-24 w-24 rounded-full border-4 border-white shadow-md"
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80"
                alt="Profile"
              />
              <div className="absolute bottom-0 right-0 bg-pink-500 rounded-full p-1">
                <FaEdit className="text-white text-sm" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Anna Hamis</h3>
            <p className="text-gray-600 text-sm mb-2">Receptionist</p>
          </div>
        </div>
      </div>

      {/* Booking Details Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Booking Details"
        style={modalStyles}
      >
        {selectedBooking && (
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Booking Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h3 className="font-medium text-gray-700">Client</h3>
                <p>{selectedBooking.clientName}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-700">Service</h3>
                <p>{selectedBooking.serviceName}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-700">Date</h3>
                <p>{formatDate(selectedBooking.bookingDate)}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-700">Time</h3>
                <p>{selectedBooking.timeSlot}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-700">Status</h3>
                <p className="capitalize">{selectedBooking.status.toLowerCase()}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-700">PIN</h3>
                <p>{selectedBooking.confirmationPin}</p>
              </div>
            </div>

            {!showPinPrompt ? (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">Change Booking Status</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => handleStatusChange('COMPLETED')}
                    className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Mark as Complete
                  </button>
                  <button
                    onClick={() => handleStatusChange('IN_SERVICE')}
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Mark as In Service
                  </button>
                  <button
                    onClick={() => handleStatusChange('PENDING')}
                    className="w-full px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Mark as Pending
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">Confirm with PIN</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Changing status to: <span className="font-semibold">{status}</span>
                </p>
                <input
                  type="password"
                  placeholder="Enter your PIN"
                  className="w-full p-2 border rounded mb-4"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                />
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowPinPrompt(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                  >
                    Back
                  </button>
                  <button
                    onClick={confirmStatusChange}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={closeModal}
              className="mt-6 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        )}
      </Modal>

      {/* Confirm PIN Modal */}
      <Modal
        isOpen={isConfirmPinOpen}
        onRequestClose={closeConfirmPinPrompt}
        contentLabel="Confirm Booking PIN"
        style={modalStyles}
      >
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Confirm Booking</h2>
          <p className="text-sm text-gray-600 mb-4">
            Please enter the confirmation PIN for booking ID: {selectedBooking?.id}
          </p>
          <input
            type="password"
            placeholder="Enter confirmation PIN"
            className="w-full p-4 border rounded mb-4"
            value={confirmPin}
            onChange={(e) => setConfirmPin(e.target.value)}
          />
          <div className="flex justify-end space-x-3">
            <button
              onClick={closeConfirmPinPrompt}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={submitConfirmPin}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Submit
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function DashboardCard({ icon, title, count, bgColor }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex items-center">
      <div className={`${bgColor} p-4 rounded-full mr-4`}>{icon}</div>
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{count}</p>
      </div>
    </div>
  );
}

export default ReceptionDashboard;