import React, { useEffect, useState, useRef } from "react";
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
import { Trash2, Plus, X, List, GripHorizontal } from "lucide-react";
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

// ... (DetailCard and SectionTitle components remain the same)
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

  // --- DRAGGABLE DIALOG STATE ---
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 }); // Initial position calculated in useEffect
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const taskDialogRef = useRef(null);

  // Set initial position centered-ish
  useEffect(() => {
    if (isTaskDialogOpen) {
      const initialX = Math.max(0, window.innerWidth - 900); // 50px from right or fit
      const initialY = 100;
      setPosition({ x: initialX, y: initialY });
    }
  }, [isTaskDialogOpen]);

  const handleMouseDown = (e) => {
    // Only drag if clicking the header/handle
    if (e.target.closest('.drag-handle')) {
      setIsDragging(true);
      const rect = taskDialogRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      e.preventDefault(); // Prevent text selection
    }
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        let newX = e.clientX - dragOffset.x;
        let newY = e.clientY - dragOffset.y;

        // Simple bounds checking
        newX = Math.max(0, Math.min(newX, window.innerWidth - 100));
        newY = Math.max(0, Math.min(newY, window.innerHeight - 100));

        setPosition({ x: newX, y: newY });
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
        if (response.status === 200) {
          setProgramsData(response.data.programs);
        }
      } catch (error) {
        console.error("Error fetching programs data:", error);
      }
    };
    fetchData();
  }, []);

  // Update formData when data prop changes
  useEffect(() => {
    const normalizedData = {
      ...data,
      programs: data.programs || data.program || [],
    };
    setFormData(normalizedData);
  }, [data]);

  // Initialize program options
  useEffect(() => {
    if (programsData.length > 0) {
      const allPrograms = programsData
        .flatMap((center) => center.programLevels || [])
        .filter(
          (prog, index, arr) =>
            arr.findIndex((p) => p.program === prog.program) === index
        );

      setAvailablePrograms(allPrograms);

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
    if (value.length === 6) {
      fetchPincodeDetails(value);
    }
  };

  // Handle center selection
  const handleCenterChange = (centerId) => {
    setSelectedCenter(centerId);
    const selectedCenterData = programsData.find(
      (center) => center._id === centerId
    );

    if (selectedCenterData) {
      setAvailablePrograms(selectedCenterData.programLevels || []);
      setAvailableLevels([]);

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

  // Updated handleProgramChange
  const handleProgramChange = (programName, programIndex) => {
    let selectedProgramData = availablePrograms.find(
      (prog) => prog.program === programName
    );

    if (!selectedProgramData) {
      for (const center of programsData) {
        selectedProgramData = center.programLevels?.find(
          (p) => p.program === programName
        );
        if (selectedProgramData) break;
      }
    }

    if (selectedProgramData) {
      setAvailableLevels(selectedProgramData.levels || []);
    }

    const updatedPrograms = [...(formData.programs || [])];
    const existingLevel = updatedPrograms[programIndex]?.level;

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

  // Enhanced input change handler
  const handleInputChange = (field, value) => {
    if (field === "parentName") {
      const names = value.trim().split(" ");
      const firstName = names[0] || "";
      const lastName = names.slice(1).join(" ");
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
    const response = await updateEnquiry(formData, empId);
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
          {/* ... (Edit form content similar to before) ... */}
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Parent Information
              </Typography>
              <Grid container spacing={2}>
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
                    InputProps={{
                      endAdornment: isFetchingPincode && (
                        <Typography variant="caption" color="textSecondary">
                          ...
                        </Typography>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="City"
                    value={formData.city || ""}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="State"
                    value={formData.state || ""}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Typography
                variant="subtitle1"
                sx={{ mb: 2, mt: 2, fontWeight: 600 }}
              >
                Program Selection
              </Typography>

              {/* Center Selection - Optional based on design */}
              <Box sx={{ mb: 2 }}>
                <FormControl fullWidth>
                  <InputLabel>Filter by Center (Optional)</InputLabel>
                  <Select
                    value={selectedCenter}
                    onChange={(e) => handleCenterChange(e.target.value)}
                    label="Filter by Center (Optional)"
                  >
                    <MenuItem value="">All Centers</MenuItem>
                    {programsData.map((center) => (
                      <MenuItem key={center._id} value={center._id}>{center.centerName}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {(formData.programs || []).map((programItem, index) => (
                <Card
                  key={index}
                  variant="outlined"
                  sx={{ p: 2, mb: 2, bgcolor: "#f9f9f9" }}
                >
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={5}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Program</InputLabel>
                        <Select
                          value={programItem.program || ""}
                          onChange={(e) =>
                            handleProgramChange(e.target.value, index)
                          }
                          label="Program"
                        >
                          {availablePrograms.map((p, i) => (
                            <MenuItem key={i} value={p.program}>
                              {p.program}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={5}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Level</InputLabel>
                        <Select
                          value={programItem.level || ""}
                          onChange={(e) => {
                            const updatedPrograms = [...formData.programs];
                            updatedPrograms[index].level = e.target.value;
                            handleInputChange("programs", updatedPrograms);
                          }}
                          label="Level"
                        >
                          {availableLevels.map((lvl, i) => (
                            <MenuItem key={i} value={lvl}>{lvl}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={2} textAlign="right">
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
              ))}
              <Button
                startIcon={<Plus size={18} />}
                variant="outlined"
                onClick={() => {
                  handleInputChange("programs", [
                    ...(formData.programs || []),
                    { program: "", level: "" }
                  ])
                }}
              >
                Add Program
              </Button>
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

      {/* RESTORED CUSTOM DRAGGABLE TASK DIALOG */}
      {isTaskDialogOpen && (
        <Box
          ref={taskDialogRef}
          sx={{
            position: 'fixed',
            top: position.y,
            left: position.x,
            width: '850px',
            maxWidth: '95vw',
            height: '85vh',
            maxHeight: '800px',
            bgcolor: 'background.paper',
            borderRadius: 3,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            zIndex: 1300,
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid',
            borderColor: 'divider',
            transition: isDragging ? 'none' : 'box-shadow 0.3s ease',
          }}
        >
          {/* Draggable Header */}
          <Box
            className="drag-handle"
            onMouseDown={handleMouseDown}
            sx={{
              p: 2,
              borderBottom: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: isDragging ? 'grabbing' : 'grab',
              bgcolor: 'grey.50',
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              userSelect: 'none'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <GripHorizontal size={20} className="text-gray-400" />
              <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600 }}>
                Assign New Task
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                size="small"
                variant="outlined"
                color="primary"
                startIcon={<List size={14} />}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent drag start
                  navigate(`/${department}/department/list-task-assigned-me`);
                }}
                onMouseDown={(e) => e.stopPropagation()} // Prevent drag start
                sx={{ textTransform: 'none' }}
              >
                View All Tasks
              </Button>
              <IconButton
                size="small"
                onClick={() => setIsTaskDialogOpen(false)}
                onMouseDown={(e) => e.stopPropagation()} // Prevent drag start
              >
                <X size={20} />
              </IconButton>
            </Box>
          </Box>

          {/* Scrollable Content Area */}
          <Box sx={{
            flexGrow: 1,
            overflowY: 'auto',
            minHeight: 0, // Critical for flexbox scrolling
            p: 0
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