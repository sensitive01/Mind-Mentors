import { Delete, Edit, Visibility, School } from "@mui/icons-material";
import {
  Box,
  Button,
  createTheme,
  Paper,
  ThemeProvider,
  Typography,
  Alert,
  Snackbar,
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
} from "@mui/material";
import { DataGrid, GridActionsCellItem, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  deletePackageData,
  getPackageData,
  getPhycicalCenterData,
  updatePackageData,
  // deletePackage,
  // updatePackage,
} from "../../../api/service/employee/EmployeeService";

import ClassPricingDialog from "./ClassPricingDialog";

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

const PackageTable = () => {
  const [rows, setRows] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editPackage, setEditPackage] = useState(null);

  const [openPricingDialog, setOpenPricingDialog] = useState(false);
  const [onlinePrice, setOnlinePrice] = useState("");
  const [physicalCenters, setPhysicalCenters] = useState([]);
  const [centerPrices, setCenterPrices] = useState({});
  const [existingCenters, setExistingCenters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const programLevels = [
    "Absolute Beginner",
    "Lower Beginner",
    "Upper Beginner",
    "Intermediate",
    "Advanced",
  ];

  const packageTypes = ["Online", "Offline", "Hybrid", "Kit"];

  const timings = ["Day", "Night"];

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        setLoading(true);
        const response = await getPhycicalCenterData();
        if (response.status === 200) {
          const validCenters = response?.data?.physicalCenters?.filter(
            (item) => item.centerName && item._id
          );

          const formattedCenters = validCenters.map((center) => ({
            id: center._id,
            name: center.centerName,
            location: center.address || "N/A",
          }));

          setExistingCenters(formattedCenters);
          setPhysicalCenters(formattedCenters);
        }
      } catch (error) {
        console.error("Error fetching physical centers:", error);
        setSnackbar({
          open: true,
          message: "Failed to load physical centers",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCenters();
  }, []);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await getPackageData();

      if (response.status === 200) {
        setRows(
          response.data.packagesData.map((pkg, index) => ({
            id: pkg._id || `pkg-${index}`,
            slNo: index + 1,
            packageType: pkg.packageType,
            centerName: pkg.centerName || "N/A",
            packageName: pkg.packageName || "N/A",
            programName: pkg.programName || "N/A",
            programLevel: pkg.programLevel || "N/A",
            classes: pkg.classes || 0,
            amount: pkg.amount || 0,
            time: pkg.time || "N/A",
            mode: pkg.mode || "N/A",
            quantity: pkg.quantity || null,
            kitPrice: pkg.kitPrice || null,
            originalData: pkg,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching packages:", error);
      setSnackbar({
        open: true,
        message: "Failed to load packages",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this package?"
    );

    if (!isConfirmed) {
      return;
    }

    try {
      setLoading(true);
      // Uncomment when ready to use the actual API
      // await deletePackage(id);
      const deletedData = await rows.filter((item)=>item.id===id)
      console.log("deletedData",deletedData)
      const response = await deletePackageData(deletedData)

      // For development without the actual API
      setTimeout(() => {
        setRows(rows.filter((row) => row.id !== id));
        setLoading(false);
        setSnackbar({
          open: true,
          message: "Package deleted successfully",
          severity: "success",
        });
      }, 800);
    } catch (error) {
      console.error("Error deleting package:", error);
      setSnackbar({
        open: true,
        message: "Failed to delete package",
        severity: "error",
      });
      setLoading(false);
    }
  };

  const handleView = (pkg) => {
    setSelectedPackage(pkg);
    setOpenViewDialog(true);
  };

  const handleEdit = (pkg) => {
    setEditPackage({ ...pkg });
    setOpenEditDialog(true);
  };

  const handleUpdatePackage = async (updatedData) => {
    try {
      setLoading(true);
      
      const dataToUpdate = updatedData || editPackage;
      
      const response = await updatePackageData(dataToUpdate);
      
      if (response && response.status === 200) {
        setRows(rows.map((row) => {
          if (row.id === dataToUpdate.id) {
            const updatedRow = {
              ...row,
              programLevel: dataToUpdate.programLevel,
              classes: dataToUpdate.classes,
              amount: dataToUpdate.amount,
              time: dataToUpdate.time,
              quantity: dataToUpdate.quantity,
              kitPrice: dataToUpdate.kitPrice,
              originalData: { ...dataToUpdate }
            };
            return updatedRow;
          }
          return row;
        }));
        
        if (selectedPackage && selectedPackage.id === dataToUpdate.id) {
          setSelectedPackage(prev => ({
            ...prev,
            programLevel: dataToUpdate.programLevel,
            classes: dataToUpdate.classes,
            amount: dataToUpdate.amount,
            time: dataToUpdate.time,
            quantity: dataToUpdate.quantity,
            kitPrice: dataToUpdate.kitPrice,
          }));
        }
        
        setSnackbar({
          open: true,
          message: "Package updated successfully",
          severity: "success",
        });
      } else {
        throw new Error("Failed to update package");
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

  const handleOpenPricingDialog = () => {
    setOpenPricingDialog(true);
  };

  const handleCenterPriceChange = (centerId, value) => {
    setCenterPrices((prev) => ({
      ...prev,
      [centerId]: value,
    }));
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
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
      field: "packageType",
      headerName: "Type",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={
            params.value === "Online"
              ? "info"
              : params.value === "Offline"
              ? "success"
              : params.value === "Hybrid"
              ? "warning"
              : "secondary"
          }
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      field: "packageName",
      headerName: "Package Name",
      flex: 1.5,
      minWidth: 180,
    },
    {
      field: "programName",
      headerName: "Program",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "programLevel",
      headerName: "Level",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "classes",
      headerName: "Classes",
      flex: 0.7,
      minWidth: 80,
    },
    {
      field: "centerName",
      headerName: "Center",
      flex: 1.2,
      minWidth: 160,
    },
    {
      field: "amount",
      headerName: "Price",
      flex: 1,
      minWidth: 100,
      renderCell: (params) =>
        params.value ? `₹${params.value.toLocaleString()}` : "₹0",
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      flex: 1,
      minWidth: 120,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<Edit />}
          label="Edit"
          onClick={(e) => {
            e.stopPropagation();
            handleEdit(params.row);
          }}
        />,
        <GridActionsCellItem
          icon={<Delete />}
          label="Delete"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(params.id);
          }}
        />,
      ],
    },
  ];

  const PackageViewDialog = ({ open, onClose, packageData }) => {
    if (!packageData || !open) return null;

    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ backgroundColor: "#642b8f", color: "white" }}>
          Package Details
        </DialogTitle>
        <DialogContent dividers sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                {packageData.packageName || "Package Information"}
              </Typography>
              <Chip
                label={packageData.packageType}
                color={
                  packageData.packageType === "Online"
                    ? "info"
                    : packageData.packageType === "Offline"
                    ? "success"
                    : packageData.packageType === "Hybrid"
                    ? "warning"
                    : "secondary"
                }
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Package Type
              </Typography>
              <Typography variant="body1" gutterBottom>
                {packageData.packageType}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Package Name
              </Typography>
              <Typography variant="body1" gutterBottom>
                {packageData.packageName || "N/A"}
              </Typography>
            </Grid>

            {/* Program Information */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Program
              </Typography>
              <Typography variant="body1" gutterBottom>
                {packageData.programName || "N/A"}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Program Level
              </Typography>
              <Typography variant="body1" gutterBottom>
                {packageData.programLevel || "N/A"}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Number of Classes
              </Typography>
              <Typography variant="body1" gutterBottom>
                {packageData.classes || "N/A"}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Price
              </Typography>
              <Typography variant="body1" gutterBottom>
                {packageData.amount
                  ? `₹${packageData.amount.toLocaleString()}`
                  : "N/A"}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Center
              </Typography>
              <Typography variant="body1" gutterBottom>
                {packageData.centerName || "N/A"}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Time
              </Typography>
              <Typography variant="body1" gutterBottom>
                {packageData.time || "N/A"}
              </Typography>
            </Grid>

            {packageData.packageType === "Kit" && (
              <>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Quantity
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {packageData.quantity || "N/A"}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Kit Price
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {packageData.kitPrice
                      ? `₹${packageData.kitPrice.toLocaleString()}`
                      : "N/A"}
                  </Typography>
                </Grid>
              </>
            )}

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Mode
              </Typography>
              <Typography variant="body1" gutterBottom>
                {packageData.mode || "N/A"}
              </Typography>
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
            Edit
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
      if (packageData) {
        setLocalPackageData({ ...packageData });
      }
    }, [packageData]);

    if (!open) return null;

    const handleChange = (field, value) => {
      setLocalPackageData((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

    const handleSubmit = () => {
      onUpdate(localPackageData);
    };

    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ backgroundColor: "#642b8f", color: "white" }}>
          Edit Package
        </DialogTitle>
        <DialogContent dividers sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Package Type</InputLabel>
                <Select
                  value={localPackageData.packageType || ""}
                  onChange={(e) => handleChange("packageType", e.target.value)}
                  label="Package Type"
                  disabled
                >
                  {packageTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Package Name"
                value={localPackageData.packageName || ""}
                onChange={(e) => handleChange("packageName", e.target.value)}
                fullWidth
                margin="normal"
                disabled
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Program Name"
                value={localPackageData.programName || ""}
                onChange={(e) => handleChange("programName", e.target.value)}
                fullWidth
                margin="normal"
                disabled
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Program Level</InputLabel>
                <Select
                  value={localPackageData.programLevel || ""}
                  onChange={(e) => handleChange("programLevel", e.target.value)}
                  label="Program Level"
                >
                  {programLevels.map((level) => (
                    <MenuItem key={level} value={level}>
                      {level}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Number of Classes"
                type="number"
                value={localPackageData.classes || ""}
                onChange={(e) =>
                  handleChange("classes", parseInt(e.target.value) || 0)
                }
                fullWidth
                margin="normal"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Price (₹)"
                type="number"
                value={localPackageData.amount || ""}
                onChange={(e) =>
                  handleChange("amount", parseInt(e.target.value) || 0)
                }
                fullWidth
                margin="normal"
                InputProps={{
                  startAdornment: "₹",
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Center Name"
                value={localPackageData.centerName || ""}
                onChange={(e) => handleChange("centerName", e.target.value)}
                fullWidth
                margin="normal"
                disabled
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Time</InputLabel>
                <Select
                  value={localPackageData.time || ""}
                  onChange={(e) => handleChange("time", e.target.value)}
                  label="Time"
                >
                  {timings.map((time) => (
                    <MenuItem key={time} value={time}>
                      {time}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {localPackageData.packageType === "Kit" && (
              <>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Quantity"
                    type="number"
                    value={localPackageData.quantity || ""}
                    onChange={(e) =>
                      handleChange("quantity", parseInt(e.target.value) || 0)
                    }
                    fullWidth
                    margin="normal"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Kit Price (₹)"
                    type="number"
                    value={localPackageData.kitPrice || ""}
                    onChange={(e) =>
                      handleChange("kitPrice", parseInt(e.target.value) || 0)
                    }
                    fullWidth
                    margin="normal"
                    InputProps={{
                      startAdornment: "₹",
                    }}
                  />
                </Grid>
              </>
            )}

            <Grid item xs={12} md={6}>
              <TextField
                label="Mode"
                value={localPackageData.mode || ""}
                onChange={(e) => handleChange("mode", e.target.value)}
                fullWidth
                margin="normal"
                disabled
              />
            </Grid>
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
            {loading ? "Updating..." : "Update"}
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
            <Box display="flex" alignItems="center" gap={2}>
              <Typography
                variant="h5"
                gutterBottom
                sx={{ color: "#642b8f", fontWeight: 600, mb: 0 }}
              >
                Package Management
              </Typography>
            </Box>
              <Button
                variant="contained"
                color="primary"
                onClick={handleOpenPricingDialog}
                sx={{ height: 36 }}
                startIcon={<School />}
              >
                Set Class Price
              </Button>
     
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

        {openPricingDialog && (
          <ClassPricingDialog
            open={openPricingDialog}
            onClose={() => setOpenPricingDialog(false)}
            loading={loading}
            onlinePrice={onlinePrice}
            setOnlinePrice={setOnlinePrice}
            centerPrices={centerPrices}
            handleCenterPriceChange={handleCenterPriceChange}
            existingCenters={existingCenters}
          />
        )}

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

export default PackageTable;