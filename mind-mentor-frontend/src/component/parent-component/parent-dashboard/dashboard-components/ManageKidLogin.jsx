import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  changeChildPin,
  ParentManageChildLogin,
} from "../../../../api/service/parent/ParentService";
import { toast, ToastContainer } from "react-toastify";
import { Lock, User, CreditCard } from "lucide-react"; // Changed Id to CreditCard
import "react-toastify/dist/ReactToastify.css";
import "./float.css";

const ManageChildLogin = () => {
  const { id } = useParams();
  const [child, setChild] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pinValues, setPinValues] = useState(["", "", "", ""]);
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];

  useEffect(() => {
    const fetchChildData = async () => {
      try {
        const response = await ParentManageChildLogin(id);
        console.log("Child data response:", response.data);

        if (response && response.data) {
          setChild(response.data);

          // Properly handle the PIN value
          if (
            response.data.kidPin !== null &&
            response.data.kidPin !== undefined
          ) {
            // Convert to string and ensure 4 digits with padding
            const pinString = String(response.data.kidPin).padStart(4, "0");
            console.log("Formatted PIN string:", pinString);

            // Split into array for individual inputs
            setPinValues(pinString.split(""));
          }
        }
      } catch (error) {
        console.error("Error fetching child data:", error);
        toast.error("Failed to load child data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchChildData();
  }, [id]);

  // Debug current pin values
  useEffect(() => {
    console.log("Current pinValues:", pinValues);
  }, [pinValues]);

  const handlePinChange = (index, value) => {
    // Allow only digits
    const newValue = value.replace(/\D/g, "");

    if (newValue.length <= 1) {
      const newPinValues = [...pinValues];
      newPinValues[index] = newValue;
      setPinValues(newPinValues);

      // Auto-focus next input
      if (newValue.length === 1 && index < 3) {
        inputRefs[index + 1].current.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace to move to previous input
    if (e.key === "Backspace" && !pinValues[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handleSavePin = async () => {
    const combinedPin = pinValues.join("");

    if (combinedPin.length !== 4) {
      toast.error("PIN must be 4 digits");
      return;
    }

    // Only make API call if PIN has changed
    if (combinedPin !== String(child.kidPin)) {
      try {
        const response = await changeChildPin(id, combinedPin);

        if (response.status === 200) {
          setChild((prev) => ({ ...prev, kidPin: combinedPin }));
          toast.success(response.data.message || "PIN updated successfully");
        }
      } catch (error) {
        console.error("Error updating PIN:", error);
        toast.error("Failed to update PIN");
      }
    } else {
      toast.info("PIN remains unchanged");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-700 font-medium animate-pulse flex items-center">
          <div className="mr-2 h-5 w-5 border-t-2 border-primary border-solid rounded-full animate-spin"></div>
          Loading...
        </div>
      </div>
    );
  }

  if (!child) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-md">
          <div className="text-red-500 mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="text-gray-700 text-center font-medium">
            No child data found
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
          {/* Header Section */}
          <div className="bg-primary p-4 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <svg
                className="w-full h-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <path d="M0,0 L100,0 L100,100 Z" fill="white" />
              </svg>
            </div>

            <div className="relative">
              <div className="mx-auto w-14 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-lg transform transition-transform duration-300 hover:scale-105">
                <Lock className="w-10 h-10 text-primary transition-all duration-300 hover:rotate-12" />
              </div>

              <h1 className="text-2xl font-bold text-white mb-2">
                Manage Child Login
              </h1>

              <p className="text-white text-opacity-90 text-sm">
                Update your child's PIN for secure account access
              </p>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8 space-y-4">
            {/* Child Details */}
            <div className="space-y-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Child Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={child.kidsName || ""}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:ring-primary focus:border-primary transition-all duration-200"
                    disabled
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chess ID
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CreditCard className="h-5 w-5 text-gray-400" />{" "}
                    {/* Changed from Id to CreditCard */}
                  </div>
                  <input
                    type="text"
                    value={child.chessId || ""}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:ring-primary focus:border-primary transition-all duration-200"
                    disabled
                  />
                </div>
              </div>
            </div>

            {/* PIN Code Section */}
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PIN Code
                </label>

                <div className="flex justify-center gap-3 sm:gap-4">
                  {pinValues.map((value, index) => (
                    <input
                      key={index}
                      ref={inputRefs[index]}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={value}
                      onChange={(e) => handlePinChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-10 h-9 sm:w-16 sm:h-16 text-center text-xl font-mono bg-gray-50 border border-gray-300 rounded-lg
                             shadow-sm
                             transition-all duration-200
                             focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-50
                             hover:border-primary hover:bg-white"
                      maxLength={1}
                    />
                  ))}
                </div>
                <p className="mt-2 text-sm text-gray-500 text-center">
                  Enter a 4-digit PIN for your child's account
                </p>
              </div>

              <button
                onClick={handleSavePin}
                className="w-full py-3 px-4 bg-primary text-white rounded-lg font-medium 
                       shadow-md hover:shadow-lg
                       transition-all duration-300
                       transform hover:-translate-y-1
                       active:shadow-inner active:translate-y-0
                       focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Update PIN
              </button>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default ManageChildLogin;
