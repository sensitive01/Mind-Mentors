/* eslint-disable react/prop-types */
import { Plus, Trash2, X } from "lucide-react";
import { useState, useEffect } from "react";
import { getAllProgrameDataEnquiry } from "../../../../../api/service/employee/EmployeeService";

const EditDialogBox = ({
  showEdit,
  onEditClose,
  formData,
  handleInputChange,
  handleSave,
}) => {
  const [programsData, setProgramsData] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState("");
  const [availablePrograms, setAvailablePrograms] = useState([]);
  const [availableLevels, setAvailableLevels] = useState({});

  // Fetch programs data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllProgrameDataEnquiry();
        console.log("Programs Response", response);
        if (response.status === 200) {
          setProgramsData(response.data.programs);
        }
      } catch (error) {
        console.error("Error fetching programs data:", error);
      }
    };
    if (showEdit) {
      fetchData();
    }
  }, [showEdit]);

  // Handle center selection and update available programs
  const handleCenterChange = (centerId) => {
    setSelectedCenter(centerId);
    const selectedCenterData = programsData.find(
      (center) => center._id === centerId
    );
    if (selectedCenterData) {
      setAvailablePrograms(selectedCenterData.programLevels || []);
    } else {
      setAvailablePrograms([]);
    }
    setAvailableLevels({});

    // Reset all programs when center changes
    handleInputChange("programs", []);
  };

  // Handle program selection and update available levels for specific program
  const handleProgramChange = (programName, programIndex) => {
    const selectedProgramData = availablePrograms.find(
      (prog) => prog.program === programName
    );

    const newAvailableLevels = { ...availableLevels };
    if (selectedProgramData) {
      newAvailableLevels[programIndex] = selectedProgramData.levels || [];
    } else {
      newAvailableLevels[programIndex] = [];
    }
    setAvailableLevels(newAvailableLevels);

    // Update the program in formData
    const updatedPrograms = [...(formData?.programs || [])];
    updatedPrograms[programIndex] = {
      ...updatedPrograms[programIndex],
      program: programName,
      level: "", // Reset level when program changes
    };
    handleInputChange("programs", updatedPrograms);
  };

  // Handle level change
  const handleLevelChange = (level, programIndex) => {
    const updatedPrograms = [...(formData?.programs || [])];
    updatedPrograms[programIndex] = {
      ...updatedPrograms[programIndex],
      level: level,
    };
    handleInputChange("programs", updatedPrograms);
  };

  // Add new program
  const addProgram = () => {
    const updatedPrograms = [
      ...(formData?.programs || []),
      { program: "", level: "" },
    ];
    handleInputChange("programs", updatedPrograms);
  };

  // Remove program
  const removeProgram = (index) => {
    const updatedPrograms = formData.programs.filter((_, i) => i !== index);
    handleInputChange("programs", updatedPrograms);

    // Remove levels for this program index
    const newAvailableLevels = { ...availableLevels };
    delete newAvailableLevels[index];
    setAvailableLevels(newAvailableLevels);
  };

  if (!showEdit) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-6xl max-h-[90vh] rounded-lg shadow-xl flex flex-col">
        <style>
          {`
          .custom-gradient {
            background: linear-gradient(to bottom, #642b8f, #aa88be);
          }
        `}
        </style>

        {/* Header */}
        <div className="custom-gradient flex justify-between items-center p-4 rounded-t-lg">
          <h2 className="text-white text-xl font-semibold">Edit Details</h2>
          <button
            onClick={onEditClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Parent Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Parent Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Parent Name
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-lg focus:ring-1 focus:ring-purple-500"
                    value={formData?.parentName || ""}
                    onChange={(e) =>
                      handleInputChange("parentName", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full p-2 border rounded-lg focus:ring-1 focus:ring-purple-500"
                    value={formData?.email || ""}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    WhatsApp Number
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-lg focus:ring-1 focus:ring-purple-500"
                    value={formData?.whatsappNumber || ""}
                    onChange={(e) =>
                      handleInputChange("whatsappNumber", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Number
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-lg focus:ring-1 focus:ring-purple-500"
                    value={formData?.contactNumber || ""}
                    onChange={(e) =>
                      handleInputChange("contactNumber", e.target.value)
                    }
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-lg focus:ring-1 focus:ring-purple-500"
                    value={formData?.address || ""}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>

            {/* Kid Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Kid Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kid Name
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-lg focus:ring-1 focus:ring-purple-500"
                    value={formData?.kidName || ""}
                    onChange={(e) =>
                      handleInputChange("kidName", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Age
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-lg focus:ring-1 focus:ring-purple-500"
                    value={formData?.kidsAge || ""}
                    onChange={(e) =>
                      handleInputChange("kidsAge", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    className="w-full p-2 border rounded-lg focus:ring-1 focus:ring-purple-500"
                    value={formData?.kidsGender || ""}
                    onChange={(e) =>
                      handleInputChange("kidsGender", e.target.value)
                    }
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pincode
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-lg focus:ring-1 focus:ring-purple-500"
                    value={formData?.pincode || ""}
                    onChange={(e) =>
                      handleInputChange("pincode", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-lg focus:ring-1 focus:ring-purple-500"
                    value={formData?.city || ""}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-lg focus:ring-1 focus:ring-purple-500"
                    value={formData?.state || ""}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Center Selection */}
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Center Selection (Optional)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Center
                  </label>
                  <select
                    className="w-full p-2 border rounded-lg focus:ring-1 focus:ring-purple-500"
                    value={selectedCenter}
                    onChange={(e) => handleCenterChange(e.target.value)}
                  >
                    <option value="">Select a center...</option>
                    {programsData.map((center) => (
                      <option key={center._id} value={center._id}>
                        {center.centerName} ({center.centerType})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Programs */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Programs</h3>
                <button
                  className="flex items-center gap-1 px-3 py-1 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={addProgram}
                  disabled={!selectedCenter && availablePrograms.length === 0}
                >
                  <Plus size={16} />
                  Add Program
                </button>
              </div>

              {!selectedCenter && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-700 text-sm">
                    💡 Tip: Select a center above to get filtered program
                    options, or add programs manually.
                  </p>
                </div>
              )}

              <div className="space-y-4">
                {formData?.programs?.map((program, index) => (
                  <div key={index} className="p-4 border rounded-lg bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                      <div className="md:col-span-5">
                        {selectedCenter ? (
                          <select
                            className="w-full p-2 border rounded-lg focus:ring-1 focus:ring-purple-500"
                            value={program.program || ""}
                            onChange={(e) =>
                              handleProgramChange(e.target.value, index)
                            }
                          >
                            <option value="">Select Program</option>
                            {availablePrograms.map((prog, progIndex) => (
                              <option key={progIndex} value={prog.program}>
                                {prog.program}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            placeholder="Program Name"
                            className="w-full p-2 border rounded-lg focus:ring-1 focus:ring-purple-500"
                            value={program.program || ""}
                            onChange={(e) => {
                              const updatedPrograms = [...formData.programs];
                              updatedPrograms[index].program = e.target.value;
                              handleInputChange("programs", updatedPrograms);
                            }}
                          />
                        )}
                      </div>
                      <div className="md:col-span-5">
                        {selectedCenter && availableLevels[index] ? (
                          <select
                            className="w-full p-2 border rounded-lg focus:ring-1 focus:ring-purple-500"
                            value={program.level || ""}
                            onChange={(e) =>
                              handleLevelChange(e.target.value, index)
                            }
                            disabled={!program.program}
                          >
                            <option value="">Select Level</option>
                            {availableLevels[index].map((level, levelIndex) => (
                              <option key={levelIndex} value={level}>
                                {level}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            placeholder="Level"
                            className="w-full p-2 border rounded-lg focus:ring-1 focus:ring-purple-500"
                            value={program.level || ""}
                            onChange={(e) => {
                              const updatedPrograms = [...formData.programs];
                              updatedPrograms[index].level = e.target.value;
                              handleInputChange("programs", updatedPrograms);
                            }}
                          />
                        )}
                      </div>
                      <div className="md:col-span-2 flex justify-end">
                        <button
                          onClick={() => removeProgram(index)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {(!formData?.programs || formData.programs.length === 0) && (
                  <div className="text-center py-8 text-gray-500">
                    <p>
                      No programs added yet. Click "Add Program" to get started.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Status Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Status Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Enquiry Field
                  </label>
                  <select
                    className="w-full p-2 border rounded-lg focus:ring-1 focus:ring-purple-500"
                    value={formData?.enquiryField || ""}
                    onChange={(e) =>
                      handleInputChange("enquiryField", e.target.value)
                    }
                  >
                    <option value="">Select Enquiry Field</option>
                    <option value="enquiryList">Enquiry List</option>
                    <option value="prospects">Prospects</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Status
                  </label>
                  <select
                    className="w-full p-2 border rounded-lg focus:ring-1 focus:ring-purple-500"
                    value={formData?.paymentStatus || ""}
                    onChange={(e) =>
                      handleInputChange("paymentStatus", e.target.value)
                    }
                  >
                    <option value="">Select Payment Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Success">Success</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Source
                  </label>
                  <select
                    className="w-full p-2 border rounded-lg focus:ring-1 focus:ring-purple-500"
                    value={formData?.source || ""}
                    onChange={(e) =>
                      handleInputChange("source", e.target.value)
                    }
                  >
                    <option value="">Select Source</option>
                    <option value="website">Website</option>
                    <option value="referral">Referral</option>
                    <option value="social">Social Media</option>
                    <option value="phone">Phone</option>
                    <option value="email">Email</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Disposition
                  </label>
                  <select
                    className="w-full p-2 border rounded-lg focus:ring-1 focus:ring-purple-500"
                    value={formData?.disposition || ""}
                    onChange={(e) =>
                      handleInputChange("disposition", e.target.value)
                    }
                  >
                    <option value="">Select Disposition</option>
                    <option value="RnR">RnR</option>
                    <option value="Call Back">Call Back</option>
                    <option value="None">None</option>
                    <option value="Interested">Interested</option>
                    <option value="Not Interested">Not Interested</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Demo Schedule Status
                  </label>
                  <select
                    className="w-full p-2 border rounded-lg focus:ring-1 focus:ring-purple-500"
                    value={formData?.scheduleDemo?.status || ""}
                    onChange={(e) =>
                      handleInputChange("scheduleDemo", {
                        ...formData?.scheduleDemo,
                        status: e.target.value,
                      })
                    }
                  >
                    <option value="">Select Demo Status</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Enrollment Status
                  </label>
                  <select
                    className="w-full p-2 border rounded-lg focus:ring-1 focus:ring-purple-500"
                    value={formData?.enquiryStatus || ""}
                    onChange={(e) =>
                      handleInputChange("enquiryStatus", e.target.value)
                    }
                  >
                    <option value="">Select Enrollment Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Qualified Lead">Qualified Lead</option>
                    <option value="Unqualified Lead">Unqualified Lead</option>
                    <option value="Enrolled">Enrolled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Enquiry Type
                  </label>
                  <select
                    className="w-full p-2 border rounded-lg focus:ring-1 focus:ring-purple-500"
                    value={formData?.enquiryType || ""}
                    onChange={(e) =>
                      handleInputChange("enquiryType", e.target.value)
                    }
                  >
                    <option value="">Select Enquiry Type</option>
                    <option value="warm">Warm</option>
                    <option value="cold">Cold</option>
                    <option value="hot">Hot</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Messages and Notes */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Messages & Notes</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Remarks
                  </label>
                  <textarea
                    className="w-full p-2 border rounded-lg focus:ring-1 focus:ring-purple-500 min-h-24 resize-none"
                    placeholder="Enter remarks..."
                    value={formData?.message || ""}
                    onChange={(e) =>
                      handleInputChange("message", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    className="w-full p-2 border rounded-lg focus:ring-1 focus:ring-purple-500 min-h-24 resize-none"
                    placeholder="Enter notes..."
                    value={formData?.notes || ""}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4 flex justify-end gap-2">
          <button
            onClick={onEditClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditDialogBox;
