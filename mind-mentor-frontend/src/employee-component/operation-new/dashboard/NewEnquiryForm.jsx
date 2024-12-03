import { Mail, Trash } from 'lucide-react';
import { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
// 
import { Button } from '@mui/material';
import { Link } from 'react-router-dom'; // Import Link for navigation

const NewEnquiryForm = () => {
  const [programs, setPrograms] = useState([{ program: '', level: '' }]);
  const availablePrograms = ['Chess', 'Rubix', 'Art', 'Dance', 'Music'];

  const addProgram = () => {
    setPrograms([...programs, { program: '', level: '' }]);
  };

  const removeProgram = (index) => {
    setPrograms(programs.filter((_, i) => i !== index));
  };

  const handleProgramChange = (index, field, value) => {
    const newPrograms = [...programs];
    newPrograms[index][field] = value;
    setPrograms(newPrograms);
  };

  const getAvailableProgramOptions = (currentProgram) => {
    const selectedPrograms = programs
      .map((p) => p.program)
      .filter((p) => p !== currentProgram);
    return availablePrograms.filter((program) => !selectedPrograms.includes(program));
  };
  const phoneInputStyle = {
    container: "!w-full",
    input: "!w-full !h-12 !text-base !pl-12 !pr-4 !border !border-gray-300 !rounded-lg focus:!ring-2 focus:!ring-[rgb(177,21,177)] focus:!border-[rgb(177,21,177)] !transition-colors",
    button: "!h-12 !bg-transparent !border-r !border-gray-300 !rounded-l-lg",
    dropdown: "!bg-white !shadow-lg !rounded-lg !border !border-gray-200 !mt-1",
    search: "!mx-2 !my-2 !px-3 !py-2 !border !border-gray-300 !rounded-md"
  };
  return (
    <div className="min-h-screen  p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-[#642b8f] to-[#aa88be] p-8 text-white flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold mb-2">Student Enquiry Form</h2>
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
        
        <form className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {/* Left Column */}
            <div className="space-y-8">
              {/* Parent Name Section */}
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
                    />
                    <input
                      type="text"
                      placeholder="Last Name"
                      className="flex-1 p-3 rounded-lg border-2 border-[#aa88be] focus:border-[#642b8f] focus:outline-none transition-colors"
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
                style={{border:'5px'}}
                  country={'in'}
                  inputProps={{
                    placeholder: '81234 56789',
                    className: 'w-full p-3 rounded-lg !border-[#aa88be] focus:!border-[#642b8f]'
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
                  />
                  <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#642b8f]" />
                </div>
              </div>

              {/* Message Section */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-[#642b8f]">Message</label>
                <textarea
                  rows={4}
                  className="w-full p-3 rounded-lg border-2 border-[#aa88be] focus:border-[#642b8f] focus:outline-none transition-colors resize-none"
                  placeholder="Enter your message here..."
                />
              </div>

              {/* Source Section */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-[#642b8f]">Source</label>
                <select className="w-full p-3 rounded-lg border-2 border-[#aa88be] focus:border-[#642b8f] focus:outline-none transition-colors bg-white">
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
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    className="flex-1 p-3 rounded-lg border-2 border-[#aa88be] focus:border-[#642b8f] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Age and Gender */}
              <div className="flex gap-4">
                <div className="flex-1 space-y-4">
                  <label className="block text-sm font-medium text-[#642b8f]">Age</label>
                  <input
                    type="number"
                    placeholder="Age"
                    className="w-full p-3 rounded-lg border-2 border-[#aa88be] focus:border-[#642b8f] focus:outline-none transition-colors"
                  />
                </div>
                <div className="flex-1 space-y-4">
                  <label className="block text-sm font-medium text-[#642b8f]">Gender</label>
                  <select className="w-full p-3 rounded-lg border-2 border-[#aa88be] focus:border-[#642b8f] focus:outline-none transition-colors bg-white">
                    <option value="">Select Gender</option>
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
                {programs.map((program, index) => (
                  <div key={index} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-[#642b8f]">Program {index + 1}</label>
                      {programs.length > 1 && (
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
                        {getAvailableProgramOptions(program.program).map((prog) => (
                          <option key={prog} value={prog}>{prog}</option>
                        ))}
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
                />
                <input
                  type="text"
                  placeholder="Address"
                  className="w-full p-3 rounded-lg border-2 border-[#aa88be] focus:border-[#642b8f] focus:outline-none transition-colors"
                />
                <input
                  type="text"
                  placeholder="Pincode"
                  className="w-full p-3 rounded-lg border-2 border-[#aa88be] focus:border-[#642b8f] focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>
{/* <Divider className="flex justify-center gap-6 mt-12"/> */}
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