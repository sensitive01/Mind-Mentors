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
  IconButton,
  Tooltip,
  DialogContentText,
} from "@mui/material";
import { DataGrid, GridActionsCellItem, GridToolbar } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  deleteTheVoucherData,
  fetchAllVouchers,
} from "../../../api/service/employee/EmployeeService";
import toast from "react-hot-toast";

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
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [voucherToDelete, setVoucherToDelete] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchVouchers = async () => {
    setLoading(true);
    try {
      const response = await fetchAllVouchers();
      if (response.status === 200) {
        setRows(
          response.data.map((voucher, index) => ({
            id: voucher._id,
            slNo: index + 1,
            ...voucher,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching vouchers:", error);
      toast.error("Failed to load vouchers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  const handleDeleteClick = (id, event) => {
    event.stopPropagation(); // Prevent row selection
    const voucherToDelete = rows.find((row) => row.id === id);
    setVoucherToDelete(voucherToDelete);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await deleteTheVoucherData(voucherToDelete.id);
      if (response && response.status === 200) {
        setRows(rows.filter((row) => row.id !== voucherToDelete.id));
        toast.success("Voucher deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting voucher:", error);
      toast.error("Failed to delete voucher");
    } finally {
      setOpenDeleteDialog(false);
      setVoucherToDelete(null);
    }
  };

  const handleView = (voucher) => {
    setSelectedVoucher(voucher);
    setOpenViewDialog(true);
  };

  const handleEdit = (id, event) => {
    event.stopPropagation(); // Prevent row selection
    navigate(`/super-admin/department/edit-discount-form/${id}`);
  };

  const handleRowClick = (params) => {
    handleView(params.row);
  };

  const columns = [
    {
      field: "slNo",
      headerName: "Sl No",
      width: 80,
      renderCell: (params) => params.value,
    },
    {
      field: "voucherId",
      headerName: "Voucher ID",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "code",
      headerName: "Code",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "mmKidId",
      headerName: "MM Kid ID",
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
      field: "value",
      headerName: "Value",
      flex: 1,
      minWidth: 100,
    },
    {
      field: "condition",
      headerName: "Condition",
      flex: 1,
      minWidth: 130,
    },
    {
      field: "slots",
      headerName: "Slots",
      flex: 1,
      minWidth: 100,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <Box
          sx={{
            backgroundColor:
              params.value === "active"
                ? "rgba(46, 204, 113, 0.2)"
                : params.value === "inactive"
                ? "rgba(149, 165, 166, 0.2)"
                : "rgba(231, 76, 60, 0.2)",
            color:
              params.value === "active"
                ? "rgb(46, 204, 113)"
                : params.value === "inactive"
                ? "rgb(149, 165, 166)"
                : "rgb(231, 76, 60)",
            borderRadius: "16px",
            padding: "4px 12px",
            textTransform: "capitalize",
            fontWeight: 600,
            fontSize: "0.75rem",
            display: "inline-block",
            textAlign: "center",
          }}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      width: 150,
      getActions: (params) => [

        <GridActionsCellItem
          icon={<Edit color="secondary" />}
          label="Edit"
          onClick={(event) => handleEdit(params.id, event)}
        />,
        <GridActionsCellItem
          icon={<Delete color="error" />}
          label="Delete"
          onClick={(event) => handleDeleteClick(params.id, event)}
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
              Voucher Management
            </Typography>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/super-admin/department/discount-form"
            >
              + Add Voucher
            </Button>
          </Box>
          <DataGrid
            rows={rows}
            columns={columns}
            autoHeight
            loading={loading}
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
              cursor: "pointer",
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
          <DialogTitle
            sx={{
              backgroundColor: "#642b8f",
              color: "white",
              fontWeight: 600,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            Voucher Details
            <Box>
              <Tooltip title="Edit">
                <IconButton
                  color="inherit"
                  onClick={() => {
                    setOpenViewDialog(false);
                    navigate(
                      `/super-admin/department/edit-discount/${selectedVoucher?.id}`
                    );
                  }}
                >
                  <Edit />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton
                  color="inherit"
                  onClick={() => {
                    setOpenViewDialog(false);
                    setVoucherToDelete(selectedVoucher);
                    setOpenDeleteDialog(true);
                  }}
                >
                  <Delete />
                </IconButton>
              </Tooltip>
            </Box>
          </DialogTitle>
          <DialogContent dividers>
            {selectedVoucher && (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 3,
                  py: 2,
                }}
              >
                <Typography
                  variant="body1"
                  sx={{ display: "flex", flexDirection: "column" }}
                >
                  <span style={{ color: "#64748B", marginBottom: "4px" }}>
                    Voucher ID
                  </span>
                  <span style={{ fontWeight: 500 }}>
                    {selectedVoucher.voucherId}
                  </span>
                </Typography>

                <Typography
                  variant="body1"
                  sx={{ display: "flex", flexDirection: "column" }}
                >
                  <span style={{ color: "#64748B", marginBottom: "4px" }}>
                    Code
                  </span>
                  <span style={{ fontWeight: 500 }}>
                    {selectedVoucher.code}
                  </span>
                </Typography>

                <Typography
                  variant="body1"
                  sx={{ display: "flex", flexDirection: "column" }}
                >
                  <span style={{ color: "#64748B", marginBottom: "4px" }}>
                    MM Kid ID
                  </span>
                  <span style={{ fontWeight: 500 }}>
                    {selectedVoucher.mmKidId || "N/A"}
                  </span>
                </Typography>

                <Typography
                  variant="body1"
                  sx={{ display: "flex", flexDirection: "column" }}
                >
                  <span style={{ color: "#64748B", marginBottom: "4px" }}>
                    Type
                  </span>
                  <span
                    style={{ fontWeight: 500, textTransform: "capitalize" }}
                  >
                    {selectedVoucher.type}
                  </span>
                </Typography>

                <Typography
                  variant="body1"
                  sx={{ display: "flex", flexDirection: "column" }}
                >
                  <span style={{ color: "#64748B", marginBottom: "4px" }}>
                    Value
                  </span>
                  <span style={{ fontWeight: 500 }}>
                    {selectedVoucher.type === "amount"
                      ? `$${selectedVoucher.value}`
                      : selectedVoucher.value}
                  </span>
                </Typography>

                <Typography
                  variant="body1"
                  sx={{ display: "flex", flexDirection: "column" }}
                >
                  <span style={{ color: "#64748B", marginBottom: "4px" }}>
                    Condition
                  </span>
                  <span
                    style={{ fontWeight: 500, textTransform: "capitalize" }}
                  >
                    {selectedVoucher.condition}
                  </span>
                </Typography>

                <Typography
                  variant="body1"
                  sx={{ display: "flex", flexDirection: "column" }}
                >
                  <span style={{ color: "#64748B", marginBottom: "4px" }}>
                    Slots
                  </span>
                  <span style={{ fontWeight: 500 }}>
                    {selectedVoucher.slots}
                  </span>
                </Typography>

                <Typography
                  variant="body1"
                  sx={{ display: "flex", flexDirection: "column" }}
                >
                  <span style={{ color: "#64748B", marginBottom: "4px" }}>
                    Status
                  </span>
                  <Box
                    sx={{
                      backgroundColor:
                        selectedVoucher.status === "active"
                          ? "rgba(46, 204, 113, 0.2)"
                          : selectedVoucher.status === "inactive"
                          ? "rgba(149, 165, 166, 0.2)"
                          : "rgba(231, 76, 60, 0.2)",
                      color:
                        selectedVoucher.status === "active"
                          ? "rgb(46, 204, 113)"
                          : selectedVoucher.status === "inactive"
                          ? "rgb(149, 165, 166)"
                          : "rgb(231, 76, 60)",
                      borderRadius: "16px",
                      padding: "4px 12px",
                      textTransform: "capitalize",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      display: "inline-block",
                      width: "fit-content",
                    }}
                  >
                    {selectedVoucher.status}
                  </Box>
                </Typography>

                <Typography
                  variant="body1"
                  sx={{ display: "flex", flexDirection: "column" }}
                >
                  <span style={{ color: "#64748B", marginBottom: "4px" }}>
                    Start Date
                  </span>
                  <span style={{ fontWeight: 500 }}>
                    {selectedVoucher.startDate
                      ? new Date(selectedVoucher.startDate).toLocaleDateString()
                      : "N/A"}
                  </span>
                </Typography>

                <Typography
                  variant="body1"
                  sx={{ display: "flex", flexDirection: "column" }}
                >
                  <span style={{ color: "#64748B", marginBottom: "4px" }}>
                    Expiry Date
                  </span>
                  <span style={{ fontWeight: 500 }}>
                    {selectedVoucher.expiry
                      ? new Date(selectedVoucher.expiry).toLocaleDateString()
                      : "N/A"}
                  </span>
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gridColumn: "1 / span 2",
                  }}
                >
                  <span style={{ color: "#64748B", marginBottom: "4px" }}>
                    Remarks
                  </span>
                  <span style={{ fontWeight: 500 }}>
                    {selectedVoucher.remarks || "No remarks provided"}
                  </span>
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

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete voucher{" "}
              <strong>{voucherToDelete?.code}</strong>? This action cannot be
              undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDeleteConfirm} color="error" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default DiscountTable;
