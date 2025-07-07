import { useState, useRef } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import KidLeftSide from "./KidLeftSide";
import { validatePIN } from "../../../api/service/kid/KidService";

const KidsPinPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;

  console.log("State in parent otp", state);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(otp);
    try {
      const response = await validatePIN(otp, state);
      console.log(response);
      if (response.status === 200) {
        toast.success(response?.data?.message);
        localStorage.setItem("role","kid")
        localStorage.setItem("kidId",response.data.kidId)
        setTimeout(() => {
          navigate("/kids/dashboard");
        }, 1500);
      }
    } catch (err) {
      console.log("Error in verify the pin", err);
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
            <p className="text-sm text-gray-600">
              Please enter the OTP sent to your mobile number.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 w-full">
            <div className="flex justify-center mb-2">
              <label className="text-sm font-medium text-gray-700">
                Enter PIN - 7224
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
      />
    </div>
  );
};

export default KidsPinPage;
