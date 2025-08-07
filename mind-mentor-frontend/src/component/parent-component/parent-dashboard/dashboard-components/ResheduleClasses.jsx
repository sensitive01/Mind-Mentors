import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Calendar,
  Clock,
  Award,
  PauseCircle,
  PlayCircle,
  MapPin,
  Monitor,
  Users,
  X,
  Trash2,
  ChevronDown,
  Edit3,
  PlusCircle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  dispaySelectedClass,
  getScheduledClassData,
  pauseTheClass,
  resumeTheClass,
} from "../../../../api/service/employee/serviceDeliveryService";
import { getTheEnqId, parentPauseTheClass, parentResumeTheClass } from "../../../../api/service/parent/ParentService";
import PauseModel from "../../../../department-components/common-components/assign-class/PauseModel";

export default function ResheduleClasses() {
  const navigate = useNavigate();
  const { kidId } = useParams();
  const department = localStorage.getItem("department");
  const [kidName, setKidName] = useState("");
  const [programData, setProgramData] = useState(null);
  const [data, setData] = useState([]);
  const [availableClasses, setAvailableClasses] = useState([]);
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [pauseDate, setPauseDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [pauseRemarks, setPauseRemarks] = useState("");
  const [pauseEndDate, setPauseEndDate] = useState("");
  const [isMorePckage, setIsMorePckage] = useState(false);
  const [extraPackageId, setExtraPackageId] = useState(null);

  const [isPaused, setIsPaused] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [modalState, setModalState] = useState({
    action: false,
    reschedule: false,
    success: false,
  });
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [classId, setClassId] = useState("");
  const [enqId, setEnqId] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response1 = await getTheEnqId(kidId);
        if (response1.status === 200) {
          const response = await dispaySelectedClass(response1.data.data._id);
          setEnqId(response1.data.data._id);
          if (response.status === 200) {
            setKidName(response.data.kidName);
            setProgramData(response.data.programData);
            setData(response.data.data || []);
            setClassId(response.data.classId);
            setIsMorePckage(response.data.isMorePckage);
            setExtraPackageId(response.data.latestPackageId);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const response = await getScheduledClassData(enqId);
        if (response.status === 200) {
          setAvailableClasses(response.data.classData || []);
        }
      } catch (error) {
        console.error("Error fetching available classes:", error);
      }
    };

    if (enqId) {
      fetchClassData();
    }
  }, [enqId]);

  const parseFormattedDate = (dateInput) => {
    if (!dateInput) return null;

    if (dateInput instanceof Date) {
      return dateInput;
    }

    if (typeof dateInput === "string" && dateInput.includes("T")) {
      return new Date(dateInput);
    }

    if (typeof dateInput === "string" && dateInput.includes("-")) {
      const [day, month, year] = dateInput.split("-");
      const fullYear = year.length === 2 ? `20${year}` : year;
      return new Date(`${fullYear}-${month}-${day}`);
    }

    return new Date(dateInput);
  };

  const getDayName = useCallback((date) => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[date.getDay()];
  }, []);

  const formatDate = useCallback((date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString().slice(-2);
    return `${day}-${month}-${year}`;
  }, []);

  const formatDateForAPI = useCallback((date) => {
    return date.toISOString();
  }, []);

  const handleAddExtraClass = async () => {
    navigate(`/${department}/department/add-extra-class/${enqId}/${classId}`, {
      state: { extraPackageId },
    });
  };

  const getAvailableClassesForDate = useCallback(
    (date) => {
      if (!date) return [];
      const dayName = getDayName(date);
      return availableClasses.filter((cls) => cls.day === dayName);
    },
    [availableClasses, getDayName]
  );

  const availableClassesForReschedule = useMemo(() => {
    return getAvailableClassesForDate(selectedDate);
  }, [selectedDate, getAvailableClassesForDate]);

  const showToastNotification = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const generateReplacementSession = useCallback(
    (cancelledSession) => {
      if (!data.length) return null;

      const latestDate = Math.max(
        ...data.map((session) => {
          const sessionDate = session.classDate
            ? parseFormattedDate(session.classDate)
            : parseFormattedDate(session.formattedDate);
          return sessionDate ? sessionDate.getTime() : 0;
        })
      );

      const newDate = new Date(latestDate + 7 * 24 * 60 * 60 * 1000);

      return {
        ...cancelledSession,
        sessionId: `${
          cancelledSession.sessionId || cancelledSession._id
        }-replacement-${Date.now()}`,
        sessionNumber: Math.max(...data.map((s) => s.sessionNumber || 1)) + 1,
        classDate: formatDateForAPI(newDate),
        formattedDate: formatDate(newDate),
        status: "scheduled",
      };
    },
    [data, formatDate, formatDateForAPI]
  );

  const handlePauseConfirm = async () => {
    try {
      setShowPauseModal(false);

      const selectedPauseDate = new Date(pauseDate);
      const selectedPauseEndDate = pauseEndDate ? new Date(pauseEndDate) : null;

      const updatedData = data.map((session) => {
        const sessionDate = session.classDate
          ? parseFormattedDate(session.classDate)
          : parseFormattedDate(session.formattedDate);

        if (!sessionDate) return session;

        const sessionDateOnly = new Date(
          sessionDate.getFullYear(),
          sessionDate.getMonth(),
          sessionDate.getDate()
        );
        const pauseDateOnly = new Date(
          selectedPauseDate.getFullYear(),
          selectedPauseDate.getMonth(),
          selectedPauseDate.getDate()
        );
        const pauseEndDateOnly = selectedPauseEndDate
          ? new Date(
              selectedPauseEndDate.getFullYear(),
              selectedPauseEndDate.getMonth(),
              selectedPauseEndDate.getDate()
            )
          : null;

        // If both from and to dates are provided
        if (pauseEndDateOnly) {
          if (
            sessionDateOnly >= pauseDateOnly &&
            sessionDateOnly <= pauseEndDateOnly
          ) {
            return { ...session, status: "Paused" };
          }
        } else {
          // If only from date is provided, pause all classes from that date onwards
          if (sessionDateOnly >= pauseDateOnly) {
            return { ...session, status: "Paused" };
          }
        }
        return session;
      });

      console.log(
        "Sessions affected by pause:",
        updatedData.filter((session) => session.status === "Paused")
      );
      console.log("Updated data after pause:", updatedData);

      const response = await parentPauseTheClass(
        enqId,
        updatedData,
        pauseRemarks,
        classId,
        pauseDate,
        pauseEndDate
      );
      console.log("Pause API response:", response);

      setData(updatedData);
      setIsPaused(true);

      // Show appropriate toast message
      const pauseMessage = pauseEndDate
        ? `Classes paused from ${pauseDate} to ${pauseEndDate} successfully`
        : `Classes paused from ${pauseDate} onwards successfully`;

      showToastNotification(pauseMessage);
    } catch (error) {
      console.error("Error pausing classes:", error);
      showToastNotification("Error pausing classes. Please try again.");
    }
  };

  // Fixed resume functionality
  const handleResumeClasses = async () => {
    try {
      const updatedData = data.map((session) => {
        if (session.status === "Paused") {
          return { ...session, status: "scheduled" };
        }
        return session;
      });

      console.log(
        "Sessions affected by resume:",
        updatedData.filter((session) => session.status === "scheduled")
      );

      const response = await parentResumeTheClass(enqId, updatedData, classId);

      setData(updatedData);
      setIsPaused(false);
      showToastNotification("Classes resumed successfully");
    } catch (error) {
      console.error("Error resuming classes:", error);
      showToastNotification("Error resuming classes. Please try again.");
    }
  };

  const handleSessionAction = useCallback((session) => {
    console.log("=== SESSION ACTION INITIATED ===");
    console.log("Selected session for action:", session);

    setSelectedSession(session);
    setModalState((prev) => ({ ...prev, action: true }));
  }, []);

  const handleSessionDelete = useCallback(async () => {
    console.log("=== CANCEL SESSION DATA ===");
    console.log("Cancelling session:", selectedSession);
    console.log(
      "Session ID:",
      selectedSession?.sessionId || selectedSession?._id
    );
    console.log("Session Number:", selectedSession?.sessionNumber);
    console.log(
      "Original session date:",
      selectedSession?.formattedDate || selectedSession?.classDate
    );
    console.log("Enquiry ID:", enqId);

    const updated = data.map((session) => {
      const sessionId = session.sessionId || session._id;
      const selectedId = selectedSession.sessionId || selectedSession._id;

      return sessionId === selectedId
        ? { ...session, status: "cancelled" }
        : session;
    });

    const newSession = generateReplacementSession(selectedSession);
    if (newSession) {
      console.log("Generated replacement session:", newSession);
      updated.push(newSession);
    }

    const sortedData = updated.sort((a, b) => {
      const dateA = a.classDate
        ? parseFormattedDate(a.classDate)
        : parseFormattedDate(a.formattedDate);
      const dateB = b.classDate
        ? parseFormattedDate(b.classDate)
        : parseFormattedDate(b.formattedDate);
      return dateA - dateB;
    });

    console.log("Updated data after cancellation:", sortedData);

    try {
      const response = await resumeTheClass(enqId, sortedData, classId);
      console.log("Resume class API response:", response);

      setData(sortedData);
      setModalState((prev) => ({ ...prev, action: false }));
      showToastNotification("Session cancelled and replacement scheduled");
    } catch (error) {
      console.error("Failed to cancel and reschedule session:", error);
      showToastNotification("Failed to update session data");
    }
  }, [selectedSession, generateReplacementSession, enqId, classId, data]);

  const handleRescheduleConfirm = async () => {
    if (selectedDate && selectedTimeSlot) {
      console.log("=== RESCHEDULE SESSION DATA ===");
      console.log("Original session:", selectedSession);
      console.log("Selected new date:", selectedDate);
      console.log("Selected new time slot:", selectedTimeSlot);
      console.log("New formatted date:", formatDate(selectedDate));
      console.log("New day:", getDayName(selectedDate));
      console.log("Enquiry ID:", enqId);

      // Create updated data
      const updatedData = data.map((session) => {
        const sessionId = session.sessionId || session._id;
        const selectedId = selectedSession?.sessionId || selectedSession?._id;

        return sessionId === selectedId
          ? {
              ...session,
              ...selectedTimeSlot,
              classDate: formatDateForAPI(selectedDate),
              formattedDate: formatDate(selectedDate),
              day: getDayName(selectedDate),
              status: "rescheduled",
            }
          : session;
      });

      // Log updated session
      console.log(
        "Rescheduled session details:",
        updatedData.find((session) => {
          const sessionId = session.sessionId || session._id;
          const selectedId = selectedSession?.sessionId || selectedSession?._id;
          return sessionId === selectedId;
        })
      );
      console.log("Updated data after reschedule:", updatedData);

      try {
        const response = await resumeTheClass(enqId, updatedData, classId);
        console.log("Resume class API response:", response);

        // Update state
        setData(updatedData);
        setModalState((prev) => ({ ...prev, reschedule: false }));
        setSelectedDate(null);
        setSelectedTimeSlot(null);
        showToastNotification("Session rescheduled successfully");
      } catch (error) {
        console.error("Failed to reschedule session:", error);
        showToastNotification("Failed to reschedule session");
      }
    } else {
      console.warn("Reschedule failed: Missing date or time slot");
      console.log("Selected date:", selectedDate);
      console.log("Selected time slot:", selectedTimeSlot);
    }
  };

  // Modal Component
  const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">{title}</h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {children}
        </div>
      </div>
    );
  };

  const ClassCard = ({ session }) => {
    let bgColor = "bg-white";
    let borderColor = "border-gray-200";

    if (session.status === "cancelled") {
      bgColor = "bg-red-50";
      borderColor = "border-red-200";
    } else if (session.status === "rescheduled") {
      bgColor = "bg-yellow-50";
      borderColor = "border-yellow-200";
    } else if (session.status === "Paused") {
      bgColor = "bg-orange-50";
      borderColor = "border-orange-200";
    }

    // Handle date display - use classDate from API if available
    const displayDate = session.classDate
      ? parseFormattedDate(session.classDate)
      : parseFormattedDate(session.formattedDate);

    const formattedDisplayDate =
      session.formattedDate || (displayDate ? formatDate(displayDate) : "N/A");

    const dayName =
      session.day || (displayDate ? getDayName(displayDate) : "N/A");

    return (
      <div
        className={`group relative ${bgColor} rounded-xl border ${borderColor} hover:shadow-lg transition-all duration-300`}
      >
        {/* Status Indicator Bar */}
        <div
          className={`absolute top-0 left-0 right-0 h-1 rounded-t-xl ${
            session.type === "online" ? "bg-blue-500" : "bg-green-500"
          }`}
        />

        <div className="p-5">
          {/* Header Section */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-gray-800">
                Session {session.sessionNumber || "N/A"}
              </span>
              <span
                className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  session.type === "online"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {session.type === "online" ? "Online" : "Offline"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Status Badge */}
              {session.status === "cancelled" && (
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">
                  Cancelled
                </span>
              )}
              {session.status === "rescheduled" && (
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">
                  Rescheduled
                </span>
              )}
              {session.status === "Paused" && (
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-700">
                  Paused
                </span>
              )}
              {(session.status === "scheduled" || !session.status) && (
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                  Scheduled
                </span>
              )}

              {/* Action Button */}
              {session.status !== "cancelled" && (
                <button
                  onClick={() => handleSessionAction(session)}
                  className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-all duration-200"
                  title="Reschedule or cancel session"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Class Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-blue-500" />
              <div>
                <span className="text-sm font-medium text-gray-700">
                  {dayName}
                </span>
                <span className="text-xs text-gray-500 ml-2">
                  {formattedDisplayDate}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-purple-500" />
              <span className="text-sm text-gray-700">{session.classTime}</span>
            </div>

            <div className="flex items-center gap-3">
              <Award className="w-4 h-4 text-orange-500" />
              <span className="text-sm text-gray-700">{session.coachName}</span>
            </div>

            <div className="flex items-center gap-3">
              {session.type === "online" ? (
                <Monitor className="w-4 h-4 text-green-500" />
              ) : (
                <MapPin className="w-4 h-4 text-red-500" />
              )}
              <span className="text-sm text-gray-700">
                {session.centerName || "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Check if any sessions are paused
  const hasPausedSessions = data.some((session) => session.status === "Paused");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm mb-6 p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Class Schedule Management
          </h1>

          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            {/* Student Info Card */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                <span className="text-sm text-blue-600 font-medium">
                  Student Name
                </span>
                <p className="font-bold text-gray-900 mt-1 text-lg">
                  {kidName || "Loading..."}
                </p>
              </div>

              {programData &&
                programData.programs &&
                programData.programs.length > 0 && (
                  <>
                    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
                      <span className="text-sm text-green-600 font-medium">
                        Program
                      </span>
                      <p className="font-bold text-gray-900 mt-1">
                        {programData.programs[0].program}
                      </p>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg border border-purple-100">
                      <span className="text-sm text-purple-600 font-medium">
                        Level
                      </span>
                      <p className="font-bold text-gray-900 mt-1">
                        {programData.programs[0].level}
                      </p>
                    </div>
                  </>
                )}
            </div>

            {/* Buttons Container with proper spacing */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Pause/Resume Button */}
              {hasPausedSessions ? (
                <button
                  onClick={handleResumeClasses}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium whitespace-nowrap"
                >
                  <PlayCircle className="w-5 h-5" />
                  Resume Classes
                </button>
              ) : (
                <button
                  onClick={() => setShowPauseModal(true)}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium whitespace-nowrap"
                >
                  <PauseCircle className="w-5 h-5" />
                  Pause Classes
                </button>
              )}

              {/* Add Class Button */}
              {/* {isMorePckage && (
                <button
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium whitespace-nowrap"
                  onClick={handleAddExtraClass}
                >
                  <PlusCircle className="w-5 h-5" />
                  Add Class (parent paid extra)
                </button>
              )} */}
            </div>
          </div>
        </div>

        {/* Class Schedule Grid */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
            <h2 className="text-xl font-bold text-gray-900">
              Upcoming Sessions
            </h2>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm text-gray-600">Online</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm text-gray-600">Offline</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-sm text-gray-600">Cancelled</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-sm text-gray-600">Rescheduled</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span className="text-sm text-gray-600">Paused</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {data.length > 0 ? (
              data.map((session, index) => (
                <ClassCard
                  key={session.sessionId || session._id || `session_${index}`}
                  session={session}
                />
              ))
            ) : (
              <div className="col-span-full py-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg">
                  No class sessions available
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-300 z-50">
          {toastMessage}
        </div>
      )}

      {/* Action Modal */}
      <Modal
        isOpen={modalState.action}
        onClose={() => setModalState((prev) => ({ ...prev, action: false }))}
        title="Session Action"
      >
        <p className="text-gray-600 mb-6">
          {`What would you like to do with Session ${
            selectedSession?.sessionNumber || "N/A"
          }?`}
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => {
              setModalState((prev) => ({
                ...prev,
                action: false,
                reschedule: true,
              }));
            }}
            className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Reschedule
          </button>
          <button
            onClick={handleSessionDelete}
            className="flex-1 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Cancel Session
          </button>
        </div>
      </Modal>

      {/* Reschedule Modal */}
      <Modal
        isOpen={modalState.reschedule}
        onClose={() => {
          setModalState((prev) => ({ ...prev, reschedule: false }));
          setSelectedDate(null);
          setSelectedTimeSlot(null);
        }}
        title="Reschedule Session"
      >
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Date
          </label>
          <input
            type="date"
            className="w-full p-2 border rounded-lg"
            onChange={(e) => {
              setSelectedDate(new Date(e.target.value));
              setSelectedTimeSlot(null); // Reset time slot when date changes
            }}
            min={new Date().toISOString().split("T")[0]}
          />
        </div>

        {selectedDate && (
          <div className="mb-4">
            <div className="text-sm text-gray-600 mb-2">
              Selected Date: {selectedDate.toLocaleDateString()} (
              {getDayName(selectedDate)})
            </div>
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Class
          </label>
          <div className="relative">
            <select
              onChange={(e) => {
                const selected = availableClassesForReschedule.find(
                  (c) => c._id === e.target.value
                );
                setSelectedTimeSlot(selected);
              }}
              value={selectedTimeSlot?._id || ""}
              className="w-full bg-white border rounded-lg p-3 text-gray-700"
              disabled={!selectedDate}
            >
              <option value="">
                {!selectedDate
                  ? "Please select a date first"
                  : availableClassesForReschedule.length === 0
                  ? `No classes available on ${getDayName(selectedDate)}`
                  : "Select Class"}
              </option>
              {availableClassesForReschedule.map((classItem) => (
                <option key={classItem._id} value={classItem._id}>
                  {`${classItem.classTime} - ${classItem.coachName} (${classItem.type})`}
                </option>
              ))}
            </select>
          </div>
          {selectedDate && availableClassesForReschedule.length === 0 && (
            <div className="text-sm text-red-500 mt-2">
              No classes are scheduled on {getDayName(selectedDate)}. Please
              select a different date.
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleRescheduleConfirm}
            className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!selectedDate || !selectedTimeSlot}
          >
            Confirm Reschedule
          </button>
          <button
            onClick={() => {
              setModalState((prev) => ({ ...prev, reschedule: false }));
              setSelectedDate(null);
              setSelectedTimeSlot(null);
            }}
            className="flex-1 bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </Modal>

      {showPauseModal && (
        <PauseModel
          pauseDate={pauseDate}
          setPauseDate={setPauseDate}
          pauseEndDate={pauseEndDate}
          setPauseEndDate={setPauseEndDate}
          pauseRemarks={pauseRemarks}
          setPauseRemarks={setPauseRemarks}
          setShowPauseModal={setShowPauseModal}
          handlePauseConfirm={handlePauseConfirm}
        />
      )}
    </div>
  );
}
