/* eslint-disable react/prop-types */
import { Plus, Trash2, X } from "lucide-react";
import { useState, useEffect } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { getAllProgrameDataEnquiry } from "../../../../../api/service/employee/EmployeeService";

const EditDialogBox = ({
  showEdit,
  onEditClose,
  formData,
  handleInputChange,
  handleSave,
}) => {

  console.log(formData)
  const [programsData, setProgramsData] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState("");
  const [availablePrograms, setAvailablePrograms] = useState([]);
  const [availableLevels, setAvailableLevels] = useState({});
  const [isFetchingPincode, setIsFetchingPincode] = useState(false);

  // Enhanced name change handlers
  const handleParentNameChange = (value) => {
    console.log("EditDialog - Parent name changed:", value);
    const names = value.trim().split(" ");
    const firstName = names[0] || "";
    const lastName = names.slice(1).join(" ");

    // Update all related fields
    handleInputChange("parentName", value);
    handleInputChange("parentFirstName", firstName);
    handleInputChange("parentLastName", lastName);
  };

  const handleKidNameChange = (value) => {
    console.log("EditDialog - Kid name changed:", value);
    const names = value.trim().split(" ");
    const firstName = names[0] || "";
    const lastName = names.slice(1).join(" ");

    // Update all related fields
    handleInputChange("kidName", value);
    handleInputChange("kidFirstName", firstName);
    handleInputChange("kidLastName", lastName);
  };

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

  // Initialize program options when edit dialog opens and data is available
  useEffect(() => {
    if (showEdit && programsData.length > 0) {
      // Create a flattened list of all unique programs from all centers
      const allPrograms = programsData
        .flatMap((center) => center.programLevels)
        .filter(
          (prog, index, arr) =>
            arr.findIndex((p) => p.program === prog.program) === index
        );

      setAvailablePrograms(allPrograms);

      // If there are existing programs in formData, find levels for each one
      if (formData?.programs && formData.programs.length > 0) {
        const newAvailableLevels = {};
        formData.programs.forEach((program, index) => {
          const programData = allPrograms.find(
            (p) => p.program === program.program
          );
          if (programData) {
            newAvailableLevels[index] = programData.levels;
          }
        });
        setAvailableLevels(newAvailableLevels);
      }
    }
  }, [showEdit, programsData, formData?.programs]);

  // Fetch city and state based on pincode
  const fetchPincodeDetails = async (pincode) => {
    if (pincode.length === 6) {
      setIsFetchingPincode(true);
      try {
        const response = await fetch(
          `https://api.postalpincode.in/pincode/${pincode}`
        );
        const data = await response.json();

        if (data[0].Status === "Success") {
          const postOffice = data[0].PostOffice[0];
          handleInputChange("city", postOffice.District);
          handleInputChange("state", postOffice.State);
        }
      } catch (error) {
        console.error("Error fetching pincode details:", error);
      } finally {
        setIsFetchingPincode(false);
      }
    }
  };

  // Handle pincode change
  const handlePincodeChange = (e) => {
    const value = e.target.value;
    handleInputChange("pincode", value);

    // Only fetch if pincode is 6 digits
    if (value.length === 6) {
      fetchPincodeDetails(value);
    }
  };

  // Handle center selection and update available programs
  const handleCenterChange = (centerId) => {
    setSelectedCenter(centerId);
    const selectedCenterData = programsData.find(
      (center) => center._id === centerId
    );

    if (selectedCenterData) {
      setAvailablePrograms(selectedCenterData.programLevels || []);
    } else {
      // If no center selected, show all programs
      const allPrograms = programsData
        .flatMap((center) => center.programLevels)
        .filter(
          (prog, index, arr) =>
            arr.findIndex((p) => p.program === prog.program) === index
        );
      setAvailablePrograms(allPrograms);
    }
    setAvailableLevels({});

    // Reset all programs when center changes
    handleInputChange("programs", []);
  };

  // Handle program selection and update available levels for specific program
  const handleProgramChange = (programName, programIndex) => {
    // Find the program data from availablePrograms
    let selectedProgramData = availablePrograms.find(
      (prog) => prog.program === programName
    );

    // If not found in availablePrograms, search across all centers
    if (!selectedProgramData) {
      for (const center of programsData) {
        selectedProgramData = center.programLevels.find(
          (p) => p.program === programName
        );
        if (selectedProgramData) break;
      }
    }

    const newAvailableLevels = { ...availableLevels };
    if (selectedProgramData) {
      newAvailableLevels[programIndex] = selectedProgramData.levels || [];
    } else {
      newAvailableLevels[programIndex] = [];
    }
    setAvailableLevels(newAvailableLevels);

    // Update the program in formData
    const updatedPrograms = [...(formData?.programs || [])];
    const existingLevel = updatedPrograms[programIndex]?.level;

    // Keep existing level if it's valid for the new program, otherwise use first available level
    const validLevel = selectedProgramData?.levels?.includes(existingLevel)
      ? existingLevel
      : selectedProgramData?.levels?.[0] || "";

    updatedPrograms[programIndex] = {
      ...updatedPrograms[programIndex],
      program: programName,
      level: validLevel,
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
                    value={formData?.parentName || `${formData?.parentFirstName || ''} ${formData?.parentLastName || ''}`.trim()}
                    onChange={(e) => handleParentNameChange(e.target.value)}
                    placeholder="Enter parent's full name"
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
                  <PhoneInput
                    country={"in"}
                    value={formData?.whatsappNumber || ""}
                    onChange={(value) =>
                      handleInputChange("whatsappNumber", value)
                    }
                    inputStyle={{
                      width: "100%",
                      height: "42px",
                      fontSize: "16px",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                    }}
                    containerStyle={{
                      width: "100%",
                    }}
                    buttonStyle={{
                      border: "1px solid #d1d5db",
                      borderRadius: "8px 0 0 8px",
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Number
                  </label>
                  <PhoneInput
                    country={"in"}
                    value={formData?.contactNumber || ""}
                    onChange={(value) =>
                      handleInputChange("contactNumber", value)
                    }
                    inputStyle={{
                      width: "100%",
                      height: "42px",
                      fontSize: "16px",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                    }}
                    containerStyle={{
                      width: "100%",
                    }}
                    buttonStyle={{
                      border: "1px solid #d1d5db",
                      borderRadius: "8px 0 0 8px",
                    }}
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
                    value={formData?.kidName || `${formData?.kidFirstName || ''} ${formData?.kidLastName || ''}`.trim()}
                    onChange={(e) => handleKidNameChange(e.target.value)}
                    placeholder="Enter kid's full name"
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
                    {isFetchingPincode && (
                      <span className="text-blue-500 text-xs ml-2">
                        Fetching location...
                      </span>
                    )}
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-lg focus:ring-1 focus:ring-purple-500"
                    value={formData?.pincode || ""}
                    onChange={handlePincodeChange}
                    disabled={isFetchingPincode}
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
                    <option value="">All Centers</option>
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
                  className="flex items-center gap-1 px-3 py-1 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50"
                  onClick={addProgram}
                >
                  <Plus size={16} />
                  Add Program
                </button>
              </div>

              <div className="space-y-4">
                {formData?.programs?.map((program, index) => {
                  // Find current program data to get available levels
                  let currentProgramData = availablePrograms.find(
                    (p) => p.program === program.program
                  );

                  // If not found in availablePrograms, search all centers
                  if (!currentProgramData) {
                    for (const center of programsData) {
                      currentProgramData = center.programLevels.find(
                        (p) => p.program === program.program
                      );
                      if (currentProgramData) break;
                    }
                  }

                  const levelsForCurrentProgram =
                    currentProgramData?.levels || [];

                  return (
                    <div
                      key={index}
                      className="p-4 border rounded-lg bg-gray-50"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                        <div className="md:col-span-5">
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
                        </div>
                        <div className="md:col-span-5">
                          <select
                            className="w-full p-2 border rounded-lg focus:ring-1 focus:ring-purple-500"
                            value={program.level || ""}
                            onChange={(e) =>
                              handleLevelChange(e.target.value, index)
                            }
                            disabled={!program.program}
                          >
                            <option value="">Select Level</option>
                            {levelsForCurrentProgram.map(
                              (level, levelIndex) => (
                                <option key={levelIndex} value={level}>
                                  {level}
                                </option>
                              )
                            )}
                          </select>
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
                  );
                })}

                {(!formData?.programs || formData.programs.length === 0) && (
                  <div className="text-center py-8 text-gray-500">
                    <p>
                      No programs added yet. Click "Add Program" to get started.
                    </p>
                  </div>
                )}
              </div>
            </div>



            <div>
              <h3 className="text-lg font-semibold mb-4">Messages & Notes</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Remarks
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
