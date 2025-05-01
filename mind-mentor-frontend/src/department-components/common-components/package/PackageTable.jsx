import {
  Delete,
  Edit,
  Visibility,
  LocationOn,
  School,
} from "@mui/icons-material";
import {
  Box,
  Button,
  createTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  ThemeProvider,
  Typography,
  Tab,
  Tabs,
  TextField,
  Grid,
  CircularProgress,
  Alert,
  Snackbar,
  Divider,
  Card,
  CardContent,
  InputAdornment,
  IconButton,
  Chip,
} from "@mui/material";
import { DataGrid, GridActionsCellItem, GridToolbar } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getPackageData,
  getPhycicalCenterData,
} from "../../../api/service/employee/EmployeeService";

// Import these new service functions - you'll need to implement them in your API service
// import {
//   getClassPricing,
//   updateClassPricing
// } from "../../../api/service/employee/EmployeeService";

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

// Custom TabPanel component for the tabbed interface
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`class-tabpanel-${index}`}
      aria-labelledby={`class-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const PackageTable = () => {
  const [rows, setRows] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);

  // New state variables for pricing dialog
  const [openPricingDialog, setOpenPricingDialog] = useState(false);
  const [tabValue, setTabValue] = useState(0);
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

  // Fetch physical centers
  useEffect(() => {
    const fetchCenters = async () => {
      try {
        setLoading(true);
        const response = await getPhycicalCenterData();
        if (response.status === 200) {
          // Filter only centers that have valid center names
          const validCenters = response?.data?.physicalCenters?.filter(
            (item) => item.centerName && item._id
          );

          // Transform the data to include id and name properties for easier use
          const formattedCenters = validCenters.map((center) => ({
            id: center._id,
            name: center.centerName,
            // Include any other relevant center data
            location: center.address || "N/A",
            // You can add more properties if needed
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
    const fetchPackages = async () => {
      try {
        setLoading(true);
        const response = await getPackageData();

        if (response.status === 200) {
          // Transform the data to match the grid's structure
          setRows(
            response.data.packagesData.map((pkg, index) => ({
              id: pkg._id,
              slNo: index + 1,
              packageId: pkg.packageId,
              type: pkg.type,
              packageName: pkg.packageName,
              description: pkg.description || "",
              onlineClasses: pkg.onlineClasses,
              physicalClasses: pkg.physicalClasses,
              centerName: pkg.centerName || "",
              centerId: pkg.centerId || "",
              // Extract pricing fields
              pricingAmount: pkg.pricing.amount,
              pricingTax: pkg.pricing.tax,
              pricingTotal: pkg.pricing.total,
              // Keep original pricing object for reference
              pricing: pkg.pricing,
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

    fetchPackages();
  }, []);

  // Function to fetch class pricing data
  const fetchClassPricing = async () => {
    try {
      setLoading(true);
      // Uncomment and implement when you have the API endpoint
      /*
      const response = await getClassPricing();
      
      if (response.status === 200) {
        const { onlinePrice, centerPrices } = response.data;
        setOnlinePrice(onlinePrice || "");
        
        // Convert array of center prices to an object for easier access
        const centerPriceObj = {};
        centerPrices.forEach(center => {
          centerPriceObj[center.centerId] = center.price;
        });
        
        setCenterPrices(centerPriceObj);
      }
      */

      // Mock data for development - replace with actual API call
      setTimeout(() => {
        setOnlinePrice("500");
        const mockCenterPrices = {};
        existingCenters.forEach((center) => {
          mockCenterPrices[center.id] = Math.floor(Math.random() * 1000) + 500;
        });
        setCenterPrices(mockCenterPrices);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching class pricing:", error);
      setLoading(false);
      setSnackbar({
        open: true,
        message: "Failed to load class pricing data",
        severity: "error",
      });
    }
  };

  const handleSubmitOnlinePrice = async () => {
    try {
      setLoading(true);

      // Uncomment when you have implemented the API function
      /*
      const response = await updateClassPricing({
        type: "online",
        price: parseFloat(onlinePrice)
      });
      
      if (response.status === 200) {
        setSnackbar({
          open: true,
          message: "Online class price updated successfully",
          severity: "success",
        });
      }
      */

      // Mock successful update for development
      setTimeout(() => {
        setLoading(false);
        setSnackbar({
          open: true,
          message: "Online class price updated successfully",
          severity: "success",
        });
      }, 1000);
    } catch (error) {
      console.error("Error updating online price:", error);
      setLoading(false);
      setSnackbar({
        open: true,
        message: "Failed to update online class price",
        severity: "error",
      });
    }
  };

  const handleSubmitCenterPrice = async (centerId) => {
    try {
      setLoading(true);

      // Uncomment when you have implemented the API function
      /*
      const response = await updateClassPricing({
        type: "physical",
        centerId: centerId,
        price: parseFloat(centerPrices[centerId])
      });
      
      if (response.status === 200) {
        setSnackbar({
          open: true,
          message: "Center price updated successfully",
          severity: "success",
        });
      }
      */

      // Mock successful update for development
      setTimeout(() => {
        setLoading(false);
        setSnackbar({
          open: true,
          message: "Center price updated successfully",
          severity: "success",
        });
      }, 1000);
    } catch (error) {
      console.error("Error updating center price:", error);
      setLoading(false);
      setSnackbar({
        open: true,
        message: "Failed to update center price",
        severity: "error",
      });
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
      // Uncomment and replace with your actual API call
      // await deletePackage(id);
      setRows(rows.filter((row) => row.id !== id));
      console.log(`Package with ID ${id} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting package:", error);
    }
  };

  const handleView = (pkg) => {
    setSelectedPackage(pkg);
    setOpenViewDialog(true);
  };

  const handleEdit = (id) => {
    console.log(`Editing package with ID: ${id}`);
    // You can add navigation logic here
    // navigate(`/superadmin/department/package-form/${id}`);
  };

  const handleOpenPricingDialog = () => {
    setOpenPricingDialog(true);
    fetchClassPricing();
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
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

  const columns = [
    {
      field: "slNo",
      headerName: "Sl No",
      width: 70,
    },
    {
      field: "packageId",
      headerName: "Package ID",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "type",
      headerName: "Type",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === "Online" ? "info" : "success"}
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
      field: "onlineClasses",
      headerName: "Online Classes",
      flex: 1,
      minWidth: 130,
    },
    {
      field: "physicalClasses",
      headerName: "Physical Classes",
      flex: 1,
      minWidth: 130,
    },
    {
      field: "centerName",
      headerName: "Center",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "pricingTotal",
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
          icon={<Visibility />}
          label="View"
          onClick={() => handleView(params.row)}
        />,
        <GridActionsCellItem
          icon={<Edit />}
          label="Edit"
          onClick={() => handleEdit(params.id)}
        />,
        <GridActionsCellItem
          icon={<Delete />}
          label="Delete"
          onClick={() => handleDelete(params.id)}
        />,
      ],
    },
  ];

  // Find a center name by ID
  const getCenterNameById = (centerId) => {
    const center = existingCenters.find((c) => c.id === centerId);
    return center ? center.name : "N/A";
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
              <Button
                variant="outlined"
                color="primary"
                onClick={handleOpenPricingDialog}
                sx={{ height: 36 }}
                startIcon={<School />}
              >
                Set Class Price
              </Button>
            </Box>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/super-admin/department/add-package-form"
            >
              + Add Package
            </Button>
          </Box>
          <DataGrid
            rows={rows}
            columns={columns}
            autoHeight
            disableRowSelectionOnClick
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
              },
              "& .MuiDataGrid-columnHeader": {
                backgroundColor: "#642b8f",
                color: "white",
                fontWeight: 600,
              },
            }}
          />
        </Paper>

        {/* View Package Dialog - Improved Layout */}
        <Dialog
          open={openViewDialog}
          onClose={() => setOpenViewDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Typography variant="h6" component="div">
              Package Details
            </Typography>
          </DialogTitle>
          <DialogContent dividers>
            {selectedPackage && (
              <Box sx={{ py: 1 }}>
                <Card elevation={0} sx={{ mb: 3, borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                      Basic Information
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body1">
                          <strong>Package ID:</strong>{" "}
                          {selectedPackage.packageId}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body1">
                          <strong>Type:</strong> {selectedPackage.type}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body1">
                          <strong>Package Name:</strong>{" "}
                          {selectedPackage.packageName}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body1">
                          <strong>Center Name:</strong>{" "}
                          {selectedPackage.centerName || "N/A"}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                <Card elevation={0} sx={{ mb: 3, borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                      Classes Information
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Box display="flex" alignItems="center">
                          <School color="primary" sx={{ mr: 1 }} />
                          <Typography variant="body1">
                            <strong>Online Classes:</strong>{" "}
                            {selectedPackage.onlineClasses}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box display="flex" alignItems="center">
                          <LocationOn color="primary" sx={{ mr: 1 }} />
                          <Typography variant="body1">
                            <strong>Physical Classes:</strong>{" "}
                            {selectedPackage.physicalClasses}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                <Card elevation={0} sx={{ mb: 3, borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                      Pricing Information
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="body1">
                          <strong>Amount:</strong> ₹
                          {selectedPackage.pricingAmount
                            ? selectedPackage.pricingAmount.toLocaleString()
                            : "0"}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="body1">
                          <strong>Tax:</strong> ₹
                          {selectedPackage.pricingTax
                            ? selectedPackage.pricingTax.toLocaleString()
                            : "0"}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography
                          variant="body1"
                          sx={{ fontWeight: "bold", color: "primary.main" }}
                        >
                          <strong>Total Price:</strong> ₹
                          {selectedPackage.pricingTotal
                            ? selectedPackage.pricingTotal.toLocaleString()
                            : "0"}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                <Card elevation={0} sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                      Description
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    <Typography variant="body1" sx={{ mt: 1 }}>
                      {selectedPackage.description ||
                        "No description available"}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button
              onClick={() => setOpenViewDialog(false)}
              variant="contained"
              color="primary"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Set Class Price Dialog - Improved Layout */}
        <Dialog
          open={openPricingDialog}
          onClose={() => setOpenPricingDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Typography variant="h6" component="div">
              Set Class Price
            </Typography>
          </DialogTitle>
          <DialogContent dividers>
            <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="class type tabs"
                variant="fullWidth"
                textColor="primary"
                indicatorColor="primary"
              >
                <Tab
                  label="Online Classes"
                  id="class-tab-0"
                  aria-controls="class-tabpanel-0"
                  icon={<School />}
                  iconPosition="start"
                />
                <Tab
                  label="Physical Center Classes"
                  id="class-tab-1"
                  aria-controls="class-tabpanel-1"
                  icon={<LocationOn />}
                  iconPosition="start"
                />
              </Tabs>
            </Box>

            {/* Online Classes Tab */}
            <TabPanel value={tabValue} index={0}>
              <Card elevation={1} sx={{ p: 2, borderRadius: 2, mb: 2 }}>
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Online Class Pricing
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Set the standard price for all online classes (including
                    GST)
                  </Typography>
                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ display: "flex", alignItems: "center", mt: 3 }}>
                    <TextField
                      label="Price"
                      type="number"
                      value={onlinePrice}
                      onChange={(e) => setOnlinePrice(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">₹</InputAdornment>
                        ),
                      }}
                      sx={{ width: 250, mr: 2 }}
                      variant="outlined"
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSubmitOnlinePrice}
                      disabled={loading || !onlinePrice}
                      sx={{ height: 56 }}
                    >
                      {loading ? (
                        <CircularProgress size={24} />
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </TabPanel>

            {/* Physical Centers Tab */}
            <TabPanel value={tabValue} index={1}>
              <Box sx={{ p: 1 }}>
                <Typography variant="h6" color="primary" gutterBottom>
                  Physical Center Class Pricing
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Set individual pricing for each physical center location
                  (including GST)
                </Typography>
                <Divider sx={{ mb: 3 }} />

                {loading ? (
                  <Box
                    sx={{ display: "flex", justifyContent: "center", my: 4 }}
                  >
                    <CircularProgress />
                  </Box>
                ) : (
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    {existingCenters.length > 0 ? (
                      existingCenters.map((center) => (
                        <Grid item xs={12} key={center.id}>
                          <Card
                            elevation={1}
                            sx={{
                              borderRadius: 2,
                              transition: "all 0.3s",
                              "&:hover": {
                                boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)",
                              },
                            }}
                          >
                            <CardContent>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  flexWrap: "wrap",
                                  gap: 2,
                                }}
                              >
                                <Box>
                                  <Typography
                                    variant="h6"
                                    sx={{ fontWeight: 500, mb: 0.5 }}
                                  >
                                    {center.name}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <LocationOn
                                      fontSize="small"
                                      sx={{ mr: 0.5 }}
                                    />
                                    {center.location ||
                                      "Location not specified"}
                                  </Typography>
                                </Box>

                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                  }}
                                >
                                  <TextField
                                    label="Price "
                                    type="number"
                                    value={centerPrices[center.id] || ""}
                                    onChange={(e) =>
                                      handleCenterPriceChange(
                                        center.id,
                                        e.target.value
                                      )
                                    }
                                    InputProps={{
                                      startAdornment: (
                                        <InputAdornment position="start">
                                          ₹
                                        </InputAdornment>
                                      ),
                                    }}
                                    variant="outlined"
                                    size="small"
                                    sx={{ width: 180 }}
                                  />
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() =>
                                      handleSubmitCenterPrice(center.id)
                                    }
                                    disabled={
                                      loading || !centerPrices[center.id]
                                    }
                                    size="medium"
                                  >
                                    {loading ? (
                                      <CircularProgress size={20} />
                                    ) : (
                                      "Save"
                                    )}
                                  </Button>
                                </Box>
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))
                    ) : (
                      <Grid item xs={12}>
                        <Alert
                          severity="info"
                          variant="outlined"
                          sx={{ borderRadius: 2 }}
                        >
                          No physical centers found. Please add physical centers
                          first to set pricing.
                        </Alert>
                      </Grid>
                    )}
                  </Grid>
                )}
              </Box>
            </TabPanel>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button
              onClick={() => setOpenPricingDialog(false)}
              variant="outlined"
              color="primary"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
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
