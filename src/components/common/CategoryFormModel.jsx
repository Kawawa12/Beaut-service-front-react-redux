import { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { createCategory, updateCategory } from '../../../features/category-slice';
import Swal from 'sweetalert2';

const CategoryFormModal = ({ isOpen, onClose, category, isEditMode }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageFile: null
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditMode && category) {
      setFormData({
        name: category.name || '',
        description: category.description || '',
        imageFile: null
      });
      setPreviewImage(category.image ? `data:image/jpeg;base64,${category.image}` : null);
    } else {
      setFormData({ name: '', description: '', imageFile: null });
      setPreviewImage(null);
    }
  }, [isEditMode, category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image file size exceeds 5MB limit');
        return;
      }
      if (!['image/png', 'image/jpg', 'image/jpeg'].includes(file.type)) {
        setError('Only PNG, JPG, or JPEG files are allowed');
        return;
      }
      setFormData(prev => ({ ...prev, imageFile: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description || '');

      if (formData.imageFile) {
        formDataToSend.append('imageFile', formData.imageFile);
      }

      if (isEditMode) {
        await dispatch(updateCategory({ id: category.id, categoryData: formDataToSend })).unwrap();
        onClose(); // Close modal immediately
        Swal.fire({
          title: 'Success!',
          text: 'Category updated successfully',
          icon: 'success',
          confirmButtonText: 'OK',
          customClass: {
            confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md'
          }
        }).then(() => {
          window.location.reload(); // Refresh page after SweetAlert
        });
      } else {
        await dispatch(createCategory(formDataToSend)).unwrap();
        onClose(); // Close modal immediately
        Swal.fire({
          title: 'Success!',
          text: 'Category created successfully',
          icon: 'success',
          confirmButtonText: 'OK',
          customClass: {
            confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md'
          }
        }).then(() => {
          window.location.reload(); // Refresh page after SweetAlert
        });
      }

      setFormData({ name: '', description: '', imageFile: null });
      setPreviewImage(null);
    } catch (err) {
      const errorMessage = err.message || `Failed to ${isEditMode ? 'update' : 'create'} category`;
      setError(errorMessage);
      Swal.fire({
        title: 'Error!',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md'
        }
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-95 hover:scale-100">
        <div className="flex justify-between items-center border-b border-gray-100 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
          <h3 className="text-xl font-bold text-gray-800">{isEditMode ? 'Update Category' : 'Create New Category'}</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100"
            aria-label="Close modal"
            disabled={isSubmitting}
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded">
              <div className="flex items-center text-red-700">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">{error}</span>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="block w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200"
                placeholder="Enter category name"
                required
                disabled={isSubmitting}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="block w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200"
              rows="3"
              placeholder="Enter category description (optional)"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Image {isEditMode ? '' : <span className="text-red-500">*</span>}
            </label>
            <div className="flex items-center gap-4">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
                  <svg className="w-8 h-8 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, JPEG (Max. 5MB)
                  </p>
                </div>
                <input
                  type="file"
                  name="imageFile"
                  onChange={handleImageChange}
                  className="hidden"
                  accept="image/*"
                  required={!isEditMode}
                  disabled={isSubmitting}
                />
              </label>
              {previewImage && (
                <div className="relative">
                  <img 
                    src={previewImage} 
                    alt="Preview" 
                    className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewImage(null);
                      setFormData(prev => ({ ...prev, imageFile: null }));
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors duration-200"
                    aria-label="Remove image"
                    disabled={isSubmitting}
                  >
                    <FaTimes className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-5 py-2.5 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200 ${
                isSubmitting || !formData.name || (!formData.imageFile && !isEditMode)
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
              disabled={isSubmitting || !formData.name || (!formData.imageFile && !isEditMode)}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isEditMode ? 'Updating...' : 'Creating...'}
                </span>
              ) : (
                isEditMode ? 'Update Category' : 'Create Category'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryFormModal;