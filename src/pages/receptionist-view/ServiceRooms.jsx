import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllRooms, assignBookingToRoom, clearAssignStatus } from '../../../features/ServiceRoom-Slice';
import { fetchConfirmedBookings } from '../../../features/booking-slice';
import Modal from 'react-modal';
import Swal from 'sweetalert2';

Modal.setAppElement('#root');

const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    zIndex: 1000,
  },
  content: {
    position: 'absolute',
    background: 'white',
    padding: '0',
    borderRadius: '4px',
    border: '1px solid #e5e7eb',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    width: '1000px',
    maxHeight: '500px',
    overflowY: 'auto',
  }
};

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
  const [roomsPerPage] = useState(5);
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
      });
      const timer = setTimeout(() => dispatch(clearAssignStatus()), 3000);
      return () => clearTimeout(timer);
    }
  }, [assignSuccess, assignError, dispatch]);

  // Pagination logic
  const indexOfLast = currentPage * roomsPerPage;
  const indexOfFirst = indexOfLast - roomsPerPage;
  const currentRooms = Array.isArray(rooms) ? rooms.slice(indexOfFirst, indexOfLast) : [];
  const totalPages = Math.ceil((Array.isArray(rooms) ? rooms.length : 0) / roomsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const openAssignDropdown = (roomId, event) => {
    if (!roomId) {
      console.error('Invalid room ID:', roomId);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Invalid room selected.',
      });
      return;
    }
    console.log('Opening assign dropdown for room ID:', roomId);
    setAssigningRoomId(roomId);
    dispatch(fetchConfirmedBookings());
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    setModalPosition({
      top: rect.bottom + window.scrollY + 4,
      left: Math.max(10, rect.left + window.scrollX),
    });
  };

  const closeAssignDropdown = () => {
    console.log('Closing assign dropdown, room ID:', assigningRoomId);
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
    console.log('Assigning booking ID:', bookingId, 'to room ID:', assigningRoomId);
    dispatch(assignBookingToRoom({ bookingId, roomId: assigningRoomId }))
      .unwrap()
      .then(() => {
        dispatch(fetchAllRooms()); // Refresh rooms
        dispatch(fetchConfirmedBookings()); // Refresh bookings
      })
      .catch((error) => {
        console.error('Assign booking error:', error);
      });
    closeAssignDropdown();
  };

  // Filter confirmed bookings with no assigned room
  const availableBookings = confirmedBookings.filter(
    (booking) => booking?.status === 'CONFIRMED' && !booking?.serviceRoom
  );

  return (
    <div className="p-6 flex flex-col items-center min-h-screen bg-gray-50">
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
        All Service Rooms
      </h2>

      {roomsLoading && <p className="text-blue-500 text-base">Loading rooms...</p>}
      {roomsError && <p className="text-red-500 text-base">Error: {roomsError}</p>}
      {!roomsLoading && !roomsError && rooms.length === 0 && (
        <p className="text-gray-600 text-base">No rooms found.</p>
      )}

      {!roomsLoading && rooms.length > 0 && (
        <div className="w-full max-w-4xl">
          <div className="overflow-x-auto rounded-lg shadow-md">
            <table className="min-w-full bg-white text-base">
              <thead className="bg-blue-500 text-white text-sm uppercase">
                <tr>
                  <th className="px-6 py-3 text-left font-medium tracking-wider">Room No</th>
                  <th className="px-6 py-3 text-left font-medium tracking-wider">Service Name</th>
                  <th className="px-6 py-3 text-left font-medium tracking-wider">Capacity</th>
                  <th className="px-6 py-3 text-left font-medium tracking-wider">Clients Inside</th>
                  <th className="px-6 py-3 text-left font-medium tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentRooms.map(room => (
                  <tr key={room.id || room.roomNo} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">{room.roomNo ?? '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{room.serviceName ?? '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{room.capacity ?? '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{room.currentClientInService ?? 0}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        ref={(el) => (buttonRefs.current[room.id || room.roomNo] = el)}
                        onClick={(e) => openAssignDropdown(room.id || room.roomNo, e)}
                        className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 text-sm"
                        disabled={room.currentClientInService >= room.capacity}
                        title={room.currentClientInService >= room.capacity ? "Room at full capacity" : "Assign a booking"}
                      >
                        Assign Booking
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-6">
            <nav className="inline-flex rounded-md shadow-sm -space-x-px">
              <button
                onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-l-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Previous
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`px-4 py-2 border border-gray-300 text-sm ${
                    currentPage === number
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {number}
                </button>
              ))}
              
              <button
                onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-r-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Next
              </button>
            </nav>
          </div>
        </div>
      )}

      <Modal
        isOpen={!!assigningRoomId}
        onRequestClose={closeAssignDropdown}
        contentLabel="Assign Booking to Room"
        style={{
          overlay: modalStyles.overlay,
          content: {
            ...modalStyles.content,
            top: `${modalPosition.top}px`,
            left: `${modalPosition.left}px`,
            transform: 'none',
          }
        }}
      >
        <div className="p-0">
          {bookingsLoading ? (
            <div className="p-2 text-blue-500 text-sm">Loading bookings...</div>
          ) : bookingsError ? (
            <div className="p-2 text-red-500 text-sm">Error: {bookingsError}</div>
          ) : availableBookings.length === 0 ? (
            <div className="p-2 text-gray-600 text-sm">No unassigned confirmed bookings.</div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {availableBookings.map((booking) => (
                <li
                  key={booking.id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={() => handleBookingSelect(booking.id)}
                >
                  {booking.clientName || '-'} — {booking.serviceName || '-'} ({booking.bookingDate || '-'})
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