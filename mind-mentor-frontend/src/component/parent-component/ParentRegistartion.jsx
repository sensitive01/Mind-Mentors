import { useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import LeftLogoBar from "./parent-dashboard/layout/LeftLogoBar";
import { toast, ToastContainer } from "react-toastify";
import { StepperContext } from "../completion-status-bar/StepperContext";
import Stepper from "../completion-status-bar/Stepper";
import { useDispatch, useSelector } from "react-redux";
import { setFormData } from "../../store/regDataParentKidsSlice";
import { registerKidData } from "../../api/service/parent/ParentService";

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
  console.log("state-->", state);
  const { phoneNumber } = state || {};
  const { currentStep, nextStep } = useContext(StepperContext);
  const regFormData = useSelector((state) => state.formData);
  console.log("regFormData", regFormData);

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
    <div className="flex flex-col lg:flex-row min-h-screen">
      <LeftLogoBar />

      <div className="lg:w-3/5 w-auto p-8 bg-white ml-0 mt-8 lg:mt-10 lg:ml-20 lg:mr-20 flex-1 min-h-auto rounded-lg">
        <Stepper />
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-primary mb-2">
              Update More Details to your Profile
            </h2>
            <h2 className="text-sm text-black">
              The Details given will be kept confidential and will not be used
              for any marketing purposes
            </h2>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 border border-primary rounded-lg p-8"
            noValidate
          >
            <div className="space-y-1">
              <div className="flex items-start mb-2">
                <input
                  id="isMobileWhatsapp"
                  type="checkbox"
                  checked={formState.isMobileWhatsapp}
                  onChange={handleCheckboxChange}
                  className="mt-1 h-4 w-4 text-purple-600 rounded"
                  aria-label="Is Phone Number same as WhatsApp number"
                />
                <label
                  htmlFor="isMobileWhatsapp"
                  className="ml-2 text-sm font-medium text-primary"
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

              <p className="text-xs text-primary mt-1">
                Will also be used for class notifications and to avoid calls
              </p>
            </div>

            <div className="space-y-1">
              <input
                type="email"
                value={formState.email}
                onChange={(e) => handleFieldChange("email", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md"
                placeholder="Enter your email ID"
                aria-label="Email input"
              />

              <p className="text-xs text-primary">
                Will be used for sending payment invoices
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <input
                  type="text"
                  value={formState.name}
                  onChange={(e) => handleFieldChange("name", e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md"
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
                  className="w-full p-3 border border-gray-300 rounded-md"
                  placeholder="Enter your child name"
                  aria-label="Child name input"
                />

                <p className="text-xs text-primary">Participant name</p>
              </div>
            </div>
          </form>

          <div className="flex w-full space-x-1 mt-3">
            <button
              type="button"
              onClick={handleBack}
              className="bg-primary w-1/3 py-3 px-4 text-white font-medium rounded-md transition duration-300 flex items-center justify-center border-b-4 hover:border-secondary"
            >
              <span className="mr-2">←</span> Back
            </button>

            <button
              type="button"
              onClick={handleSkipDashboard}
              className={`bg-primary w-1/2 py-3 px-4 text-white font-medium rounded-md transition duration-300 flex items-center justify-center border-b-4 hover:border-secondary ${
                isCooldown ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isCooldown}
            >
              Skip to Dashboard
            </button>

            <button
              type="submit"
              onClick={handleSubmit}
              className={`bg-primary w-1/3 py-3 px-4 text-white font-medium rounded-md transition duration-300 flex items-center justify-center border-b-4 hover:border-secondary  ${
                isCooldown ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isCooldown}
            >
              Next
              <span className="ml-2">→</span>
            </button>
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

export default ParentRegistration;
