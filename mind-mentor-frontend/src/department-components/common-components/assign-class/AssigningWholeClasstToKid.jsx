/* eslint-disable react/display-name, react/prop-types */
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Clock, Award, X, Calendar, ArrowDown, ArrowUp } from "lucide-react";
import {
  assignWholeClass,
  getActiveKidData,
  getScheduledClassData,
} from "../../../api/service/employee/serviceDeliveryService";
import { useNavigate, useParams } from "react-router-dom";

// Extracted components
const InfoCard = ({ label, value }) => (
  <div className="p-3 bg-gray-50 rounded-lg">
    <span className="text-sm text-gray-500">{label}</span>
    <p className="font-semibold text-gray-800 mt-1">{value}</p>
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
      className={`px-2 py-0.5 text-xs font-medium rounded-full ${getBadgeStyle()}`}
    >
      {text}
    </span>
  );
};

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

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const DaySelection = ({ selectedDays, onDayToggle }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Select Days</h3>
      <div className="flex flex-wrap gap-4">
        {DAYS_OF_WEEK.map((day) => (
          <label
            key={day}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${
              selectedDays.includes(day)
                ? "bg-blue-50 border-blue-500 text-blue-700"
                : "hover:bg-gray-50 border-gray-200"
            }`}
          >
            <input
              type="checkbox"
              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              checked={selectedDays.includes(day)}
              onChange={() => onDayToggle(day)}
            />
            <span className="font-medium">{day}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

const ClassOption = React.memo(
  ({ classItem, isSelected, onSelect, showDay = true }) => {
    return (
      <div
        className={`group relative flex items-center p-4 rounded-xl border transition-all duration-200 cursor-pointer mb-3 last:mb-0 hover:shadow-md ${
          isSelected
            ? "bg-blue-50 border-blue-200 shadow-sm ring-1 ring-blue-100"
            : "bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50"
        } }`}
        onClick={onSelect}
      >
        <div className="flex items-center mr-4">
          <input
            type={showDay ? "checkbox" : "radio"}
            checked={isSelected}
            onChange={onSelect}
            className={`w-5 h-5 text-blue-600 bg-white border-2 border-gray-300 focus:ring-blue-500 focus:ring-offset-0 transition-colors duration-150 ${
              !showDay ? "rounded-full" : "rounded-md"
            }`}
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        <div
          className={`flex-1 flex flex-wrap items-center gap-3 ${
            showDay ? "justify-start" : "justify-between"
          }`}
        >
          {showDay && (
            <div className="flex flex-col min-w-[80px]">
              <span className="font-semibold text-gray-900 text-base leading-tight">
                {classItem.day}
              </span>
              <span className="text-xs text-gray-500 mt-0.5">
                {new Date(classItem.classDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          )}

          <div className="flex items-center gap-2 min-w-[140px]">
            <div className="flex items-center justify-center w-7 h-7 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
              <Clock className="w-4 h-4 text-gray-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-800">
                {classItem.classTime}
              </span>
              <span className="text-xs text-gray-500">Duration</span>
            </div>
          </div>

          <div className="flex items-center gap-2 min-w-[120px]">
            <div className="flex items-center justify-center w-7 h-7 bg-amber-100 rounded-lg group-hover:bg-amber-200 transition-colors">
              <Award className="w-4 h-4 text-amber-600" />
            </div>
            <div className="flex flex-col min-w-0">
              <span
                className="text-sm font-medium text-gray-800 truncate max-w-[120px]"
                title={classItem.coachName}
              >
                {classItem.coachName}
              </span>
              <span className="text-xs text-gray-500">Coach</span>
            </div>
          </div>

          <div className="flex justify-end">
            <StatusBadge type={classItem.type} />
          </div>
        </div>

        {isSelected && (
          <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full"></div>
        )}
      </div>
    );
  }
);

const ScheduleCalendar = ({ schedule, onSessionAction }) => {
  // Group classes by Month for the list view
  const classesByMonth = useMemo(() => {
    const grouped = {};
    const sortedSchedule = [...schedule].sort(
      (a, b) => new Date(a.classDate) - new Date(b.classDate)
    );

    sortedSchedule.forEach((session) => {
      const date = new Date(session.classDate);
      const monthKey = date.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
      if (!grouped[monthKey]) grouped[monthKey] = [];
      grouped[monthKey].push(session);
    });
    return grouped;
  }, [schedule]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8 overflow-hidden">
      <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
        <h3 className="font-bold text-gray-800 text-lg">Class Schedule</h3>
        <span className="text-sm text-gray-500">
          {schedule.length} Sessions
        </span>
      </div>

      <div className="max-h-[600px] overflow-y-auto custom-scrollbar bg-white">
        {Object.keys(classesByMonth).length > 0 ? (
          Object.entries(classesByMonth).map(([month, sessions]) => (
            <div key={month} className="relative">
              {/* Sticky Month Header */}
              <div className="sticky top-0 z-10 bg-gray-50/95 backdrop-blur-sm px-4 py-2 border-y border-gray-100 shadow-sm">
                <h3 className="text-sm font-bold text-blue-800 uppercase tracking-wider">
                  {month}
                </h3>
              </div>

              <div className="p-4 space-y-3">
                {sessions.map((session) => (
                  <div
                    key={session.sessionId}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all bg-white group"
                  >
                    {/* Date Block */}
                    <div className="flex-shrink-0 flex sm:flex-col items-center gap-2 sm:gap-0 min-w-[80px] sm:text-center">
                      <span className="text-xs font-bold text-gray-400 uppercase">
                        {new Date(session.classDate).toLocaleDateString(
                          "en-US",
                          { weekday: "short" }
                        )}
                      </span>
                      <span className="text-2xl font-bold text-blue-600 leading-none">
                        {new Date(session.classDate).getDate()}
                      </span>
                    </div>

                    {/* Vertical Divider (Desktop) */}
                    <div className="hidden sm:block w-px h-10 bg-gray-100"></div>

                    {/* Details */}
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="font-semibold text-gray-800">
                          {session.classTime}
                        </span>

                        {/* Status Pills */}
                        {session.status === "cancelled" && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-600 uppercase tracking-wide">
                            Cancelled
                          </span>
                        )}
                        {session.status === "rescheduled" && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 uppercase tracking-wide">
                            Rescheduled
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Award className="w-4 h-4 text-amber-500" />
                          {session.coachName}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                        <span
                          className={`capitalize ${
                            session.type === "online"
                              ? "text-blue-500"
                              : "text-green-500"
                          }`}
                        >
                          {session.type} Class
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    {session.status !== "cancelled" && (
                      <button
                        onClick={() => onSessionAction(session)}
                        className="w-full sm:w-auto mt-3 sm:mt-0 px-5 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        Manage
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <Calendar className="w-12 h-12 text-gray-300 mb-3" />
            <p className="font-medium">No classes scheduled</p>
          </div>
        )}
      </div>
    </div>
  );
};

const AssigningWholeClassToKid = () => {
  const { enqId } = useParams();
  const navigate = useNavigate();
  const [kidData, setKidData] = useState(null);
  const [availableClasses, setAvailableClasses] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [selectedDays, setSelectedDays] = useState([]);
  const [generatedSchedule, setGeneratedSchedule] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [modalState, setModalState] = useState({
    action: false,
    reschedule: false,
    success: false,
  });
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

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

      // If the target day is today or has passed this week, move to next week
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

      // If class date is in the future, use it
      if (classDate >= today) {
        return classDate;
      }

      // If class date has passed, find the next occurrence of that day
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
        const response = await getActiveKidData(enqId);
        if (response.success) {
          setKidData(response.data);
        }
      } catch (error) {
        console.error("Error fetching kid data:", error);
      }
    };

    fetchKidData();
  }, [enqId]);

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const response = await getScheduledClassData(enqId);

        // Filter classes based on the package's class mode
        if (response.status === 200) {
          let filteredClasses = response.data.classData;

          if (kidData.classDetails.classMode === "online") {
            filteredClasses = response.data.classData.filter(
              (cls) => cls.type === "online"
            );
          } else if (kidData.classDetails.classMode === "offline") {
            filteredClasses = response.data.classData.filter(
              (cls) => cls.type === "offline"
            );
          }
          // For hybrid mode, we keep all classes (both online and offline)

          setAvailableClasses(filteredClasses);
        }
      } catch (error) {
        console.error("Error fetching class data:", error);
      }
    };

    if (kidData) {
      fetchClassData();
    }
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
              sessionNumber: i + 1, // Use loop index + 1 for continuous numbering
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
            sessionNumber: i + 1, // Use loop index + 1 for continuous numbering
            classDate: new Date(nextClassDate),
            formattedDate: formatDate(nextClassDate),
            status: "scheduled",
          });
        }
      }

      // Sort by date first, then reassign session numbers to ensure continuity after sorting
      const sortedSchedule = schedule.sort((a, b) => a.classDate - b.classDate);

      // Reassign session numbers after sorting to maintain continuous order
      return sortedSchedule.map((session, index) => ({
        ...session,
        sessionNumber: index + 1,
      }));
    },
    [kidData, formatDate, getNextValidClassDate]
  );

  const handleClassSelection = useCallback((classItem) => {
    setSelectedClasses((prev) => {
      // Check if this specific class is already selected
      const isAlreadySelected = prev.some((c) => c._id === classItem._id);

      // Filter out any class that is on the SAME day as the new selection
      // This enforces "one selection per day"
      const others = prev.filter((c) => c.day !== classItem.day);

      if (isAlreadySelected) {
        // If clicking the same one, just deselect it (toggle)
        // Or if you want strict radio behavior (cannot deselect by clicking), return [ ...others, classItem ]
        // User asked to "select only one timings", doesn't explicitly say toggle off.
        // Assuming toggle is fine.
        return others;
      }

      // Add the new selection (replacing any existing one for that day)
      return [...others, classItem];
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

      // Generate new session to replace the cancelled one
      const newSession = generateSchedule([selectedSession])[0];
      if (newSession) {
        let newDate;

        // Find the latest date from all sessions (including the one being cancelled)
        const allSessionDates = prev.map((s) => s.classDate.getTime());
        const latestDate = Math.max(...allSessionDates);

        // Set the new date to be 7 days after the latest date
        newDate = new Date(latestDate);
        newDate.setDate(newDate.getDate() + 7);

        // Ensure it falls on the correct day of the week
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
            // If it's the same day, move to next week
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

  if (!kidData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow mb-4 p-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Class Assignment
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <InfoCard label="Student Name" value={kidData.kidName} />
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
              label="Selected Package "
              value={kidData.classDetails?.selectedPackage || "Not Specified"}
            />
            <InfoCard
              label="Class Details"
              value={
                <div className="space-y-1">
                  {kidData.classDetails?.classMode === "hybrid" ? (
                    <>
                      <p>
                        Online Classes:{" "}
                        {kidData.classDetails.onlineClasses || 0}
                      </p>
                      <p>
                        Offline Classes:{" "}
                        {kidData.classDetails.offlineClasses || 0}
                      </p>
                      <p>Mode: Hybrid</p>
                    </>
                  ) : (
                    <>
                      {(kidData.classDetails.numberOfClasses ||
                        kidData.classDetails.offlineClasses ||
                        kidData.classDetails.onlineClasses) && (
                        <p>
                          Total Classes:{" "}
                          {kidData.classDetails.numberOfClasses ||
                            kidData.classDetails.offlineClasses ||
                            kidData.classDetails.onlineClasses}
                        </p>
                      )}

                      {kidData.classDetails?.classMode && (
                        <p>Class Mode: {kidData.classDetails.classMode}</p>
                      )}
                    </>
                  )}
                </div>
              }
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8 mt-6">
            <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
              <div className="bg-blue-200 p-1.5 rounded-full">
                <Clock className="w-4 h-4 text-blue-700" />
              </div>
              How to Schedule Classes
            </h3>
            <div className="grid md:grid-cols-3 gap-6 relative">
              {/* Connector Line (Desktop) */}
              <div className="hidden md:block absolute top-4 left-[16%] right-[16%] h-0.5 bg-blue-200 -z-0"></div>

              <div className="flex gap-4 relative z-10">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shrink-0 shadow-sm border-2 border-white">
                  1
                </div>
                <div>
                  <p className="font-bold text-gray-900">Select Days</p>
                  <p className="text-sm text-gray-600 leading-snug">
                    Pick the days of the week for classes (e.g., Mon, Wed).
                  </p>
                </div>
              </div>

              <div className="flex gap-4 relative z-10">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shrink-0 shadow-sm border-2 border-white">
                  2
                </div>
                <div>
                  <p className="font-bold text-gray-900">Choose One Time</p>
                  <p className="text-sm text-gray-600 leading-snug">
                    Select <span className="underline">one</span> convenient
                    time slot for each chosen day.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 relative z-10">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shrink-0 shadow-sm border-2 border-white">
                  3
                </div>
                <div>
                  <p className="font-bold text-gray-900">Review Schedule</p>
                  <p className="text-sm text-gray-600 leading-snug">
                    Check the generated list below and click Confirm.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            {selectedDays.length === 0 && (
              <div className="absolute -top-12 left-2 md:left-10 animate-bounce z-20 flex flex-col items-center pointer-events-none">
                <div className="bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg mb-1 whitespace-nowrap relative">
                  Step 1: Select Days
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-600 rotate-45"></div>
                </div>
              </div>
            )}
            <DaySelection
              selectedDays={selectedDays}
              onDayToggle={(day) => {
                setSelectedDays((prev) =>
                  prev.includes(day)
                    ? prev.filter((d) => d !== day)
                    : [...prev, day]
                );
              }}
            />
          </div>

          {selectedDays.length > 0 && (
            <div className="bg-white rounded-lg shadow mb-6 p-4 relative mt-12">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Available Classes
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {DAYS_OF_WEEK.filter((day) => selectedDays.includes(day)).map(
                  (day, index, array) => {
                    const classesForDay = availableClasses.filter(
                      (cls) => cls.day === day
                    );

                    // Logic to find if this is the first day WITH classes that needs attention
                    const daysWithClasses = DAYS_OF_WEEK.filter(
                      (d) =>
                        selectedDays.includes(d) &&
                        availableClasses.some((c) => c.day === d)
                    );

                    // NEW: Find the first day that needs a selection but doesn't have one yet
                    const daysWithSelection = selectedClasses.map((c) => c.day);
                    const firstIncompleteDay = daysWithClasses.find(
                      (d) => !daysWithSelection.includes(d)
                    );

                    // Show arrow only on the specific day that needs action next
                    const showArrow =
                      day === firstIncompleteDay && classesForDay.length > 0;

                    // Helper to sort and group by time of day
                    const getStartTime = (timeStr) => {
                      const [time, period] = timeStr.split(" - ")[0].split(" ");
                      let [hours, minutes] = time.split(":").map(Number);
                      if (period === "PM" && hours !== 12) hours += 12;
                      if (period === "AM" && hours === 12) hours = 0;
                      return hours * 60 + minutes;
                    };

                    const getTimeBlock = (timeStr) => {
                      const minutes = getStartTime(timeStr);
                      if (minutes < 720) return "Morning"; // Before 12 PM
                      if (minutes < 1020) return "Afternoon"; // Before 5 PM
                      return "Evening";
                    };

                    const sortedClasses = [...classesForDay].sort(
                      (a, b) =>
                        getStartTime(a.classTime) - getStartTime(b.classTime)
                    );

                    const groupedClasses = {
                      Morning: sortedClasses.filter(
                        (c) => getTimeBlock(c.classTime) === "Morning"
                      ),
                      Afternoon: sortedClasses.filter(
                        (c) => getTimeBlock(c.classTime) === "Afternoon"
                      ),
                      Evening: sortedClasses.filter(
                        (c) => getTimeBlock(c.classTime) === "Evening"
                      ),
                    };

                    return (
                      <div
                        key={day}
                        className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex flex-col h-[400px] relative"
                      >
                        {showArrow && (
                          <div className="absolute -top-3 right-4 transform -translate-y-full animate-bounce z-20 flex flex-col items-center pointer-events-none">
                            <div className="bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg mb-1 whitespace-nowrap relative">
                              Step 2: Select Time
                              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-green-600 rotate-45"></div>
                            </div>
                            <ArrowDown className="w-6 h-6 text-green-600 fill-current mt-1" />
                          </div>
                        )}
                        <div className="flex items-center justify-between mb-3 shrink-0">
                          <h4 className="text-md font-bold text-gray-800 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                            {day}
                          </h4>
                          <span className="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded-md border border-gray-200">
                            {classesForDay.length} Slots
                          </span>
                        </div>

                        {classesForDay.length > 0 ? (
                          <div className="overflow-y-auto pr-2 custom-scrollbar flex-1 space-y-4">
                            {["Morning", "Afternoon", "Evening"].map(
                              (block) =>
                                groupedClasses[block].length > 0 && (
                                  <div key={block}>
                                    <div className="sticky top-0 bg-gray-50 z-10 py-1 mb-2">
                                      <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                        {block}
                                        <div className="h-px bg-gray-200 flex-1"></div>
                                      </h5>
                                    </div>
                                    <div className="space-y-2">
                                      {groupedClasses[block].map(
                                        (classItem) => (
                                          <ClassOption
                                            key={classItem._id}
                                            classItem={classItem}
                                            showDay={false}
                                            isSelected={selectedClasses.some(
                                              (c) => c._id === classItem._id
                                            )}
                                            onSelect={() =>
                                              handleClassSelection(classItem)
                                            }
                                          />
                                        )
                                      )}
                                    </div>
                                  </div>
                                )
                            )}
                          </div>
                        ) : (
                          <div className="bg-white rounded-lg p-4 text-center border border-dashed border-gray-300 flex items-center justify-center flex-1">
                            <p className="text-xs text-gray-500 italic">
                              No classes available.
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          )}
        </div>

        {generatedSchedule.length > 0 && (
          <ScheduleCalendar
            schedule={generatedSchedule}
            onSessionAction={handleSessionAction}
          />
        )}

        {/* Fixed Submit Button */}
        {generatedSchedule.length > 0 && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">
                  Course Duration
                </p>
                <p className="text-lg font-bold text-gray-800">
                  {new Date(
                    Math.min(
                      ...generatedSchedule.map((s) => new Date(s.classDate))
                    )
                  ).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                  <span className="mx-2 text-gray-400">-</span>
                  {new Date(
                    Math.max(
                      ...generatedSchedule.map((s) => new Date(s.classDate))
                    )
                  ).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 font-medium">Total Classes</p>
              <p className="text-lg font-bold text-blue-700">
                {generatedSchedule.length} Sessions
              </p>
            </div>
          </div>
        )}

        {generatedSchedule.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t">
            <div className="max-w-7xl mx-auto px-4 py-3 flex justify-end">
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary transition-colors font-medium"
              >
                Confirm Schedule
              </button>
            </div>
          </div>
        )}

        {/* Toast Notification */}
        {showToast && (
          <div className="fixed bottom-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-300 z-50">
            Schedule updated successfully!
          </div>
        )}

        {/* Action Modal */}
        <Modal
          isOpen={modalState.action}
          onClose={() => setModalState((prev) => ({ ...prev, action: false }))}
          title="Session Action"
        >
          <p className="text-gray-600 mb-6">
            {`Do you want to reschedule session ${selectedSession?.sessionNumber} or delete session ${selectedSession?.sessionNumber} and extend new session at the end?`}
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
              className="flex-1 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary transition-colors font-medium"
            >
              Reschedule
            </button>
            <button
              onClick={handleSessionDelete}
              className="flex-1 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Delete
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
              className="flex-1 bg-primary text-white px-3 py-2 rounded-lg hover:bg-primary transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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

        {/* Success Modal */}
        <Modal
          isOpen={modalState.success}
          onClose={() => setModalState((prev) => ({ ...prev, success: false }))}
          title="Success"
        >
          <p className="text-gray-600 mb-6">
            Classes have been successfully assigned!
          </p>
          <button
            onClick={() => {
              setModalState((prev) => ({ ...prev, success: false }));
              setTimeout(() => {
                navigate(
                  `/super-admin/department/display-whole-selectedClass/${enqId}`
                );
              }, 1500);
            }}
            className="w-full bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary transition-colors font-medium"
          >
            Close
          </button>
        </Modal>
      </div>
    </div>
  );
};

export default AssigningWholeClassToKid;
