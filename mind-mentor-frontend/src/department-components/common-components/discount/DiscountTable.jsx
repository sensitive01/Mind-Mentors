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
import { fetchAllVouchers } from "../../../api/service/employee/EmployeeService";

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

const DiscountTable = () => {
  const [rows, setRows] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        // Replace with your actual API call
        const response = await fetchAllVouchers();
        console.log(response)
        if (response.status===200) {
          setRows(
            response.data.map((voucher,index) => ({
              id: voucher._id,
              slNo: index + 1,

              ...voucher,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching vouchers:", error);
      }
    };

    fetchVouchers();
  }, []);

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this voucher?"
    );

    if (!isConfirmed) {
      return;
    }

    try {
      await deleteVoucher(id);
      setRows(rows.filter((row) => row.id !== id));
      console.log(`Voucher with ID ${id} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting voucher:", error);
    }
  };

  const handleView = (voucher) => {
    setSelectedVoucher(voucher);
    setOpenViewDialog(true);
  };

  const handleEdit = (id) => {
    console.log(`Editing voucher with ID: ${id}`);
  };

  const columns = [
    {
      field: "slNo",
      headerName: "Sl No",
      width: 100,
      renderCell: (params) => params.value,
    },
    {
      field: "voucherId",
      headerName: "Voucher ID",
      flex: 150,
    },
    {
      field: "code",
      headerName: "Code",
      flex: 120,
    },
    {
      field: "mmKidId",
      headerName: "MM Kid ID",
      flex: 120,
    },
    {
      field: "type",
      headerName: "Type",
      flex: 100,
    },
    {
      field: "value",
      headerName: "Value",
      flex: 100,
    },
    {
      field: "condition",
      headerName: "Condition",
      flex: 130,
    },
    {
      field: "slots",
      headerName: "Slots",
      flex: 100,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 100,
    },
    // {
    //   field: "actions",
    //   type: "actions",
    //   headerName: "Actions",
    //   flex: 150,
    //   getActions: (params) => [
    //     <GridActionsCellItem
    //       icon={<Visibility />}
    //       label="View"
    //       onClick={() => handleView(params.row)}
    //     />,
    //     <GridActionsCellItem
    //       icon={<Edit />}
    //       label="Edit"
    //       onClick={() => handleEdit(params.id)}
    //     />,
    //     <GridActionsCellItem
    //       icon={<Delete />}
    //       label="Delete"
    //       onClick={() => handleDelete(params.id)}
    //     />,
    //   ],
    // },
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
              Voucher Management
            </Typography>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/superadmin/department/discount-form"
            >
              + Add Voucher
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

        {/* View Voucher Dialog */}
        <Dialog
          open={openViewDialog}
          onClose={() => setOpenViewDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Voucher Details</DialogTitle>
          <DialogContent>
            {selectedVoucher && (
              <Box
                sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}
              >
                <Typography>
                  <strong>Voucher ID:</strong> {selectedVoucher.voucherId}
                </Typography>
                <Typography>
                  <strong>Code:</strong> {selectedVoucher.code}
                </Typography>
                <Typography>
                  <strong>MM Kid ID:</strong> {selectedVoucher.mmKidId}
                </Typography>
                <Typography>
                  <strong>Type:</strong> {selectedVoucher.type}
                </Typography>
                <Typography>
                  <strong>Value:</strong> {selectedVoucher.value}
                </Typography>
                <Typography>
                  <strong>Condition:</strong> {selectedVoucher.condition}
                </Typography>
                <Typography>
                  <strong>Slots:</strong> {selectedVoucher.slots}
                </Typography>
                <Typography>
                  <strong>Status:</strong> {selectedVoucher.status}
                </Typography>
                <Typography>
                  <strong>Start Date:</strong>{" "}
                  {new Date(selectedVoucher.startDate).toLocaleDateString()}
                </Typography>
                <Typography>
                  <strong>Expiry Date:</strong>{" "}
                  {new Date(selectedVoucher.expiry).toLocaleDateString()}
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

export default DiscountTable;