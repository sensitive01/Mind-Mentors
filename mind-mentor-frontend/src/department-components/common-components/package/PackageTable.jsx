import { Delete, Edit, Visibility } from "@mui/icons-material";
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
} from "@mui/material";
import { DataGrid, GridActionsCellItem, GridToolbar } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPackageData } from "../../../api/service/employee/EmployeeService";

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

const PackageTable = () => {
  const [rows, setRows] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
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
      }
    };

    fetchPackages();
  }, []);

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
            <Typography
              variant="h5"
              gutterBottom
              sx={{ color: "#642b8f", fontWeight: 600, mb: 3 }}
            >
              Package Management
            </Typography>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/superadmin/department/add-package-form"
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

        {/* View Package Dialog */}
        <Dialog
          open={openViewDialog}
          onClose={() => setOpenViewDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Package Details</DialogTitle>
          <DialogContent>
            {selectedPackage && (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 2,
                  pt: 2,
                }}
              >
                <Typography>
                  <strong>Package ID:</strong> {selectedPackage.packageId}
                </Typography>
                <Typography>
                  <strong>Type:</strong> {selectedPackage.type}
                </Typography>
                <Typography>
                  <strong>Package Name:</strong> {selectedPackage.packageName}
                </Typography>
                <Typography>
                  <strong>Center Name:</strong>{" "}
                  {selectedPackage.centerName || "N/A"}
                </Typography>
                <Typography>
                  <strong>Online Classes:</strong>{" "}
                  {selectedPackage.onlineClasses}
                </Typography>
                <Typography>
                  <strong>Physical Classes:</strong>{" "}
                  {selectedPackage.physicalClasses}
                </Typography>
                <Typography>
                  <strong>Amount:</strong> ₹
                  {selectedPackage.pricingAmount
                    ? selectedPackage.pricingAmount.toLocaleString()
                    : "0"}
                </Typography>
                <Typography>
                  <strong>Tax:</strong> ₹
                  {selectedPackage.pricingTax
                    ? selectedPackage.pricingTax.toLocaleString()
                    : "0"}
                </Typography>
                <Typography>
                  <strong>Total Price:</strong> ₹
                  {selectedPackage.pricingTotal
                    ? selectedPackage.pricingTotal.toLocaleString()
                    : "0"}
                </Typography>
                <Typography sx={{ gridColumn: "1 / span 2" }}>
                  <strong>Description:</strong>
                  <Box sx={{ mt: 1 }}>
                    {selectedPackage.description || "No description available"}
                  </Box>
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenViewDialog(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default PackageTable;
