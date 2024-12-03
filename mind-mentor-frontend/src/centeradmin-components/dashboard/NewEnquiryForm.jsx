import { Button } from '@mui/material';
import { Mail, Trash } from 'lucide-react';
import { useEffect, useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Link, useParams } from 'react-router-dom'; // Import for navigation and params
// Real API Service
import { createEnquiry, updateEnquiry } from '../../api/service/employee/EmployeeService';
const NewEnquiryForm = () => {
  const { id } = useParams(); // Get ID from URL params
  const [formData, setFormData] = useState({
    parentFirstName: '',
    parentLastName: '',
    whatsappNumber: '',
    email: '',
    source: '',
    kidFirstName: '',
    kidLastName: '',
    kidsAge: '',
    message: '',
    kidsGender: '',
    programs: [{ program: '', level: '' }],
    schoolName: '',
    address: '',
    schoolPincode: '',
  });
  const availablePrograms = ['Chess', 'Rubix', 'Art', 'Dance', 'Music'];
  useEffect(() => {
    if (id) {
      // Fetch data if ID is present (edit mode)
      operationDeptInstance
        .get(`/enquiry-form/${id}`)
        .then((response) => setFormData(response.data))
        .catch((error) => console.error('Error fetching enquiry:', error));
    }
  }, [id]);
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const handleProgramChange = (index, field, value) => {
    const newPrograms = [...formData.programs];
    newPrograms[index][field] = value;
    setFormData((prev) => ({ ...prev, programs: newPrograms }));
  };
  const addProgram = () => {
    setFormData((prev) => ({
      ...prev,
      programs: [...prev.programs, { program: '', level: '' }],
    }));
  };
  const removeProgram = (index) => {
    setFormData((prev) => ({
      ...prev,
      programs: prev.programs.filter((_, i) => i !== index),
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        // Update enquiry
        await updateEnquiry(id, formData);
      } else {
        // Create new enquiry
        await createEnquiry(formData);
      }
      alert('Enquiry submitted successfully!');
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      alert('There was an error submitting the enquiry.');
    }
  };
  const getAvailableProgramOptions = (currentProgram) => {
    const selectedPrograms = formData.programs
      .map((p) => p.program)
      .filter((p) => p !== currentProgram);
    return availablePrograms.filter((program) => !selectedPrograms.includes(program));
  };
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-[#642b8f] to-[#aa88be] p-8 text-white flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold mb-2">
              {id ? 'Edit Enquiry Form' : 'New Enquiry Form'}
            </h2>
            <p className="text-sm opacity-90">Please fill in all the required information below</p>
          </div>
          <Button
            variant="contained"
            color="#642b8f"
            component={Link}
            to="/employee-operation-enquiry-list"
          >
            View Enquiries
          </Button>
        </div>
        <form className="p-8" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {/* Left Column */}
            <div className="space-y-8">
              {/* Parent Information */}
              <div className="space-y-4">
                <h3 className="text-[#642b8f] font-semibold text-lg pb-2 border-b-2 border-[#f8a213]">
                  Parent Information
                </h3>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <input
                      type="text"
                      placeholder="First Name"
                      className="flex-1 p-3 rounded-lg border-2 border-[#aa88be] focus:border-[#642b8f] focus:outline-none transition-colors"
                      value={formData.parentFirstName}
                      onChange={(e) => handleInputChange('parentFirstName', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Last Name"
                      className="flex-1 p-3 rounded-lg border-2 border-[#aa88be] focus:border-[#642b8f] focus:outline-none transition-colors"
                      value={formData.parentLastName}
                      onChange={(e) => handleInputChange('parentLastName', e.target.value)}
                    />
                  </div>
                </div>
              </div>
              {/* Contact Information */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-[#642b8f]">
                  Parents WhatsApp Number <span className="text-red-500">*</span>
                </label>
                <PhoneInput
                  country={'in'}
                  value={formData.whatsappNumber}
                  onChange={(value) => handleInputChange('whatsappNumber', value)}
                  inputProps={{
                    placeholder: '81234 56789',
                    className: 'w-full p-3 rounded-lg !border-[#aa88be] focus:!border-[#642b8f]',
                  }}
                  containerClass="w-full border 2px"
                  buttonClass="!border-[#aa88be] !rounded-lg"
                  preferredCountries={['in']}
                />
              </div>
              {/* Email Section */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-[#642b8f]">Parents Email ID</label>
                <div className="relative">
                  <input
                    type="email"
                    className="w-full p-3 rounded-lg border-2 border-[#aa88be] focus:border-[#642b8f] focus:outline-none transition-colors pl-4 pr-10"
                    placeholder="example@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                  <Mail className="absolute right-3 top-1/ 2 transform -translate-y-1/2 h-5 w-5 text-[#642b8f]" />
                </div>
              </div>
              {/* Message Section */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-[#642b8f]">Message</label>
                <textarea
                  rows={4}
                  className="w-full p-3 rounded-lg border-2 border-[#aa88be] focus:border-[#642b8f] focus:outline-none transition-colors resize-none"
                  placeholder="Enter your Message here..."
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                />
              </div>
              {/* Source Section */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-[#642b8f]">Source</label>
                <select
                  className="w-full p-3 rounded-lg border-2 border-[#aa88be] focus:border-[#642b8f] focus:outline-none transition-colors bg-white"
                  value={formData.source}
                  onChange={(e) => handleInputChange('source', e.target.value)}
                >
                  <option value="">-Select-</option>
                  <option value="website">Website</option>
                  <option value="referral">Referral</option>
                  <option value="social">Social Media</option>
                </select>
              </div>
            </div>
            {/* Right Column */}
            <div className="space-y-8">
              {/* Child Information Section */}
              <div className="space-y-4">
                <h3 className="text-[#642b8f] font-semibold text-lg pb-2 border-b-2 border-[#f8a213]">
                  Child Information
                </h3>
                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="First Name"
                    className="flex-1 p-3 rounded-lg border-2 border-[#aa88be] focus:border-[#642b8f] focus:outline-none transition-colors"
                    value={formData.kidFirstName}
                    onChange={(e) => handleInputChange('kidFirstName', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    className="flex-1 p-3 rounded-lg border-2 border-[#aa88be] focus:border-[#642b8f] focus:outline-none transition-colors"
                    value={formData.kidLastName}
                    onChange={(e) => handleInputChange('kidLastName', e.target.value)}
                  />
                </div>
              </div>
              {/* kidsAge and kidsGender */}
              <div className="flex gap-4">
                <div className="flex-1 space-y-4">
                  <label className="block text-sm font-medium text-[#642b8f]">kidsAge</label>
                  <input
                    type="number"
                    placeholder="kidsAge"
                    className="w-full p-3 rounded-lg border-2 border-[#aa88be] focus:border-[#642b8f] focus:outline-none transition-colors"
                    value={formData.kidsAge}
                    onChange={(e) => handleInputChange('kidsAge', e.target.value)}
                  />
                </div>
                <div className="flex-1 space-y-4">
                  <label className="block text-sm font-medium text-[#642b8f]">kidsGender</label>
                  <select
                    className="w-full p-3 rounded-lg border-2 border-[#aa88be] focus:border-[#642b8f] focus:outline-none transition-colors bg-white"
                    value={formData.kidsGender}
                    onChange={(e) => handleInputChange('kidsGender', e.target.value)}
                  >
                    <option value="">Select kidsGender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              {/* Programs Section */}
              <div className="space-y-4">
                <h3 className="text-[#642b8f] font-semibold text-lg pb-2 border-b-2 border-[#f8a213]">
                  Program Selection
                </h3>
                {formData.programs.map((program, index) => (
                  <div key={index} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-[#642b8f]">Program {index + 1}</label>
                      {formData.programs.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeProgram(index)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Trash className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                    <div className="flex gap-4">
                      <select
                        className="flex-1 p-3 rounded-lg border-2 border-[#aa88be] focus:border-[#642b8f] focus:outline-none transition-colors bg-white"
                        value={program.program}
                        onChange={(e) => handleProgramChange(index, 'program', e.target.value)}
                      >
                        <option value="">-Select Program-</option>
                        <option value="program1">Program 1</option>
                        <option value="program2">Program 2</option>
                      </select>
                      <select
                        className="flex-1 p-3 rounded-lg border-2 border-[#aa88be] focus:border-[#642b8f] focus:outline-none transition-colors bg-white"
                        value={program.level}
                        onChange={(e) => handleProgramChange(index, 'level', e.target.value)}
                      >
                        <option value="">-Select Level-</option>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addProgram}
                  className="text-[#642b8f] hover:text-[#aa88be] font-medium text-sm transition-colors"
                >
                  + Add Program
                </button>
              </div>
              {/* School Information */}
              <div className="space-y-4">
                <h3 className="text-[#642b8f] font-semibold text-lg pb-2 border-b-2 border-[#f8a213]">
                  School Details
                </h3>
                <input
                  type="text"
                  placeholder="School Name"
                  className="w-full p-3 rounded-lg border-2 border-[#aa88be] focus:border-[#642b8f] focus:outline-none transition-colors"
                  value={formData.schoolName}
                  onChange={(e) => handleInputChange('schoolName', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Address"
                  className="w-full p-3 rounded-lg border-2 border-[#aa88be] focus:border-[#642b8f] focus:outline-none transition-colors"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Pincode"
                  className="w-full p-3 rounded-lg border-2 border-[#aa88be] focus:border-[#642b8f] focus:outline-none transition-colors"
                  value={formData.schoolPincode}
                  onChange={(e) => handleInputChange('schoolPincode', e.target.value)}
                />
              </div>
            </div>
          </div>
          {/* Form Buttons */}
          <div className="flex justify-center gap-6 mt-12">
            <button
              type="submit"
              className="px-8 py-3 bg-[#642b8f] text-white rounded-lg font-medium hover:bg-[#aa88be] transition-colors shadow-lg hover:shadow-xl"
            >
              Submit Enquiry
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
export default NewEnquiryForm;
