import {
  Box,
  Button,
  createTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Paper,
  ThemeProvider,
  Typography,
  Chip,
  Stack,
  Tooltip,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { getInvoiceData } from "../../../api/service/employee/EmployeeService";
import DownloadIcon from "@mui/icons-material/Download";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PaymentIcon from "@mui/icons-material/Payment";
import ReceiptIcon from "@mui/icons-material/Receipt";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AddIcon from "@mui/icons-material/Add";
import { jsPDF } from "jspdf";
import { useNavigate } from "react-router-dom";

const theme = createTheme({
  palette: {
    primary: {
      main: "#642b8f",
      light: "#8354ab",
      dark: "#4b1d6e",
    },
    secondary: {
      main: "#f5a623",
      light: "#f7bc56",
      dark: "#d48c13",
    },
    status: {
      success: "#4caf50",
      pending: "#ff9800",
      failed: "#f44336",
    },
    background: {
      default: "#F8F9FB",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1E293B",
      secondary: "#64748B",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
    subtitle2: {
      fontWeight: 600,
      color: "#64748B",
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 600,
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: "none",
          "& .MuiDataGrid-cell:focus": {
            outline: "none",
          },
        },
      },
    },
  },
});

const Prospects = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getInvoiceData();

        if (response.status === 200) {
          // Transform the data to match DataGrid requirements
          const transformedData = response.data.data.map((invoice, index) => ({
            id: invoice._id,
            slNo: response.data.data.length - index,
            paymentId: invoice.paymentId,
            paymentMode: invoice.paymentMode || "Online",
            transactionId: invoice.transactionId || "N/A",
            status: invoice.paymentStatus,
            amount: invoice.totalAmount || 0,
            date: new Date(invoice.createdAt).toLocaleDateString(),
            documentUrl: invoice.documentUrl || "",
            studentName: invoice.kidName || "N/A",
            // Store the full invoice object for detail view
            fullData: invoice,
          }));

          setRows(transformedData);
        }
      } catch (error) {
        console.error("Error fetching invoice data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleViewDetails = (invoice) => {
    setSelectedInvoice(invoice);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleGenerateInvoice = () => {
    // Navigate to the invoice generation page
    navigate('/super-admin/department/generate-invoice');
    // Alternative navigation with state if you need to pass data:
    // navigate('/generate-invoice', { state: { someData: 'value' } });
  };

  const getStatusChipProps = (status) => {
    status = status?.toLowerCase() || "";

    if (status === "success" || status === "paid" || status === "completed") {
      return {
        label: "Paid",
        color: "success",
        sx: {
          backgroundColor: "rgba(76, 175, 80, 0.12)",
          color: theme.palette.status.success,
        },
      };
    } else if (status === "pending" || status === "processing") {
      return {
        label: "Pending",
        color: "warning",
        sx: {
          backgroundColor: "rgba(255, 152, 0, 0.12)",
          color: theme.palette.status.pending,
        },
      };
    } else if (
      status === "failed" ||
      status === "cancelled" ||
      status === "rejected"
    ) {
      return {
        label: "Failed",
        color: "error",
        sx: {
          backgroundColor: "rgba(244, 67, 54, 0.12)",
          color: theme.palette.status.failed,
        },
      };
    }

    return {
      label: status.charAt(0).toUpperCase() + status.slice(1),
      color: "default",
      sx: { backgroundColor: "rgba(0, 0, 0, 0.08)" },
    };
  };

  const generateInvoice = (paymentData) => {
    const doc = new jsPDF();

    // Invoice title
    doc.setFontSize(20);
    doc.text("INVOICE", 105, 20, { align: "center" });

    // Invoice details
    doc.setFontSize(12);
    doc.text(`Invoice Number: ${paymentData.paymentId || "N/A"}`, 150, 15);
    doc.text(
      `Date: ${new Date(paymentData.createdAt).toLocaleDateString()}`,
      150,
      22
    );

    // Divider line
    doc.line(10, 35, 200, 35);

    // Student information
    doc.setFontSize(14);
    doc.text("Student Details", 10, 45);
    doc.setFontSize(12);
    doc.text(`Name: ${paymentData.kidName || "N/A"}`, 10, 55);
    doc.text(`Mobile: ${paymentData.whatsappNumber || "N/A"}`, 10, 65);

    // Package details
    doc.setFontSize(14);
    doc.text("Package Details", 10, 80);
    doc.setFontSize(12);
    doc.text(`Package: ${paymentData.selectedPackage || "N/A"}`, 10, 90);
    doc.text(`Type: ${paymentData.classMode || "N/A"}`, 10, 100);

    // Initialize yPos with a default value
    let yPos = 110;

    // Add programs if they exist
    if (paymentData.programs && paymentData.programs.length > 0) {
      doc.text("Programs:", 10, yPos);
      yPos += 10;
      paymentData.programs.forEach((program, index) => {
        doc.text(`• ${program.program} (Level: ${program.level})`, 15, yPos);
        yPos += 10;
      });
    }

    // Payment details
    doc.setFontSize(14);
    doc.text("Payment Details", 10, yPos + 10);
    doc.setFontSize(12);
    doc.text(
      `Base Amount: ₹${paymentData.baseAmount?.toFixed(2) || "0.00"}`,
      10,
      yPos + 20
    );
    if (paymentData.discount > 0) {
      doc.text(
        `Discount: -₹${paymentData.discount?.toFixed(2) || "0.00"}`,
        10,
        yPos + 30
      );
    }
    doc.setFontSize(16);
    doc.text(
      `Total Amount: ₹${paymentData.totalAmount?.toFixed(2) || "0.00"}`,
      10,
      yPos + 45
    );

    if (paymentData.transactionId) {
      doc.setFontSize(12);
      doc.text(`Transaction ID: ${paymentData.transactionId}`, 10, yPos + 60);
    }

    // Status
    doc.setFontSize(14);
    doc.setTextColor(0, 128, 0); // Green color for status
    doc.text(
      `Status: ${paymentData.paymentStatus.toUpperCase()}`,
      150,
      yPos + 60
    );

    // Footer
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text("Thank you for your payment!", 105, 280, { align: "center" });
    doc.text("MindMentorz", 105, 285, { align: "center" });

    // Save the PDF
    doc.save(`invoice_${paymentData.paymentId || "payment"}.pdf`);
  };

  const columns = [
    {
      field: "slNo",
      headerName: "S.No",
      width: 80,
      headerAlign: "center",
      align: "center",
      flex: 0.5,
    },
    {
      field: "paymentId",
      headerName: "Payment ID",
      flex: 1.2,
      minWidth: 150,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, pl: 1 }}>
          <ReceiptIcon
            fontSize="small"
            sx={{ color: theme.palette.primary.main, flexShrink: 0 }}
          />
          <Typography variant="body2" noWrap>
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: "studentName",
      headerName: "Student",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ pl: 1 }} noWrap>
          {params.value}
        </Typography>
      ),
    },
    {
      field: "amount",
      headerName: "Amount",
      flex: 0.8,
      minWidth: 100,
      align: "right",
      headerAlign: "right",
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="600" sx={{ pr: 2 }}>
          ₹{params.value?.toLocaleString() || "0"}
        </Typography>
      ),
    },
    {
      field: "paymentMode",
      headerName: "Payment Mode",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, pl: 1 }}>
          <PaymentIcon
            fontSize="small"
            sx={{ color: theme.palette.text.secondary, flexShrink: 0 }}
          />
          <Typography variant="body2" noWrap>
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: "date",
      headerName: "Date",
      flex: 0.8,
      minWidth: 110,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, pl: 1 }}>
          <CalendarTodayIcon
            fontSize="small"
            sx={{ color: theme.palette.text.secondary, flexShrink: 0 }}
          />
          <Typography variant="body2">{params.value}</Typography>
        </Box>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.8,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const chipProps = getStatusChipProps(params.value);
        return (
          <Box
            sx={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            <Chip size="small" {...chipProps} />
          </Box>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.8,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <Stack direction="row" spacing={1}>
            <Tooltip title="View Details">
              <IconButton
                size="small"
                color="primary"
                onClick={() => handleViewDetails(params.row.fullData)}
              >
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Download Invoice">
              <IconButton
                size="small"
                color="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  generateInvoice(params.row.fullData);
                }}
              >
                <DownloadIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>
      ),
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ width: "100%", height: "100%", p: 3 }}>
        {/* Header with title and Generate Invoice button */}
        <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h5" color="text.primary">
            Invoice Management
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleGenerateInvoice}
            sx={{
              px: 3,
              py: 1,
              fontSize: "0.875rem",
              fontWeight: 600,
              boxShadow: "0px 2px 8px rgba(100, 43, 143, 0.24)",
              "&:hover": {
                boxShadow: "0px 4px 12px rgba(100, 43, 143, 0.32)",
                transform: "translateY(-1px)",
              },
              transition: "all 0.2s ease-in-out",
            }}
          >
            Generate Invoice
          </Button>
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: 0,
            backgroundColor: "background.paper",
            overflow: "hidden",
          }}
        >
          <DataGrid
            rows={rows}
            columns={columns}
            loading={loading}
            disableRowSelectionOnClick
            onRowClick={(params) => handleViewDetails(params.row.fullData)}
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
              },
            }}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 },
              },
              sorting: {
                sortModel: [{ field: "date", sort: "desc" }],
              },
            }}
            pageSizeOptions={[10, 15, 25, 50]}
            sx={{
              height: 600,
              borderRadius: 0,
              "& .MuiDataGrid-cell:focus": {
                outline: "none",
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "rgba(100, 43, 143, 0.04)",
                cursor: "pointer",
              },
              "& .MuiDataGrid-columnHeader": {
                backgroundColor: "rgba(100, 43, 143, 0.08)",
                color: theme.palette.text.primary,
                fontWeight: 600,
              },
              "& .MuiDataGrid-columnSeparator": {
                display: "none",
              },
              "& .MuiDataGrid-row": {
                borderBottom: "1px solid rgba(224, 224, 224, 0.4)",
              },
              "& .MuiDataGrid-cell": {
                py: 1.5,
                px: 0,
              },
              "& .MuiDataGrid-toolbarContainer": {
                p: 2,
                backgroundColor: "rgba(248, 249, 251, 0.7)",
              },
              "& .MuiDataGrid-footerContainer": {
                borderTop: "1px solid rgba(224, 224, 224, 0.8)",
              },
            }}
          />
        </Paper>
      </Box>

      {/* Invoice Detail Dialog - keeping the same as original */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            bgcolor: "primary.main",
            color: "white",
            py: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box display="flex" alignItems="center">
            <ReceiptIcon sx={{ mr: 1 }} />
            <Typography variant="h6" component="div">
              Invoice Details
            </Typography>
          </Box>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleCloseDialog}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 3 }}>
          {selectedInvoice && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Payment Information
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Transaction details and payment status
                    </Typography>
                  </Box>
                  {selectedInvoice.paymentStatus && (
                    <Chip
                      {...getStatusChipProps(selectedInvoice.paymentStatus)}
                      size="medium"
                    />
                  )}
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle2">Payment ID</Typography>
                    <Typography variant="body1" fontWeight="500">
                      {selectedInvoice.paymentId}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle2">Amount</Typography>
                    <Typography variant="body1" fontWeight="500">
                      ₹{selectedInvoice.totalAmount}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle2">Payment Mode</Typography>
                    <Typography variant="body1">
                      {selectedInvoice.paymentMode || "Online"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle2">Transaction ID</Typography>
                    <Typography variant="body1">
                      {selectedInvoice.transactionId || "N/A"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle2">Created At</Typography>
                    <Typography variant="body1">
                      {new Date(selectedInvoice.createdAt).toLocaleString()}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Student Information
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Student details and contact information
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Child Name</Typography>
                    <Typography variant="body1" fontWeight="500">
                      {selectedInvoice.kidName}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Contact Number</Typography>
                    <Typography variant="body1">
                      {selectedInvoice.whatsappNumber}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Package Details
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Enrollment information and package specifics
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle2">
                      Selected Package
                    </Typography>
                    <Typography variant="body1" fontWeight="500">
                      {selectedInvoice.selectedPackage}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle2">Class Mode</Typography>
                    <Typography variant="body1">
                      {selectedInvoice.classMode}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle2">Base Amount</Typography>
                    <Typography variant="body1">
                      ₹{selectedInvoice.baseAmount}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle2">Discount</Typography>
                    <Typography variant="body1">
                      ₹{selectedInvoice.discount}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle2">Online Classes</Typography>
                    <Typography variant="body1">
                      {selectedInvoice.onlineClasses}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle2">Offline Classes</Typography>
                    <Typography variant="body1">
                      {selectedInvoice.offlineClasses}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>

              {selectedInvoice.programs &&
                selectedInvoice.programs.length > 0 && (
                  <Grid item xs={12}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        Programs
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Enrolled programs and their details
                      </Typography>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    {selectedInvoice.programs.map((program, index) => (
                      <Paper
                        key={index}
                        elevation={0}
                        sx={{
                          p: 2,
                          mb: 2,
                          backgroundColor: "rgba(248, 249, 251, 0.7)",
                          border: "1px solid rgba(224, 224, 224, 0.5)",
                          borderRadius: 2,
                        }}
                      >
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={3}>
                            <Typography variant="subtitle2">Program</Typography>
                            <Typography variant="body1" fontWeight="500">
                              {program.program}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <Typography variant="subtitle2">Level</Typography>
                            <Typography variant="body1">
                              {program.level}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <Typography variant="subtitle2">Status</Typography>
                            <Chip
                              size="small"
                              label={program.status}
                              sx={{
                                backgroundColor:
                                  program.status?.toLowerCase() === "active"
                                    ? "rgba(76, 175, 80, 0.12)"
                                    : "rgba(0, 0, 0, 0.08)",
                                color:
                                  program.status?.toLowerCase() === "active"
                                    ? theme.palette.status.success
                                    : theme.palette.text.primary,
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <Typography variant="subtitle2">
                              Center Type
                            </Typography>
                            <Typography variant="body1">
                              {program.centerType}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Paper>
                    ))}
                  </Grid>
                )}

              {selectedInvoice.remarks && (
                <Grid item xs={12}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Remarks
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Additional notes and information
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      backgroundColor: "rgba(248, 249, 251, 0.7)",
                      border: "1px solid rgba(224, 224, 224, 0.5)",
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="body1">
                      {selectedInvoice.remarks}
                    </Typography>
                  </Paper>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: "space-between" }}>
          <Button
            onClick={handleCloseDialog}
            variant="outlined"
            color="primary"
            startIcon={<CloseIcon />}
          >
            Close
          </Button>
          {selectedInvoice && (
            <Button
              onClick={() => generateInvoice(selectedInvoice)}
              color="primary"
              variant="contained"
              startIcon={<DownloadIcon />}
            >
              Download Invoice
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default Prospects;