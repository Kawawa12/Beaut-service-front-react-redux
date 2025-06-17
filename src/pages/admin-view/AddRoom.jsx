import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllRooms, createRoom, clearRoomMessages } from "../../../features/ServiceRoom-Slice";
import RoomFormModal from "../../components/common/RoomFormModal";
import { FaPlus, FaHotel, FaUsers, FaSync } from "react-icons/fa";
import { GiOfficeChair } from "react-icons/gi";

const AddRoom = () => {
  const dispatch = useDispatch();
  const {
    rooms,
    loading,
    error,
    successMessage,
  } = useSelector((state) => state.serviceRooms);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadRooms();
    return () => dispatch(clearRoomMessages());
  }, [dispatch]);

  const loadRooms = async () => {
    setIsRefreshing(true);
    try {
      await dispatch(fetchAllRooms()).unwrap();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSubmit = async (formData) => {
    const result = await dispatch(createRoom(formData)).unwrap();
    if (result) {
      setIsModalOpen(false);
    }
    return result;
  };

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-6xl">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
            <FaHotel className="text-blue-600" />
            Room Management
          </h2>
          <p className="text-gray-600 mt-1">
            {rooms.length} {rooms.length === 1 ? 'room' : 'rooms'} registered
          </p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={loadRooms}
            disabled={loading || isRefreshing}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg transition"
          >
            <FaSync className={`${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            <FaPlus /> Add New Room
          </button>
        </div>
      </div>

      {/* Status Messages */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-green-500 mr-3" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-green-700">{successMessage}</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-red-500 mr-3" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Rooms Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <GiOfficeChair className="text-gray-400" />
                    Room Number
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <FaUsers className="text-gray-400" />
                    Capacity
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading && !isRefreshing ? (
                <tr>
                  <td colSpan="3" className="px-6 py-8 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                  </td>
                </tr>
              ) : rooms.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <FaHotel className="h-12 w-12 mb-3 opacity-40" />
                      <p className="text-lg font-medium">No rooms created yet</p>
                      <p className="text-sm mt-1">Click "Add New Room" to get started</p>
                    </div>
                  </td>
                </tr>
              ) : (
                rooms.map((room) => (
                  <tr key={room.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-medium">{room.roomNo}</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">Room {room.roomNo}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{room.serviceName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {room.capacity} {room.capacity === 1 ? 'person' : 'people'}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Room Form Modal */}
      <RoomFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
};

export default AddRoom;