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
  IconButton,
  DialogContentText,
  Tooltip,
} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { alpha } from "@mui/material/styles";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import ListAltIcon from "@mui/icons-material/ListAlt";

import {
  addNotesToTasks,
  superAdminDeleteTask,
  superAdminGetAllTask,
  updateTaskStatus,
  // deleteTask,
} from "../../../api/service/employee/EmployeeService";
import columns from "../task/TaskColumn";

const theme = createTheme({
  palette: {
    primary: {
      main: "#642b8f",
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

const ShowAllTask = () => {
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();
  const [logDialog, setLogDialog] = useState({ open: false, rowData: null });
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    rowData: null,
  });
  const [previewDialog, setPreviewDialog] = useState({
    open: false,
    rowData: null,
  });
  const empId = localStorage.getItem("empId");

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await superAdminGetAllTask();
        console.log(response);

        const formattedData = response.map((task, index) => ({
          ...task,
          slNo: index + 1,
          id: task._id,
          taskTime: task.taskTime,
          createdAt: task.createdAt,
          updatedAt: task.updatedAt,
          assignedBy: task.assignedBy,
        }));
        setRows(formattedData);
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
    enquiryStage: "",
    notesTo: "",
  });

  const [viewDialog, setViewDialog] = useState({
    open: false,
    rowData: null,
  });

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleStatusToggle = async (id, newStatus) => {
    console.log("Toggle");
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

      console.log("Updating before response");

      const data = await updateTaskStatus(id, payload, empId);
      console.log("Updating after response", data);
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

  const handleViewLogs = (rowData) => {
    const department = localStorage.getItem("department");
    navigate(`/${department}/department/taskslogs/${rowData._id}`);
  };

  const handleDeleteTask = async () => {
    if (deleteDialog.rowData) {
      try {
        const response = await superAdminDeleteTask(deleteDialog.rowData.id);
        if (response.status === 200) {
          setRows(rows.filter((row) => row.id !== deleteDialog.rowData.id));

          setDeleteDialog({ open: false, rowData: null });
        }
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    }
  };

  const handleRowClick = (params) => {
    setPreviewDialog({ open: true, rowData: params.row });
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

  // Define action column
  const actionColumn = {
    field: "actions",
    headerName: "Actions",
    width: 150,
    sortable: false,
    disableClickEventBubbling: true,
    renderCell: (params) => (
      <Box
        sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}
      >
        <Tooltip title="View Logs">
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              handleViewLogs(params.row);
            }}
            sx={{
              color: theme.palette.warm.main,
              "&:hover": {
                backgroundColor: alpha(theme.palette.warm.main, 0.1),
              },
            }}
            size="small"
          >
            <ListAltIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Delete">
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              setDeleteDialog({ open: true, rowData: params.row });
            }}
            sx={{
              color: theme.palette.secondary.main,
              "&:hover": {
                backgroundColor: alpha(theme.palette.secondary.main, 0.1),
              },
            }}
            size="small"
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
  };

  // Combine with original columns
  const getColumns = () => {
    // Get the original columns
    const originalColumns = columns(
      theme,
      handleStatusToggle,
      setViewDialog,
      setNoteDialog,
      setLogDialog,
      navigate
    );

    // Filter out any existing action columns to avoid duplicates
    const filteredColumns = originalColumns.filter(
      (col) => col.field !== "actions"
    );

    // Return the combined columns
    return [...filteredColumns, actionColumn];
  };

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
            <DataGrid
              rows={rows}
              columns={getColumns()}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              pageSizeOptions={[5, 10, 25]}
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
                "& .MuiDataGrid-row": {
                  cursor: "pointer",
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

            {/* View Dialog */}
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

            {/* Preview Dialog */}
            <Dialog
              open={previewDialog.open}
              onClose={() => setPreviewDialog({ open: false, rowData: null })}
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
                Task Preview
              </DialogTitle>
              <Divider />
              <DialogContent>
                <DetailView data={previewDialog.rowData || {}} />
              </DialogContent>
              <Divider sx={{ borderColor: "#aa88be" }} />
              <DialogActions sx={{ p: 2.5 }}>
                <Button
                  onClick={() =>
                    setPreviewDialog({ open: false, rowData: null })
                  }
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

            {/* Delete Confirmation Dialog */}
            <Dialog
              open={deleteDialog.open}
              onClose={() => setDeleteDialog({ open: false, rowData: null })}
              maxWidth="sm"
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
                  background: "linear-gradient(to right, #EC4899, #F472B6)",
                }}
              >
                Confirm Delete
              </DialogTitle>
              <DialogContent sx={{ pt: 2, mt: 1 }}>
                <DialogContentText>
                  Are you sure you want to delete this task? This action cannot
                  be undone.
                </DialogContentText>
              </DialogContent>
              <DialogActions sx={{ p: 2 }}>
                <Button
                  onClick={() =>
                    setDeleteDialog({ open: false, rowData: null })
                  }
                  variant="outlined"
                  sx={{
                    color: "text.primary",
                    borderColor: "divider",
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDeleteTask}
                  variant="contained"
                  sx={{
                    bgcolor: theme.palette.secondary.main,
                    "&:hover": { bgcolor: theme.palette.secondary.dark },
                  }}
                >
                  Delete
                </Button>
              </DialogActions>
            </Dialog>
          </Paper>
        </Box>
      </Fade>
    </ThemeProvider>
  );
};

export default ShowAllTask;
