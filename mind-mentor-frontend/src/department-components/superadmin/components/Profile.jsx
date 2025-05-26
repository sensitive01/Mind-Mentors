import { Calendar, Edit, Eye, EyeOff, Link as LinkIcon, Lock, Mail, MapPin, Save, X } from 'lucide-react';
import React, { useState } from 'react';
import {  changePassword } from '../../../api/service/employee/EmployeeService';

const ProfileView = () => {
  // Fixed typo in localStorage
  const empId = localStorage.getItem("empId");
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showSaveMessage, setShowSaveMessage] = useState(false);
  const [isPasswordResetModalOpen, setIsPasswordResetModalOpen] = useState(false);
  const [passwordResetForm, setPasswordResetForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordVisibility, setPasswordVisibility] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [passwordResetError, setPasswordResetError] = useState('');
  // Added success message state for password reset
  const [passwordResetSuccess, setPasswordResetSuccess] = useState(false);
  
  const initialProfile = {
    name: "Super Admin mindmentorz",
    role: "Super Admin Manager at mindmentorz",
    avatar: "https://img.freepik.com/premium-vector/man-professional-business-casual-young-avatar-icon-illustration_1277826-623.jpg?w=740",
    location: "San Francisco, CA",
    email: "superadmin@mindmentorz.com",
    joinDate: "January 2024",
    website: "www.mindmentorz.superadmin",
    bio: "Committed to ensuring seamless and efficient Super Admin for clients. Over 10 years of experience in operational excellence, client satisfaction, and Renewal lifecycle management.",
    stats: [
      { label: "Projects Delivered", value: "124" },
      { label: "Clients Served", value: "75" },
      { label: "Satisfaction Rate", value: "98%" }
    ]
  };
  
  const [profile, setProfile] = useState(initialProfile);
  const [editedProfile, setEditedProfile] = useState(initialProfile);
  
  // Validate password strength
  const validatePasswordStrength = (password) => {
    const minLength = 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    
    if (password.length < minLength) {
      return "Password must be at least 8 characters long";
    }
    
    if (!hasUppercase) {
      return "Password must contain at least one uppercase letter";
    }
    
    if (!hasLowercase) {
      return "Password must contain at least one lowercase letter";
    }
    
    if (!hasNumber) {
      return "Password must contain at least one number";
    }
    
    if (!hasSpecialChar) {
      return "Password must contain at least one special character";
    }
    
    return "";
  };
  
  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
    setShowSaveMessage(true);
    setTimeout(() => setShowSaveMessage(false), 3000);
  };
  
  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };
  
  const handleChange = (field, value) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handlePasswordResetChange = (field, value) => {
    setPasswordResetForm(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    setPasswordResetError('');
    
    // Real-time validation for new password field
    if (field === 'newPassword' && value) {
      const error = validatePasswordStrength(value);
      if (error) {
        setPasswordResetError(error);
      }
    }
    
    // Real-time validation for password match
    if (field === 'confirmPassword' && value) {
      if (passwordResetForm.newPassword !== value) {
        setPasswordResetError('New passwords do not match');
      }
    }
  };

  const togglePasswordVisibility = (field) => {
    setPasswordVisibility(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handlePasswordReset = async(e) => {
    e.preventDefault();
    
    // Reset any previous messages
    setPasswordResetError('');
    
    // Basic validation
    if (!passwordResetForm.currentPassword || !passwordResetForm.newPassword || !passwordResetForm.confirmPassword) {
      setPasswordResetError('All fields are required');
      return;
    }

    if (passwordResetForm.newPassword !== passwordResetForm.confirmPassword) {
      setPasswordResetError('New passwords do not match');
      return;
    }

    // Password strength validation
    const strengthError = validatePasswordStrength(passwordResetForm.newPassword);
    if (strengthError) {
      setPasswordResetError(strengthError);
      return;
    }

    // Here you would typically call an API to reset the password
    console.log('Password reset submitted', {
      currentPassword: passwordResetForm.currentPassword,
      newPassword: passwordResetForm.newPassword,
      empId: empId
    });

    const response = await changePassword(passwordResetForm.currentPassword,passwordResetForm.newPassword,empId)
    
    // Show success message and close modal after a delay
    setPasswordResetSuccess(true);
    
    setTimeout(() => {
      setIsPasswordResetModalOpen(false);
      setPasswordResetSuccess(false);
      setPasswordResetForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }, 2000);
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto relative" style={{marginTop:'50px'}}>
    {/* Save Message Toast */}
    <div 
      className={`fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 ${
        showSaveMessage ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'
      }`}
    >
      Profile saved successfully!
    </div>

    {/* Password Reset Modal */}
    {isPasswordResetModalOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
            <Lock className="w-6 h-6 mr-3 text-blue-500" />
            Reset Password
          </h2>
          {passwordResetSuccess ? (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              Password reset successful!
            </div>
          ) : (
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div className="relative">
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <div className="flex items-center">
                  <input
                    type={passwordVisibility.current ? 'text' : 'password'}
                    id="currentPassword"
                    value={passwordResetForm.currentPassword}
                    onChange={(e) => handlePasswordResetChange('currentPassword', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('current')}
                    className="ml-2 text-gray-500 hover:text-gray-700"
                  >
                    {passwordVisibility.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div className="relative">
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="flex items-center">
                  <input
                    type={passwordVisibility.new ? 'text' : 'password'}
                    id="newPassword"
                    value={passwordResetForm.newPassword}
                    onChange={(e) => handlePasswordResetChange('newPassword', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="ml-2 text-gray-500 hover:text-gray-700"
                  >
                    {passwordVisibility.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div className="relative">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="flex items-center">
                  <input
                    type={passwordVisibility.confirm ? 'text' : 'password'}
                    id="confirmPassword"
                    value={passwordResetForm.confirmPassword}
                    onChange={(e) => handlePasswordResetChange('confirmPassword', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="ml-2 text-gray-500 hover:text-gray-700"
                  >
                    {passwordVisibility.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              {passwordResetError && (
                <div className="text-red-500 text-sm mt-2 p-2 bg-red-50 border border-red-200 rounded">
                  {passwordResetError}
                </div>
              )}
              <div className="flex space-x-4 mt-6">
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors duration-300 flex items-center justify-center"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Reset Password
                </button>
                <button
                  type="button"
                  onClick={() => setIsPasswordResetModalOpen(false)}
                  className="w-full bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300 transition-colors duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    )}

    <div 
      className={`bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-500 transform ${
        isHovered ? 'scale-[1.02]' : 'scale-100'
      } ${isEditing ? 'ring-2 ring-blue-400' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header Section */}
      <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600" >
        <div className="absolute -bottom-16 left-8">
          <div className="relative">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg transition-transform duration-300 hover:scale-105"
            />
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="absolute bottom-2 right-2 bg-blue-500 p-2 rounded-full shadow-lg hover:bg-blue-600 transition-all duration-300 hover:scale-110"
            >
              <Edit className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>
      {/* Profile Content */}
      <div className="pt-20 px-8 pb-8">
        <div className="flex justify-between items-start mb-6">
          <div className="space-y-1">
            {isEditing ? (
              <input
                type="text"
                value={editedProfile.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="text-2xl font-bold text-gray-900 border-b-2 border-blue-400 focus:outline-none focus:border-blue-600 transition-colors duration-200"
              />
            ) : (
              <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
            )}
            {isEditing ? (
              <input
                type="text"
                value={editedProfile.role}
                onChange={(e) => handleChange('role', e.target.value)}
                className="text-gray-600 border-b-2 border-blue-400 focus:outline-none focus:border-blue-600 transition-colors duration-200"
              />
            ) : (
              <p className="text-gray-600">{profile.role}</p>
            )}
          </div>
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <button 
                  onClick={handleSave}
                  className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-all duration-300 hover:scale-105 flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save</span>
                </button>
                <button 
                  onClick={handleCancel}
                  className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-all duration-300 hover:scale-105 flex items-center space-x-2"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
              </>
            ) : (
              <>
                <button className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-all duration-300 hover:scale-105">
                  Follow
                </button>
                <button 
                  onClick={() => setIsPasswordResetModalOpen(true)}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-300 transition-all duration-300 hover:scale-105"
                >
                  Reset Password
                </button>
              </>
            )}
          </div>
        </div>
        {isEditing ? (
          <textarea
            value={editedProfile.bio}
            onChange={(e) => handleChange('bio', e.target.value)}
            className="w-full h-24 text-gray-700 mb-6 border-2 border-blue-400 rounded-lg p-2 focus:outline-none focus:border-blue-600 transition-colors duration-200"
          />
        ) : (
          <p className="text-gray-700 mb-6">{profile.bio}</p>
        )}
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {profile.stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-4 rounded-lg bg-gray-50 hover:bg-white transition-all duration-300 hover:scale-105"
            >
              <div className="text-xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
        {/* Contact Info */}
        <div className="space-y-3">
          {[
            { icon: MapPin, field: 'location' },
            { icon: Mail, field: 'email' },
            { icon: Calendar, field: 'joinDate' },
            { icon: LinkIcon, field: 'website' }
          ].map((item, index) => (
            <div key={index} className="flex items-center text-gray-600">
              <item.icon className="w-5 h-5 mr-3 text-gray-400" />
              {isEditing ? (
                <input
                  type="text"
                  value={editedProfile[item.field]}
                  onChange={(e) => handleChange(item.field, e.target.value)}
                  className="border-b-2 border-blue-400 focus:outline-none focus:border-blue-600 transition-colors duration-200"
                />
              ) : (
                profile[item.field]
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
  );
};

export default ProfileView;