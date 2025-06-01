import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaEdit,
  FaBell,
  FaCalendarAlt,
  FaUserClock,
  FaSearch,
  FaEllipsisV,
} from "react-icons/fa";
import { fetchAllBookings } from "../../../features/booking-slice";

function ReceptionDashboard() {
  const dispatch = useDispatch();
  const { bookings, loading, error } = useSelector((state) => state.bookings);

  const [searchTerm, setSearchTerm] = useState("");
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRefs = useRef({});
  const dropdownMenuRefs = useRef({});

  useEffect(() => {
    dispatch(fetchAllBookings());
  }, [dispatch]);

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

  const toggleDropdown = (bookingId, e) => {
    e.stopPropagation();
    e.preventDefault();
    setOpenDropdown(openDropdown === bookingId ? null : bookingId);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        openDropdown &&
        !dropdownRefs.current[openDropdown]?.contains(event.target) &&
        !dropdownMenuRefs.current[openDropdown]?.contains(event.target)
      ) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdown]);

  const getDropdownStyle = (bookingId) => {
    if (
      !openDropdown ||
      openDropdown !== bookingId ||
      !dropdownRefs.current[bookingId]
    ) {
      return { display: "none" };
    }

    const button = dropdownRefs.current[bookingId];
    const buttonRect = button.getBoundingClientRect();
    const spaceBelow = window.innerHeight - buttonRect.bottom;
    const dropdownHeight = 112;

    return {
      position: "fixed",
      left: `${buttonRect.left}px`,
      top:
        spaceBelow > dropdownHeight
          ? `${buttonRect.bottom}px`
          : `${buttonRect.top - dropdownHeight}px`,
      width: "192px",
      zIndex: 50,
    };
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
                        <td className="px-3 py-4">
                          <div className="relative">
                            <button
                              ref={(el) => (dropdownRefs.current[booking.id] = el)}
                              onClick={(e) => toggleDropdown(booking.id, e)}
                              className="text-gray-400 hover:text-gray-600 focus:outline-none"
                            >
                              <FaEllipsisV />
                            </button>
                            {openDropdown === booking.id && (
                              <div
                                ref={(el) => (dropdownMenuRefs.current[booking.id] = el)}
                                className="fixed mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
                                style={getDropdownStyle(booking.id)}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="py-1">
                                  <button className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left">
                                    Mark as IN_SERVICE
                                  </button>
                                  <button className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left">
                                    Mark as COMPLETED
                                  </button>
                                  <button className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left">
                                    Mark as TEMPORARY
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
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