// ViewPackageDialog.jsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
} from "@mui/material";
import {
  School,
  LocationOn,
} from "@mui/icons-material";

const ViewPackageDialog = ({ open, onClose, selectedPackage }) => {
  if (!selectedPackage) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Typography variant="h6" component="div">
          Package Details
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
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
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          onClick={onClose}
          variant="contained"
          color="primary"
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewPackageDialog;