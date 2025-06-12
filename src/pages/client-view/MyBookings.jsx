import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSortUp, FaSortDown, FaSort } from 'react-icons/fa';
import { fetchMyBookings } from '../../../features/client-slice';

const MyBookings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { bookings, bookingLoading, bookingError } = useSelector((state) => state.client);

  // State for pagination, sorting, filtering, and search
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchMyBookings());
  }, [dispatch]);

  const handleGoBack = () => {
    navigate(-1);
  };

  // Handle sorting
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  // Sort and filter bookings
  const processedBookings = useMemo(() => {
    let filtered = [...bookings];

    // Apply status filter
    if (filterStatus === 'active') {
      filtered = filtered.filter((booking) => !booking.isExpired);
    } else if (filterStatus === 'expired') {
      filtered = filtered.filter((booking) => booking.isExpired);
    }

    // Apply search
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (booking) =>
          booking.serviceName.toLowerCase().includes(lowerSearch) ||
          booking.confirmationPin.toLowerCase().includes(lowerSearch)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      // Handle date sorting
      if (sortConfig.key === 'bookingDate' || sortConfig.key === 'pinExpiry') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [bookings, sortConfig, filterStatus, searchTerm]);

  // Pagination logic
  const totalItems = processedBookings.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBookings = processedBookings.slice(startIndex, startIndex + itemsPerPage);

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (bookingLoading) {
    return (
      <div className="flex justify-center mt-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-pink-600"></div>
      </div>
    );
  }

  if (bookingError) {
    return (
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-700">
        <p className="text-red-500 text-center text-lg">Error loading bookings: {bookingError}</p>
      </div>
    );
  }

  return (
    <div className="py-6">
      <style>
        {`
          .table-header {
            background-color: #1f2937;
            color: #f472b6;
            font-weight: 600;
            padding: 12px;
            text-align: left;
            cursor: pointer;
          }
          .table-cell {
            padding: 12px;
            border-bottom: 1px solid #4b5563;
            color: #d1d5db;
          }
          .table-row:hover {
            background-color: #374151;
          }
          .expired {
            color: #ef4444;
            font-weight: 500;
          }
          .active {
            color: #10b981;
            font-weight: 500;
          }
          .pagination-button {
            padding: 8px 12px;
            margin: 0 4px;
            border: 1px solid #4b5563;
            background-color: #1f2937;
            color: #f472b6;
            border-radius: 4px;
            transition: all 0.2s;
          }
          .pagination-button:hover:not(:disabled) {
            background-color: #374151;
            border-color: #f472b6;
          }
          .pagination-button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
          .active-page {
            background-color: #f472b6;
            color: #1f2937;
            border-color: #f472b6;
          }
        `}
      </style>
      <div className="max-w-5xl mx-auto bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={handleGoBack}
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
          >
            <FaArrowLeft className="mr-2" />
            Go Back
          </button>
          <h2 className="text-3xl font-bold text-white text-center flex-1">My Bookings</h2>
          <div className="w-32"></div> {/* Spacer for alignment */}
        </div>

        {/* Search and Filter Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by service or pin..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-pink-600 flex-1"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-pink-600"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
          </select>
        </div>

        {currentBookings.length === 0 ? (
          <p className="text-gray-300 text-center text-lg">No bookings found.</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr>
                    {[
                      { key: 'id', label: 'ID' },
                      { key: 'serviceName', label: 'Service' },
                      { key: 'timeRange', label: 'Time' },
                      { key: 'bookingDate', label: 'Date' },
                      { key: 'paymentMethod', label: 'Payment' },
                      { key: 'paidAmount', label: 'Amount' },
                      { key: 'confirmationPin', label: 'Pin' },
                      { key: 'pinExpiry', label: 'Pin Expiry' },
                      { key: 'status', label: 'Status' },
                    ].map(({ key, label }) => (
                      <th
                        key={key}
                        className="table-header"
                        onClick={() => handleSort(key)}
                      >
                        <div className="flex items-center">
                          {label}
                          {sortConfig.key === key ? (
                            sortConfig.direction === 'asc' ? (
                              <FaSortUp className="ml-2" />
                            ) : (
                              <FaSortDown className="ml-2" />
                            )
                          ) : (
                            <FaSort className="ml-2 opacity-50" />
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentBookings.map((booking) => (
                    <tr key={booking.id} className="table-row">
                      <td className="table-cell">{booking.id}</td>
                      <td className="table-cell">{booking.serviceName}</td>
                      <td className="table-cell">{booking.timeRange}</td>
                      <td className="table-cell">{booking.bookingDate}</td>
                      <td className="table-cell">{booking.paymentMethod}</td>
                      <td className="table-cell">KES {booking.paidAmount.toFixed(2)}</td>
                      <td className="table-cell">{booking.confirmationPin}</td>
                      <td className="table-cell">
                        {new Date(booking.pinExpiry).toLocaleString()}
                        {booking.isExpired && (
                          <span className="expired ml-2">(Expired)</span>
                        )}
                      </td>
                      <td className="table-cell">
                        <span className={booking.isExpired ? 'expired' : 'active'}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center mt-6">
              <button
                className="pagination-button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  className={`pagination-button ${currentPage === index + 1 ? 'active-page' : ''}`}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
              <button
                className="pagination-button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyBookings;