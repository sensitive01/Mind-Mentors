import { TextFields } from "@mui/icons-material";
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
} from "@mui/material";
import { Button, Card, Select, Typography } from "antd";
import { Box, Grid, Plus, Trash2 } from "lucide-react";
import React, { useEffect } from "react";
import PhoneInput from "react-phone-input-2";

const EditModal = ({
  formData,
  showEdit,
  onEditClose,
  handleInputChange,
  programsData,
  handleProgramChange,
  availablePrograms,
  availableLevels,
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

          {/* Separate Parent Name Fields */}
          {/* <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="First Name"
              value={formData.parentFirstName || ""}
              onChange={(e) =>
                handleNameInputChange("parentFirstName", e.target.value)
              }
              placeholder="First name"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Last Name"
              value={formData.parentLastName || ""}
              onChange={(e) =>
                handleNameInputChange("parentLastName", e.target.value)
              }
              placeholder="Last name"
            />
          </Grid> */}

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

          {/* Separate Kid Name Fields */}
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="First Name"
              value={formData.kidFirstName || ""}
              onChange={(e) =>
                handleNameInputChange("kidFirstName", e.target.value)
              }
              placeholder="First name"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Last Name"
              value={formData.kidLastName || ""}
              onChange={(e) =>
                handleNameInputChange("kidLastName", e.target.value)
              }
              placeholder="Last name"
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
                  <em>None</em>
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
              handleNameInputChange("programs", updatedPrograms);
            }}
          >
            Add Program
          </Button>
        </Box>

        {formData.programs?.map((program, index) => (
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
                    onChange={(e) => handleProgramChange(e.target.value, index)}
                    label="Program Name"
                  >
                    {availablePrograms.map((prog, progIndex) => (
                      <MenuItem key={progIndex} value={prog.program}>
                        {prog.program}
                      </MenuItem>
                    ))}
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
                      handleNameInputChange("programs", updatedPrograms);
                    }}
                    label="Level"
                    disabled={!program.program}
                  >
                    {availableLevels.map((level, levelIndex) => (
                      <MenuItem key={levelIndex} value={level}>
                        {level}
                      </MenuItem>
                    ))}
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
                    handleNameInputChange("programs", updatedPrograms);
                  }}
                >
                  <Trash2 size={20} />
                </IconButton>
              </Grid>
            </Grid>
          </Card>
        ))}
      </Grid>

      <Grid item xs={12}>
        <Typography variant="subtitle1" sx={{ mb: 2, mt: 2, fontWeight: 600 }}>
          Status Information
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel
                id="enquiry-field-label"
                sx={{ backgroundColor: "white", px: 0.5 }}
              >
                Enquiry Field
              </InputLabel>
              <Select
                labelId="enquiry-field-label"
                value={formData.enquiryField || ""}
                onChange={(e) =>
                  handleNameInputChange("enquiryField", e.target.value)
                }
                label="Enquiry Field"
              >
                <MenuItem value="enquiryList">Enquiry List</MenuItem>
                <MenuItem value="prospects">Prospects</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel
                id="payment"
                sx={{ backgroundColor: "white", px: 0.5 }}
              >
                Payment Status
              </InputLabel>
              <Select
                value={formData.payment || formData.paymentStatus || ""}
                onChange={(e) => {
                  handleNameInputChange("payment", e.target.value);
                  handleNameInputChange("paymentStatus", e.target.value);
                }}
                label="Payment"
                disabled
              >
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Paid">Mark as Paid</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel
                id="source"
                sx={{ backgroundColor: "white", px: 0.5 }}
              >
                Source
              </InputLabel>
              <Select
                value={formData.source || ""}
                onChange={(e) =>
                  handleNameInputChange("source", e.target.value)
                }
              >
                <MenuItem value="">-Select-</MenuItem>
                <MenuItem value="website">Website</MenuItem>
                <MenuItem value="web_form">Web Form</MenuItem>
                <MenuItem value="justdial">JustDial</MenuItem>
                <MenuItem value="whatsapp">WhatsApp</MenuItem>
                <MenuItem value="phone_call">Phone Call</MenuItem>
                <MenuItem value="centre_walkin">Centre Walk-in</MenuItem>
                <MenuItem value="referral">Referral</MenuItem>
                <MenuItem value="social">Social Media</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel
                id="disposition"
                sx={{ backgroundColor: "white", px: 0.5 }}
              >
                Disposition
              </InputLabel>
              <Select
                value={formData.disposition || ""}
                onChange={(e) =>
                  handleNameInputChange("disposition", e.target.value)
                }
              >
                <MenuItem value="RnR">RnR</MenuItem>
                <MenuItem value="Call Back">Call Back</MenuItem>
                <MenuItem value="None">None</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel
                id="demo-shedule"
                sx={{ backgroundColor: "white", px: 0.5 }}
              >
                Demo Schedule
              </InputLabel>
              <Select
                value={formData.scheduleDemo?.status || ""}
                onChange={(e) =>
                  handleNameInputChange("scheduleDemo", {
                    ...formData.scheduleDemo,
                    status: e.target.value,
                  })
                }
              >
                <MenuItem value="Scheduled">Scheduled</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel
                id="enrollment-status"
                sx={{ backgroundColor: "white", px: 0.5 }}
              >
                Enrollment Status
              </InputLabel>
              <Select
                value={formData.enquiryStatus || ""}
                onChange={(e) =>
                  handleNameInputChange("enquiryStatus", e.target.value)
                }
              >
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Qualified Lead">Qualified Lead</MenuItem>
                <MenuItem value="Unqualified Lead">Unqualified Lead</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel
                id="enquiry-type"
                sx={{ backgroundColor: "white", px: 0.5 }}
              >
                Enquiry Type
              </InputLabel>
              <Select
                value={formData.enquiryType || ""}
                onChange={(e) =>
                  handleNameInputChange("enquiryType", e.target.value)
                }
              >
                <MenuItem value="warm">Warm</MenuItem>
                <MenuItem value="cold">Cold</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
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
                handleNameInputChange("notes", e.target.value);
              }}
            />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default EditModal;
