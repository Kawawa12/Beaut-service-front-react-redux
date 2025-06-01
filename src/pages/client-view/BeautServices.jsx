import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllServices } from '../../../features/service-slice';
import BeautServiceCard from '../../components/common/BeautServiceCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ServiceHeader from '../../components/common/ServiceHeader';

const BeautServiceList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { services, loading, error } = useSelector((state) => state.services);

  useEffect(() => {
    dispatch(fetchAllServices());
  }, [dispatch]);

  if (loading) return <LoadingSpinner message="Loading services..." />;
  if (error) return <ErrorMessage message={`Error loading services: ${error}`} />;

  const availableServices = services.filter(s => s.status === 'Available');

  return (
    <div className="overflow-y-auto">
      {/* Full-width Header */}
      <div className="w-full">
        <ServiceHeader />
      </div>

      {/* Content Container */}
      <div className="container mx-auto px-4 mt-30 py-8">
        <div className="flex justify-between items-center mb-8">
          <button 
            onClick={() => navigate(-1)} // Go back to previous page
            className="flex items-center text-pink-600 hover:text-pink-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back
          </button>
          <h1 className="text-3xl font-bold text-center text-pink-600">🧖 Available Beauty Services</h1>
          <div className="w-20"></div> {/* Spacer for alignment */}
        </div>
        
        {availableServices.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {availableServices.map((service) => (
              <BeautServiceCard 
                key={service.id}
                service={service} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500 text-lg">No available services at the moment</p>
            <button 
              onClick={() => dispatch(fetchAllServices())}
              className="mt-4 px-4 py-2 bg-pink-100 text-pink-600 rounded-lg hover:bg-pink-200"
            >
              Refresh Services
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BeautServiceList;