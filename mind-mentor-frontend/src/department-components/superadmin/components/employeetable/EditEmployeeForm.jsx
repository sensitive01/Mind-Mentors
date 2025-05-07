import {
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Checkbox,
  Typography,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  IconButton,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useState, useEffect } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getAllPhysicalcenters } from "../../../../api/service/employee/hrService";
import {
  fetchEditEmployeeData,
  updateEmployeeData,
} from "../../../../api/service/employee/EmployeeService";

const AddEmployeeForm = () => {
  const { empId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(empId ? true : false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

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
    status: "Active",
    modes: {
      online: false,
      offline: false,
    },
  });

  const [centers, setCenters] = useState([]);
  const [filteredCenters, setFilteredCenters] = useState([]);
  const [showCenterDropdown, setShowCenterDropdown] = useState(false);
  const [isEditMode, setIsEditMode] = useState(!!empId);

  // Fetch centers
  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const response = await getAllPhysicalcenters();
        if (response.status === 200) {
          setCenters(response.data.physicalCenter || []);
        }
      } catch (error) {
        console.error("Error fetching centers:", error);
        setSnackbar({
          open: true,
          message: "Failed to load centers",
          severity: "error",
        });
      }
    };
    fetchCenters();
  }, []);

  // Fetch employee data if in edit mode
  useEffect(() => {
    const fetchData = async () => {
      if (!empId) return;

      setDataLoading(true);
      try {
        const response = await fetchEditEmployeeData(empId);
        const employeeData = response.data.data;
        console.log("employeeData", employeeData);

        if (employeeData) {
          // Process modes - convert from array or string to object structure
          let modesObj = { online: false, offline: false };

          if (
            Array.isArray(employeeData.modes) &&
            employeeData.modes.length > 0
          ) {
            // If modes is an array
            employeeData.modes.forEach((mode) => {
              if (mode === "online" || mode === "offline") {
                modesObj[mode] = true;
              }
            });
          } else if (employeeData.mode) {
            // If mode is a string
            modesObj[employeeData.mode] = true;
          }

          setFormData({
            firstName: employeeData.firstName || "",
            email: employeeData.email || "",
            phoneNumber: employeeData.phoneNumber || "",
            address: employeeData.address || "",
            gender: employeeData.gender || "",
            department: employeeData.department || "",
            role: employeeData.role || "",
            centerId: employeeData.centerId || "",
            centerName: employeeData.centerName || "",
            status: employeeData.status || "Active",
            modes: modesObj,
          });

          // If the employee has a center or is offline, show the center dropdown
          if (
            employeeData.centerId ||
            employeeData.centerName ||
            (Array.isArray(employeeData.modes) &&
              employeeData.modes.includes("offline")) ||
            employeeData.mode === "offline" ||
            modesObj.offline
          ) {
            setShowCenterDropdown(true);
          }
        }
      } catch (error) {
        console.error("Error fetching employee data:", error);
        setSnackbar({
          open: true,
          message: "Failed to load employee data",
          severity: "error",
        });
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, [empId]);

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

  // Update center dropdown visibility based on form changes
  useEffect(() => {
    if (
      formData.department === "centeradmin" ||
      formData.role === "centeradmin" ||
      formData.modes.offline ||
      formData.modes.online
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
  }, [
    formData.department,
    formData.role,
    formData.modes.offline,
    formData.modes.online,
  ]);

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
    setLoading(true);

    try {
      // Convert modes object to array for submission
      const modesArray = Object.entries(formData.modes)
        .filter(([_, isSelected]) => isSelected)
        .map(([modeName]) => modeName);

      // Prepare the data to be submitted
      const formDataToSubmit = {
        firstName: formData.firstName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        gender: formData.gender,
        department: formData.department,
        role: formData.role,
        status: formData.status,
        modes: modesArray,
      };

      // Only include center data if it's selected
      if (formData.centerId) {
        formDataToSubmit.centerId = formData.centerId;
        formDataToSubmit.centerName = formData.centerName;
      }

      let response;

      if (isEditMode) {
        // Update existing employee
        response = await updateEmployeeData(empId, formDataToSubmit);
        setSnackbar({
          open: true,
          message: "Employee updated successfully!",
          severity: "success",
        });
      }
      console.log("Response:", response.data);

      // Redirect after a short delay
      setTimeout(() => {
        navigate("/super-admin/department/employees");
      }, 1500);
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to submit data",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Department options
  const departmentOptions = [
    "super-admin", // Added based on sample data
    "operation",
    "service-delivery",
    "renewal",
    "marketing",
    "centeradmin",
    "coach",
  ];

  // Role options (same as departments for now as per requirements)
  const roleOptions = [
    "super-admin", // Added based on sample data
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

  const statusOptions = [
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
  ];

  // Determine if at least one mode is selected (for validation)
  const isAnyModeSelected = formData.modes.online || formData.modes.offline;

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // If loading employee data in edit mode
  if (dataLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
        flexDirection="column"
        gap={2}
      >
        <CircularProgress style={{ color: "#642b8f" }} />
        <Typography variant="h6" color="textSecondary">
          Loading employee data...
        </Typography>
      </Box>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-[#642b8f] to-[#aa88be] p-8 text-white flex justify-between items-center">
          <div className="flex items-center">
            <IconButton
              color="inherit"
              onClick={() => navigate(-1)}
              sx={{ mr: 2 }}
            >
              <ArrowBack />
            </IconButton>
            <div>
              <h2 className="text-3xl font-bold mb-2">
                {isEditMode ? "Edit Employee" : "New Employee"}
              </h2>
              <p className="text-sm opacity-90">
                Please fill in all the required employee information
              </p>
            </div>
          </div>
          <Button
            variant="contained"
            style={{ backgroundColor: "#fff", color: "#642b8f" }}
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

              {/* Conditional Center dropdown and Status in one row */}
              <div className="flex gap-4 mb-4">
                {showCenterDropdown && (
                  <FormControl
                    variant="outlined"
                    className="flex-1"
                    required={showCenterDropdown}
                  >
                    <InputLabel id="center-label">Physical Center</InputLabel>
                    <Select
                      labelId="center-label"
                      id="center"
                      value={formData.centerId || ""}
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
                )}

                {/* Status field commented out as in the original code */}
                {/* <FormControl
                  variant="outlined"
                  className={showCenterDropdown ? "w-1/3" : "flex-1"}
                  required
                >
                  <InputLabel id="status-label">Status</InputLabel>
                  <Select
                    labelId="status-label"
                    id="status"
                    value={formData.status}
                    onChange={(e) =>
                      handleInputChange("status", e.target.value)
                    }
                    label="Status"
                  >
                    {statusOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl> */}
              </div>

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
              disabled={!isAnyModeSelected || loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : isEditMode ? (
                "Update"
              ) : (
                "Submit"
              )}
            </Button>
            <Button
              type="button"
              variant="outlined"
              style={{
                borderColor: "#642b8f",
                color: "#642b8f",
                padding: "10px 32px",
              }}
              onClick={() => {
                if (isEditMode) {
                  // Go back to previous page if in edit mode
                  navigate(-1);
                } else {
                  // Reset form if in add mode
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
                    status: "Active",
                    modes: { online: false, offline: false },
                  });
                }
              }}
            >
              {isEditMode ? "Cancel" : "Reset Form"}
            </Button>
          </div>
        </form>
      </div>

      {/* Success/Error Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AddEmployeeForm;
