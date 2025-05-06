import {
  Alert,
  Box,
  Button,
  createTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Snackbar,
  TextField,
  ThemeProvider,
  Typography,
  Chip,
  DialogContentText,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { ArrowBack, Delete, Edit } from "@mui/icons-material";
import {
  adminAddNewProgramme,
  adminDeleteProgramme,
  adminUpdateProgramme,
  getAllProgrameData,
  // Add these new imports to your service file:
  // adminUpdateProgramme,
  // adminDeleteProgramme,
} from "../../../../api/service/employee/EmployeeService";

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
    error: {
      main: "#ef4444",
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

const ProgramListing = () => {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [newProgram, setNewProgram] = useState({
    programName: "",
    programLevel: [],
  });
  const [tempLevel, setTempLevel] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Enhanced columns with improved widths and better responsive behavior
  const columns = [
    {
      field: "sno",
      headerName: "SNo",
      width: 80,
      headerAlign: "center",
      align: "center",
      sortable: true,
    },
    {
      field: "programName",
      headerName: "Program Name",
      flex: 1,
      minWidth: 220,
      headerAlign: "left",
      align: "left",
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            color: "text.primary",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            width: "100%",
            paddingRight: 1,
          }}
        >
          {params.value || "-"}
        </Typography>
      ),
    },
    {
      field: "programLevel",
      headerName: "Program Levels",
      flex: 2,
      minWidth: 300,
      headerAlign: "left",
      renderCell: (params) => {
        if (!params || !params.value || params.value.length === 0) {
          return "-";
        }
    
        const levels = Array.isArray(params.value) ? params.value : [];
    
        return (
          <Box
            sx={{ 
              display: "flex", 
              flexWrap: "wrap", 
              gap: 0.8, 
              maxWidth: "100%",
              px: 0.5, // Add horizontal padding
              alignItems: "flex-start", // Align items at the top
              height: "100%", // Take full height of the cell
            }}
          >
            {levels.map((level, index) => (
              <Chip
                key={index}
                label={level}
                size="small"
                sx={{
                  borderRadius: 1,
                  backgroundColor: "rgba(100, 43, 143, 0.1)",
                  color: "primary.main",
                  fontSize: "0.75rem",
                  height: "22px",
                  margin: "2px", // Add margin between chips
                  "& .MuiChip-label": {
                    padding: "0px 8px",
                    whiteSpace: "normal",
                    lineHeight: "1.2", // Better line height for chip text
                  },
                }}
              />
            ))}
          </Box>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      headerAlign: "center",
      align: "center",
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
          <IconButton
            onClick={() => handleEditClick(params.row)}
            aria-label="edit"
            size="small"
            sx={{
              color: "primary.main",
              "&:hover": { backgroundColor: "rgba(100, 43, 143, 0.1)" },
            }}
          >
            <Edit fontSize="small" />
          </IconButton>
          <IconButton
            onClick={() => handleDeleteClick(params.row)}
            aria-label="delete"
            size="small"
            sx={{
              color: "error.main",
              "&:hover": { backgroundColor: "rgba(239, 68, 68, 0.1)" },
            }}
          >
            <Delete fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  const fetchProgramData = async () => {
    try {
      setLoading(true);
      const response = await getAllProgrameData();

      if (response && response.status === 200) {
        const processedRows = response.data.programs.map((program, index) => ({
          ...program,
          sno: index + 1,
        }));
        setRows(processedRows);
      } else {
        console.error("Invalid API response format:", response);
        setToast({
          open: true,
          message: "Failed to fetch program data",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error fetching program data:", error);
      setToast({
        open: true,
        message: "Error loading programs. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgramData();
  }, []);

  // Handle Edit button click
  const handleEditClick = (program) => {
    setSelectedProgram(program);
    setNewProgram({
      _id: program._id,
      programName: program.programName,
      programLevel: [...program.programLevel],
    });
    setEditMode(true);
    setOpen(true);
  };

  // Handle Delete button click
  const handleDeleteClick = (program) => {
    setSelectedProgram(program);
    setDeleteDialogOpen(true);
  };

  const handleClickOpen = () => {
    setEditMode(false);
    setNewProgram({ programName: "", programLevel: [] });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewProgram({ programName: "", programLevel: [] });
    setTempLevel("");
    setEditMode(false);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setSelectedProgram(null);
  };

  const handleToastClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setToast({ ...toast, open: false });
  };

  const handleGoBack = () => {
    window.history.back();
  };

  const handleNameChange = (e) => {
    setNewProgram({
      ...newProgram,
      programName: e.target.value,
    });
  };

  const handleLevelChange = (e) => {
    setTempLevel(e.target.value);
  };

  const handleAddLevel = () => {
    if (tempLevel.trim() !== "") {
      const levelExists = newProgram.programLevel.some(
        (level) => level.toLowerCase() === tempLevel.trim().toLowerCase()
      );

      if (!levelExists) {
        setNewProgram((prevState) => ({
          ...prevState,
          programLevel: [...prevState.programLevel, tempLevel.trim()],
        }));
        setTempLevel("");
      } else {
        setToast({
          open: true,
          message: "This program level already exists",
          severity: "warning",
        });
        setTempLevel("");
      }
    }
  };

  const handleDeleteLevel = (levelToDelete) => {
    setNewProgram((prevState) => ({
      ...prevState,
      programLevel: prevState.programLevel.filter(
        (level) => level !== levelToDelete
      ),
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddLevel();
    }
  };

  const handleAddProgram = async () => {
    if (newProgram.programName && newProgram.programLevel.length > 0) {
      try {
        setLoading(true);

        const programData = {
          programName: newProgram.programName,
          programLevel: [...newProgram.programLevel],
        };

        const response = await adminAddNewProgramme(programData);

        if (response && (response.status === 200 || response.success)) {
          await fetchProgramData();
          handleClose();

          setTimeout(() => {
            setToast({
              open: true,
              message: "Program added successfully!",
              severity: "success",
            });
          }, 100);
        } else {
          setToast({
            open: true,
            message: response?.message || "Failed to add program",
            severity: "error",
          });
        }
      } catch (error) {
        console.error("Error adding program:", error);
        setToast({
          open: true,
          message: "Error adding program. Please try again.",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    } else {
      setToast({
        open: true,
        message: "Please enter program name and at least one level",
        severity: "warning",
      });
    }
  };

  const handleUpdateProgram = async () => {
    if (newProgram.programName && newProgram.programLevel.length > 0) {
      try {
        setLoading(true);

        const programData = {
          _id: newProgram._id,
          programName: newProgram.programName,
          programLevel: [...newProgram.programLevel],
        };

        console.log("programData",programData)

        const response = await adminUpdateProgramme(programData);

        if (response && (response.status === 200 || response.success)) {
          await fetchProgramData();
          handleClose();

          setTimeout(() => {
            setToast({
              open: true,
              message: "Program updated successfully!",
              severity: "success",
            });
          }, 100);
        } else {
          setToast({
            open: true,
            message: response?.message || "Failed to update program",
            severity: "error",
          });
        }
      } catch (error) {
        console.error("Error updating program:", error);
        setToast({
          open: true,
          message: "Error updating program. Please try again.",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    } else {
      setToast({
        open: true,
        message: "Please enter program name and at least one level",
        severity: "warning",
      });
    }
  };

  const handleDeleteProgram = async () => {
    if (selectedProgram && selectedProgram._id) {
      try {
        setLoading(true);
        const response = await adminDeleteProgramme(selectedProgram._id);

        if (response && (response.status === 200 || response.success)) {
          await fetchProgramData();
          handleDeleteDialogClose();

          setTimeout(() => {
            setToast({
              open: true,
              message: "Program deleted successfully!",
              severity: "success",
            });
          }, 100);
        } else {
          setToast({
            open: true,
            message: response?.message || "Failed to delete program",
            severity: "error",
          });
        }
      } catch (error) {
        console.error("Error deleting program:", error);
        setToast({
          open: true,
          message: "Error deleting program. Please try again.",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          width: "100%",
          height: "100vh",
          p: 4,
          backgroundColor: "#fffff",
        }}
      >
        <Paper
          elevation={2}
          sx={{
            p: 4,
            backgroundColor: "background.paper",
            borderRadius: 2,
            height: "calc(100% - 40px)",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.08)",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 4,
              borderBottom: "1px solid #eaeaea",
              pb: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton
                onClick={handleGoBack}
                sx={{ mr: 2, color: "primary.main" }}
                aria-label="go back"
              >
                <ArrowBack />
              </IconButton>
              <Typography
                variant="h5"
                sx={{
                  color: "text.primary",
                  fontWeight: 700,
                  letterSpacing: "-0.5px",
                }}
              >
                Program Listing
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleClickOpen}
              size="large"
              sx={{
                backgroundColor: "primary.main",
                "&:hover": {
                  backgroundColor: "primary.dark",
                },
                borderRadius: 2,
                px: 3,
                py: 1,
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Add Program
            </Button>
          </Box>

          <DataGrid
            rows={rows}
            columns={columns}
            autoHeight
            disableRowSelectionOnClick
            disableDensitySelector
            loading={loading}
            getRowId={(row) => row._id || row.sno.toString()}
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 300 },
                printOptions: { disableToolbarButton: true },
                csvOptions: { disableToolbarButton: false },
              },
            }}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 },
              },
              sorting: {
                sortModel: [{ field: "sno", sort: "asc" }],
              },
              columns: {
                columnVisibilityModel: {
                  sno: true,
                  programName: true,
                  programLevel: true,
                  actions: true,
                },
              },
            }}
            pageSizeOptions={[5, 10, 25]}
            sx={{
              height: "calc(100% - 80px)",
              minHeight: "470px",
              border: "none",
              borderRadius: 2,
              "& .MuiDataGrid-main": {
                borderRadius: 2,
                backgroundColor: "#ffffff",
              },
              "& .MuiDataGrid-cell": {
                borderColor: "#f0f0f0",
                py: 1.5,
                paddingLeft: 2,
                paddingRight: 2,
                whiteSpace: "normal !important", // Allow text to wrap
                overflow: "visible",
                lineHeight: "1.5", // Improve line height for wrapped text
              },
              "& .MuiDataGrid-cell:focus": {
                outline: "none",
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "rgba(100, 43, 143, 0.04)",
              },
              "& .MuiDataGrid-row": {
                fontSize: "14px",
                minHeight: "80px !important", // Increase minimum row height
                height: "auto !important", // Allow rows to expand based on content
              },
              "& .MuiDataGrid-columnHeader": {
                backgroundColor: "#642b8f",
                color: "white",
                fontWeight: 600,
                height: "60px",
                paddingLeft: 2,
                paddingRight: 2,
              },
              "& .MuiDataGrid-columnHeaders": {
                borderRadius: "8px 8px 0 0",
              },
              "& .MuiDataGrid-footerContainer": {
                borderTop: "1px solid #eaeaea",
              },
              "& .MuiToolbar-root": {
                padding: 2,
              },
              "& .MuiDataGrid-virtualScroller": {
                minHeight: "300px", // Ensure enough height for content
              },
              "& .MuiDataGrid-overlay": {
                backgroundColor: "rgba(255, 255, 255, 0.8)",
              },
              "& .MuiDataGrid-columnSeparator": {
                visibility: "hidden",
              },
              // Force all cells to use auto height
              "& .MuiDataGrid-cell--textLeft": {
                whiteSpace: "normal",
              },
              // Ensure Grid renders correctly with wrapped text
              "& .MuiDataGrid-viewport": {
                overflow: "visible",
              },
              "& .MuiDataGrid-renderingZone": {
                maxHeight: "none !important",
              },
              "& .MuiDataGrid-window": {
                position: "static !important",
              },
            }}
          />
        </Paper>
      </Box>

      {/* Add/Edit Program Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 2,
            px: 1,
          },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: 22,
            fontWeight: 700,
            py: 3,
            borderBottom: "1px solid #eaeaea",
          }}
        >
          {editMode ? "Edit Program" : "Add New Program"}
        </DialogTitle>
        <DialogContent sx={{ pt: 4, pb: 2, px: 3 }}>
          <TextField
            autoFocus
            name="programName"
            label="Program Name"
            placeholder="Enter program name"
            type="text"
            fullWidth
            variant="outlined"
            value={newProgram.programName}
            onChange={handleNameChange}
            sx={{ mb: 3, mt: 1 }}
            InputProps={{
              sx: { borderRadius: 1.5 },
            }}
          />

          {/* Program Levels Section */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
              Program Levels
            </Typography>

            <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
              <TextField
                name="programLevel"
                placeholder="Enter a program level and press Enter"
                type="text"
                fullWidth
                variant="outlined"
                value={tempLevel}
                onChange={handleLevelChange}
                onKeyPress={handleKeyPress}
                InputProps={{
                  sx: { borderRadius: 1.5 },
                }}
              />
              <Button
                variant="outlined"
                onClick={handleAddLevel}
                sx={{
                  borderRadius: 1.5,
                  whiteSpace: "nowrap",
                  px: 2,
                }}
              >
                Add Level
              </Button>
            </Box>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {newProgram.programLevel.length > 0 ? (
                newProgram.programLevel.map((level, index) => (
                  <Chip
                    key={index}
                    label={level}
                    onDelete={() => handleDeleteLevel(level)}
                    sx={{
                      borderRadius: 1,
                      backgroundColor: "rgba(100, 43, 143, 0.1)",
                      color: "primary.main",
                    }}
                  />
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No program levels added yet
                </Typography>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 3, borderTop: "1px solid #eaeaea" }}>
          <Button
            onClick={handleClose}
            sx={{
              color: "text.secondary",
              fontWeight: 600,
              px: 3,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={editMode ? handleUpdateProgram : handleAddProgram}
            variant="contained"
            disabled={
              !newProgram.programName ||
              newProgram.programLevel.length === 0 ||
              loading
            }
            sx={{
              borderRadius: 1.5,
              px: 3,
              py: 1,
              fontWeight: 600,
              textTransform: "none",
            }}
          >
            {loading
              ? editMode
                ? "Updating..."
                : "Adding..."
              : editMode
              ? "Update Program"
              : "Add Program"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          sx: {
            borderRadius: 2,
            px: 1,
          },
        }}
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{
            fontSize: 20,
            fontWeight: 700,
            py: 2,
            color: "error.main",
          }}
        >
          Delete Program
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            sx={{ color: "text.primary" }}
          >
            Are you sure you want to delete the program "
            {selectedProgram?.programName}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={handleDeleteDialogClose}
            sx={{ color: "text.secondary", fontWeight: 500 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteProgram}
            variant="contained"
            color="error"
            disabled={loading}
            sx={{
              borderRadius: 1.5,
              fontWeight: 600,
              textTransform: "none",
            }}
            autoFocus
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={handleToastClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleToastClose}
          severity={toast.severity}
          sx={{
            width: "100%",
            fontWeight: 500,
            borderRadius: 2,
            boxShadow: "0px 3px 8px rgba(0, 0, 0, 0.1)",
          }}
          variant="filled"
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default ProgramListing;
