import { Button } from '@mui/material';
import { Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createEmployee, updateUser, fetchUsersByName } from '../../api/service/employee/EmployeeService';
import { useEffect, useState } from 'react';

const UserMasterForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    department: '',
    employmentType: ''
  });

  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    confirmPassword: false
  });

  const departments = [
    'Service',
    'Renewal',
    'Operations',
    'Center',
    'Executive',
    'Marketing'
  ];

  const employmentTypes = [
    'Full-Time',
    'Part-Time',
    'Contract',
    'Internship',
    'Temporary'
  ];

  const [users, setUsers] = useState([]);

  // Handle input change
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'selectedUser') {
      const selectedUser = users.find(user => user._id === value);
      if (selectedUser) {
        setFormData(prev => ({
          ...prev,
          firstName: selectedUser.firstName,
          lastName: selectedUser.lastName,
          email: selectedUser.email,
        }));
      }
    }
  };


  const togglePasswordVisibility = (field) => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  useEffect(() => {
    const getUsers = async () => {
      try {
        const userData = await fetchUsersByName();
        setUsers(userData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    getUsers();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Log both passwords to ensure they are being received correctly
    console.log('Password:', formData.password);
    console.log('Confirm Password:', formData.confirmPassword);
  
    // Password validation (ensure both fields match)
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
  
    try {
      // Prepare the form data to send to the backend (include confirmPassword)
      const formDataToSubmit = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password, // Send password to the backend
        confirmPassword: formData.confirmPassword, // Send confirmPassword to the backend
        department: formData.department,
        employmentType: formData.employmentType,
      };
  
      // Check if we have a selected user (for updating an existing user)
      if (formData.id) {
        // If there's an ID, it means we are updating an existing employee
        await updateUser(formData.id, formDataToSubmit);
      } else {
        // Otherwise, we are creating a new employee
        await createEmployee(formDataToSubmit);
      }
  
      alert('Employee data submitted successfully!');
    } catch (error) {
      console.error('Error submitting employee data:', error);
      alert('There was an error submitting the employee data.');
    }
  };
  
  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-[#642b8f] to-[#aa88be] p-8 text-white flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold mb-2">
              {formData.id ? 'Edit User Data' : 'New Employee Data'}
            </h2>
            <p className="text-sm opacity-90">Please fill in all the required user information</p>
          </div>
          <Button
            variant="contained"
            style={{ backgroundColor: '#642b8f', color: 'white' }}
            component={Link}
            to="/employees"
          >
            View Employees
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
                  <select
                    className="w-1/2 p-3 rounded-lg border-2 border-gray-300 focus:border-[#642b8f] focus:outline-none bg-white"
                    value={formData.selectedUser || ''}  // Bind the selected user ID
                    onChange={(e) => handleInputChange('selectedUser', e.target.value)}  // Update the selected user ID
                  >
                    <option value="">Select User</option>
                    {users.map(user => (
                      <option key={user._id} value={user._id}>
                        {user.firstName} {user.lastName}
                      </option>
                    ))}
                  </select>
                  <select
                    className="w-1/2 p-3 rounded-lg border-2 border-gray-300 focus:border-[#642b8f] focus:outline-none bg-white"
                    value={formData.selectedEmail || ''}
                    onChange={(e) => handleInputChange('selectedEmail', e.target.value)}
                  >
                    <option value="">Select Mail</option>
                    {users.map(user => (
                      <option key={user._id} value={user._id}>
                        {user.email}
                      </option>
                    ))}
                  </select>
                </div>


                <div className="flex gap-4 mb-4">
                  <div className="relative w-1/2">
                    <input
                      type={passwordVisibility.password ? "text" : "password"}
                      placeholder="Password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="w-full p-3 rounded-lg border-2 border-gray-300 focus:border-[#642b8f] focus:outline-none pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('password')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 focus:outline-none"
                    >
                      {passwordVisibility.password ? (
                        <Eye className="text-gray-500" size={20} />
                      ) : (
                        <EyeOff className="text-gray-500" size={20} />
                      )}
                    </button>
                  </div>
                  <div className="relative w-1/2">
                    <input
                      type={passwordVisibility.confirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className="w-full p-3 rounded-lg border-2 border-gray-300 focus:border-[#642b8f] focus:outline-none pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('confirmPassword')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 focus:outline-none"
                    >
                      {passwordVisibility.confirmPassword ? (
                        <Eye className="text-gray-500" size={20} />
                      ) : (
                        <EyeOff className="text-gray-500" size={20} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-[#642b8f] font-semibold text-lg pb-2 border-b-2 border-[#f8a213]">
                  Professional Details
                </h3>
                <div className="flex gap-4 mb-4">
                  <select
                    className="flex-1 p-3 rounded-lg border-2 border-gray-300 focus:border-[#642b8f] focus:outline-none bg-white"
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                  <select
                    className="flex-1 p-3 rounded-lg border-2 border-gray-300 focus:border-[#642b8f] focus:outline-none bg-white"
                    value={formData.employmentType}
                    onChange={(e) => handleInputChange('employmentType', e.target.value)}
                    required
                  >
                    <option value="">Employment Type</option>
                    {employmentTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
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
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserMasterForm;