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
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import ChildCareIcon from "@mui/icons-material/ChildCare";
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

// Modal style
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
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
      default:
        return "default";
    }
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

        {/* Modal for displaying parent details */}
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
                    Parent Details
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Complete information about the selected parent
                  </Typography>
                </Box>

                {/* Modal Content */}
                <Box sx={{ p: 3 }}>
                  <Grid container spacing={3}>
                    {/* Basic Information */}
                    <Grid item xs={12}>
                      <Typography
                        variant="h6"
                        sx={{ mb: 2, color: "primary.main" }}
                      >
                        Basic Information
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
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

                    <Grid item xs={12} sm={6}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
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

                    <Grid item xs={12} sm={6}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
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

                    <Grid item xs={12} sm={6}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
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

                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }} />
                    </Grid>

                    {/* Status and Type Information */}
                    <Grid item xs={12}>
                      <Typography
                        variant="h6"
                        sx={{ mb: 2, color: "primary.main" }}
                      >
                        Status & Role Information
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
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
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        Status
                      </Typography>
                      <Chip
                        label={selectedParent.status}
                        color={getStatusColor(selectedParent.status)}
                        size="small"
                      />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        Type
                      </Typography>
                      <Chip
                        label={selectedParent.type}
                        color={getTypeColor(selectedParent.type)}
                        size="small"
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }} />
                    </Grid>

                    {/* Additional Information */}
                    <Grid item xs={12}>
                      <Typography
                        variant="h6"
                        sx={{ mb: 2, color: "primary.main" }}
                      >
                        Additional Information
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Serial Number
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {selectedParent.sno}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Created At
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {selectedParent.createdAt}
                      </Typography>
                    </Grid>
                  </Grid>
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
