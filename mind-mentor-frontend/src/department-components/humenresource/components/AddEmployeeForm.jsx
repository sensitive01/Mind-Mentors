import {
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
} from "@mui/material";
import axios from "axios";
import { useState, useEffect } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Link } from "react-router-dom";
import {
  addNewEmployee,
  getAllPhysicalcenters,
} from "../../../api/service/employee/hrService";

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
    mode: "", // New state for mode
  });

  const [centers, setCenters] = useState([]);
  const [showCenterDropdown, setShowCenterDropdown] = useState(false);

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

  useEffect(() => {
    // Show center dropdown if department or role is "centeradmin" or mode is "offline"
    if (
      formData.department === "centeradmin" ||
      formData.role === "centeradmin" ||
      formData.mode === "offline"
    ) {
      setShowCenterDropdown(true);
    } else {
      setShowCenterDropdown(false);
      // Clear center selection if not a center admin or offline mode
      setFormData((prev) => ({
        ...prev,
        centerId: "",
        centerName: "",
      }));
    }
  }, [formData.department, formData.role, formData.mode]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
      // Prepare the data to be submitted - only the fields we're keeping
      const formDataToSubmit = {
        firstName: formData.firstName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        gender: formData.gender,
        department: formData.department,
        role: formData.role,
        mode: formData.mode, // Include mode in the submission
      };

      // Only include center data if it's selected
      if (formData.centerId) {
        formDataToSubmit.centerId = formData.centerId;
        formDataToSubmit.centerName = formData.centerName;
      }

      let response;

      response = await addNewEmployee(formDataToSubmit);
      console.log("User  updated:", response.data);
      alert("User  updated successfully!");
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
            to="/users"
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

              {/* Department, Mode, and Role in one row */}
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

                {/* Mode Dropdown */}
                <FormControl variant="outlined" className="flex-1" required>
                  <InputLabel id="mode-label">Mode</InputLabel>
                  <Select
                    labelId="mode-label"
                    id="mode"
                    value={formData.mode}
                    onChange={(e) => handleInputChange("mode", e.target.value)}
                    label="Mode"
                  >
                    <MenuItem value="" disabled>
                      <em>Select Mode</em>
                    </MenuItem>
                    <MenuItem value="online">Online</MenuItem>
                    <MenuItem value="offline">Offline</MenuItem>
                  </Select>
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

              {/* Conditional Center dropdown */}
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
                      {centers.map((center) => (
                        <MenuItem key={center._id} value={center._id}>
                          {center.centerName}
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
                  mode: "", // Reset mode
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