import { useState, useEffect } from "react";
import axios from "axios";
import { getParentData } from "../../../../api/service/parent/ParentService";
import parentImage from "../../../../images/boy.png";

const ParentDetailsCard = () => {
  const parentId = localStorage.getItem("parentId");
  const [parent, setParent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [parentDetails, setParentDetails] = useState({
    parentName: "",
    parentEmail: "",
    parentMobile: "",
    parentPin: "",
  });

  useEffect(() => {
    const fetchParentData = async () => {
      try {
        const response = await getParentData(parentId);
        setParent(response.data.parent);
        setParentDetails(response.data.parent);
      } catch (error) {
        console.error("Error fetching parent data:", error);
      }
    };

    fetchParentData();
  }, [parentId]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setParentDetails(parent);
  };

  const handleSaveClick = async () => {
    try {
      setIsSubmitting(true);
      
    
      const firstName = document.querySelector('input[name="firstName"]').value;
      const lastName = document.querySelector('input[name="lastName"]').value;
      const fullName = `${firstName} ${lastName}`.trim();
      
      const updatedDetails = {
        ...parentDetails,
        parentName: fullName,
      };

      const response = await axios.put(`/api/parents/${parentId}`, updatedDetails);
      
      if (response.data.success) {
        setParent(response.data.parent);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error saving parent details:", error);
      alert("Failed to save changes. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setParentDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!parent) return <div>Loading...</div>;

  return (
    <div className="max-w-[580px] mx-auto bg-white border border-primary rounded-xl shadow-md">
      <div className="p-6">
     
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <div className="relative">
              <img 
                src={parentImage} 
                alt="Profile" 
                className="w-12 h-12 rounded-full object-cover" 
              />
              <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                <svg className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-primary">{parent.parentName}</h2>
              <p className="text-sm text-primary">{parent.parentEmail}</p>
            </div>
          </div>
          {!isEditing && (
            <button
              onClick={handleEditClick}
              className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              Edit Profile
            </button>
          )}
        </div>

     
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First name</label>
              <input
                type="text"
                name="firstName"
                defaultValue={parentDetails.parentName.split(' ')[0]}
                disabled={!isEditing}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last name</label>
              <input
                type="text"
                name="lastName"
                defaultValue={parentDetails.parentName.split(' ')[1] || ''}
                disabled={!isEditing}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
            <input
              type="email"
              name="parentEmail"
              value={parentDetails.parentEmail}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mobile number</label>
            <input
              type="tel"
              name="parentMobile"
              value={parentDetails.parentMobile}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
            />
          </div>

          {isEditing && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Profile photo</label>
              <div className="flex items-center gap-4">
                <button className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Change photo
                </button>
              </div>
            </div>
          )}
        </div>

     
        {isEditing && (
          <div className="flex items-center justify-end mt-8 pt-6 border-t border-gray-200 space-x-3">
            <button
              onClick={handleCancelClick}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveClick}
              disabled={isSubmitting}
              className="px-6 py-2 text-sm text-white bg-primary rounded-lg hover:bg-primary transition-colors disabled:bg-primary"
            >
              {isSubmitting ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentDetailsCard;