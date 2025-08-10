import {
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import axios from "axios";
import { useState, useEffect } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Link } from "react-router-dom";
import {
  addNewEmployee,
  getAllPhysicalcenters,
} from "../../../../api/service/employee/hrService";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const AddEmployeeForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    phoneNumber: "",
    address: "",
    gender: "",
    department: "",
    role: "",
    centerId: "",
    centerName: "",
    password: "",
    modes: {
      online: false,
      offline: false,
    },
    // New coach-specific fields
    perHourRate: "",
    employmentType: "",
  });

  const [centers, setCenters] = useState([]);
  const [filteredCenters, setFilteredCenters] = useState([]);
  const [showCenterDropdown, setShowCenterDropdown] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchCenters = async () => {
      const response = await getAllPhysicalcenters();
      if (response.status === 200) {
        setCenters(response.data.physicalCenter);
      }
      console.log(response);
    };
    fetchCenters();
  }, []);

  // Filter centers based on selected modes
  useEffect(() => {
    if (centers.length > 0) {
      let filtered = [];

      if (formData.modes.online && formData.modes.offline) {
        // If both modes are selected, show all centers
        filtered = centers;
      } else if (formData.modes.online) {
        // If only online mode is selected
        filtered = centers.filter((center) => center.centerType === "online");
      } else if (formData.modes.offline) {
        // If only offline mode is selected
        filtered = centers.filter((center) => center.centerType === "offline");
      }

      setFilteredCenters(filtered);

      // Clear selected center if it's not in the filtered list
      if (formData.centerId) {
        const centerStillValid = filtered.some(
          (center) => center._id === formData.centerId
        );
        if (!centerStillValid) {
          setFormData((prev) => ({
            ...prev,
            centerId: "",
            centerName: "",
          }));
        }
      }
    }
  }, [centers, formData.modes.online, formData.modes.offline]);

  useEffect(() => {
    // Show center dropdown if department or role is "centeradmin" or any mode is selected
    if (
      formData.department === "centeradmin" ||
      formData.role === "centeradmin" ||
      formData.modes.offline ||
      formData.modes.online
    ) {
      setShowCenterDropdown(true);
    } else {
      setShowCenterDropdown(false);
      // Clear center selection if not a center admin or no mode is selected
      setFormData((prev) => ({
        ...prev,
        centerId: "",
        centerName: "",
      }));
    }
  }, [
    formData.department,
    formData.role,
    formData.modes.offline,
    formData.modes.online,
  ]);

  // Clear coach-specific fields when role changes from coach to something else
  useEffect(() => {
    if (formData.role !== "coach" && formData.department !== "coach") {
      setFormData((prev) => ({
        ...prev,
        perHourRate: "",
        employmentType: "",
      }));
    }
  }, [formData.role, formData.department]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleModeChange = (mode) => {
    setFormData((prev) => ({
      ...prev,
      modes: {
        ...prev.modes,
        [mode]: !prev.modes[mode],
      },
    }));
  };

  const handleCenterChange = (e) => {
    const selectedId = e.target.value;
    const selectedCenter = centers.find((center) => center._id === selectedId);

    if (selectedCenter) {
      setFormData((prev) => ({
        ...prev,
        centerId: selectedCenter._id,
        centerName: selectedCenter.centerName,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        centerId: "",
        centerName: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Convert modes object to array for submission
      const modesArray = Object.entries(formData.modes)
        .filter(([_, isSelected]) => isSelected)
        .map(([modeName]) => modeName);

      // Prepare the data to be submitted - only the fields we're keeping
      const formDataToSubmit = {
        firstName: formData.firstName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        gender: formData.gender,
        department: formData.department,
        role: formData.role,
        password: formData.password,
        modes: modesArray, // Submit as array of selected modes
      };

      // Only include center data if it's selected
      if (formData.centerId) {
        formDataToSubmit.centerId = formData.centerId;
        formDataToSubmit.centerName = formData.centerName;
      }

      // Include coach-specific fields if role or department is coach
      if (formData.role === "coach" || formData.department === "coach") {
        formDataToSubmit.perHourRate = parseFloat(formData.perHourRate);
        formDataToSubmit.employmentType = formData.employmentType;
      }

      let response;

      response = await addNewEmployee(formDataToSubmit);
      console.log("User updated:", response.data);
      alert("User updated successfully!");
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
      // alert('There was an error submitting the data.');
    }
  };

  // Department options
  const departmentOptions = [
    "operation",
    "service-delivery",
    "renewal",
    "marketing",
    "centeradmin",
    "coach",
  ];

  // Role options (same as departments for now as per requirements)
  const roleOptions = [
    "operation",
    "service-delivery",
    "renewal",
    "marketing",
    "centeradmin",
    "coach",
  ];

  const genderOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Other", label: "Other" },
  ];

  const employmentTypeOptions = [
    { value: "full-time", label: "Full-time Employee" },
    { value: "freelancer", label: "Freelancer" },
  ];

  // Determine if at least one mode is selected (for validation)
  const isAnyModeSelected = formData.modes.online || formData.modes.offline;

  // Check if coach-specific fields should be shown
  const isCoach = formData.role === "coach" || formData.department === "coach";

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-[#642b8f] to-[#aa88be] p-8 text-white flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold mb-2">
              {formData.id ? "Edit Employee" : "New Employee"}
            </h2>
            <p className="text-sm opacity-90">
              Please fill in all the required employee information
            </p>
          </div>
          <Button
            variant="contained"
            style={{ backgroundColor: "#642b8f", color: "white" }}
            component={Link}
            to="/super-admin/department/employees"
          >
            View Employees
          </Button>
        </div>
        <form className="p-8" onSubmit={handleSubmit}>
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-[#642b8f] font-semibold text-lg pb-2 border-b-2 border-[#f8a213]">
                Employee Information
              </h3>

              {/* Full Name and Gender in one row */}
              <div className="flex gap-4 mb-4">
                <TextField
                  label="Full Name"
                  variant="outlined"
                  className="flex-1"
                  value={formData.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                  required
                  fullWidth
                  multiline
                />

                <FormControl variant="outlined" className="w-1/3" required>
                  <InputLabel id="gender-label">Gender</InputLabel>
                  <Select
                    labelId="gender-label"
                    id="gender"
                    value={formData.gender}
                    onChange={(e) =>
                      handleInputChange("gender", e.target.value)
                    }
                    label="Gender"
                  >
                    <MenuItem value="" disabled>
                      <em>Select Gender</em>
                    </MenuItem>
                    {genderOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              {/* Email and Mobile in one row */}
              <div className="flex gap-4 mb-4">
                <TextField
                  label="Email"
                  type="email"
                  variant="outlined"
                  className="flex-1"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                  fullWidth
                />

                <FormControl variant="outlined" className="flex-1">
                  <InputLabel
                    shrink
                    htmlFor="phone-input"
                    style={{ backgroundColor: "white", padding: "0 5px" }}
                  >
                    Phone Number
                  </InputLabel>
                  <div className="mt-2 border rounded">
                    <PhoneInput
                      country={"in"}
                      value={formData.phoneNumber}
                      onChange={(value) =>
                        handleInputChange("phoneNumber", value)
                      }
                      inputProps={{
                        placeholder: "Phone Number",
                        className: "w-full p-3 !border-0 focus:outline-none",
                      }}
                      containerClass="w-full"
                      buttonClass="!border-0"
                      preferredCountries={["in"]}
                    />
                  </div>
                </FormControl>
              </div>

              {/* Department, Mode Checkboxes, and Role in one row */}
              <div className="flex gap-4 mb-4">
                <FormControl variant="outlined" className="flex-1" required>
                  <InputLabel id="department-label">Department</InputLabel>
                  <Select
                    labelId="department-label"
                    id="department"
                    value={formData.department}
                    onChange={(e) =>
                      handleInputChange("department", e.target.value)
                    }
                    label="Department"
                  >
                    <MenuItem value="" disabled>
                      <em>Select Department</em>
                    </MenuItem>
                    {departmentOptions.map((dept, index) => (
                      <MenuItem key={index} value={dept}>
                        {dept}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Mode Dropdown with Multiple Checkboxes */}
                <FormControl
                  variant="outlined"
                  className="flex-1"
                  required
                  error={!isAnyModeSelected}
                >
                  <InputLabel id="mode-checkbox-label">Mode</InputLabel>
                  <Select
                    labelId="mode-checkbox-label"
                    id="mode-checkbox"
                    multiple
                    value={Object.entries(formData.modes)
                      .filter(([_, selected]) => selected)
                      .map(([mode]) => mode)}
                    onChange={(e) => {
                      const selectedValues = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        modes: {
                          online: selectedValues.includes("online"),
                          offline: selectedValues.includes("offline"),
                        },
                      }));
                    }}
                    renderValue={(selected) => selected.join(", ")}
                    label="Mode"
                  >
                    <MenuItem value="online">
                      <Checkbox checked={formData.modes.online} />
                      <Typography>Online</Typography>
                    </MenuItem>
                    <MenuItem value="offline">
                      <Checkbox checked={formData.modes.offline} />
                      <Typography>Offline</Typography>
                    </MenuItem>
                  </Select>
                  {!isAnyModeSelected && (
                    <FormHelperText error>
                      Please select at least one mode
                    </FormHelperText>
                  )}
                </FormControl>

                <FormControl variant="outlined" className="flex-1" required>
                  <InputLabel id="role-label">Role</InputLabel>
                  <Select
                    labelId="role-label"
                    id="role"
                    value={formData.role}
                    onChange={(e) => handleInputChange("role", e.target.value)}
                    label="Role"
                  >
                    <MenuItem value="" disabled>
                      <em>Select Role</em>
                    </MenuItem>
                    {roleOptions.map((role, index) => (
                      <MenuItem key={index} value={role}>
                        {role}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              {/* Coach-specific fields - shown only when coach is selected */}
              {isCoach && (
                <>
                  <h3 className="text-[#642b8f] font-semibold text-lg pb-2 border-b-2 border-[#f8a213] mt-6">
                    Coach Information
                  </h3>
                  
                  <div className="flex gap-4 mb-4">
                    <TextField
                      label="Per Hour Rate"
                      type="number"
                      variant="outlined"
                      className="flex-1"
                      value={formData.perHourRate}
                      onChange={(e) =>
                        handleInputChange("perHourRate", e.target.value)
                      }
                      required={isCoach}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">₹</InputAdornment>
                        ),
                      }}
                      inputProps={{
                        min: 0,
                        step: "0.01",
                      }}
                      helperText="Enter the hourly rate for coaching sessions"
                    />

                    <FormControl variant="outlined" className="flex-1" required={isCoach}>
                      <InputLabel id="employment-type-label">Employment Type</InputLabel>
                      <Select
                        labelId="employment-type-label"
                        id="employment-type"
                        value={formData.employmentType}
                        onChange={(e) =>
                          handleInputChange("employmentType", e.target.value)
                        }
                        label="Employment Type"
                      >
                        <MenuItem value="" disabled>
                          <em>Select Employment Type</em>
                        </MenuItem>
                        {employmentTypeOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>
                        Select whether the coach is a full-time employee or freelancer
                      </FormHelperText>
                    </FormControl>
                  </div>
                </>
              )}

              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                className="flex-1"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                required
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {/* Conditional Center dropdown with filtered centers */}
              {showCenterDropdown && (
                <div className="mb-4">
                  <FormControl
                    variant="outlined"
                    fullWidth
                    required={showCenterDropdown}
                  >
                    <InputLabel id="center-label">Physical Center</InputLabel>
                    <Select
                      labelId="center-label"
                      id="center"
                      value={formData.centerId}
                      onChange={handleCenterChange}
                      label="Physical Center"
                    >
                      <MenuItem value="" disabled>
                        <em>Select Center</em>
                      </MenuItem>
                      {filteredCenters.map((center) => (
                        <MenuItem key={center._id} value={center._id}>
                          {center.centerName} ({center.centerType})
                        </MenuItem>
                      ))}
                    </Select>
                    {formData.centerName && (
                      <FormHelperText>
                        Selected: {formData.centerName}
                      </FormHelperText>
                    )}
                  </FormControl>
                </div>
              )}

              {/* Address as textarea */}
              <div className="mb-4">
                <TextField
                  label="Address"
                  variant="outlined"
                  multiline
                  rows={3}
                  fullWidth
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-6 mt-8">
            <Button
              type="submit"
              variant="contained"
              style={{
                backgroundColor: "#642b8f",
                color: "white",
                padding: "10px 32px",
              }}
              disabled={!isAnyModeSelected || (isCoach && (!formData.perHourRate || !formData.employmentType))}
            >
              Submit
            </Button>
            <Button
              type="reset"
              variant="outlined"
              style={{
                borderColor: "#642b8f",
                color: "#642b8f",
                padding: "10px 32px",
              }}
              onClick={() => {
                setFormData({
                  firstName: "",
                  email: "",
                  phoneNumber: "",
                  address: "",
                  gender: "",
                  department: "",
                  role: "",
                  centerId: "",
                  centerName: "",
                  password: "",
                  modes: { online: false, offline: false },
                  perHourRate: "",
                  employmentType: "",
                });
              }}
            >
              Reset Form
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeForm;