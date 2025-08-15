import { useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  IconButton,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  TextField,
  Checkbox,
  FormControlLabel,
  Grid,
  Stepper,
  Step,
  StepLabel,
  Container,
} from "@mui/material";
import PhoneInput from "react-phone-input-2";
import { ArrowRight, ArrowLeft, UserPlus } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { StepperContext } from "../completion-status-bar/StepperContext";
import { useDispatch, useSelector } from "react-redux";
import { setFormData } from "../../store/regDataParentKidsSlice";
import { registerKidData } from "../../api/service/parent/ParentService";
import mindMentorImage from "../../assets/newLogo.png";

const ParentRegistration = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state } = useLocation();
  const { phoneNumber } = state || {};
  const { currentStep, nextStep } = useContext(StepperContext);
  const regFormData = useSelector((state) => state.formData);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  // Initialize form state from Redux
  const [formState, setFormState] = useState({
    mobile: phoneNumber || regFormData.mobile || "",
    email: regFormData.email || "",
    name: regFormData.name || "",
    childName: regFormData.childName || "",
    isMobileWhatsapp: regFormData.isMobileWhatsapp || true,
    enqId: state?.data?.enqId || "",
    parentId: state?.data?.parentId || "",
  });

  const [country, setCountry] = useState("in");
  const [isCooldown, setIsCooldown] = useState(false);

  const steps = ["Parent Registration", "Kids Registration", "Enrollment"];

  // Handle form field changes
  const handleFieldChange = (field, value) => {
    setFormState({
      ...formState,
      [field]: value,
    });
  };

  const handleMobileChange = (value, countryData) => {
    handleFieldChange("mobile", value);
    setCountry(countryData.countryCode);
  };

  const handleCheckboxChange = (e) => {
    const checked = e.target.checked;
    handleFieldChange("isMobileWhatsapp", checked);
    if (checked) {
      handleFieldChange("mobile", phoneNumber || "");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isCooldown) return;

    const { mobile, email, name, childName, isMobileWhatsapp } = formState;

    if (!email || !name || !childName || !mobile) {
      toast.error("Please fill out all fields before submitting.");
      setIsCooldown(true);
      setTimeout(() => setIsCooldown(false), 5000);
      return;
    }

    setIsCooldown(true);
    setTimeout(() => setIsCooldown(false), 5000);

    dispatch(setFormData(formState));

    const response = await registerKidData(formState);
    if (response.status === 200) {
      toast.success(response.data.message);
      setTimeout(() => {
        nextStep();
        navigate("/parent/parent-kids-registration", { state: formState });
      }, 1000);
    }
  };

  const handleSkipDashboard = () => {
    if (state?.data?.parentId) {
      localStorage.setItem("parentId", state.data.parentId);
    }
    toast.info("Kids Registration is incomplete, moving to dashboard");
    if (isCooldown) return;
    setIsCooldown(true);
    setTimeout(() => setIsCooldown(false), 5000);

    setTimeout(() => {
      navigate("/parent/dashboard");
    }, 1500);
  };

  const handleBack = () => {
    navigate("/parent/registration");
  };

  const phoneInputStyle = {
    container: "!w-full !relative",
    input: isMobile
      ? "!w-full !h-12 !text-sm !pl-12 !pr-3 !border-2 !border-gray-200 !rounded-lg !bg-white focus:!ring-0 focus:!border-[#642b8f] !transition-all !duration-300 !outline-none !box-border"
      : "!w-full !h-14 !text-base !pl-14 !pr-4 !border-2 !border-gray-200 !rounded-lg !bg-white focus:!ring-0 focus:!border-[#642b8f] !transition-all !duration-300 !outline-none !box-border",
    button: isMobile
      ? "!h-12 !bg-transparent !border-0 !border-r-2 !border-r-gray-200 !rounded-l-lg !px-2 !flex !items-center !justify-center !absolute !left-0 !top-0 !z-10"
      : "!h-14 !bg-transparent !border-0 !border-r-2 !border-r-gray-200 !rounded-l-lg !px-3 !flex !items-center !justify-center !absolute !left-0 !top-0 !z-10",
    dropdown:
      "!bg-white !shadow-lg !rounded-lg !border-2 !border-gray-200 !mt-1 !z-[1000] !min-w-[300px] !w-[350px] !max-h-[200px] !overflow-y-auto !left-0",
    search:
      "!w-full !mx-0 !my-0 !px-3 !py-2 !border-0 !border-b !border-b-gray-200 !rounded-none !text-sm !h-10 !bg-gray-50 !box-border",
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        background: "#642b8f",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: { xs: 2, sm: 3 },
          minHeight: { xs: "64px", sm: "72px" },
        }}
      >
        {/* Logo */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <img
            src={mindMentorImage}
            alt="Mind Mentorz Logo"
            style={{
              height: isMobile ? "28px" : "36px",
              width: "auto",
              filter: "brightness(0) invert(1)",
            }}
          />
        </Box>

        {/* Back Button */}
        <IconButton
          onClick={() => navigate(-1)}
          sx={{
            backgroundColor: "rgba(255,255,255,0.1)",
            color: "white",
            border: "1px solid rgba(255,255,255,0.2)",
            width: { xs: 40, sm: 44 },
            height: { xs: 40, sm: 44 },
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.2)",
            },
          }}
        >
          <ArrowLeft size={isMobile ? 18 : 20} />
        </IconButton>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          px: { xs: 2, sm: 4 },
          py: { xs: 1, sm: 2 },
          overflow: "auto",
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "rgba(255,255,255,0.1)",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(255,255,255,0.3)",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "rgba(255,255,255,0.5)",
          },
        }}
      >
        {/* Main Card */}
        <Card
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: { xs: "100%", sm: "600px", md: "700px", lg: "800px" },
            minHeight: "auto",
            backgroundColor: "white",
            borderRadius: { xs: 2, sm: 3 },
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
            my: { xs: 1, sm: 2 },
          }}
        >
          <CardContent
            sx={{
              p: { xs: 3, sm: 4, md: 5 },
            }}
          >
            {/* Registration Avatar */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mb: { xs: 2, sm: 3 },
              }}
            >
              <Box
                sx={{
                  width: { xs: 60, sm: 70, md: 80 },
                  height: { xs: 60, sm: 70, md: 80 },
                  backgroundColor: "#642b8f",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <UserPlus
                  size={isMobile ? 24 : isTablet ? 28 : 32}
                  style={{ color: "white" }}
                />
              </Box>
            </Box>

            {/* Stepper */}
            <Box sx={{ mb: { xs: 2, sm: 3 } }}>
              <Stepper activeStep={currentStep - 1} alternativeLabel>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel
                      sx={{
                        "& .MuiStepLabel-label": {
                          fontSize: { xs: "0.75rem", sm: "0.875rem" },
                          fontWeight: 500,
                        },
                        "& .MuiStepIcon-root": {
                          color: "#e0e0e0",
                          fontSize: { xs: "1.2rem", sm: "1.5rem" },
                        },
                        "& .MuiStepIcon-root.Mui-active": {
                          color: "#642b8f",
                        },
                        "& .MuiStepIcon-root.Mui-completed": {
                          color: "#642b8f",
                        },
                      }}
                    >
                      {label}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>

            {/* Header Text */}
            <Typography
              variant="h5"
              sx={{
                color: "#2c3e50",
                fontWeight: 700,
                mb: 1,
                fontSize: { xs: "1.1rem", sm: "1.3rem", md: "1.5rem" },
                textAlign: "center",
              }}
            >
              Update More Details to your Profile
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "#7f8c8d",
                mb: { xs: 2, sm: 3 },
                fontSize: { xs: "0.8rem", sm: "0.9rem" },
                textAlign: "center",
                lineHeight: 1.4,
              }}
            >
              The Details given will be kept confidential and will not be used
              for any marketing purposes
            </Typography>

            {/* Form Container - No Internal Scroll */}
            <Box>
              <Box component="form" onSubmit={handleSubmit}>
                {/* Phone Number Section */}
                <Box sx={{ mb: 3 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formState.isMobileWhatsapp}
                        onChange={handleCheckboxChange}
                        sx={{
                          color: "#642b8f",
                          "&.Mui-checked": {
                            color: "#642b8f",
                          },
                        }}
                      />
                    }
                    label={
                      <Typography
                        sx={{
                          fontSize: { xs: "0.85rem", sm: "0.9rem" },
                          color: "#642b8f",
                          fontWeight: 600,
                        }}
                      >
                        Is Phone Number same as WhatsApp number
                      </Typography>
                    }
                    sx={{ mb: 1 }}
                  />

                  <Box sx={{ position: "relative", zIndex: 1 }}>
                    <PhoneInput
                      country={country}
                      value={formState.mobile}
                      onChange={handleMobileChange}
                      inputProps={{
                        name: "mobile",
                        required: true,
                        disabled: formState.isMobileWhatsapp,
                        placeholder: formState.isMobileWhatsapp
                          ? ""
                          : "Enter your number",
                      }}
                      containerClass={phoneInputStyle.container}
                      inputClass={phoneInputStyle.input}
                      buttonClass={phoneInputStyle.button}
                      dropdownClass={phoneInputStyle.dropdown}
                      searchClass={phoneInputStyle.search}
                      enableSearch={true}
                      countryCodeEditable={!formState.isMobileWhatsapp}
                    />
                  </Box>

                  <Typography
                    sx={{ fontSize: "0.75rem", color: "#642b8f", mt: 0.5 }}
                  >
                    Will also be used for class notifications and to avoid calls
                  </Typography>
                </Box>

                {/* Email Section */}
                <Box sx={{ mb: 3 }}>
                  <TextField
                    type="email"
                    value={formState.email}
                    onChange={(e) => handleFieldChange("email", e.target.value)}
                    placeholder="Enter your email ID"
                    fullWidth
                    required
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        "& fieldset": {
                          borderColor: "#e0e0e0",
                          borderWidth: "2px",
                        },
                        "&:hover fieldset": {
                          borderColor: "#642b8f",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#642b8f",
                        },
                      },
                      "& .MuiInputBase-input": {
                        fontSize: { xs: "0.9rem", sm: "1rem" },
                        py: { xs: 1.5, sm: 2 },
                      },
                    }}
                  />
                  <Typography
                    sx={{ fontSize: "0.75rem", color: "#642b8f", mt: 0.5 }}
                  >
                    Will be used for sending payment invoices
                  </Typography>
                </Box>

                {/* Name Fields */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      type="text"
                      value={formState.name}
                      onChange={(e) =>
                        handleFieldChange("name", e.target.value)
                      }
                      placeholder="Enter your name"
                      fullWidth
                      required
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          "& fieldset": {
                            borderColor: "#e0e0e0",
                            borderWidth: "2px",
                          },
                          "&:hover fieldset": {
                            borderColor: "#642b8f",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#642b8f",
                          },
                        },
                        "& .MuiInputBase-input": {
                          fontSize: { xs: "0.9rem", sm: "1rem" },
                          py: { xs: 1.5, sm: 2 },
                        },
                      }}
                    />
                    <Typography
                      sx={{ fontSize: "0.75rem", color: "#642b8f", mt: 0.5 }}
                    >
                      Guardian's name / Invoice name
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      type="text"
                      value={formState.childName}
                      onChange={(e) =>
                        handleFieldChange("childName", e.target.value)
                      }
                      placeholder="Enter your child name"
                      fullWidth
                      required
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          "& fieldset": {
                            borderColor: "#e0e0e0",
                            borderWidth: "2px",
                          },
                          "&:hover fieldset": {
                            borderColor: "#642b8f",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#642b8f",
                          },
                        },
                        "& .MuiInputBase-input": {
                          fontSize: { xs: "0.9rem", sm: "1rem" },
                          py: { xs: 1.5, sm: 2 },
                        },
                      }}
                    />
                    <Typography
                      sx={{ fontSize: "0.75rem", color: "#642b8f", mt: 0.5 }}
                    >
                      Child Name
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Box>

            {/* Action Buttons */}
            <Box
              sx={{
                display: "flex",
                gap: { xs: 1, sm: 1.5 },
                mt: { xs: 2, sm: 3 },
              }}
            >
              <Button
                onClick={handleBack}
                variant="contained"
                sx={{
                  backgroundColor: "#642b8f",
                  flex: "0 0 auto",
                  minWidth: { xs: "60px", sm: "80px" },
                  py: { xs: 1.25, sm: 1.5 },
                  fontSize: { xs: "0.8rem", sm: "0.9rem" },
                  fontWeight: 600,
                  borderRadius: 2,
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "#512166",
                  },
                }}
                startIcon={<ArrowLeft size={16} />}
              >
                Back
              </Button>

              <Button
                onClick={handleSkipDashboard}
                variant="outlined"
                disabled={isCooldown}
                sx={{
                  borderColor: "#642b8f",
                  color: "#642b8f",
                  flex: 1,
                  py: { xs: 1.25, sm: 1.5 },
                  fontSize: { xs: "0.8rem", sm: "0.9rem" },
                  fontWeight: 600,
                  borderRadius: 2,
                  textTransform: "none",
                  borderWidth: "2px",
                  "&:hover": {
                    backgroundColor: "#642b8f",
                    color: "white",
                    borderColor: "#642b8f",
                    borderWidth: "2px",
                  },
                  "&:disabled": {
                    borderColor: "#bdc3c7",
                    color: "#bdc3c7",
                  },
                }}
              >
                Skip to Dashboard
              </Button>

              <Button
                onClick={handleSubmit}
                variant="contained"
                disabled={isCooldown}
                sx={{
                  backgroundColor: "#642b8f",
                  flex: "0 0 auto",
                  minWidth: { xs: "60px", sm: "80px" },
                  py: { xs: 1.25, sm: 1.5 },
                  fontSize: { xs: "0.8rem", sm: "0.9rem" },
                  fontWeight: 600,
                  borderRadius: 2,
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "#512166",
                  },
                  "&:disabled": {
                    backgroundColor: "#bdc3c7",
                    color: "white",
                  },
                }}
                endIcon={<ArrowRight size={16} />}
              >
                Next
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>

      <ToastContainer
        position={isMobile ? "top-center" : "top-right"}
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        pauseOnFocusLoss
        toastClassName="!text-sm !rounded-lg"
      />
    </Box>
  );
};

export default ParentRegistration;
