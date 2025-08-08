import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  changeChildPin,
  ParentManageChildLogin,
  checkMmIdAvailability,
  updateChildChessId,
} from "../../../../api/service/parent/ParentService";
import { toast, ToastContainer } from "react-toastify";
import {
  Lock,
  User,
  CreditCard,
  CheckCircle,
  XCircle,
  Edit3,
} from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import "./float.css";

const ManageChildLogin = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [child, setChild] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pinValues, setPinValues] = useState(["", "", "", ""]);
  const [chessId, setChessId] = useState("");
  const [originalChessId, setOriginalChessId] = useState("");
  const [chessIdStatus, setChessIdStatus] = useState(null);
  const [chessIdError, setChessIdError] = useState("");
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];
  const chessIdInputRef = useRef(null);
  const chessIdTimeoutRef = useRef(null);

  useEffect(() => {
    const fetchChildData = async () => {
      try {
        const response = await ParentManageChildLogin(id);
        console.log("Child data response:", response.data);

        if (response && response.data) {
          setChild(response.data);
          setChessId(response.data.chessId || "");
          setOriginalChessId(response.data.chessId || "");

          // Properly handle the PIN value
          if (
            response.data.kidPin !== null &&
            response.data.kidPin !== undefined
          ) {
            const pinString = String(response.data.kidPin).padStart(4, "0");
            console.log("Formatted PIN string:", pinString);
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

  // Chess ID validation with debounce
  useEffect(() => {
    if (chessIdTimeoutRef.current) {
      clearTimeout(chessIdTimeoutRef.current);
    }

    if (chessId.trim() === "") {
      setChessIdStatus(null);
      setChessIdError("");
      return;
    }

    // If chess ID hasn't changed from original, don't check
    if (chessId.trim() === originalChessId) {
      setChessIdStatus(null);
      setChessIdError("");
      return;
    }

    // Basic validation
    if (chessId.trim().length < 3) {
      setChessIdStatus(null);
      setChessIdError("Chess ID must be at least 3 characters");
      return;
    }

    setChessIdStatus("checking");
    setChessIdError("");

    chessIdTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await checkMmIdAvailability(chessId.trim());

        if (response.status === 200) {
          const { available } = response.data;

          if (available) {
            setChessIdStatus("available");
            setChessIdError("");
          } else {
            setChessIdStatus("taken");
            setChessIdError("Chess ID already taken");
          }
        }
      } catch (error) {
        console.error("Error checking chess ID:", error);
        setChessIdStatus(null);
        setChessIdError("Error checking availability");
      }
    }, 800);

    return () => {
      if (chessIdTimeoutRef.current) {
        clearTimeout(chessIdTimeoutRef.current);
      }
    };
  }, [chessId, originalChessId]);

  useEffect(() => {
    console.log("Current pinValues:", pinValues);
  }, [pinValues]);

  const handleChessIdChange = (e) => {
    const value = e.target.value;
    // Allow only alphanumeric characters and basic symbols
    const sanitizedValue = value.replace(/[^a-zA-Z0-9_-]/g, "");
    setChessId(sanitizedValue);
  };

  const handlePinChange = (index, value) => {
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

  const handleChessIdEditClick = () => {
    if (chessIdInputRef.current) {
      chessIdInputRef.current.focus();
      chessIdInputRef.current.select(); // Select all text for easy editing
    }
  };

  const handlePinEditClick = () => {
    if (inputRefs[0].current) {
      inputRefs[0].current.focus();
      inputRefs[0].current.select(); // Select the content of first PIN input
    }
  };

  const handleSaveChanges = async () => {
    const combinedPin = pinValues.join("");
    const trimmedChessId = chessId.trim();

    // Validation
    if (combinedPin.length !== 4) {
      toast.error("PIN must be 4 digits");
      return;
    }

    if (trimmedChessId === "") {
      toast.error("Chess ID is required");
      return;
    }

    if (trimmedChessId.length < 3) {
      toast.error("Chess ID must be at least 3 characters");
      return;
    }

    // Check if chess ID is taken (but not the original one)
    if (chessIdStatus === "taken") {
      toast.error("Chess ID is already taken. Please choose a different one.");
      return;
    }

    // Check if chess ID is still being validated
    if (chessIdStatus === "checking") {
      toast.warning("Please wait while we check Chess ID availability");
      return;
    }

    const pinChanged = combinedPin !== String(child.kidPin);
    const chessIdChanged = trimmedChessId !== originalChessId;

    if (!pinChanged && !chessIdChanged) {
      toast.info("No changes detected");
      return;
    }

    try {
      const promises = [];

      // Update PIN if changed
      if (pinChanged) {
        promises.push(changeChildPin(id, combinedPin));
      }

      // Update Chess ID if changed
      if (chessIdChanged) {
        promises.push(updateChildChessId(id, trimmedChessId));
      }

      const responses = await Promise.all(promises);

      // Check if all requests were successful
      const allSuccessful = responses.every(
        (response) => response.status === 200
      );

      if (allSuccessful) {
        // Update local state
        setChild((prev) => ({
          ...prev,
          kidPin: pinChanged ? combinedPin : prev.kidPin,
          chessId: chessIdChanged ? trimmedChessId : prev.chessId,
        }));

        setOriginalChessId(trimmedChessId);
        setChessIdStatus(null);

        const updateMessages = [];
        if (pinChanged) updateMessages.push("PIN");
        if (chessIdChanged) updateMessages.push("Chess ID");

        toast.success(`${updateMessages.join(" and ")} updated successfully`);

        setTimeout(() => {
          navigate(`/parent/kid/attendance/${id}`);
        }, 1500);
      }
    } catch (error) {
      console.error("Error updating data:", error);

      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to update. Please try again.");
      }
    }
  };

  const getChessIdInputClassName = () => {
    let baseClass =
      "w-full pl-10 pr-12 py-3 border rounded-lg text-gray-700 transition-all duration-200 focus:outline-none focus:ring-2";

    if (chessIdStatus === "checking") {
      return `${baseClass} bg-yellow-50 border-yellow-300 focus:ring-yellow-200`;
    } else if (chessIdStatus === "available") {
      return `${baseClass} bg-green-50 border-green-300 focus:ring-green-200`;
    } else if (chessIdStatus === "taken" || chessIdError) {
      return `${baseClass} bg-red-50 border-red-300 focus:ring-red-200`;
    } else {
      return `${baseClass} bg-gray-50 border-gray-200 focus:ring-primary focus:border-primary`;
    }
  };

  const getStatusIcon = () => {
    if (chessIdStatus === "checking") {
      return (
        <div className="animate-spin h-5 w-5 border-2 border-yellow-500 border-t-transparent rounded-full"></div>
      );
    } else if (chessIdStatus === "available") {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    } else if (chessIdStatus === "taken") {
      return <XCircle className="h-5 w-5 text-red-500" />;
    }
    return null;
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-4 px-4 sm:px-6 lg:px-8">
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
                Update your child's PIN and MM ID for secure account access
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
                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  MM ID *
                  <button
                    type="button"
                    onClick={handleChessIdEditClick}
                    className="ml-1.5 p-1 rounded-full hover:bg-primary hover:bg-opacity-10 transition-all duration-200 group"
                    title="Click to edit MM ID"
                  >
                    <Edit3 className="h-4 w-4 text-primary animate-pulse group-hover:animate-none group-hover:scale-110" />
                  </button>
                  <span className="text-xs text-primary ml-1">
                    (Click to edit)
                  </span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CreditCard className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    ref={chessIdInputRef}
                    type="text"
                    value={chessId}
                    onChange={handleChessIdChange}
                    className={getChessIdInputClassName()}
                    placeholder="Enter unique Chess ID"
                    maxLength={20}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    {getStatusIcon()}
                  </div>
                </div>

                {/* Status messages */}
                {chessIdStatus === "checking" && (
                  <p className="mt-1 text-sm text-yellow-600">
                    Checking availability...
                  </p>
                )}
                {chessIdStatus === "available" && (
                  <p className="mt-1 text-sm text-green-600">
                    Chess ID is available!
                  </p>
                )}
                {chessIdStatus === "taken" && (
                  <p className="mt-1 text-sm text-red-600">
                    Chess ID is already taken
                  </p>
                )}
                {chessIdError && chessIdStatus !== "taken" && (
                  <p className="mt-1 text-sm text-red-600">{chessIdError}</p>
                )}
                {!chessIdError &&
                  !chessIdStatus &&
                  chessId.trim() !== originalChessId && (
                    <p className="mt-1 text-sm text-gray-500">
                      Must be at least 3 characters (letters, numbers, _, -)
                    </p>
                  )}
              </div>
            </div>

            {/* PIN Code Section */}
            <div className="space-y-5">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  PIN Code *
                  <button
                    type="button"
                    onClick={handlePinEditClick}
                    className="ml-1.5 p-1 rounded-full hover:bg-primary hover:bg-opacity-10 transition-all duration-200 group"
                    title="Click to edit PIN"
                  >
                    <Edit3 className="h-4 w-4 text-primary animate-pulse group-hover:animate-none group-hover:scale-110" />
                  </button>
                  <span className="text-xs text-primary ml-1">
                    (Click to edit)
                  </span>
                </label>

                <div className="flex justify-center gap-3 sm:gap-4">
                  {pinValues.map((value, index) => (
                    <div key={index} className="relative">
                      <input
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
                      {/* Small edit indicator on first PIN input */}
                      {index === 0 && (
                        <button
                          type="button"
                          onClick={handlePinEditClick}
                          className="absolute -top-1 -right-1 p-0.5 rounded-full hover:bg-primary hover:bg-opacity-10 transition-all duration-200"
                          title="Click to edit PIN"
                        >
                          <Edit3 className="h-3 w-3 text-primary opacity-60 hover:opacity-100" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-sm text-gray-500 text-center">
                  Enter a 4-digit PIN for your child's account
                </p>
              </div>

              <button
                onClick={handleSaveChanges}
                disabled={
                  chessIdStatus === "checking" ||
                  chessIdStatus === "taken" ||
                  chessIdError
                }
                className="w-full py-3 px-4 bg-primary text-white rounded-lg font-medium 
                       shadow-md hover:shadow-lg
                       transition-all duration-300
                       transform hover:-translate-y-1
                       active:shadow-inner active:translate-y-0
                       focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {chessIdStatus === "checking"
                  ? "Checking..."
                  : "Update Details"}
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
