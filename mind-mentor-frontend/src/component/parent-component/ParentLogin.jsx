import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Avatar,
} from "@mui/material";
import { ArrowRight, ArrowLeft, Smartphone } from "lucide-react";
import { validateForm } from "../../utils/Validation";
import { ToastContainer, toast } from "react-toastify";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useNavigate } from "react-router-dom";
import { parentLogin } from "../../api/service/parent/ParentService";
import mindMentorImage from "../../assets/newLogo.png";

const ParentLogin = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const [mobile, setMobile] = useState("");
  const [country, setCountry] = useState("in");
  const [isCooldown, setIsCooldown] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isCooldown) return;

    const { errors, formattedNumber } = validateForm(
      mobile,
      country.toUpperCase()
    );
    if (errors?.mobileNumber) {
      toast.error(errors.mobileNumber);
      setIsCooldown(true);
      setTimeout(() => setIsCooldown(false), 5000);
      return;
    }

    setIsCooldown(true);
    setTimeout(() => setIsCooldown(false), 5000);

    try {
      const parentLoginResponse = await parentLogin(formattedNumber);
      console.log("parentLoginResponse", parentLoginResponse);
      if (
        parentLoginResponse.status === 200 ||
        parentLoginResponse.status === 201
      ) {
        toast.success(parentLoginResponse?.data?.message);
        setTimeout(() => {
          navigate("/parent/enter-otp", {
            state: {
              ...parentLoginResponse?.data,
              phoneNumber: formattedNumber,
            },
          });
        }, 1500);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  const phoneInputStyle = {
    container: "!w-full !block",
    input: isMobile
      ? "!w-full !h-14 !text-base !pl-14 !pr-4 !border-2 !border-gray-200 !rounded-lg !bg-white focus:!ring-0 focus:!border-[#642b8f] !transition-all !duration-300 !outline-none !box-border"
      : "!w-full !h-16 !text-lg !pl-16 !pr-5 !border-2 !border-gray-200 !rounded-lg !bg-white focus:!ring-0 focus:!border-[#642b8f] !transition-all !duration-300 !outline-none !box-border",
    button: isMobile
      ? "!h-14 !bg-transparent !border-0 !border-r-2 !border-r-gray-200 !rounded-l-lg !px-3 !flex !items-center !justify-center !absolute !left-0 !top-0 !z-10"
      : "!h-16 !bg-transparent !border-0 !border-r-2 !border-r-gray-200 !rounded-l-lg !px-4 !flex !items-center !justify-center !absolute !left-0 !top-0 !z-10",
    dropdown:
      "!bg-white !shadow-xl !rounded-lg !border-2 !border-gray-200 !mt-1 !z-[1000] !min-w-[350px] !w-[400px] !max-h-[250px] !overflow-y-auto !left-0",
    search:
      "!w-full !mx-0 !my-0 !px-4 !py-3 !border-0 !border-b !border-b-gray-200 !rounded-none !text-base !h-12 !bg-gray-50 !box-border",
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
          onClick={() => navigate("/")}
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
          alignItems: "center",
          justifyContent: "center",
          px: { xs: 2, sm: 4 },
          pb: { xs: 2, sm: 4 },
        }}
      >
        {/* Main Card */}
        <Card
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: { xs: "100%", sm: "500px", md: "550px", lg: "600px" },
            backgroundColor: "white",
            borderRadius: { xs: 2, sm: 3 },
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
          }}
        >
          <CardContent
            sx={{
              p: { xs: 4, sm: 5, md: 6 },
              textAlign: "center",
              "&:last-child": { pb: { xs: 4, sm: 5, md: 6 } },
            }}
          >
            {/* Mobile Avatar */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mb: { xs: 3, sm: 4 },
              }}
            >
              <Avatar
                sx={{
                  width: { xs: 80, sm: 100, md: 120 },
                  height: { xs: 80, sm: 100, md: 120 },
                  backgroundColor: "#642b8f",
                  position: "relative",
                }}
              >
                <Smartphone
                  size={isMobile ? 32 : isTablet ? 40 : 48}
                  style={{ color: "white" }}
                />

                {/* WhatsApp Badge */}
                <Box
                  sx={{
                    position: "absolute",
                    top: -4,
                    right: -4,
                    width: { xs: 24, sm: 28, md: 32 },
                    height: { xs: 24, sm: 28, md: 32 },
                    backgroundColor: "#25D366",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "2px solid white",
                  }}
                >
                  <Typography
                    sx={{
                      color: "white",
                      fontWeight: "bold",
                      fontSize: { xs: "10px", sm: "11px", md: "12px" },
                    }}
                  >
                    W
                  </Typography>
                </Box>
              </Avatar>
            </Box>

            {/* Welcome Text */}
            <Typography
              variant="h5"
              sx={{
                color: "#2c3e50",
                fontWeight: 700,
                mb: 1,
                fontSize: { xs: "1.25rem", sm: "1.5rem" },
              }}
            >
              Welcome Parent!
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "#7f8c8d",
                mb: { xs: 3, sm: 4 },
                fontSize: { xs: "0.85rem", sm: "0.95rem" },
                lineHeight: 1.4,
                px: { xs: 1, sm: 2 },
              }}
            >
              Enter your WhatsApp number to get started with your child's
              learning journey
            </Typography>

            {/* Form */}
            <Box component="form" onSubmit={handleSubmit}>
              {/* Phone Input Label */}
              <Typography
                variant="body2"
                sx={{
                  color: "#34495e",
                  fontWeight: 600,
                  mb: 1.5,
                  textAlign: "left",
                  fontSize: { xs: "0.85rem", sm: "0.9rem" },
                }}
              >
                WhatsApp Number
              </Typography>

              {/* Phone Input */}
              <Box
                sx={{ mb: { xs: 2.5, sm: 3 }, position: "relative", zIndex: 1 }}
              >
                <Box
                  sx={{
                    width: "100%",
                    "& .react-tel-input": {
                      width: "100% !important",
                      display: "block !important",
                    },
                    "& .react-tel-input .form-control": {
                      width: "100% !important",
                      borderRadius: "8px",
                      boxSizing: "border-box",
                    },
                    "& .react-tel-input .flag-dropdown": {
                      borderRadius: "8px 0 0 8px",
                      position: "absolute",
                      zIndex: 1,
                    },
                    "& .react-tel-input .selected-flag": {
                      width: "auto",
                      minWidth: "52px",
                    },
                    "& .react-tel-input .country-list": {
                      width: "400px !important",
                      minWidth: "350px !important",
                      borderRadius: "8px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      left: "0 !important",
                      right: "auto !important",
                      maxHeight: "250px !important",
                      overflowY: "auto !important",
                    },
                    "& .react-tel-input .country-list .country": {
                      padding: "12px 16px !important",
                      fontSize: "15px !important",
                      display: "flex !important",
                      alignItems: "center !important",
                      gap: "12px !important",
                      whiteSpace: "nowrap !important",
                      overflow: "visible !important",
                      textOverflow: "unset !important",
                    },
                    "& .react-tel-input .country-list .country .flag": {
                      marginRight: "12px !important",
                      flexShrink: 0,
                    },
                    "& .react-tel-input .country-list .country .country-name": {
                      flex: 1,
                      minWidth: "200px !important",
                      overflow: "visible !important",
                      textOverflow: "unset !important",
                      whiteSpace: "nowrap !important",
                    },
                    "& .react-tel-input .country-list .country .dial-code": {
                      marginLeft: "auto !important",
                      fontSize: "14px !important",
                      color: "#666 !important",
                      flexShrink: 0,
                    },
                    "& .react-tel-input .country-list .country:hover": {
                      backgroundColor: "#f8f9fa !important",
                    },
                    "& .react-tel-input .country-list .search": {
                      margin: "0 !important",
                      padding: "12px 16px !important",
                      borderRadius: "0 !important",
                      borderBottom: "1px solid #e9ecef !important",
                      backgroundColor: "#f8f9fa !important",
                      width: "100% !important",
                      boxSizing: "border-box !important",
                      fontSize: "15px !important",
                    },
                    // Mobile responsive dropdown
                    "@media (max-width: 600px)": {
                      "& .react-tel-input .country-list": {
                        width: "320px !important",
                        minWidth: "300px !important",
                        left: "0 !important",
                        right: "auto !important",
                      },
                    },
                  }}
                >
                  <PhoneInput
                    country={country}
                    value={mobile}
                    onChange={(value, countryData) => {
                      setMobile(value);
                      setCountry(countryData.countryCode);
                    }}
                    inputProps={{
                      name: "mobile",
                      required: true,
                      autoFocus: true,
                    }}
                    containerClass={phoneInputStyle.container}
                    inputClass={phoneInputStyle.input}
                    buttonClass={phoneInputStyle.button}
                    dropdownClass={phoneInputStyle.dropdown}
                    searchClass={phoneInputStyle.search}
                    enableSearch={true}
                    countryCodeEditable={false}
                    preferredCountries={["in", "us", "gb", "ae"]}
                    searchPlaceholder="Search countries..."
                  />
                </Box>
              </Box>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isCooldown}
                sx={{
                  backgroundColor: "#642b8f",
                  py: { xs: 1.5, sm: 1.75 },
                  fontSize: { xs: "0.95rem", sm: "1rem" },
                  fontWeight: 600,
                  borderRadius: 2,
                  textTransform: "none",
                  boxShadow: "none",
                  border: "none",
                  color: "white",
                  mb: { xs: 2.5, sm: 3 },
                  "&:hover": {
                    backgroundColor: "#512166",
                  },
                  "&:disabled": {
                    backgroundColor: "#bdc3c7",
                    color: "white",
                  },
                }}
                endIcon={!isCooldown && <ArrowRight size={18} />}
              >
                {isCooldown ? "Sending OTP..." : "Continue"}
              </Button>

              {/* Terms and Conditions */}
              <Typography
                variant="caption"
                sx={{
                  color: "#95a5a6",
                  fontSize: { xs: "0.75rem", sm: "0.8rem" },
                  lineHeight: 1.3,
                  display: "block",
                }}
              >
                By continuing, you agree to our{" "}
                <Typography
                  component="span"
                  sx={{
                    color: "#642b8f",
                    textDecoration: "underline",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  Terms & Conditions
                </Typography>{" "}
                and{" "}
                <Typography
                  component="span"
                  sx={{
                    color: "#642b8f",
                    textDecoration: "underline",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  Privacy Policy
                </Typography>
              </Typography>
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

export default ParentLogin;
