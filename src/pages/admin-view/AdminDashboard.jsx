import { useState } from "react";
import { FaEdit, FaPlus, FaMoneyBillWave, FaUsers, FaSearch, FaTrash } from "react-icons/fa";

function AdminDashboard() {
    // Sample data for services
    const [services, setServices] = useState([
        { id: 1, name: "Hair Coloring", duration: "60 mins", price: "$80", category: "Hair" },
        { id: 2, name: "Manicure", duration: "45 mins", price: "$35", category: "Nails" },
        { id: 3, name: "Facial Treatment", duration: "90 mins", price: "$120", category: "Skin" },
        { id: 4, name: "Haircut", duration: "30 mins", price: "$50", category: "Hair" },
    ]);

    // Search state
    const [searchTerm, setSearchTerm] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);

    // Filter services based on search term
    const filteredServices = services.filter(service => {
        const searchLower = searchTerm.toLowerCase();
        return (
            service.name.toLowerCase().includes(searchLower) ||
            service.category.toLowerCase().includes(searchLower) ||
            service.price.includes(searchTerm) ||
            service.duration.toLowerCase().includes(searchLower)
        );
    });

    const deleteService = (id) => {
        setServices(prev => prev.filter(service => service.id !== id));
    };

    return (
        <div className="flex flex-col lg:flex-row bg-gray-50 min-h-[calc(100vh-3.5rem)] p-4 lg:p-6 gap-6 overflow-y-auto">
            {/* Main content container */}
            <div className="flex-1 order-1 lg:order-1">
                {/* Header with Add New button */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-xl md:text-2xl font-bold text-gray-800">Service Management</h1>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 cursor-pointer rounded-md transition duration-200 flex items-center justify-center text-sm whitespace-nowrap"
                    >
                        <FaPlus className="mr-2 font-semibold" />
                        Add Service
                    </button>
                </div>

                {/* Three cards at the top */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
                    {/* Total Services Card */}
                    <div className="bg-white rounded-xl shadow-md p-4 md:p-6 flex items-center">
                        <div className="bg-purple-100 p-3 md:p-4 rounded-full mr-3 md:mr-4">
                            <FaPlus className="text-purple-600 text-xl md:text-2xl" />
                        </div>
                        <div>
                            <p className="text-gray-500 text-xs md:text-sm">Total Services</p>
                            <p className="text-xl md:text-2xl font-bold text-gray-800">{services.length}</p>
                        </div>
                    </div>

                    {/* Revenue Card */}
                    <div className="bg-white rounded-xl shadow-md p-4 md:p-6 flex items-center">
                        <div className="bg-green-100 p-3 md:p-4 rounded-full mr-3 md:mr-4">
                            <FaMoneyBillWave className="text-green-600 text-xl md:text-2xl" />
                        </div>
                        <div>
                            <p className="text-gray-500 text-xs md:text-sm">Monthly Revenue</p>
                            <p className="text-xl md:text-2xl font-bold text-gray-800">$8,240</p>
                        </div>
                    </div>

                    {/* Active Clients Card */}
                    <div className="bg-white rounded-xl shadow-md p-4 md:p-6 flex items-center">
                        <div className="bg-blue-100 p-3 md:p-4 rounded-full mr-3 md:mr-4">
                            <FaUsers className="text-blue-600 text-xl md:text-2xl" />
                        </div>
                        <div>
                            <p className="text-gray-500 text-xs md:text-sm">Active Clients</p>
                            <p className="text-xl md:text-2xl font-bold text-gray-800">142</p>
                        </div>
                    </div>
                </div>

                {/* Services Table */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="p-4 md:p-6 border-b border-gray-100">
                        <div className="relative w-full md:w-64">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaSearch className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search services..."
                                className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-sm py-2"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[600px]">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Name</th>
                                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredServices.length > 0 ? (
                                    filteredServices.map((service) => (
                                        <tr key={service.id} className="hover:bg-gray-50">
                                            <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{service.name}</div>
                                            </td>
                                            <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{service.category}</div>
                                            </td>
                                            <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{service.duration}</div>
                                            </td>
                                            <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{service.price}</div>
                                            </td>
                                            <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <button className="text-purple-600 hover:text-purple-900 mr-3">Edit</button>
                                                <button 
                                                    className="text-red-600 hover:text-red-900"
                                                    onClick={() => deleteService(service.id)}
                                                >
                                                    <FaTrash />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-4 md:px-6 py-4 text-center text-sm text-gray-500">
                                            No services found matching your search
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Right sidebar - Profile section */}
            <div className="w-full lg:w-80 flex-shrink-0 order-2 lg:order-2">
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-4 md:p-6 text-center text-white">
                        <h2 className="text-lg md:text-xl font-semibold">Admin Profile</h2>
                    </div>
                    <div className="p-4 md:p-6 flex flex-col items-center">
                        <div className="relative mb-3 md:mb-4">
                            <img 
                                className="h-20 w-20 md:h-24 md:w-24 rounded-full border-4 border-white shadow-md" 
                                src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80" 
                                alt="Admin Profile" 
                            />
                            <div className="absolute bottom-0 right-0 bg-purple-500 rounded-full p-1">
                                <FaEdit className="text-white text-xs md:text-sm" />
                            </div>
                        </div>
                        <h3 className="text-base md:text-lg font-semibold text-gray-800">Alex Morgan</h3>
                        <p className="text-gray-600 text-sm md:text-base mb-1 md:mb-2">Administrator</p>
                        <p className="text-gray-500 text-xs md:text-sm mb-2 md:mb-4 flex items-center">
                            <svg className="w-3 h-3 md:w-4 md:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                            </svg>
                            admin@beautysalon.com
                        </p>
                        <p className="text-gray-500 text-xs md:text-sm mb-4 md:mb-6 flex items-center">
                            <svg className="w-3 h-3 md:w-4 md:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                            </svg>
                            0788906573
                        </p>
                        <button className="w-full bg-purple-100 hover:bg-purple-200 text-purple-700 font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center text-sm md:text-base">
                            <FaEdit className="mr-2 text-xs md:text-sm" />
                            Edit Profile
                        </button>
                    </div>
                    <div className="border-t border-gray-200 p-3 md:p-4">
                        <h4 className="text-xs md:text-sm font-medium text-gray-500 mb-1 md:mb-2">System Stats</h4>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="bg-gray-50 p-2 rounded-lg text-center">
                                <p className="text-xs text-gray-500">Active Staff</p>
                                <p className="font-semibold text-gray-800 text-sm md:text-base">8</p>
                            </div>
                            <div className="bg-gray-50 p-2 rounded-lg text-center">
                                <p className="text-xs text-gray-500">New Bookings</p>
                                <p className="font-semibold text-gray-800 text-sm md:text-base">24</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;