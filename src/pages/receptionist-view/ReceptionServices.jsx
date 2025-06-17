import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllServices } from "../../../features/service-slice";
import { FaSync, FaFilter, FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";

function ReceptionServices() {
  const dispatch = useDispatch();
  const { services, loading, error } = useSelector((state) => state.services);

  // Filter states
  const [nameFilter, setNameFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetch services on component mount and refresh
  useEffect(() => {
    dispatch(fetchAllServices());
  }, [dispatch]);

  // Debug log for services
  useEffect(() => {
   }, [services]);

  // Handle refresh button click
  const handleRefresh = () => {
    setNameFilter("");
    setCategoryFilter("");
    setPriceFilter("");
    setCurrentPage(1);
    dispatch(fetchAllServices());
  };

  // Memoized categories for dropdown
  const categories = useMemo(() => {
    return [
      ...new Set(services.map((service) => service.categoryName).filter(Boolean)),
    ];
  }, [services]);

  // Debug log for categories
  useEffect(() => {
   }, [categories]);

  // Memoized filtered services
  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      if (!service) return false;

      const serviceName = service.serviceName || "";
      const categoryName = service.categoryName || "";
      const price = service.price != null ? Number(service.price) : 0;

      

      const matchesName = serviceName
        .toLowerCase()
        .includes(nameFilter.toLowerCase());
      const matchesCategory =
        categoryFilter === "" || categoryName === categoryFilter;
      const matchesPrice =
        priceFilter === "" ||
        price.toString().includes(priceFilter) ||
        (Number(priceFilter) && price === Number(priceFilter));

      

      return matchesName && matchesCategory && matchesPrice;
    });
  }, [services, nameFilter, categoryFilter, priceFilter]);

  // Debug log for filtered services
  useEffect(() => {
   }, [filteredServices]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredServices.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedServices = filteredServices.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
        <div className="flex items-center">
          <svg className="h-5 w-5 text-red-500 mr-3" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <p className="text-red-700">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Services Management</h1>
          <p className="text-gray-600 mt-1">
            {filteredServices.length} {filteredServices.length === 1 ? 'service' : 'services'} found
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition"
        >
          <FaSync className={`${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Filter controls */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Service Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Filter by name..."
                className="pl-10 w-full p-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={nameFilter}
                onChange={(e) => {
                  setNameFilter(e.target.value);
                  setCurrentPage(1);
                  console.log('Name Filter:', e.target.value);
                }}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaFilter className="text-gray-400" />
              </div>
              <select
                className="pl-10 w-full p-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setCurrentPage(1);
                  console.log('Category Filter:', e.target.value);
                }}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price
            </label>
            <input
              type="text"
              placeholder="Filter by price..."
              className="w-full p-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={priceFilter}
              onChange={(e) => {
                setPriceFilter(e.target.value);
                setCurrentPage(1);
                console.log('Price Filter:', e.target.value);
              }}
            />
          </div>
        </div>
      </div>

      {/* Services table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedServices.length > 0 ? (
                paginatedServices.map((service) => (
                  <tr key={service.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-full object-cover border border-gray-200"
                            src={
                              service.image?.startsWith("data:image")
                                ? service.image
                                : service.image
                                ? `data:image/jpeg;base64,${service.image}`
                                : "https://via.placeholder.com/40"
                            }
                            alt={service.serviceName || 'Service'}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {service.serviceName || 'N/A'}
                          </div>
                          <div className="text-xs text-gray-500 line-clamp-1">
                            {service.description || 'No description'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {service.categoryName || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ${Number(service.price).toFixed(2) || '0.00'}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <FaFilter className="h-12 w-12 mb-3 opacity-40" />
                      <p className="text-lg font-medium">No services found</p>
                      <p className="text-sm mt-1">
                        {services.length === 0 ? 'No services available' : 'Try adjusting your filters'}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredServices.length > 0 && (
          <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200 bg-gray-50">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(endIndex, filteredServices.length)}
              </span>{' '}
              of <span className="font-medium">{filteredServices.length}</span> results
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">Rows per page:</span>
                <select
                  className="p-1 border border-gray-300 rounded-md bg-white text-sm"
                  value={rowsPerPage}
                  onChange={handleRowsPerPageChange}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
              
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
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
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-1 rounded-md text-sm ${
                        currentPage === pageNum ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
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
    </div>
  );
}

export default ReceptionServices;