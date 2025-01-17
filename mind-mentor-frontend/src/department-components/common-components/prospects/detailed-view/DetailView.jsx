/* eslint-disable react/prop-types */
import  { useState } from "react";
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
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Edit, Trash2, Plus } from "lucide-react";
import { updateEnquiry } from "../../../../api/service/employee/EmployeeService";
import { useNavigate } from "react-router-dom";

const DetailCard = ({ title, value }) => (
  <Box
    sx={{
      p: 2.5,
      borderRadius: 2,
      bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04),
      height: "100%",
      display: "flex",
      flexDirection: "column",
      gap: 1,
    }}
  >
    <Typography
      variant="caption"
      color="text.secondary"
      sx={{ fontWeight: 600, fontSize: "0.75rem", letterSpacing: "0.5px" }}
    >
      {title}
    </Typography>
    <Typography variant="body1" color="text.primary" sx={{ lineHeight: 1.6 }}>
      {value || "N/A"}
    </Typography>
  </Box>
);

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



const DetailView = ({ data }) => {
  const navigate= useNavigate()
  
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [formData, setFormData] = useState(data);
  
  const handleOpenEdit = () => {
    setFormData(data);
    setIsEditOpen(true);
  };
  
  const handleCloseEdit = () => {
    setIsEditOpen(false);
  };
  
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  
  const handleSave = async () => {
    console.log("Updated data:", formData);
    const response = await updateEnquiry(formData);
    console.log("Response0", response);
    if (response.status === 200) {
      setFormData(response.data);
    }
    handleCloseEdit();
  };
  
  if (!data) return null;
  return (
    <Box sx={{ position: "relative", p: 4 }}>
      {/* Header */}
      <Box
        sx={{
          position: "absolute",
          right: 32,
          top: 32,
          display: "flex",
          gap: 2,
        }}
      >
        <Button
          variant="outlined"
          startIcon={<Edit size={18} />}
          onClick={handleOpenEdit}
          sx={(theme) => ({
            borderColor: theme.palette.primary.main,
            color: theme.palette.primary.main,
            px: 3,
            py: 1,
            "&:hover": {
              borderColor: theme.palette.primary.dark,
              bgcolor: alpha(theme.palette.primary.main, 0.04),
            },
          })}
        >
          Edit
        </Button>
      </Box>

      {/* Content */}
      <Box sx={{ mt: 8 }}>
        <Grid container spacing={4}>
          {/* Parent Information */}
          <Grid item xs={12}>
            <SectionTitle>Parent Information</SectionTitle>
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <DetailCard title="PARENT NAME" value={data.parentName} />
              </Grid>
              <Grid item xs={12} md={3}>
                <DetailCard title="EMAIL" value={data.email} />
              </Grid>
              <Grid item xs={12} md={3}>
                <DetailCard
                  title="WHATSAPP NUMBER"
                  value={data.whatsappNumber}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <DetailCard title="ADDRESS" value={data.address} />
              </Grid>
            </Grid>
          </Grid>

          {/* Kid Information */}
          <Grid item xs={12}>
            <SectionTitle>Kid Information</SectionTitle>
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <DetailCard title="KID NAME" value={data.kidName} />
              </Grid>
              <Grid item xs={12} md={3}>
                <DetailCard title="AGE" value={data.kidsAge} />
              </Grid>
              <Grid item xs={12} md={3}>
                <DetailCard title="GENDER" value={data.kidsGender} />
              </Grid>
              <Grid item xs={12} md={3}>
                <DetailCard title="SCHOOL NAME" value={data.schoolName} />
              </Grid>
              <Grid item xs={12} md={3}>
                <DetailCard title="SCHOOL PINCODE" value={data.schoolPincode} />
              </Grid>
            </Grid>
          </Grid>

          {/* Programs */}
          <Grid item xs={12}>
            <SectionTitle>Program Details</SectionTitle>
            <Grid container spacing={3}>
              {data.programs?.map((program, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <DetailCard
                    title={`PROGRAM ${index + 1}`}
                    value={`${program.program} (${program.level})`}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Status Information */}
          <Grid item xs={12}>
            <SectionTitle>Status Information</SectionTitle>
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <DetailCard title="PAYMENT STATUS" value={data.payment} />
              </Grid>
              <Grid item xs={12} md={3}>
                <DetailCard title="SOURCE" value={data.source} />
              </Grid>
              <Grid item xs={12} md={3}>
                <DetailCard title="DISPOSITION" value={data.disposition} />
              </Grid>

              <Grid item xs={12} md={3}>
                <DetailCard
                  title="ENROLLMENT STATUS"
                  value={data.enquiryStatus}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <DetailCard title="ENQUIRY TYPE" value={data.enquiryType} />
              </Grid>
              <Grid item xs={12} md={3}>
                <DetailCard title="ENQUIRY FIELD" value={data.enquiryField} />
              </Grid>
              <Grid item xs={12} md={3}>
                <DetailCard
                  title="DEMO SCHEDULE"
                  value={data.scheduleDemo?.status}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <DetailCard
                  title="CLICK HERE TO SHEDULE DEMO CLASS"
                  value={
                    <div className="flex items-center gap-3 border-2 border-primary rounded-lg w-max h-10">
                    {data.enquiryField === "prospects" && data.scheduleDemo?.status === "Pending" && (
                      <Button
                        onClick={() => navigate(`/operation/department/schedule-demo-class-list-individually/${data._id}`)}
                        className="h-full px-6 bg-primary text-white border-2 border-primary  hover:bg-primary/90 hover:text-white hover:border-white transition-colors"
                      >
                        Schedule Demo
                      </Button>
                    )}
                  </div>
                  
                  }
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Messages and Notes */}
          <Grid item xs={12}>
            <SectionTitle>Messages & Notes</SectionTitle>
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
                    Messages
                  </Typography>
                  <Typography variant="body1">
                    {data.message || "No messages"}
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
                  <Typography variant="body1">
                    {data.notes || "No notes"}
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
                  <Typography variant="body1">
                    {data.lastNoteAction || "No status updates"}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>

      {/* Edit Dialog */}
      <Dialog
        open={isEditOpen}
        onClose={handleCloseEdit}
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
            {/* Parent Information */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Parent Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Parent Name"
                    value={formData.parentName || ""}
                    onChange={(e) =>
                      handleInputChange("parentName", e.target.value)
                    }
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
                  <TextField
                    fullWidth
                    label="WhatsApp Number"
                    value={formData.whatsappNumber || ""}
                    onChange={(e) =>
                      handleInputChange("whatsappNumber", e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Address"
                    value={formData.address || ""}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Kid Information */}
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
                    value={formData.kidName || ""}
                    onChange={(e) =>
                      handleInputChange("kidName", e.target.value)
                    }
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
                    fullWidth
                    label="Gender"
                    value={formData.kidsGender || ""}
                    onChange={(e) =>
                      handleInputChange("kidsGender", e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="School Name"
                    value={formData.schoolName || ""}
                    onChange={(e) =>
                      handleInputChange("schoolName", e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="School Pincode"
                    value={formData.schoolPincode || ""}
                    onChange={(e) =>
                      handleInputChange("schoolPincode", e.target.value)
                    }
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Programs */}
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

              {formData.programs?.map((program, index) => (
                <Card key={index} sx={{ mb: 2, p: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={5}>
                      <TextField
                        fullWidth
                        label="Program Name"
                        value={program.program || ""}
                        onChange={(e) => {
                          const updatedPrograms = [...formData.programs];
                          updatedPrograms[index].program = e.target.value;
                          handleInputChange("programs", updatedPrograms);
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={5}>
                      <TextField
                        fullWidth
                        label="Level"
                        value={program.level || ""}
                        onChange={(e) => {
                          const updatedPrograms = [...formData.programs];
                          updatedPrograms[index].level = e.target.value;
                          handleInputChange("programs", updatedPrograms);
                        }}
                      />
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
              ))}
            </Grid>

            {/* Status Information */}
            <Grid item xs={12}>
              <Typography
                variant="subtitle1"
                sx={{ mb: 2, mt: 2, fontWeight: 600 }}
              >
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
                        handleInputChange("enquiryField", e.target.value)
                      }
                      label="Enquiry Field" // This is important for proper label positioning
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
                      Payment
                    </InputLabel>
                    <Select
                      value={formData.payment || ""}
                      onChange={(e) =>
                        handleInputChange("payment", e.target.value)
                      }
                      label="Payment"
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
                        handleInputChange("source", e.target.value)
                      }
                    >
                      <MenuItem value="website">Website</MenuItem>
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
                        handleInputChange("disposition", e.target.value)
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
                        handleInputChange("scheduleDemo", {
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
                        handleInputChange("enquiryStatus", e.target.value)
                      }
                    >
                      <MenuItem value="Pending">Pending</MenuItem>
                      <MenuItem value="Qualified Lead">Qualified Lead</MenuItem>
                      <MenuItem value="Unqualified Lead">
                        Unqualified Lead
                      </MenuItem>
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
                        handleInputChange("enquiryType", e.target.value)
                      }
                    >
                      <MenuItem value="warm">Warm</MenuItem>
                      <MenuItem value="cold">Cold</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>

            {/* Messages and Notes */}
            <Grid item xs={12}>
              <Typography
                variant="subtitle1"
                sx={{ mb: 2, mt: 2, fontWeight: 600 }}
              >
                Messages & Notes
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Messages"
                    multiline
                    rows={4}
                    value={formData.message || ""}
                    onChange={(e) =>
                      handleInputChange("message", e.target.value)
                    }
                  />
                </Grid>
                {/* <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Notes"
                    multiline
                    rows={4}
                    value={formData.notes || ""}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Status Log"
                    multiline
                    rows={4}
                    value={formData.lastNoteAction || ""}
                    onChange={(e) =>
                      handleInputChange("lastNoteAction", e.target.value)
                    }
                  />
                </Grid> */}
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
          <Button onClick={handleCloseEdit} variant="outlined" sx={{ mr: 1 }}>
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DetailView;
