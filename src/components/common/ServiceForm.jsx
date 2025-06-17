import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import LoadingSpinner from './LoadingSpinner';
import { fetchCategories } from '../../../features/category-slice';
import { updateBeautService,createBeautService } from '../../../features/service-slice';

const ServiceForm = ({ isOpen, onClose, service, isEditMode }) => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.categories);
  const { loading: serviceLoading, error } = useSelector((state) => state.services);

  const [form, setForm] = useState({
    catId: '',
    name: '',
    description: '',
    price: '',
    imageFile: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchCategories());
    if (isEditMode && service) {
      setForm({
        catId: service.categoryId || '',
        name: service.serviceName || '',
        description: service.description || '',
        price: service.price || '',
        imageFile: null,
      });
      setImagePreview(service.image ? `data:image/jpeg;base64,${service.image}` : null);
    }
  }, [dispatch, isEditMode, service]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'imageFile' && files && files[0]) {
      const file = files[0];
      setForm({ ...form, [name]: file });
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const serviceData = {
        catId: form.catId,
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        imageFile: form.imageFile,
      };

      if (isEditMode) {
        await dispatch(updateBeautService({ id: service.id, serviceData })).unwrap();
        Swal.fire({
          title: 'Success!',
          text: 'Service updated successfully',
          icon: 'success',
          confirmButtonText: 'OK',
          customClass: {
            confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md'
          }
        });
      } else {
        await dispatch(createBeautService(serviceData)).unwrap();
        Swal.fire({
          title: 'Success!',
          text: 'Service created successfully',
          icon: 'success',
          confirmButtonText: 'OK',
          customClass: {
            confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md'
          }
        });
      }
      
      setForm({
        catId: '',
        name: '',
        description: '',
        price: '',
        imageFile: null,
      });
      setImagePreview(null);
      onClose();
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.message || `Failed to ${isEditMode ? 'update' : 'create'} service`,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {isSubmitting && <LoadingSpinner />}
      
      <div className={`fixed inset-0 bg-black/20 bg-opacity-30 flex items-center justify-center z-50 backdrop-blur-sm ${isSubmitting ? 'pointer-events-none' : ''}`}>
        <div className={`bg-white p-6 rounded-lg shadow-xl w-full max-w-md mx-4 ${isSubmitting ? 'opacity-50' : ''}`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">{isEditMode ? 'Update Service' : 'Add New Service'}</h2>
            <button 
              onClick={onClose} 
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
              disabled={isSubmitting}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                name="catId"
                value={form.catId}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={isSubmitting}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter service name"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Enter description"
                rows="3"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                <input
                  type="text"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 pl-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service Image</label>
              <div className="flex items-center space-x-4">
                <label className={`flex flex-col items-center justify-center w-full px-4 py-6 border-2 border-dashed rounded-md cursor-pointer transition-colors ${
                  isSubmitting 
                    ? 'border-gray-200 bg-gray-50' 
                    : 'border-gray-300 hover:border-blue-500'
                }`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="mt-2 text-sm text-gray-600">Click to upload image</span>
                  <input
                    type="file"
                    name="imageFile"
                    onChange={handleChange}
                    className="hidden"
                    accept="image/*"
                    disabled={isSubmitting}
                  />
                </label>
              </div>
              {imagePreview && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500 mb-1">Image Preview:</p>
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="h-32 w-32 object-cover rounded-md border border-gray-200"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 flex items-center justify-center min-w-24"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isEditMode ? 'Updating...' : 'Saving...'}
                  </>
                ) : (
                  isEditMode ? 'Update Service' : 'Save Service'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ServiceForm;