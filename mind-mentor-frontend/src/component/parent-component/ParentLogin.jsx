import { useState } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { validateForm } from "../../utils/Validation";
import { ToastContainer, toast } from "react-toastify";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useNavigate } from "react-router-dom";
import { parentLogin } from "../../api/service/parent/ParentService";
import mindMentorImage from "../../images/mindmentorz_logo.png";

const ParentLogin = () => {
  const navigate = useNavigate();
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
    container: "!w-full",
    input:
      "!w-full !h-12 !text-base !pl-12 !pr-4 !border !border-gray-300 !rounded-lg focus:!ring-2 focus:!ring-[rgb(177,21,177)] focus:!border-[rgb(177,21,177)] !transition-colors",
    button: "!h-12 !bg-transparent !border-r !border-gray-300 !rounded-l-lg",
    dropdown: "!bg-white !shadow-lg !rounded-lg !border !border-gray-200 !mt-1",
    search: "!mx-2 !my-2 !px-3 !py-2 !border !border-gray-300 !rounded-md",
  };

  return (
    <div className="min-h-screen bg-gray-50 p-1 sm:p-4 md:p-6 lg:p-8">
      {/* Main Container with margins on all sides */}
      <div className="max-w-7xl mx-auto bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg overflow-hidden h-[calc(100vh-0.5rem)] sm:h-[calc(100vh-2rem)] md:h-[calc(100vh-3rem)] lg:h-[calc(100vh-4rem)]">
        <div className="flex flex-col lg:flex-row h-full">
          {/* Left Side - Logo Section */}
          <div className="bg-[#642b8f] text-white w-full lg:w-2/5 flex flex-col justify-between h-[35vh] sm:h-1/2 lg:h-full px-4 py-4 sm:px-6 sm:py-8 lg:px-8 lg:py-12">
            <div className="flex-grow flex flex-col justify-center items-center lg:items-start text-center lg:text-left">
              <h2 className="text-base sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-2 sm:mb-6">
                Welcome to
              </h2>
              <img
                src={mindMentorImage}
                alt="Mind Mentorz Logo"
                className="w-full max-w-[160px] sm:max-w-xs md:max-w-sm lg:max-w-[80%] h-auto object-contain"
              />
            </div>
            <div className="flex justify-center lg:justify-start items-center w-full">
              <button
                onClick={() => navigate("/")}
                className="flex items-center text-xs sm:text-sm hover:underline transition-all duration-300 hover:opacity-80"
              >
                <ArrowLeft size={12} className="mr-1 sm:mr-2" />
                Back to site
              </button>
            </div>
          </div>

          {/* Right Side - Login Form Section */}
          <div className="w-full lg:w-3/5 flex items-center justify-center flex-grow lg:h-full p-3 sm:p-6 md:p-8 lg:p-12">
            <div className="w-full max-w-md mx-auto">
              <div className="flex flex-col items-center mb-4 sm:mb-8">
                <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-primary mb-1 sm:mb-3">
                  Parents Login
                </h2>
                <p className="text-sm sm:text-lg text-black font-bold text-center">
                  Login to continue
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-3 sm:space-y-6 w-full"
              >
                <div className="space-y-1 sm:space-y-2">
                  <label
                    htmlFor="mobile"
                    className="block text-xs sm:text-sm font-medium text-gray-700"
                  >
                    Enter Your WhatsApp Number
                  </label>
                  <div className="relative">
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
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className={`w-full bg-primary text-white py-2.5 sm:py-3 px-4 rounded-lg border-b-4 hover:border-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300 text-sm sm:text-base font-medium flex items-center justify-center
                     ${isCooldown ? "opacity-50 cursor-not-allowed" : ""}`}
                  disabled={isCooldown}
                >
                  Send OTP <ArrowRight size={14} className="ml-2" />
                </button>
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
        className="mt-16"
      />
    </div>
  );
};

export default ParentLogin;
