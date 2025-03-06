import { useState, useRef, useEffect } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { verifyOtp } from "../../api/service/parent/ParentService";
import LeftLogoBar from "./parent-dashboard/layout/LeftLogoBar";

const ParentOtpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  console.log(state);
  const { value } = state || {};

  const [otp, setOtp] = useState(["", "", "", ""]);
  const otpRefs = useRef([]);


  useEffect(() => {
    if (otpRefs.current[0]) {
      otpRefs.current[0].focus();
    }
  }, []);

 
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


  useEffect(() => {
    if (otp.every((digit) => digit !== "")) {
      handleSubmit(); 
    }
  }, [otp]);

 
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

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
            navigate("/parent/registration", { state:state });
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

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      <LeftLogoBar />

      <div className="lg:w-3/5 bg-white flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center mb-5">
            <h2 className="text-2xl lg:text-3xl font-bold text-primary mb-2">
              Parents Login
            </h2>
            <p className="text-sm text-black font-bold">
              Enter the OTP sent to your WhatsApp number{" "}
              <span className="text-primary">{state?.phoneNumber}</span>.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-8 w-full flex flex-col items-center"
          >
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
                    handleOtpChange(index, e.target.value.replace(/[^0-9]/g, ""))
                  }
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  required
                />
              ))}
            </div>

            <div className="flex w-full items-center space-x-0.5">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="bg-primary text-white py-3 px-5 border-b-4  hover:border-secondary rounded-md hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300 text-sm sm:text-base font-medium flex items-center justify-center gap-2"
              >
                <ArrowLeft size={16} /> Back
              </button>

              <button
                type="submit"
                className="w-full bg-primary text-white py-3 px-6 rounded-lg border-b-4  hover:border-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300 text-sm sm:text-base font-medium flex items-center justify-center gap-2"
              >
                {value == "1" ? "Login" : "Signup"} <ArrowRight size={16} />
              </button>
            </div>
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

export default ParentOtpPage;
