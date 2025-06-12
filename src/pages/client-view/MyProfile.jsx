import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchClientProfile } from '../../../features/client-slice';
import { FaEdit, FaSave, FaTimes, FaArrowLeft } from 'react-icons/fa';

const MyProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profile, loading, error } = useSelector((state) => state.client);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
  });
  const [errors, setErrors] = useState({
    fullName: false,
    email: false,
    phone: false,
  });

  useEffect(() => {
    dispatch(fetchClientProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || '',
        email: profile.email || '',
        phone: profile.phone || '',
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Basic validation
    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setErrors({
        ...errors,
        email: !emailRegex.test(value),
      });
    } else if (name === 'phone') {
      const phoneRegex = /^[0-9]{10,15}$/;
      setErrors({
        ...errors,
        phone: !phoneRegex.test(value),
      });
    } else if (name === 'fullName') {
      setErrors({
        ...errors,
        fullName: value.trim().length < 2,
      });
    }
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
    if (profile) {
      setFormData({
        fullName: profile.fullName,
        email: profile.email,
        phone: profile.phone,
      });
    }
    setErrors({
      fullName: false,
      email: false,
      phone: false,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate all fields before submission
    const newErrors = {
      fullName: formData.fullName.trim().length < 2,
      email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email),
      phone: !/^[0-9]{10,15}$/.test(formData.phone),
    };

    setErrors(newErrors);

    if (!Object.values(newErrors).some(Boolean)) {
      // Here you would typically dispatch an update action
      console.log('Submitting:', formData);
      // Simulate API call
      setTimeout(() => {
        setEditMode(false);
      }, 1000);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const getInitials = (name) => {
    if (!name) return '';
    const names = name.split(' ');
    return names.map(n => n[0]).join('').toUpperCase();
  };

  if (loading && !profile) {
    return (
      <div className="flex justify-center mt-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-pink-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-700">
        <p className="text-red-500 text-center text-lg">Error loading profile: {error}</p>
      </div>
    );
  }

  return (
    <div className="py-6">
      <style>
        {`
          .profile-input {
            width: 100%;
            padding: 12px;
            margin-bottom: 1.5rem;
            border: 2px solid ${editMode ? '#f472b6' : '#4b5563'};
            border-radius: 8px;
            background-color: ${editMode ? '#1f2937' : '#374151'};
            color: white;
            font-size: 1rem;
            transition: all 0.3s ease;
          }
          .profile-input:disabled {
            background-color: #4b5563;
            color: #9ca3af;
          }
          .profile-input:focus {
            outline: none;
            border-color: #f472b6;
            box-shadow: 0 0 0 3px rgba(244, 114, 182, 0.2);
          }
          .error {
            border-color: #ef4444;
          }
          .error-text {
            color: #ef4444;
            font-size: 0.875rem;
            margin-top: -1rem;
            margin-bottom: 1rem;
          }
          .avatar {
            width: 120px;
            height: 120px;
            background-color: #f472b6;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 48px;
            border-radius: 50%;
            color: white;
            margin: 0 auto 1.5rem;
          }
        `}
      </style>
      <div className="max-w-xl mx-auto bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-700">
        <div className="flex justify-start mb-4">
          <button
            onClick={handleGoBack}
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
          >
            <FaArrowLeft className="mr-2" />
            Go Back
          </button>
        </div>
        <div className="avatar">{getInitials(formData.fullName)}</div>
        <h2 className="text-3xl font-bold text-white text-center mb-6">My Profile</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="fullName" className="block text-gray-300 mb-2 text-sm font-medium">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={`profile enter code here-input ${errors.fullName ? 'error' : ''}`}
              disabled={!editMode}
            />
            {errors.fullName && (
              <p className="error-text">Please enter a valid name</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-gray-300 mb-2 text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`profile-input ${errors.email ? 'error' : ''}`}
              disabled={!editMode}
            />
            {errors.email && (
              <p className="error-text">Please enter a valid email</p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-gray-300 mb-2 text-sm font-medium">
              Phone Number
            </label>
            <input
              id="phone"
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`profile-input ${errors.phone ? 'error' : ''}`}
              disabled={!editMode}
            />
            {errors.phone && (
              <p className="error-text">Please enter a valid phone number (10-15 digits)</p>
            )}
          </div>

          <div className="flex justify-end gap-4 mt-6">
            {editMode ? (
              <>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                >
                  <FaTimes className="mr-2" />
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={Object.values(errors).some(Boolean)}
                  className={`flex items-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition ${
                    Object.values(errors).some(Boolean) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <FaSave className="mr-2" />
                  Save Changes
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleEdit}
                className="flex items-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition"
              >
                <FaEdit className="mr-2" />
                Edit Profile
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default MyProfile;