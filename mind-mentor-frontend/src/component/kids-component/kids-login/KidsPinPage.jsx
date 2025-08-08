import { useState, useRef } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import KidLeftSide from "./KidLeftSide";
import { validatePIN } from "../../../api/service/kid/KidService";

const KidsPinPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;

  const [otp, setOtp] = useState(["", "", "", ""]);
  const otpRefs = useRef([]);

  const handleOtpChange = (index, value) => {
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value && index < otp.length - 1) {
      otpRefs.current[index + 1].focus();
    }
  };

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

  // Handle paste functionality
  const handlePaste = (index, e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text");
    const digits = pasteData.replace(/[^0-9]/g, "").slice(0, 4); // Only get numbers and limit to 4 digits

    if (digits.length > 0) {
      const updatedOtp = [...otp];

      // Fill the OTP array starting from the current index
      for (let i = 0; i < digits.length && index + i < 4; i++) {
        updatedOtp[index + i] = digits[i];
      }

      setOtp(updatedOtp);

      // Focus on the next empty field or the last field
      const nextIndex = Math.min(index + digits.length, 3);
      otpRefs.current[nextIndex].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(otp);
    try {
      const response = await validatePIN(otp, state);
      console.log(response);
      if (response.status === 200) {
        toast.success(response?.data?.message);
        localStorage.setItem("role", "kid");
        localStorage.setItem("kidId", response.data.kidId);
        setTimeout(() => {
          navigate("/kids/dashboard");
        }, 1500);
      } else {
        toast.error(response?.data?.message || "Invalid Pin");
      }
    } catch (err) {
      console.log("Error in verify the pin", err);
      // Fixed the error message extraction
      const errorMessage =
        err.response?.data?.message ||
        err?.response?.response?.data?.message ||
        "Invalid Pin";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <KidLeftSide />

      <div className="lg:w-3/5 p-8 bg-white flex items-center justify-center lg:mr-8">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-primary mb-4">
              Kids Login
            </h2>
            <p className="text-sm text-gray-600">Please enter the PIN below.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 w-full">
            <div className="flex justify-center mb-2">
              <label className="text-sm font-medium text-gray-700">
                Enter PIN
              </label>
            </div>

            {/* Centered Input Section */}
            <div className="flex justify-center gap-5">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  ref={(el) => (otpRefs.current[index] = el)}
                  className="w-12 h-12 text-center border border-primary focus:outline-none rounded-lg focus:ring-2 focus:ring-[#642b8f]"
                  maxLength={1}
                  value={digit}
                  onChange={(e) =>
                    handleOtpChange(
                      index,
                      e.target.value.replace(/[^0-9]/g, "")
                    )
                  }
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={(e) => handlePaste(index, e)}
                  required
                />
              ))}
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white py-3 px-4 rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition duration-300"
            >
              Next →
            </button>
          </form>
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
        className="mt-16"
      />
    </div>
  );
};

export default KidsPinPage;
