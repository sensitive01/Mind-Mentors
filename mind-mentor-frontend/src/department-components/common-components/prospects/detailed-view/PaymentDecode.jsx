import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Button, Grid, Typography, Paper, Card } from "@mui/material";

const PaymentDetailsPage = () => {
  const { encodedData } = useParams();
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const sanitizedData = encodedData.replace(/-/g, "+").replace(/_/g, "/");
      const decodedData = JSON.parse(atob(sanitizedData));
      console.log("Decoded payment data:", decodedData);
      setPaymentData(decodedData);
    } catch (err) {
      console.error("Error decoding data:", err);
      setError("Invalid payment link");
    }
  }, [encodedData]);

  const handleSubmit = async () => {
    console.log("Submitting payment:", paymentData);
    // Implement payment submission logic here
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (error) {
    return (
      <Box className="h-screen bg-gray-50 flex items-center justify-center p-4">
        <Paper elevation={3} className="p-6 max-w-md w-full">
          <Typography variant="h6" color="error" align="center">
            Error
          </Typography>
          <Typography variant="body1" align="center">
            {error}
          </Typography>
        </Paper>
      </Box>
    );
  }

  if (!paymentData) {
    return (
      <Box className="h-screen bg-gray-50 flex items-center justify-center p-4">
        <Typography variant="body1" color="textSecondary">
          Loading payment details...
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="h-screen bg-gray-50 p-4">
      <Paper elevation={3} className="p-6 rounded-lg shadow-md">
        <Typography variant="h5" className="mb-4" align="center">
          Payment Details
        </Typography>

        {/* Student Information */}
        <Card variant="outlined" className="mb-4">
          <Grid container spacing={2} className="p-4">
            <Grid item xs={12}>
              <Typography variant="h6" className="mb-2">
                Student Information
              </Typography>
            </Grid>
            {paymentData.kidName && (
              <Grid item xs={12} md={6}>
                <Typography variant="body1">
                  <strong>Kid Name:</strong> {paymentData.kidName}
                </Typography>
              </Grid>
            )}
            {paymentData.whatsappNumber && (
              <Grid item xs={12} md={6}>
                <Typography variant="body1">
                  <strong>Mobile:</strong> {paymentData.whatsappNumber}
                </Typography>
              </Grid>
            )}
            {paymentData.programs && paymentData.programs.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="body1">
                  <strong>Programs:</strong>
                </Typography>
                {paymentData.programs.map((program, index) => (
                  <Typography key={index} variant="body2">
                    {program.program} (Level: {program.level})
                  </Typography>
                ))}
              </Grid>
            )}
          </Grid>
        </Card>

        {/* Package Details */}
        <Card variant="outlined" className="mb-4">
          <Grid container spacing={2} className="p-4">
            <Grid item xs={12}>
              <Typography variant="h6" className="mb-2">
                Package Details
              </Typography>
            </Grid>
            {paymentData.selectedPackage && (
              <Grid item xs={12} md={6}>
                <Typography variant="body1">
                  <strong>Package:</strong> {paymentData.selectedPackage}
                </Typography>
              </Grid>
            )}
            {paymentData.centerName && (
              <Grid item xs={12} md={6}>
                <Typography variant="body1">
                  <strong>Center:</strong> {paymentData.centerName}
                </Typography>
              </Grid>
            )}
            {paymentData.onlineClasses > 0 && (
              <Grid item xs={12} md={6}>
                <Typography variant="body1">
                  <strong>Online Classes:</strong> {paymentData.onlineClasses}
                </Typography>
              </Grid>
            )}
            {paymentData.offlineClasses > 0 && (
              <Grid item xs={12} md={6}>
                <Typography variant="body1">
                  <strong>Offline Classes:</strong> {paymentData.offlineClasses}
                </Typography>
              </Grid>
            )}
            {paymentData.customAmount > 0 && (
              <Grid item xs={12} md={6}>
                <Typography variant="body1">
                  <strong>Custom Amount:</strong> ₹
                  {paymentData.customAmount.toFixed(2)}
                </Typography>
              </Grid>
            )}
            {/* Display kit items if present */}
            {paymentData.kitItems && paymentData.kitItems.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="body1">
                  <strong>Kit Items:</strong>
                </Typography>
                {paymentData.kitItems
                  .filter((item) => item.name && item.quantity > 0)
                  .map((item, index) => (
                    <Typography key={index} variant="body2">
                      {item.name}: {item.quantity} unit(s)
                    </Typography>
                  ))}
              </Grid>
            )}
          </Grid>
        </Card>

        {/* Payment Details */}
        <Card variant="outlined" className="mb-4">
          <Grid container spacing={2} className="p-4">
            <Grid item xs={12}>
              <Typography variant="h6" className="mb-2">
                Payment Details
              </Typography>
            </Grid>
            {paymentData.baseAmount !== undefined && (
              <Grid item xs={12} md={6}>
                <Typography variant="body1">
                  <strong>Base Amount:</strong> ₹
                  {typeof paymentData.baseAmount === "number"
                    ? paymentData.baseAmount.toFixed(2)
                    : paymentData.baseAmount}
                </Typography>
              </Grid>
            )}
            {paymentData.discountAmount > 0 && (
              <Grid item xs={12} md={6}>
                <Typography variant="body1" className="text-green-600">
                  <strong>Discount:</strong> -₹
                  {paymentData.discountAmount.toFixed(2)}
                </Typography>
              </Grid>
            )}
            {paymentData.gstAmount !== undefined && (
              <Grid item xs={12} md={6}>
                <Typography variant="body1">
                  <strong>GST (18%):</strong> ₹
                  {typeof paymentData.gstAmount === "number"
                    ? paymentData.gstAmount.toFixed(2)
                    : paymentData.gstAmount}
                </Typography>
              </Grid>
            )}
            {paymentData.totalAmount !== undefined && (
              <Grid item xs={12} md={6}>
                <Typography
                  variant="body1"
                  className="font-bold text-purple-600"
                >
                  <strong>Total Amount:</strong> ₹
                  {typeof paymentData.totalAmount === "number"
                    ? paymentData.totalAmount.toFixed(2)
                    : paymentData.totalAmount}
                </Typography>
              </Grid>
            )}
          </Grid>
        </Card>

        {/* Action Buttons */}
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Button
              onClick={handleCancel}
              variant="outlined"
              fullWidth
              color="secondary"
            >
              Cancel
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              onClick={handleSubmit}
              variant="contained"
              color="primary"
              fullWidth
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default PaymentDetailsPage;
