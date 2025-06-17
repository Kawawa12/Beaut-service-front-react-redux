import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchAllBookings,
  fetchConfirmedBookings,
  fetchReservedBookings,
  fetchCompletedBookings,
  fetchInServiceBookings,
  clearBookingMessages
} from '../../../features/booking-slice';
import { FaSync, FaFilter, FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

function ReceptionBookings() {
  const dispatch = useDispatch();
  const {
    bookings,
    confirmedBookings,
    reservedBookings,
    completedBookings,
    inServiceBookings,
    loading,
    error,
    successMessage
  } = useSelector((state) => state.bookings);
  
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Clear messages when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearBookingMessages());
    };
  }, [dispatch]);

  // Load all bookings initially
  useEffect(() => {
    dispatch(fetchAllBookings());
  }, [dispatch]);

  const handleRefresh = () => {
    switch(activeTab) {
      case 'confirmed':
        dispatch(fetchConfirmedBookings());
        break;
      case 'reserved':
        dispatch(fetchReservedBookings());
        break;
      case 'completed':
        dispatch(fetchCompletedBookings());
        break;
      case 'inService':
        dispatch(fetchInServiceBookings());
        break;
      default:
        dispatch(fetchAllBookings());
    }
    setSearchTerm('');
    setStatusFilter('all');
    setDateFilter('');
    setCurrentPage(1);
  };

  const getCurrentBookings = () => {
    switch(activeTab) {
      case 'confirmed':
        return confirmedBookings;
      case 'reserved':
        return reservedBookings;
      case 'completed':
        return completedBookings;
      case 'inService':
        return inServiceBookings;
      default:
        return bookings;
    }
  };

  const filteredBookings = getCurrentBookings().filter(booking => {
    const matchesSearch = 
      booking.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.confirmationPin.includes(searchTerm);
    
    const matchesStatus = 
      statusFilter === 'all' || 
      booking.status.toLowerCase() === statusFilter.toLowerCase();
    
    const matchesDate = 
      !dateFilter || 
      new Date(booking.bookingDate).toLocaleDateString() === new Date(dateFilter).toLocaleDateString();
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  // Pagination logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredBookings.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredBookings.length / rowsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeSlot) => {
    return timeSlot.replace(' - ', ' to ');
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Bookings Management</h1>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
          >
            <FaSync className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
          {successMessage}
        </div>
      )}

      {/* Booking Type Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => {setActiveTab('all'); setCurrentPage(1);}}
          className={`px-4 py-2 rounded-md ${activeTab === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
        >
          All Bookings
        </button>
        <button
          onClick={() => {setActiveTab('reserved'); setCurrentPage(1);}}
          className={`px-4 py-2 rounded-md ${activeTab === 'reserved' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
        >
          Reserved
        </button>
        <button
          onClick={() => {setActiveTab('confirmed'); setCurrentPage(1);}}
          className={`px-4 py-2 rounded-md ${activeTab === 'confirmed' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
        >
          Confirmed
        </button>
        <button
          onClick={() => {setActiveTab('inService'); setCurrentPage(1);}}
          className={`px-4 py-2 rounded-md ${activeTab === 'inService' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
        >
          In Service
        </button>
        <button
          onClick={() => {setActiveTab('completed'); setCurrentPage(1);}}
          className={`px-4 py-2 rounded-md ${activeTab === 'completed' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
        >
          Completed
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by client, service or PIN..."
            value={searchTerm}
            onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
            className="pl-10 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaFilter className="text-gray-400" />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {setStatusFilter(e.target.value); setCurrentPage(1);}}
            className="pl-10 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Statuses</option>
            <option value="reserved">Reserved</option>
            <option value="confirmed">Confirmed</option>
            <option value="in service">In Service</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => {setDateFilter(e.target.value); setCurrentPage(1);}}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <select
            value={rowsPerPage}
            onChange={(e) => {setRowsPerPage(Number(e.target.value)); setCurrentPage(1);}}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={5}>5 rows</option>
            <option value={10}>10 rows</option>
            <option value={20}>20 rows</option>
            <option value={50}>50 rows</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-blue-600">
            Loading bookings...
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No bookings found matching your criteria
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <div className="min-w-full">
                <div className="overflow-y-auto" style={{ maxHeight: '60vh' }}>
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Client
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Service
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date & Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Payment
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Confirmation PIN
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentRows.map((booking) => (
                        <tr key={booking.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {booking.clientName}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {booking.serviceName}
                            </div>
                            {booking.serviceRoom && (
                              <div className="text-xs text-gray-500">
                                Room: {booking.serviceRoom.roomNo}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {formatDate(booking.bookingDate)}
                            </div>
                            <div className="text-sm text-gray-500">
                              {formatTime(booking.timeSlot)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {booking.paymentMethod}
                            </div>
                            <div className="text-sm text-gray-500">
                              TZS {booking.amount.toLocaleString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              booking.status.toLowerCase() === 'completed' 
                                ? 'bg-green-100 text-green-800'
                                : booking.status.toLowerCase() === 'confirmed'
                                ? 'bg-blue-100 text-blue-800'
                                : booking.status.toLowerCase() === 'in service'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {booking.confirmationPin}
                            {booking.pinExpired && (
                              <span className="ml-2 text-xs text-red-500">(Expired)</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200 bg-gray-50">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{indexOfFirstRow + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(indexOfLastRow, filteredBookings.length)}
                </span>{' '}
                of <span className="font-medium">{filteredBookings.length}</span> results
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded-md flex items-center gap-1 disabled:opacity-50"
                >
                  <FaChevronLeft className="text-xs" />
                  Previous
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
                      className={`px-3 py-1 border rounded-md ${
                        currentPage === pageNum ? 'bg-blue-500 text-white border-blue-500' : ''
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border rounded-md flex items-center gap-1 disabled:opacity-50"
                >
                  Next
                  <FaChevronRight className="text-xs" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ReceptionBookings;