import { useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { StepperContext } from "../completion-status-bar/StepperContext";
import Stepper from "../completion-status-bar/Stepper";
import { useDispatch, useSelector } from "react-redux";
import { setFormData } from "../../store/regDataParentKidsSlice";
import { registerKidData } from "../../api/service/parent/ParentService";
import mindMentorImage from "../../assets/newLogo.png";

const phoneInputStyle = {
  container: "!w-full",
  input:
    "!w-full !h-12 !text-base !pl-12 !pr-4 !border !border-gray-300 !rounded-lg focus:!ring-2 focus:!ring-[rgb(177,21,177)] !transition-colors",
  button: "!h-12 !bg-transparent !border-r  !rounded-l-lg",
  dropdown: "!bg-white !shadow-lg !rounded-lg !border !border-gray-300 !mt-1",
  search: "!mx-2 !my-2 !px-3 !py-2 !border !border-gray-300 !rounded-md",
};

const ParentRegistration = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state } = useLocation();
  const { phoneNumber } = state || {};
  const { currentStep, nextStep } = useContext(StepperContext);
  const regFormData = useSelector((state) => state.formData);

  // Initialize form state from Redux
  const [formState, setFormState] = useState({
    mobile: phoneNumber || regFormData.mobile || "",
    email: regFormData.email || "",
    name: regFormData.name || "",
    childName: regFormData.childName || "",
    isMobileWhatsapp: regFormData.isMobileWhatsapp || true,
    enqId: state.data.enqId,
    parentId: state.data.parentId,
  });

  const [country, setCountry] = useState("in");
  const [isCooldown, setIsCooldown] = useState(false);

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
                Back to previous
              </button>
            </div>
          </div>

          {/* Right Side - Registration Form Section */}
          <div className="w-full lg:w-3/5 flex flex-col h-full">
            {/* Stepper Section */}
            <div className="px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8 pt-2 xs:pt-3 sm:pt-4 pb-2 xs:pb-3 sm:pb-4 border-b border-gray-100 flex-shrink-0">
              <Stepper />
            </div>

            {/* Form Content */}
            <div className="flex-1 flex flex-col justify-center px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8 py-2 xs:py-3 sm:py-4">
              <div className="w-full max-w-3xl mx-auto">
                <div className="text-center mb-3 xs:mb-4 sm:mb-6">
                  <h2 className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-primary mb-1 xs:mb-2">
                    Update More Details to your Profile
                  </h2>
                  <p className="text-xs xs:text-sm text-black">
                    The Details given will be kept confidential and will not be used
                    for any marketing purposes
                  </p>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="space-y-3 xs:space-y-4 sm:space-y-5 border border-primary rounded-lg p-3 xs:p-4 sm:p-5 md:p-6"
                  noValidate
                >
                  <div className="space-y-1">
                    <div className="flex items-start mb-1 xs:mb-2">
                      <input
                        id="isMobileWhatsapp"
                        type="checkbox"
                        checked={formState.isMobileWhatsapp}
                        onChange={handleCheckboxChange}
                        className="mt-0.5 h-3 w-3 xs:h-4 xs:w-4 text-purple-600 rounded"
                        aria-label="Is Phone Number same as WhatsApp number"
                      />
                      <label
                        htmlFor="isMobileWhatsapp"
                        className="ml-2 text-xs xs:text-sm font-medium text-primary"
                      >
                        Is Phone Number same as WhatsApp number
                      </label>
                    </div>

                    <div className="relative">
                      <PhoneInput
                        country={country}
                        value={formState.mobile}
                        onChange={handleMobileChange}
                        inputProps={{
                          name: "mobile",
                          required: true,
                          autoFocus: true,
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
                        aria-label="Phone number input"
                      />
                    </div>

                    <p className="text-xs text-primary">
                      Will also be used for class notifications and to avoid calls
                    </p>
                  </div>

                  <div className="space-y-1">
                    <input
                      type="email"
                      value={formState.email}
                      onChange={(e) => handleFieldChange("email", e.target.value)}
                      className="w-full p-2 xs:p-2.5 sm:p-3 border border-gray-300 rounded-md text-xs xs:text-sm sm:text-base"
                      placeholder="Enter your email ID"
                      aria-label="Email input"
                    />

                    <p className="text-xs text-primary">
                      Will be used for sending payment invoices
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 xs:gap-3 sm:gap-4">
                    <div className="space-y-1">
                      <input
                        type="text"
                        value={formState.name}
                        onChange={(e) => handleFieldChange("name", e.target.value)}
                        className="w-full p-2 xs:p-2.5 sm:p-3 border border-gray-300 rounded-md text-xs xs:text-sm sm:text-base"
                        placeholder="Enter your name"
                        aria-label="Name input"
                      />

                      <p className="text-xs text-primary">
                        Display name / Invoice name
                      </p>
                    </div>
                    <div className="space-y-1">
                      <input
                        type="text"
                        value={formState.childName}
                        onChange={(e) =>
                          handleFieldChange("childName", e.target.value)
                        }
                        className="w-full p-2 xs:p-2.5 sm:p-3 border border-gray-300 rounded-md text-xs xs:text-sm sm:text-base"
                        placeholder="Enter your child name"
                        aria-label="Child name input"
                      />

                      <p className="text-xs text-primary">Participant name</p>
                    </div>
                  </div>
                </form>

                {/* Action Buttons */}
                <div className="flex w-full space-x-1 xs:space-x-2 sm:space-x-3 mt-3 xs:mt-4 sm:mt-6">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="bg-primary w-1/4 py-2 xs:py-2.5 sm:py-3 px-1 xs:px-2 sm:px-4 text-white font-medium rounded-md transition duration-300 flex items-center justify-center border-b-4 hover:border-secondary text-xs xs:text-sm"
                  >
                    <ArrowLeft size={12} className="mr-1" />
                    <span className=" xs:inline">Back</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSkipDashboard}
                    className={`bg-primary w-1/2 py-2 xs:py-2.5 sm:py-3 px-1 xs:px-2 sm:px-4 text-white font-medium rounded-md transition duration-300 flex items-center justify-center border-b-4 hover:border-secondary text-xs xs:text-sm ${
                      isCooldown ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={isCooldown}
                  >
                    Skip to Dashboard
                  </button>

                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className={`bg-primary w-1/4 py-2 xs:py-2.5 sm:py-3 px-1 xs:px-2 sm:px-4 text-white font-medium rounded-md transition duration-300 flex items-center justify-center border-b-4 hover:border-secondary text-xs xs:text-sm ${
                      isCooldown ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={isCooldown}
                  >
                    <span className=" xs:inline">Next</span>
                    <ArrowRight size={12} className="ml-1" />
                  </button>
                </div>
              </div>
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

export default ParentRegistration;