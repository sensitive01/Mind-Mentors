/* eslint-disable react/display-name */
import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Calendar,
  Clock,
  Award,
  X,
  Trash2,
  ChevronDown,
  User,
  BookOpen,
  Package,
  ChevronUp,
} from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";
import { getTheEnqId } from "../../../../api/service/parent/ParentService";
import {
  assignWholeClass,
  getActiveKidData,
  getScheduledClassData,
} from "../../../../api/service/employee/serviceDeliveryService";

// Simple Info Card
const InfoCard = ({ label, value }) => (
  <div className="bg-gray-50 rounded-lg p-4 border">
    <div className="text-sm text-gray-600 mb-1">{label}</div>
    <div className="font-semibold text-gray-900">
      {value || "Not Available"}
    </div>
  </div>
);

const StatusBadge = ({ type, status }) => {
  const getBadgeStyle = () => {
    if (status === "cancelled") return "bg-red-100 text-red-700";
    if (status === "rescheduled") return "bg-yellow-100 text-yellow-700";
    return type === "online"
      ? "bg-blue-100 text-primary"
      : "bg-green-100 text-green-700";
  };

  const text = status || type;
  return (
    <span
      className={`px-3 py-1 text-xs font-medium rounded-full ${getBadgeStyle()}`}
    >
      {text}
    </span>
  );
};

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

const ClassSelectionDropdown = React.memo(
  ({
    isOpen,
    onToggle,
    selectedClasses,
    onClassSelection,
    availableClasses,
    classMode,
  }) => {
    const groupedClasses = useMemo(() => {
      if (classMode !== "hybrid") return { all: availableClasses };
      return {
        online: availableClasses.filter((cls) => cls.type === "online"),
        offline: availableClasses.filter((cls) => cls.type === "offline"),
      };
    }, [availableClasses, classMode]);

    const renderClassGroup = (classes, title) => (
      <div className="space-y-2">
        {title && (
          <div className="text-sm font-medium text-gray-700 mb-3">
            {title} Classes ({classes.length})
          </div>
        )}
        {classes.map((classItem) => (
          <ClassOption
            key={classItem._id}
            classItem={classItem}
            isSelected={selectedClasses.some((c) => c._id === classItem._id)}
            onSelect={() => onClassSelection(classItem)}
          />
        ))}
      </div>
    );

    return (
      <div className="border rounded-lg bg-white">
        <button
          onClick={onToggle}
          className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50"
        >
          <div>
            {selectedClasses.length === 0 ? (
              <span className="text-gray-500">
                Select Classes to Generate Schedule
              </span>
            ) : (
              <div className="flex items-center gap-3">
                <span className="bg-primary text-white text-sm px-2 py-1 rounded">
                  {selectedClasses.length}
                </span>
                <span className="font-medium">Classes Selected</span>
              </div>
            )}
          </div>
          {isOpen ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>

        {isOpen && (
          <div className="border-t p-4 max-h-80 overflow-y-auto">
            {availableClasses.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No classes available
              </div>
            ) : (
              <>
                {classMode === "hybrid" ? (
                  <div className="space-y-6">
                    {renderClassGroup(groupedClasses.online, "Online")}
                    {renderClassGroup(groupedClasses.offline, "Offline")}
                  </div>
                ) : (
                  renderClassGroup(groupedClasses.all)
                )}
              </>
            )}
          </div>
        )}
      </div>
    );
  }
);

const ClassOption = React.memo(({ classItem, isSelected, onSelect }) => {
  return (
    <div
      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
        isSelected ? "bg-primary border-blue-200" : "hover:bg-gray-50"
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          className="w-4 h-4"
          onClick={(e) => e.stopPropagation()}
        />

        <div className="flex-1 grid grid-cols-4 gap-4 items-center">
          <div>
            <div className="font-medium">{classItem.day}</div>
            <div className="text-sm text-gray-500">
              {new Date(classItem.classDate).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
              })}
            </div>
          </div>

          <div className="text-sm">{classItem.classTime}</div>

          <div className="text-sm">{classItem.coachName}</div>

          <div className="flex justify-end">
            <StatusBadge type={classItem.type} />
          </div>
        </div>
      </div>
    </div>
  );
});

const SessionCard = React.memo(({ session, onSessionAction }) => (
  <div
    className={`border rounded-lg p-4 ${
      session.status === "cancelled"
        ? "bg-red-50"
        : session.status === "rescheduled"
        ? "bg-yellow-50"
        : "bg-white"
    }`}
  >
    <div className="flex justify-between items-start mb-3">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold">Session {session.sessionNumber}</span>
          <StatusBadge type={session.type} status={session.status} />
        </div>
        <div className="text-sm text-gray-600">{session.day}</div>
      </div>
      {session.status !== "cancelled" && (
        <button
          onClick={() => onSessionAction(session)}
          className="text-gray-400 hover:text-red-500 p-1"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>

    <div className="space-y-2 text-sm">
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-gray-400" />
        <span>{session.formattedDate}</span>
      </div>
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-gray-400" />
        <span>{session.classTime}</span>
      </div>
      <div className="flex items-center gap-2">
        <User className="w-4 h-4 text-gray-400" />
        <span>{session.coachName}</span>
      </div>
    </div>
  </div>
));

const ParentSheduleLiveClass = () => {
  const { kidId } = useParams();
  const navigate = useNavigate();
  const [kidData, setKidData] = useState(null);
  const [availableClasses, setAvailableClasses] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [generatedSchedule, setGeneratedSchedule] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [modalState, setModalState] = useState({
    action: false,
    reschedule: false,
    success: false,
  });
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [enqId, setEnqId] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get day name from date
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

  // Get next occurrence of a specific day
  const getNextOccurrenceOfDay = useCallback(
    (dayName, startFromDate = new Date()) => {
      const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const targetDayIndex = days.indexOf(dayName);
      const currentDate = new Date(startFromDate);
      currentDate.setHours(0, 0, 0, 0);
      const currentDayIndex = currentDate.getDay();
      let daysToAdd = targetDayIndex - currentDayIndex;
      if (daysToAdd <= 0) {
        daysToAdd += 7;
      }
      const nextOccurrence = new Date(currentDate);
      nextOccurrence.setDate(currentDate.getDate() + daysToAdd);
      return nextOccurrence;
    },
    []
  );

  // Get the next valid date for a class considering its original classDate
  const getNextValidClassDate = useCallback(
    (classItem, startFromDate = new Date()) => {
      const classDate = new Date(classItem.classDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (classDate >= today) {
        return classDate;
      }
      return getNextOccurrenceOfDay(classItem.day, startFromDate);
    },
    [getNextOccurrenceOfDay]
  );

  // Filter classes by selected date
  const getAvailableClassesForDate = useCallback(
    (date) => {
      if (!date) return [];
      const dayName = getDayName(date);
      return availableClasses.filter((cls) => cls.day === dayName);
    },
    [availableClasses, getDayName]
  );

  useEffect(() => {
    const fetchKidData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("kidId", kidId);
        const response = await getTheEnqId(kidId);
        console.log("getTheEnqId response", response);
        if (response.status === 200) {
          const enqId = response.data.data._id;
          setEnqId(enqId);
          const newResponse = await getActiveKidData(response.data.data._id);
          console.log("getActiveKidData response", newResponse);
          if (newResponse.success) {
            console.log("newResponse.data.dat", newResponse.data);
            setKidData(newResponse.data);
          } else {
            throw new Error("Failed to fetch kid data");
          }
        } else {
          throw new Error("Failed to fetch enrollment data");
        }
      } catch (error) {
        console.error("Error fetching kid data:", error);
        setError("Failed to load student data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (kidId) {
      fetchKidData();
    }
  }, [kidId]);

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        if (!enqId || !kidData) return;
        const response = await getScheduledClassData(enqId);
        console.log("fetchClassData", response);
        if (response.status === 200) {
          let filteredClasses = response.data.classData;
          if (kidData.classDetails?.classMode === "online") {
            filteredClasses = response.data.classData.filter(
              (cls) => cls.type === "online"
            );
          } else if (kidData.classDetails?.classMode === "offline") {
            filteredClasses = response.data.classData.filter(
              (cls) => cls.type === "offline"
            );
          }
          setAvailableClasses(filteredClasses);
        }
      } catch (error) {
        console.error("Error fetching class data:", error);
        setError("Failed to load class data. Please try again.");
      }
    };

    fetchClassData();
  }, [enqId, kidData]);

  const formatDate = useCallback((date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString().slice(-2);
    return `${day}-${month}-${year}`;
  }, []);

  const generateSchedule = useCallback(
    (classes) => {
      if (!classes.length || !kidData?.classDetails) return [];
      const { onlineClasses, offlineClasses, classMode } = kidData.classDetails;
      let schedule = [];

      if (classMode === "hybrid") {
        const onlineClassList = classes.filter((c) => c.type === "online");
        const offlineClassList = classes.filter((c) => c.type === "offline");
        let onlineCount = 0;
        let offlineCount = 0;
        const lastScheduledDates = new Map();
        const totalSessions = (onlineClasses || 0) + (offlineClasses || 0);

        for (let i = 0; i < totalSessions; i++) {
          let classItem;
          let sessionType;

          if (
            onlineCount < (onlineClasses || 0) &&
            offlineCount < (offlineClasses || 0)
          ) {
            sessionType = i % 2 === 0 ? "online" : "offline";
          } else if (onlineCount < (onlineClasses || 0)) {
            sessionType = "online";
          } else if (offlineCount < (offlineClasses || 0)) {
            sessionType = "offline";
          }

          if (sessionType === "online" && onlineClassList.length > 0) {
            classItem = onlineClassList[onlineCount % onlineClassList.length];
            onlineCount++;
          } else if (sessionType === "offline" && offlineClassList.length > 0) {
            classItem =
              offlineClassList[offlineCount % offlineClassList.length];
            offlineCount++;
          }

          if (classItem) {
            const classKey = `${classItem._id}-${classItem.day}`;
            let nextClassDate;

            if (lastScheduledDates.has(classKey)) {
              const lastDate = lastScheduledDates.get(classKey);
              nextClassDate = new Date(lastDate);
              nextClassDate.setDate(nextClassDate.getDate() + 7);
            } else {
              nextClassDate = getNextValidClassDate(classItem, new Date());
            }

            lastScheduledDates.set(classKey, nextClassDate);

            schedule.push({
              ...classItem,
              sessionId: `${classItem._id}-${i}`,
              sessionNumber: i + 1,
              classDate: new Date(nextClassDate),
              formattedDate: formatDate(nextClassDate),
              status: "scheduled",
            });
          }
        }
      } else {
        const totalClasses =
          kidData.classDetails.numberOfClasses ||
          onlineClasses ||
          offlineClasses ||
          8;
        const lastScheduledDates = new Map();

        for (let i = 0; i < totalClasses; i++) {
          const classItem = classes[i % classes.length];
          const classKey = `${classItem._id}-${classItem.day}`;
          let nextClassDate;

          if (lastScheduledDates.has(classKey)) {
            const lastDate = lastScheduledDates.get(classKey);
            nextClassDate = new Date(lastDate);
            nextClassDate.setDate(nextClassDate.getDate() + 7);
          } else {
            nextClassDate = getNextValidClassDate(classItem, new Date());
          }

          lastScheduledDates.set(classKey, nextClassDate);

          schedule.push({
            ...classItem,
            sessionId: `${classItem._id}-${i}`,
            sessionNumber: i + 1,
            classDate: new Date(nextClassDate),
            formattedDate: formatDate(nextClassDate),
            status: "scheduled",
          });
        }
      }

      const sortedSchedule = schedule.sort((a, b) => a.classDate - b.classDate);
      return sortedSchedule.map((session, index) => ({
        ...session,
        sessionNumber: index + 1,
      }));
    },
    [kidData, formatDate, getNextValidClassDate]
  );

  const handleClassSelection = useCallback((classItem) => {
    setSelectedClasses((prev) => {
      const isSelected = prev.some((c) => c._id === classItem._id);
      const updated = isSelected
        ? prev.filter((c) => c._id !== classItem._id)
        : [...prev, classItem];
      return updated;
    });
  }, []);

  useEffect(() => {
    if (selectedClasses.length > 0) {
      const newSchedule = generateSchedule(selectedClasses);
      setGeneratedSchedule(newSchedule);
    } else {
      setGeneratedSchedule([]);
    }
  }, [selectedClasses, generateSchedule]);

  const handleSessionAction = useCallback((session) => {
    setSelectedSession(session);
    setModalState((prev) => ({ ...prev, action: true }));
  }, []);

  const handleSessionDelete = useCallback(() => {
    setGeneratedSchedule((prev) => {
      const updatedSchedule = prev.map((session) =>
        session.sessionId === selectedSession.sessionId
          ? { ...session, status: "cancelled" }
          : session
      );

      const activeSessions = updatedSchedule
        .filter((s) => s.status !== "cancelled")
        .sort((a, b) => a.classDate - b.classDate);

      const cancelledSessions = updatedSchedule.filter(
        (s) => s.status === "cancelled"
      );

      const newSession = generateSchedule([selectedSession])[0];
      if (newSession) {
        let newDate;
        const allSessionDates = prev.map((s) => s.classDate.getTime());
        const latestDate = Math.max(...allSessionDates);
        newDate = new Date(latestDate);
        newDate.setDate(newDate.getDate() + 7);

        const targetDay = selectedSession.day;
        const targetDayIndex = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ].indexOf(targetDay);
        const newDateDayIndex = newDate.getDay();

        if (newDateDayIndex !== targetDayIndex) {
          const daysToAdd = (targetDayIndex - newDateDayIndex + 7) % 7;
          if (daysToAdd === 0) {
            newDate.setDate(newDate.getDate() + 7);
          } else {
            newDate.setDate(newDate.getDate() + daysToAdd);
          }
        }

        newSession.classDate = newDate;
        newSession.formattedDate = formatDate(newDate);
        newSession.sessionId = `${selectedSession._id}-new-${Date.now()}`;
        newSession.status = "scheduled";

        activeSessions.push(newSession);
      }

      activeSessions.sort((a, b) => a.classDate - b.classDate);

      const reNumberedActiveSessions = activeSessions.map((session, index) => ({
        ...session,
        sessionNumber: index + 1,
      }));

      const finalSchedule = [...reNumberedActiveSessions, ...cancelledSessions];

      return finalSchedule.sort((a, b) => {
        if (a.status === "cancelled" && b.status !== "cancelled") return 1;
        if (a.status !== "cancelled" && b.status === "cancelled") return -1;
        return a.sessionNumber - b.sessionNumber;
      });
    });

    setModalState((prev) => ({ ...prev, action: false }));
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  }, [selectedSession, generateSchedule, formatDate]);

  const handleSubmit = async () => {
    setModalState((prev) => ({ ...prev, success: true }));
    try {
      await assignWholeClass({
        studentId: enqId,
        studentName: kidData?.kidName,
        selectedClasses,
        generatedSchedule,
      });
    } catch (error) {
      console.error("Error submitting schedule:", error);
    }
  };

  const availableClassesForReschedule = useMemo(() => {
    return getAvailableClassesForDate(selectedDate);
  }, [selectedDate, getAvailableClassesForDate]);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-gray-600">Loading student data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8 bg-white rounded-lg shadow border">
          <X className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <div className="text-red-500 mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // No data state
  if (!kidData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8 bg-white rounded-lg shadow border">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <div className="text-gray-500 mb-4">No student data found</div>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Schedule Live Classes
          </h1>
          <p className="text-gray-600">
            Create and manage your child's class schedule
          </p>
        </div>

        {/* Student Info */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">Student Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <InfoCard label="Student Name" value={kidData?.kidName} />
            <InfoCard
              label="Program & Level"
              value={
                kidData.classDetails?.program && kidData.classDetails?.level
                  ? `${kidData.classDetails.program} - ${kidData.classDetails.level}`
                  : kidData.classDetails?.selectedProgram &&
                    kidData?.classDetails?.selectedLevel
                  ? `${kidData?.classDetails?.selectedProgram} - ${kidData?.classDetails?.selectedLevel}`
                  : "Not Specified"
              }
            />
            <InfoCard
              label="Package"
              value={kidData.classDetails?.selectedPackage}
            />
            <InfoCard
              label="Class Mode"
              value={
                kidData.classDetails?.classMode === "hybrid"
                  ? `Hybrid (${
                      kidData.classDetails.onlineClasses || 0
                    } Online + ${
                      kidData.classDetails.offlineClasses || 0
                    } Offline)`
                  : kidData.classDetails?.classMode === "online"
                  ? `Online (${
                      kidData.classDetails.onlineClasses || 0
                    } Classes)`
                  : kidData.classDetails?.classMode === "offline"
                  ? `Offline (${
                      kidData.classDetails.offlineClasses || 0
                    } Classes)`
                  : kidData.classDetails?.classMode || "N/A"
              }
            />
          </div>
        </div>

        {/* Class Selection */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">
            Select Available Classes
          </h2>
          <ClassSelectionDropdown
            isOpen={isDropdownOpen}
            onToggle={() => setIsDropdownOpen(!isDropdownOpen)}
            selectedClasses={selectedClasses}
            onClassSelection={handleClassSelection}
            availableClasses={availableClasses}
            classMode={kidData.classDetails?.classMode}
          />
        </div>

        {/* Generated Schedule */}
        {generatedSchedule.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold">Generated Schedule</h2>
                <p className="text-gray-600">
                  {generatedSchedule.length} sessions planned
                </p>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span>Online</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>Offline</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span>Cancelled</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span>Rescheduled</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
              {generatedSchedule.map((session) => (
                <SessionCard
                  key={session.sessionId}
                  session={session}
                  onSessionAction={handleSessionAction}
                />
              ))}
            </div>
          </div>
        )}

        {/* Confirm Button */}
        {generatedSchedule.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex justify-between items-center">
              <div className="text-gray-600">
                <span className="font-semibold">
                  {
                    generatedSchedule.filter((s) => s.status === "scheduled")
                      .length
                  }
                </span>{" "}
                sessions scheduled
              </div>
              <button
                onClick={handleSubmit}
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary font-medium flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Confirm Schedule
              </button>
            </div>
          </div>
        )}

        {/* Toast */}
        {showToast && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
            Schedule updated successfully!
          </div>
        )}

        {/* Modals */}
        <Modal
          isOpen={modalState.action}
          onClose={() => setModalState((prev) => ({ ...prev, action: false }))}
          title="Manage Session"
        >
          <div className="text-center space-y-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-1">
                Session {selectedSession?.sessionNumber}
              </h3>
              <p className="text-gray-600">
                What would you like to do with this session?
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setModalState((prev) => ({
                    ...prev,
                    action: false,
                    reschedule: true,
                  }));
                }}
                className="flex-1 bg-primary text-white px-4 py-3 rounded-lg hover:bg-primary flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Reschedule
              </button>
              <button
                onClick={handleSessionDelete}
                className="flex-1 bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete & Replace
              </button>
            </div>
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
          <div className="space-y-2">
            <div className="p-3 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-1">
                Current Session
              </h3>
              <p className="text-primary text-sm">
                Session {selectedSession?.sessionNumber} -{" "}
                {selectedSession?.day} at {selectedSession?.classTime}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select New Date
              </label>
              <input
                type="date"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => {
                  setSelectedDate(new Date(e.target.value));
                  setSelectedTimeSlot(null);
                }}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            {selectedDate && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">
                  <strong>Selected Date:</strong>{" "}
                  {selectedDate.toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}{" "}
                  ({getDayName(selectedDate)})
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Available Class
              </label>
              <select
                onChange={(e) => {
                  const selected = availableClassesForReschedule.find(
                    (c) => c._id === e.target.value
                  );
                  setSelectedTimeSlot(selected);
                }}
                value={selectedTimeSlot?._id || ""}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              {selectedDate && availableClassesForReschedule.length === 0 && (
                <div className="text-sm text-red-600 mt-2 p-2 bg-red-50 rounded-lg">
                  No classes available on {getDayName(selectedDate)}. Please
                  select a different date.
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => {
                  if (selectedDate && selectedTimeSlot) {
                    setGeneratedSchedule((prev) =>
                      prev.map((session) =>
                        session.sessionId === selectedSession?.sessionId
                          ? {
                              ...session,
                              ...selectedTimeSlot,
                              classDate: selectedDate,
                              formattedDate: formatDate(selectedDate),
                              status: "rescheduled",
                            }
                          : session
                      )
                    );
                    setModalState((prev) => ({ ...prev, reschedule: false }));
                    setSelectedDate(null);
                    setSelectedTimeSlot(null);
                    setShowToast(true);
                    setTimeout(() => setShowToast(false), 3000);
                  }
                }}
                className="flex-1 bg-primary text-white px-4 py-3 rounded-lg hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                disabled={!selectedDate || !selectedTimeSlot}
              >
                <Calendar className="w-4 h-4" />
                Confirm Reschedule
              </button>
              <button
                onClick={() => {
                  setModalState((prev) => ({ ...prev, reschedule: false }));
                  setSelectedDate(null);
                  setSelectedTimeSlot(null);
                }}
                className="flex-1 bg-gray-200 text-gray-800 px-4 py-3 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>

        {/* Success Modal */}
        <Modal
          isOpen={modalState.success}
          onClose={() => setModalState((prev) => ({ ...prev, success: false }))}
          title="Success!"
        >
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Schedule Confirmed!
              </h3>
              <p className="text-gray-600">
                Your class schedule has been successfully created and saved.
              </p>
            </div>
            <button
              onClick={() => {
                setModalState((prev) => ({ ...prev, success: false }));
                setTimeout(() => {
                  navigate(`/parent/kid/classShedule/${kidId}`);
                }, 1500);
              }}
              className="w-full bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Done
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default ParentSheduleLiveClass;
