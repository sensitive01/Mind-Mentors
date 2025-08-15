import { useState, useRef, useEffect } from "react";
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
  TextField,
} from "@mui/material";
import { ArrowRight, ArrowLeft, MessageSquare } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { verifyOtp, parentLogin } from "../../api/service/parent/ParentService";
import mindMentorImage from "../../assets/newLogo.png";

const ParentOtpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const { value, phoneNumber } = state || {};

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(60); // 1 minute timer
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const otpRefs = useRef([]);

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((timeLeft) => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerActive(false);
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft]);

  // Focus first input on mount
  useEffect(() => {
    if (otpRefs.current[0]) {
      otpRefs.current[0].focus();
    }
  }, []);

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    // Move to next input if value is entered
    if (value && index < otp.length - 1) {
      otpRefs.current[index + 1].focus();
    }
  };

  // Handle backspace key
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        otpRefs.current[index - 1].focus();
      } else {
        const updatedOtp = [...otp];
        updatedOtp[index] = "";
        setOtp(updatedOtp);
      }
    }
  };

  // Auto-submit when all digits are filled
  useEffect(() => {
    if (otp.every((digit) => digit !== "")) {
      handleSubmit();
    }
  }, [otp]);

  // Handle OTP verification
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!isTimerActive && !canResend) {
      toast.error("OTP has expired. Please request a new one.");
      return;
    }

    try {
      const otpResponse = await verifyOtp(otp.join(""));
      if (otpResponse.status === 200) {
        toast.success(otpResponse?.data?.message);

        setTimeout(() => {
          if (value == "1") {
            localStorage.setItem(
              "parentId",
              otpResponse?.data?.parentData?._id
            );
            navigate("/parent/dashboard");
          } else {
            navigate("/parent/registration", { state: state });
          }
        }, 1500);
      } else {
        toast.error("Failed to verify OTP. Please try again.");
      }
    } catch (err) {
      console.error("Error in verify OTP", err);
      toast.error("An error occurred. Please try again later.");
    }
  };

  // Handle resend OTP
  const handleResendOtp = async () => {
    if (!canResend || isResending) return;

    setIsResending(true);
    try {
      const resendResponse = await parentLogin(phoneNumber);
      if (resendResponse.status === 200 || resendResponse.status === 201) {
        toast.success("OTP sent successfully!");

        // Reset timer and OTP
        setTimeLeft(60);
        setIsTimerActive(true);
        setCanResend(false);
        setOtp(["", "", "", ""]);

        // Focus first input
        if (otpRefs.current[0]) {
          otpRefs.current[0].focus();
        }
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to resend OTP. Please try again."
      );
    } finally {
      setIsResending(false);
    }
  };

  // Format timer display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
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
            maxWidth: { xs: "100%", sm: "420px", md: "450px" },
            backgroundColor: "white",
            borderRadius: { xs: 2, sm: 3 },
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
          }}
        >
          <CardContent
            sx={{
              p: { xs: 3, sm: 4, md: 5 },
              textAlign: "center",
              "&:last-child": { pb: { xs: 3, sm: 4, md: 5 } },
            }}
          >
            {/* OTP Avatar */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mb: { xs: 2.5, sm: 3 },
              }}
            >
              <Avatar
                sx={{
                  width: { xs: 70, sm: 80, md: 90 },
                  height: { xs: 70, sm: 80, md: 90 },
                  backgroundColor: "#642b8f",
                  position: "relative",
                }}
              >
                <MessageSquare
                  size={isMobile ? 28 : isTablet ? 32 : 36}
                  style={{ color: "white" }}
                />

                {/* WhatsApp Badge */}
                <Box
                  sx={{
                    position: "absolute",
                    top: -4,
                    right: -4,
                    width: { xs: 22, sm: 24, md: 26 },
                    height: { xs: 22, sm: 24, md: 26 },
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
                      fontSize: { xs: "9px", sm: "10px", md: "11px" },
                    }}
                  >
                    W
                  </Typography>
                </Box>
              </Avatar>
            </Box>

            {/* Header Text */}
            <Typography
              variant="h5"
              sx={{
                color: "#2c3e50",
                fontWeight: 700,
                mb: 1,
                fontSize: { xs: "1.25rem", sm: "1.5rem" },
              }}
            >
              Enter OTP
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "#7f8c8d",
                mb: 1,
                fontSize: { xs: "0.85rem", sm: "0.95rem" },
                fontWeight: 500,
              }}
            >
              OTP sent to your WhatsApp number
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "#642b8f",
                mb: { xs: 2.5, sm: 3 },
                fontSize: { xs: "0.85rem", sm: "0.9rem" },
                fontWeight: 600,
                wordBreak: "break-all",
              }}
            >
              {phoneNumber}
            </Typography>

            {/* OTP Form */}
            <Box component="form" onSubmit={handleSubmit}>
              {/* OTP Input Fields */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: { xs: 1, sm: 1.5 },
                  mb: { xs: 2, sm: 2.5 },
                }}
              >
                {otp.map((digit, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: { xs: "45px", sm: "50px", md: "55px" },
                      height: { xs: "45px", sm: "50px", md: "55px" },
                      position: "relative",
                    }}
                  >
                    <input
                      ref={(el) => (otpRefs.current[index] = el)}
                      type="text"
                      value={digit}
                      onChange={(e) =>
                        handleOtpChange(
                          index,
                          e.target.value.replace(/[^0-9]/g, "")
                        )
                      }
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      maxLength={1}
                      required
                      disabled={!isTimerActive && !canResend}
                      style={{
                        width: "100%",
                        height: "100%",
                        textAlign: "center",
                        fontSize: isMobile ? "1.1rem" : "1.3rem",
                        fontWeight: "bold",
                        border: "2px solid #e0e0e0",
                        borderRadius: "8px",
                        outline: "none",
                        backgroundColor: "white",
                        color: "#333",
                        transition: "all 0.3s ease",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#642b8f";
                        e.target.style.boxShadow = "0 0 0 1px #642b8f";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#e0e0e0";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                  </Box>
                ))}
              </Box>

              {/* Timer Display */}
              <Box sx={{ mb: { xs: 2, sm: 2.5 } }}>
                {isTimerActive ? (
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#7f8c8d",
                      fontSize: { xs: "0.85rem", sm: "0.9rem" },
                    }}
                  >
                    Time remaining:{" "}
                    <Typography
                      component="span"
                      sx={{
                        fontWeight: "bold",
                        color: "#642b8f",
                      }}
                    >
                      {formatTime(timeLeft)}
                    </Typography>
                  </Typography>
                ) : (
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#e74c3c",
                      fontSize: { xs: "0.85rem", sm: "0.9rem" },
                      fontWeight: 600,
                    }}
                  >
                    OTP has expired
                  </Typography>
                )}
              </Box>

              {/* Action Buttons */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {/* Verify OTP Button */}
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={
                    (!isTimerActive && !canResend) ||
                    otp.some((digit) => digit === "")
                  }
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
                    "&:hover": {
                      backgroundColor: "#512166",
                    },
                    "&:disabled": {
                      backgroundColor: "#bdc3c7",
                      color: "white",
                    },
                  }}
                  endIcon={<ArrowRight size={18} />}
                >
                  {value == "1" ? "Verify & Login" : "Verify & Signup"}
                </Button>

                {/* Resend OTP Button */}
                <Button
                  type="button"
                  onClick={handleResendOtp}
                  variant="outlined"
                  fullWidth
                  disabled={!canResend || isResending}
                  sx={{
                    borderColor: "#642b8f",
                    color: "#642b8f",
                    py: { xs: 1.5, sm: 1.75 },
                    fontSize: { xs: "0.95rem", sm: "1rem" },
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
                  {isResending ? "Sending..." : "Resend OTP"}
                </Button>
              </Box>

              {/* Help Text */}
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  color: "#95a5a6",
                  mt: 2,
                  fontSize: { xs: "0.75rem", sm: "0.8rem" },
                  lineHeight: 1.4,
                  px: { xs: 0.5, sm: 1 },
                }}
              >
                Didn't receive the OTP? Check your WhatsApp messages or wait for
                the timer to resend.
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

export default ParentOtpPage;
