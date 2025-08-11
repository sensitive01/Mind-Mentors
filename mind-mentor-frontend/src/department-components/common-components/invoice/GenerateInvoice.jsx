import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  Autocomplete,
  createTheme,
  ThemeProvider,
  Alert,
  Snackbar,
  CircularProgress,
  Divider,
  InputAdornment,
  Chip,
  Card,
  CardContent,
  Stack,
  Container,
  Fade,
  Zoom,
} from "@mui/material";
import {
  ArrowBack,
  Receipt,
  Person,
  Assignment,
  CurrencyRupee,
  Send,
  Search,
  AccountCircle,
  Phone,
  School,
  Calculate,
  CheckCircle,
  Info,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { getKidsForInvoiceGeneration } from "../../../api/service/employee/EmployeeService";

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
    background: {
      default: "#f8fafc",
      paper: "#ffffff",
    },
    text: {
      primary: "#1e293b",
      secondary: "#64748b",
    },
    success: {
      main: "#10b981",
      light: "#34d399",
    },
    grey: {
      50: "#f8fafc",
      100: "#f1f5f9",
      200: "#e2e8f0",
      300: "#cbd5e1",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      fontSize: "1.75rem",
      lineHeight: 1.2,
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.25rem",
    },
    h6: {
      fontWeight: 600,
      fontSize: "1.125rem",
    },
    subtitle1: {
      fontWeight: 500,
      fontSize: "1rem",
    },
    body1: {
      fontSize: "0.875rem",
      lineHeight: 1.5,
    },
    body2: {
      fontSize: "0.75rem",
      lineHeight: 1.4,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow:
            "0px 1px 3px rgba(0, 0, 0, 0.05), 0px 4px 8px rgba(0, 0, 0, 0.03)",
          border: "1px solid #f1f5f9",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.05)",
          border: "1px solid #f1f5f9",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          textTransform: "none",
          fontWeight: 600,
          fontSize: "0.875rem",
          padding: "12px 24px",
        },
        contained: {
          boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.05)",
          "&:hover": {
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
            transform: "translateY(-1px)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 10,
            backgroundColor: "#ffffff",
            transition: "all 0.2s ease-in-out",
            "& fieldset": {
              borderColor: "#e2e8f0",
              borderWidth: 2,
            },
            "&:hover fieldset": {
              borderColor: "#cbd5e1",
            },
            "&.Mui-focused fieldset": {
              borderWidth: 2,
              borderColor: "#642b8f",
            },
            "&.Mui-focused": {
              transform: "translateY(-1px)",
              boxShadow: "0px 2px 8px rgba(100, 43, 143, 0.1)",
            },
          },
        },
      },
    },
  },
});

const GenerateInvoice = () => {
  const navigate = useNavigate();
  const [kidsData, setKidsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Form state
  const [formData, setFormData] = useState({
    selectedKid: null,
    selectedProgram: null,
    purpose: "",
    baseAmount: "",
    gstPercentage: 18,
    totalAmount: "",
  });

  // Transform kids data for autocomplete
  const [kidOptions, setKidOptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getKidsForInvoiceGeneration();

        if (response.status === 200) {
          setKidsData(response.data.data);

          // Transform data for autocomplete
          const options = [];
          response.data.data.forEach((kid) => {
            kid.programs.forEach((program) => {
              options.push({
                id: `${kid._id}_${program._id}`,
                kidId: kid.kidId,
                kidFirstName: kid.kidFirstName,
                parentFirstName: kid.parentFirstName,
                whatsappNumber: kid.whatsappNumber,
                contactNumber: kid.contactNumber,
                program: program.program,
                level: program.level,
                status: program.status,
                demoAttended: program.demoAttended,
                label: `${kid.kidFirstName} - ${program.program} (${program.level})`,
                searchText:
                  `${kid.kidFirstName} ${kid.parentFirstName} ${program.program} ${program.level}`.toLowerCase(),
              });
            });
          });

          setKidOptions(options);
        }
      } catch (error) {
        console.error("Error fetching kids data:", error);
        setSnackbar({
          open: true,
          message: "Failed to load kids data",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate total amount when base amount or GST changes
  useEffect(() => {
    if (formData.baseAmount && !isNaN(formData.baseAmount)) {
      const base = parseFloat(formData.baseAmount);
      const gst = (base * formData.gstPercentage) / 100;
      const total = base + gst;
      setFormData((prev) => ({
        ...prev,
        totalAmount: total.toFixed(2),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        totalAmount: "",
      }));
    }
  }, [formData.baseAmount, formData.gstPercentage]);

  const handleKidSelection = (event, newValue) => {
    setFormData((prev) => ({
      ...prev,
      selectedKid: newValue,
      selectedProgram: newValue
        ? {
            program: newValue.program,
            level: newValue.level,
            status: newValue.status,
          }
        : null,
    }));
  };

  const handleInputChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validation
    if (!formData.selectedKid) {
      setSnackbar({
        open: true,
        message: "Please select a kid and program",
        severity: "error",
      });
      return;
    }

    if (!formData.purpose.trim()) {
      setSnackbar({
        open: true,
        message: "Please enter the purpose of invoice",
        severity: "error",
      });
      return;
    }

    if (
      !formData.baseAmount ||
      isNaN(formData.baseAmount) ||
      parseFloat(formData.baseAmount) <= 0
    ) {
      setSnackbar({
        open: true,
        message: "Please enter a valid amount",
        severity: "error",
      });
      return;
    }

    try {
      setSubmitting(true);

      // Prepare invoice data
      const invoiceData = {
        kidId: formData.selectedKid.kidId,
        kidFirstName: formData.selectedKid.kidFirstName,
        parentFirstName: formData.selectedKid.parentFirstName,
        whatsappNumber: formData.selectedKid.whatsappNumber,
        contactNumber: formData.selectedKid.contactNumber,
        program: formData.selectedProgram,
        purpose: formData.purpose.trim(),
        baseAmount: parseFloat(formData.baseAmount),
        gstPercentage: formData.gstPercentage,
        gstAmount:
          (parseFloat(formData.baseAmount) * formData.gstPercentage) / 100,
        totalAmount: parseFloat(formData.totalAmount),
        createdAt: new Date().toISOString(),
        invoiceNumber: `INV-${Date.now()}`,
      };

      console.log("Invoice Data to be sent:", invoiceData);

      // Here you would call your API to save the invoice
      // const response = await saveInvoiceData(invoiceData);

      const paymentLink = generatePaymentLink(invoiceData);

      setSnackbar({
        open: true,
        message: `Invoice generated successfully! Payment link sent to ${formData.selectedKid.parentFirstName}`,
        severity: "success",
      });

      // Reset form
      setFormData({
        selectedKid: null,
        selectedProgram: null,
        purpose: "",
        baseAmount: "",
        gstPercentage: 18,
        totalAmount: "",
      });
    } catch (error) {
      console.error("Error generating invoice:", error);
      setSnackbar({
        open: true,
        message: "Failed to generate invoice. Please try again.",
        severity: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const generatePaymentLink = (invoiceData) => {
    const baseUrl = window.location.origin;
    const paymentLink = `${baseUrl}/payment/${invoiceData.invoiceNumber}`;
    console.log("Generated Payment Link:", paymentLink);
    return paymentLink;
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            bgcolor: "background.default",
            gap: 3,
          }}
        >
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h6" color="text.secondary">
            Loading student data...
          </Typography>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
          {/* Header Section */}
          <Fade in timeout={500}>
            <Box sx={{ mb: 4 }}>
              <Button
                startIcon={<ArrowBack />}
                onClick={handleBack}
                sx={{
                  mb: 3,
                  color: "text.secondary",
                  "&:hover": {
                    bgcolor: "grey.100",
                    transform: "translateX(-4px)",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                Back to Invoice Management
              </Button>

              <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, mb: 3 }}>
                <Stack direction="row" spacing={3} alignItems="center">
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 3,
                      bgcolor: "primary.main",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background:
                        "linear-gradient(135deg, #642b8f 0%, #8354ab 100%)",
                    }}
                  >
                    <Receipt sx={{ fontSize: 28, color: "white" }} />
                  </Box>
                  <Box>
                    <Typography variant="h4" sx={{ mb: 1 }}>
                      Generate New Invoice
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Create and send payment invoice to parents
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Box>
          </Fade>

          {/* Main Form */}
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              {/* Student Selection Card */}
              <Zoom in timeout={600}>
                <Card>
                  <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                    <Stack
                      direction="row"
                      spacing={2}
                      alignItems="center"
                      sx={{ mb: 3 }}
                    >
                      <Person sx={{ color: "primary.main", fontSize: 28 }} />
                      <Typography variant="h5">
                        Student & Program Selection
                      </Typography>
                    </Stack>

                    <Autocomplete
                      options={kidOptions}
                      value={formData.selectedKid}
                      onChange={handleKidSelection}
                      getOptionLabel={(option) => option.label || ""}
                      isOptionEqualToValue={(option, value) =>
                        option.id === value?.id
                      }
                      filterOptions={(options, { inputValue }) => {
                        return options.filter((option) =>
                          option.searchText.includes(inputValue.toLowerCase())
                        );
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Search Student & Program"
                          placeholder="Type student name or program..."
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <InputAdornment position="start">
                                <Search color="action" />
                              </InputAdornment>
                            ),
                          }}
                          required
                        />
                      )}
                      renderOption={(props, option) => (
                        <Box component="li" {...props} sx={{ p: 2.5 }}>
                          <Box sx={{ width: "100%" }}>
                            <Stack
                              direction="row"
                              justifyContent="space-between"
                              alignItems="start"
                              sx={{ mb: 1 }}
                            >
                              <Typography variant="subtitle1" fontWeight="600">
                                {option.kidFirstName}
                              </Typography>
                              <Chip
                                size="small"
                                label={option.status}
                                color={
                                  option.status === "Active"
                                    ? "success"
                                    : "default"
                                }
                                variant="outlined"
                                icon={
                                  option.status === "Active" ? (
                                    <CheckCircle sx={{ fontSize: 16 }} />
                                  ) : (
                                    <Info sx={{ fontSize: 16 }} />
                                  )
                                }
                              />
                            </Stack>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mb: 1.5 }}
                            >
                              Parent: {option.parentFirstName} •{" "}
                              {option.whatsappNumber}
                            </Typography>
                            <Stack direction="row" spacing={1}>
                              <Chip
                                size="small"
                                label={option.program}
                                color="primary"
                                variant="outlined"
                              />
                              <Chip
                                size="small"
                                label={option.level}
                                color="secondary"
                                variant="outlined"
                              />
                            </Stack>
                          </Box>
                        </Box>
                      )}
                      noOptionsText="No students found. Try different keywords."
                    />
                  </CardContent>
                </Card>
              </Zoom>

              {/* Selected Details Card */}
              {formData.selectedKid && (
                <Fade in timeout={400}>
                  <Card
                    sx={{
                      bgcolor: "rgba(100, 43, 143, 0.02)",
                      borderColor: "rgba(100, 43, 143, 0.1)",
                      border: "2px solid",
                    }}
                  >
                    <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                      <Typography
                        variant="h6"
                        color="primary.main"
                        sx={{ mb: 3 }}
                      >
                        Selected Details
                      </Typography>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={3}>
                          <Stack spacing={1}>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                textTransform: "uppercase",
                                fontSize: "0.75rem",
                                letterSpacing: 1,
                              }}
                            >
                              Student
                            </Typography>
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                            >
                              <AccountCircle
                                sx={{ fontSize: 18, color: "primary.main" }}
                              />
                              <Typography variant="body1" fontWeight="600">
                                {formData.selectedKid.kidFirstName}
                              </Typography>
                            </Stack>
                          </Stack>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <Stack spacing={1}>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                textTransform: "uppercase",
                                fontSize: "0.75rem",
                                letterSpacing: 1,
                              }}
                            >
                              Parent
                            </Typography>
                            <Typography variant="body1" fontWeight="600">
                              {formData.selectedKid.parentFirstName}
                            </Typography>
                          </Stack>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <Stack spacing={1}>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                textTransform: "uppercase",
                                fontSize: "0.75rem",
                                letterSpacing: 1,
                              }}
                            >
                              Program
                            </Typography>
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                            >
                              <School
                                sx={{ fontSize: 18, color: "primary.main" }}
                              />
                              <Typography variant="body1" fontWeight="600">
                                {formData.selectedKid.program} (
                                {formData.selectedKid.level})
                              </Typography>
                            </Stack>
                          </Stack>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <Stack spacing={1}>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                textTransform: "uppercase",
                                fontSize: "0.75rem",
                                letterSpacing: 1,
                              }}
                            >
                              Contact
                            </Typography>
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                            >
                              <Phone
                                sx={{ fontSize: 18, color: "primary.main" }}
                              />
                              <Typography variant="body1" fontWeight="600">
                                {formData.selectedKid.whatsappNumber}
                              </Typography>
                            </Stack>
                          </Stack>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Fade>
              )}

              {/* Invoice Details Card */}
              <Zoom in timeout={800}>
                <Card>
                  <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                    <Stack
                      direction="row"
                      spacing={2}
                      alignItems="center"
                      sx={{ mb: 3 }}
                    >
                      <Assignment
                        sx={{ color: "primary.main", fontSize: 28 }}
                      />
                      <Typography variant="h5">Invoice Details</Typography>
                    </Stack>

                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Purpose of Invoice"
                          value={formData.purpose}
                          onChange={handleInputChange("purpose")}
                          placeholder="e.g., Monthly fee for January 2025, Registration fee, etc."
                          multiline
                          rows={3}
                          required
                        />
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          label="Base Amount"
                          type="number"
                          value={formData.baseAmount}
                          onChange={handleInputChange("baseAmount")}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <CurrencyRupee sx={{ fontSize: 20 }} />
                              </InputAdornment>
                            ),
                          }}
                          placeholder="0.00"
                          required
                        />
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          label="GST Percentage"
                          type="number"
                          value={formData.gstPercentage}
                          onChange={handleInputChange("gstPercentage")}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">%</InputAdornment>
                            ),
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          label="GST Amount"
                          value={
                            formData.baseAmount
                              ? `₹${(
                                  (parseFloat(formData.baseAmount) *
                                    formData.gstPercentage) /
                                  100
                                ).toFixed(2)}`
                              : "₹0.00"
                          }
                          InputProps={{
                            readOnly: true,
                          }}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              backgroundColor: "grey.50",
                            },
                          }}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Zoom>

              {/* Total Amount Card */}
              {formData.baseAmount && (
                <Fade in timeout={400}>
                  <Card
                    sx={{
                      bgcolor: "rgba(245, 166, 35, 0.02)",
                      borderColor: "rgba(245, 166, 35, 0.2)",
                      border: "2px solid",
                    }}
                  >
                    <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                      <Stack
                        direction="row"
                        spacing={2}
                        alignItems="center"
                        sx={{ mb: 3 }}
                      >
                        <Calculate
                          sx={{ color: "secondary.main", fontSize: 28 }}
                        />
                        <Typography variant="h6" color="secondary.main">
                          Invoice Summary
                        </Typography>
                      </Stack>

                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        justifyContent="space-between"
                        alignItems={{ xs: "start", sm: "center" }}
                        spacing={2}
                      >
                        <Typography variant="h6" color="text.primary">
                          Total Amount (Including GST)
                        </Typography>
                        <Typography
                          variant="h4"
                          fontWeight="700"
                          color="secondary.main"
                        >
                          ₹{formData.totalAmount}
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                </Fade>
              )}

              {/* Action Buttons */}
              <Fade in timeout={1000}>
                <Card>
                  <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={2}
                      justifyContent="flex-end"
                    >
                      <Button
                        variant="outlined"
                        onClick={handleBack}
                        disabled={submitting}
                        size="large"
                        sx={{ minWidth: { xs: "100%", sm: 120 } }}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        startIcon={
                          submitting ? (
                            <CircularProgress size={20} color="inherit" />
                          ) : (
                            <Send />
                          )
                        }
                        disabled={submitting}
                        size="large"
                        sx={{
                          minWidth: { xs: "100%", sm: 220 },
                          px: 3,
                          background:
                            "linear-gradient(135deg, #642b8f 0%, #8354ab 100%)",
                        }}
                      >
                        {submitting
                          ? "Generating Invoice..."
                          : "Generate & Send Invoice"}
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Fade>
            </Stack>
          </form>
        </Container>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
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

export default GenerateInvoice;
