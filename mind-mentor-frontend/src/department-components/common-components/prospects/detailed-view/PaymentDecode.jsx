import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Paper,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Divider,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import CancelIcon from "@mui/icons-material/Cancel";
import UpdateIcon from "@mui/icons-material/Update";
import PersonIcon from "@mui/icons-material/Person";
import SchoolIcon from "@mui/icons-material/School";
import PaymentIcon from "@mui/icons-material/Payment";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import AttachmentIcon from "@mui/icons-material/Attachment";
import DeleteIcon from "@mui/icons-material/Delete";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import {
  getPaymetDetails,
  updatePaymentStatus,
} from "../../../../api/service/employee/EmployeeService";
// import { updatePaymentStatus } from "../api/service/payment/PaymentService";
const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID;
import logo from "../../../../assets/mindmentorz.png";
import { jsPDF } from "jspdf";

const PaymentDecode = () => {
  const empId = localStorage.getItem("empId")
  const { encodedData } = useParams();
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState("pending"); // pending, processing, completed, failed
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [fileUploadData, setFileUploadData] = useState(null);

  const [transactionDetails, setTransactionDetails] = useState({
    transactionId: "",
    paymentMode: "upi",
    remarks: "",
  });
  const [uploadedFile, setUploadedFile] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getPaymetDetails(encodedData);
        if (response && response.data) {
          setPaymentData(response.data);
          if (response.data.paymentStatus) {
            setPaymentStatus(response.data.paymentStatus.toLowerCase());
          }
        } else {
          setError("Failed to fetch payment details");
        }
      } catch (err) {
        console.error("Error fetching payment details:", err);
        setError("An error occurred while fetching payment details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [encodedData]);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handlePayNow = async () => {
    try {
      const res = await loadRazorpay();

      if (!res) {
        showSnackbar(
          "Razorpay SDK failed to load. Please check your connection",
          "error"
        );
        return;
      }

      setPaymentDialogOpen(true);
    } catch (error) {
      console.error("Error loading Razorpay:", error);
      showSnackbar("Failed to initialize payment", "error");
    }
  };

  const handleUpdateStatus = () => {
    setUpdateDialogOpen(true);
  };

  const displayRazorpay = async () => {
    try {
      setPaymentDialogOpen(false);

      setPaymentStatus("processing");

      // const orderData = await createRazorpayOrder(paymentData.totalAmount);

      const options = {
        key: RAZORPAY_KEY,
        amount: paymentData.totalAmount * 100,
        currency: "INR",
        name: "MindMentorz",
        description: `Payment for ${paymentData.selectedPackage || "Package"}`,
        image: logo,
        handler: function (response) {
          handlePaymentSuccess(response.razorpay_payment_id);
        },
        prefill: {
          name: paymentData.kidName || "",
          contact: paymentData.whatsappNumber || "",
        },
        notes: {
          packageId: paymentData.packageId || "",
          kidId: paymentData.kidId || "",
        },
        theme: {
          color: "#6c63ff",
        },
        modal: {
          ondismiss: function () {
            setPaymentStatus("pending");
            showSnackbar("Payment cancelled", "warning");
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Razorpay error:", error);
      setPaymentStatus("failed");
      showSnackbar("Payment initialization failed", "error");
    }
  };

  const handlePaymentSuccess = async (razorpayPaymentId) => {
    try {
      // Update payment status in your backend
      const response = await updatePaymentStatus({
        paymentId: encodedData,
        status: "Success",
        amount: paymentData.totalAmount,
        transactionId: razorpayPaymentId,
        empId
      });

      if (response?.status === 200) {
        setPaymentStatus("completed");
        setTransactionDetails({
          ...transactionDetails,
          transactionId: razorpayPaymentId,
        });
        showSnackbar("Payment completed successfully!", "success");
      } else {
        throw new Error("Payment update failed");
      }
    } catch (err) {
      console.error("Error processing payment:", err);
      setPaymentStatus("failed");
      showSnackbar(
        "Payment verification failed. Please contact support.",
        "error"
      );
    }
  };

  const handlePaymentCancel = () => {
    setPaymentDialogOpen(false);
  };

  const handleUpdateCancel = () => {
    setUpdateDialogOpen(false);
    // Reset transaction details form
    setTransactionDetails({
      transactionId: "",
      paymentMode: "upi",
      remarks: "",
    });
    setUploadedFile(null);
  };

  const handleTransactionDetailsChange = (e) => {
    const { name, value } = e.target;
    setTransactionDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileUpload = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);

      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        import.meta.env.VITE_APP_CLOUDINARY_UPLOAD_PRESET
      );
      formData.append(
        "cloud_name",
        import.meta.env.VITE_APP_CLOUDINARY_CLOUD_NAME
      );
      formData.append("folder", "mindmentorz");

      try {
        setSnackbarOpen(true);
        setSnackbarMessage("Uploading file...");
        setSnackbarSeverity("info");

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_APP_CLOUDINARY_CLOUD_NAME
          }/upload`,
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await response.json();
        console.log("Uploaded:", data);

        // Store the Cloudinary response data
        setFileUploadData(data);

        setSnackbarOpen(true);
        setSnackbarMessage("File uploaded successfully!");
        setSnackbarSeverity("success");
      } catch (error) {
        console.error("Error uploading file to Cloudinary:", error);
        setSnackbarOpen(true);
        setSnackbarMessage("Failed to upload file");
        setSnackbarSeverity("error");
      }
    }
  };
  const handleRemoveFile = () => {
    setUploadedFile(null);
    setFileUploadData(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleManualStatusUpdate = async () => {
    try {
      if (!transactionDetails.transactionId) {
        showSnackbar("Transaction ID is required", "error");
        return;
      }

      // Set status to processing immediately in the UI
      setPaymentStatus("processing");
      setUpdateDialogOpen(false);

      // Create form data for status update
      const updateData = {
        kidId: paymentData.kidId,
        packageId: paymentData.packageId,
        status: "Processing",  // Make sure this matches your backend's expected status
        amount: paymentData.totalAmount,
        transactionId: transactionDetails.transactionId,
        paymentMode: transactionDetails.paymentMode,
        remarks: transactionDetails.remarks,
        paymentId: encodedData,
        empId
      };

      // Add file URL to the request if it exists
      if (fileUploadData && fileUploadData.secure_url) {
        updateData.documentUrl = fileUploadData.secure_url;
      }

      // Call your API to update status with transaction details
      const response = await updatePaymentStatus(updateData);

      if (response?.status === 200) {
        // Keep the status as "processing" instead of changing to "completed"
        showSnackbar("Payment status updated to Processing!", "success");

        // Reset form
        setTransactionDetails({
          transactionId: "",
          paymentMode: "upi",
          remarks: "",
        });
        setUploadedFile(null);
        setFileUploadData(null);
      } else {
        throw new Error("Payment update failed");
      }
    } catch (err) {
      console.error("Error updating payment status:", err);
      setPaymentStatus("failed");
      showSnackbar("Status update failed. Please try again.", "error");
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const generateInvoice = () => {
    const doc = new jsPDF();

    // Add logo
    doc.addImage(logo, "PNG", 10, 10, 40, 20);

    // Invoice title
    doc.setFontSize(20);
    doc.text("INVOICE", 105, 20, { align: "center" });

    // Invoice details
    doc.setFontSize(12);
    doc.text(`Invoice Number: ${paymentData.paymentId || "N/A"}`, 150, 15);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 22);

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

    if (transactionDetails.transactionId) {
      doc.setFontSize(12);
      doc.text(
        `Transaction ID: ${transactionDetails.transactionId}`,
        10,
        yPos + 60
      );
    }

    // Status
    doc.setFontSize(14);
    doc.setTextColor(0, 128, 0); // Green color for status
    doc.text(`Status: ${paymentStatus.toUpperCase()}`, 150, yPos + 60);

    // Footer
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text("Thank you for your payment!", 105, 280, { align: "center" });
    doc.text("MindMentorz", 105, 285, { align: "center" });

    // Save the PDF
    doc.save(`invoice_${paymentData.paymentId || "payment"}.pdf`);
  };

  if (loading) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f9fafb",
        }}
      >
        <CircularProgress color="primary" size={40} />
        <Typography variant="body1" color="textSecondary" sx={{ ml: 2 }}>
          Loading payment details...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f9fafb",
          p: 4,
        }}
      >
        <Paper elevation={3} sx={{ p: 4, maxWidth: 500, width: "100%" }}>
          <Typography variant="h6" color="error" align="center" gutterBottom>
            Error
          </Typography>
          <Typography variant="body1" align="center" sx={{ mb: 3 }}>
            {error}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => navigate("/")}
          >
            Go to Home
          </Button>
        </Paper>
      </Box>
    );
  }

  if (!paymentData) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f9fafb",
        }}
      >
        <Typography variant="body1" color="textSecondary">
          No payment details found
        </Typography>
      </Box>
    );
  }

  const statusColors = {
    pending: {
      bg: "#FFF7E6",
      color: "#FF9800",
      border: "#FFCC80",
      icon: <UpdateIcon fontSize="small" sx={{ mr: 0.5 }} />,
    },
    processing: {
      bg: "#E3F2FD",
      color: "#1976D2",
      border: "#90CAF9",
      icon: <CircularProgress size={14} sx={{ mr: 0.5 }} />,
    },
    completed: {
      bg: "#E8F5E9",
      color: "#4CAF50",
      border: "#A5D6A7",
      icon: <CheckCircleOutlineIcon fontSize="small" sx={{ mr: 0.5 }} />,
    },
    failed: {
      bg: "#FFEBEE",
      color: "#F44336",
      border: "#EF9A9A",
      icon: <CancelIcon fontSize="small" sx={{ mr: 0.5 }} />,
    },
    success: {
      bg: "#E8F5E9",
      color: "#4CAF50",
      border: "#A5D6A7",
      icon: <CheckCircleOutlineIcon fontSize="small" sx={{ mr: 0.5 }} />,
    },

  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f9fafb",
        py: 5,
        px: { xs: 2, sm: 4 },
      }}
    >
      <Paper
        elevation={2}
        sx={{
          maxWidth: 900,
          mx: "auto",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            backgroundColor: "#642b8f",
            p: 3,
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Payment Details
          </Typography>
          <Chip
            label={
              paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)
            }
            icon={statusColors[paymentStatus].icon}
            sx={{
              backgroundColor: statusColors[paymentStatus].bg,
              color: statusColors[paymentStatus].color,
              border: `1px solid ${statusColors[paymentStatus].border}`,
              fontWeight: 600,
              "& .MuiChip-label": {
                px: 1,
              },
            }}
          />
        </Box>

        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          {/* Student Information */}
          <Card variant="outlined" sx={{ mb: 3, borderRadius: 1 }}>
            <CardHeader
              avatar={<PersonIcon sx={{ color: "#642b8f" }} />}
              title="Student Information"
              sx={{
                backgroundColor: "#f3e5f5",
                py: 1.5,
                "& .MuiCardHeader-title": {
                  fontWeight: 600,
                  color: "#642b8f",
                },
              }}
            />
            <CardContent>
              <Grid container spacing={2}>
                {paymentData.kidName && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="body1">
                      <Typography component="span" fontWeight="600">
                        Kid Name:
                      </Typography>{" "}
                      {paymentData.kidName}
                    </Typography>
                  </Grid>
                )}
                {paymentData.whatsappNumber && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="body1">
                      <Typography component="span" fontWeight="600">
                        Mobile:
                      </Typography>{" "}
                      {paymentData.whatsappNumber}
                    </Typography>
                  </Grid>
                )}
                {paymentData.programs && paymentData.programs.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="body1" sx={{ mb: 0.5 }}>
                      <Typography component="span" fontWeight="600">
                        Programs:
                      </Typography>
                    </Typography>
                    <Box sx={{ pl: 2 }}>
                      {paymentData.programs.map((program, index) => (
                        <Typography
                          key={index}
                          variant="body2"
                          sx={{ mb: 0.5 }}
                        >
                          • {program.program} (Level: {program.level})
                        </Typography>
                      ))}
                    </Box>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>

          {/* Package Details */}
          <Card variant="outlined" sx={{ mb: 3, borderRadius: 1 }}>
            <CardHeader
              avatar={<SchoolIcon sx={{ color: "#642b8f" }} />}
              title="Package Details"
              sx={{
                backgroundColor: "#f3e5f5",
                py: 1.5,
                "& .MuiCardHeader-title": {
                  fontWeight: 600,
                  color: "#642b8f",
                },
              }}
            />
            <CardContent>
              <Grid container spacing={2}>
                {paymentData.classMode && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="body1">
                      <Typography component="span" fontWeight="600">
                        Package Type:
                      </Typography>{" "}
                      {paymentData.classMode.charAt(0).toUpperCase() +
                        paymentData.classMode.slice(1)}
                    </Typography>
                  </Grid>
                )}
                {paymentData.selectedPackage && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="body1">
                      <Typography component="span" fontWeight="600">
                        Package:
                      </Typography>{" "}
                      {paymentData.selectedPackage}
                    </Typography>
                  </Grid>
                )}
                {paymentData.onlineClasses > 0 && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="body1">
                      <Typography component="span" fontWeight="600">
                        Online Classes:
                      </Typography>{" "}
                      {paymentData.onlineClasses}
                    </Typography>
                  </Grid>
                )}
                {paymentData.offlineClasses > 0 && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="body1">
                      <Typography component="span" fontWeight="600">
                        Offline Classes:
                      </Typography>{" "}
                      {paymentData.offlineClasses}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>

          {/* Payment Details */}
          <Card variant="outlined" sx={{ mb: 4, borderRadius: 1 }}>
            <CardHeader
              avatar={<PaymentIcon sx={{ color: "#642b8f" }} />}
              title="Payment Details"
              sx={{
                backgroundColor: "#f3e5f5",
                py: 1.5,
                "& .MuiCardHeader-title": {
                  fontWeight: 600,
                  color: "#642b8f",
                },
              }}
            />
            <CardContent>
              <Grid container spacing={2}>
                {paymentData.baseAmount !== undefined && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="body1">
                      <Typography component="span" fontWeight="600">
                        Base Amount:
                      </Typography>{" "}
                      ₹
                      {typeof paymentData.baseAmount === "number"
                        ? paymentData.baseAmount.toFixed(2)
                        : paymentData.baseAmount}
                    </Typography>
                  </Grid>
                )}
                {paymentData.discount > 0 && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="body1" sx={{ color: "#4caf50" }}>
                      <Typography component="span" fontWeight="600">
                        Discount:
                      </Typography>{" "}
                      -₹
                      {typeof paymentData.discount === "number"
                        ? paymentData.discount.toFixed(2)
                        : paymentData.discount}
                    </Typography>
                  </Grid>
                )}
                {paymentData.paymentId && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="body1">
                      <Typography component="span" fontWeight="600">
                        Payment ID:
                      </Typography>{" "}
                      {paymentData.paymentId}
                    </Typography>
                  </Grid>
                )}
                {transactionDetails.transactionId &&
                  paymentStatus === "completed" && (
                    <Grid item xs={12} md={6}>
                      <Typography variant="body1">
                        <Typography component="span" fontWeight="600">
                          Transaction ID:
                        </Typography>{" "}
                        {transactionDetails.transactionId}
                      </Typography>
                    </Grid>
                  )}
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Box
                sx={{
                  backgroundColor: "#f9f5ff",
                  p: 2,
                  borderRadius: 1,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6" fontWeight="600">
                  Total Amount
                </Typography>
                <Typography variant="h6" fontWeight="600" color="#642b8f">
                  ₹
                  {typeof paymentData.totalAmount === "number"
                    ? paymentData.totalAmount.toFixed(2)
                    : paymentData.totalAmount || "0.00"}
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "center",
              gap: 2,
            }}
          >
            <Button
              variant="outlined"
              color="error"
              onClick={handleCancel}
              startIcon={<CancelIcon />}
              disabled={paymentStatus === "processing"}
              sx={{
                minWidth: 150,
                py: 1,
              }}
            >
              Cancel
            </Button>

            {paymentStatus !== "success" && paymentStatus !== "completed" && (
              <>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleUpdateStatus}
                  startIcon={<UpdateIcon />}
                  disabled={paymentStatus === "processing"}
                  sx={{
                    minWidth: 150,
                    py: 1,
                  }}
                >
                  Update Status
                </Button>

                <Button
                  variant="contained"
                  color="primary"
                  onClick={handlePayNow}
                  startIcon={<AccountBalanceWalletIcon />}
                  disabled={paymentStatus === "processing"}
                  sx={{
                    minWidth: 150,
                    py: 1,
                    backgroundColor: "#642b8f",
                    "&:hover": {
                      backgroundColor: "#642b8f",
                    },
                  }}
                >
                  Pay Now
                </Button>
              </>
            )}

            {(paymentStatus === "success" || paymentStatus === "completed") && (
              <Button
                variant="contained"
                color="success"
                onClick={generateInvoice}
                startIcon={<PictureAsPdfIcon />}
                sx={{
                  minWidth: 150,
                  py: 1,
                  backgroundColor: "#4caf50",
                  "&:hover": {
                    backgroundColor: "#3d8b40",
                  },
                }}
              >
                Download Invoice
              </Button>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Payment Confirmation Dialog */}
      <Dialog
        open={paymentDialogOpen}
        onClose={handlePaymentCancel}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle
          sx={{
            backgroundColor: "#642b8f",
            color: "white",
            fontWeight: 600,
          }}
        >
          Confirm Payment
        </DialogTitle>
        <DialogContent sx={{ p: 3, mt: 2 }}>
          <Typography variant="body1" gutterBottom>
            You are about to make a payment of{" "}
            <Typography component="span" fontWeight="600">
              ₹{paymentData?.totalAmount?.toFixed(2) || "0.00"}
            </Typography>{" "}
            for:
          </Typography>
          <Box
            sx={{ backgroundColor: "#f5f7ff", p: 2, borderRadius: 1, my: 2 }}
          >
            <Typography variant="body1" gutterBottom>
              <Typography component="span" fontWeight="600">
                Package:
              </Typography>{" "}
              {paymentData?.selectedPackage || "N/A"}
            </Typography>
            <Typography variant="body1">
              <Typography component="span" fontWeight="600">
                Student:
              </Typography>{" "}
              {paymentData?.kidName || "N/A"}
            </Typography>
          </Box>
          <Typography variant="body2" color="textSecondary">
            Click 'Proceed to Pay' to continue to the payment gateway.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button
            onClick={handlePaymentCancel}
            color="inherit"
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={displayRazorpay}
            color="primary"
            variant="contained"
            startIcon={<AccountBalanceWalletIcon />}
          >
            Proceed to Pay
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Status Dialog with Transaction Details and File Upload */}
      <Dialog
        open={updateDialogOpen}
        onClose={handleUpdateCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            backgroundColor: "#642b8f",
            color: "white",
            fontWeight: 600,
          }}
        >
          Update Payment Status
        </DialogTitle>
        <DialogContent sx={{ p: 3, mt: 2 }}>
          <Typography variant="body1" gutterBottom>
            Current status:{" "}
            <Chip
              label={
                paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)
              }
              size="small"
              sx={{
                backgroundColor: statusColors[paymentStatus].bg,
                color: statusColors[paymentStatus].color,
                ml: 1,
              }}
            />
          </Typography>

          <Typography
            variant="body2"
            color="textSecondary"
            sx={{ mb: 3, mt: 1 }}
          >
            Enter transaction details to mark this payment as completed.
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Transaction ID"
                name="transactionId"
                value={transactionDetails.transactionId}
                onChange={handleTransactionDetailsChange}
                required
                variant="outlined"
                margin="dense"
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth margin="dense">
                <InputLabel id="payment-mode-label">Payment Mode</InputLabel>
                <Select
                  labelId="payment-mode-label"
                  name="paymentMode"
                  value={transactionDetails.paymentMode}
                  onChange={handleTransactionDetailsChange}
                  label="Payment Mode"
                >
                  <MenuItem value="upi">UPI</MenuItem>
                  <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                  <MenuItem value="cash">Cash</MenuItem>
                  <MenuItem value="cheque">Cheque</MenuItem>
                  <MenuItem value="credit_card">Credit Card</MenuItem>
                  <MenuItem value="debit_card">Debit Card</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Remarks (Optional)"
                name="remarks"
                value={transactionDetails.remarks}
                onChange={handleTransactionDetailsChange}
                multiline
                rows={2}
                variant="outlined"
                margin="dense"
              />
            </Grid>

            <Grid item xs={12}>
              <Box
                sx={{ border: "1px dashed #aaa", borderRadius: 1, p: 2, mt: 1 }}
              >
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Upload Payment Proof (Receipt/Screenshot)
                </Typography>

                {!uploadedFile ? (
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<UploadFileIcon />}
                    sx={{ mt: 1 }}
                    fullWidth
                  >
                    Choose File
                    <input
                      ref={fileInputRef}
                      type="file"
                      hidden
                      onChange={handleFileUpload}
                      accept="image/*,.pdf"
                    />
                  </Button>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      bgcolor: "#f5f5f5",
                      p: 1,
                      borderRadius: 1,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <AttachmentIcon sx={{ mr: 1, color: "#666" }} />
                      <Typography
                        variant="body2"
                        noWrap
                        sx={{ maxWidth: "180px" }}
                      >
                        {uploadedFile.name}
                      </Typography>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={handleRemoveFile}
                      color="error"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button
            onClick={handleUpdateCancel}
            color="inherit"
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleManualStatusUpdate}
            color="primary"
            variant="contained"
            startIcon={<CheckCircleOutlineIcon />}
            disabled={!transactionDetails.transactionId}
          >
            Update Payment
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PaymentDecode;
