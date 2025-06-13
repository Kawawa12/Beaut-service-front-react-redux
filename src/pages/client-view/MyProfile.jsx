import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchClientProfile, updateClientProfile } from '../../../features/client-slice';
import { FaEdit, FaSave, FaTimes, FaArrowLeft, FaUser, FaEnvelope, FaPhone } from 'react-icons/fa';
import Swal from 'sweetalert2';

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
    const newErrors = {
      fullName: formData.fullName.trim().length < 2,
      email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email),
      phone: !/^[0-9]{10,15}$/.test(formData.phone),
    };

    setErrors(newErrors);

    if (!Object.values(newErrors).some(Boolean)) {
      dispatch(updateClientProfile(formData))
        .unwrap()
        .then(() => {
          Swal.fire({
            title: 'Success!',
            text: 'Profile updated successfully',
            icon: 'success',
            confirmButtonColor: '#ec4899',
          });
          setEditMode(false);
        })
        .catch((err) => {
          Swal.fire({
            title: 'Error!',
            text: err || 'Failed to update profile',
            icon: 'error',
            confirmButtonColor: '#ec4899',
          });
        });
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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-pink-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="max-w-md w-full bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-700">
          <p className="text-red-400 text-center text-lg">Error loading profile: {error}</p>
          <button
            onClick={handleGoBack}
            className="mt-4 w-full px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition flex items-center justify-center"
          >
            <FaArrowLeft className="mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={handleGoBack}
          className="flex items-center px-4 py-2 mb-6 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition shadow-md"
        >
          <FaArrowLeft className="mr-2" />
          Go Back
        </button>

        <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-700">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-pink-600 to-purple-600 p-6 text-center">
            <div className="relative mx-auto w-32 h-32 rounded-full bg-white bg-opacity-20 flex items-center justify-center shadow-lg border-4 border-white border-opacity-20">
              {profile?.photoUrl ? (
                <img 
                  src={profile.photoUrl} 
                  alt="Profile" 
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-4xl font-bold text-white">
                  {getInitials(formData.fullName)}
                </span>
              )}
              {editMode && (
                <button className="absolute bottom-0 right-0 bg-pink-500 rounded-full p-2 hover:bg-pink-600 transition shadow-md">
                  <FaEdit className="text-white text-sm" />
                </button>
              )}
            </div>
            <h2 className="text-3xl font-bold text-white mt-4">My Profile</h2>
            <p className="text-pink-100 mt-1">Member since {new Date(profile?.createdAt).toLocaleDateString()}</p>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8">
            <div className="space-y-6">
              {/* Full Name Field */}
              <div className="relative">
                <div className="flex items-center mb-2">
                  <FaUser className="text-pink-500 mr-2" />
                  <label htmlFor="fullName" className="block text-gray-300 text-sm font-medium">
                    Full Name
                  </label>
                </div>
                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 pl-10 bg-gray-700 border ${
                    editMode 
                      ? errors.fullName 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-pink-500 focus:ring-pink-500'
                      : 'border-gray-600 focus:ring-gray-500'
                  } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition`}
                  disabled={!editMode}
                  placeholder="Enter your full name"
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-400">Please enter a valid name (at least 2 characters)</p>
                )}
              </div>

              {/* Email Field */}
              <div className="relative">
                <div className="flex items-center mb-2">
                  <FaEnvelope className="text-pink-500 mr-2" />
                  <label htmlFor="email" className="block text-gray-300 text-sm font-medium">
                    Email
                  </label>
                </div>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 pl-10 bg-gray-700 border ${
                    editMode 
                      ? errors.email 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-pink-500 focus:ring-pink-500'
                      : 'border-gray-600 focus:ring-gray-500'
                  } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition`}
                  disabled={!editMode}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-400">Please enter a valid email address</p>
                )}
              </div>

              {/* Phone Field */}
              <div className="relative">
                <div className="flex items-center mb-2">
                  <FaPhone className="text-pink-500 mr-2" />
                  <label htmlFor="phone" className="block text-gray-300 text-sm font-medium">
                    Phone Number
                  </label>
                </div>
                <input
                  id="phone"
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 pl-10 bg-gray-700 border ${
                    editMode 
                      ? errors.phone 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-pink-500 focus:ring-pink-500'
                      : 'border-gray-600 focus:ring-gray-500'
                  } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition`}
                  disabled={!editMode}
                  placeholder="Enter your phone number"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-400">Please enter a valid phone number (10-15 digits)</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-700">
              {editMode ? (
                <>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex items-center px-6 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition shadow-md"
                  >
                    <FaTimes className="mr-2" />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={Object.values(errors).some(Boolean)}
                    className={`flex items-center px-6 py-2.5 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition shadow-md ${
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
                  className="flex items-center px-6 py-2.5 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition shadow-md"
                >
                  <FaEdit className="mr-2" />
                  Edit Profile
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;