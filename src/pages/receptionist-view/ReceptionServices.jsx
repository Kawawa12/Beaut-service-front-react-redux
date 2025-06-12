import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllServices } from '../../../features/service-slice';
 
function ReceptionServices() {
    const dispatch = useDispatch();
    const { services, loading, error } = useSelector((state) => state.services);
    
    // Filter states
    const [nameFilter, setNameFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [priceFilter, setPriceFilter] = useState('');

    // Fetch services on component mount
    useEffect(() => {
        dispatch(fetchAllServices());
    }, [dispatch]);

    // Get unique categories for dropdown
    const categories = [...new Set(services.map(service => service.categoryName))];

    // Filtered services
    const filteredServices = services.filter(service => {
        const matchesName = service.serviceName.toLowerCase().includes(nameFilter.toLowerCase());
        const matchesCategory = categoryFilter === '' || service.categoryName === categoryFilter;
        const matchesPrice = priceFilter === '' || 
                            service.price.toString().includes(priceFilter);
        
        return matchesName && matchesCategory && matchesPrice;
    });

    if (loading) {
        return <div className="p-4">Loading services...</div>;
    }

    if (error) {
        return <div className="p-4 text-red-500">Error: {error}</div>;
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-6">Reception Services</h1>
            
            {/* Filter controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
                    <input
                        type="text"
                        placeholder="Filter by name..."
                        className="w-full p-2 border rounded"
                        value={nameFilter}
                        onChange={(e) => setNameFilter(e.target.value)}
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                        className="w-full p-2 border rounded"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                    <input
                        type="text"
                        placeholder="Filter by price..."
                        className="w-full p-2 border rounded"
                        value={priceFilter}
                        onChange={(e) => setPriceFilter(e.target.value)}
                    />
                </div>
            </div>
            
            {/* Services table */}
            <div className="overflow-x-auto">
                <div className="max-h-96 overflow-y-auto border rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 sticky top-0">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Service
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Category
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Price
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredServices.length > 0 ? (
                                filteredServices.map((service) => (
                                    <tr key={service.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <img
                                                        className="h-10 w-10 rounded-full object-cover"
                                                        src={service.image || 'https://via.placeholder.com/40'}
                                                        alt=""
                                                    />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {service.serviceName}
                                                    </div>
                                                    <div className="text-sm text-gray-500 line-clamp-1">
                                                        {service.description}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {service.categoryName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {service.price}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">
                                        No services found matching your filters
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default ReceptionServices;