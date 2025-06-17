import { FaTimes } from 'react-icons/fa';
import { useState, useEffect } from 'react';

const TimeSlotFormModal = ({ isOpen, onClose, onSubmit, timeSlot, isEditMode, loading }) => {
  const [formData, setFormData] = useState({
    startTime: '',
    endTime: '',
  });

  // Populate form data when timeSlot changes
  useEffect(() => {
    if (timeSlot && isEditMode) {
      setFormData({
        startTime: timeSlot.startTime?.split(':').slice(0, 2).join(':') || '',
        endTime: timeSlot.endTime?.split(':').slice(0, 2).join(':') || '',
      });
    } else {
      setFormData({
        startTime: '',
        endTime: '',
      });
    }
  }, [timeSlot, isEditMode]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit({ id: timeSlot?.id, ...formData });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex justify-between items-center border-b p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
          <h3 className="text-xl font-bold text-gray-800">
            {isEditMode ? 'Update Time Slot' : 'Add New Time Slot'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
            aria-label="Close modal"
            disabled={loading}
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Start Time <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              name="startTime"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
              value={formData.startTime}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              End Time <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              name="endTime"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
              value={formData.endTime}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border rounded-lg hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-5 py-2 text-sm font-medium text-white rounded-lg ${
                loading || !formData.startTime || !formData.endTime
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
              disabled={loading || !formData.startTime || !formData.endTime}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  {isEditMode ? 'Updating...' : 'Creating...'}
                </span>
              ) : (
                isEditMode ? 'Update Time Slot' : 'Create Time Slot'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TimeSlotFormModal;