import { useState, useEffect } from "react";
import {
  Button,
  MenuItem,
  TextField,
  Typography,
  Box,
  Paper,
  Grid,
  Divider,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  CircularProgress,
  Container,
  Alert,
} from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  createLeave,
  updateLeave,
  fetchLeaveById,
} from "../../../api/service/employee/EmployeeService";
import FileUpload from "../../../department-components/common-components/fileuploader/FileUploader";

const EmployeeLeaveForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const empId = localStorage.getItem("empId");
  const department = localStorage.getItem("department");
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError] = useState("");

  // Initialize form state with proper data types
  const [leaveData, setLeaveData] = useState({
    category: "leave", // 'leave' or 'permission'
    leaveType: "",
    leaveStartDate: "",
    leaveEndDate: "",
    notes: "",
    proof: "",
    startTime: "",
    endTime: "",
  });

  useEffect(() => {
    const getLeaveData = async () => {
      if (id) {
        try {
          setLoading(true);
          const response = await fetchLeaveById(id);
          if (response.status === 200) {
            const {
              leaveStartDate,
              leaveEndDate,
              leaveType,
              notes,
              proof,
              category,
              startTime,
              endTime,
            } = response.data.leavesData;

            // Format dates from ISO to YYYY-MM-DD for form inputs
            const formattedStartDate = leaveStartDate
              ? leaveStartDate.split("T")[0]
              : "";
            const formattedEndDate = leaveEndDate
              ? leaveEndDate.split("T")[0]
              : "";

            setLeaveData({
              category: category || "leave",
              leaveType: leaveType || "",
              leaveStartDate: formattedStartDate,
              leaveEndDate: formattedEndDate,
              notes: notes || "",
              proof: proof || "",
              startTime: startTime || "",
              endTime: endTime || "",
            });
          }
        } catch (error) {
          console.error("Error fetching leave data:", error);
          setError("Failed to load leave request data");
        } finally {
          setLoading(false);
          setInitialLoad(false);
        }
      } else {
        setInitialLoad(false);
      }
    };

    getLeaveData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLeaveData((prev) => ({ ...prev, [name]: value }));

    // Clear any previous errors
    setError("");
  };

  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;

    // Reset category-specific fields when switching
    setLeaveData((prev) => ({
      ...prev,
      category: newCategory,
      // Clear permission-specific fields when switching to leave
      ...(newCategory === "leave" ? { startTime: "", endTime: "" } : {}),
      // Clear leave-specific fields when switching to permission
      ...(newCategory === "permission" ? { leaveEndDate: "" } : {}),
    }));
  };

  const leaveTypes = [
    "Sick Leave",
    "Casual Leave",
    "Paid Leave",
    "Unpaid Leave",
  ];

  const permissionTypes = ["Late Arrival", "Early Departure", "Other"];

  const validateForm = () => {
    // Basic validation
    if (!leaveData.leaveType) {
      setError("Please select a type");
      return false;
    }

    if (!leaveData.leaveStartDate) {
      setError(
        leaveData.category === "leave"
          ? "Please select start date"
          : "Please select permission date"
      );
      return false;
    }

    if (leaveData.category === "leave" && !leaveData.leaveEndDate) {
      setError("Please select end date");
      return false;
    }

    if (leaveData.category === "permission") {
      if (!leaveData.startTime) {
        setError("Please select start time");
        return false;
      }
      if (!leaveData.endTime) {
        setError("Please select end time");
        return false;
      }
    }

    return true;
  };

  const prepareFormData = () => {
    // Create a copy of the form data
    const formData = { ...leaveData, empId };

    // Format dates for backend (ISO format)
    if (formData.leaveStartDate) {
      formData.leaveStartDate = new Date(formData.leaveStartDate).toISOString();
    }

    if (formData.category === "leave" && formData.leaveEndDate) {
      formData.leaveEndDate = new Date(formData.leaveEndDate).toISOString();
    } else if (formData.category === "permission") {
      // For permission, set end date same as start date
      formData.leaveEndDate = new Date(formData.leaveStartDate).toISOString();
    }

    return formData;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Prepare properly formatted data
      const leavePayload = prepareFormData();

      if (id) {
        const updateResponse = await updateLeave(leavePayload, id);
        if (updateResponse.success || updateResponse.status === 200) {
          navigate(`/${department}/department/leaves`);
        } else {
          setError("Failed to update request");
        }
      } else {
        const createResponse = await createLeave(leavePayload);
        if (createResponse.status === 201) {
          navigate(`/${department}/department/leaves`);
        } else {
          setError("Failed to create request");
        }
      }
    } catch (error) {
      console.error("Error processing leave/permission request:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoad) {
    return (
      <Box className="min-h-screen flex items-center justify-center">
        <CircularProgress
          size={60}
          thickness={4}
          style={{ color: "#642b8f" }}
        />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ borderRadius: 2, overflow: "hidden" }}>
        {/* Header Section */}
        <Box
          sx={{
            background: "linear-gradient(to right, #642b8f, #aa88be)",
            py: 3,
            px: 4,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography
              variant="h4"
              component="h1"
              fontWeight="bold"
              color="white"
            >
              {id ? "Edit Request" : "Employee Leave/Permission Form"}
            </Typography>
            <Typography
              variant="body2"
              color="white"
              sx={{ opacity: 0.9, mt: 0.5 }}
            >
              {id
                ? "Update your request details"
                : "Please fill in the details for your leave or permission request"}
            </Typography>
          </Box>
          <Button
            variant="contained"
            sx={{
              bgcolor: "white",
              color: "#642b8f",
              fontWeight: "medium",
              "&:hover": { bgcolor: "#f5f5f5" },
            }}
            component={Link}
            to={`/${department}/department/leaves`}
          >
            View Requests
          </Button>
        </Box>

        {/* Form Section */}
        <Box component="form" onSubmit={handleSubmit} sx={{ p: 4 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl component="fieldset">
                <FormLabel component="legend" sx={{ mb: 1 }}>
                  Request Category
                </FormLabel>
                <RadioGroup
                  row
                  name="category"
                  value={leaveData.category}
                  onChange={handleCategoryChange}
                >
                  <FormControlLabel
                    value="leave"
                    control={
                      <Radio
                        sx={{
                          color: "#642b8f",
                          "&.Mui-checked": { color: "#642b8f" },
                        }}
                      />
                    }
                    label="Leave"
                  />
                  <FormControlLabel
                    value="permission"
                    control={
                      <Radio
                        sx={{
                          color: "#642b8f",
                          "&.Mui-checked": { color: "#642b8f" },
                        }}
                      />
                    }
                    label="Permission"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>

            {/* Request Details Section */}
            <Grid item xs={12}>
              <Typography
                variant="h6"
                color="primary"
                sx={{ mt: 2, mb: 2, fontWeight: "medium" }}
              >
                Request Details
              </Typography>
              <Divider sx={{ mb: 3 }} />
            </Grid>

            {/* Leave or Permission Type */}
            <Grid item xs={12} md={6}>
              <TextField
                select
                label={
                  leaveData.category === "leave"
                    ? "Leave Type"
                    : "Permission Type"
                }
                name="leaveType"
                value={leaveData.leaveType}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
                error={error.includes("type")}
              >
                {(leaveData.category === "leave"
                  ? leaveTypes
                  : permissionTypes
                ).map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Date Fields */}
            {leaveData.category === "leave" ? (
              <>
                <Grid item xs={12} md={6}>
                  <TextField
                    type="date"
                    name="leaveStartDate"
                    label="Leave Start Date"
                    value={leaveData.leaveStartDate}
                    onChange={handleChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    required
                    variant="outlined"
                    error={error.includes("start date")}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    type="date"
                    label="Leave End Date"
                    name="leaveEndDate"
                    value={leaveData.leaveEndDate}
                    onChange={handleChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    required
                    variant="outlined"
                    error={error.includes("end date")}
                    inputProps={{
                      min: leaveData.leaveStartDate, // Prevent end date before start date
                    }}
                  />
                </Grid>
              </>
            ) : (
              <>
                <Grid item xs={12} md={6}>
                  <TextField
                    type="date"
                    name="leaveStartDate"
                    label="Permission Date"
                    value={leaveData.leaveStartDate}
                    onChange={handleChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    required
                    variant="outlined"
                    error={error.includes("permission date")}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <TextField
                      type="time"
                      name="startTime"
                      label="Start Time"
                      value={leaveData.startTime}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: true }}
                      sx={{ flex: 1 }}
                      required
                      variant="outlined"
                      error={error.includes("start time")}
                    />
                    <Box sx={{ mx: 2, pt: 2 }}>to</Box>
                    <TextField
                      type="time"
                      name="endTime"
                      label="End Time"
                      value={leaveData.endTime}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: true }}
                      sx={{ flex: 1 }}
                      required
                      variant="outlined"
                      error={error.includes("end time")}
                    />
                  </Box>
                </Grid>
              </>
            )}

            {/* Additional Information Section */}
            <Grid item xs={12}>
              <Typography
                variant="h6"
                color="primary"
                sx={{ mt: 2, mb: 2, fontWeight: "medium" }}
              >
                Additional Information
              </Typography>
              <Divider sx={{ mb: 3 }} />
            </Grid>

            {/* Notes/Remarks */}
            <Grid item xs={12}>
              <TextField
                label="Notes / Remarks"
                name="notes"
                value={leaveData.notes}
                onChange={handleChange}
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                placeholder="Enter any additional information or reason for your request..."
              />
            </Grid>

            {/* File Upload */}
            <Grid item xs={12}>
              <Box sx={{ mt: 1 }}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Supporting Documents
                </Typography>
                <FileUpload
                  fieldName="Proof / Attachment"
                  name="proof"
                  onFileUpload={(url) => {
                    setLeaveData((prev) => ({ ...prev, proof: url }));
                  }}
                  fullWidth
                  existingFile={leaveData.proof}
                />
              </Box>
            </Grid>
          </Grid>

          {/* Action Buttons */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 3,
              mt: 5,
              mb: 2,
            }}
          >
            <Button
              type="submit"
              disabled={loading}
              variant="contained"
              sx={{
                bgcolor: "#642b8f",
                px: 4,
                py: 1.5,
                fontWeight: "medium",
                "&:hover": { bgcolor: "#51247a" },
                borderRadius: 2,
              }}
            >
              {loading
                ? "Processing..."
                : id
                ? "Update Request"
                : "Submit Request"}
            </Button>

            <Button
              type="button"
              onClick={() => navigate(`/${department}/department/leaves`)}
              variant="outlined"
              sx={{
                color: "#642b8f",
                borderColor: "#642b8f",
                px: 4,
                py: 1.5,
                fontWeight: "medium",
                "&:hover": { bgcolor: "#f9f5fc", borderColor: "#51247a" },
                borderRadius: 2,
              }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default EmployeeLeaveForm;
