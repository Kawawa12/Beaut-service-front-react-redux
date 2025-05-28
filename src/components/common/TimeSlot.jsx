import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaPlus, FaSync, FaTimesCircle, FaCheckCircle } from "react-icons/fa";
import {
  addTimeSlot,
  fetchTimeSlots,
  toggleTimeSlotAvailability,
} from "../../../features/slot-slice";

const TimeSlot = () => {
  const dispatch = useDispatch();
  const {
    items: timeSlots,
    status,
    error,
  } = useSelector((state) => state.timeSlots);
  const [formData, setFormData] = useState({ startTime: "", endTime: "" });
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [togglingId, setTogglingId] = useState(false);

  // Format time to AM/PM
  const formatTime = (timeString) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.startTime || !formData.endTime) return;

    dispatch(
      addTimeSlot({
        startTime: formData.startTime + ":00", // Add seconds for backend
        endTime: formData.endTime + ":00",
      })
    );
    setFormData({ startTime: "", endTime: "" });
  };

  // Refresh time slots
  const refreshTimeSlots = () => {
    setIsRefreshing(true);
    dispatch(fetchTimeSlots())
      .unwrap()
      .finally(() => setIsRefreshing(false));
  };

  // Toggle availability
  const handleToggleAvailability = async (id) => {
    setTogglingId(id);
    try {
      await dispatch(toggleTimeSlotAvailability(id)).unwrap();
      dispatch(fetchTimeSlots());
    } catch (err) {
      console.error("Failed to toggle availability:", err);
    } finally {
      setTogglingId(null);
    }
  };

  // Initial data fetch
  React.useEffect(() => {
    dispatch(fetchTimeSlots());
  }, [dispatch]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with buttons */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Time Slots</h2>
        <div className="flex gap-2">
          <button
            onClick={refreshTimeSlots}
            className={`flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 rounded-lg transition ${
              status === "loading" ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={status === "loading"}
          >
            <FaSync className={`${isRefreshing ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Time Slot Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-lg font-semibold mb-4">Add New Time Slot</h3>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Time *
            </label>
            <input
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Time *
            </label>
            <input
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
              disabled={!formData.startTime || !formData.endTime}
            >
              Add Time Slot
            </button>
          </div>
        </form>
      </div>

      {/* Loading/Error States */}
      {status === "loading" && !isRefreshing && (
        <div className="text-center py-4">Loading time slots...</div>
      )}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
          Error: {error}
        </div>
      )}

      {/* Time Slots Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Start Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                End Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {timeSlots.map((slot) => (
              <tr key={slot.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatTime(slot.startTime)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatTime(slot.endTime)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(slot.createdDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs font-semibold rounded-full ${
                      slot.available
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {slot.available ? "Available" : "Unavailable"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleToggleAvailability(slot.id)}
                    disabled={togglingId === slot.id}
                    className={`inline-flex items-center px-3 py-1 rounded-md ${
                      slot.available
                        ? "bg-red-100 text-red-700 hover:bg-red-200"
                        : "bg-green-100 text-green-700 hover:bg-green-200"
                    } ${
                      togglingId === slot.id
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {togglingId === slot.id ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </span>
                    ) : slot.available ? (
                      <>
                        <FaTimesCircle className="mr-1" /> Deactivate
                      </>
                    ) : (
                      <>
                        <FaCheckCircle className="mr-1" /> Activate
                      </>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TimeSlot;
