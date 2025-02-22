import { Edit, Save, X } from 'lucide-react';
import { useState } from 'react';
const ProfileView = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showSaveMessage, setShowSaveMessage] = useState(false);
  const initialProfile = {
    name: "Operations Mindmentoz",
    role: "Operational Manager at MindMentoz",
    avatar: "https://img.freepik.com/premium-vector/man-professional-business-casual-young-avatar-icon-illustration_1277826-623.jpg?w=740",
    email: "operations@mindmentoz.com",

  };
  const [profile, setProfile] = useState(initialProfile);
  const [editedProfile, setEditedProfile] = useState(initialProfile);
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
  return (
    <div className="w-full max-w-3xl mx-auto relative" style={{marginTop:'50px'}} >
      {/* Save Message Toast */}
      <div 
        className={`fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 ${
          showSaveMessage ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'
        }`}
      >
        Profile saved successfully!
      </div>
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
                <></>
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
  
        </div>
      </div>
    </div>
  );
};
export default ProfileView;
