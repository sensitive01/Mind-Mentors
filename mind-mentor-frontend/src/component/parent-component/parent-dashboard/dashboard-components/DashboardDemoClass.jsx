import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Calendar,
  AlertCircle,
  Users,
  BookOpenText,
  Video,
  RefreshCw,
  Check,
  Clock,
  MapPin,
  HelpCircle,
  X,
  ChevronRight,
  User,
  Key,
  Monitor,
  Smartphone,
  Navigation,
  GraduationCap,
  CheckCircle,
  XCircle,
  Edit3,
  Loader,
  MessageCircle,
  Bot,
  Star,
  AlertTriangle,
  LogIn,
  ArrowRight,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getDemoClass,
  checkMmIdAvailability,
  updateChildChessId,
  changeChildPin,
} from "../../../../api/service/parent/ParentService";
import kidLoginPage from "../../../../assets/kidlogin.png";
import kidPinPage from "../../../../assets/kidPinPage.png";

const DashboardDemoClass = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [demoClass, setDemoClass] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showGuide, setShowGuide] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [kidData, setKidData] = useState({});

  // AI Assistant states
  const [showAssistant, setShowAssistant] = useState(false);
  const [assistantStep, setAssistantStep] = useState("greeting");
  const [showMMID, setShowMMID] = useState(false);

  // Edit states - simplified
  const [isEditingPin, setIsEditingPin] = useState(false);
  const [tempMmId, setTempMmId] = useState("");
  const [tempPin, setTempPin] = useState(["", "", "", ""]);

  // Validation states - only for availability check
  const [mmIdStatus, setMmIdStatus] = useState(null);
  const [mmIdError, setMmIdError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Refs
  const mmIdInputRef = useRef(null);
  const pinInputRefs = [useRef(), useRef(), useRef(), useRef()];
  const mmIdTimeoutRef = useRef(null);

  useEffect(() => {
    const fetchDemoClass = async () => {
      try {
        setLoading(true);
        const response = await getDemoClass(id);
        console.log("response", response);
        if (response.status === 200) {
          setDemoClass(response.data.data);
          setKidData(response.data.kidData);

          // Initialize edit states
          setTempMmId(response.data.kidData?.chessId || "");
          if (response.data.kidData?.kidPin) {
            const pinString = String(response.data.kidData.kidPin).padStart(
              4,
              "0"
            );
            setTempPin(pinString.split(""));
          }
        }
      } catch (err) {
        console.log("Error in getting demo class", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDemoClass();

    // Show AI assistant after 3 seconds
    const timer = setTimeout(() => {
      setShowAssistant(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, [id]);

  // Add effect to maintain input focus
  useEffect(() => {
    // Ensure all inputs remain interactive
    const inputs = [
      mmIdInputRef.current,
      ...pinInputRefs.map((ref) => ref.current),
    ].filter(Boolean);
    inputs.forEach((input) => {
      if (input) {
        input.style.pointerEvents = "auto";
        input.removeAttribute("readonly");
      }
    });
  }, [tempMmId, tempPin, isEditingPin, mmIdStatus]);

  useEffect(() => {
    if (mmIdTimeoutRef.current) {
      clearTimeout(mmIdTimeoutRef.current);
    }

    // Reset status if field is empty
    if (tempMmId.trim() === "") {
      setMmIdStatus(null);
      setMmIdError("");
      return;
    }

    // Don't check if it's the same as original
    if (tempMmId.trim() === kidData?.chessId) {
      setMmIdStatus(null);
      setMmIdError("");
      return;
    }

    // Client-side validation first
    const invalidCharsRegex = /[^a-zA-Z0-9_-]/;
    if (invalidCharsRegex.test(tempMmId)) {
      setMmIdStatus(null);
      setMmIdError(
        "Only letters, numbers, underscore (_) and hyphen (-) are allowed"
      );
      return;
    }

    if (tempMmId.trim().length < 3) {
      setMmIdStatus(null);
      setMmIdError("Chess ID must be at least 3 characters");
      return;
    }

    // Longer delay before API call - 2 seconds to give user time to type
    mmIdTimeoutRef.current = setTimeout(async () => {
      // Store current focus state before API call
      const activeElement = document.activeElement;
      const shouldMaintainFocus = activeElement === mmIdInputRef.current;
      const currentSelectionStart = mmIdInputRef.current?.selectionStart;
      const currentSelectionEnd = mmIdInputRef.current?.selectionEnd;

      // Only show checking status right before API call
      setMmIdStatus("checking");
      setMmIdError("");

      // Small delay to allow state update before API call
      await new Promise((resolve) => setTimeout(resolve, 100));

      try {
        const response = await checkMmIdAvailability(tempMmId.trim());
        if (response.status === 200) {
          const { available } = response.data;

          // Update state
          if (available) {
            setMmIdStatus("available");
            setMmIdError("");
          } else {
            setMmIdStatus("taken");
            setMmIdError("Chess ID already taken");
          }

          // Restore focus immediately after state update
          if (shouldMaintainFocus) {
            // Multiple attempts to restore focus
            const restoreFocus = () => {
              if (mmIdInputRef.current) {
                mmIdInputRef.current.focus();
                // Restore cursor position
                if (typeof currentSelectionStart === "number") {
                  mmIdInputRef.current.setSelectionRange(
                    currentSelectionStart,
                    currentSelectionEnd
                  );
                } else {
                  const length = mmIdInputRef.current.value.length;
                  mmIdInputRef.current.setSelectionRange(length, length);
                }
              }
            };

            // Immediate focus restoration
            restoreFocus();

            // Backup attempts
            requestAnimationFrame(restoreFocus);
            setTimeout(restoreFocus, 10);
            setTimeout(restoreFocus, 50);
            setTimeout(restoreFocus, 100);
          }
        }
      } catch (error) {
        console.error("Error checking Chess ID:", error);
        setMmIdStatus(null);
        setMmIdError("Error checking availability");

        // Restore focus even on error
        if (shouldMaintainFocus) {
          const restoreFocus = () => {
            if (mmIdInputRef.current) {
              mmIdInputRef.current.focus();
            }
          };
          restoreFocus();
          setTimeout(restoreFocus, 100);
        }
      }
    }, 2000); // Increased delay to 2 seconds

    return () => {
      if (mmIdTimeoutRef.current) {
        clearTimeout(mmIdTimeoutRef.current);
      }
    };
  }, [tempMmId, kidData?.chessId]);

  const handleReschedule = () => {
    navigate(`/parent/kid/demo-class-shedule/${id}`);
  };

  const handleEnrollNow = () => {
    navigate(`/parent-package-selection/${demoClass.kidId}`);
  };

  const handleOpenMap = () => {
    window.open("https://maps.app.goo.gl/hiZ5And16YiociXQ6?g_st=ipc", "_blank");
  };

  const handleNavigateToLogin = () => {
    const mmid = tempMmId || kidData?.chessId || "";
    const baseUrl = import.meta.env.VITE_BASE_ROUTE;
    const loginUrl = `/kids/login?mmid=${mmid}`;
    window.open(loginUrl, "_blank");
    setShowGuide(false);
  };

  // Helper function to force focus restoration
  const maintainInputFocus = () => {
    if (mmIdInputRef.current) {
      mmIdInputRef.current.focus();
      const length = mmIdInputRef.current.value.length;
      mmIdInputRef.current.setSelectionRange(length, length);
    }
  };

  const handleMmIdChange = (e) => {
    const value = e.target.value;
    setTempMmId(value);

    // Clear any existing status when user is typing
    if (mmIdStatus) {
      setMmIdStatus(null);
      setMmIdError("");
    }

    // Maintain focus aggressively during typing
    const maintainFocusWhileTyping = () => {
      if (
        mmIdInputRef.current &&
        document.activeElement !== mmIdInputRef.current
      ) {
        mmIdInputRef.current.focus();
        // Set cursor to end of input
        const length = value.length;
        mmIdInputRef.current.setSelectionRange(length, length);
      }
    };

    // Multiple attempts to maintain focus
    maintainFocusWhileTyping();
    requestAnimationFrame(maintainFocusWhileTyping);
    setTimeout(maintainFocusWhileTyping, 10);
  };

  const handlePinChange = (index, value) => {
    const newValue = value.replace(/\D/g, "");
    if (newValue.length <= 1) {
      const newPinValues = [...tempPin];
      newPinValues[index] = newValue;
      setTempPin(newPinValues);

      // Auto-focus next input or maintain current focus
      if (newValue.length === 1 && index < 3) {
        setTimeout(() => {
          pinInputRefs[index + 1].current?.focus();
        }, 0);
      } else if (newValue.length === 0) {
        // Maintain focus on current input when deleting
        setTimeout(() => {
          pinInputRefs[index].current?.focus();
        }, 0);
      }
    }
  };

  const handlePinKeyDown = (index, e) => {
    if (e.key === "Backspace" && !tempPin[index] && index > 0) {
      setTimeout(() => {
        pinInputRefs[index - 1].current?.focus();
      }, 0);
    }
  };

  const startEditingPin = () => {
    setIsEditingPin(true);
    setTimeout(() => pinInputRefs[0].current?.focus(), 100);
  };

  const cancelPinEdit = () => {
    setIsEditingPin(false);
    if (kidData?.kidPin) {
      const pinString = String(kidData.kidPin).padStart(4, "0");
      setTempPin(pinString.split(""));
    }
  };

  // Save changes - only called when moving to next step
  const saveChanges = async () => {
    const combinedPin = tempPin.join("");
    const trimmedMmId = tempMmId.trim();

    // Validation for PIN
    if (isEditingPin && combinedPin.length !== 4) {
      alert("PIN must be 4 digits");
      return false;
    }

    // Validation for Chess ID
    if (trimmedMmId === "") {
      alert("Chess ID is required");
      return false;
    }

    // Check for invalid characters in Chess ID
    const invalidCharsRegex = /[^a-zA-Z0-9_-]/;
    if (invalidCharsRegex.test(trimmedMmId)) {
      alert(
        "Chess ID can only contain letters, numbers, underscore (_) and hyphen (-)"
      );
      return false;
    }

    if (trimmedMmId.length < 3) {
      alert("Chess ID must be at least 3 characters");
      return false;
    }

    if (mmIdStatus === "taken") {
      alert("Chess ID is already taken. Please choose a different one.");
      return false;
    }

    if (mmIdStatus === "checking") {
      alert("Please wait while we check Chess ID availability");
      return false;
    }

    try {
      setIsSaving(true);
      const promises = [];

      if (isEditingPin && combinedPin !== String(kidData.kidPin)) {
        promises.push(changeChildPin(id, combinedPin));
      }

      if (trimmedMmId !== kidData?.chessId) {
        promises.push(updateChildChessId(id, trimmedMmId));
      }

      if (promises.length > 0) {
        const responses = await Promise.all(promises);
        const allSuccessful = responses.every(
          (response) => response.status === 200
        );

        if (allSuccessful) {
          // Update kidData
          const updatedKidData = { ...kidData };
          if (isEditingPin) updatedKidData.kidPin = combinedPin;
          updatedKidData.chessId = trimmedMmId;
          setKidData(updatedKidData);

          setIsEditingPin(false);
          setMmIdStatus(null);
          return true;
        }
      }
      return true;
    } catch (error) {
      console.error("Error updating data:", error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Failed to update. Please try again.");
      }
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const getMmIdInputClassName = () => {
    let baseClass =
      "w-full px-3 py-2 border rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:ring-2 cursor-text";

    if (mmIdStatus === "checking") {
      return `${baseClass} bg-yellow-50 border-yellow-300 focus:ring-yellow-200 focus:border-yellow-400`;
    } else if (mmIdStatus === "available") {
      return `${baseClass} bg-green-50 border-green-300 focus:ring-green-200 focus:border-green-400`;
    } else if (mmIdStatus === "taken" || mmIdError) {
      return `${baseClass} bg-red-50 border-red-300 focus:ring-red-200 focus:border-red-400`;
    } else {
      return `${baseClass} bg-white border-gray-300 focus:ring-blue-200 focus:border-blue-400`;
    }
  };

  const getStatusIcon = () => {
    if (mmIdStatus === "checking") {
      return <Loader className="h-4 w-4 text-yellow-500 animate-spin" />;
    } else if (mmIdStatus === "available") {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    } else if (mmIdStatus === "taken") {
      return <XCircle className="h-4 w-4 text-red-500" />;
    }
    return null;
  };

  // AI Assistant Component - Simplified for parent interaction
  const AIAssistant = () => {
    if (!showAssistant) return null;

    return (
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-80 max-h-[480px] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-medium text-sm">Demo Class Assistant</h3>
                  <p className="text-xs opacity-90">Here to help</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowAssistant(false);
                  setAssistantStep("greeting");
                  setShowMMID(false);
                }}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-3 max-h-[400px] overflow-y-auto">
            {assistantStep === "greeting" && (
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="bg-gray-100 rounded-xl rounded-tl-none p-2 flex-1">
                    <p className="text-gray-800 text-sm">
                      Hi! I'm here to help you with your child's demo class. What would you like to know?
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {demoClass && demoClass.status !== "Conducted" && (
                    <button
                      onClick={handleReschedule}
                      className="w-full p-2 text-left bg-orange-50 hover:bg-orange-100 rounded-lg border border-orange-200 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 text-orange-600" />
                        <span className="text-orange-700 font-medium text-sm">
                          Reschedule Demo Class
                        </span>
                      </div>
                      <p className="text-orange-600 text-xs mt-1">
                        Change your demo class timing
                      </p>
                    </button>
                  )}

                  {demoClass && demoClass.type !== "offline" && (
                    <button
                      onClick={() => setShowGuide(true)}
                      className="w-full p-2 text-left bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-blue-600" />
                        <span className="text-blue-700 font-medium text-sm">
                          How to Join Online Class
                        </span>
                      </div>
                      <p className="text-blue-600 text-xs mt-1">
                        Step-by-step joining guide
                      </p>
                    </button>
                  )}

                  {demoClass && demoClass.type === "offline" && (
                    <button
                      onClick={handleOpenMap}
                      className="w-full p-2 text-left bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-green-600" />
                        <span className="text-green-700 font-medium text-sm">
                          Get Directions to Center
                        </span>
                      </div>
                      <p className="text-green-600 text-xs mt-1">
                        Open map for navigation
                      </p>
                    </button>
                  )}

                  <button
                    onClick={() => setAssistantStep("class_info")}
                    className="w-full p-2 text-left bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-purple-600" />
                      <span className="text-purple-700 font-medium text-sm">
                        Class Information
                      </span>
                    </div>
                    <p className="text-purple-600 text-xs mt-1">
                      View demo class details
                    </p>
                  </button>

                  <button
                    onClick={() => setAssistantStep("what_to_expect")}
                    className="w-full p-2 text-left bg-yellow-50 hover:bg-yellow-100 rounded-lg border border-yellow-200 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-600" />
                      <span className="text-yellow-700 font-medium text-sm">
                        What to Expect
                      </span>
                    </div>
                    <p className="text-yellow-600 text-xs mt-1">
                      Learn about the demo class
                    </p>
                  </button>

                  <button
                    onClick={() => setShowAssistant(false)}
                    className="w-full p-2 text-left bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-700 font-medium text-sm">
                        I'm all set!
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {assistantStep === "class_info" && demoClass && (
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="bg-gray-100 rounded-xl rounded-tl-none p-2 flex-1">
                    <p className="text-gray-800 text-sm">
                      Here are your demo class details:
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-blue-700 text-sm font-medium">Program:</span>
                      <span className="text-blue-800 text-sm">{demoClass.program}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700 text-sm font-medium">Date:</span>
                      <span className="text-blue-800 text-sm">{demoClass.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700 text-sm font-medium">Time:</span>
                      <span className="text-blue-800 text-sm">{demoClass.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700 text-sm font-medium">Coach:</span>
                      <span className="text-blue-800 text-sm">{demoClass.coachName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700 text-sm font-medium">Type:</span>
                      <span className="text-blue-800 text-sm capitalize">{demoClass.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700 text-sm font-medium">Status:</span>
                      <span className="text-blue-800 text-sm">{demoClass.status}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setAssistantStep("greeting")}
                  className="w-full p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  ← Back to Menu
                </button>
              </div>
            )}

            {assistantStep === "what_to_expect" && (
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="bg-gray-100 rounded-xl rounded-tl-none p-2 flex-1">
                    <p className="text-gray-800 text-sm">
                      Here's what to expect in your demo class:
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-4 h-4 text-green-600" />
                      <span className="text-green-800 font-medium text-sm">
                        Duration & Format
                      </span>
                    </div>
                    <ul className="text-green-700 text-xs space-y-1 list-disc pl-4">
                      <li>45-60 minute interactive session</li>
                      <li>One-on-one or small group setting</li>
                      <li>Age-appropriate curriculum introduction</li>
                    </ul>
                  </div>

                  <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                    <div className="flex items-center gap-2 mb-1">
                      <GraduationCap className="w-4 h-4 text-purple-600" />
                      <span className="text-purple-800 font-medium text-sm">
                        What Your Child Will Learn
                      </span>
                    </div>
                    <ul className="text-purple-700 text-xs space-y-1 list-disc pl-4">
                      <li>Basic concepts and fundamentals</li>
                      <li>Interactive learning activities</li>
                      <li>Assessment of current skill level</li>
                      <li>Personalized learning path discussion</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span className="text-blue-800 font-medium text-sm">
                        For Parents
                      </span>
                    </div>
                    <ul className="text-blue-700 text-xs space-y-1 list-disc pl-4">
                      <li>Q&A session with the coach</li>
                      <li>Program overview and benefits</li>
                      <li>Flexible scheduling options</li>
                      <li>Next steps discussion</li>
                    </ul>
                  </div>
                </div>

                <button
                  onClick={() => setAssistantStep("greeting")}
                  className="w-full p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  ← Back to Menu
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const guideSteps = [
    {
      title: "Your Child's Login Details",
      content: (
        <div className="space-y-4">
          {/* Chess ID Section */}
          <div className="bg-blue-50 p-3 rounded-lg chess-id-section">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-gray-600">Chess Kid ID:</p>
              {!isEditingPin && (
                <button
                  onClick={startEditingPin}
                  className="p-1 rounded-full hover:bg-blue-100 transition-colors"
                  title="Edit PIN"
                >
                  <Edit3 className="h-3 w-3 text-blue-600" />
                </button>
              )}
            </div>

            <div>
              <div className="relative">
                <input
                  ref={mmIdInputRef}
                  type="text"
                  value={tempMmId}
                  onChange={handleMmIdChange}
                  onFocus={(e) => {
                    // Ensure input stays focusable
                    if (mmIdInputRef.current) {
                      mmIdInputRef.current.style.pointerEvents = "auto";
                      mmIdInputRef.current.removeAttribute("readonly");
                    }
                    e.target.style.pointerEvents = "auto";
                  }}
                  onBlur={(e) => {
                    // Prevent blur during API calls or state updates
                    if (mmIdStatus === "checking") {
                      e.preventDefault();
                      setTimeout(() => maintainInputFocus(), 0);
                      return;
                    }

                    // Only allow blur if user is clicking outside input area
                    const relatedTarget = e.relatedTarget;
                    if (
                      !relatedTarget ||
                      (!mmIdInputRef.current?.contains(relatedTarget) &&
                        !relatedTarget.closest(".chess-id-section"))
                    ) {
                      // Allow natural blur
                    } else {
                      // Maintain focus if blur was caused by React re-render
                      e.preventDefault();
                      setTimeout(() => maintainInputFocus(), 10);
                    }
                  }}
                  onClick={() => {
                    // Ensure click always focuses the input
                    if (mmIdInputRef.current) {
                      mmIdInputRef.current.focus();
                    }
                  }}
                  onMouseDown={(e) => {
                    // Prevent any interference with focus
                    e.stopPropagation();
                  }}
                  className={getMmIdInputClassName()}
                  placeholder="Enter Chess ID"
                  maxLength={20}
                  autoComplete="off"
                  style={{ pointerEvents: "auto", userSelect: "text" }}
                  tabIndex={0}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  {getStatusIcon()}
                </div>
              </div>
              {mmIdError && (
                <p className="text-xs text-red-600 mt-1">{mmIdError}</p>
              )}
              {mmIdStatus === "available" && (
                <p className="text-xs text-green-600 mt-1">
                  Chess ID is available!
                </p>
              )}
              {mmIdStatus === "checking" && (
                <p className="text-xs text-yellow-600 mt-1">
                  Checking availability...
                </p>
              )}
            </div>
          </div>

          {/* PIN Section */}
          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-gray-600">PIN:</p>
              {!isEditingPin ? (
                <button
                  onClick={startEditingPin}
                  className="p-1 rounded-full hover:bg-purple-100 transition-colors"
                  title="Edit PIN"
                >
                  <Edit3 className="h-3 w-3 text-purple-600" />
                </button>
              ) : (
                <button
                  onClick={cancelPinEdit}
                  className="p-1 rounded-full hover:bg-red-100 transition-colors"
                  title="Cancel"
                >
                  <X className="h-3 w-3 text-red-600" />
                </button>
              )}
            </div>

            {isEditingPin ? (
              <div className="flex justify-center gap-2 mt-2">
                {tempPin.map((value, index) => (
                  <input
                    key={index}
                    ref={pinInputRefs[index]}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={value}
                    onChange={(e) => handlePinChange(index, e.target.value)}
                    onKeyDown={(e) => handlePinKeyDown(index, e)}
                    onFocus={() => {
                      // Ensure input stays focusable
                      if (pinInputRefs[index].current) {
                        pinInputRefs[index].current.style.pointerEvents =
                          "auto";
                      }
                    }}
                    className="w-8 h-8 text-center text-sm font-mono bg-white border border-purple-300 rounded
                             focus:border-purple-500 focus:ring-1 focus:ring-purple-200 focus:outline-none
                             transition-colors duration-200 cursor-text"
                    maxLength={1}
                    style={{ pointerEvents: "auto" }}
                  />
                ))}
              </div>
            ) : (
              <p className="font-bold text-purple-800 text-lg">
                {kidData?.kidPin || "Loading..."}
              </p>
            )}
          </div>

          {isSaving && (
            <div className="bg-yellow-50 p-2 rounded-lg">
              <p className="text-xs text-yellow-700 text-center">
                Saving changes...
              </p>
            </div>
          )}
        </div>
      ),
      icon: <Key className="w-8 h-8 text-blue-600" />,
      animation: "🔑",
    },
    {
      title: "Enter PIN Code",
      content: (
        <div className="space-y-3">
          <p className="text-sm text-gray-600 mb-3">
            Type your PIN in the password field
          </p>
          <div className="bg-gray-100 p-4 rounded-lg">
            <img
              src={kidPinPage}
              alt="PIN Input Field"
              className="w-full rounded border"
            />
          </div>
        </div>
      ),
      icon: <Key className="w-8 h-8 text-purple-600" />,
      animation: "🔐",
    },
    {
      title: "Join Your Demo Class",
      content: "Click 'Join Class' button when it appears on your dashboard",
      icon: <Video className="w-8 h-8 text-red-600" />,
      animation: "🎥",
    },
  ];

  const nextStep = async () => {
    if (currentStep === 0) {
      // Save changes when moving from first step
      const saved = await saveChanges();
      if (!saved) return; // Don't proceed if save failed
    }

    if (currentStep < guideSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleNavigateToLogin();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const GuideModal = () => {
    const step = guideSteps[currentStep];

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-sm w-full p-6 relative max-h-[90vh] overflow-y-auto">
          <button
            onClick={() => setShowGuide(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Avatar */}
          <div className="text-center mb-6">
            <div className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center mb-4 animate-bounce">
              <span className="text-3xl">{step.animation}</span>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              {step.title}
            </h3>
            <div className="text-gray-600 text-sm font-medium">
              {typeof step.content === "string" ? (
                <p>{step.content}</p>
              ) : (
                step.content
              )}
            </div>
          </div>

          {/* Progress */}
          <div className="flex justify-center mb-6">
            <div className="flex space-x-1">
              {guideSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentStep
                      ? "bg-blue-500 scale-125"
                      : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                currentStep === 0
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-blue-600 hover:bg-blue-50"
              }`}
            >
              Previous
            </button>

            {currentStep === guideSteps.length - 1 ? (
              <button
                onClick={handleNavigateToLogin}
                className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 text-sm font-medium"
              >
                Go to Login
              </button>
            ) : (
              <button
                onClick={nextStep}
                disabled={
                  isSaving || (currentStep === 0 && mmIdStatus === "checking")
                }
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 text-sm font-medium disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Next"}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const AttendanceInstructions = () => {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center animate-pulse">
              <span className="text-xl">🤖</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                Need Help Joining?
              </h3>
              <p className="text-sm text-gray-600">
                Click here for step-by-step guide
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowGuide(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 font-medium shadow-lg"
          >
            Show Me How
          </button>
        </div>
      </div>
    );
  };

  const renderScheduledClass = () => {
    return (
      <>
        {/* {demoClass.type !== "offline" && <AttendanceInstructions />} */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Info Card */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800">
                Demo Class Details
              </h3>
            </div>
            <div className="p-6">
              <div className="grid sm:grid-cols-2 gap-6 mb-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-50 p-3 rounded-xl">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Schedule
                    </p>
                    <p className="text-gray-800 font-medium mt-1">
                      {demoClass.date}
                    </p>
                    <p className="text-gray-600 text-sm">{demoClass.time}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-50 p-3 rounded-xl">
                    <BookOpenText className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Program</p>
                    <p className="text-gray-800 font-medium mt-1">
                      {demoClass.program}
                    </p>
                    <p className="text-gray-600 text-sm">
                      Level: {demoClass.level}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6 mb-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-green-50 p-3 rounded-xl">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Coach</p>
                    <p className="text-gray-800 font-medium mt-1">
                      {demoClass.coachName}
                    </p>
                    <p className="text-gray-600 text-sm">Expert Instructor</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-orange-50 p-3 rounded-xl">
                    {demoClass.type === "offline" ? (
                      <MapPin className="w-6 h-6 text-orange-600" />
                    ) : (
                      <Video className="w-6 h-6 text-orange-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Class Type
                    </p>
                    <p className="text-gray-800 font-medium mt-1 capitalize">
                      {demoClass.type}
                    </p>
                    {demoClass.type === "offline" && demoClass.centerName && (
                      <p className="text-gray-600 text-sm">
                        {demoClass.centerName}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              {/* Map Section for Offline Classes */}
              {demoClass.type === "offline" && (
                <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="text-base font-semibold text-gray-800">
                          Visit Our Center
                        </h4>
                        <p className="text-sm text-gray-600">
                          Get directions to the academy
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleOpenMap}
                      className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center space-x-2 text-sm font-medium"
                    >
                      <Navigation className="w-4 h-4" />
                      <span>Open Map</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Status & Action Card */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800">
                Class Status
              </h3>
            </div>
            <div className="p-6 space-y-6">
              <div className="bg-blue-50 p-4 rounded-xl">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-600">Status</p>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {demoClass.status}
                  </span>
                </div>
              </div>

              {/* Reschedule Button */}
              <button
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-sm"
                onClick={handleReschedule}
              >
                <RefreshCw className="w-5 h-5" />
                <span>Reschedule Class</span>
              </button>
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderConductedClass = () => {
    return (
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Info Card */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800">
              Class Details
            </h3>
          </div>
          <div className="p-6">
            <div className="grid sm:grid-cols-2 gap-6 mb-6">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-50 p-3 rounded-xl">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Schedule</p>
                  <p className="text-gray-800 font-medium mt-1">
                    {demoClass.date}
                  </p>
                  <p className="text-gray-600 text-sm">{demoClass.time}</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-purple-50 p-3 rounded-xl">
                  <BookOpenText className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Program</p>
                  <p className="text-gray-800 font-medium mt-1">
                    {demoClass.program}
                  </p>
                  <p className="text-gray-600 text-sm">
                    Level: {demoClass.level}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-green-50 p-3 rounded-xl">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Coach</p>
                <p className="text-gray-800 font-medium mt-1">
                  {demoClass.coachName}
                </p>
                <p className="text-gray-600 text-sm">Expert Instructor</p>
              </div>
            </div>

            {/* Enrollment Call-to-Action */}
            <div className="mt-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎉</span>
                </div>
                <h4 className="text-lg font-bold text-gray-800 mb-2">
                  Great Job!
                </h4>
                <p className="text-gray-600 text-sm mb-4">
                  Your demo class was successfully completed. Ready to continue
                  your learning journey?
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Status & Enrollment Card */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800">
              Class Status
            </h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="bg-green-50 p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-600">Status</p>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  Completed
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">
                  Class Completion
                </p>
                <div className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-gray-800 font-medium">
                    Successfully Completed
                  </span>
                </div>
              </div>
            </div>

            {/* Enroll Now Button */}
            <button
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-sm"
              onClick={handleEnrollNow}
            >
              <GraduationCap className="w-5 h-5" />
              <span>Enroll Now</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderNoClass = () => (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center max-w-md px-4">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
            <Clock className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-3">
          No Demo Class Scheduled
        </h3>
        <p className="text-gray-600 mb-6">
          Ready to begin your learning journey? Schedule a demo class with our
          experienced coaches at your preferred time.
        </p>
        <button
          onClick={handleReschedule}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 inline-flex items-center space-x-2"
        >
          <Calendar className="w-5 h-5" />
          <span className="font-medium">Schedule Demo Class</span>
        </button>

        {/* Schedule Information for No Class state */}
        <div className="mt-6 p-4 bg-blue-50 rounded-xl">
          <p className="text-gray-600 text-sm leading-relaxed">
            Every class happens at a minimum schedule of 1 hour and your final
            schedule will be assigned by the service delivery team as per your
            child's convenient timings.
          </p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading demo class details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-xl">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {!demoClass
          ? renderNoClass()
          : demoClass.status === "Conducted"
          ? renderConductedClass()
          : renderScheduledClass()}
      </div>

      {/* AI Assistant */}
      <AIAssistant />

      {/* Chat trigger when assistant is closed */}
      {!showAssistant && (
        <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={() => setShowAssistant(true)}
            className="w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center group hover:scale-110"
          >
            <MessageCircle className="w-7 h-7 group-hover:scale-110 transition-transform" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
              <span className="text-xs text-white font-bold">!</span>
            </div>
          </button>
        </div>
      )}

      {showGuide && <GuideModal />}
    </div>
  );
};

export default DashboardDemoClass;