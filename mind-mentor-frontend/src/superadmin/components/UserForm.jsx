import { Button } from '@mui/material';
import { Mail, UserCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Link, useParams } from 'react-router-dom';
// import { createUser , updateUser  } from '../../../api/User/UserMaster';

const UserMasterForm = () => {
  const { id } = useParams(); 
  const [formData, setFormData] = useState({
    userId: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    address: '',
    emergencyContactName: '',
    emergencyContactNumber: '',
    profilePicture: null
  });

  useEffect(() => {
    if (id) {
      // Fetch user data if ID is present (edit mode)
      userMasterInstance
        .get(`/user/${id}`)
        .then((response) => setFormData(response.data))
        .catch((error) => console.error('Error fetching user:', error));
    }
  }, [id]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, profilePicture: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSubmit = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null) {
          formDataToSubmit.append(key, formData[key]);
        }
      });

      if (id) {
        // Update user
        await updateUser (id, formDataToSubmit);
      } else {
        // Create new user
        await createUser (formDataToSubmit);
      }
      alert('User  data submitted successfully!');
    } catch (error) {
      console.error('Error submitting user data:', error);
      alert('There was an error submitting the user data.');
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-[#642b8f] to-[#aa88be] p-8 text-white flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold mb-2">
              {id ? 'Edit User Data' : 'New User Data'}
            </h2>
            <p className="text-sm opacity-90">Please fill in all the required user information</p>
          </div>
          <Button
            variant="contained"
            color="#642b8f"
            component={Link}
            to="/users"
          >
            View Users
          </Button>
        </div>
        <form className="p-8" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {/* Left Column */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-[#642b8f] font-semibold text-lg pb-2 border-b-2 border-[#f8a213]">
                  Personal Information
                </h3>
                <div className="flex gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="User  ID"
                    className="flex-1 p-3 rounded-lg border-2 border-gray-300 focus:border-[#642b8f] focus:outline-none"
                    value={formData.userId}
                    onChange={(e) => handleInputChange('userId', e.target.value)}
                    required
                  />
                </div>
                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="First Name"
                    className="flex-1 p-3 rounded-lg border-2 border-gray-300 focus:border-[#642b8f] focus:outline-none"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    className=" flex-1 p-3 rounded-lg border-2 border-gray-300 focus:border-[#642b8f] focus:outline-none"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-[#642b8f]">
                  Contact Information
                </label>
                <div className="relative mb-4">
                  <input
                    type="email"
                    className="w-full p-3 rounded-lg border-2 border-gray-300 focus:border-[#642b8f] focus:outline-none pl-4 pr-10"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                  <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#642b8f]" />
                </div>
                <PhoneInput
                  country={'in'}
                  value={formData.phoneNumber}
                  onChange={(value) => handleInputChange('phoneNumber', value)}
                  inputProps={{
                    placeholder: 'Phone Number',
                    className: 'w-full p-3 rounded-lg !border-gray-300 focus:!border-[#642b8f]',
                  }}
                  containerClass="w-full border 2px"
                  buttonClass="!border-gray-300 !rounded-lg"
                  preferredCountries={['in']}
                />
              </div>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-[#642b8f] mb-2">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      className="w-full p-3 rounded-lg border-2 border-gray-300 focus:border-[#642b8f] focus:outline-none"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-[#642b8f] mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 rounded-lg border-2 border-gray-300 focus:border-[#642b8f] focus:outline-none"
                      placeholder="Address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-[#642b8f] font-semibold text-lg pb-2 border-b-2 border-[#f8a213]">
                  Emergency Contact
                </h3>
                <div className="flex gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Emergency Contact Name"
                    className="flex-1 p-3 rounded-lg border-2 border-gray-300 focus:border-[#642b8f] focus:outline-none"
                    value={formData.emergencyContactName}
                    onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
                    required
                  />
                  <PhoneInput
                    country={'in'}
                    value={formData.emergencyContactNumber}
                    onChange={(value) => handleInputChange('emergencyContactNumber', value)}
                    inputProps={{
                      placeholder: 'Emergency Contact Number',
                      className: 'flex-1 p-3 rounded-lg !border-gray-300 focus:!border-[#642b8f]',
                    }}
                    containerClass="flex-1 border 2px"
                    buttonClass="!border-gray-300 !rounded-lg"
                    preferredCountries={['in']}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-[#642b8f] font-semibold text-lg pb-2 border-b-2 border-[#f8a213]">
                  Profile Picture
                </h3>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="w-full p-3 rounded-lg border-2 border-gray-300 focus:border-[#642b8 f] focus:outline-none"
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-center gap-6 mt-12">
            <button
              type="submit"
              className="px-8 py-3 bg-[#642b8f] text-white rounded-lg font-medium hover:bg-[#aa88be] transition-colors shadow-lg hover:shadow-xl"
            >
              Submit User Data
            </button>
            <button
              type="reset"
              className="px-8 py-3 bg-white border-2 border-[#642b8f] text-[#642b8f] rounded-lg font-medium hover:bg-[#efe8f0] transition-colors"
            >
              Reset Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default UserMasterForm;


