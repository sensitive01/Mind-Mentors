import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { Calendar, Clock, Award, X, Trash2, ChevronDown } from "lucide-react";
import {
  assignWholeClass,
  getActiveKidData,
  getScheduledClassData,
  getLastClassData,
  addExtraClassToKid,
} from "../../../api/service/employee/serviceDeliveryService";

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

const ClassOption = React.memo(({ classItem, isSelected, onSelect }) => {
  return (
    <div
      className={`group relative flex items-center p-4 rounded-xl border transition-all duration-200 cursor-pointer mb-3 last:mb-0 hover:shadow-md ${
        isSelected
          ? "bg-blue-50 border-blue-200 shadow-sm ring-1 ring-blue-100"
          : "bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50"
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center mr-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          className="w-5 h-5 text-blue-600 bg-white border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 transition-colors duration-150"
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        <div className="flex flex-col">
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

        <div className="flex items-center gap-2">
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

        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 bg-amber-100 rounded-lg group-hover:bg-amber-200 transition-colors">
            <Award className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex flex-col min-w-0">
            <span
              className="text-sm font-medium text-gray-800 truncate"
              title={classItem.coachName}
            >
              {classItem.coachName}
            </span>
            <span className="text-xs text-gray-500">Coach</span>
          </div>
        </div>

        <div className="flex justify-end md:justify-center">
          <StatusBadge type={classItem.type} />
        </div>
      </div>

      {isSelected && (
        <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full"></div>
      )}
    </div>
  );
});

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
      <div className="mb-4">
        {title && (
          <div className="text-sm font-medium text-gray-600 mb-2 px-2">
            {title} Classes
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
      <div className="relative">
        <button
          onClick={onToggle}
          className="w-full bg-white border rounded-lg p-3 text-left hover:border-blue-500 transition-all flex items-center justify-between shadow-sm"
        >
          <div className="flex items-center gap-2">
            {selectedClasses.length === 0 ? (
              <span className="text-gray-500">Select Classes</span>
            ) : (
              <>
                <span className="bg-primary text-white text-xs font-medium px-2 py-1 rounded-full">
                  {selectedClasses.length}
                </span>
                <span className="text-gray-700 font-medium">
                  Classes Selected
                </span>
                {classMode === "hybrid" && (
                  <div className="flex gap-1 ml-2">
                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded">
                      Online:{" "}
                      {
                        selectedClasses.filter((c) => c.type === "online")
                          .length
                      }
                    </span>
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded">
                      Offline:{" "}
                      {
                        selectedClasses.filter((c) => c.type === "offline")
                          .length
                      }
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute z-10 mt-2 w-full bg-white rounded-lg shadow-lg border max-h-96 overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-3 flex justify-between items-center">
              <h4 className="font-medium text-gray-700">Available Classes</h4>
              {selectedClasses.length > 0 && (
                <button
                  onClick={() =>
                    selectedClasses.forEach((c) => onClassSelection(c))
                  }
                  className="text-xs text-red-500 hover:text-red-700 transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>

            <div className="p-3">
              {availableClasses.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  No classes available
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-4 text-xs text-gray-500 mb-2 px-2">
                    <div className="col-span-1">Day</div>
                    <div className="col-span-1">Time</div>
                    <div className="col-span-1">Coach</div>
                    <div className="col-span-1">Type</div>
                  </div>

                  {classMode === "hybrid" ? (
                    <>
                      {renderClassGroup(groupedClasses.online, "Online")}
                      {renderClassGroup(groupedClasses.offline, "Offline")}
                    </>
                  ) : (
                    renderClassGroup(groupedClasses.all)
                  )}
                </>
              )}
            </div>

            {selectedClasses.length > 0 && (
              <div className="sticky bottom-0 bg-white border-t p-3 flex justify-end">
                <button
                  onClick={onToggle}
                  className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

const ClassCard = React.memo(({ session, onSessionAction }) => (
  <div
    className={`group relative bg-white rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300 ${
      session.status === "cancelled" ? "bg-red-50" : ""
    } ${session.status === "rescheduled" ? "bg-yellow-50" : ""}`}
  >
    <div
      className={`absolute top-0 left-0 right-0 h-1 ${
        session.type === "online" ? "bg-blue-500" : "bg-green-500"
      }`}
    />
    <div className="p-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg font-semibold text-gray-800">
              Session {session.sessionNumber}
            </span>
            <StatusBadge type={session.type} status={session.status} />
          </div>
          <h3 className="text-base font-medium text-gray-700">{session.day}</h3>
        </div>
        {session.status !== "cancelled" && (
          <button
            onClick={() => onSessionAction(session)}
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200"
            title="Cancel session"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-sm">{session.formattedDate}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-sm">{session.classTime}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Award className="w-4 h-4 text-gray-400" />
          <span className="text-sm">{session.coachName}</span>
        </div>
      </div>
    </div>
  </div>
));

const AddExtraClassData = () => {
  const { enqId, classId } = useParams();
  const { state } = useLocation();
  const { extraPackageId } = state || {};
  const navigate = useNavigate();

  const [kidData, setKidData] = useState(null);
  const [lastClass, setLastClass] = useState(null);
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      if (daysToAdd <= 0) daysToAdd += 7;
      const nextOccurrence = new Date(currentDate);
      nextOccurrence.setDate(currentDate.getDate() + daysToAdd);
      return nextOccurrence;
    },
    []
  );

  const formatDate = useCallback((date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString().slice(-2);
    return `${day}-${month}-${year}`;
  }, []);

  const getNextValidClassDate = useCallback(
    (classItem) => {
      if (!lastClass) return new Date(classItem.classDate);
      const lastClassDate = new Date(lastClass.classDate);
      return getNextOccurrenceOfDay(classItem.day, lastClassDate);
    },
    [lastClass, getNextOccurrenceOfDay]
  );

  const getAvailableClassesForDate = useCallback(
    (date) => {
      if (!date) return [];
      const dayName = getDayName(date);
      return availableClasses.filter((cls) => cls.day === dayName);
    },
    [availableClasses, getDayName]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [kidResponse, lastClassResponse, classResponse] =
          await Promise.all([
            getActiveKidData(enqId),
            getLastClassData(classId),
            getScheduledClassData(enqId),
          ]);

        if (!kidResponse?.success) throw new Error("Failed to fetch kid data");
        if (lastClassResponse?.status !== 200)
          throw new Error("Failed to fetch last class data");
        if (classResponse?.status !== 200)
          throw new Error("Failed to fetch class data");

        setKidData(kidResponse.data?.data || kidResponse.data);

        const lastClassData =
          lastClassResponse.data?.lastClass || lastClassResponse.data;
        if (!lastClassData) throw new Error("No last class data found");

        setLastClass({
          ...lastClassData,
          formattedDate: formatDate(new Date(lastClassData.classDate)),
        });

        let filteredClasses = classResponse.data?.classData || [];
        const classMode = kidResponse.data?.classDetails?.classMode;

        if (classMode === "online") {
          filteredClasses = filteredClasses.filter(
            (cls) => cls.type === "online"
          );
        } else if (classMode === "offline") {
          filteredClasses = filteredClasses.filter(
            (cls) => cls.type === "offline"
          );
        }

        setAvailableClasses(filteredClasses);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [enqId, classId, formatDate]);

  const generateSchedule = useCallback(
    (classes) => {
      if (!classes.length || !kidData?.classDetails || !lastClass) return [];

      const { onlineClasses, offlineClasses, classMode } = kidData.classDetails;
      let schedule = [];
      const lastScheduledDates = new Map();

      // Start session numbers from last session number + 1
      let sessionCounter = (lastClass.sessionNumber || 0) + 1;

      if (classMode === "hybrid") {
        const onlineClassList = classes.filter((c) => c.type === "online");
        const offlineClassList = classes.filter((c) => c.type === "offline");

        let onlineCount = 0;
        let offlineCount = 0;

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
              nextClassDate = getNextValidClassDate(classItem);
            }

            lastScheduledDates.set(classKey, nextClassDate);

            schedule.push({
              ...classItem,
              sessionId: `${classItem._id}-${i}`,
              sessionNumber: sessionCounter++,
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

        for (let i = 0; i < totalClasses; i++) {
          const classItem = classes[i % classes.length];
          const classKey = `${classItem._id}-${classItem.day}`;
          let nextClassDate;

          if (lastScheduledDates.has(classKey)) {
            const lastDate = lastScheduledDates.get(classKey);
            nextClassDate = new Date(lastDate);
            nextClassDate.setDate(nextClassDate.getDate() + 7);
          } else {
            nextClassDate = getNextValidClassDate(classItem);
          }

          lastScheduledDates.set(classKey, nextClassDate);

          schedule.push({
            ...classItem,
            sessionId: `${classItem._id}-${i}`,
            sessionNumber: sessionCounter++,
            classDate: new Date(nextClassDate),
            formattedDate: formatDate(nextClassDate),
            status: "scheduled",
          });
        }
      }

      return schedule.sort((a, b) => a.classDate - b.classDate);
    },
    [kidData, formatDate, getNextValidClassDate, lastClass]
  );

  const handleClassSelection = useCallback((classItem) => {
    setSelectedClasses((prev) => {
      const isSelected = prev.some((c) => c._id === classItem._id);
      return isSelected
        ? prev.filter((c) => c._id !== classItem._id)
        : [...prev, classItem];
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
    try {
      const data = {
        studentId: enqId,
        studentName: kidData?.kidName,
        selectedClasses,
        generatedSchedule,
        extraPackageId,
      };
      const response = await addExtraClassToKid(classId, data);
      if (response.status === 200) {
        setModalState((prev) => ({ ...prev, success: true }));
        setTimeout(() => {
          navigate(
            `/super-admin/department/display-whole-selectedClass/${enqId}`
          );
        }, 1500);
      }
    } catch (error) {
      console.error("Error submitting schedule:", error);
      setError("Failed to submit schedule");
    }
  };

  const availableClassesForReschedule = useMemo(() => {
    return getAvailableClassesForDate(selectedDate);
  }, [selectedDate, getAvailableClassesForDate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow mb-4 p-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Add Extra Classes
          </h1>

          {lastClass && (
            <div className="mb-6 bg-blue-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                Last Scheduled Class
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InfoCard label="Day" value={lastClass.day || "N/A"} />
                <InfoCard
                  label="Date"
                  value={lastClass.formattedDate || "N/A"}
                />
                {/* <InfoCard label="Time" value={lastClass.classTime || "N/A"} /> */}
                <InfoCard label="Type" value={lastClass.type || "N/A"} />
                <InfoCard
                  label="Status"
                  value={lastClass.status || "scheduled"}
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <InfoCard label="Student Name" value={kidData?.kidName || "N/A"} />
            <InfoCard
              label="Program & Level"
              value={
                kidData?.classDetails?.program && kidData?.classDetails?.level
                  ? `${kidData.classDetails.program} - ${kidData.classDetails.level}`
                  : kidData?.classDetails?.selectedProgram &&
                    kidData?.classDetails?.selectedLevel
                  ? `${kidData.classDetails.selectedProgram} - ${kidData.classDetails.selectedLevel}`
                  : "Not Specified"
              }
            />
            <InfoCard
              label="Selected Package"
              value={kidData?.classDetails?.selectedPackage || "Not Specified"}
            />
            <InfoCard
              label="Class Details"
              value={
                <div className="space-y-1">
                  {kidData?.classDetails?.classMode === "hybrid" ? (
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
                      {(kidData?.classDetails?.numberOfClasses ||
                        kidData?.classDetails?.offlineClasses ||
                        kidData?.classDetails?.onlineClasses) && (
                        <p>
                          Total Classes:{" "}
                          {kidData.classDetails.numberOfClasses ||
                            kidData.classDetails.offlineClasses ||
                            kidData.classDetails.onlineClasses}
                        </p>
                      )}
                      {kidData?.classDetails?.classMode && (
                        <p>Class Mode: {kidData.classDetails.classMode}</p>
                      )}
                    </>
                  )}
                </div>
              }
            />
          </div>

          <ClassSelectionDropdown
            isOpen={isDropdownOpen}
            onToggle={() => setIsDropdownOpen(!isDropdownOpen)}
            selectedClasses={selectedClasses}
            onClassSelection={handleClassSelection}
            availableClasses={availableClasses}
            classMode={kidData?.classDetails?.classMode}
          />
        </div>

        {generatedSchedule.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                New Extra Classes Schedule
              </h2>
              <div className="flex items-center gap-4">
                {[
                  { color: "blue", label: "Online Class" },
                  { color: "green", label: "Offline Class" },
                  { color: "red", label: "Cancelled Class" },
                  { color: "yellow", label: "Rescheduled Class" },
                ].map(({ color, label }) => (
                  <div key={color} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full bg-${color}-500`} />
                    <span className="text-sm text-gray-600">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {generatedSchedule.map((session) => (
                <ClassCard
                  key={session.sessionId}
                  session={session}
                  onSessionAction={handleSessionAction}
                />
              ))}
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
                Confirm Extra Classes
              </button>
            </div>
          </div>
        )}

        {showToast && (
          <div className="fixed bottom-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-300 z-50">
            Schedule updated successfully!
          </div>
        )}

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
                setSelectedTimeSlot(null);
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

        <Modal
          isOpen={modalState.success}
          onClose={() => setModalState((prev) => ({ ...prev, success: false }))}
          title="Success"
        >
          <p className="text-gray-600 mb-6">
            Extra classes have been successfully assigned!
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

export default AddExtraClassData;
