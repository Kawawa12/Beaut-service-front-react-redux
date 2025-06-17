import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaSync, FaEdit, FaPlus } from 'react-icons/fa';
import Swal from 'sweetalert2';
import TimeSlotFormModal from './TimeSlotEditModal';
import {
  fetchTimeSlots,
  addTimeSlot,
  editTimeSlot,
  clearMessages,
} from '../../../features/slot-slice';

const TimeSlot = () => {
  const dispatch = useDispatch();
  const { items: timeSlots, status, error, successMessage } = useSelector((state) => state.timeSlots);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Format time to AM/PM
  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Refresh time slots
  const refreshTimeSlots = () => {
    setIsRefreshing(true);
    dispatch(fetchTimeSlots())
      .unwrap()
      .catch((err) => console.error('Refresh failed:', err))
      .finally(() => setIsRefreshing(false));
  };

  // Handle add/edit submission
  const handleSubmit = async ({ id, startTime, endTime }) => {
    try {
      if (isEditMode && id) {
        await dispatch(editTimeSlot({ id, startTime: `${startTime}:00`, endTime: `${endTime}:00` })).unwrap();
      } else {
        await dispatch(addTimeSlot({ startTime: `${startTime}:00`, endTime: `${endTime}:00` })).unwrap();
      }
      setIsModalOpen(false);
      setSelectedTimeSlot(null);
      setIsEditMode(false);
    } catch (err) {
      console.error('Submit failed:', err);
      throw err; // Let SweetAlert handle the error
    }
  };

  // Initial fetch and message handling
  useEffect(() => {
    dispatch(fetchTimeSlots());
    return () => dispatch(clearMessages());
  }, [dispatch]);

  // Handle success/error messages
  useEffect(() => {
    if (successMessage) {
      Swal.fire({
        title: 'Success!',
        text: successMessage,
        icon: 'success',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md',
        },
      }).then(() => {
        dispatch(clearMessages());
        dispatch(fetchTimeSlots()); // Refresh table
      });
    }
    if (error) {
      Swal.fire({
        title: 'Error!',
        text: error,
        icon: 'error',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md',
        },
      }).then(() => {
        dispatch(clearMessages());
      });
    }
  }, [successMessage, error, dispatch]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with buttons */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Time Slot Management</h2>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setIsEditMode(false);
              setSelectedTimeSlot(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <FaPlus /> Add New Time Slot
          </button>
          <button
            onClick={refreshTimeSlots}
            className={`flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 rounded-lg transition ${
              status.fetch === 'loading' ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={status.fetch === 'loading'}
          >
            <FaSync className={`${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Loading/Error States */}
      {status.fetch === 'loading' && !isRefreshing && (
        <div className="text-center py-4">
          <div className="flex justify-center items-center">
            <svg
              className="animate-spin h-5 w-5 mr-2 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Loading time slots...
          </div>
        </div>
      )}
      {status.fetch === 'failed' && !error && (
        <div className="bg-red-50 p-4 border-l-4 border-red-500 text-red-700 mb-6 rounded">
          Failed to load time slots
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
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {timeSlots.length === 0 && status.fetch === 'succeeded' ? (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                  No time slots available
                </td>
              </tr>
            ) : (
              timeSlots.map((slot) => (
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedTimeSlot(slot);
                        setIsEditMode(true);
                        setIsModalOpen(true);
                      }}
                      className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
                      title="Edit time slot"
                      disabled={status.edit === 'loading'}
                    >
                      <FaEdit />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <TimeSlotFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTimeSlot(null);
          setIsEditMode(false);
        }}
        onSubmit={handleSubmit}
        timeSlot={selectedTimeSlot}
        isEditMode={isEditMode}
        loading={status.add === 'loading' || status.edit === 'loading'}
      />
    </div>
  );
};

export default TimeSlot;