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
import MultipleFileUpload from "../../../../components/uploader/MultipleFileUpload";

const AddEmployeeForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    phoneNumber: "",
    address: "",
    gender: "",
    department: "",
    role: "",
    // Replaced single centerId/Name with array
    selectedCenters: [],
    password: "",
    modes: {
      online: false,
      offline: false,
    },
    // New coach-specific fields
    perHourRate: "",
    employmentType: "",
    // New Personal & Bank Details
    dob: "",
    doj: "",
    bloodGroup: "",
    accountNumber: "",
    panCard: "",
    idCard: "",
    emergencyContact: "",
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

      // Auto-select 'online' centers if only online mode is active
      if (formData.modes.online && !formData.modes.offline) {
        const onlineCentersIds = centers
          .filter((center) => center.centerType === "online")
          .map((center) => center._id);

        setFormData((prev) => {
          // Avoid infinite loop by checking if changes are actually needed
          const currentSelected = new Set(prev.selectedCenters);
          const hasAllOnline = onlineCentersIds.every((id) =>
            currentSelected.has(id)
          );

          if (!hasAllOnline) {
            return {
              ...prev,
              selectedCenters: [
                ...new Set([...prev.selectedCenters, ...onlineCentersIds]),
              ],
            };
          }
          return prev;
        });
      }

      // Clear selected centers that are no longer valid in the filtered list
      if (formData.selectedCenters.length > 0) {
        const validSelectedCenters = formData.selectedCenters.filter(
          (selectedId) => filtered.some((center) => center._id === selectedId)
        );

        // Only update if the length differs to avoid infinite loops with the dependency array
        if (validSelectedCenters.length !== formData.selectedCenters.length) {
          setFormData((prev) => ({
            ...prev,
            selectedCenters: validSelectedCenters,
          }));
        }
      }
    }
  }, [
    centers,
    formData.modes.online,
    formData.modes.offline,
    formData.selectedCenters,
  ]);

  useEffect(() => {
    // Show center dropdown if department or role is "centeradmin" or any mode is selected
    if (
      formData.department === "centeradmin" ||
      formData.role === "centeradmin" ||
      formData.modes.offline ||
      formData.modes.online
    ) {
      setShowCenterDropdown(true);

      // Auto-select online center logic can go here if needed
      // Example: if online mode, find online center and add to selection if not present
    } else {
      setShowCenterDropdown(false);
      // Clear center selection if not a center admin or no mode is selected
      setFormData((prev) => ({
        ...prev,
        selectedCenters: [],
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
    const { value } = e.target;
    // On autofill or multiple select, value is an array
    setFormData((prev) => ({
      ...prev,
      selectedCenters: typeof value === "string" ? value.split(",") : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Convert modes object to array for submission
      const modesArray = Object.entries(formData.modes)
        .filter(([_, isSelected]) => isSelected)
        .map(([modeName]) => modeName);

      // Map selected center IDs to full objects {centerId, centerName}
      const centersPayload = formData.selectedCenters.map((centerId) => {
        const centerObj = centers.find((c) => c._id === centerId);
        return {
          centerId: centerId,
          centerName: centerObj ? centerObj.centerName : "",
        };
      });

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
        dob: formData.dob,
        doj: formData.doj,
        bloodGroup: formData.bloodGroup,
        bankDetails: {
          accountNumber: formData.accountNumber,
          panCard: formData.panCard, // Assuming string/path
          idCard: formData.idCard, // Assuming string/path
          emergencyContact: formData.emergencyContact,
        },
      };

      // Only include center data if it's selected
      if (centersPayload.length > 0) {
        formDataToSubmit.centers = centersPayload;
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

  const bloodGroupOptions = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

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

              {/* DOB, DOJ, Blood Group */}
              <div className="flex gap-4 mb-4">
                <TextField
                  label="Date of Birth"
                  type="date"
                  variant="outlined"
                  className="flex-1"
                  value={formData.dob}
                  onChange={(e) => handleInputChange("dob", e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                />
                <TextField
                  label="Date of Joining"
                  type="date"
                  variant="outlined"
                  className="flex-1"
                  value={formData.doj}
                  onChange={(e) => handleInputChange("doj", e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                />
                <FormControl variant="outlined" className="flex-1">
                  <InputLabel id="blood-group-label">Blood Group</InputLabel>
                  <Select
                    labelId="blood-group-label"
                    value={formData.bloodGroup}
                    onChange={(e) =>
                      handleInputChange("bloodGroup", e.target.value)
                    }
                    label="Blood Group"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {bloodGroupOptions.map((bg) => (
                      <MenuItem key={bg} value={bg}>
                        {bg}
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

                    <FormControl
                      variant="outlined"
                      className="flex-1"
                      required={isCoach}
                    >
                      <InputLabel id="employment-type-label">
                        Employment Type
                      </InputLabel>
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
                        Select whether the coach is a full-time employee or
                        freelancer
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

              {/* Multi-Select Center dropdown */}
              {showCenterDropdown && (
                <div className="mb-4">
                  <FormControl variant="outlined" fullWidth required>
                    <InputLabel id="center-label">
                      Physical Center(s)
                    </InputLabel>
                    <Select
                      labelId="center-label"
                      id="center"
                      multiple
                      value={formData.selectedCenters}
                      onChange={handleCenterChange}
                      label="Physical Center(s)"
                      renderValue={(selected) => {
                        const selectedCenterNames = selected.map((id) => {
                          const center = centers.find((c) => c._id === id);
                          return center ? center.centerName : id;
                        });
                        return selectedCenterNames.join(", ");
                      }}
                    >
                      {filteredCenters.map((center) => (
                        <MenuItem key={center._id} value={center._id}>
                          <Checkbox
                            checked={
                              formData.selectedCenters.indexOf(center._id) > -1
                            }
                          />
                          {center.centerName} ({center.centerType})
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      You can select multiple centers
                    </FormHelperText>
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

              {/* Bank & Emergency Details */}
              <h3 className="text-[#642b8f] font-semibold text-lg pb-2 border-b-2 border-[#f8a213] mt-6">
                Personal & Bank Details
              </h3>
              <div className="flex gap-4 mb-4">
                <TextField
                  label="Bank Account Number"
                  variant="outlined"
                  fullWidth
                  value={formData.accountNumber}
                  onChange={(e) =>
                    handleInputChange("accountNumber", e.target.value)
                  }
                />
                <TextField
                  label="Emergency Contact"
                  variant="outlined"
                  fullWidth
                  value={formData.emergencyContact}
                  onChange={(e) =>
                    handleInputChange("emergencyContact", e.target.value)
                  }
                />
              </div>

              {/* File Uploads for Proofs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <Typography
                    variant="subtitle2"
                    sx={{ mb: 1, fontWeight: 500, color: "text.secondary" }}
                  >
                    PAN Card Proof
                  </Typography>
                  <MultipleFileUpload
                    fieldName="panCard"
                    name="panCard"
                    onFileUpload={(urls) => {
                      // Take the first URL since it's a single document proof usually
                      handleInputChange(
                        "panCard",
                        urls.length > 0 ? urls[0] : ""
                      );
                    }}
                    initialFiles={formData.panCard ? [formData.panCard] : []}
                  />
                  <FormHelperText>
                    Upload clear image of PAN Card
                  </FormHelperText>
                </div>

                <div>
                  <Typography
                    variant="subtitle2"
                    sx={{ mb: 1, fontWeight: 500, color: "text.secondary" }}
                  >
                    ID Card Proof
                  </Typography>
                  <MultipleFileUpload
                    fieldName="idCard"
                    name="idCard"
                    onFileUpload={(urls) => {
                      handleInputChange(
                        "idCard",
                        urls.length > 0 ? urls[0] : ""
                      );
                    }}
                    initialFiles={formData.idCard ? [formData.idCard] : []}
                  />
                  <FormHelperText>
                    Upload clear image of Aadhar/Voter ID/Passport
                  </FormHelperText>
                </div>
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
              disabled={
                !isAnyModeSelected ||
                (isCoach && (!formData.perHourRate || !formData.employmentType))
              }
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
                  selectedCenters: [],
                  password: "",
                  modes: { online: false, offline: false },
                  perHourRate: "",
                  employmentType: "",
                  dob: "",
                  doj: "",
                  bloodGroup: "",
                  accountNumber: "",
                  panCard: "",
                  idCard: "",
                  emergencyContact: "",
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
