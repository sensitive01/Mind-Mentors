import { Button } from '@mui/material';
import axios from "axios";
import { useState, useEffect } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Link, useParams } from 'react-router-dom';
import { createUser, updateUser,fetchUsersByName } from '../../api/service/employee/EmployeeService';

const EmployeeMasterForm = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    dateOfBirth: '',
    gender: '',
    profilePicture: null,
    bio: '',
    skills: [],
    education: [],
  });

  useEffect(() => {
    if (id) {
      fetchUserById(id);
    }
  }, [id]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSkillChange = (skill) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, profilePicture: file }));
  };

  const handleEducationChange = (index, field, value) => {
    const updatedEducation = [...formData.education];
    updatedEducation[index] = { ...updatedEducation[index], [field]: value };
    setFormData((prev) => ({ ...prev, education: updatedEducation }));
  };

  const handleAddEducation = () => {
    setFormData((prev) => ({
      ...prev,
      education: [...prev.education, { degree: '', institution: '', graduationYear: '' }]
    }));
  };

  const handleRemoveEducation = (index) => {
    const updatedEducation = formData.education.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, education: updatedEducation }));
  };

  const fetchUserById = async (id) => {
    const apiUrl = `${import.meta.env.VITE_BASE_URL_USER}get-user`; // Base URL for users
    try {
      const response = await axios.get(`${apiUrl}/${id}`); // Dynamically append the user ID
      console.log('Fetched User Data:', response.data);
      // Populate the form with fetched data
      setFormData(response.data);
    } catch (error) {
      console.error('Error fetching user by ID:', error.response ? error.response.data : error.message);
      alert('There was an error fetching the user data.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Prepare the data to be submitted
      const formDataToSubmit = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        profilePicture: formData.profilePicture,
        bio: formData.bio,
        skills: formData.skills,
        education: formData.education,
      };
  
      let response;
      if (formData.id) {
        // Update user if an ID exists
        response = await updateUser(formData.id, formDataToSubmit);
        console.log('User updated:', response.data);
        alert('User updated successfully!');
      } else {
        // Create a new user otherwise
        response = await createUser(formDataToSubmit);
        alert('Data submitted successfully!');

        console.log('Response:', response.data);
      }
  
      // Clear form data after a timeout
      setTimeout(() => {
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phoneNumber: '',
          address: '',
          dateOfBirth: '',
          gender: '',
          profilePicture: null,
          bio: '',
          skills: [],
          education: [],
        });
      }, 20);
      alert('Form Data reset successfully!');

    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
      // alert('There was an error submitting the data.');
    }
  };
  

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-[#642b8f] to-[#aa88be] p-8 text-white flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold mb-2">
              {formData.id ? 'Edit User Data' : 'New User Data'}
            </h2>
            <p className="text-sm opacity-90">Please fill in all the required user information</p>
          </div>
          <Button
            variant="contained"
            style={{ backgroundColor: '#642b8f', color: 'white' }}
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
                    placeholder="First Name"
                    className="flex-1 p-3 rounded-lg border-2 border-gray-300 focus:border-[#642b8f] focus:outline-none"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    className="flex-1 p-3 rounded-lg border-2 border-gray-300 focus:border-[#642b8f] focus:outline-none"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    required
                  />
                </div>
                <div className="flex gap-4">
                  <input
                    type="email"
                    placeholder="Email"
                    className="flex-1 p-3 rounded-lg border-2 border-gray-300 focus:border-[#642b8f] focus:outline-none"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                  <PhoneInput
                    country={'in'}
                    value={formData.phoneNumber}
                    onChange={(value) => handleInputChange('phoneNumber', value)}
                    inputProps={{
                      placeholder: 'Phone Number',
                      className: 'flex-1 p-3 rounded-lg !border-gray-300 focus:!border-[#642b8f]',
                    }}
                    containerClass="flex-1"
                    buttonClass="!border-gray-300 !rounded-lg"
                    preferredCountries={['in']}
                  />
                </div>
                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="Address"
                    className="flex-1 p-3 rounded-lg border-2 border-gray-300 focus:border-[#642b8f] focus:outline-none"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    required
                  />
                  <input
                    type="date"
                    className="flex-1 p-3 rounded-lg border-2 border-gray-300 focus:border-[#642b8f] focus:outline-none"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    required
                  />
                </div>
                <select
                  className="w-full p-3 rounded-lg border-2 border-gray-300 focus:border-[#642b8f] focus:outline-none bg-white"
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="space-y-4">
                <h3 className="text-[#642b8f] font-semibold text-lg pb-2 border-b-2 border-[#f8a213]">
                  Profile Picture
                </h3>
                {/* <input
                  type="file"
                  name='profilePicture'
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="w-full p-3 rounded-lg border-2 border-gray-300 focus:border-[#642b8f] focus:outline-none"
                /> */}
              </ div>
            </div>
            {/* Right Column */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-[#642b8f] font-semibold text-lg pb-2 border-b-2 border-[#f8a213]">
                  Bio
                </h3>
                <textarea
                  placeholder="Short Biography"
                  className="w-full p-3 rounded-lg border-2 border-gray-300 focus:border-[#642b8f] focus:outline-none"
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                />
              </div>
              <div className="space-y-4">
                <h3 className="text-[#642b8f] font-semibold text-lg pb-2 border-b-2 border-[#f8a213]">
                  Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['React', 'Node.js', 'Python', 'JavaScript', 'SQL', 'Cloud', 'DevOps'].map(skill => (
                    <div key={skill} className="flex items-center">
                      <input
                        type="checkbox"
                        id={skill}
                        checked={formData.skills.includes(skill)}
                        onChange={() => handleSkillChange(skill)}
                        className="mr-2"
                      />
                      <label htmlFor={skill}>{skill}</label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-[#642b8f] font-semibold text-lg pb-2 border-b-2 border-[#f8a213]">
                  Education
                </h3>
                {formData.education.map((edu, index) => (
                  <div key={index} className="flex gap-4 mb-4">
                    <input
                      type="text"
                      placeholder="Degree"
                      className="flex-1 p-3 rounded-lg border-2 border-gray-300 focus:border-[#642b8f] focus:outline-none"
                      value={edu.degree}
                      onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Institution"
                      className="flex-1 p-3 rounded-lg border-2 border-gray-300 focus:border-[#642b8f] focus:outline-none"
                      value={edu.institution}
                      onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                      required
                    />
                    <input
                      type="number"
                      placeholder="Year of Graduation"
                      className="flex-1 p-3 rounded-lg border-2 border-gray-300 focus:border-[#642b8f] focus:outline-none"
                      value={edu.graduationYear}
                      onChange={(e) => handleEducationChange(index, 'graduationYear', e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveEducation(index)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddEducation}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg"
                >
                  Add Education
                </button>
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

export default EmployeeMasterForm