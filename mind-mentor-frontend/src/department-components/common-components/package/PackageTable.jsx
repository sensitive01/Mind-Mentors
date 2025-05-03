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
  Paper,
  ThemeProvider,
  Typography,
  CircularProgress,
  Alert,
  Snackbar,
  Chip,
} from "@mui/material";
import { DataGrid, GridActionsCellItem, GridToolbar } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getPackageData,
  getPhycicalCenterData,
} from "../../../api/service/employee/EmployeeService";

// Import the new dialog components
import ViewPackageDialog from "./ViewPackagePricingDialog";
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

  // State variables for pricing dialog
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

        {/* Using the extracted ViewPackageDialog component */}
        <ViewPackageDialog
          open={openViewDialog}
          onClose={() => setOpenViewDialog(false)}
          selectedPackage={selectedPackage}
        />

        {/* Using the extracted ClassPricingDialog component */}
        <ClassPricingDialog
          open={openPricingDialog}
          onClose={() => setOpenPricingDialog(false)}
          loading={loading}
          onlinePrice={onlinePrice}
          setOnlinePrice={setOnlinePrice}
          centerPrices={centerPrices}
          handleCenterPriceChange={handleCenterPriceChange}
          existingCenters={existingCenters}
          handleSubmitOnlinePrice={handleSubmitOnlinePrice}
          handleSubmitCenterPrice={handleSubmitCenterPrice}
        />

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
