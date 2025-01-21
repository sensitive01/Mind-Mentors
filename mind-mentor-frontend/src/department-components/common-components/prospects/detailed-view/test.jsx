import { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  MenuItem,
  Grid,
  Slide,
} from "@mui/material";

const PaymentDialog = ({ open, onClose, data }) => {
  const [paymentDetails, setPaymentDetails] = useState({
    amount: "",
    paymentLink: "",
    previouslyPaidAmount: "",
    currentExpirationDate: "",
    nextExpirationDate: "",
    numberOfClasses: "",
    validityDays: "",
    paymentMode: "",
  });

  const paymentModes = [
    { value: "upi", label: "UPI" },
    { value: "netBanking", label: "Net Banking" },
    { value: "card", label: "Card" },
    { value: "cash", label: "Cash" },
  ];

  const handleInputChange = (field, value) => {
    setPaymentDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log("Payment Details:", paymentDetails);
    setPaymentDetails({
      amount: "",
      paymentLink: "",
      previouslyPaidAmount: "",
      currentExpirationDate: "",
      nextExpirationDate: "",
      numberOfClasses: "",
      validityDays: "",
      paymentMode: "",
    });
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      TransitionComponent={Slide}
      TransitionProps={{
        direction: "left",
        timeout: {
          enter: 300,
          exit: 200,
        },
      }}
      PaperProps={{
        sx: {
          borderRadius: 2,
          position: "fixed",
          right: 0,
          top: 0,
          bottom: 0,
          m: 0,
          maxWidth: "600px",
          width: "100%",
          height: "100%",
          boxShadow: "-4px 0 8px rgba(0, 0, 0, 0.1)",
        },
      }}
      sx={{
        "& .MuiDialog-container": {
          justifyContent: "flex-end",
        },
      }}
    >
      <DialogTitle
        sx={{
          borderBottom: "1px solid",
          background: "linear-gradient(#642b8f, #aa88be)",
          color: "#ffffff",
          fontWeight: 600,
          px: 3,
          py: 2,
        }}
      >
        Send Payment Link
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="subtitle2"
                sx={{ mb: 1, color: "text.secondary" }}
              >
                Kid Name
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {data?.kidName || "N/A"}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="subtitle2"
                sx={{ mb: 1, color: "text.secondary" }}
              >
                WhatsApp Number
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {data?.whatsappNumber || "N/A"}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Previously Paid Amount"
              type="number"
              value={paymentDetails.previouslyPaidAmount}
              onChange={(e) =>
                handleInputChange("previouslyPaidAmount", e.target.value)
              }
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Current Amount"
              type="number"
              value={paymentDetails.amount}
              onChange={(e) => handleInputChange("amount", e.target.value)}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Current Expiration Date"
              type="date"
              value={paymentDetails.currentExpirationDate}
              onChange={(e) =>
                handleInputChange("currentExpirationDate", e.target.value)
              }
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Next Expiration Date"
              type="date"
              value={paymentDetails.nextExpirationDate}
              onChange={(e) =>
                handleInputChange("nextExpirationDate", e.target.value)
              }
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              select
              label="Payment Mode"
              value={paymentDetails.paymentMode}
              onChange={(e) => handleInputChange("paymentMode", e.target.value)}
            >
              {paymentModes.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Number of Classes"
              type="number"
              value={paymentDetails.numberOfClasses}
              onChange={(e) =>
                handleInputChange("numberOfClasses", e.target.value)
              }
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Validity Days"
              type="number"
              value={paymentDetails.validityDays}
              onChange={(e) =>
                handleInputChange("validityDays", e.target.value)
              }
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Payment Link"
              value={paymentDetails.paymentLink}
              onChange={(e) => handleInputChange("paymentLink", e.target.value)}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions
        sx={{
          p: 3,
          borderTop: "1px solid",
          borderColor: "divider",
          position: "sticky",
          bottom: 0,
          bgcolor: "background.paper",
          zIndex: 1,
        }}
      >
        <Button onClick={onClose} variant="outlined" sx={{ mr: 1 }}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={!paymentDetails.amount || !paymentDetails.paymentLink}
        >
          Send Link
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentDialog;
