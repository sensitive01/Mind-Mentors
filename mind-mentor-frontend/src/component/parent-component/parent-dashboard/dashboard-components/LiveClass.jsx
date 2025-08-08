import React, { useEffect, useState } from "react";
import {
  Clock,
  User,
  Calendar,
  MapPin,
  Monitor,
  Loader,
  AlertCircle,
  X,
  MessageCircle,
  Bot,
  CheckCircle,
  XCircle,
  GraduationCap,
  Star,
  AlertTriangle,
  HelpCircle,
  Key,
  LogIn,
  ArrowRight,
} from "lucide-react";
import { getKidLiveClass } from "../../../../api/service/parent/ParentService";
import { useParams } from "react-router-dom";
import axios from "axios";

const LiveClass = () => {
  const { kidId } = useParams();
  const [classData, setClassData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [kidName, setKidName] = useState(null);

  // AI Assistant states
  const [showAssistant, setShowAssistant] = useState(false);
  const [assistantStep, setAssistantStep] = useState("greeting");
  const [selectedClassToCancel, setSelectedClassToCancel] = useState(null);
  const [cancellationReason, setCancellationReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState("");

  // Platform guide states
  const [showMMID, setShowMMID] = useState(false);
  const [currentChildLogin, setCurrentChildLogin] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!kidId) return;

      setLoading(true);
      try {
        const response = await getKidLiveClass(kidId);
        if (response.status === 200) {
          setClassData(response.data.data);
          setKidName(response.data.kidName);
          setCurrentChildLogin({
            mmid: kidId,
            pin: "1234",
          });
        } else {
          setError("Failed to fetch class data");
        }
      } catch (error) {
        console.error("Error fetching live class data:", error);
        setError("Error loading class information");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Show AI assistant after 3 seconds
    const timer = setTimeout(() => {
      setShowAssistant(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, [kidId]);

  const isToday = (classDay) => {
    const today = new Date();
    const todayDayName = today.toLocaleDateString("en-US", { weekday: "long" });

    if ((classDay && classDay.includes("-")) || classDay.includes("/")) {
      const classDate = new Date(classDay);
      const classDayName = classDate.toLocaleDateString("en-US", {
        weekday: "long",
      });
      return todayDayName.toLowerCase() === classDayName.toLowerCase();
    }

    return todayDayName.toLowerCase() === classDay.toLowerCase();
  };

  const getTodayClasses = () => {
    return classData.filter((classItem) => {
      return classItem.classDate
        ? isToday(classItem.classDate)
        : isToday(classItem.day);
    });
  };

  const parseClassTime = (timeString) => {
    if (!timeString) return null;

    try {
      // Extract start time from range (e.g., "4:30 PM" from "4:30 PM - 5:00 PM")
      const startTime = timeString.split(" - ")[0].trim();

      // Parse time like "4:30 PM"
      const timeMatch = startTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
      if (!timeMatch) return null;

      let hours = parseInt(timeMatch[1]);
      const minutes = parseInt(timeMatch[2]);
      const ampm = timeMatch[3].toUpperCase();

      // Convert to 24-hour format
      if (ampm === "PM" && hours !== 12) {
        hours += 12;
      } else if (ampm === "AM" && hours === 12) {
        hours = 0;
      }

      return { hours, minutes };
    } catch (error) {
      console.error("Error parsing time:", timeString, error);
      return null;
    }
  };

  const canCancelClass = (classItem) => {
    const now = new Date();
    const classDateTime = new Date(classItem.classDate || classItem.day);

    if (classItem.classTime) {
      const parsedTime = parseClassTime(classItem.classTime);
      if (parsedTime) {
        classDateTime.setHours(parsedTime.hours, parsedTime.minutes, 0, 0);
      }
    }

    const timeDiff = classDateTime.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);

    return hoursDiff >= 1;
  };

  const getCancellableClasses = () => {
    return classData.filter((classItem) => canCancelClass(classItem));
  };

  const validateCancellation = (classItem) => {
    if (!canCancelClass(classItem)) {
      const now = new Date();
      const classDateTime = new Date(classItem.classDate || classItem.day);

      if (classItem.classTime) {
        const parsedTime = parseClassTime(classItem.classTime);
        if (parsedTime) {
          classDateTime.setHours(parsedTime.hours, parsedTime.minutes, 0, 0);
        }
      }

      const timeDiff = classDateTime.getTime() - now.getTime();
      const minutesDiff = Math.floor(timeDiff / (1000 * 60));

      if (minutesDiff < 0) {
        return "This class has already started or ended.";
      } else if (minutesDiff < 60) {
        return `Sorry! Classes can only be cancelled at least 1 hour before start time. Only ${minutesDiff} minutes remaining.`;
      }
    }
    return null;
  };

  const handleClassSelection = (classItem) => {
    const error = validateCancellation(classItem);
    if (error) {
      setValidationError(error);
      setAssistantStep("validation_error");
      return;
    }

    setSelectedClassToCancel(classItem);
    setValidationError("");
    setAssistantStep("cancel_form");
  };

  const handleCancelClass = async () => {
    if (!selectedClassToCancel || !cancellationReason.trim()) return;

    // Double check validation before API call
    const error = validateCancellation(selectedClassToCancel);
    if (error) {
      setValidationError(error);
      setAssistantStep("validation_error");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `/api/cancel-class/${selectedClassToCancel._id}`,
        {
          kidId,
          reason: cancellationReason.trim(),
          cancelledBy: "parent",
        }
      );

      if (response.status === 200) {
        setClassData((prev) =>
          prev.filter((c) => c._id !== selectedClassToCancel._id)
        );
        setAssistantStep("success");
        setCancellationReason("");
        setSelectedClassToCancel(null);
      }
    } catch (error) {
      console.error("Error cancelling class:", error);
      setValidationError("Failed to cancel class. Please try again.");
      setAssistantStep("validation_error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "Time not specified";

    // If it's already in the format "4:30 PM - 5:00 PM", return as is
    if (timeString.includes("AM") || timeString.includes("PM")) {
      return timeString;
    }

    // Fallback for other formats
    try {
      const [hours, minutes] = timeString.split(":");
      const hour = parseInt(hours, 10);
      const minute = minutes || "00";
      const ampm = hour >= 12 ? "PM" : "AM";
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minute} ${ampm}`;
    } catch (e) {
      return timeString;
    }
  };

  // AI Assistant Component
  const AIAssistant = () => {
    if (!showAssistant) return null;

    const cancellableClasses = getCancellableClasses();

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
                  <h3 className="font-medium text-sm">Class Assistant</h3>
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
                      Hi! I can help you manage your classes. What would you
                      like to do?
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => setAssistantStep("platform_guide")}
                    className="w-full p-2 text-left bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-blue-600" />
                      <span className="text-blue-700 font-medium text-sm">
                        New to Platform?
                      </span>
                    </div>
                    <p className="text-blue-600 text-xs mt-1">
                      Learn how to attend classes
                    </p>
                  </button>

                  <button
                    onClick={() => setAssistantStep("cancel_options")}
                    className="w-full p-2 text-left bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-red-600" />
                      <span className="text-red-700 font-medium text-sm">
                        Cancel a Class
                      </span>
                    </div>
                    <p className="text-red-600 text-xs mt-1">
                      {cancellableClasses.length} classes available to cancel
                    </p>
                  </button>

                  <button
                    onClick={() => setShowAssistant(false)}
                    className="w-full p-2 text-left bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-700 font-medium text-sm">
                        I'm all good!
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {assistantStep === "platform_guide" && (
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="bg-gray-100 rounded-xl rounded-tl-none p-2 flex-1">
                    <p className="text-gray-800 text-sm">
                      To attend live classes, your child needs to login using:
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Key className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-blue-800">MMID:</span>
                    <span className="text-blue-700">
                      {showMMID ? currentChildLogin?.mmid : "••••••••"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-blue-800">PIN:</span>
                    <span className="text-blue-700">
                      {showMMID ? currentChildLogin?.pin : "••••"}
                    </span>
                  </div>

                  {!showMMID && (
                    <button
                      onClick={() => setShowMMID(true)}
                      className="mt-3 w-full py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors"
                    >
                      Show MMID & PIN
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => setAssistantStep("platform_guide_login")}
                    className="w-full p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Go to Login Page</span>
                  </button>

                  <button
                    onClick={() => {
                      setAssistantStep("greeting");
                      setShowMMID(false);
                    }}
                    className="w-full p-2 text-center text-gray-500 hover:text-gray-700 transition-colors text-sm"
                  >
                    ← Back
                  </button>
                </div>
              </div>
            )}

            {assistantStep === "platform_guide_login" && (
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="bg-gray-100 rounded-xl rounded-tl-none p-2 flex-1">
                    <p className="text-gray-800 text-sm">
                      Follow these steps to join classes:
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="bg-white border border-gray-200 rounded-lg p-3">
                    <div className="flex items-start gap-2 mb-2">
                      <div className="bg-blue-100 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-blue-700">
                          1
                        </span>
                      </div>
                      <p className="text-gray-800 text-sm">
                        Go to{" "}
                        <a
                          href="https://live.mindmentorz.in/kids/login"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          live.mindmentorz.in/kids/login
                        </a>
                      </p>
                    </div>

                    <div className="flex items-start gap-2 mb-2">
                      <div className="bg-blue-100 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-blue-700">
                          2
                        </span>
                      </div>
                      <p className="text-gray-800 text-sm">
                        Enter the MMID and PIN shown above
                      </p>
                    </div>

                    <div className="flex items-start gap-2">
                      <div className="bg-blue-100 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-blue-700">
                          3
                        </span>
                      </div>
                      <p className="text-gray-800 text-sm">
                        In the dashboard, you'll see "Today's Classes" - click
                        "Join" when it's time
                      </p>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertCircle className="w-4 h-4 text-yellow-600" />
                      <span className="text-yellow-800 font-medium text-sm">
                        Important Notes
                      </span>
                    </div>
                    <ul className="text-yellow-700 text-xs space-y-1 list-disc pl-4">
                      <li>Classes can be joined 5 minutes before start time</li>
                      <li>Use Chrome or Firefox for best experience</li>
                      <li>Allow camera and microphone permissions</li>
                      <li>Ensure stable internet connection</li>
                    </ul>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setAssistantStep("platform_guide")}
                      className="flex-1 p-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                      ← Back
                    </button>
                    <a
                      href="https://live.mindmentorz.in/kids/login"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm text-center flex items-center justify-center gap-1"
                    >
                      Open Login Page <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            )}

            {assistantStep === "cancel_options" && (
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="bg-gray-100 rounded-xl rounded-tl-none p-2 flex-1">
                    <p className="text-gray-800 text-sm">
                      Select a class to cancel. Remember, classes can only be
                      cancelled 1+ hours before start time.
                    </p>
                  </div>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {classData.map((classItem) => (
                    <button
                      key={classItem._id}
                      onClick={() => handleClassSelection(classItem)}
                      className="w-full p-2 text-left bg-white border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm truncate">
                            {classItem.program}
                          </p>
                          <p className="text-xs text-gray-600">
                            {formatDate(classItem.classDate || classItem.day)}
                          </p>
                          <p className="text-xs text-gray-600">
                            {formatTime(classItem.classTime)}
                          </p>
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ml-2 ${
                            canCancelClass(classItem)
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {canCancelClass(classItem)
                            ? "Can Cancel"
                            : "Too Late"}
                        </span>
                      </div>
                    </button>
                  ))}

                  <button
                    onClick={() => setAssistantStep("greeting")}
                    className="w-full p-2 text-center text-gray-500 hover:text-gray-700 transition-colors text-sm"
                  >
                    ← Back
                  </button>
                </div>
              </div>
            )}

            {assistantStep === "validation_error" && (
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                  </div>
                  <div className="bg-red-50 rounded-xl rounded-tl-none p-2 flex-1 border border-red-200">
                    <p className="text-red-800 font-medium text-sm mb-1">
                      Oops! Cannot Cancel Class
                    </p>
                    <p className="text-red-700 text-sm">{validationError}</p>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertCircle className="w-4 h-4 text-yellow-600" />
                    <span className="text-yellow-800 font-medium text-sm">
                      Cancellation Policy
                    </span>
                  </div>
                  <p className="text-yellow-700 text-xs">
                    Classes must be cancelled at least 1 hour before the start
                    time.
                  </p>
                </div>

                <button
                  onClick={() => setAssistantStep("cancel_options")}
                  className="w-full p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                >
                  ← Try Another Class
                </button>
              </div>
            )}

            {assistantStep === "cancel_form" && selectedClassToCancel && (
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="bg-gray-100 rounded-xl rounded-tl-none p-2 flex-1">
                    <p className="text-gray-800 text-sm">
                      Please tell us why you need to cancel this class:
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 p-2 rounded-lg border border-blue-200">
                  <p className="font-medium text-blue-900 text-sm">
                    {selectedClassToCancel.program}
                  </p>
                  <p className="text-blue-700 text-xs">
                    {formatDate(
                      selectedClassToCancel.classDate ||
                        selectedClassToCancel.day
                    )}{" "}
                    at {formatTime(selectedClassToCancel.classTime)}
                  </p>
                </div>

                <div>
                  <textarea
                    value={cancellationReason}
                    onChange={(e) => setCancellationReason(e.target.value)}
                    placeholder="Reason for cancellation (e.g., child is sick, emergency, scheduling conflict)..."
                    className="w-full p-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                    rows={3}
                    maxLength={300}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {cancellationReason.length}/300 characters
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setAssistantStep("cancel_options")}
                    className="flex-1 p-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleCancelClass}
                    disabled={!cancellationReason.trim() || isSubmitting}
                    className="flex-1 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-1 text-sm"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader className="w-3 h-3 animate-spin" />
                        Cancelling...
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3" />
                        Cancel Class
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {assistantStep === "success" && (
              <div className="space-y-3 text-center">
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="bg-green-50 rounded-xl rounded-tl-none p-2 flex-1 border border-green-200">
                    <p className="text-green-800 font-medium text-sm mb-1">
                      ✅ Class Cancelled Successfully!
                    </p>
                    <p className="text-green-700 text-xs">
                      You'll receive a confirmation email shortly. The coach has
                      been notified.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setAssistantStep("greeting");
                    setSelectedClassToCancel(null);
                    setCancellationReason("");
                    setValidationError("");
                  }}
                  className="w-full p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Back to Menu
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-5xl mx-auto p-4">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <Loader className="w-10 h-10 text-blue-600 animate-spin mx-auto" />
              <p className="mt-3 text-gray-600 font-medium">
                Loading classes...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-5xl mx-auto p-4">
          <div className="bg-red-50 border border-red-200 p-4 rounded-xl">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
              <div>
                <p className="text-red-700 font-medium">{error}</p>
                <p className="text-red-600 text-sm mt-1">
                  Please refresh or contact support
                </p>
              </div>
            </div>
          </div>
        </div>
        <AIAssistant />
      </div>
    );
  }

  const todayClasses = getTodayClasses();

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-5xl mx-auto p-4">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Live Classes
            </h1>
            <p className="text-gray-600">
              Welcome,{" "}
              <span className="text-blue-600 font-semibold">{kidName}</span>!
            </p>

            <div className="flex items-center justify-center gap-4 mt-4">
              <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow-sm">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span className="text-gray-700 text-sm font-medium">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow-sm">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-gray-700 text-sm font-medium">
                  {todayClasses.length} today
                </span>
              </div>
            </div>
          </div>

          {/* Today's Classes */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Today's Classes
            </h2>

            {todayClasses.length === 0 ? (
              <div className="bg-white rounded-xl p-6 shadow-sm text-center">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  No classes today
                </h3>
                <p className="text-gray-500">Enjoy your free time!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {todayClasses.map((classItem) => (
                  <div
                    key={classItem._id}
                    className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">
                            {classItem.program}
                          </h3>
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                            {classItem.level}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 flex-wrap">
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                            {classItem.status || "Scheduled"}
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              classItem.type === "online"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-purple-100 text-purple-700"
                            }`}
                          >
                            {classItem.type === "online"
                              ? "🌐 Online"
                              : "🏢 In-Person"}
                          </span>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        {classItem.type === "online" ? (
                          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <Monitor className="w-6 h-6 text-blue-600" />
                          </div>
                        ) : (
                          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                            <MapPin className="w-6 h-6 text-purple-600" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Calendar className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-medium">
                            Date
                          </p>
                          <p className="text-sm font-semibold text-gray-900">
                            {formatDate(classItem.classDate || classItem.day)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <Clock className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-medium">
                            Time
                          </p>
                          <p className="text-sm font-semibold text-gray-900">
                            {formatTime(classItem.classTime)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                          <User className="w-4 h-4 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-medium">
                            Coach
                          </p>
                          <p className="text-sm font-semibold text-gray-900">
                            {classItem.coachName || "TBA"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {classItem.centerName && (
                      <div className="bg-gray-50 rounded-lg p-3 border-l-4 border-blue-400">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-blue-600" />
                          <span className="font-medium text-gray-800 text-sm">
                            {classItem.centerName}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Classes */}
          {classData.length > todayClasses.length && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                Upcoming Classes
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {classData
                  .filter(
                    (classItem) =>
                      !isToday(classItem.classDate || classItem.day)
                  )
                  .map((classItem) => (
                    <div
                      key={classItem._id}
                      className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-bold text-gray-900">
                          {classItem.program}
                        </h4>
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium ${
                            classItem.type === "online"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-purple-100 text-purple-700"
                          }`}
                        >
                          {classItem.type}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {formatDate(classItem.classDate || classItem.day)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{formatTime(classItem.classTime)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>Coach: {classItem.coachName || "TBA"}</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
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
    </>
  );
};

export default LiveClass;
