import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { parentKidsRegistration } from "../../api/service/parent/ParentService";
import LeftLogoBar from "./parent-dashboard/layout/LeftLogoBar";
import { StepperContext } from "../completion-status-bar/StepperContext"; // Import the context
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
  console.log("Toolkit datas in ParentKidsRegistration", regFormData);

  const [formData, setFormDatas] = useState({
    kidsName: state?.childName || "",
    age:regFormData.age|| "",
    gender:regFormData.gender|| "",
    intention:regFormData.intention|| "",
    schoolName:regFormData.schoolName|| "",
    address:regFormData.address|| "",
    pincode:regFormData.pincode|| "",
  });
  const [isCooldown, setIsCooldown] = useState(false);

  const intention = ["Compitative", "Life Skill Improvement", "Summer Camp"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormDatas((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isCooldown) return;

    const { kidsName, age, gender, intention, schoolName, address, pincode } =
      formData;
    if (
      !kidsName ||
      !age ||
      !gender ||
      !intention ||
      !schoolName ||
      !address ||
      !pincode
    ) {
      toast.error("Please fill out all fields before submitting.");
      setIsCooldown(true);
      setTimeout(() => setIsCooldown(false), 5000);
      return;
    }

    setIsCooldown(true);
    setTimeout(() => setIsCooldown(false), 5000);

    console.log("Form submitted", formData);
    dispatch(setFormData(formData));
    try {
      const result = await parentKidsRegistration(formData, state);
      console.log(result);
      if (result.status === 201) {
        toast.success(result?.data?.message);
        nextStep();

        setTimeout(() => {
          navigate("/parent/kids/demo", { state: result?.data?.data });
        }, 2000);
      }
    } catch (err) {
      console.log("Error in submitting the data", err);
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
    localStorage.getItem("parentId", state?.data?.parentId);
    toast.info("Kids Registration is incomplete, moving to dashboard");
    if (isCooldown) return;
    setIsCooldown(true);
    setTimeout(() => setIsCooldown(false), 5000);

    setTimeout(() => {
      navigate("/parent/dashboard");
    }, 1500);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <LeftLogoBar />
      <div className="lg:w-3/5 w-auto p-8 bg-white ml-0 mt-8 lg:mt-10 lg:ml-20 lg:mr-20 flex-1 min-h-auto rounded-lg">
        <Stepper />
        <div className="w-full flex-grow overflow-y-auto">
          <h2 className="text-2xl font-bold text-primary mb-2 text-center">
            Student Registration Form
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
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

            <div className="p-4 rounded-lg shadow-sm bg-white border border-primary mb-4">
              <h3 className="text-lg font-semibold text-primary mb-4">
                Intention of Parents
              </h3>
              <div className="space-y-4">
                <select
                  name="intention"
                  value={formData.intention}
                  onChange={handleChange}
                  className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                >
                  <option value="">Select Intention</option>
                  {intention.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bg-white border border-primary p-4 rounded-lg shadow-sm mb-4">
              <h3 className="text-lg font-semibold text-primary mb-4">
                School Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    School Name
                  </label>
                  <input
                    type="text"
                    name="schoolName"
                    value={formData.schoolName}
                    onChange={handleChange}
                    placeholder="Enter school name"
                    className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter address"
                      className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pincode
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="Enter your pincode"
                      className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between gap-4 mt-6">
              <button
                onClick={() => {
                  previousStep();
                  navigate(-1);
                }}
                type="button"
                className="w-1/4 bg-primary text-white py-3 px-4 rounded-md  border-b-4 hover:border-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-300 flex items-center justify-center"
              >
                ← Back
              </button>

              <button
                type="button"
                className={`w-1/2 bg-primary text-white py-3 px-4 rounded-md  border-b-4 hover:border-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition duration-300 ${
                  isCooldown ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={handleSkipDashboard}
                disabled={isCooldown}
              >
                Skip to Dashboard
              </button>

              <button
                type="submit"
                className={`w-1/4 bg-primary text-white py-3 px-4 rounded-md  border-b-4 hover:border-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition duration-300 ${
                  isCooldown ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isCooldown}
              >
                Next →
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

export default ParentKidsRegistration;
