import { Button } from "@mui/material";
import { Mail, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { operationDeptInstance } from "../../../api/axios/operationDeptInstance";

const NewEnquiryFormStep = () => {
  const navigate = useNavigate();
  const empId = localStorage.getItem("empId");
  const { id } = useParams();
  const [activeStep, setActiveStep] = useState(0);
  const [enquiryId, setEnquiryId] = useState(id || null);

  const [formData, setFormData] = useState({
    parentFirstName: "",

    contactNumber: "",
    whatsappNumber: "",
    email: "",
    source: "",
    kidFirstName: "",
    kidLastName: "",
    kidsAge: "",
    message: "",
    kidsGender: "",
    programs: [{ program: "", level: "" }],
    schoolName: "",
    address: "",
    schoolPincode: "",
    empId,
  });
  const [isSameAsContact, setIsSameAsContact] = useState(false);

  useEffect(() => {
    if (id) {
      operationDeptInstance
        .get(`/enquiry-form/${id}`)
        .then((response) => {
          setFormData(response.data);
          setEnquiryId(id);
        })
        .catch((error) => {
          console.error("Error fetching enquiry:", error);
          toast.error("Error loading enquiry data");
        });
    }
  }, [id]);
  const handleInputChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
    if (field === "contactNumber" && isSameAsContact) {
      setFormData((prevData) => ({
        ...prevData,
        whatsappNumber: value,
      }));
    }
  };
  const handleCheckboxChange = () => {
    setIsSameAsContact((prev) => !prev);
    if (!isSameAsContact) {
      setFormData((prevData) => ({
        ...prevData,
        whatsappNumber: formData.contactNumber,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        whatsappNumber: "",
      }));
    }
  };

  const handleProgramChange = (index, field, value) => {
    const newPrograms = [...formData.programs];
    newPrograms[index][field] = value;
    setFormData((prev) => ({ ...prev, programs: newPrograms }));
  };

  const addProgram = () => {
    setFormData((prev) => ({
      ...prev,
      programs: [...prev.programs, { program: "", level: "" }],
    }));
  };

  const removeProgram = (index) => {
    setFormData((prev) => ({
      ...prev,
      programs: prev.programs.filter((_, i) => i !== index),
    }));
  };

  const validateStep = (step) => {
    switch (step) {
      case 0:
        return (
          formData.parentFirstName.trim() &&
          formData.whatsappNumber &&
          formData.whatsappNumber.length >= 10
        );
      case 1:
        return (
          formData.kidFirstName.trim() &&
          formData.kidsAge &&
          formData.kidsGender
        );
      case 2:
        return formData.programs[0].program && formData.programs[0].level;
      default:
        return true;
    }
  };

  const getStepData = (step) => {
    switch (step) {
      case 0:
        return {
          parentFirstName: formData.parentFirstName,
          contactNumber: formData.contactNumber,
          isSameAsContact,

          whatsappNumber: formData.whatsappNumber,
          email: formData.email,
          source: formData.source,
          empId,
        };
      case 1:
        return {
          kidFirstName: formData.kidFirstName,
          kidLastName: formData.kidLastName,
          kidsAge: formData.kidsAge,
          kidsGender: formData.kidsGender,
          schoolName: formData.schoolName,
          address: formData.address,
          schoolPincode: formData.schoolPincode,
        };
      case 2:
        return {
          programs: formData.programs,
          message: formData.message,
        };
      default:
        return {};
    }
  };

  const saveStepData = async (step) => {
    try {
      const stepData = getStepData(step);

      if (!enquiryId) {
        // Create new enquiry for first step
        const response = await operationDeptInstance.post(
          "/enquiry-form",
          stepData
        );
        console.log("Response", response);
        setEnquiryId(response.data.id);
        toast.success("Step 1 saved successfully!");
      } else {
        // Update existing enquiry for subsequent steps
        await operationDeptInstance.put(
          `/enquiry-form/${enquiryId}/step/${step + 1}`,
          stepData
        );
        toast.success(`Step ${step + 1} saved successfully!`);
      }

      return true;
    } catch (error) {
      console.error(`Error saving step ${step + 1}:`, error);
      toast.error(`Error saving step ${step + 1}`);
      return false;
    }
  };

  const handleContinue = async () => {
    if (!validateStep(activeStep)) {
      toast.error("Please fill in all required fields");
      return;
    }

    const saved = await saveStepData(activeStep);
    if (saved) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(2)) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await saveStepData(2);
      toast.success("Enquiry submitted successfully!");
      setTimeout(() => {
        navigate("/operation/department/enquiry-list");
      }, 1500);
    } catch (error) {
      console.error("Error submitting enquiry:", error);
      toast.error("There was an error submitting the enquiry.");
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-[#642b8f] font-semibold text-lg pb-2 border-b-2 border-[#f8a213]">
                Parent Information
              </h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="Parent Name *"
                    className="flex-1 p-3 rounded-lg border-2 border-[#aa88be] focus:border-[#642b8f] focus:outline-none transition-colors"
                    value={formData.parentFirstName}
                    onChange={(e) =>
                      handleInputChange("parentFirstName", e.target.value)
                    }
                    required
                  />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              {/* Checkbox moved to top */}
              <div>
                <label className="inline-flex items-center text-sm font-medium text-[#642b8f] hover:cursor-pointer">
                  <input
                    type="checkbox"
                    className="mr-2 accent-[#642b8f]"
                    checked={isSameAsContact}
                    onChange={handleCheckboxChange}
                  />
                  WhatsApp number is the same as the contact number
                </label>
              </div>

              {/* Phone inputs in same line */}
              <div className="flex gap-4 items-center ml-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Parent's Contact Number{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <PhoneInput
                    country="in"
                    value={formData.contactNumber}
                    onChange={(value) =>
                      handleInputChange("contactNumber", value)
                    }
                    inputProps={{
                      placeholder: "Enter contact number",
                      required: true,
                      className:
                        "w-full p-4 rounded-lg border-2 border-[#aa88be] focus:border-[#642b8f] focus:ring-2 focus:ring-[#642b8f] focus:ring-opacity-50 outline-none placeholder-gray-400",
                    }}
                    containerClass="w-full"
                    buttonClass="border-2 !border-[#aa88be] !rounded-l-lg"
                    inputStyle={{
                      width: "100%",
                      height: "44px",
                      fontSize: "16px",
                    }}
                    preferredCountries={["in"]}
                  />
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Parent's WhatsApp Number{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <PhoneInput
                    country="in"
                    value={formData.whatsappNumber}
                    onChange={(value) =>
                      handleInputChange("whatsappNumber", value)
                    }
                    inputProps={{
                      placeholder: "Enter WhatsApp number",
                      required: true,
                      className:
                        "w-full p-4 rounded-lg border-2 border-[#aa88be] focus:border-[#642b8f] focus:ring-2 focus:ring-[#642b8f] focus:ring-opacity-50 outline-none placeholder-gray-400",
                    }}
                    containerClass="w-full"
                    buttonClass="border-2 !border-[#aa88be] !rounded-l-lg"
                    inputStyle={{
                      width: "100%",
                      height: "44px",
                      fontSize: "16px",
                    }}
                    preferredCountries={["in"]}
                    disabled={isSameAsContact}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-[#642b8f]">
                Parents Email ID
              </label>
              <div className="relative">
                <input
                  type="email"
                  className="w-full p-3 rounded-lg border-2 border-[#aa88be] focus:border-[#642b8f] focus:outline-none transition-colors pl-4 pr-10"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#642b8f] pointer-events-none" />
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-[#642b8f]">
                Source
              </label>
              <select
                className="w-full p-3 rounded-lg border-2 border-[#aa88be] focus:border-[#642b8f] focus:outline-none transition-colors bg-white"
                value={formData.source}
                onChange={(e) => handleInputChange("source", e.target.value)}
              >
                <option value="">-Select-</option>
                <option value="website">Website</option>
                <option value="referral">Referral</option>
                <option value="social">Social Media</option>
              </select>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-[#642b8f] font-semibold text-lg pb-2 border-b-2 border-[#f8a213]">
                Child Information
              </h3>
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="First Name *"
                  className="flex-1 p-3 rounded-lg border-2 border-[#aa88be] focus:border-[#642b8f] focus:outline-none transition-colors"
                  value={formData.kidFirstName}
                  onChange={(e) =>
                    handleInputChange("kidFirstName", e.target.value)
                  }
                  required
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="flex-1 p-3 rounded-lg border-2 border-[#aa88be] focus:border-[#642b8f] focus:outline-none transition-colors"
                  value={formData.kidLastName}
                  onChange={(e) =>
                    handleInputChange("kidLastName", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-1 space-y-4">
                <label className="block text-sm font-medium text-[#642b8f]">
                  Age *
                </label>
                <input
                  type="number"
                  placeholder="Age"
                  className="w-full p-3 rounded-lg border-2 border-[#aa88be] focus:border-[#642b8f] focus:outline-none transition-colors"
                  value={formData.kidsAge}
                  onChange={(e) => handleInputChange("kidsAge", e.target.value)}
                  required
                />
              </div>
              <div className="flex-1 space-y-4">
                <label className="block text-sm font-medium text-[#642b8f]">
                  Gender *
                </label>
                <select
                  className="w-full p-3 rounded-lg border-2 border-[#aa88be] focus:border-[#642b8f] focus:outline-none transition-colors bg-white"
                  value={formData.kidsGender}
                  onChange={(e) =>
                    handleInputChange("kidsGender", e.target.value)
                  }
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-[#642b8f] font-semibold text-lg pb-2 border-b-2 border-[#f8a213]">
                School Details
              </h3>
              <input
                type="text"
                placeholder="School Name"
                className="w-full p-3 rounded-lg border-2 border-[#aa88be] focus:border-[#642b8f] focus:outline-none transition-colors"
                value={formData.schoolName}
                onChange={(e) =>
                  handleInputChange("schoolName", e.target.value)
                }
              />
              <input
                type="text"
                placeholder="Address"
                className="w-full p-3 rounded-lg border-2 border-[#aa88be] focus:border-[#642b8f] focus:outline-none transition-colors"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
              />
              <input
                type="text"
                placeholder="Pincode"
                className="w-full p-3 rounded-lg border-2 border-[#aa88be] focus:border-[#642b8f] focus:outline-none transition-colors"
                value={formData.schoolPincode}
                onChange={(e) =>
                  handleInputChange("schoolPincode", e.target.value)
                }
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-[#642b8f] font-semibold text-lg pb-2 border-b-2 border-[#f8a213]">
                Program Selection
              </h3>
              {formData.programs.map((program, index) => (
                <div key={index} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-[#642b8f]">
                      Program {index + 1}
                    </label>
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
                      onChange={(e) =>
                        handleProgramChange(index, "program", e.target.value)
                      }
                      required
                    >
                      <option value="">-Select Program-</option>
                      <option value="Chess">Chess</option>
                      <option value="Rubiks Cube">Rubiks Cube</option>
                    </select>
                    <select
                      className="flex-1 p-3 rounded-lg border-2 border-[#aa88be] focus:border-[#642b8f] focus:outline-none transition-colors bg-white"
                      value={program.level}
                      onChange={(e) =>
                        handleProgramChange(index, "level", e.target.value)
                      }
                      required
                    >
                      <option value="">-Select Level-</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
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

            <div className="space-y-4">
              <label className="block text-sm font-medium text-[#642b8f]">
                Message
              </label>
              <textarea
                rows={4}
                className="w-full p-3 rounded-lg border-2 border-[#aa88be] focus:border-[#642b8f] focus:outline-none transition-colors resize-none"
                placeholder="Enter your Message here..."
                value={formData.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-[#642b8f] to-[#aa88be] p-7 text-white flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold mb-2">
              {id ? "Edit Enquiry Form" : "New Enquiry Form"}
            </h2>
            <p className="text-sm opacity-90">
              Please fill in all the required information below
            </p>
          </div>
          <Button
            variant="contained"
            component={Link}
            to="/operation/department/enquiry-list"
            sx={{
              backgroundColor: "#642b8f",
              color: "#fff", // Set text color for contrast
              "&:hover": {
                backgroundColor: "#501c6f", // Adjust the hover color if needed
              },
            }}
          >
            View Enquiries
          </Button>
        </div>

        {/* Stepper Header */}
        <div className="flex justify-between px-8 py-4 border-b">
          {["Parent Details", "Child Details", "Program Details"].map(
            (step, index) => (
              <div
                key={step}
                className={`flex items-center ${index !== 2 ? "flex-1" : ""}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    activeStep >= index
                      ? "bg-[#642b8f] text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {index + 1}
                </div>
                <div className="ml-3">
                  <p
                    className={`font-medium ${
                      activeStep >= index ? "text-[#642b8f]" : "text-gray-500"
                    }`}
                  >
                    {step}
                  </p>
                </div>
                {index !== 2 && (
                  <div
                    className={`flex-1 h-0.5 mx-4 ${
                      activeStep > index ? "bg-[#642b8f]" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            )
          )}
        </div>

        <form className="p-8" onSubmit={handleSubmit}>
          {renderStepContent()}

          <div className="flex justify-between mt-8">
            {activeStep > 0 && (
              <button
                type="button"
                onClick={() => setActiveStep((prev) => prev - 1)}
                className="px-6 py-2 border-2 border-[#642b8f] text-[#642b8f] rounded-lg font-medium hover:bg-[#efe8f0] transition-colors"
              >
                Back
              </button>
            )}
            {activeStep < 2 ? (
              <button
                type="button"
                onClick={handleContinue}
                className="px-6 py-2 bg-[#642b8f] text-white rounded-lg font-medium hover:bg-[#aa88be] transition-colors ml-auto"
              >
                Continue
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-2 bg-[#642b8f] text-white rounded-lg font-medium hover:bg-[#aa88be] transition-colors ml-auto"
              >
                Submit Enquiry
              </button>
            )}
          </div>
        </form>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          draggable
          pauseOnFocusLoss
          style={{ marginTop: "60px" }} // Adjust the value as needed
        />
      </div>
    </div>
  );
};

export default NewEnquiryFormStep;
