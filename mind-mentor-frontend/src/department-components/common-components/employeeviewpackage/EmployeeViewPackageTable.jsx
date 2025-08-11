import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Button,
  Alert,
  Snackbar,
  createTheme,
  ThemeProvider,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import { DataGrid, GridActionsCellItem, GridToolbar } from "@mui/x-data-grid";
import {
  Edit,
  Visibility,
  Person,
  School,
  LocationOn,
} from "@mui/icons-material";
import {
  employeeUpdatePackageData,
  getAllPaidPackageData,
  getPhysicalCenterData,
} from "../../../api/service/employee/EmployeeService";

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
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          backgroundColor: "#642b8f",
          color: "#FFFFFF",
          padding: "16px 24px",
        },
      },
    },
  },
});

const EmployeeViewPackageTable = () => {
  const { enqId } = useParams();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editPackage, setEditPackage] = useState(null);
  const [centers, setCenters] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const classModes = ["online", "offline", "hybrid"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getAllPaidPackageData(enqId);

        if (response?.status === 200) {
          setRows(
            response.data.data.map((pkg, index) => ({
              id: pkg._id || `pkg-${index}`,
              slNo: index + 1,
              kidName: pkg.kidName || "N/A",
              selectedProgram: pkg.selectedProgram || "N/A",
              selectedLevel: pkg.selectedLevel || "N/A",
              classMode: pkg.classMode || "N/A",
              selectedPackage: pkg.selectedPackage || "N/A",
              timePreference: pkg.time || "day",
              onlineClasses: pkg.onlineClasses || 0,
              offlineClasses: pkg.offlineClasses || 0,
              baseAmount: pkg.baseAmount || 0,
              discount: pkg.discount || 0,
              totalAmount: pkg.totalAmount || 0,
              paymentId: pkg.paymentId || "N/A",
              paymentStatus: pkg.paymentStatus || "Pending",
              isPackageActive: pkg.isPackageActive || false,
              isClassAdded: pkg.isClassAdded || false,
              centerId: pkg.centerId || "",
              centerName: pkg.centerName || "N/A",
              createdAt: pkg.createdAt
                ? new Date(pkg.createdAt).toLocaleDateString()
                : "N/A",
              originalData: pkg,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching package data:", error);
        setSnackbar({
          open: true,
          message: "Failed to load package data",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    if (enqId) {
      fetchData();
    }
  }, [enqId]);

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const response = await getPhysicalCenterData();
        if (response?.status === 200) {
          setCenters(response.data.data || []);
        }
      } catch (error) {
        console.error("Error fetching centers:", error);
      }
    };
    fetchCenters();
  }, []);

  const handleView = (pkg) => {
    setSelectedPackage(pkg);
    setOpenViewDialog(true);
  };

  const handleEdit = (pkg) => {
    setEditPackage(pkg);
    setOpenEditDialog(true);
  };

  const handleUpdatePackage = async (updatedData) => {
    try {
      setLoading(true);

      console.log("Data being sent to backend:", updatedData);
      const updatePackageData = await employeeUpdatePackageData(
        enqId,
        updatedData
      );

      if (updatePackageData.status === 200) {
        setRows(
          rows.map((row) => {
            if (row.id === updatedData.id) {
              return {
                ...row,
                classMode: updatedData.classMode,
                selectedPackage: updatedData.selectedPackage,
                onlineClasses: updatedData.onlineClasses,
                offlineClasses: updatedData.offlineClasses,
                timePreference: updatedData.timePreference,
                centerId: updatedData.centerId,
                centerName: updatedData.centerName,
              };
            }
            return row;
          })
        );
        if (selectedPackage && selectedPackage.id === updatedData.id) {
          setSelectedPackage((prev) => ({
            ...prev,
            classMode: updatedData.classMode,
            selectedPackage: updatedData.selectedPackage,
            onlineClasses: updatedData.onlineClasses,
            offlineClasses: updatedData.offlineClasses,
            timePreference: updatedData.timePreference,
            centerId: updatedData.centerId,
            centerName: updatedData.centerName,
          }));
        }

        setSnackbar({
          open: true,
          message: "Package updated successfully",
          severity: "success",
        });
      }
    } catch (error) {
      console.error("Error updating package:", error);
      setSnackbar({
        open: true,
        message: "Failed to update package",
        severity: "error",
      });
    } finally {
      setLoading(false);
      setOpenEditDialog(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleRowClick = (params) => {
    handleView(params.row);
  };

  const columns = [
    {
      field: "slNo",
      headerName: "Sl No",
      width: 70,
    },
    {
      field: "kidName",
      headerName: "Student Name",
      flex: 1.2,
      minWidth: 150,
      renderCell: (params) => (
        <Box display="flex" alignItems="center" gap={1}>
          <Person fontSize="small" color="primary" />
          {params.value}
        </Box>
      ),
    },
    {
      field: "selectedProgram",
      headerName: "Program",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "selectedLevel",
      headerName: "Level",
      flex: 1.2,
      minWidth: 150,
    },
    {
      field: "classMode",
      headerName: "Mode",
      flex: 0.8,
      minWidth: 100,
      renderCell: (params) => (
        <Chip
          label={params.value?.charAt(0).toUpperCase() + params.value?.slice(1)}
          color={
            params.value === "online"
              ? "info"
              : params.value === "offline"
              ? "success"
              : "warning"
          }
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      field: "onlineClasses",
      headerName: "Online Classes",
      flex: 0.8,
      minWidth: 110,
    },
    {
      field: "offlineClasses",
      headerName: "Offline Classes",
      flex: 0.8,
      minWidth: 110,
    },

    {
      field: "totalAmount",
      headerName: "Total Amount",
      flex: 1,
      minWidth: 120,
      renderCell: (params) =>
        params.value ? `₹${params.value.toLocaleString()}` : "₹0",
    },
    {
      field: "paymentStatus",
      headerName: "Payment Status",
      flex: 1,
      minWidth: 130,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={
            params.value === "Success"
              ? "success"
              : params.value === "Pending"
              ? "warning"
              : params.value === "Failed"
              ? "error"
              : "default"
          }
          size="small"
        />
      ),
    },
    {
      field: "isPackageActive",
      headerName: "Active",
      flex: 0.7,
      minWidth: 80,
      renderCell: (params) => (
        <Chip
          label={params.value ? "Yes" : "No"}
          color={params.value ? "success" : "default"}
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      field: "createdAt",
      headerName: "Created Date",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <Typography variant="body2">{params.value}</Typography>
      ),
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      flex: 1,
      minWidth: 120,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<Visibility />}
          label="View"
          onClick={(e) => {
            e.stopPropagation();
            handleView(params.row);
          }}
        />,
        <GridActionsCellItem
          icon={<Edit />}
          label="Edit"
          onClick={(e) => {
            e.stopPropagation();
            handleEdit(params.row);
          }}
        />,
      ],
    },
  ];

  const PackageViewDialog = ({ open, onClose, packageData }) => {
    if (!packageData || !open) return null;

    const getCenterName = (centerId) => {
      const center = centers.find((c) => c._id === centerId);
      return center ? center.centerName : "N/A";
    };

    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Package Details - {packageData.kidName}</DialogTitle>
        <DialogContent dividers sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary">
                    Student Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Student Name
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {packageData.kidName}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Payment ID
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {packageData.paymentId}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary">
                    Program Details
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Program
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {packageData.selectedProgram}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Level
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {packageData.selectedLevel}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Package
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {packageData.selectedPackage}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Class Mode
                      </Typography>
                      <Chip
                        label={
                          packageData.classMode?.charAt(0).toUpperCase() +
                          packageData.classMode?.slice(1)
                        }
                        color={
                          packageData.classMode === "online"
                            ? "info"
                            : packageData.classMode === "offline"
                            ? "success"
                            : "warning"
                        }
                        size="small"
                      />
                    </Grid>
                    {(packageData.classMode === "offline" ||
                      packageData.classMode === "hybrid" ||
                      packageData.classMode === "online") && (
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="textSecondary">
                          Center
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          {getCenterName(packageData.centerId)}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary">
                    Class Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Online Classes
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {packageData.onlineClasses}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Offline Classes
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {packageData.offlineClasses}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Classes Added
                      </Typography>
                      <Chip
                        label={packageData.isClassAdded ? "Yes" : "No"}
                        color={packageData.isClassAdded ? "success" : "default"}
                        size="small"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary">
                    Payment Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={3}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Base Amount
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        ₹{packageData.baseAmount?.toLocaleString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Discount
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        ₹{packageData.discount?.toLocaleString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Total Amount
                      </Typography>
                      <Typography
                        variant="body1"
                        gutterBottom
                        fontWeight="bold"
                      >
                        ₹{packageData.totalAmount?.toLocaleString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Payment Status
                      </Typography>
                      <Chip
                        label={packageData.paymentStatus}
                        color={
                          packageData.paymentStatus === "Success"
                            ? "success"
                            : packageData.paymentStatus === "Pending"
                            ? "warning"
                            : "error"
                        }
                        size="small"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Close
          </Button>
          <Button
            onClick={() => {
              onClose();
              handleEdit(packageData);
            }}
            color="primary"
            variant="contained"
          >
            Edit Package
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const PackageEditDialog = ({
    open,
    onClose,
    packageData,
    onUpdate,
    loading,
  }) => {
    const [localPackageData, setLocalPackageData] = useState({});

    useEffect(() => {
      if (packageData && open) {
        setLocalPackageData({ ...packageData });
      }
    }, [packageData, open]);

    if (!open) return null;

    const handleChange = (field, value) => {
      setLocalPackageData((prev) => {
        const updatedData = {
          ...prev,
          [field]: value,
        };

        // Handle class mode changes and update package name
        if (field === "classMode") {
          if (value === "online") {
            updatedData.offlineClasses = 0;
            updatedData.timePreference = "day"; // Reset to day for online
            updatedData.selectedPackage = `Custom online Package (day)`;
            // Set to online center if available
            const onlineCenter = centers.find(
              (center) => center.centerType === "online"
            );
            if (onlineCenter) {
              updatedData.centerId = onlineCenter._id;
              updatedData.centerName = onlineCenter.centerName;
            } else {
              updatedData.centerId = "";
              updatedData.centerName = "";
            }
          } else if (value === "offline") {
            updatedData.onlineClasses = 0;
            updatedData.timePreference = "day"; // Only day for offline
            updatedData.selectedPackage = `Custom offline Package (day)`;
            // Set to first offline center if available
            const offlineCenter = centers.find(
              (center) => center.centerType === "offline"
            );
            if (offlineCenter) {
              updatedData.centerId = offlineCenter._id;
              updatedData.centerName = offlineCenter.centerName;
            }
          } else if (value === "hybrid") {
            updatedData.selectedPackage = `Custom hybrid Package (${
              updatedData.timePreference || "day"
            })`;
            // Set to first offline center if available (hybrid needs physical location)
            const offlineCenter = centers.find(
              (center) => center.centerType === "offline"
            );
            if (offlineCenter && !updatedData.centerId) {
              updatedData.centerId = offlineCenter._id;
              updatedData.centerName = offlineCenter.centerName;
            }
          }
        }

        // Handle time preference changes and update package name (only for online/hybrid)
        if (field === "timePreference") {
          const mode = updatedData.classMode || "online";
          if (mode === "offline") {
            // Don't allow changing time preference for offline
            return prev;
          }
          updatedData.selectedPackage = `Custom ${mode} Package (${value})`;
        }

        // Handle center selection
        if (field === "centerId") {
          const selectedCenter = centers.find((center) => center._id === value);
          updatedData.centerName = selectedCenter
            ? selectedCenter.centerName
            : "";
        }

        return updatedData;
      });
    };

    const handleSubmit = () => {
      // Prepare data for backend
      const dataToSend = {
        ...localPackageData.originalData, // Include original data structure
        selectedLevel: localPackageData.selectedLevel,
        classMode: localPackageData.classMode,
        selectedPackage: localPackageData.selectedPackage,
        onlineClasses: localPackageData.onlineClasses,
        offlineClasses: localPackageData.offlineClasses,
        discount: localPackageData.discount,
        totalAmount: localPackageData.totalAmount,
        paymentStatus: localPackageData.paymentStatus,
        isPackageActive: localPackageData.isPackageActive,
        timePreference: localPackageData.timePreference,
        centerId: localPackageData.centerId,
        centerName: localPackageData.centerName,
      };

      onUpdate(dataToSend);
    };

    const shouldShowTimePreference = localPackageData.classMode !== "offline";
    const shouldShowCenterSelection =
      localPackageData.classMode === "offline" ||
      localPackageData.classMode === "hybrid" ||
      localPackageData.classMode === "online";

    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Edit Package - {localPackageData.kidName}</DialogTitle>
        <DialogContent dividers sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Class Mode</InputLabel>
                <Select
                  value={localPackageData.classMode || ""}
                  onChange={(e) => handleChange("classMode", e.target.value)}
                  label="Class Mode"
                >
                  {classModes.map((mode) => (
                    <MenuItem key={mode} value={mode}>
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {shouldShowTimePreference && (
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Time Preference</InputLabel>
                  <Select
                    value={localPackageData.timePreference || "day"}
                    onChange={(e) =>
                      handleChange("timePreference", e.target.value)
                    }
                    label="Time Preference"
                  >
                    <MenuItem value="day">Day</MenuItem>
                    <MenuItem value="night">Night</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}

            {shouldShowCenterSelection && (
              <Grid item xs={12} md={shouldShowTimePreference ? 12 : 6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Center</InputLabel>
                  <Select
                    value={localPackageData.centerId || ""}
                    onChange={(e) => handleChange("centerId", e.target.value)}
                    label="Center"
                    required
                  >
                    {centers
                      .filter((center) => {
                        // For online mode: show only online centers
                        if (localPackageData.classMode === "online") {
                          return center.centerType === "online";
                        }
                        // For offline mode: show only offline centers
                        if (localPackageData.classMode === "offline") {
                          return center.centerType === "offline";
                        }
                        // For hybrid mode: show only offline centers (since hybrid needs physical location)
                        if (localPackageData.classMode === "hybrid") {
                          return center.centerType === "offline";
                        }
                        return true;
                      })
                      .map((center) => (
                        <MenuItem key={center._id} value={center._id}>
                          {center.centerName}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
            )}

            <Grid item xs={12}>
              <TextField
                label="Package Name"
                value={localPackageData.selectedPackage || ""}
                fullWidth
                margin="normal"
                disabled
                sx={{
                  "& .MuiInputBase-input.Mui-disabled": {
                    WebkitTextFillColor: "#1976d2",
                    fontWeight: 500,
                  },
                }}
              />
            </Grid>

            {/* Conditional rendering based on class mode */}
            {(localPackageData.classMode === "online" ||
              localPackageData.classMode === "hybrid") && (
              <Grid item xs={12} md={6}>
                <TextField
                  label="Online Classes"
                  type="number"
                  value={localPackageData.onlineClasses || ""}
                  onChange={(e) =>
                    handleChange("onlineClasses", parseInt(e.target.value) || 0)
                  }
                  fullWidth
                  margin="normal"
                  required
                  InputProps={{
                    inputProps: { min: 0 },
                  }}
                />
              </Grid>
            )}

            {(localPackageData.classMode === "offline" ||
              localPackageData.classMode === "hybrid") && (
              <Grid item xs={12} md={6}>
                <TextField
                  label="Offline Classes"
                  type="number"
                  value={localPackageData.offlineClasses || ""}
                  onChange={(e) =>
                    handleChange(
                      "offlineClasses",
                      parseInt(e.target.value) || 0
                    )
                  }
                  fullWidth
                  margin="normal"
                  required
                  InputProps={{
                    inputProps: { min: 0 },
                  }}
                />
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary" disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            color="primary"
            variant="contained"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Package"}
          </Button>
        </DialogActions>
      </Dialog>
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
          <Box
            mb={3}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              variant="h5"
              gutterBottom
              sx={{ color: "#642b8f", fontWeight: 600, mb: 0 }}
            >
              Student Package Management
            </Typography>
            <Box display="flex" alignItems="center" gap={2}>
              <Chip
                icon={<School />}
                label={`Enquiry ID: ${enqId}`}
                color="primary"
                variant="outlined"
              />
            </Box>
          </Box>

          <DataGrid
            rows={rows}
            columns={columns}
            autoHeight
            disableRowSelectionOnClick
            onRowClick={handleRowClick}
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
              },
            }}
            loading={loading}
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
            }}
          />
        </Paper>

        <PackageViewDialog
          open={openViewDialog}
          onClose={() => setOpenViewDialog(false)}
          packageData={selectedPackage}
        />

        <PackageEditDialog
          open={openEditDialog}
          onClose={() => setOpenEditDialog(false)}
          packageData={editPackage}
          onUpdate={handleUpdatePackage}
          loading={loading}
        />

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default EmployeeViewPackageTable;
