import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  IconButton,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Tooltip,
  Divider,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Trash2, Plus, X, List } from "lucide-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useNavigate } from "react-router-dom";
import {
  getAllProgrameDataEnquiry,
  updateEnquiry,
} from "../../../../api/service/employee/EmployeeService";
import {
  formatEmail,
  formatWhatsAppNumber,
} from "../../../../utils/formatContacts";
import EnqRelatedTask from "../../prospects/detailed-view/EnqRelatedTask";

const DetailCard = ({ title, value, isEmail = false, maxLength = 25 }) => {
  const shouldTruncate = value && value.length > maxLength && !isEmail;
  const displayValue = shouldTruncate ? `${value.substring(0, maxLength)}...` : value;

  const getTextStyles = () => {
    if (isEmail) {
      return {
        wordBreak: "break-all",
        overflowWrap: "break-word",
        whiteSpace: "pre-wrap",
        fontSize: "0.875rem",
        lineHeight: 1.4,
      };
    }
    return {
      lineHeight: 1.6,
      wordBreak: "break-word",
      overflowWrap: "break-word"
    };
  };

  return (
    <Box
      sx={{
        p: 2.5,
        borderRadius: 2,
        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04),
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 1,
        minHeight: "100px",
      }}
    >
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ fontWeight: 600, fontSize: "0.75rem", letterSpacing: "0.5px" }}
      >
        {title}
      </Typography>

      {shouldTruncate ? (
        <Tooltip title={value} arrow placement="top">
          <Typography
            variant="body1"
            color="text.primary"
            sx={{
              ...getTextStyles(),
              cursor: "pointer",
              "&:hover": {
                color: "primary.main"
              }
            }}
          >
            {displayValue}
          </Typography>
        </Tooltip>
      ) : (
        <Typography
          variant="body1"
          color="text.primary"
          sx={getTextStyles()}
        >
          {value || "N/A"}
        </Typography>
      )}
    </Box>
  );
};

const SectionTitle = ({ children }) => (
  <Typography
    variant="h6"
    sx={(theme) => ({
      mb: 3,
      color: theme.palette.primary.main,
      fontWeight: 600,
      fontSize: "1.125rem",
    })}
  >
    {children}
  </Typography>
);

const DetailView = ({ data, showEdit, onEditClose, onEditSave }) => {
  const navigate = useNavigate();
  const empId = localStorage.getItem("empId");
  const department = localStorage.getItem("department");

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [formData, setFormData] = useState(data);
  const [programsData, setProgramsData] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState("");
  const [availablePrograms, setAvailablePrograms] = useState([]);
  const [availableLevels, setAvailableLevels] = useState([]);
  const [isFetchingPincode, setIsFetchingPincode] = useState(false);

  // State for task assignment
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth - 450, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Drag handlers for the task dialog
  const handleMouseDown = (e) => {
    // Don't start dragging if clicking on buttons or interactive elements
    if (e.target.closest('button') || e.target.closest('input')) {
      return;
    }
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
    e.preventDefault();
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  // Helper functions for name handling
  const getCombinedName = (firstName, lastName) => {
    if (!firstName && !lastName) return "";
    return `${firstName || ""} ${lastName || ""}`.trim();
  };

  const getDisplayParentName = (data) => {
    if (data.parentName) return data.parentName;
    return getCombinedName(data.parentFirstName, data.parentLastName);
  };

  const getDisplayKidName = (data) => {
    if (data.kidName) return data.kidName;
    return getCombinedName(data.kidFirstName, data.kidLastName);
  };

  const getParentFormDisplayName = () => {
    if (formData.parentName) return formData.parentName;
    return getCombinedName(formData.parentFirstName, formData.parentLastName);
  };

  const getKidFormDisplayName = () => {
    if (formData.kidName) return formData.kidName;
    return getCombinedName(formData.kidFirstName, formData.kidLastName);
  };

  // Fetch all programs data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllProgrameDataEnquiry();
        console.log("Response", response);
        if (response.status === 200) {
          setProgramsData(response.data.programs);
        }
      } catch (error) {
        console.error("Error fetching programs data:", error);
      }
    };
    fetchData();
  }, []);

  // Update formData when data prop changes - NORMALIZE THE PROGRAMS FIELD
  useEffect(() => {
    // Normalize the programs field to always use 'programs' (plural)
    const normalizedData = {
      ...data,
      programs: data.programs || data.program || [],
    };
    setFormData(normalizedData);
  }, [data]);

  // Initialize program options when programsData is loaded - FIXED
  useEffect(() => {
    if (programsData.length > 0) {
      // Create a flattened list of all unique programs from all centers
      const allPrograms = programsData
        .flatMap((center) => center.programLevels || [])
        .filter(
          (prog, index, arr) =>
            arr.findIndex((p) => p.program === prog.program) === index
        );

      setAvailablePrograms(allPrograms);
      console.log("Available programs set:", allPrograms);

      // If there are existing programs in formData, find levels for the first one
      if (formData.programs && formData.programs.length > 0) {
        const firstProgram = formData.programs[0];
        const programData = allPrograms.find(
          (p) => p.program === firstProgram.program
        );
        if (programData) {
          setAvailableLevels(programData.levels || []);
        }
      }
    }
  }, [programsData, formData.programs]);

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
          setFormData((prev) => ({
            ...prev,
            city: postOffice.District || prev.city,
            state: postOffice.State || prev.state,
          }));
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
      // Reset levels when center changes
      setAvailableLevels([]);

      // Update programs in formData to match the new center's programs
      const updatedPrograms =
        formData.programs?.map((program) => {
          const matchingProgram = selectedCenterData.programLevels.find(
            (p) => p.program === program.program
          );

          return {
            ...program,
            level: matchingProgram?.levels?.includes(program.level)
              ? program.level
              : matchingProgram?.levels?.[0] || "",
          };
        }) || [];

      handleInputChange("programs", updatedPrograms);
    } else {
      // If no center selected, show all programs
      const allPrograms = programsData
        .flatMap((center) => center.programLevels || [])
        .filter(
          (prog, index, arr) =>
            arr.findIndex((p) => p.program === prog.program) === index
        );
      setAvailablePrograms(allPrograms);
      setAvailableLevels([]);
    }
  };

  // Updated handleProgramChange function
  const handleProgramChange = (programName, programIndex) => {
    // Find the program data from availablePrograms
    let selectedProgramData = availablePrograms.find(
      (prog) => prog.program === programName
    );

    // If not found in availablePrograms, search across all centers
    if (!selectedProgramData) {
      for (const center of programsData) {
        selectedProgramData = center.programLevels?.find(
          (p) => p.program === programName
        );
        if (selectedProgramData) break;
      }
    }

    // Update available levels for this program
    if (selectedProgramData) {
      setAvailableLevels(selectedProgramData.levels || []);
    }

    // Update the program in formData
    const updatedPrograms = [...(formData.programs || [])];
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

  const handleCloseEdit = () => {
    setIsEditOpen(false);
  };

  // Enhanced input change handler for names
  const handleInputChange = (field, value) => {
    if (field === "parentName") {
      const names = value.trim().split(" ");
      const firstName = names[0] || "";
      const lastName = names.slice(1).join(" ");

      // Update both combined and separate fields
      setFormData((prev) => ({
        ...prev,
        parentName: value,
        parentFirstName: firstName,
        parentLastName: lastName,
      }));
    } else if (field === "kidName") {
      const names = value.trim().split(" ");
      const firstName = names[0] || "";
      const lastName = names.slice(1).join(" ");

      // Update both combined and separate fields
      setFormData((prev) => ({
        ...prev,
        kidName: value,
        kidFirstName: firstName,
        kidLastName: lastName,
      }));
    } else if (field === "parentFirstName" || field === "parentLastName") {
      setFormData((prev) => {
        const newFirstName =
          field === "parentFirstName" ? value : prev.parentFirstName;
        const newLastName =
          field === "parentLastName" ? value : prev.parentLastName;
        const combinedName = getCombinedName(newFirstName, newLastName);

        return {
          ...prev,
          [field]: value,
          parentName: combinedName,
        };
      });
    } else if (field === "kidFirstName" || field === "kidLastName") {
      setFormData((prev) => {
        const newFirstName =
          field === "kidFirstName" ? value : prev.kidFirstName;
        const newLastName = field === "kidLastName" ? value : prev.kidLastName;
        const combinedName = getCombinedName(newFirstName, newLastName);

        return {
          ...prev,
          [field]: value,
          kidName: combinedName,
        };
      });
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSave = async () => {
    console.log("Updated data:", formData);
    const response = await updateEnquiry(formData, empId);
    console.log("Response0", response);
    if (response.status === 200) {
      onEditSave(response.data);
    }
    onEditClose();
  };

  if (!data) return null;

  return (
    <Box sx={{ position: "relative", height: "100%" }}>
      {/* Main Content */}
      <Box sx={{ height: "100%", overflowY: "auto", p: 3 }}>
        <Grid container spacing={4}>
          {/* Parent Information */}
          <Grid item xs={12}>
            <SectionTitle>Parent Information</SectionTitle>
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <DetailCard
                  title="PARENT NAME"
                  value={getDisplayParentName(data)}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <DetailCard
                  title="EMAIL"
                  value={formatEmail(data.email)}
                  isEmail={true}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <DetailCard
                  title="WHATSAPP NUMBER"
                  value={formatWhatsAppNumber(data.whatsappNumber)}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <DetailCard
                  title="CONTACT NUMBER"
                  value={formatWhatsAppNumber(data.contactNumber)}
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Kid Information */}
          <Grid item xs={12}>
            <SectionTitle>Kid Information</SectionTitle>
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <DetailCard title="KID NAME" value={getDisplayKidName(data)} />
              </Grid>
              <Grid item xs={12} md={3}>
                <DetailCard title="AGE" value={data.kidsAge} />
              </Grid>
              <Grid item xs={12} md={3}>
                <DetailCard title="GENDER" value={data.kidsGender} />
              </Grid>
              <Grid item xs={12} md={3}>
                <DetailCard title="KID PINCODE" value={data.pincode} />
              </Grid>
              <Grid item xs={12} md={3}>
                <DetailCard title="KID CITY" value={data.city} />
              </Grid>
              <Grid item xs={12} md={3}>
                <DetailCard title="KID STATE" value={data.state} />
              </Grid>
            </Grid>
          </Grid>

          {/* Programs - FIXED */}
          <Grid item xs={12}>
            <SectionTitle>Program Details</SectionTitle>
            <Grid container spacing={3}>
              {(data.programs || data.program || []).length > 0 ? (
                (data.programs || data.program || []).map((program, index) => (
                  <Grid item xs={12} md={4} key={index}>
                    <DetailCard
                      title={`PROGRAM ${index + 1}`}
                      value={`${program.program} (${program.level})`}
                    />
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Box
                    sx={(theme) => ({
                      p: 3,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.primary.main, 0.04),
                      textAlign: "center",
                    })}
                  >
                    <Typography variant="body2" color="text.secondary">
                      No programs added yet
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Grid>

          {/* Messages and Notes */}
          <Grid item xs={12}>
            <SectionTitle>Remarks & Notes</SectionTitle>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Box
                  sx={(theme) => ({
                    p: 3,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.primary.main, 0.04),
                  })}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{ mb: 1, fontWeight: 600 }}
                  >
                    Remarks
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      wordBreak: "break-word",
                      overflowWrap: "break-word",
                      whiteSpace: "pre-wrap"
                    }}
                  >
                    {data.message || data.notes || "No messages"}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box
                  sx={(theme) => ({
                    p: 3,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.primary.main, 0.04),
                  })}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{ mb: 1, fontWeight: 600 }}
                  >
                    Notes
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      wordBreak: "break-word",
                      overflowWrap: "break-word",
                      whiteSpace: "pre-wrap"
                    }}
                  >
                    {data.notes || data.message || "No notes"}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box
                  sx={(theme) => ({
                    p: 3,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.primary.main, 0.04),
                  })}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{ mb: 1, fontWeight: 600 }}
                  >
                    Status Log
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      wordBreak: "break-word",
                      overflowWrap: "break-word",
                      whiteSpace: "pre-wrap"
                    }}
                  >
                    {data.lastNoteAction || "No status updates"}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* Assign Task Button */}
        <Box sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1000 }}>
          <button
            onClick={() => setIsTaskDialogOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg shadow-lg hover:bg-primary-dark transition-colors"
          >
            <List size={18} />
            Assign Tasks
          </button>
        </Box>
      </Box>

      {/* Edit Dialog */}
      <Dialog
        open={showEdit}
        onClose={onEditClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            maxHeight: "90vh",
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle
          sx={{
            borderBottom: "1px solid",
            background: "linear-gradient(#642b8f, #aa88be)",
            color: "#ffffff",
            fontWeight: 600,
            px: 3,
            py: 2,
          }}
        >
          Edit Details
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Parent Information
              </Typography>
              <Grid container spacing={2}>
                {/* Combined Parent Name Field */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Parent Name"
                    value={getParentFormDisplayName()}
                    onChange={(e) =>
                      handleInputChange("parentName", e.target.value)
                    }
                    placeholder="Enter full name"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={formData.email || ""}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                      WhatsApp Number
                    </Typography>
                    <PhoneInput
                      country={"in"}
                      value={formData.whatsappNumber || ""}
                      onChange={(value) =>
                        handleInputChange("whatsappNumber", value)
                      }
                      inputStyle={{
                        width: "100%",
                        height: "56px",
                        fontSize: "16px",
                        border: "1px solid #c4c4c4",
                        borderRadius: "4px",
                      }}
                      containerStyle={{
                        width: "100%",
                      }}
                      buttonStyle={{
                        border: "1px solid #c4c4c4",
                        borderRadius: "4px 0 0 4px",
                      }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                      Contact Number
                    </Typography>
                    <PhoneInput
                      country={"in"}
                      value={formData.contactNumber || ""}
                      onChange={(value) =>
                        handleInputChange("contactNumber", value)
                      }
                      inputStyle={{
                        width: "100%",
                        height: "56px",
                        fontSize: "16px",
                        border: "1px solid #c4c4c4",
                        borderRadius: "4px",
                      }}
                      containerStyle={{
                        width: "100%",
                      }}
                      buttonStyle={{
                        border: "1px solid #c4c4c4",
                        borderRadius: "4px 0 0 4px",
                      }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Typography
                variant="subtitle1"
                sx={{ mb: 2, mt: 2, fontWeight: 600 }}
              >
                Kid Information
              </Typography>
              <Grid container spacing={2}>
                {/* Combined Kid Name Field */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Kid Name"
                    value={getKidFormDisplayName()}
                    onChange={(e) =>
                      handleInputChange("kidName", e.target.value)
                    }
                    placeholder="Enter full name"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Age"
                    value={formData.kidsAge || ""}
                    onChange={(e) =>
                      handleInputChange("kidsAge", e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    fullWidth
                    label="Gender"
                    value={formData.kidsGender || ""}
                    onChange={(e) =>
                      handleInputChange("kidsGender", e.target.value)
                    }
                  >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Pincode"
                    value={formData.pincode || ""}
                    onChange={handlePincodeChange}
                    disabled={isFetchingPincode}
                    helperText={isFetchingPincode ? "Fetching location..." : ""}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="City"
                    value={formData.city || ""}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="State"
                    value={formData.state || ""}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Typography
                variant="subtitle1"
                sx={{ mb: 2, mt: 2, fontWeight: 600 }}
              >
                Center Selection (Optional)
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel
                      id="center-select-label"
                      sx={{ backgroundColor: "white", px: 0.5 }}
                    >
                      Select Center
                    </InputLabel>
                    <Select
                      labelId="center-select-label"
                      value={selectedCenter}
                      onChange={(e) => handleCenterChange(e.target.value)}
                      label="Select Center"
                    >
                      <MenuItem value="">
                        <em>All Centers</em>
                      </MenuItem>
                      {programsData.map((center) => (
                        <MenuItem key={center._id} value={center._id}>
                          {center.centerName} ({center.centerType})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>

            {/* PROGRAMS SECTION - COMPLETELY FIXED */}
            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                  mt: 2,
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Programs
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Plus size={16} />}
                  onClick={() => {
                    const updatedPrograms = [
                      ...(formData.programs || []),
                      { program: "", level: "" },
                    ];
                    handleInputChange("programs", updatedPrograms);
                  }}
                >
                  Add Program
                </Button>
              </Box>

              {/* Show message if no programs data loaded */}
              {programsData.length === 0 && (
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04),
                    textAlign: "center",
                    mb: 2,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Loading programs...
                  </Typography>
                </Box>
              )}

              {/* Show existing programs or empty state */}
              {formData.programs && formData.programs.length > 0 ? (
                formData.programs.map((program, index) => {
                  // Find current program data to get available levels
                  let currentProgramData = availablePrograms.find(
                    (p) => p.program === program.program
                  );

                  // If not found in availablePrograms, search all centers
                  if (!currentProgramData && programsData.length > 0) {
                    for (const center of programsData) {
                      currentProgramData = center.programLevels?.find(
                        (p) => p.program === program.program
                      );
                      if (currentProgramData) break;
                    }
                  }

                  const levelsForCurrentProgram = currentProgramData?.levels || [];

                  return (
                    <Card key={index} sx={{ mb: 2, p: 2 }}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={4}>
                          <FormControl fullWidth>
                            <InputLabel
                              id={`program-select-label-${index}`}
                              sx={{ backgroundColor: "white", px: 0.5 }}
                            >
                              Program Name
                            </InputLabel>
                            <Select
                              labelId={`program-select-label-${index}`}
                              value={program.program || ""}
                              onChange={(e) =>
                                handleProgramChange(e.target.value, index)
                              }
                              label="Program Name"
                              disabled={availablePrograms.length === 0}
                            >
                              {availablePrograms.length > 0 ? (
                                availablePrograms.map((prog, progIndex) => (
                                  <MenuItem key={progIndex} value={prog.program}>
                                    {prog.program}
                                  </MenuItem>
                                ))
                              ) : (
                                <MenuItem value="">No programs available</MenuItem>
                              )}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <FormControl fullWidth>
                            <InputLabel
                              id={`level-select-label-${index}`}
                              sx={{ backgroundColor: "white", px: 0.5 }}
                            >
                              Level
                            </InputLabel>
                            <Select
                              labelId={`level-select-label-${index}`}
                              value={program.level || ""}
                              onChange={(e) => {
                                const updatedPrograms = [...formData.programs];
                                updatedPrograms[index].level = e.target.value;
                                handleInputChange("programs", updatedPrograms);
                              }}
                              label="Level"
                              disabled={!program.program || levelsForCurrentProgram.length === 0}
                            >
                              {levelsForCurrentProgram.length > 0 ? (
                                levelsForCurrentProgram.map((level, levelIndex) => (
                                  <MenuItem key={levelIndex} value={level}>
                                    {level}
                                  </MenuItem>
                                ))
                              ) : (
                                <MenuItem value="">No levels available</MenuItem>
                              )}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} md={2}>
                          <IconButton
                            color="error"
                            onClick={() => {
                              const updatedPrograms = formData.programs.filter(
                                (_, i) => i !== index
                              );
                              handleInputChange("programs", updatedPrograms);
                            }}
                          >
                            <Trash2 size={20} />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </Card>
                  );
                })
              ) : (
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04),
                    textAlign: "center",
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    No programs added yet. Click "Add Program" to get started.
                  </Typography>
                </Box>
              )}
            </Grid>

            <Grid item xs={12}>
              <Typography
                variant="subtitle1"
                sx={{ mb: 2, mt: 2, fontWeight: 600 }}
              >
                Remarks & Notes
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Remarks"
                    multiline
                    rows={4}
                    value={formData.message || ""}
                    onChange={(e) =>
                      handleInputChange("message", e.target.value)
                    }
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions
          sx={{
            borderTop: "1px solid",
            borderColor: "divider",
            px: 3,
            py: 2,
          }}
        >
          <Button onClick={onEditClose} variant="outlined" sx={{ mr: 1 }}>
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Draggable Task Dialog */}
      {isTaskDialogOpen && (
        <Box
          className="draggable-dialog"
          sx={{
            position: 'fixed',
            top: position.y,
            left: position.x,
            width: '850px',
            maxWidth: '90vw',
            height: '85vh',
            maxHeight: '850px',
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
            zIndex: 1400,
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid #e0e0e0',
            overflow: 'hidden',
          }}
        >
          {/* Drag handle with buttons */}
          <Box
            className="drag-handle"
            onMouseDown={handleMouseDown}
            sx={{
              padding: '14px 20px',
              cursor: 'move',
              backgroundColor: '#f8f9fa',
              borderBottom: '2px solid #e0e0e0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              userSelect: 'none',
              '&:active': {
                cursor: 'grabbing'
              }
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#2c3e50', fontSize: '1.1rem' }}>
              Assign New Task
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/${department}/department/list-task-assigned-me`);
                }}
                onMouseDown={(e) => e.stopPropagation()}
                className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium shadow-sm"
                style={{ cursor: 'pointer' }}
              >
                <List size={16} />
                View All Tasks
              </button>

              <IconButton
                onClick={() => setIsTaskDialogOpen(false)}
                onMouseDown={(e) => e.stopPropagation()}
                size="small"
                sx={{
                  color: '#6c757d',
                  '&:hover': {
                    backgroundColor: 'rgba(231, 76, 60, 0.1)',
                    color: '#e74c3c'
                  }
                }}
              >
                <X size={20} />
              </IconButton>
            </Box>
          </Box>

          <Divider sx={{ m: 0 }} />

          <Box sx={{
            p: 3,
            flex: 1,
            overflow: 'auto',
            backgroundColor: '#fafbfc',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#f1f1f1',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#c1c1c1',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: '#a8a8a8',
            }
          }}>
            <EnqRelatedTask
              id={data?._id}
              onClose={() => setIsTaskDialogOpen(false)}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default DetailView;