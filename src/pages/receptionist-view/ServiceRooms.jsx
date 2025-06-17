import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllRooms, assignBookingToRoom, clearAssignStatus } from '../../../features/ServiceRoom-Slice';
import { fetchConfirmedBookings } from '../../../features/booking-slice';
import Modal from 'react-modal';
import Swal from 'sweetalert2';
import { FaHotel, FaUserFriends, FaCalendarAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

Modal.setAppElement('#root');

const ServiceRooms = () => {
  const dispatch = useDispatch();
  const {
    rooms = [],
    loading: roomsLoading,
    error: roomsError,
    assignError,
    assignSuccess
  } = useSelector(state => state.serviceRooms);
  const {
    confirmedBookings = [],
    loading: bookingsLoading,
    error: bookingsError
  } = useSelector(state => state.bookings);

  const [currentPage, setCurrentPage] = useState(1);
  const [roomsPerPage] = useState(8);
  const [assigningRoomId, setAssigningRoomId] = useState(null);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const buttonRefs = useRef({});

  useEffect(() => {
    dispatch(fetchAllRooms());
  }, [dispatch]);

  useEffect(() => {
    if (assignSuccess || assignError) {
      Swal.fire({
        icon: assignSuccess ? 'success' : 'error',
        title: assignSuccess ? 'Success' : 'Error',
        text: assignSuccess || assignError,
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false
      });
      const timer = setTimeout(() => dispatch(clearAssignStatus()), 3000);
      return () => clearTimeout(timer);
    }
  }, [assignSuccess, assignError, dispatch]);

  // Pagination logic
  const indexOfLast = currentPage * roomsPerPage;
  const indexOfFirst = indexOfLast - roomsPerPage;
  const currentRooms = rooms.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(rooms.length / roomsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const openAssignDropdown = (roomId, event) => {
    if (!roomId) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Invalid room selected.',
      });
      return;
    }
    setAssigningRoomId(roomId);
    dispatch(fetchConfirmedBookings());
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    setModalPosition({
      top: rect.bottom + window.scrollY + 4,
      left: Math.max(10, rect.left + window.scrollX - 200),
    });
  };

  const closeAssignDropdown = () => {
    setAssigningRoomId(null);
    setModalPosition({ top: 0, left: 0 });
  };

  const handleBookingSelect = (bookingId) => {
    if (!bookingId || !assigningRoomId) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Invalid booking or room selected.',
      });
      return;
    }
    dispatch(assignBookingToRoom({ bookingId, roomId: assigningRoomId }))
      .unwrap()
      .then(() => {
        dispatch(fetchAllRooms());
        dispatch(fetchConfirmedBookings());
      });
    closeAssignDropdown();
  };

  // Filter confirmed bookings with no assigned room
  const availableBookings = confirmedBookings.filter(
    (booking) => booking?.status === 'CONFIRMED' && !booking?.serviceRoom
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
            <FaHotel className="text-blue-600" />
            Service Rooms Management
          </h2>
          <p className="text-gray-600 mt-1">
            {rooms.length} {rooms.length === 1 ? 'room' : 'rooms'} available
          </p>
        </div>
      </div>

      {roomsLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : roomsError ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-6">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-red-500 mr-3" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-red-700">{roomsError}</p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <FaHotel className="text-gray-400" />
                      Room No
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <FaUserFriends className="text-gray-400" />
                      Capacity
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Clients Inside
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentRooms.length > 0 ? (
                  currentRooms.map(room => (
                    <tr key={room.id || room.roomNo} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {room.roomNo ?? '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {room.serviceName ?? '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {room.capacity ?? '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1.5 rounded-full text-xs font-medium ${
                          room.currentClientInService >= room.capacity 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {room.currentClientInService ?? 0} / {room.capacity ?? 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          ref={(el) => (buttonRefs.current[room.id || room.roomNo] = el)}
                          onClick={(e) => openAssignDropdown(room.id || room.roomNo, e)}
                          className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm ${
                            room.currentClientInService >= room.capacity
                              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                          disabled={room.currentClientInService >= room.capacity}
                          title={room.currentClientInService >= room.capacity ? "Room at full capacity" : "Assign a booking"}
                        >
                          Assign Booking
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <FaHotel className="h-12 w-12 mb-3 opacity-40" />
                        <p className="text-lg font-medium">No service rooms available</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {rooms.length > 0 && (
            <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200 bg-gray-50">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{indexOfFirst + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(indexOfLast, rooms.length)}
                </span>{' '}
                of <span className="font-medium">{rooms.length}</span> results
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700">Rows per page:</span>
                  <select
                    className="p-1 border border-gray-300 rounded-md bg-white text-sm"
                    value={roomsPerPage}
                    onChange={(e) => {
                      setRoomsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                  >
                    <option value={5}>5</option>
                    <option value={8}>8</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                  </select>
                </div>
                
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-md border disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaChevronLeft className="text-gray-600" />
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => paginate(pageNum)}
                        className={`px-3 py-1 rounded-md text-sm ${
                          currentPage === pageNum ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-md border disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaChevronRight className="text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <Modal
        isOpen={!!assigningRoomId}
        onRequestClose={closeAssignDropdown}
        contentLabel="Assign Booking to Room"
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
          },
          content: {
            top: `${modalPosition.top}px`,
            left: `${modalPosition.left}px`,
            right: 'auto',
            bottom: 'auto',
            transform: 'none',
            width: '300px',
            padding: '0',
            borderRadius: '0.5rem',
            border: '1px solid #e5e7eb',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }
        }}
      >
        <div className="p-0">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-700">Assign Booking</h3>
          </div>
          
          {bookingsLoading ? (
            <div className="p-4 flex justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : bookingsError ? (
            <div className="p-4 text-red-500 text-sm">{bookingsError}</div>
          ) : availableBookings.length === 0 ? (
            <div className="p-4 text-gray-500 text-sm flex flex-col items-center">
              <FaCalendarAlt className="h-8 w-8 mb-2 opacity-40" />
              <p>No available bookings</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
              {availableBookings.map((booking) => (
                <li
                  key={booking.id}
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                  onClick={() => handleBookingSelect(booking.id)}
                >
                  <div className="text-sm font-medium text-gray-900">{booking.clientName || 'Unknown Client'}</div>
                  <div className="text-xs text-gray-500">{booking.serviceName || 'Unknown Service'}</div>
                  <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <FaCalendarAlt className="text-gray-300" />
                    {new Date(booking.bookingDate).toLocaleDateString() || '-'}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default ServiceRooms;