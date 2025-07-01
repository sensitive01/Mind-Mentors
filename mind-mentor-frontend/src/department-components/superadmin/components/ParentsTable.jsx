import {
  Box,
  createTheme,
  Paper,
  ThemeProvider,
  Typography,
  Modal,
  Grid,
  Chip,
  IconButton,
  Divider,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SchoolIcon from "@mui/icons-material/School";
import EventIcon from "@mui/icons-material/Event";
import PaymentIcon from "@mui/icons-material/Payment";
import InfoIcon from "@mui/icons-material/Info";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CakeIcon from "@mui/icons-material/Cake";
import WcIcon from "@mui/icons-material/Wc";
import { getAllParentData } from "../../../api/service/employee/EmployeeService";

const theme = createTheme({
  palette: {
    primary: {
      main: "#642b8f", // Indigo
      light: "#818CF8",
      dark: "#4F46E5",
    },
    background: {
      default: "#F1F5F9",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1E293B",
      secondary: "#64748B",
    },
  },
  components: {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: "none",
          "& .MuiDataGrid-cell:focus": {
            outline: "none",
          },
        },
      },
    },
  },
});

// Enhanced modal style for larger content
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 900,
  bgcolor: "background.paper",
  borderRadius: 3,
  boxShadow: 24,
  p: 0,
  maxHeight: "90vh",
  overflow: "auto",
};

// Updated columns for parent data
const columns = [
  { field: "sno", headerName: "Sno", width: 50 },
  { field: "parentName", headerName: "Parent Name", width: 180 },
  { field: "parentEmail", headerName: "Email", width: 220 },
  { field: "parentMobile", headerName: "Mobile", width: 150 },
  { field: "numberOfKids", headerName: "Number of Kids", width: 130 },
  { field: "role", headerName: "Role", width: 100 },
  { field: "status", headerName: "Status", width: 100 },
  { field: "type", headerName: "Type", width: 100 },
  { field: "createdAt", headerName: "Created At", width: 180 },
];

const ParentTable = () => {
  const [rows, setRows] = useState([]);
  const [selectedParent, setSelectedParent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchParentData = async () => {
      const response = await getAllParentData();
      console.log("parent data", response);

      // Map the response to the format expected by DataGrid
      const formattedData = response.data.parentData.map((parent, index) => ({
        sno: index + 1,
        id: parent._id, // DataGrid requires an 'id' field
        parentName: parent.parentName,
        parentEmail: parent.parentEmail,
        parentMobile: parent.parentMobile,
        numberOfKids: parent.kids ? parent.kids.length : 0,
        role: parent.role,
        status: parent.status,
        type: parent.type,
        createdAt: new Date(parent.createdAt).toLocaleDateString(), // Format date as needed
        originalData: parent, // Store original data for the popup
      }));

      setRows(formattedData);
    };
    fetchParentData();
  }, []);

  const handleRowClick = (params) => {
    setSelectedParent(params.row);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedParent(null);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "success";
      case "inactive":
        return "error";
      case "pending":
        return "warning";
      case "scheduled":
        return "info";
      default:
        return "default";
    }
  };

  const getTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case "premium":
        return "primary";
      case "basic":
        return "secondary";
      case "exist":
        return "success";
      default:
        return "default";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderKidDetails = (kid, index) => {
    const enrollment = kid.enrollment;
    
    return (
      <Accordion key={kid._id || index} sx={{ mb: 2 }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`kid-${index}-content`}
          id={`kid-${index}-header`}
          sx={{
            backgroundColor: "#f8f9fa",
            borderRadius: 1,
            mb: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
            <ChildCareIcon sx={{ mr: 2, color: "primary.main" }} />
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              {enrollment?.kidFirstName || "Unknown"} {enrollment?.kidLastName || ""}
            </Typography>
            <Chip
              label={enrollment?.enquiryStatus || "Unknown"}
              color={getStatusColor(enrollment?.enquiryStatus)}
              size="small"
              sx={{ ml: 2 }}
            />
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            {/* Basic Kid Info */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="h6" color="primary.main" gutterBottom>
                    <InfoIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                    Basic Information
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <PersonIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Full Name"
                        secondary={`${enrollment?.kidFirstName || "N/A"} ${enrollment?.kidLastName || ""}`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CakeIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Age"
                        secondary={enrollment?.kidsAge || "N/A"}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <WcIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Gender"
                        secondary={enrollment?.kidsGender || "N/A"}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <LocationOnIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Pincode"
                        secondary={enrollment?.pincode || "N/A"}
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>

            {/* Enrollment Details */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="h6" color="primary.main" gutterBottom>
                    <SchoolIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                    Enrollment Details
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText
                        primary="Enquiry Type"
                        secondary={
                          <Chip
                            label={enrollment?.enquiryType || "N/A"}
                            size="small"
                            variant="outlined"
                          />
                        }
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Enquiry Status"
                        secondary={
                          <Chip
                            label={enrollment?.enquiryStatus || "N/A"}
                            color={getStatusColor(enrollment?.enquiryStatus)}
                            size="small"
                          />
                        }
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Demo Status"
                        secondary={
                          <Chip
                            label={enrollment?.scheduleDemo?.status || "N/A"}
                            color={getStatusColor(enrollment?.scheduleDemo?.status)}
                            size="small"
                          />
                        }
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Payment Status"
                        secondary={
                          <Chip
                            label={enrollment?.paymentStatus || "N/A"}
                            color={getStatusColor(enrollment?.paymentStatus)}
                            size="small"
                          />
                        }
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Source"
                        secondary={enrollment?.source || "N/A"}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="New User"
                        secondary={enrollment?.isNewUser ? "Yes" : "No"}
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>

            {/* Programs */}
            {enrollment?.programs && enrollment.programs.length > 0 && (
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" color="primary.main" gutterBottom>
                      <SchoolIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                      Programs Enrolled
                    </Typography>
                    {enrollment.programs.map((program, programIndex) => (
                      <Box key={programIndex} sx={{ mb: 2, p: 2, bgcolor: "#f8f9fa", borderRadius: 1 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6} md={3}>
                            <Typography variant="body2" color="text.secondary">
                              Program
                            </Typography>
                            <Typography variant="body1" fontWeight="medium">
                              {program.program}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6} md={3}>
                            <Typography variant="body2" color="text.secondary">
                              Level
                            </Typography>
                            <Typography variant="body1" fontWeight="medium">
                              {program.level}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6} md={2}>
                            <Typography variant="body2" color="text.secondary">
                              Status
                            </Typography>
                            <Chip
                              label={program.status}
                              size="small"
                              color={getStatusColor(program.status)}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6} md={4}>
                            <Typography variant="body2" color="text.secondary">
                              Classes (Total/Attended/Remaining)
                            </Typography>
                            <Typography variant="body1" fontWeight="medium">
                              {program.totalClass}/{program.attendedClass}/{program.remainingClass}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
            )}

            {/* Dates */}
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" color="primary.main" gutterBottom>
                    <EventIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                    Important Dates
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Created At
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {formatDate(enrollment?.createdAt)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Updated At
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {formatDate(enrollment?.updatedAt)}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Additional Info */}
            {enrollment?.notes && enrollment.notes !== "Empty" && (
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" color="primary.main" gutterBottom>
                      Notes
                    </Typography>
                    <Typography variant="body1">
                      {enrollment.notes}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        </AccordionDetails>
      </Accordion>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ width: "100%", height: "100%", p: 3 }}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            backgroundColor: "background.paper",
            borderRadius: 3,
            height: 650,
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
          }}
        >
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              color: "text.primary",
              fontWeight: 600,
              mb: 3,
            }}
          >
            Parent Data
          </Typography>
          <DataGrid
            rows={rows}
            columns={columns}
            disableRowSelectionOnClick
            onRowClick={handleRowClick}
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
              },
            }}
            sx={{
              height: 500,
              "& .MuiDataGrid-cell:focus": {
                outline: "none",
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: theme.palette.action.hover,
                cursor: "pointer",
              },
              "& .MuiDataGrid-columnHeader": {
                backgroundColor: "#642b8f",
                color: "white",
                fontWeight: 600,
              },
              "& .MuiCheckbox-root.Mui-checked": {
                color: "#FFFFFF",
              },
              "& .MuiDataGrid-columnHeader .MuiCheckbox-root": {
                color: "#FFFFFF",
              },
            }}
          />
        </Paper>

        {/* Enhanced Modal for displaying complete parent and kids details */}
        <Modal
          open={modalOpen}
          onClose={handleCloseModal}
          aria-labelledby="parent-details-modal"
          aria-describedby="parent-details-description"
        >
          <Box sx={modalStyle}>
            {selectedParent && (
              <>
                {/* Modal Header */}
                <Box
                  sx={{
                    p: 3,
                    background:
                      "linear-gradient(135deg, #642b8f 0%, #8b5a9f 100%)",
                    color: "white",
                    borderRadius: "12px 12px 0 0",
                    position: "relative",
                  }}
                >
                  <IconButton
                    onClick={handleCloseModal}
                    sx={{
                      position: "absolute",
                      right: 8,
                      top: 8,
                      color: "white",
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                  <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
                    Parent & Children Details
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Complete information about {selectedParent.parentName} and their {selectedParent.numberOfKids} child{selectedParent.numberOfKids !== 1 ? 'ren' : ''}
                  </Typography>
                </Box>

                {/* Modal Content */}
                <Box sx={{ p: 3 }}>
                  {/* Parent Basic Information */}
                  <Card variant="outlined" sx={{ mb: 3 }}>
                    <CardContent>
                      <Typography
                        variant="h6"
                        sx={{ mb: 2, color: "primary.main" }}
                      >
                        <PersonIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                        Parent Information
                      </Typography>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={3}>
                          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                            <PersonIcon sx={{ mr: 2, color: "primary.main" }} />
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                Parent Name
                              </Typography>
                              <Typography variant="body1" fontWeight="medium">
                                {selectedParent.parentName}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                            <EmailIcon sx={{ mr: 2, color: "primary.main" }} />
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                Email Address
                              </Typography>
                              <Typography variant="body1" fontWeight="medium">
                                {selectedParent.parentEmail}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                            <PhoneIcon sx={{ mr: 2, color: "primary.main" }} />
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                Mobile Number
                              </Typography>
                              <Typography variant="body1" fontWeight="medium">
                                {selectedParent.parentMobile}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                            <ChildCareIcon sx={{ mr: 2, color: "primary.main" }} />
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                Number of Kids
                              </Typography>
                              <Typography variant="body1" fontWeight="medium">
                                {selectedParent.numberOfKids}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Role
                          </Typography>
                          <Chip
                            label={selectedParent.role}
                            color="primary"
                            variant="outlined"
                            size="small"
                          />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Status
                          </Typography>
                          <Chip
                            label={selectedParent.status}
                            color={getStatusColor(selectedParent.status)}
                            size="small"
                          />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Type
                          </Typography>
                          <Chip
                            label={selectedParent.type}
                            color={getTypeColor(selectedParent.type)}
                            size="small"
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>

                  <Divider sx={{ my: 3 }} />

                  {/* Children Details */}
                  <Typography
                    variant="h6"
                    sx={{ mb: 2, color: "primary.main" }}
                  >
                    <ChildCareIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                    Children Details ({selectedParent.numberOfKids})
                  </Typography>

                  {selectedParent.originalData.kids && selectedParent.originalData.kids.length > 0 ? (
                    selectedParent.originalData.kids.map((kid, index) => 
                      renderKidDetails(kid, index)
                    )
                  ) : (
                    <Typography variant="body1" color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
                      No children information available
                    </Typography>
                  )}
                </Box>
              </>
            )}
          </Box>
        </Modal>
      </Box>
    </ThemeProvider>
  );
};

export default ParentTable;