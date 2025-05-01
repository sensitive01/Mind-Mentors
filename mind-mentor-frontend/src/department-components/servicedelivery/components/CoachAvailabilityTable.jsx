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
import { Link } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast, ToastContainer } from "react-toastify";

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
      const formattedHour = hour.toString().padStart(2, '0');
      const formattedMinute = minute.toString().padStart(2, '0');
      slots.push(`${formattedHour}:${formattedMinute}`);
    }
  }
  return slots;
};

const timeSlots = generateTimeSlots();

const CoachAvailabilityTable = () => {
  const department = localStorage.getItem("department")
  const [rows, setRows] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 5,
    page: 0,
  });
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [editedData, setEditedData] = useState({});

  const fetchCoachAvailabilityData = async () => {
    try {
      const response = await getCoachAvailabilityData();
      console.log("Coach Availability Data", response);

      const formattedData = response.data.availableDays.map((availability,index) => ({
        id: availability._id,
        slNo:index+1,
        coachId:availability.coachId,
        coachName: availability.coachName,
        program: availability.program,
        day: availability.day,
        fromTime: availability.fromTime,
        toTime: availability.toTime,
        createdAt: formatDateOnly(availability.createdAt),
      }));
      setRows(formattedData);
    } catch (error) {
      console.error("Error fetching coach availability data:", error);
      toast.error("Failed to fetch availability data");
    }
  };

  useEffect(() => {
    fetchCoachAvailabilityData();
  }, []);

  const handleEditClick = (row) => {
    setSelectedRow(row);
    setEditedData({
      ...row,
      coachId: row.coachId  // Explicitly include coachId
    });
    setEditDialogOpen(true);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this availability?")) {
      try {
        await deleteCoachAvailability(id);
        toast.success("Availability deleted successfully");
        fetchCoachAvailabilityData();
      } catch (error) {
        console.error("Error deleting availability:", error);
        toast.error("Failed to delete availability");
      }
    }
  };

  const handleEditSave = async () => {
    try {
    
      const updateData = {
        ...editedData,
        coachId: selectedRow.coachId
      };
      await updateCoachAvailability(selectedRow.id, updateData);
      setEditDialogOpen(false);
      toast.success("Availability updated successfully");
      fetchCoachAvailabilityData();
    } catch (error) {
      console.error("Error updating availability:", error);
      toast.error("Failed to update availability");
    }
  };
  const handleEditChange = (field, value) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }));
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
            <Typography
              variant="h5"
              sx={{
                color: "text.primary",
                fontWeight: 600,
              }}
            >
              Coach Availability
            </Typography>
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
            pagination
            pageSizeOptions={[5]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            slots={{ toolbar: GridToolbar }}
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
          <DialogTitle sx={{ backgroundColor: theme.palette.primary.main, color: 'white' }}>
            Edit Availability
          </DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Program</InputLabel>
                <Select
                  value={editedData.program || ''}
                  onChange={(e) => handleEditChange('program', e.target.value)}
                  label="Program"
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
                  value={editedData.day || ''}
                  onChange={(e) => handleEditChange('day', e.target.value)}
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
                  value={editedData.fromTime || ''}
                  onChange={(e) => handleEditChange('fromTime', e.target.value)}
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
                  value={editedData.toTime || ''}
                  onChange={(e) => handleEditChange('toTime', e.target.value)}
                  label="To Time"
                >
                  {timeSlots.map((time) => (
                    <MenuItem 
                      key={time} 
                      value={time}
                      disabled={editedData.fromTime && time <= editedData.fromTime}
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
            <Button onClick={handleEditSave} variant="contained" color="primary">
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>
        <ToastContainer />
      </Box>
    </ThemeProvider>
  );
};

export default CoachAvailabilityTable;