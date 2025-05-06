import { useState, useEffect, useRef } from "react";
import { getAllProgrameData } from "../../../api/service/employee/EmployeeService";

// MultiSelect Dropdown Component
const MultiSelectDropdown = ({
  options,
  selected,
  onChange,
  disabled,
  hasError,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Toggle checkbox selection
  const toggleOption = (value) => {
    if (selected.includes(value)) {
      onChange(selected.filter((item) => item !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  // Get display text for selected options
  const getDisplayText = () => {
    if (selected.length === 0) {
      return "Select Levels";
    } else if (selected.length <= 2) {
      return selected
        .map((value) => {
          const option = options.find((opt) => opt.value === value);
          return option ? option.label : value;
        })
        .join(", ");
    } else {
      return `${selected.length} levels selected`;
    }
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Dropdown Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full p-2 border rounded text-left flex justify-between items-center transition-colors ${
          hasError
            ? "border-red-500 focus:ring-red-300"
            : "border-gray-300 focus:ring-blue-300"
        } ${
          disabled
            ? "bg-gray-100 text-gray-500 cursor-not-allowed"
            : "bg-white hover:bg-gray-50 cursor-pointer"
        }`}
        disabled={disabled}
      >
        <span
          className={`truncate ${
            selected.length === 0 && !disabled
              ? "text-gray-500"
              : "text-gray-700"
          }`}
        >
          {disabled ? "Select a program first" : getDisplayText()}
        </span>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${
            isOpen ? "transform rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && options.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded shadow-lg max-h-60 overflow-y-auto">
          {options.length === 0 ? (
            <div className="p-2 text-gray-500 text-sm">
              No options available
            </div>
          ) : (
            <div className="py-1">
              {options.map((option) => (
                <div
                  key={option.value}
                  className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => toggleOption(option.value)}
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(option.value)}
                    onChange={() => {}}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700 cursor-pointer">
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const ProgramLevelSelector = ({ onChange, initialData = [] }) => {
  // State for dynamic program data
  const [programData, setProgramData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialize with either initial data or one empty entry
  const [programLevels, setProgramLevels] = useState(
    initialData && initialData.length > 0
      ? initialData
      : [{ program: "", levels: [] }]
  );

  // Track validation errors
  const [errors, setErrors] = useState([]);

  // Reference to track changes for parent notification
  const hasInitialDataRef = useRef(Boolean(initialData?.length > 0));
  const notifiedRef = useRef(false);

  // Fetch program data from API
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setLoading(true);
        const response = await getAllProgrameData();

        if (response.status === 200) {
          setProgramData(response.data.programs);
        } else {
          console.error("Failed to fetch program data:", response.message);
        }
      } catch (error) {
        console.error("Error fetching program data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  // Update parent component when program levels change
  // This effect runs only once for initial data or when programLevels changes due to user actions
  useEffect(() => {
    // Initial load with valid initialData (run only once)
    if (hasInitialDataRef.current && !notifiedRef.current) {
      onChange(programLevels);
      notifiedRef.current = true;
      return;
    }
  }, []); // Empty dependency array means this runs only once on mount

  // Create program options from API data
  const getProgramOptions = () => {
    const defaultOption = { value: "", label: "Select Program" };

    if (loading || !programData.length) {
      return [defaultOption];
    }

    const options = programData.map((program) => ({
      value: program._id,
      label: program.programName,
    }));

    return [defaultOption, ...options];
  };

  // Get level options based on selected program
  const getLevelOptions = (programId) => {
    if (!programId || loading) {
      return [];
    }

    const selectedProgram = programData.find((p) => p._id === programId);

    if (!selectedProgram || !selectedProgram.programLevel.length) {
      return [];
    }

    return selectedProgram.programLevel.map((level) => ({
      value: level,
      label: level,
    }));
  };

  // Add new program-level pair
  const addProgramLevel = () => {
    const updatedProgramLevels = [
      ...programLevels,
      { program: "", levels: [] },
    ];
    setProgramLevels(updatedProgramLevels);
    setErrors([...errors, { program: false, levels: false }]);
    // Notify parent about the change
    onChange(updatedProgramLevels);
  };

  // Remove a program-level pair
  const removeProgramLevel = (index) => {
    if (programLevels.length > 1) {
      const updatedProgramLevels = [...programLevels];
      updatedProgramLevels.splice(index, 1);
      setProgramLevels(updatedProgramLevels);

      const updatedErrors = [...errors];
      updatedErrors.splice(index, 1);
      setErrors(updatedErrors);

      // Notify parent about the change
      onChange(updatedProgramLevels);
    }
  };

  // Handle change in program selection
  const handleProgramChange = (index, value) => {
    const updatedProgramLevels = [...programLevels];
    updatedProgramLevels[index] = { program: value, levels: [] };
    setProgramLevels(updatedProgramLevels);

    // Clear error for this field if it exists
    if (errors[index] && errors[index].program) {
      const updatedErrors = [...errors];
      updatedErrors[index] = { ...updatedErrors[index], program: false };
      setErrors(updatedErrors);
    }

    // Notify parent about the change
    onChange(updatedProgramLevels);
  };

  // Handle change in level selection
  const handleLevelChange = (index, selected) => {
    const updatedProgramLevels = [...programLevels];
    updatedProgramLevels[index].levels = selected;
    setProgramLevels(updatedProgramLevels);

    // Clear error if levels are selected
    if (errors[index]?.levels && selected.length > 0) {
      const updatedErrors = [...errors];
      updatedErrors[index] = {
        ...updatedErrors[index],
        levels: false,
      };
      setErrors(updatedErrors);
    }

    // Notify parent about the change
    onChange(updatedProgramLevels);
  };

  return (
    <div className="mb-6">
      <div className="mb-3">
        <label className="text-gray-800 font-semibold text-lg">
          Programs & Levels<span className="text-red-500">*</span>
        </label>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="grid grid-cols-12 gap-2 mb-2 px-2">
          <div className="col-span-5">
            <span className="text-sm font-medium text-gray-600">Program</span>
          </div>
          <div className="col-span-5">
            <span className="text-sm font-medium text-gray-600">
              Levels (Select Multiple)
            </span>
          </div>
          <div className="col-span-2"></div>
        </div>

        {loading ? (
          <div className="text-center py-4 text-gray-500">
            Loading programs...
          </div>
        ) : (
          programLevels.map((item, index) => (
            <div
              key={index}
              className={`grid grid-cols-12 gap-2 items-center mb-2 ${
                index > 0 ? "mt-2" : ""
              }`}
            >
              {/* Program Selection */}
              <div className="col-span-5">
                <select
                  value={item.program}
                  onChange={(e) => handleProgramChange(index, e.target.value)}
                  className={`w-full p-2 border rounded focus:outline-none focus:ring-1 transition-colors ${
                    errors[index]?.program
                      ? "border-red-500 focus:ring-red-300"
                      : "border-gray-300 focus:ring-blue-300"
                  }`}
                >
                  {getProgramOptions().map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors[index]?.program && (
                  <p className="text-red-500 text-xs mt-1">Required</p>
                )}
              </div>

              {/* Level Selection with Dropdown Multi-Select */}
              <div className="col-span-5">
                <div className="relative">
                  <MultiSelectDropdown
                    options={getLevelOptions(item.program)}
                    selected={item.levels}
                    onChange={(selected) => handleLevelChange(index, selected)}
                    disabled={!item.program}
                    hasError={errors[index]?.levels}
                  />
                  {errors[index]?.levels && (
                    <p className="text-red-500 text-xs mt-1">
                      Select at least one level
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="col-span-2 flex justify-end">
                {/* Delete Button */}
                {programLevels.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeProgramLevel(index)}
                    className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 focus:outline-none transition-colors duration-200"
                    aria-label="Remove program-level"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                )}

                {/* Add Button (only on last row) */}
                {index === programLevels.length - 1 && (
                  <button
                    type="button"
                    onClick={addProgramLevel}
                    className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50 focus:outline-none focus:ring-1 focus:ring-blue-300 transition-colors duration-200 ml-1"
                    aria-label="Add another program"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProgramLevelSelector;
