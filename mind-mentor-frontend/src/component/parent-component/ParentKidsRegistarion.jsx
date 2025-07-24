import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { parentKidsRegistration } from "../../api/service/parent/ParentService";
import LeftLogoBar from "./parent-dashboard/layout/LeftLogoBar";
import { StepperContext } from "../completion-status-bar/StepperContext";
import Stepper from "../completion-status-bar/Stepper";
import { useDispatch, useSelector } from "react-redux";
import { setFormData } from "../../store/regDataParentKidsSlice";

const ParentKidsRegistration = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { nextStep, previousStep } = useContext(StepperContext);
  const { state } = location;
  const regFormData = useSelector((state) => state.formData);

  const [formData, setFormDatas] = useState({
    isMobileWhatsapp: regFormData?.isMobileWhatsapp,
    email: regFormData?.email,
    mobile: regFormData?.mobile,
    name: regFormData?.name,
    kidsName: regFormData?.childName || "",
    age: regFormData.age || "",
    gender: regFormData.gender || "",
    pincode: regFormData.pincode || "",
    city: regFormData.city || "",
    state: regFormData.state || "",
    enqId: regFormData.enqId || "",
    parentId: regFormData?.parentId || "",
  });

  const [isCooldown, setIsCooldown] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormDatas((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fetchLocationFromPincode = async (pincode) => {
    if (pincode.length !== 6) return;

    setIsLoadingLocation(true);
    try {
      const response = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`
      );
      const data = await response.json();

      if (data[0].Status === "Success" && data[0].PostOffice.length > 0) {
        const postOffice = data[0].PostOffice[0];
        setFormDatas((prev) => ({
          ...prev,
          city: postOffice.District,
          state: postOffice.State,
        }));
        toast.success(
          `Location found: ${postOffice.District}, ${postOffice.State}`
        );
      } else {
        toast.error("Invalid pincode or location not found");
        setFormDatas((prev) => ({
          ...prev,
          city: "",
          state: "",
        }));
      }
    } catch (error) {
      console.error("Error fetching location:", error);
      toast.error("Failed to fetch location. Please try again.");
      setFormDatas((prev) => ({
        ...prev,
        city: "",
        state: "",
      }));
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handlePincodeChange = (e) => {
    const { value } = e.target;
    setFormDatas((prev) => ({
      ...prev,
      pincode: value,
      city: "",
      state: "",
    }));

    if (value.length === 6 && /^\d{6}$/.test(value)) {
      fetchLocationFromPincode(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isCooldown) return;

    const { kidsName, age, gender, pincode, city, state } = formData;
    console.log(formData);
    if (!kidsName || !age || !gender || !pincode || !city || !state) {
      toast.error("Please fill out all fields before submitting.");
      setIsCooldown(true);
      setTimeout(() => setIsCooldown(false), 5000);
      return;
    }

    setIsCooldown(true);
    setTimeout(() => setIsCooldown(false), 5000);

    dispatch(setFormData(formData));
    try {
      const result = await parentKidsRegistration(formData, state);
      if (result.status === 201) {
        toast.success(result?.data?.message);
        localStorage.setItem("parentId", formData.parentId);

        // nextStep();

        setTimeout(() => {
          // navigate("/parent/kids/demo", { state: result?.data?.data });

          navigate("/parent/dashboard");
        }, 2000);
      }
    } catch (err) {
      toast.error("Failed to submit the form. Please try again.");
    }
  };

  useEffect(() => {
    const handleRouteChange = () => {
      if (window.performance && performance.navigation.type === 2) {
        previousStep();
      }
    };

    window.addEventListener("popstate", handleRouteChange);
    return () => {
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, [previousStep]);

  const handleSkipDashboard = () => {
    localStorage.setItem("parentId", formData.parentId);
    toast.info("Kids Registration is incomplete, moving to dashboard");
    if (isCooldown) return;
    setIsCooldown(true);
    setTimeout(() => setIsCooldown(false), 5000);

    setTimeout(() => {
      navigate("/parent/dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-1 xs:p-2 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg overflow-hidden h-[calc(100vh-0.5rem)] xs:h-[calc(100vh-1rem)] sm:h-[calc(100vh-2rem)] md:h-[calc(100vh-3rem)] lg:h-[calc(100vh-4rem)] flex flex-col lg:flex-row">
        <LeftLogoBar />

        <div className="lg:w-3/5 w-full p-4 xs:p-6 sm:p-8 md:p-10 lg:p-12 overflow-y-auto max-h-full flex flex-col">
          {/* Sticky Stepper */}
          <div className="sticky top-0 z-10 bg-white pb-4">
            <Stepper />
          </div>

          {/* Scrollable Form Section */}
          <div className="w-full flex-grow overflow-y-auto">
            <h2 className="text-2xl font-bold text-primary mb-2 text-center">
              Student Registration Form
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 pr-2">
              {/* Personal Info */}
              <div className="p-4 rounded-lg shadow-md bg-white border border-primary mb-4">
                <h3 className="text-lg font-semibold text-primary mb-3">
                  Personal Information
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kids Name
                      </label>
                      <input
                        type="text"
                        name="kidsName"
                        value={formData.kidsName || state?.childName}
                        onChange={handleChange}
                        className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                        placeholder="Kids Name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Age
                      </label>
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        placeholder="Enter age"
                        className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                        min={1}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gender
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location Info */}
              <div className="bg-white border border-primary p-4 rounded-lg shadow-sm mb-4">
                <h3 className="text-lg font-semibold text-primary mb-4">
                  Location Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handlePincodeChange}
                      placeholder="Enter 6-digit pincode"
                      className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      maxLength={6}
                      pattern="[0-9]{6}"
                    />
                    {isLoadingLocation && (
                      <p className="text-sm text-blue-600 mt-1">
                        Fetching location...
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        readOnly
                        placeholder="City will be auto-filled"
                        className="w-full p-3 text-sm border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        readOnly
                        placeholder="State will be auto-filled"
                        className="w-full p-3 text-sm border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-between gap-4 mt-6">
                <button
                  onClick={() => {
                    previousStep();
                    navigate(-1);
                  }}
                  type="button"
                  className="w-1/4 bg-primary text-white py-3 px-4 rounded-md border-b-4 hover:border-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-300 flex items-center justify-center"
                >
                  ← Back
                </button>

                <button
                  type="button"
                  className={`w-1/2 bg-primary text-white py-3 px-4 rounded-md border-b-4 hover:border-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition duration-300 ${
                    isCooldown ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={handleSkipDashboard}
                  disabled={isCooldown}
                >
                  Skip to Dashboard
                </button>

                <button
                  type="submit"
                  className={`w-1/4 bg-primary text-white py-3 px-4 rounded-md border-b-4 hover:border-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition duration-300 ${
                    isCooldown ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={isCooldown}
                >
                  Submit →
                </button>
              </div>
            </form>
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
      />
    </div>
  );
};

export default ParentKidsRegistration;
