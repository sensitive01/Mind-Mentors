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
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import {
    getPendingInvoiceData,
    updatePaymentVerification
} from "../../../api/service/employee/EmployeeService";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PaymentIcon from "@mui/icons-material/Payment";
import ReceiptIcon from "@mui/icons-material/Receipt";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import WarningIcon from "@mui/icons-material/Warning";
import ImageIcon from "@mui/icons-material/Image";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
            Processing: "#ff9800",
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

const PendingInvoiceTable = () => {
    const empId = localStorage.getItem("empId");
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [openImageDialog, setOpenImageDialog] = useState(false);
    const [updateType, setUpdateType] = useState(""); // "approve" or "cancel"
    const [remarks, setRemarks] = useState("");
    const [updatedStatus, setUpdatedStatus] = useState("Success");

    useEffect(() => {
        fetchInvoiceData();
    }, []);

    const fetchInvoiceData = async () => {
        try {
            setLoading(true);
            const response = await getPendingInvoiceData();

            if (response.status === 200) {
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

    const handleViewDetails = (invoice) => {
        setSelectedInvoice(invoice);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setRemarks("");
        setUpdatedStatus("Success");
    };

    const handleOpenConfirmDialog = (type) => {
        setUpdateType(type);
        setOpenConfirmDialog(true);
    };

    const handleCloseConfirmDialog = () => {
        setOpenConfirmDialog(false);
        setRemarks("");
    };

    const handleViewDocument = () => {
        setOpenImageDialog(true);
    };

    const handleCloseImageDialog = () => {
        setOpenImageDialog(false);
    };

    const handleUpdatePaymentStatus = async () => {
        try {
            if (updateType === "cancel" && !remarks.trim()) {
                toast.error("Please provide a reason for cancellation");
                return;
            }

            const statusData = {
                paymentId: selectedInvoice._id,
                paymentStatus: updateType === "approve" ? updatedStatus : "Cancelled",
                remarks: remarks.trim() || (updateType === "approve" ? "Payment verified and approved" : ""),
                verifiedBy: empId,
            };

            const response = await updatePaymentVerification(statusData);

            if (response.status === 200) {
                toast.success(
                    updateType === "approve"
                        ? "Payment status updated successfully"
                        : "Payment cancelled successfully"
                );

                // Refresh the data
                setRows((prev) => prev.filter((item) => item.id !== selectedInvoice._id));


                // Close all dialogs
                handleCloseConfirmDialog();
                handleCloseDialog();
            } else {
                toast.error("Failed to update payment status");
            }
        } catch (error) {
            console.error("Error updating payment status:", error);
            toast.error(error.response?.data?.message || "Error updating payment status");
        }
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
        } else if (status === "processing") {  // Changed from "Processing" to "processing"
            return {
                label: "Processing",
                color: "warning",
                sx: {
                    backgroundColor: "rgba(255, 152, 0, 0.12)",
                    color: theme.palette.status.Processing,  // Make sure this matches your theme
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
            field: "transactionId",
            headerName: "Transaction ID",
            flex: 1,
            minWidth: 140,
            renderCell: (params) => (
                <Typography variant="body2" sx={{ pl: 1 }} noWrap>
                    {params.value}
                </Typography>
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
            flex: 0.6,
            minWidth: 100,
            align: "center",
            headerAlign: "center",
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
                    <Tooltip title="View Details">
                        <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleViewDetails(params.row.fullData)}
                        >
                            <VisibilityIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>
            ),
        },
    ];

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ width: "100%", height: "100%", p: 3 }}>
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h5" color="text.primary">
                        Payment Verification
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Review and verify pending payment transactions
                    </Typography>
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

            {/* Invoice Detail Dialog */}
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
                            Verify Payment Details
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
                            {/* Payment Information */}
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
                                        <Typography variant="body1" fontWeight="500" color="primary">
                                            ₹{selectedInvoice.totalAmount}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <Typography variant="subtitle2">Payment Mode</Typography>
                                        <Typography variant="body1">
                                            {selectedInvoice.paymentMode || "Online"}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2">Transaction ID</Typography>
                                        <Typography variant="body1" fontWeight="500">
                                            {selectedInvoice.transactionId || "N/A"}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2">Created At</Typography>
                                        <Typography variant="body1">
                                            {new Date(selectedInvoice.createdAt).toLocaleString()}
                                        </Typography>
                                    </Grid>

                                    {/* Document Preview */}
                                    {selectedInvoice.documentUrl && (
                                        <Grid item xs={12}>
                                            <Typography variant="subtitle2" gutterBottom>
                                                Payment Document
                                            </Typography>
                                            <Paper
                                                elevation={0}
                                                sx={{
                                                    p: 2,
                                                    backgroundColor: "rgba(248, 249, 251, 0.7)",
                                                    border: "1px solid rgba(224, 224, 224, 0.5)",
                                                    borderRadius: 2,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "space-between",
                                                }}
                                            >
                                                <Box display="flex" alignItems="center" gap={1}>
                                                    <ImageIcon color="primary" />
                                                    <Typography variant="body2">
                                                        Payment proof uploaded
                                                    </Typography>
                                                </Box>
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    onClick={handleViewDocument}
                                                    startIcon={<VisibilityIcon />}
                                                >
                                                    View Document
                                                </Button>
                                            </Paper>
                                        </Grid>
                                    )}
                                </Grid>
                            </Grid>

                            {/* Student Information */}
                            <Grid item xs={12}>
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="h6" gutterBottom>
                                        Student Information
                                    </Typography>
                                </Box>
                                <Divider sx={{ mb: 2 }} />
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2">Student Name</Typography>
                                        <Typography variant="body1" fontWeight="500">
                                            {selectedInvoice.kidName}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2">Contact Number</Typography>
                                        <Typography variant="body1">
                                            +{selectedInvoice.whatsappNumber}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>

                            {/* Package Details */}
                            <Grid item xs={12}>
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="h6" gutterBottom>
                                        Package Details
                                    </Typography>
                                </Box>
                                <Divider sx={{ mb: 2 }} />
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2">
                                            Selected Package
                                        </Typography>
                                        <Typography variant="body1" fontWeight="500">
                                            {selectedInvoice.selectedPackage}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
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
                                        <Typography variant="subtitle2">Total Amount</Typography>
                                        <Typography variant="body1" fontWeight="600" color="primary">
                                            ₹{selectedInvoice.totalAmount}
                                        </Typography>
                                    </Grid>
                                    {selectedInvoice.onlineClasses > 0 && (
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="subtitle2">Online Classes</Typography>
                                            <Typography variant="body1">
                                                {selectedInvoice.onlineClasses}
                                            </Typography>
                                        </Grid>
                                    )}
                                    {selectedInvoice.offlineClasses > 0 && (
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="subtitle2">Offline Classes</Typography>
                                            <Typography variant="body1">
                                                {selectedInvoice.offlineClasses}
                                            </Typography>
                                        </Grid>
                                    )}
                                </Grid>
                            </Grid>

                            {/* Programs */}
                            {selectedInvoice.programs &&
                                selectedInvoice.programs.length > 0 && (
                                    <Grid item xs={12}>
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="h6" gutterBottom>
                                                Programs
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
                                                    <Grid item xs={12} sm={6}>
                                                        <Typography variant="subtitle2">Program</Typography>
                                                        <Typography variant="body1" fontWeight="500">
                                                            {program.program}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={12} sm={6}>
                                                        <Typography variant="subtitle2">Level</Typography>
                                                        <Typography variant="body1">
                                                            {program.level}
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            </Paper>
                                        ))}
                                    </Grid>
                                )}

                            {/* Existing Remarks */}
                            {selectedInvoice.remarks && (
                                <Grid item xs={12}>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="h6" gutterBottom>
                                            Remarks
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
                        color="inherit"
                        startIcon={<CloseIcon />}
                    >
                        Close
                    </Button>
                    <Stack direction="row" spacing={2}>
                        <Button
                            onClick={() => handleOpenConfirmDialog("cancel")}
                            color="error"
                            variant="outlined"
                            startIcon={<CancelIcon />}
                        >
                            Cancel Payment
                        </Button>
                        <Button
                            onClick={() => handleOpenConfirmDialog("approve")}
                            color="success"
                            variant="contained"
                            startIcon={<CheckCircleIcon />}
                        >
                            Update Status
                        </Button>
                    </Stack>
                </DialogActions>
            </Dialog>

            {/* Confirmation Dialog */}
            <Dialog
                open={openConfirmDialog}
                onClose={handleCloseConfirmDialog}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle
                    sx={{
                        bgcolor: updateType === "approve" ? "success.main" : "error.main",
                        color: "white",
                        py: 2,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                    }}
                >
                    {updateType === "approve" ? (
                        <CheckCircleIcon />
                    ) : (
                        <WarningIcon />
                    )}
                    <Typography variant="h6">
                        {updateType === "approve"
                            ? "Update Payment Status"
                            : "Cancel Payment"}
                    </Typography>
                </DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    <Typography variant="body1" gutterBottom sx={{ mb: 3 }}>
                        {updateType === "approve"
                            ? "Are you sure you want to update this payment status to success?"
                            : "Are you sure you want to cancel this payment? This action cannot be undone."}
                    </Typography>

                    {updateType === "approve" && (
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Payment Status</InputLabel>
                            <Select
                                value={updatedStatus}
                                onChange={(e) => setUpdatedStatus(e.target.value)}
                                label="Payment Status"
                            >
                                <MenuItem value="Success">Success</MenuItem>
                                <MenuItem value="Failed">Failed</MenuItem>
                            </Select>
                        </FormControl>
                    )}

                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label={updateType === "approve" ? "Remarks (Optional)" : "Reason for Cancellation"}
                        placeholder={
                            updateType === "approve"
                                ? "Add any additional notes..."
                                : "Please provide a reason for cancellation"
                        }
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        required={updateType === "cancel"}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={handleCloseConfirmDialog} variant="outlined">
                        Go Back
                    </Button>
                    <Button
                        onClick={handleUpdatePaymentStatus}
                        variant="contained"
                        color={updateType === "approve" ? "success" : "error"}
                        startIcon={
                            updateType === "approve" ? <CheckCircleIcon /> : <CancelIcon />
                        }
                    >
                        {updateType === "approve" ? "Confirm Update" : "Confirm Cancellation"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Document View Dialog */}
            <Dialog
                open={openImageDialog}
                onClose={handleCloseImageDialog}
                maxWidth="md"
                fullWidth
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
                        <ImageIcon sx={{ mr: 1 }} />
                        <Typography variant="h6">Payment Document</Typography>
                    </Box>
                    <IconButton
                        edge="end"
                        color="inherit"
                        onClick={handleCloseImageDialog}
                        aria-label="close"
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ p: 0, bgcolor: "#f5f5f5" }}>
                    {selectedInvoice?.documentUrl && (
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                minHeight: 400,
                                p: 2,
                            }}
                        >
                            <img
                                src={selectedInvoice.documentUrl}
                                alt="Payment Document"
                                style={{
                                    maxWidth: "100%",
                                    maxHeight: "70vh",
                                    objectFit: "contain",
                                }}
                            />
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={handleCloseImageDialog} variant="contained">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                closeOnClick
                pauseOnHover
                draggable
                style={{ marginTop: "60px" }}
            />
        </ThemeProvider>
    );
};

export default PendingInvoiceTable;