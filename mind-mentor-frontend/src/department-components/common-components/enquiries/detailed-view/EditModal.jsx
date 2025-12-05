import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  TextField,
  Box,
  Grid,
  Typography,
  Card,
  Button,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Plus, Trash2 } from "lucide-react";
import React from "react";
import PhoneInput from "react-phone-input-2";
import { Select } from "@mui/material";

const EditModal = ({
  formData,
  showEdit,
  onEditClose,
  handleInputChange,
  programsData,
  handleProgramChange,
  availablePrograms,
  handleSave,
  selectedCenter,
  handleCenterChange,
}) => {
  // Helper function to get combined name
  const getCombinedName = (firstName, lastName) => {
    if (!firstName && !lastName) return "";
    return `${firstName || ""} ${lastName || ""}`.trim();
  };

  // Helper function to get display value for combined name field
  const getParentDisplayName = () => {
    if (formData.parentName) return formData.parentName;
    return getCombinedName(formData.parentFirstName, formData.parentLastName);
  };

  const getKidDisplayName = () => {
    if (formData.kidName) return formData.kidName;
    return getCombinedName(formData.kidFirstName, formData.kidLastName);
  };

  // Enhanced input change handler for names
  const handleNameInputChange = (field, value) => {
    if (field === "parentName") {
      const names = value.trim().split(" ");
      const firstName = names[0] || "";
      const lastName = names.slice(1).join(" ");

      // Update both combined and separate fields
      handleInputChange("parentName", value);
      handleInputChange("parentFirstName", firstName);
      handleInputChange("parentLastName", lastName);
    } else if (field === "kidName") {
      const names = value.trim().split(" ");
      const firstName = names[0] || "";
      const lastName = names.slice(1).join(" ");

      // Update both combined and separate fields
      handleInputChange("kidName", value);
      handleInputChange("kidFirstName", firstName);
      handleInputChange("kidLastName", lastName);
    } else if (field === "parentFirstName" || field === "parentLastName") {
      handleInputChange(field, value);

      // Update combined name
      const firstName =
        field === "parentFirstName" ? value : formData.parentFirstName;
      const lastName =
        field === "parentLastName" ? value : formData.parentLastName;
      const combinedName = getCombinedName(firstName, lastName);
      handleInputChange("parentName", combinedName);
    } else if (field === "kidFirstName" || field === "kidLastName") {
      handleInputChange(field, value);

      // Update combined name
      const firstName =
        field === "kidFirstName" ? value : formData.kidFirstName;
      const lastName = field === "kidLastName" ? value : formData.kidLastName;
      const combinedName = getCombinedName(firstName, lastName);
      handleInputChange("kidName", combinedName);
    } else {
      handleInputChange(field, value);
    }
  };

  return (
    <>
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
              value={getParentDisplayName()}
              onChange={(e) =>
                handleNameInputChange("parentName", e.target.value)
              }
              placeholder="Enter full name"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email"
              value={formData.email || ""}
              onChange={(e) => handleNameInputChange("email", e.target.value)}
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
                  handleNameInputChange("whatsappNumber", value)
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
                  handleNameInputChange("contactNumber", value)
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
        <Typography variant="subtitle1" sx={{ mb: 2, mt: 2, fontWeight: 600 }}>
          Kid Information
        </Typography>
        <Grid container spacing={2}>
          {/* Combined Kid Name Field */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Kid Name"
              value={getKidDisplayName()}
              onChange={(e) => handleNameInputChange("kidName", e.target.value)}
              placeholder="Enter full name"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Age"
              value={formData.kidsAge || ""}
              onChange={(e) => handleNameInputChange("kidsAge", e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="Gender"
              value={formData.kidsGender || ""}
              onChange={(e) =>
                handleNameInputChange("kidsGender", e.target.value)
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
              onChange={(e) => handleNameInputChange("pincode", e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="City"
              value={formData.city || ""}
              onChange={(e) => handleNameInputChange("city", e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="State"
              value={formData.state || ""}
              onChange={(e) => handleNameInputChange("state", e.target.value)}
            />
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Typography variant="subtitle1" sx={{ mb: 2, mt: 2, fontWeight: 600 }}>
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

      {/* PROGRAMS SECTION - FIXED */}
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
        <Typography variant="subtitle1" sx={{ mb: 2, mt: 2, fontWeight: 600 }}>
          Remarks & Notes
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Remarks"
              multiline
              rows={4}
              value={formData.message || formData.notes || ""}
              onChange={(e) => {
                handleNameInputChange("message", e.target.value);
              }}
            />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default EditModal;