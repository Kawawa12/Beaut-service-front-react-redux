import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaEdit,
  FaBell,
  FaCalendarAlt,
  FaUserClock,
  FaSearch,
  FaSyncAlt,
  FaTimes,
  FaSave,
  FaTimesCircle,
} from "react-icons/fa";
import {
  confirmBookingByPin,
  fetchAllBookings,
  fetchConfirmedBookings,
  fetchInServiceBookings,
  fetchCompletedBookings,
  fetchReservedBookings,
  markAsComplete,
  markAsInService,
} from "../../../features/booking-slice";
import { fetchClientProfile, updateClientProfile } from "../../../features/client-slice";
import Modal from "react-modal";
import Swal from "sweetalert2";

Modal.setAppElement("#root");

const modalStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  content: {
    background: "white",
    padding: 0,
    borderRadius: "8px",
    maxWidth: "600px",
    width: "95%",
    maxHeight: "80vh",
    overflowY: "auto",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
};

function ReceptionDashboard() {
  const dispatch = useDispatch();
  const {
    bookings,
    confirmedBookings,
    inServiceBookings,
    completedBookings,
    reservedBookings,
    loading: bookingLoading,
    error: bookingError,
  } = useSelector((state) => state.bookings);
  const {
    profile,
    loading: profileLoading,
    error: profileError,
  } = useSelector((state) => state.client);

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isConfirmPinOpen, setIsConfirmPinOpen] = useState(false);
  const [confirmPin, setConfirmPin] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });

  // Fetch bookings and profile on mount
  useEffect(() => {
    dispatch(fetchAllBookings());
    dispatch(fetchClientProfile());
  }, [dispatch]);

  // Initialize formData when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || "",
        email: profile.email || "",
        phone: profile.phone || "",
        address: profile.address || "",
      });
     }
  }, [profile]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      // Reset formData to profile values on cancel
      setFormData({
        fullName: profile?.fullName || "",
        email: profile?.email || "",
        phone: profile?.phone || "",
        address: profile?.address || "",
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(updateClientProfile(formData)).unwrap();
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Profile updated successfully.",
      });
      setIsEditing(false);
     } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error || "Failed to update profile.",
      });
      console.error('Profile update error:', error);
    }
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
    setSearchTerm("");
    switch (status) {
      case "CONFIRMED":
        dispatch(fetchConfirmedBookings());
        break;
      case "IN_SERVICE":
        dispatch(fetchInServiceBookings());
        break;
      case "COMPLETED":
        dispatch(fetchCompletedBookings());
        break;
      case "RESERVED":
        dispatch(fetchReservedBookings());
        break;
      case "ALL":
      default:
        dispatch(fetchAllBookings());
        break;
    }
  };

  const handleRefresh = () => {
    handleFilterChange(filterStatus);
  };

  const handleClearAll = () => {
    setSearchTerm("");
    setFilterStatus("ALL");
    dispatch(fetchAllBookings());
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  const getFilteredBookings = () => {
    let currentBookings = [];
    switch (filterStatus) {
      case "CONFIRMED":
        currentBookings = confirmedBookings;
        break;
      case "IN_SERVICE":
        currentBookings = inServiceBookings;
        break;
      case "COMPLETED":
        currentBookings = completedBookings;
        break;
      case "RESERVED":
        currentBookings = reservedBookings;
        break;
      case "ALL":
      default:
        currentBookings = bookings;
        break;
    }

    return currentBookings.filter((booking) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        booking.clientName.toLowerCase().includes(searchLower) ||
        booking.serviceName.toLowerCase().includes(searchLower) ||
        booking.status.toLowerCase().includes(searchLower) ||
        booking.bookingDate.includes(searchTerm) ||
        booking.timeSlot.toLowerCase().includes(searchLower)
      );
    });
  };

  const filteredBookings = getFilteredBookings();

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const getInitials = (name) => {
    return name
      ? name
          .split(" ")
          .map((part) => part[0])
          .join("")
          .toUpperCase()
      : "";
  };

  const openBookingModal = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };

  const markBookingAsInService = async (bookingId) => {
    try {
      const result = await dispatch(markAsInService({ bookingId })).unwrap();
      if (result.data) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: result.message || "Booking marked as in service.",
        });
        handleFilterChange(filterStatus);
        closeModal();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: result.message || "Something went wrong.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error || "Failed to mark booking as in service.",
      });
    }
  };

  const markBookingAsComplete = async (bookingId) => {
    try {
      const result = await dispatch(markAsComplete({ bookingId })).unwrap();
      if (result.data) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: result.message || "Booking marked as complete.",
        });
        handleFilterChange(filterStatus);
        closeModal();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: result.message || "Something went wrong.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error || "Failed to mark booking as complete.",
      });
    }
  };

  const openConfirmPinPrompt = (booking) => {
    if (!booking) {
      console.error("No booking provided to confirm");
      return;
    }
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
        icon: "warning",
        title: "Missing PIN",
        text: "Please enter a confirmation PIN.",
      });
      return;
    }

    if (!selectedBooking || !selectedBooking.id) {
      console.error("No valid booking selected for confirmation:", selectedBooking);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No valid booking selected for confirmation.",
      });
      setIsConfirmPinOpen(false);
      setConfirmPin("");
      setSelectedBooking(null);
      return;
    }

    try {
      const result = await dispatch(
        confirmBookingByPin({
          bookingId: selectedBooking.id,
          pin: confirmPin,
        })
      ).unwrap();

      if (result.message === "Booking confirmed successfully.") {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "The booking has been confirmed successfully.",
        });
        handleFilterChange(filterStatus);
        closeConfirmPinPrompt();
      } else {
        switch (result.message) {
          case "Invalid confirmation PIN.":
            Swal.fire({
              icon: "error",
              title: "Invalid PIN",
              text: "The confirmation PIN entered is incorrect.",
            });
            break;
          case "PIN has expired.":
            Swal.fire({
              icon: "warning",
              title: "Expired PIN",
              text: "The confirmation PIN has expired. Please ask the client to rebook.",
            });
            break;
          case "Booking is already confirmed.":
            Swal.fire({
              icon: "info",
              title: "Already Confirmed",
              text: "This booking was already confirmed.",
            });
            break;
          default:
            Swal.fire({
              icon: "error",
              title: "Error",
              text: result.message || "Something went wrong.",
            });
        }
      }
    } catch (error) {
      console.error("Error confirming booking:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error || "An unexpected error occurred while confirming the booking.",
      });
    } finally {
      setConfirmPin("");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row bg-gray-50 min-h-screen max-h-screen overflow-y-auto p-4 lg:p-6 gap-6">
      <div className="flex-1 order-1 lg:order-1">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-4 md:p-6 border-b flex flex-col gap-3">
            <h2 className="text-xl font-semibold text-gray-800">
              {filterStatus === "ALL"
                ? "Upcoming Bookings"
                : `${filterStatus.replace("_", " ")} Bookings`}
            </h2>
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={() => handleFilterChange("ALL")}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  filterStatus === "ALL"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                All
              </button>
              <button
                onClick={() => handleFilterChange("RESERVED")}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  filterStatus === "RESERVED"
                    ? "bg-yellow-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Reserved
              </button>
              <button
                onClick={() => handleFilterChange("CONFIRMED")}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  filterStatus === "CONFIRMED"
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Confirmed
              </button>
              <button
                onClick={() => handleFilterChange("IN_SERVICE")}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  filterStatus === "IN_SERVICE"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                In Service
              </button>
              <button
                onClick={() => handleFilterChange("COMPLETED")}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  filterStatus === "COMPLETED"
                    ? "bg-purple-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Completed
              </button>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative w-full md:w-64">
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search bookings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-10 py-2 w-full rounded-md border border-gray-300 focus:ring-pink-500 focus:border-pink-500 text-sm"
                />
                {searchTerm && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    title="Clear search"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
              <button
                onClick={handleRefresh}
                className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2"
                title="Refresh bookings"
              >
                <FaSyncAlt />
                <span className="hidden md:inline">Refresh</span>
              </button>
              <button
                onClick={handleClearAll}
                className="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 flex items-center gap-2"
                title="Clear all filters and search"
              >
                <span className="hidden md:inline">Clear All</span>
              </button>
            </div>
          </div>

          {bookingLoading ? (
            <div className="p-6 text-center text-base">Loading bookings...</div>
          ) : bookingError ? (
            <div className="p-6 text-center text-red-500 text-base">{bookingError}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-base text-left">
                <thead className="bg-gray-50 text-sm text-gray-500 uppercase">
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
                            <div className="h-8 w-8 rounded-full bg-pink-500 flex items-center justify-center text-white font-medium text-base">
                              {getInitials(booking.clientName)}
                            </div>
                            <div className="ml-3 text-base font-medium text-gray-900 truncate max-w-[100px] sm:max-w-none">
                              {booking.clientName}
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-4 text-gray-900 truncate text-base">
                          {booking.serviceName}
                        </td>
                        <td className="px-3 py-4 text-base">{booking.timeSlot}</td>
                        <td className="px-3 py-4 text-base">{formatDate(booking.bookingDate)}</td>
                        <td className="px-3 py-4 capitalize text-base">
                          {booking.status.toLowerCase().replace("_", " ")}
                        </td>
                        <td className="px-3 py-3 text-base">{booking.confirmationPin}</td>
                        <td className="px-3 py-4 text-base">
                          {booking.pinExpired ? (
                            <span className="text-green-500">✅</span>
                          ) : (
                            <span className="text-red-500">No</span>
                          )}
                        </td>
                        <td className="px-3 py-4 flex space-x-2">
                          <button
                            onClick={() => openBookingModal(booking)}
                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-base"
                          >
                            View
                          </button>
                          <button
                            onClick={() => openConfirmPinPrompt(booking)}
                            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-base"
                            disabled={booking.status !== "RESERVED"}
                          >
                            Confirm
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center py-4 text-gray-500 text-base">
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

      {/* My Profile */}
      <div className="w-full lg:w-80 flex-shrink-0 order-2 lg:order-2">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-6 text-center text-white">
            <h2 className="text-xl font-semibold">My Profile</h2>
          </div>
          <div className="p-6 flex flex-col items-center">
            {profileLoading ? (
              <div className="text-center text-gray-500 text-base">Loading profile...</div>
            ) : profileError ? (
              <div className="text-center text-red-500 text-base">{profileError}</div>
            ) : !profile ? (
              <div className="text-center text-gray-500 text-base">No profile data available.</div>
            ) : (
              <>
                <div className="relative mb-4">
                  <div className="h-24 w-24 rounded-full bg-pink-500 flex items-center justify-center text-white text-3xl font-bold shadow-md">
                    {getInitials(profile.fullName)}
                  </div>
                  <button
                    onClick={handleEditToggle}
                    className="absolute bottom-0 right-0 bg-pink-500 rounded-full p-1 hover:bg-pink-600 transition-colors"
                  >
                    {isEditing ? (
                      <FaTimesCircle className="text-white text-sm" />
                    ) : (
                      <FaEdit className="text-white text-sm" />
                    )}
                  </button>
                </div>

                {isEditing ? (
                  <form onSubmit={handleSubmit} className="w-full">
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-medium mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md text-base"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-medium mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md text-base"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-medium mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md text-base"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-medium mb-1">
                        Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md text-base"
                        required
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={handleEditToggle}
                        className="px-3 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 text-base"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-3 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 text-base flex items-center gap-1"
                      >
                        <FaSave /> Save
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="w-full">
                    <div className="mb-3 text-center">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {profile.fullName || "N/A"}
                      </h3>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-gray-500 text-sm">Email</p>
                        <p className="text-gray-800 text-base">{profile.email || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">Phone</p>
                        <p className="text-gray-800 text-base">{profile.phone || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">Address</p>
                        <p className="text-gray-800 text-base">{profile.address || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Booking Details"
        style={modalStyles}
      >
        {selectedBooking && (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Booking Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h3 className="font-medium text-gray-700 text-lg">Client</h3>
                <p className="text-base">{selectedBooking.clientName}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-700 text-lg">Service</h3>
                <p className="text-base">{selectedBooking.serviceName}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-700 text-lg">Date</h3>
                <p className="text-base">{formatDate(selectedBooking.bookingDate)}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-700 text-lg">Time</h3>
                <p className="text-base">{selectedBooking.timeSlot}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-700 text-lg">Status</h3>
                <p className="capitalize text-base">
                  {selectedBooking.status.toLowerCase().replace("_", " ")}
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-700 text-lg">PIN</h3>
                <p className="text-base">{selectedBooking.confirmationPin}</p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-xl font-medium mb-3">Change Booking Status</h3>
              <div className="space-y-2">
                <button
                  onClick={() => markBookingAsComplete(selectedBooking.id)}
                  className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-base"
                  disabled={
                    selectedBooking.status !== "CONFIRMED" &&
                    selectedBooking.status !== "IN_SERVICE"
                  }
                >
                  Mark as Complete
                </button>
                <button
                  onClick={() => markBookingAsInService(selectedBooking.id)}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-base"
                  disabled={selectedBooking.status !== "CONFIRMED"}
                >
                  Mark as In Service
                </button>
              </div>
            </div>

            <button
              onClick={closeModal}
              className="mt-6 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 text-base"
            >
              Close
            </button>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isConfirmPinOpen}
        onRequestClose={closeConfirmPinPrompt}
        contentLabel="Confirm Booking PIN"
        style={modalStyles}
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Confirm Booking</h2>
          <p className="text-base text-gray-600 mb-4">
            Please enter the confirmation PIN for booking ID:{" "}
            {selectedBooking?.id || "N/A"}
          </p>
          <input
            type="password"
            placeholder="Enter confirmation PIN"
            className="w-full p-4 border rounded mb-4 text-base"
            value={confirmPin}
            onChange={(e) => setConfirmPin(e.target.value)}
          />
          <div className="flex justify-end space-x-3">
            <button
              onClick={closeConfirmPinPrompt}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 text-base"
            >
              Cancel
            </button>
            <button
              onClick={submitConfirmPin}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-base"
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
        <p className="text-gray-500 text-base">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{count}</p>
      </div>
    </div>
  );
}

export default ReceptionDashboard;