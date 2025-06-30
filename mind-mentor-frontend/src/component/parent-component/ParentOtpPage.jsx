import { useState, useRef, useEffect } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { verifyOtp, parentLogin } from "../../api/service/parent/ParentService";
import mindMentorImage from "../../assets/newLogo.png";

const ParentOtpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const { value, phoneNumber } = state || {};

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
    <div className="min-h-screen bg-gray-50 p-1 xs:p-2 sm:p-4 md:p-6 lg:p-8">
      {/* Main Container with margins on all sides */}
      <div className="max-w-7xl mx-auto bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg overflow-hidden h-[calc(100vh-0.5rem)] xs:h-[calc(100vh-1rem)] sm:h-[calc(100vh-2rem)] md:h-[calc(100vh-3rem)] lg:h-[calc(100vh-4rem)]">
        <div className="flex flex-col lg:flex-row h-full">
          {/* Left Side - Logo Section */}
          <div className="bg-[#642b8f] text-white w-full lg:w-2/5 flex flex-col justify-between h-[30vh] xs:h-[32vh] sm:h-[40vh] md:h-1/2 lg:h-full px-3 py-3 xs:px-4 xs:py-4 sm:px-6 sm:py-6 md:px-6 md:py-8 lg:px-8 lg:py-12">
            <div className="flex-grow flex flex-col justify-center items-center lg:items-start text-center lg:text-left">
              <h2 className="text-sm xs:text-base sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold leading-tight mb-1 xs:mb-2 sm:mb-4 md:mb-6">
                Welcome to
              </h2>
              <img
                src={mindMentorImage}
                alt="Mind Mentorz Logo"
                className="w-full max-w-[120px] xs:max-w-[140px] sm:max-w-[180px] md:max-w-sm lg:max-w-[80%] h-auto object-contain"
              />
            </div>
            <div className="flex justify-center lg:justify-start items-center w-full mt-2 xs:mt-3 sm:mt-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center text-xs xs:text-xs sm:text-sm hover:underline transition-all duration-300 hover:opacity-80"
              >
                <ArrowLeft size={14} className="mr-1 xs:mr-1 sm:mr-2" />
                Back to login
              </button>
            </div>
          </div>

          {/* Right Side - OTP Form Section */}
          <div className="w-full lg:w-3/5 flex items-center justify-center flex-grow lg:h-full p-2 xs:p-3 sm:p-6 md:p-8 lg:p-12">
            <div className="w-full max-w-md mx-auto">
              <div className="flex flex-col items-center mb-3 xs:mb-4 sm:mb-6 md:mb-8">
                <h2 className="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-primary mb-1 xs:mb-1 sm:mb-2 md:mb-3">
                  Enter OTP
                </h2>
                <p className="text-xs xs:text-sm sm:text-base text-black font-bold text-center mb-1 xs:mb-1 sm:mb-2">
                  OTP sent to your WhatsApp number
                </p>
                <p className="text-xs xs:text-sm sm:text-base text-primary font-bold break-all">
                  {phoneNumber}
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-3 xs:space-y-4 sm:space-y-6 w-full"
              >
                {/* OTP Input Fields */}
                <div className="flex justify-center gap-2 xs:gap-2 sm:gap-3 md:gap-4 mb-3 xs:mb-4">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      ref={(el) => (otpRefs.current[index] = el)}
                      className="w-10 h-10 xs:w-11 xs:h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 text-center text-base xs:text-lg sm:text-xl font-bold border-2 border-gray-300 focus:outline-none rounded-md sm:rounded-lg focus:ring-2 focus:ring-[#642b8f] focus:border-[#642b8f] transition-colors"
                      maxLength={1}
                      value={digit}
                      onChange={(e) =>
                        handleOtpChange(
                          index,
                          e.target.value.replace(/[^0-9]/g, "")
                        )
                      }
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      required
                      disabled={!isTimerActive && !canResend}
                    />
                  ))}
                </div>

                {/* Timer Display */}
                <div className="text-center mb-3 xs:mb-4">
                  {isTimerActive ? (
                    <p className="text-xs xs:text-sm sm:text-base text-gray-600">
                      Time remaining:{" "}
                      <span className="font-bold text-primary">
                        {formatTime(timeLeft)}
                      </span>
                    </p>
                  ) : (
                    <p className="text-xs xs:text-sm sm:text-base text-red-600 font-medium">
                      OTP has expired
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 xs:space-y-3">
                  {/* Verify OTP Button */}
                  <button
                    type="submit"
                    className={`w-full bg-primary text-white py-2 xs:py-2.5 sm:py-3 px-4 rounded-md sm:rounded-lg border-b-4 hover:border-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300 text-xs xs:text-sm sm:text-base font-medium flex items-center justify-center
                       ${
                         (!isTimerActive && !canResend) ||
                         otp.some((digit) => digit === "")
                           ? "opacity-50 cursor-not-allowed"
                           : ""
                       }`}
                    disabled={
                      (!isTimerActive && !canResend) ||
                      otp.some((digit) => digit === "")
                    }
                  >
                    {value == "1" ? "Verify & Login" : "Verify & Signup"}
                    <ArrowRight size={14} className="ml-1 xs:ml-2" />
                  </button>

                  {/* Resend OTP Button */}
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className={`w-full bg-white text-primary border-2 border-primary py-2 xs:py-2.5 sm:py-3 px-4 rounded-md sm:rounded-lg hover:bg-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300 text-xs xs:text-sm sm:text-base font-medium
                       ${
                         !canResend || isResending
                           ? "opacity-50 cursor-not-allowed"
                           : ""
                       }`}
                    disabled={!canResend || isResending}
                  >
                    {isResending ? "Sending..." : "Resend OTP"}
                  </button>
                </div>

                {/* Help Text */}
                <div className="text-center pt-1 xs:pt-2">
                  <p className="text-xs xs:text-xs sm:text-sm text-gray-500 leading-relaxed px-2">
                    Didn't receive the OTP? Check your WhatsApp messages or wait
                    for the timer to resend.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        pauseOnFocusLoss
        className="mt-12 xs:mt-14 sm:mt-16"
        toastClassName="text-xs xs:text-sm"
      />
    </div>
  );
};

export default ParentOtpPage;