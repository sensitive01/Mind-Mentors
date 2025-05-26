import { Button } from "@mui/material";
import { Mail, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { operationDeptInstance } from "../../../api/axios/operationDeptInstance";
import { getAllProgrameDataEnquiry } from "../../../api/service/employee/EmployeeService";

const NewEnquiryFormStep = () => {
  const navigate = useNavigate();
  const empId = localStorage.getItem("empId");
  const department = localStorage.getItem("department");
  const { id } = useParams();
  const [activeStep, setActiveStep] = useState(0);
  const [enquiryId, setEnquiryId] = useState(id || null);
  const [pincode, setPincode] = useState("");
  const [error, setError] = useState("");
  const [isSameAsContact, setIsSameAsContact] = useState(false);
  const [programData, setProgramData] = useState([]);
  const [centerOptions, setCenterOptions] = useState([]);

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
    programs: [
      {
        program: "",
        level: "",
        centerType: "",
        centerName: "",
      },
    ],
    schoolName: "",
    address: "",
    schoolPincode: "",
    empId,
    city: "",
    state: "",
    relationship: "",
    otherRelationship: "",
    pincode: "",
  });

  useEffect(() => {
    const fetchProgramData = async () => {
      const response = await getAllProgrameDataEnquiry();
      console.log(response);
      if (response.status === 200) {
        setProgramData(response?.data?.programs);
      }
    };
    fetchProgramData();
  }, []);

  const fetchCityDetails = async (pin) => {
    try {
      const response = await fetch(
        `https://api.postalpincode.in/pincode/${pin}`
      );
      const data = await response.json();

      if (data[0].Status === "Success") {
        const postOffice = data[0].PostOffice[0];
        setFormData((prev) => ({
          ...prev,
          city: postOffice.District,
          state: postOffice.State,
          pincode: pin,
        }));
        setError("");
      } else {
        setFormData((prev) => ({
          ...prev,
          city: "",
          state: "",
          pincode: "",
        }));
        setError("Invalid Pincode");
      }
    } catch (err) {
      setError("Unable to fetch city details");
      setFormData((prev) => ({
        ...prev,
        city: "",
        state: "",
        pincode: "",
      }));
    }
  };

  useEffect(() => {
    if (pincode.length === 6) {
      fetchCityDetails(pincode);
    } else {
      setFormData((prev) => ({
        ...prev,
        city: "",
        state: "",
        pincode: "",
      }));
    }
  }, [pincode]);

  useEffect(() => {
    if (id) {
      operationDeptInstance
        .get(`/enquiry-form/${id}`)
        .then((response) => {
          setFormData(response.data);
          setEnquiryId(id);
          setPincode(response.data.pincode || "");
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

    // When program changes, reset dependent fields
    if (field === "program") {
      newPrograms[index] = {
        ...newPrograms[index],
        program: value,
        level: "",
        centerType: "",
        centerName: "",
      };
    }
    // When level changes, reset center type and center name
    else if (field === "level") {
      newPrograms[index] = {
        ...newPrograms[index],
        level: value,
        centerType: "",
        centerName: "",
      };
    }
    // When center type changes, reset center name
    else if (field === "centerType") {
      newPrograms[index] = {
        ...newPrograms[index],
        centerType: value,
        centerName: "",
      };
    } else {
      newPrograms[index][field] = value;
    }

    setFormData((prev) => ({ ...prev, programs: newPrograms }));
  };

  // Get all unique programs from all centers
  const getAvailablePrograms = () => {
    const allPrograms = new Set();
    programData.forEach((center) => {
      center.programLevels.forEach((pl) => {
        allPrograms.add(pl.program);
      });
    });
    return Array.from(allPrograms);
  };

  // Get available levels for selected program
  const getAvailableLevels = (index) => {
    const { program } = formData.programs[index];
    if (!program) return [];

    const allLevels = new Set();
    programData.forEach((center) => {
      center.programLevels.forEach((pl) => {
        if (pl.program === program) {
          pl.levels.forEach((level) => allLevels.add(level));
        }
      });
    });
    return Array.from(allLevels);
  };

  // Get available center types for selected program and level
  const getAvailableCenterTypes = (index) => {
    const { program, level } = formData.programs[index];
    if (!program || !level) return [];

    const centerTypes = new Set();
    programData.forEach((center) => {
      center.programLevels.forEach((pl) => {
        if (pl.program === program && pl.levels.includes(level)) {
          centerTypes.add(center.centerType);
        }
      });
    });
    return Array.from(centerTypes);
  };

  // Get available centers for selected program, level, and center type
  const getAvailableCenters = (index) => {
    const { program, level, centerType } = formData.programs[index];
    if (!program || !level || !centerType) return [];

    return programData.filter((center) => {
      if (center.centerType !== centerType) return false;
      return center.programLevels.some(
        (pl) => pl.program === program && pl.levels.includes(level)
      );
    });
  };

  const addProgram = () => {
    setFormData((prev) => ({
      ...prev,
      programs: [
        ...prev.programs,
        { program: "", level: "", centerType: "", centerName: "" },
      ],
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
          formData.contactNumber &&
          formData.contactNumber.length >= 10 &&
          (!isSameAsContact ||
            (formData.whatsappNumber && formData.whatsappNumber.length >= 10))
        );
      case 1:
        return (
          formData.kidFirstName.trim() &&
          formData.kidsAge &&
          formData.kidsGender &&
          formData.relationship &&
          (formData.relationship !== "other" ||
            formData.otherRelationship.trim())
        );
      case 2:
        return formData.programs.every(
          (program) =>
            program.program &&
            program.level &&
            program.centerType &&
            program.centerName
        );
      default:
        return true;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(2)) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const completeFormData = {
        ...formData,
        pincode: pincode || formData.pincode,
      };

      if (!enquiryId) {
        const response = await operationDeptInstance.post(
          "/enquiry-form",
          completeFormData
        );
        setEnquiryId(response.data.id);
      } else {
        await operationDeptInstance.put(
          `/enquiry-form/${enquiryId}`,
          completeFormData
        );
      }

      toast.success("Enquiry submitted successfully!");
      setTimeout(() => {
        navigate(`/${department}/department/enrollment-data`);
      }, 1500);
    } catch (error) {
      console.error("Error submitting enquiry:", error);
      toast.error("There was an error submitting the enquiry.");
    }
  };

  const handleContinue = async () => {
    if (!validateStep(activeStep)) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const stepData = getStepData(activeStep);

      if (!enquiryId) {
        const response = await operationDeptInstance.post(
          "/enquiry-form",
          stepData
        );
        setEnquiryId(response.data.id);
        toast.success("Step saved successfully!");
      } else {
        await operationDeptInstance.put(
          `/enquiry-form/${enquiryId}/step/${activeStep + 1}`,
          stepData
        );
        toast.success("Step saved successfully!");
      }

      setActiveStep((prev) => prev + 1);
    } catch (error) {
      console.error(`Error saving step ${activeStep + 1}:`, error);
      toast.error(`Error saving step ${activeStep + 1}`);
    }
  };

  const getStepData = (step) => {
    switch (step) {
      case 0:
        return {
          parentFirstName: formData.parentFirstName,
          contactNumber: formData.contactNumber,
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
          relationship: formData.relationship,
          otherRelationship: formData.otherRelationship,
          pincode: pincode,
          city: formData.city,
          state: formData.state,
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

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <div className="space-y-8 ">
            <div className="space-y-4">
              <h3 className="text-[#642b8f] font-semibold text-lg pb-2 border-b-2 border-[#f8a213]">
                Guardian Information
              </h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="Guardian Name *"
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
              {/* Contact Number Input */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Guardian's Contact Number{" "}
                  <span className="text-red-500">*</span>
                </label>
                <PhoneInput
                  country="in"
                  value={formData.contactNumber}
                  onChange={(value) => {
                    handleInputChange("contactNumber", value);
                  }}
                  inputProps={{
                    placeholder: "Enter Guardian contact number",
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

              {/* Checkbox and WhatsApp Number - Appears after Contact Number is entered */}
              {formData.contactNumber && (
                <div className="space-y-4">
                  <div>
                    <label className="inline-flex items-center text-sm font-medium text-[#642b8f] hover:cursor-pointer">
                      <input
                        type="checkbox"
                        className="mr-2 accent-[#642b8f]"
                        checked={isSameAsContact}
                        onChange={handleCheckboxChange}
                      />
                      Is WhatsApp number different from Contact number?
                    </label>
                  </div>

                  {isSameAsContact && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Guardian's WhatsApp Number{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <PhoneInput
                        country="in"
                        value={formData.whatsappNumber}
                        onChange={(value) =>
                          handleInputChange("whatsappNumber", value)
                        }
                        inputProps={{
                          placeholder: "Enter Guardian whatsApp number",
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
                  )}
                </div>
              )}
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-[#642b8f]">
                Guardian's Email ID
              </label>
              <div className="relative">
                <input
                  type="email"
                  className="w-full p-3 rounded-lg border-2 border-[#aa88be] focus:border-[#642b8f] focus:outline-none transition-colors pl-4 pr-10"
                  placeholder="Enter Guardian email id"
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
                <option value="web_form">Web Form</option>
                <option value="justdial">JustDial</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="phone_call">Phone Call</option>
                <option value="centre_walkin">Centre Walk-in</option>
                <option value="referral">Referral</option>
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
            <div className="flex gap-4">
              <div className="flex-1 space-y-4">
                <label className="block text-sm font-medium text-[#642b8f]">
                  Relationship with Kid *
                </label>
                <div className="flex gap-4">
                  <select
                    className="flex-1 p-3 rounded-lg border-2 border-[#aa88be] focus:border-[#642b8f] focus:outline-none transition-colors bg-white"
                    value={formData.relationship}
                    onChange={(e) => {
                      handleInputChange("relationship", e.target.value);
                      if (e.target.value !== "other") {
                        handleInputChange("otherRelationship", "");
                      }
                    }}
                    required
                  >
                    <option value="">Select Relationship</option>
                    <option value="father">Father</option>
                    <option value="mother">Mother</option>
                    <option value="guardian">Guardian</option>
                    <option value="other">Other</option>
                  </select>

                  {formData.relationship === "other" && (
                    <input
                      type="text"
                      placeholder="Specify Relationship"
                      className="flex-1 p-3 rounded-lg border-2 border-[#aa88be] focus:border-[#642b8f] focus:outline-none transition-colors"
                      value={formData.otherRelationship || ""}
                      onChange={(e) =>
                        handleInputChange("otherRelationship", e.target.value)
                      }
                      required
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-1 space-y-4">
                <label className="block text-sm font-medium text-[#642b8f]">
                  Pincode *
                </label>
                <input
                  type="text"
                  placeholder="Enter Pincode"
                  maxLength="6"
                  className="w-full p-3 rounded-lg border-2 border-[#aa88be] focus:border-[#642b8f] focus:outline-none transition-colors"
                  value={pincode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    setPincode(value);
                  }}
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
              </div>

              <div className="flex-1 space-y-4">
                <label className="block text-sm font-medium text-[#642b8f]">
                  City
                </label>
                <input
                  type="text"
                  placeholder="City"
                  className="w-full p-3 rounded-lg border-2 border-[#aa88be] focus:border-[#642b8f] focus:outline-none transition-colors"
                  value={formData.city}
                  onChange={(e) => {
                    handleInputChange("city", e.target.value);
                  }}
                  readOnly
                />
              </div>

              <div className="flex-1 space-y-4">
                <label className="block text-sm font-medium text-[#642b8f]">
                  State
                </label>
                <input
                  type="text"
                  placeholder="State"
                  className="w-full p-3 rounded-lg border-2 border-[#aa88be] focus:border-[#642b8f] focus:outline-none transition-colors"
                  value={formData.state}
                  onChange={(e) => {
                    handleInputChange("state", e.target.value);
                  }}
                  readOnly
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-[#642b8f] font-semibold text-lg border-b-2 border-[#f8a213] pb-2">
                  Program Selectionss
                </h3>
              </div>

              {/* Programs List */}
              <div className="space-y-4">
                {formData.programs.map((program, index) => (
                  <div
                    key={index}
                    className="border border-[#aa88be] rounded-lg p-4 bg-white hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-[#642b8f] font-medium">
                        Program {index + 1}
                      </h4>
                      {formData.programs.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeProgram(index)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                          aria-label="Remove program"
                        >
                          <Trash className="h-5 w-5" />
                        </button>
                      )}
                    </div>

                    {/* Program Form Fields - Grid Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Program - First Selection */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-[#642b8f]">
                          Program <span className="text-red-500">*</span>
                        </label>
                        <select
                          className="w-full p-2 rounded-md border-2 border-[#aa88be] focus:border-[#642b8f] focus:outline-none transition-colors bg-white"
                          value={program.program}
                          onChange={(e) =>
                            handleProgramChange(
                              index,
                              "program",
                              e.target.value
                            )
                          }
                          required
                        >
                          <option value="">-Select Program-</option>
                          {getAvailablePrograms().map((programName, idx) => (
                            <option key={idx} value={programName}>
                              {programName}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Level - Show only if program is selected */}
                      {program.program && (
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-[#642b8f]">
                            Level <span className="text-red-500">*</span>
                          </label>
                          <select
                            className="w-full p-2 rounded-md border-2 border-[#aa88be] focus:border-[#642b8f] focus:outline-none transition-colors bg-white"
                            value={program.level}
                            onChange={(e) =>
                              handleProgramChange(
                                index,
                                "level",
                                e.target.value
                              )
                            }
                            required
                          >
                            <option value="">-Select Level-</option>
                            {getAvailableLevels(index).map((level, idx) => (
                              <option key={idx} value={level}>
                                {level}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {/* Center Type - Show only if program and level are selected */}
                      {program.program && program.level && (
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-[#642b8f]">
                            Preferred Type{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <select
                            className="w-full p-2 rounded-md border-2 border-[#aa88be] focus:border-[#642b8f] focus:outline-none transition-colors bg-white"
                            value={program.centerType}
                            onChange={(e) =>
                              handleProgramChange(
                                index,
                                "centerType",
                                e.target.value
                              )
                            }
                            required
                          >
                            <option value="">-Select Preferred Type-</option>
                            {getAvailableCenterTypes(index).map(
                              (centerType, idx) => (
                                <option key={idx} value={centerType}>
                                  {centerType.charAt(0).toUpperCase() +
                                    centerType.slice(1)}
                                </option>
                              )
                            )}
                          </select>
                        </div>
                      )}

                      {/* Center Name - Show only if all previous fields are selected */}
                      {program.program &&
                        program.level &&
                        program.centerType && (
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-[#642b8f]">
                              Preferred Center{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <select
                              className="w-full p-2 rounded-md border-2 border-[#aa88be] focus:border-[#642b8f] focus:outline-none transition-colors bg-white"
                              value={program.centerName}
                              onChange={(e) =>
                                handleProgramChange(
                                  index,
                                  "centerName",
                                  e.target.value
                                )
                              }
                              required
                            >
                              <option value="">-Select Center-</option>
                              {getAvailableCenters(index).map((center) => (
                                <option key={center._id} value={center._id}>
                                  {center.centerName}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Program Button */}
              <button
                type="button"
                onClick={addProgram}
                className="flex items-center text-[#642b8f] hover:text-[#aa88be] font-medium text-sm transition-colors"
              >
                <span className="mr-1 text-lg">+</span> Add Program
              </button>

              {/* Remarks */}
              <div className="pt-4">
                <label className="block text-sm font-medium text-[#642b8f] mb-2">
                  Remarks
                </label>
                <textarea
                  rows={3}
                  className="w-full p-3 rounded-lg border-2 border-[#aa88be] focus:border-[#642b8f] focus:outline-none transition-colors resize-none"
                  placeholder="Enter your Message here..."
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
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
            to="/operation/department/enrollment-data"
            sx={{
              backgroundColor: "#ffff",
              color: "#f8a213", // Set text color for contrast
              "&:hover": {
                backgroundColor: "#642b8f", // Adjust the hover color if needed
                color: "#f8a213",
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
