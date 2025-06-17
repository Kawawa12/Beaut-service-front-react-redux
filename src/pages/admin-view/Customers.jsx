import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchAllCustomers, 
  deactivateAccount, 
  activateAccount 
} from '../../../features/admin-slice';
import { FiRefreshCw, FiSearch, FiUser, FiPhone, FiMail, FiHome } from 'react-icons/fi';
import { FaToggleOn, FaToggleOff } from 'react-icons/fa';

const Customers = () => {
  const dispatch = useDispatch();
  const { customers, loading, error } = useSelector((state) => state.admin);
  const [searchTerm, setSearchTerm] = useState('');
  const [isToggling, setIsToggling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    dispatch(fetchAllCustomers());
  }, [dispatch]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await dispatch(fetchAllCustomers()).unwrap();
      setSearchTerm('');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleToggleStatus = async (id, isActive) => {
    setIsToggling(true);
    try {
      if (isActive) {
        await dispatch(deactivateAccount(id)).unwrap();
      } else {
        await dispatch(activateAccount(id)).unwrap();
      }
      dispatch(fetchAllCustomers());
    } catch (err) {
      console.error('Failed to toggle status:', err);
    } finally {
      setIsToggling(false);
    }
  };

  const filteredCustomers = customers.filter((customer) =>
    customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    customer.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Customer Management</h1>
          <p className="text-gray-600 mt-1">
            {customers.length} {customers.length === 1 ? 'customer' : 'customers'} registered
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row items-start md:items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-10 w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
          </div>
          
          <button
            onClick={handleRefresh}
            disabled={loading || isRefreshing}
            className={`flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-all duration-200 ${
              (loading || isRefreshing) ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            <FiRefreshCw className={`${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">Error: {error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <FiUser className="text-gray-400" />
                    Customer
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <FiMail className="text-gray-400" />
                    Email
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <FiPhone className="text-gray-400" />
                    Phone
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <FiHome className="text-gray-400" />
                    Address
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading && !isRefreshing ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <tr 
                    key={customer.id} 
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-medium">
                            {customer.fullName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{customer.fullName}</div>
                          <div className="text-sm text-gray-500">Joined {new Date(customer.createdAt).toLocaleDateString()}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{customer.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{customer.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {customer.address || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1.5 rounded-full text-xs font-medium ${
                        customer.active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {customer.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleToggleStatus(customer.id, customer.active)}
                        disabled={isToggling}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium ${
                          customer.active
                            ? 'text-red-700 hover:bg-red-50'
                            : 'text-green-700 hover:bg-green-50'
                        } ${isToggling ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {customer.active ? (
                          <>
                            <FaToggleOff className="text-red-500" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <FaToggleOn className="text-green-500" />
                            Activate
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <FiUser className="h-12 w-12 mb-3 opacity-40" />
                      <p className="text-lg font-medium">No customers found</p>
                      <p className="text-sm mt-1">
                        {searchTerm ? 'Try a different search term' : 'No customers registered yet'}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Customers;