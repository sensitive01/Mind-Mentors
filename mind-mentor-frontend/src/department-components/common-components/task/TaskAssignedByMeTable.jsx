import {
  Box,
  Button,
  createTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Fade,
  Grid,
  Paper,
  Slide,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { alpha } from "@mui/material/styles";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { addNotesToTasks, fetchTaskAmAssignedToOthers, updateTaskStatus } from "../../../api/service/employee/EmployeeService";
import columns from "./TaskColumn";


const theme = createTheme({
  palette: {
    primary: {
      main: "#642b8f", 
      // main: '#f8a213', 
      light: "#818CF8",
      dark: "#4F46E5",
    },
    secondary: {
      main: "#EC4899", 
      light: "#F472B6",
      dark: "#DB2777",
    },
    warm: {
      main: "#F59E0B", 
      light: "#FCD34D",
      dark: "#D97706",
    },
    cold: {
      main: "#3B82F6", 
      light: "#60A5FA",
      dark: "#2563EB",
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
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
        },
      },
    },
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
const DetailView = ({ data }) => (
  <Grid container spacing={3} sx={{ p: 2 }}>
    {Object.entries(data).map(
      ([key, value]) =>
        key !== "id" && (
          <Grid item xs={12} sm={6} md={6} key={key}>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: alpha("#1976d2", 0.04), 
                height: "100%",
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mb: 1, display: "block" }}
              >
                {key.replace(/([A-Z])/g, " $1").toUpperCase()}
              </Typography>
              {typeof value === "object" && value !== null ? (
                <>
                  {value.name && (
                    <Typography variant="body1" color="text.primary">
                      Name: {value.name}
                    </Typography>
                  )}
                  {value.email && (
                    <Typography variant="body1" color="text.primary">
                      Email: {value.email}
                    </Typography>
                  )}
                </>
              ) : (
                <Typography variant="body1" color="text.primary">
                  {value || "N/A"}
                </Typography>
              )}
            </Box>
          </Grid>
        )
    )}
  </Grid>
);
const TaskAssignedByMeTable = () => {
  const department = localStorage.getItem("department")
  const [rows, setRows] = useState([]);
  const navigate = useNavigate(); 
  const [logDialog, setLogDialog] = useState({ open: false, rowData: null });
  const empId = localStorage.getItem("empId");

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await fetchTaskAmAssignedToOthers(empId);
        console.log("My task", response);
        const formattedData = response.map((task,index) => ({
          ...task, 
          slNo:index+1,
          id: task._id, 
          taskTime: task.taskTime, 
          createdAt: task.createdAt, 
          updatedAt: task.updatedAt, 
          assignedBy: task.assignedBy,
        }));
        setRows(formattedData);

        console.log("New row", rows);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      }
    };
    fetchTask();
  }, []);
  const [noteDialog, setNoteDialog] = useState({
    open: false,
    rowData: null,
    noteText: "",
  });
  const [viewDialog, setViewDialog] = useState({
    open: false,
    rowData: null,
  });
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });
  const handleStatusToggle = async (id, newStatus) => {
    try {
     
      const empId = localStorage.getItem("empId");
      if (!empId) {
        console.error("Employee ID (empId) is missing.");
        return;
      }
     
      setRows(
        rows.map((row) => {
          if (row._id === id) {
            return {
              ...row,
              status: newStatus, 
              stageTag: newStatus, 
            };
          }
          return row;
        })
      );
  
      const payload = {
        status: newStatus,
        updatedBy: empId, 
      };
   
      const data = await updateTaskStatus(id, payload, empId);
      if (data.success) {
        console.log("Task status updated successfully:", data);
    
        if (data.activityLog) {
          console.log("Activity Log:", data.activityLog);
        }
      } else {
        console.error("Failed to update task status:", data.message);
      }
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };
  const handleNoteSave = async () => {
    if (noteDialog.rowData) {
      try {
        const { id } = noteDialog.rowData; 
        const { noteText, enquiryStage } = noteDialog;
       
        if (!enquiryStage || !noteText) {
          console.error("Enquiry Stage and Note Text are required.");
          return;
        }
     
        const empId = localStorage.getItem("empId");
        if (!empId) {
          console.error("Employee ID (empId) is missing.");
          return;
        }
   
        const payload = {
          enquiryStageTag: enquiryStage,
          addNoteTo: "parent", 
          notes: noteText,
          addedBy: empId, 
        };
       
        console.log("Payload to be sent:", payload);
     
        const data = await addNotesToTasks(id, payload);
  
        if (data.success) {
          console.log("Note added successfully:", data);
     
          setRows(
            rows.map((row) =>
              row.id === id
                ? { ...row, notes: [...(row.notes || []), payload] }
                : row
            )
          );
      
          setNoteDialog({
            open: false,
            rowData: null,
            noteText: "",
            enquiryStage: "",
            notesTo: "",
          });
        } else {
          console.error("Failed to add note:", data.message);
        }
      } catch (error) {
        console.error("Error adding note:", error.message);
      }
    }
  };
  console.log("row", rows);
  return (
    <ThemeProvider theme={theme}>
      <Fade in={true}>
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
              mb={3}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography
                variant="h5"
                gutterBottom
                sx={{ color: "text.primary", fontWeight: 600, mb: 3 }}
              >
                Assigned Tasks
              </Typography>
              <Button
                variant="contained"
                color="primary"
                component={Link}
                to={`/${department}/department/assign-new-task`}
              >
                + Assign New Task
              </Button>
            </Box>
            <DataGrid
              rows={rows}
              columns={columns(
                theme,
                handleStatusToggle,
                setViewDialog,
                setNoteDialog,
                setLogDialog,
                navigate 
              )}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              pageSizeOptions={[5, 10, 25]}
              disableRowSelectionOnClick
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
                  backgroundColor: alpha(theme.palette.primary.main, 0.04),
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

            <Dialog
              open={viewDialog.open}
              onClose={() => setViewDialog({ open: false, rowData: null })}
              maxWidth="md"
              fullWidth
              TransitionComponent={Slide}
              TransitionProps={{ direction: "up" }}
            >
              <DialogTitle
                sx={{
                  background: "linear-gradient(#642b8f, #aa88be)",
                  color: "#ffffff",
                  fontWeight: 600,
                }}
              >
                Student Details
              </DialogTitle>
              <Divider />
              <DialogContent>
                <DetailView data={viewDialog.rowData || {}} />
              </DialogContent>
              <Divider sx={{ borderColor: "#aa88be" }} />
              <DialogActions sx={{ p: 2.5 }}>
                <Button
                  class="px-8 py-3 bg-[#642b8f] text-white rounded-lg font-medium hover:bg-[#aa88be] transition-colors shadow-lg hover:shadow-xl"
                  onClick={() => setViewDialog({ open: false, rowData: null })}
                  variant="outlined"
                  sx={{
                    color: "#f8a213",
                    borderColor: "#f8a213",
                  }}
                >
                  Close
                </Button>
              </DialogActions>
            </Dialog>
    
            <Dialog
              open={noteDialog.open}
              onClose={() =>
                setNoteDialog({
                  open: false,
                  rowData: null,
                  noteText: "",
                  enquiryStage: "",
                  notesTo: "",
                  parents: "",
                })
              }
              maxWidth="sm"
              fullWidth
              TransitionComponent={Slide}
              TransitionProps={{ direction: "up" }}
              BackdropProps={{
                sx: {
                  backgroundColor: "rgba(0, 0, 0, 0.5)", 
                  backdropFilter: "blur(4px)", 
                },
              }}
            >
              <DialogTitle
                sx={{
                  color: "#ffffff",
                  fontWeight: 600,
                  background: "linear-gradient(to right, #642b8f, #aa88be)", 
                }}
              >
                Add Note
              </DialogTitle>
              <Divider />
              <DialogContent>
             
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel>Enquiry Stage</InputLabel>
                  <Select
                    value={noteDialog.enquiryStage}
                    onChange={(e) =>
                      setNoteDialog((prev) => ({
                        ...prev,
                        enquiryStage: e.target.value,
                      }))
                    }
                    label="Enquiry Stage"
                  >
                    <MenuItem value="New">New</MenuItem>
                    <MenuItem value="Follow-Up">Follow-Up</MenuItem>
                    <MenuItem value="Closed">Closed</MenuItem>
                    <MenuItem value="Converted">Converted</MenuItem>
                  </Select>
                </FormControl>
               
                <TextField
                  label="Notes To"
                  value={noteDialog.notesTo}
                  onChange={(e) =>
                    setNoteDialog((prev) => ({
                      ...prev,
                      notesTo: e.target.value,
                    }))
                  }
                  fullWidth
                  sx={{ mt: 2 }}
                />
                <TextField
                  label="Note"
                  value={noteDialog.noteText}
                  onChange={(e) =>
                    setNoteDialog((prev) => ({
                      ...prev,
                      noteText: e.target.value,
                    }))
                  }
                  multiline
                  rows={4}
                  fullWidth
                  sx={{ mt: 1 }}
                />
              </DialogContent>
              <Divider sx={{ borderColor: "#aa88be" }} />
              <DialogActions sx={{ p: 2.5 }}>
                <Button
                  onClick={handleNoteSave}
                  variant="contained"
                  class="px-8 py-3 bg-[#642b8f] text-white rounded-lg font-medium hover:bg-[#aa88be] transition-colors shadow-lg hover:shadow-xl"
                  sx={{
                    bgcolor: "primary.main",
                    "&:hover": {
                      bgcolor: "primary.dark",
                    },
                  }}
                >
                  Save Note
                </Button>
                <Button
                  class="px-8 py-3 bg-white border-2 border-[#642b8f] text-[#642b8f] rounded-lg font-medium hover:bg-[#efe8f0] transition-colors"
                  onClick={() =>
                    setNoteDialog({
                      open: false,
                      rowData: null,
                      noteText: "",
                      enquiryStage: "",
                      notesTo: "",
                    })
                  }
                  variant="outlined"
                  sx={{
                    color: "text.primary",
                    borderColor: "divider",
                  }}
                  type="reset"
                >
                  Cancel
                </Button>
              </DialogActions>
            </Dialog>
          </Paper>
        </Box>
      </Fade>
    </ThemeProvider>
  );
};
export default TaskAssignedByMeTable;
