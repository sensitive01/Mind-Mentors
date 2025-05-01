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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Checkbox,
  ListItemText,
  Divider,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { ArrowBack } from "@mui/icons-material";
import {
  adminAddNewProgramme,
  fetchPhycicalCenterData,
  getAllProgrameData,
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

// Enhanced columns with better formatting
const columns = [
  {
    field: "sno",
    headerName: "SNo",
    width: 70,
    headerAlign: "center",
    align: "center",
    sortable: true,
  },
  {
    field: "programName",
    headerName: "Program Name",
    flex: 1,
    minWidth: 180,
    headerAlign: "left",
    align: "left",
    renderCell: (params) => (
      <Typography
        variant="body2"
        sx={{ fontWeight: 600, color: "text.primary" }}
      >
        {params.value || "-"}
      </Typography>
    ),
  },
  {
    field: "programLevel",
    headerName: "Program Levels",
    flex: 1.5,
    minWidth: 250,
    headerAlign: "left",
    renderCell: (params) => {
      if (!params || !params.value || params.value.length === 0) {
        return "-";
      }

      const levels = Array.isArray(params.value) ? params.value : [];

      return (
        <Box
          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, maxWidth: "100%" }}
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
                maxWidth: "100%",
                "& .MuiChip-label": {
                  padding: "0px 8px",
                  whiteSpace: "normal",
                  textOverflow: "ellipsis",
                },
              }}
            />
          ))}
        </Box>
      );
    },
  },
  {
    field: "physicalCenters",
    headerName: "Physical Centers",
    flex: 1.5,
    minWidth: 250,
    headerAlign: "left",
    renderCell: (params) => {
      // Handle both physicalCenters and physicalCenter properties
      let centers = [];

      if (params.value && Array.isArray(params.value)) {
        centers = params.value;
      } else if (
        params.row.physicalCenter &&
        Array.isArray(params.row.physicalCenter)
      ) {
        centers = params.row.physicalCenter;
      }

      if (centers.length === 0) {
        return "-";
      }

      return (
        <Box
          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, maxWidth: "100%" }}
        >
          {centers.map((center, index) => (
            <Chip
              key={index}
              label={center.centerName || "Unknown Center"}
              size="small"
              sx={{
                borderRadius: 1,
                backgroundColor: "rgba(0, 128, 128, 0.1)",
                color: "teal",
                fontSize: "0.75rem",
                height: "22px",
                maxWidth: "100%",
                "& .MuiChip-label": {
                  padding: "0px 8px",
                  whiteSpace: "normal",
                  textOverflow: "ellipsis",
                },
              }}
            />
          ))}
        </Box>
      );
    },
  },
];

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const ProgramListing = () => {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [newProgram, setNewProgram] = useState({
    programName: "",
    programLevel: [],
    physicalCenters: [],
  });
  const [tempLevel, setTempLevel] = useState("");
  const [loading, setLoading] = useState(false);
  const [centers, setCenters] = useState([]);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchPhysicalCenter = async () => {
    try {
      const response = await fetchPhycicalCenterData();
      const validCenters = response?.data?.physicalCenters?.filter(
        (item) => item.centerName && item._id
      );
      setCenters(validCenters || []);
    } catch (error) {
      console.error("Error fetching physical centers:", error);
      setToast({
        open: true,
        message: "Error loading physical centers. Please try again.",
        severity: "error",
      });
    }
  };

  const fetchProgramData = async () => {
    try {
      setLoading(true);
      const response = await getAllProgrameData();

      if (response && response.status === 200) {
        const processedRows = response.data.programs.map((program, index) => ({
          ...program,
          sno: index + 1,
          // Ensure data consistency by mapping physicalCenter to physicalCenters if needed
          physicalCenters:
            program.physicalCenters || program.physicalCenter || [],
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
    fetchPhysicalCenter();
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewProgram({ programName: "", programLevel: [], physicalCenters: [] });
    setTempLevel("");
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

  const handleCenterChange = (event) => {
    const {
      target: { value },
    } = event;

    // On autofill we get a stringified value.
    const selectedCenters =
      typeof value === "string" ? value.split(",") : value;

    setNewProgram({
      ...newProgram,
      physicalCenters: selectedCenters,
    });
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
    if (
      newProgram.programName &&
      newProgram.programLevel.length > 0 &&
      newProgram.physicalCenters.length > 0
    ) {
      try {
        setLoading(true);

        const programData = {
          programName: newProgram.programName,
          programLevel: [...newProgram.programLevel],
          physicalCenters: [...newProgram.physicalCenters],
        };

        const response = await adminAddNewProgramme(programData);

        // Fixed toast message display
        if (response && (response.status === 200 || response.success)) {
          await fetchProgramData();

          // Ensure dialog closes first
          handleClose();

          // Then show the toast message
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
        message:
          "Please enter program name, at least one level, and select at least one center",
        severity: "warning",
      });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          width: "100%",
          height: "100vh",
          p: 4,
          backgroundColor: "#f5f5f5",
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
            }}
            pageSizeOptions={[5, 10, 25]}
            sx={{
              height: "calc(100% - 80px)",
              minHeight: "500px",
              border: "none",
              borderRadius: 2,
              "& .MuiDataGrid-main": {
                borderRadius: 2,
                backgroundColor: "#ffffff",
              },
              "& .MuiDataGrid-cell": {
                borderColor: "#f0f0f0",
                py: 1.5,
              },
              "& .MuiDataGrid-cell:focus": {
                outline: "none",
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "rgba(100, 43, 143, 0.04)",
              },
              "& .MuiDataGrid-row": {
                fontSize: "14px",
              },
              "& .MuiDataGrid-columnHeader": {
                backgroundColor: "#642b8f",
                color: "white",
                fontWeight: 600,
                height: "60px",
              },
              "& .MuiDataGrid-footerContainer": {
                borderTop: "1px solid #eaeaea",
              },
              "& .MuiToolbar-root": {
                padding: 2,
              },
              "& .MuiDataGrid-virtualScroller": {
                minHeight: "200px", // Ensures minimum height even with few rows
              },
              "& .MuiDataGrid-overlay": {
                backgroundColor: "rgba(255, 255, 255, 0.8)",
              },
            }}
          />
        </Paper>
      </Box>

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
          Add New Program
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

          <Divider sx={{ my: 2 }} />

          {/* Physical Centers Section */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
              Physical Centers
            </Typography>

            <FormControl fullWidth sx={{ borderRadius: 1.5 }}>
              <InputLabel id="physical-centers-label">
                Select Physical Centers
              </InputLabel>
              <Select
                labelId="physical-centers-label"
                id="physical-centers"
                multiple
                value={newProgram.physicalCenters}
                onChange={handleCenterChange}
                input={<OutlinedInput label="Select Physical Centers" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => {
                      const centerName =
                        centers.find((center) => center._id === value)
                          ?.centerName || value;
                      return (
                        <Chip
                          key={value}
                          label={centerName}
                          sx={{
                            borderRadius: 1,
                            backgroundColor: "rgba(0, 128, 128, 0.1)",
                            color: "teal",
                          }}
                        />
                      );
                    })}
                  </Box>
                )}
                MenuProps={MenuProps}
                sx={{ borderRadius: 1.5 }}
              >
                {centers.map((center) => (
                  <MenuItem key={center._id} value={center._id}>
                    <Checkbox
                      checked={
                        newProgram.physicalCenters.indexOf(center._id) > -1
                      }
                    />
                    <ListItemText primary={center.centerName} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {centers.length === 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                No physical centers available
              </Typography>
            )}
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
            onClick={handleAddProgram}
            variant="contained"
            disabled={
              !newProgram.programName ||
              newProgram.programLevel.length === 0 ||
              newProgram.physicalCenters.length === 0 ||
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
            {loading ? "Adding..." : "Add Program"}
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
