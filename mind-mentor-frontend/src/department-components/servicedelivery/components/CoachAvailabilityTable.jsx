import {
  Box,
  Button,
  createTheme,
  Paper,
  ThemeProvider,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import {
  deleteCoachAvailability,
  getCoachAvailabilityData,
  updateCoachAvailability,
} from "../../../api/service/employee/serviceDeliveryService";
import { formatDateOnly } from "../../../utils/formatDateOnly";
import { Link, useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const theme = createTheme({
  palette: {
    primary: {
      main: "#642b8f",
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

const programs = [
  { name: "Chess", levels: ["Beginner", "Intermediate", "Advanced"] },
  { name: "Rubiks Cube", levels: ["Beginner", "Intermediate", "Advanced"] },
  { name: "Math", levels: ["Beginner", "Intermediate", "Advanced"] },
];

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// Generate time slots with 15-minute intervals
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute of [0, 15, 30, 45]) {
      const formattedHour = hour.toString().padStart(2, "0");
      const formattedMinute = minute.toString().padStart(2, "0");
      slots.push(`${formattedHour}:${formattedMinute}`);
    }
  }
  return slots;
};

const timeSlots = generateTimeSlots();

// Custom No Data Component
const CustomNoRowsOverlay = () => {
  const department = localStorage.getItem("department");
  
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        gap: 2,
        p: 3,
      }}
    >
      <CalendarTodayIcon 
        sx={{ 
          fontSize: 64, 
          color: "text.secondary",
          opacity: 0.5 
        }} 
      />
      <Typography 
        variant="h6" 
        sx={{ 
          color: "text.secondary", 
          fontWeight: 500,
          textAlign: "center" 
        }}
      >
        No Coach Availability Found
      </Typography>
      <Typography 
        variant="body2" 
        sx={{ 
          color: "text.secondary", 
          textAlign: "center",
          mb: 2 
        }}
      >
        There are no coach availability records to display. Click the button below to add the first availability.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        component={Link}
        to={`/${department}/department/coachAvailabilityForm`}
        sx={{ mt: 1 }}
      >
        + Add First Availability
      </Button>
    </Box>
  );
};

const CoachAvailabilityTable = () => {
  const department = localStorage.getItem("department");
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 5,
    page: 0,
  });
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [editedData, setEditedData] = useState({});

  const fetchCoachAvailabilityData = async () => {
    try {
      setLoading(true);
      const response = await getCoachAvailabilityData();
      console.log("Coach Availability Data", response);
      
      if (response && response.status === 200) {
        // Check if data exists and has the expected structure
        if (response.data && response.data.availableDays && Array.isArray(response.data.availableDays)) {
          const formattedData = response.data.availableDays.map(
            (availability, index) => ({
              id: availability._id || availability.id || index,
              slNo: index + 1,
              coachId: availability.coachId || '',
              coachName: availability.coachName || 'N/A',
              program: availability.program || 'N/A',
              day: availability.day || 'N/A',
              fromTime: availability.fromTime || 'N/A',
              toTime: availability.toTime || 'N/A',
              createdAt: availability.createdAt ? formatDateOnly(availability.createdAt) : 'N/A',
            })
          );
          setRows(formattedData);
        } else{
          // Handle case where data structure is different or empty
          console.log("No availability data found or unexpected data structure:", response.data);
          setRows([]);
        }
      } 
      else if(response.status===401) {
        console.log("API response status not 200:", response?.status);
        setRows([]);
        
      }
    } catch (error) {
      console.error("Error fetching coach availability data:", error);
      
      // More specific error messages based on error type
      if (error.response) {
        // Server responded with error status
        const statusCode = error.response.status;
        const errorMessage = error.response.data?.message || `Server error (${statusCode})`;
        toast.error(`Failed to fetch data: ${errorMessage}`);
      } else if (error.request) {
        // Request was made but no response received
        toast.error("Network error: Unable to connect to server");
      } else {
        // Something else happened
        toast.error("An unexpected error occurred while fetching data");
      }
      
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoachAvailabilityData();
  }, []);

  const handleEditClick = (row) => {
    setSelectedRow(row);
    setEditedData({
      ...row,
      coachId: row.coachId, // Explicitly include coachId
    });
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (id) => {
    setItemToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteCoachAvailability(itemToDelete);
      setDeleteDialogOpen(false);
      toast.success("Availability deleted successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: { marginTop: "60px" },
      });
      fetchCoachAvailabilityData();
    } catch (error) {
      console.error("Error deleting availability:", error);
      toast.error("Failed to delete availability", {
        style: { marginTop: "60px" },
      });
    }
  };

  const handleEditSave = async () => {
    try {
      const updateData = {
        ...editedData,
        coachId: selectedRow.coachId,
      };
      await updateCoachAvailability(selectedRow.id, updateData);
      setEditDialogOpen(false);
      toast.success("Availability updated successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: { marginTop: "60px" },
      });
      fetchCoachAvailabilityData();
    } catch (error) {
      console.error("Error updating availability:", error);
      toast.error("Failed to update availability", {
        style: { marginTop: "60px" },
      });
    }
  };

  const handleEditChange = (field, value) => {
    setEditedData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleBack = () => {
    navigate(-1);
  };

  const columns = [
    {
      field: "slNo",
      headerName: "Sl No",
      width: 100,
      renderCell: (params) => params.value,
    },
    { field: "coachName", headerName: "Coach Name", width: 250 },
    { field: "program", headerName: "Program", width: 200 },
    { field: "day", headerName: "Day", width: 200 },
    { field: "fromTime", headerName: "From Time", width: 150 },
    { field: "toTime", headerName: "To Time", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      width: 250,
      renderCell: (params) => (
        <Box>
          <IconButton
            onClick={() => handleEditClick(params.row)}
            color="primary"
            size="small"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={() => handleDeleteClick(params.row.id)}
            color="error"
            size="small"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

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
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 3,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton onClick={handleBack} sx={{ mr: 1 }} color="primary">
                <ArrowBackIcon />
              </IconButton>
              <Typography
                variant="h5"
                sx={{
                  color: "text.primary",
                  fontWeight: 600,
                }}
              >
                Coach Availability
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to={`/${department}/department/coachAvailabilityForm`}
            >
              + Add Availability
            </Button>
          </Box>
          <DataGrid
            rows={rows}
            columns={columns}
            loading={loading}
            pagination
            pageSizeOptions={[5]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            slots={{ 
              toolbar: GridToolbar,
              noRowsOverlay: CustomNoRowsOverlay
            }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
              },
            }}
            onCellDoubleClick={(params) => handleEditClick(params.row)}
            sx={{
              height: 500,
              "& .MuiDataGrid-cell:focus": {
                outline: "none",
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: theme.palette.action.hover,
              },
              "& .MuiDataGrid-columnHeader": {
                backgroundColor: "#642b8f",
                color: "white",
                fontWeight: 600,
              },
            }}
          />
        </Paper>

        {/* Edit Dialog */}
        <Dialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle
            sx={{ backgroundColor: theme.palette.primary.main, color: "white" }}
          >
            Edit Availability
          </DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
            >
              <FormControl fullWidth>
                <InputLabel>Program</InputLabel>
                <Select
                  value={editedData.program || ""}
                  onChange={(e) => handleEditChange("program", e.target.value)}
                  label="Program"
                  disabled
                >
                  {programs.map((prog) => (
                    <MenuItem key={prog.name} value={prog.name}>
                      {prog.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Day</InputLabel>
                <Select
                  value={editedData.day || ""}
                  onChange={(e) => handleEditChange("day", e.target.value)}
                  label="Day"
                >
                  {days.map((day) => (
                    <MenuItem key={day} value={day}>
                      {day}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>From Time</InputLabel>
                <Select
                  value={editedData.fromTime || ""}
                  onChange={(e) => handleEditChange("fromTime", e.target.value)}
                  label="From Time"
                >
                  {timeSlots.map((time) => (
                    <MenuItem
                      key={time}
                      value={time}
                      disabled={editedData.toTime && time >= editedData.toTime}
                    >
                      {time}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>To Time</InputLabel>
                <Select
                  value={editedData.toTime || ""}
                  onChange={(e) => handleEditChange("toTime", e.target.value)}
                  label="To Time"
                >
                  {timeSlots.map((time) => (
                    <MenuItem
                      key={time}
                      value={time}
                      disabled={
                        editedData.fromTime && time <= editedData.fromTime
                      }
                    >
                      {time}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleEditSave}
              variant="contained"
              color="primary"
            >
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle
            sx={{ backgroundColor: theme.palette.error.main, color: "white" }}
          >
            Confirm Deletion
          </DialogTitle>
          <DialogContent sx={{ pt: 2, mt: 2 }}>
            <Typography>
              Are you sure you want to delete this availability? This action
              cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleConfirmDelete}
              variant="contained"
              color="error"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          style={{ marginTop: "60px" }}
        />
      </Box>
    </ThemeProvider>
  );
};

export default CoachAvailabilityTable;