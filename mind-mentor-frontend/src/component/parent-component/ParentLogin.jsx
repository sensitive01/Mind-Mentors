import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { validateForm } from "../../utils/Validation";
import { ToastContainer, toast } from "react-toastify";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useNavigate } from "react-router-dom";
import { parentLogin } from "../../api/service/parent/ParentService";
import LeftLogoBar from "./parent-dashboard/layout/LeftLogoBar";

const ParentLogin = () => {
  const navigate = useNavigate();
  const [mobile, setMobile] = useState("");
  const [country, setCountry] = useState("in");
  const [isCooldown, setIsCooldown] = useState(false); 

  const handleSubmit = async (e) => {
    e.preventDefault();

  
    if (isCooldown) return;

    const { errors, formattedNumber } = validateForm(mobile, country.toUpperCase());
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
      if (parentLoginResponse.status === 200 || parentLoginResponse.status === 201) {
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
      toast.error(error?.response?.data?.message || "Login failed. Please try again.");
    }
  };

  const phoneInputStyle = {
    container: "!w-full",
    input: "!w-full !h-12 !text-base !pl-12 !pr-4 !border !border-gray-300 !rounded-lg focus:!ring-2 focus:!ring-[rgb(177,21,177)] focus:!border-[rgb(177,21,177)] !transition-colors",
    button: "!h-12 !bg-transparent !border-r !border-gray-300 !rounded-l-lg",
    dropdown: "!bg-white !shadow-lg !rounded-lg !border !border-gray-200 !mt-1",
    search: "!mx-2 !my-2 !px-3 !py-2 !border !border-gray-300 !rounded-md",
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      <LeftLogoBar />
      <div className="lg:w-3/5 p-4 sm:p-6 lg:p-8 bg-white flex items-center justify-center flex-grow">
        <div className="w-full max-w-md mx-auto">
          <div className="flex flex-col items-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-3">
              Parents Login
            </h2>
            <p className="text-lg text-black font-bold text-center">
              Login to continue
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 w-full">
            <div className="space-y-2">
              <label htmlFor="mobile" className="block text-sm text-gray-700">
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
              className={`w-full bg-primary text-white py-3 px-4 rounded-lg border-b-4 hover:border-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300 text-sm sm:text-base font-medium flex items-center justify-center
                 ${isCooldown ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={isCooldown}
            >
              Sent OTP <ArrowRight size={16} className="ml-2" />
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

export default ParentLogin;
