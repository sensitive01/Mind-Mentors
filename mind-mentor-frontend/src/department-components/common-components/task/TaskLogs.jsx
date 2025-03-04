import {
  Box,
  Button,
  Paper,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Divider,
  Slide,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  addNotesToTasks,
  getActivityLogsByTaskId,
} from "../../../api/service/employee/EmployeeService";

const theme = createTheme({
  palette: {
    primary: {
      main: "#642b8f",
    },
    background: {
      default: "#F1F5F9",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1E293B",
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
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
        },
      },
    },
  },
});

const columns = [
  { field: "sno", headerName: "S.No", flex: 0.5, minWidth: 50 },
  { field: "action", headerName: "Action", flex: 1, minWidth: 150 },
  { field: "details", headerName: "Details", flex: 2, minWidth: 200 },
  {
    field: "performedByName",
    headerName: "Performed By",
    flex: 1.5,
    minWidth: 180,
  },
  { field: "timestamp", headerName: "Timestamp", flex: 1, minWidth: 150 },
];

const TaskLogs = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [noteDialog, setNoteDialog] = useState({
    open: false,
    rowData: null,
    noteText: "",
    enquiryStage: "",
    notesTo: "",
  });

  const fetchActivityLogs = async (id) => {
    console.log("Fetching activity logs for task ID:", id);
    try {
      const response = await getActivityLogsByTaskId(id);
      console.log("Fetched Data:", response);

      if (response.success) {
        const formattedRows = response.data.map((log, index) => ({
          id: log._id,
          sno: index + 1,
          taskId: log.taskId,
          action: log.action,
          details: log.details,
          performedByName: log.performedByName,
          timestamp: new Date(log.timestamp).toLocaleString(),
        }));

        setRows(formattedRows);
      } else {
        console.error("Error fetching activity logs:", response.message);
      }
    } catch (error) {
      console.error("Failed to fetch activity logs:", error);
    }
  };

  useEffect(() => {
    fetchActivityLogs(id);
  }, []);

  const handleOpenNoteDialog = () => {
    // When opening the dialog, set the rowData to the current task
    setNoteDialog({
      open: true,
      rowData: { id }, // Set the current task ID
      noteText: "",
      enquiryStage: "",
      notesTo: "",
    });
  };

  const handleNoteSave = async () => {
    if (noteDialog.rowData) {
      try {
        const taskId = noteDialog.rowData.id;
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

        const data = await addNotesToTasks(taskId, payload);

        if (data.success) {
          console.log("Note added successfully:", data);

          // Optionally, you might want to refetch the activity logs
          // to ensure you have the most up-to-date information
          await fetchActivityLogs(taskId);

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

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          width: { xs: "100%", sm: "100%", md: "100%" },
          height: "100%",
          p: 3,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 3,
            backgroundColor: "background.paper",
            borderRadius: 3,
            height: 650,
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
            position: "relative",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                color: "text.primary",
                fontWeight: 600,
                mb: 0,
              }}
            >
              Task Activities
            </Typography>
            <Button
              variant="contained"
              onClick={handleOpenNoteDialog}
              sx={{
                bgcolor: "primary.main",
                "&:hover": {
                  bgcolor: "primary.dark",
                },
                position: "absolute",
                top: 24,
                right: 24,
              }}
            >
              Update Task Status
            </Button>
          </Box>
          <DataGrid
            rows={rows}
            columns={columns}
            disableRowSelectionOnClick
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
              },
            }}
            rowHeight={60} // Increased row height from default
            sx={{
              height: 500,
              "& .MuiDataGrid-cell:focus": { outline: "none" },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: theme.palette.action.hover,
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

        {/* Note Dialog */}
        <Dialog
          open={noteDialog.open}
          onClose={() =>
            setNoteDialog({
              open: false,
              rowData: null,
              noteText: "",
              enquiryStage: "",
              notesTo: "",
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
      </Box>
    </ThemeProvider>
  );
};

export default TaskLogs;
