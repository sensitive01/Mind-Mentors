import { Button } from '@mui/material';
import { Mail, Building2, UserCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Link, useParams } from 'react-router-dom';
// import { createEmployee, updateEmployee } from '../../../api/Employee/EmployeeMaster';

const EmployeeMasterForm = () => {
  const { id } = useParams(); 
  const [formData, setFormData] = useState({
    employeeId: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    dateOfJoining: '',
    department: '',
    designation: '',
    employmentType: '',
    salary: '',
    bankAccountNumber: '',
    bankName: '',
    ifscCode: '',
    panNumber: '',
    permanentAddress: '',
    communicationAddress: '',
    emergencyContactName: '',
    emergencyContactNumber: '',
    educationQualification: '',
    skills: [],
    profilePicture: null
  });

  const departments = ['HR', 'Finance', 'IT', 'Marketing', 'Sales', 'Operations', 'Customer Support'];
  const designations = ['Junior', 'Senior', 'Manager', 'Director', 'Executive', 'Associate'];
  const employmentTypes = ['Full-Time', 'Part-Time', 'Contract', 'Freelance'];

  useEffect(() => {
    if (id) {
      // Fetch employee data if ID is present (edit mode)
      employeeMasterInstance
        .get(`/employee/${id}`)
        .then((response) => setFormData(response.data))
        .catch((error) => console.error('Error fetching employee:', error));
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
        // Update employee
        await updateEmployee(id, formDataToSubmit);
      } else {
        // Create new employee
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
              {id ? 'Edit Employee Master Data' : 'New Employee Master Data'}
            </h2>
            <p className="text-sm opacity-90">Please fill in all the required employee information</p>
          </div>
          <Button
            variant="contained"
            color="#642b8f"
            component={Link}
            to="/employee-list"
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
                  <input
                    type="text"
                    placeholder="Employee ID"
                    className="flex-1 p-3 rounded-lg border-2 border-gray-300 focus:border-[#642b8f] focus:outline-none"
                    value={formData.employeeId}
                    onChange={(e) => handleInputChange('employeeId', e.target.value)}
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
                    className="flex-1 p-3 rounded-lg border-2 border-gray-300 focus:border-[#642b8f] focus:outline-none"
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
                    placeholder="Work Email"
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
                    placeholder: 'Work Phone Number',
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
                      Date of Joining
                    </label>
                    <input
                      type="date"
                      className="w-full p-3 rounded-lg border-2 border-gray-300 focus:border-[#642b8f] focus:outline-none"
                      value={formData.dateOfJoining}
                      onChange={(e) => handleInputChange('dateOfJoining', e.target.value)}
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
                    value={formData.designation}
                    onChange={(e) => handleInputChange('designation', e.target.value)}
                    required
                  >
                    <option value="">Select Designation</option>
                    {designations.map(desig => (
                      <option key={desig} value={desig}>{desig}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-4">
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
                  <input
                    type="number"
                    placeholder="Annual Salary"
                    className="flex-1 p-3 rounded-lg border-2 border-gray-300 focus:border-[#642b8f] focus:outline-none"
                    value={formData.salary}
                    onChange={(e) => handleInputChange('salary', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-[#642b8f] font-semibold text-lg pb-2 border-b-2 border-[#f8a213]">
                  Bank & Tax Information
                </h3>
                <div className="flex gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Bank Account Number"
                    className="flex-1 p-3 rounded-lg border-2 border-gray-300 focus:border-[#642b8f] focus:outline-none"
                    value={formData.bankAccountNumber}
                    onChange={(e) => handleInputChange('bankAccountNumber', e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Bank Name"
                    className="flex-1 p-3 rounded-lg border-2 border-gray-300 focus:border-[#642b8f] focus:outline-none"
                    value={formData.bankName}
                    onChange={(e) => handleInputChange('bankName', e.target.value)}
                    required
                  />
                </div>
                <input
                  type="text"
                  placeholder="IFSC Code"
                  className="w-full p-3 rounded-lg border-2 border-gray-300 focus:border-[#642b8f] focus:outline-none"
                  value={formData.ifscCode}
                  onChange={(e) => handleInputChange('ifscCode', e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="PAN Number"
                  className="w-full p-3 rounded-lg border-2 border-gray-300 focus:border-[#642b8f] focus:outline-none"
                  value={formData.panNumber}
                  onChange={(e) => handleInputChange('panNumber', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-[#642b8f] font-semibold text-lg pb-2 border-b-2 border-[#f8a213]">
                  Skills & Profile Picture
                </h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-[#642b8f] mb-2">
                    Select Skills
                  </label>
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
                <div>
                  <label className="block text-sm font-medium text-[#642b8f] mb-2">
                    Profile Picture
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="w-full p-3 rounded-lg border-2 border-gray-300 focus:border-[#642b8f] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center gap-6 mt-12">
            <button
              type="submit"
              className="px-8 py-3 bg-[#642b8f] text-white rounded-lg font-medium hover:bg-[#aa88be] transition-colors shadow-lg hover:shadow-xl"
            >
              Submit Employee Data
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
export default EmployeeMasterForm;
