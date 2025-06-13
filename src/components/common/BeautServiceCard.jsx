import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth, selectAuthRole, selectIsAuthenticated } from '../../../features/auth-slice';

const BeautServiceCard = ({ service }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get auth state using selectors
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const role = useSelector(selectAuthRole);

  const handleBookNow = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      // First check if we need to refresh auth state
      if (!isAuthenticated) {
        const resultAction = dispatch(checkAuth());
        
        if (checkAuth.fulfilled.match(resultAction)) {
          // User is authenticated but not a customer
          if (resultAction.payload.role !== 'CUSTOMER') {
            navigate('/login', {
              state: { 
                fromServiceId: service.id,
                message: 'Please login as a customer to book services'
              },
            });
            return;
          }
        } else {
          // Not authenticated at all
          navigate('/login', {
            state: { 
              fromServiceId: service.id,
              message: 'Please login to book this service'
            },
          });
          return;
        }
      }

      // If we get here, user is authenticated as customer
      if (role !== 'CUSTOMER') {
        navigate('/login', {
          state: { 
            fromServiceId: service.id,
            message: 'Please login as a customer to book services'
          },
        });
        return;
      }

      // Proceed to booking wizard
      navigate(`/booking/${service.id}`, {
        state: {
          serviceId: service.id,
          serviceName: service.serviceName,
          price: service.price,
          image: service.image,
          description: service.description,
          categoryName: service.categoryName,
        },
      });

    } catch (err) {
      console.error("Booking auth check error:", err);
      navigate('/login', {
        state: { 
          fromServiceId: service.id,
          message: 'Authentication check failed, please login again'
        },
      });
    }
  };

  const handleViewDetails = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('View details for:', { 
      id: service.id, 
      name: service.serviceName 
    });
    // Consider implementing actual detail view navigation
    // navigate(`/services/${service.id}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col border border-gray-100">
      <div className="h-48 w-full bg-gray-100 overflow-hidden">
        {service.image ? (
          <img 
            src={service.image.startsWith('data:') ? service.image : `data:image/jpeg;base64,${service.image}`}
            alt={service.serviceName}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x200?text=Service+Image';
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-pink-50 to-purple-50 flex items-center justify-center">
            <span className="text-gray-400">No Image</span>
          </div>
        )}
      </div>
      
      <div className="p-4 flex-grow flex flex-col">
        <div className="flex-grow">
          <h3 className="text-lg font-semibold mb-2 text-gray-800">
            {service.serviceName}
          </h3>
          <p className="text-sm text-gray-500 mb-2">
            {service.categoryName}
          </p>
          <div className="flex justify-between items-center mb-3">
            <span className="text-lg font-bold text-pink-600">
              ₦{parseFloat(service.price).toLocaleString('en-NG')}
            </span>
            <span className={`px-2 py-1 text-xs rounded-full ${
              service.status === 'Available' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {service.status}
            </span>
          </div>
        </div>
        
        <div className="flex justify-between mt-auto">
          <button 
            onClick={handleBookNow}
            className="bg-pink-600 hover:bg-pink-700 text-white py-2 px-4 rounded-lg transition-colors text-sm"
            aria-label={`Book ${service.serviceName}`}
          >
            Book Now
          </button>
          <button 
            onClick={handleViewDetails}
            className="text-sm text-blue-500 hover:underline"
            aria-label={`View details for ${service.serviceName}`}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

BeautServiceCard.propTypes = {
  service: PropTypes.shape({
    id: PropTypes.number.isRequired,
    serviceName: PropTypes.string.isRequired,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    status: PropTypes.string.isRequired,
    image: PropTypes.string,
    categoryName: PropTypes.string,
    description: PropTypes.string
  }).isRequired
};

export default BeautServiceCard;