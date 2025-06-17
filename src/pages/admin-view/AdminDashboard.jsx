import { useEffect, useState } from "react";
import { FaEdit, FaPlus, FaSearch, FaToggleOn, FaToggleOff, FaSync, FaCalendarAlt, FaListAlt, FaUsers } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { 
    fetchAllAdminServices,
    toggleServiceActiveStatus,
    updateBeautService
} from "../../../features/service-slice";
import { fetchClientProfile, updateClientProfile } from "../../../features/client-slice";
import { fetchDashboardCounts } from "../../../features/admin-slice";
import ServiceForm from "../../components/common/ServiceForm";
import LoadingSpinner from "../../components/common/LoadingSpinner";

function AdminDashboard() {
    const dispatch = useDispatch();
    const { services, loading: servicesLoading, error: servicesError } = useSelector((state) => state.services);
    const { profile, loading: profileLoading } = useSelector((state) => state.client);
    const { dashboardCounts, loading: dashboardLoading, error: dashboardError } = useSelector((state) => state.admin);
    const [searchTerm, setSearchTerm] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentService, setCurrentService] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: ''
    });

    useEffect(() => {
        dispatch(fetchAllAdminServices());
        dispatch(fetchClientProfile());
        dispatch(fetchDashboardCounts());
    }, [dispatch]);

    useEffect(() => {
        if (profile) {
            setEditForm({
                fullName: profile.fullName || '',
                email: profile.email || '',
                phone: profile.phone || '',
                address: profile.address || ''
            });
        }
    }, [profile]);

    const handleRefresh = () => {
        setIsRefreshing(true);
        Promise.all([
            dispatch(fetchAllAdminServices()),
            dispatch(fetchDashboardCounts())
        ]).finally(() => setIsRefreshing(false));
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        dispatch(updateClientProfile(editForm))
            .then(() => {
                setIsEditing(false);
            });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEditService = (service) => {
        setCurrentService(service);
        setShowEditModal(true);
    };

    const handleUpdateService = (updatedService) => {
        dispatch(updateBeautService({
            id: currentService.id,
            serviceData: updatedService
        })).then(() => {
            setShowEditModal(false);
            setCurrentService(null);
        });
    };

    const handleToggleStatus = (serviceId) => {
        dispatch(toggleServiceActiveStatus(serviceId));
    };

    const getInitials = (name) => {
        if (!name) return 'AD';
        const names = name.split(' ');
        let initials = names[0].substring(0, 1).toUpperCase();
        if (names.length > 1) {
            initials += names[names.length - 1].substring(0, 1).toUpperCase();
        }
        return initials;
    };

    const getRandomColor = (initials) => {
        const colors = [
            'bg-purple-500', 'bg-blue-500', 'bg-green-500', 
            'bg-yellow-500', 'bg-red-500', 'bg-indigo-500',
            'bg-pink-500', 'bg-teal-500'
        ];
        const charCode = initials.charCodeAt(0) + (initials.length > 1 ? initials.charCodeAt(1) : 0);
        return colors[charCode % colors.length];
    };

    const filteredServices = services.filter(service => {
        if (!service) return false;
        
        const searchLower = searchTerm.toLowerCase();
        return (
            (service.serviceName && service.serviceName.toLowerCase().includes(searchLower)) ||
            (service.categoryName && service.categoryName.toLowerCase().includes(searchLower)) ||
            (service.price && service.price.toString().includes(searchTerm))
        );
    });

    if (servicesLoading && !isRefreshing) return <LoadingSpinner />;
    if (servicesError) return <p className="p-6 text-red-500">Error: {servicesError}</p>;

    const initials = getInitials(profile?.fullName);
    const avatarColor = getRandomColor(initials);

    return (
        <div className="flex flex-col lg:flex-row bg-gray-50 min-h-[calc(100vh-3.5rem)] p-4 lg:p-6 gap-6 overflow-y-auto">
            {/* Main content container */}
            <div className="flex-1 order-1 lg:order-1">
                {/* Header with Add New button */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-xl md:text-2xl font-bold text-gray-800">Dashboard Overview</h1>
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={handleRefresh}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-3 rounded-md transition duration-200 flex items-center justify-center"
                            disabled={isRefreshing}
                            title="Refresh data"
                        >
                            <FaSync className={`${isRefreshing ? 'animate-spin' : ''}`} />
                        </button>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 cursor-pointer rounded-md transition duration-200 flex items-center justify-center text-sm whitespace-nowrap"
                        >
                            <FaPlus className="mr-2 font-semibold" />
                            Add Service
                        </button>
                    </div>
                </div>

                {/* Dashboard Stats Cards */}
                {dashboardLoading && !isRefreshing ? (
                    <div className="text-center py-4">
                        <LoadingSpinner />
                    </div>
                ) : dashboardError ? (
                    <div className="bg-red-50 p-4 border-l-4 border-red-500 text-red-700 mb-6 rounded">
                        Error loading dashboard stats: {dashboardError}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6 mb-6">
                        {/* Active Customers Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 flex flex-col">
                            <div className="flex items-center justify-between mb-2">
                                <div className="bg-blue-100 p-2 md:p-3 rounded-lg">
                                    <FaUsers className="text-blue-600 text-lg md:text-xl" />
                                </div>
                                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                                    +12.5%
                                </span>
                            </div>
                            <h3 className="text-gray-500 text-sm mb-1">Active Customers</h3>
                            <p className="text-2xl md:text-3xl font-bold text-gray-800">
                                {dashboardCounts?.activeCustomers ?? 0}
                            </p>
                        </div>

                        {/* Service Rooms Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 flex flex-col">
                            <div className="flex items-center justify-between mb-2">
                                <div className="bg-purple-100 p-2 md:p-3 rounded-lg">
                                    <FaListAlt className="text-purple-600 text-lg md:text-xl" />
                                </div>
                                <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                                    +8.2%
                                </span>
                            </div>
                            <h3 className="text-gray-500 text-sm mb-1">Service Rooms</h3>
                            <p className="text-2xl md:text-3xl font-bold text-gray-800">
                                {dashboardCounts?.totalServiceRooms ?? 0}
                            </p>
                        </div>

                        {/* Categories Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 flex flex-col">
                            <div className="flex items-center justify-between mb-2">
                                <div className="bg-green-100 p-2 md:p-3 rounded-lg">
                                    <FaListAlt className="text-green-600 text-lg md:text-xl" />
                                </div>
                                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                    +5.7%
                                </span>
                            </div>
                            <h3 className="text-gray-500 text-sm mb-1">Categories</h3>
                            <p className="text-2xl md:text-3xl font-bold text-gray-800">
                                {dashboardCounts?.totalCategories ?? 0}
                            </p>
                        </div>

                        {/* Beauty Services Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 flex flex-col">
                            <div className="flex items-center justify-between mb-2">
                                <div className="bg-indigo-100 p-2 md:p-3 rounded-lg">
                                    <FaListAlt className="text-indigo-600 text-lg md:text-xl" />
                                </div>
                                <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                                    +15.3%
                                </span>
                            </div>
                            <h3 className="text-gray-500 text-sm mb-1">Beauty Services</h3>
                            <p className="text-2xl md:text-3xl font-bold text-gray-800">
                                {dashboardCounts?.totalBeautServices ?? 0}
                            </p>
                        </div>

                        {/* Total Bookings Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 flex flex-col">
                            <div className="flex items-center justify-between mb-2">
                                <div className="bg-pink-100 p-2 md:p-3 rounded-lg">
                                    <FaCalendarAlt className="text-pink-600 text-lg md:text-xl" />
                                </div>
                                <span className="text-xs font-medium text-pink-600 bg-pink-50 px-2 py-1 rounded-full">
                                    +22.1%
                                </span>
                            </div>
                            <h3 className="text-gray-500 text-sm mb-1">Total Bookings</h3>
                            <p className="text-2xl md:text-3xl font-bold text-gray-800">
                                {dashboardCounts?.totalBookings ?? 0}
                            </p>
                        </div>
                    </div>
                )}

                {/* Services Table */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="p-4 md:p-6 border-b border-gray-100">
                        <div className="relative w-full md:w-64">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaSearch className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search by name, category or price..."
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
                                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredServices.length > 0 ? (
                                    filteredServices.map((service) => (
                                        <tr key={service.id} className="hover:bg-gray-50">
                                            <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    {service.image ? (
                                                        <div className="flex-shrink-0 h-10 w-10 mr-3">
                                                            <img 
                                                                className="h-10 w-10 rounded-full object-cover" 
                                                                src={`data:image/jpeg;base64,${service.image}`} 
                                                                alt={service.serviceName} 
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="flex-shrink-0 h-10 w-10 mr-3 bg-gray-200 rounded-full flex items-center justify-center">
                                                            <span className="text-xs text-gray-500">No Image</span>
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {service.serviceName || 'N/A'}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {service.timeSlots?.length || 0} time slots
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {service.categoryName || 'N/A'}
                                                </div>
                                            </td>
                                            <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    ${service.price || '0.00'}
                                                </div>
                                            </td>
                                            <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${service.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {service.active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <button 
                                                    onClick={() => handleEditService(service)}
                                                    className="text-purple-600 hover:text-purple-900 mr-3"
                                                    title="Edit service"
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button 
                                                    onClick={() => handleToggleStatus(service.id)}
                                                    className={`${service.active ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                                                    title={service.active ? 'Deactivate service' : 'Activate service'}
                                                >
                                                    {service.active ? <FaToggleOff size={18} /> : <FaToggleOn size={18} />}
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-4 md:px-6 py-4 text-center text-sm text-gray-500">
                                            {services.length === 0 ? 'No services available' : 'No services match your search'}
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
                    
                    {isEditing ? (
                        <div className="p-4 md:p-6">
                            <form onSubmit={handleEditSubmit}>
                                <div className="flex justify-center mb-4">
                                    <div className={`${avatarColor} h-20 w-20 md:h-24 md:w-24 rounded-full flex items-center justify-center text-white text-2xl font-bold`}>
                                        {initials}
                                    </div>
                                </div>
                                
                                <div className="mb-3">
                                    <label className="block text-gray-700 text-sm mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={editForm.fullName}
                                        onChange={handleEditChange}
                                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                                
                                <div className="mb-3">
                                    <label className="block text-gray-700 text-sm mb-1">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={editForm.email}
                                        onChange={handleEditChange}
                                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                                
                                <div className="mb-3">
                                    <label className="block text-gray-700 text-sm mb-1">Phone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={editForm.phone}
                                        onChange={handleEditChange}
                                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                                
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm mb-1">Address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={editForm.address}
                                        onChange={handleEditChange}
                                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>
                                
                                <div className="flex gap-2">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
                                    >
                                        Save
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md transition duration-200"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div className="p-4 md:p-6 flex flex-col items-center">
                            <div className="relative mb-3 md:mb-4">
                                <div className={`${avatarColor} h-20 w-20 md:h-24 md:w-24 rounded-full flex items-center justify-center text-white text-2xl font-bold`}>
                                    {initials}
                                </div>
                                <button 
                                    onClick={() => setIsEditing(true)}
                                    className="absolute bottom-0 right-0 bg-purple-500 hover:bg-purple-600 rounded-full p-2 transition duration-200"
                                >
                                    <FaEdit className="text-white text-xs" />
                                </button>
                            </div>
                            
                            <h3 className="text-base md:text-lg font-semibold text-gray-800">
                                {profile?.fullName || 'Admin User'}
                            </h3>
                            <p className="text-gray-600 text-sm md:text-base mb-1 md:mb-2">Administrator</p>
                            <p className="text-gray-500 text-xs md:text-sm mb-2 md:mb-4 flex items-center">
                                <svg className="w-3 h-3 md:w-4 md:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                </svg>
                                {profile?.email || 'admin@example.com'}
                            </p>
                            <p className="text-gray-500 text-xs md:text-sm mb-2 md:mb-4 flex items-center">
                                <svg className="w-3 h-3 md:w-4 md:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                </svg>
                                {profile?.phone || 'Phone not set'}
                            </p>
                            <p className="text-gray-500 text-xs md:text-sm mb-4 md:mb-6 flex items-center">
                                <svg className="w-3 h-3 md:w-4 md:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                                {profile?.address || 'Address not set'}
                            </p>
                            
                            <button 
                                onClick={() => setIsEditing(true)}
                                className="w-full bg-purple-100 hover:bg-purple-200 text-purple-700 font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center text-sm md:text-base"
                            >
                                <FaEdit className="mr-2 text-xs md:text-sm" />
                                Edit Profile
                            </button>
                        </div>
                    )}
                    
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
            
            <ServiceForm 
                isOpen={showAddModal} 
                onClose={() => setShowAddModal(false)} 
            />
            
            {showEditModal && currentService && (
                <ServiceForm 
                    isOpen={showEditModal}
                    onClose={() => {
                        setShowEditModal(false);
                        setCurrentService(null);
                    }}
                    service={currentService}
                    onSave={handleUpdateService}
                    isEditMode={true}
                />
            )}
        </div>
    );
}

export default AdminDashboard;