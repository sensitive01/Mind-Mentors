import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Calendar, Clock, Award, X, Trash2, ChevronDown } from "lucide-react";
import {
  assignWholeClass,
  getActiveKidData,
} from "../../../api/service/employee/serviceDeliveryService";
import { useParams } from "react-router-dom";

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

const ClassSelectionDropdown = React.memo(
  ({
    isOpen,
    onToggle,
    selectedClasses,
    onClassSelection,
    availableClasses,
  }) => {
    return (
      <div className="relative">
        <button
          onClick={onToggle}
          className="w-full bg-white border rounded-lg p-3 text-left hover:border-blue-500 transition-all flex items-center justify-between shadow-sm"
        >
          <span className="text-gray-700">
            {selectedClasses.length === 0
              ? "Select Classes"
              : `${selectedClasses.length} Classes Selected`}
          </span>
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute z-10 mt-2 w-full bg-white rounded-lg shadow-lg border">
            <div className="p-3">
              {availableClasses.map((classItem) => (
                <ClassOption
                  key={classItem.id}
                  classItem={classItem}
                  isSelected={selectedClasses.some(
                    (c) => c.id === classItem.id
                  )}
                  onSelect={() => onClassSelection(classItem)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
);

const ClassOption = React.memo(({ classItem, isSelected, onSelect }) => (
  <div
    className="flex items-center hover:bg-gray-50 p-2 rounded-lg cursor-pointer mb-2 last:mb-0"
    onClick={onSelect}
  >
    <input
      type="checkbox"
      checked={isSelected}
      onChange={onSelect}
      className="w-4 h-4 text-primary rounded border-gray-300 mr-3"
      onClick={(e) => e.stopPropagation()}
    />
    <div className="flex-1 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <span className="font-medium text-gray-800 w-20">{classItem.day}</span>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600">{classItem.startTime}</span>
        </div>
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600">{classItem.coach}</span>
        </div>
      </div>
      <StatusBadge type={classItem.type} />
    </div>
  </div>
));

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
          <span className="text-sm">{session.startTime}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Award className="w-4 h-4 text-gray-400" />
          <span className="text-sm">{session.coach}</span>
        </div>
      </div>
    </div>
  </div>
));

const AssigningWholeClassToKid = () => {
  const { enqId } = useParams();
  const [kidData, setKidData] = useState(null);
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

  const availableClasses = useMemo(
    () => [
      {
        id: 1,
        day: "Monday",
        startTime: "10:00 AM",
        coach: "Puja",
        type: "online",
      },
      {
        id: 2,
        day: "Wednesday",
        startTime: "11:00 AM",
        coach: "Puja",
        type: "offline",
      },
      {
        id: 3,
        day: "Friday",
        startTime: "05:00 PM",
        coach: "Jayram",
        type: "online",
      },
      {
        id: 4,
        day: "Saturday",
        startTime: "09:00 AM",
        coach: "Jayram",
        type: "offline",
      },
      {
        id: 5,
        day: "Tuesday",
        startTime: "04:00 PM",
        coach: "Ravi",
        type: "online",
      },
    ],
    []
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

  const formatDate = useCallback((date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString().slice(-2);
    return `${day}-${month}-${year}`;
  }, []);

  const generateSchedule = useCallback(
    (classes, lastDate = new Date()) => {
      if (!classes.length || !kidData?.classDetails) return [];

      const { onlineClasses, offlineClasses, numberOfClasses } =
        kidData.classDetails;
      let schedule = [];
      let currentDate = new Date(lastDate);
      let currentIndex = 0;

      const addSession = (type, count) => {
        const classItem = classes[currentIndex % classes.length];
        schedule.push({
          ...classItem,
          sessionId: `${classItem.id}-${type}-${count}`,
          sessionNumber: schedule.length + 1,
          type,
          classDate: new Date(currentDate),
          formattedDate: formatDate(currentDate),
          status: "scheduled",
        });
        currentDate = new Date(currentDate.getTime() + 2 * 24 * 60 * 60 * 1000);
        currentIndex++;
      };

      if (onlineClasses && offlineClasses) {
        for (let i = 0; i < onlineClasses; i++) addSession("online", i);
        for (let i = 0; i < offlineClasses; i++) addSession("offline", i);
      } else if (numberOfClasses) {
        for (let i = 0; i < numberOfClasses; i++) {
          addSession(classes[currentIndex % classes.length].type, i);
        }
      }

      return schedule.sort((a, b) => a.classDate - b.classDate);
    },
    [kidData, formatDate]
  );

  const handleClassSelection = useCallback((classItem) => {
    setSelectedClasses((prev) => {
      const isSelected = prev.some((c) => c.id === classItem.id);
      const updated = isSelected
        ? prev.filter((c) => c.id !== classItem.id)
        : [...prev, classItem];
      return updated;
    });
  }, []);

  useEffect(() => {
    if (selectedClasses.length > 0) {
      const newSchedule = generateSchedule(selectedClasses);
      setGeneratedSchedule(newSchedule);
    }
  }, [selectedClasses, generateSchedule]);

  const handleSessionAction = useCallback((session) => {
    setSelectedSession(session);
    setModalState((prev) => ({ ...prev, action: true }));
  }, []);

  const handleSessionDelete = useCallback(() => {
    setGeneratedSchedule((prev) => {
      const updated = prev.map((session) =>
        session.sessionId === selectedSession.sessionId
          ? { ...session, status: "cancelled" }
          : session
      );
      const newSession = generateSchedule(
        [selectedSession],
        Math.max(...prev.map((s) => s.classDate))
      )[0];
      return [...updated, newSession];
    });
    setModalState((prev) => ({ ...prev, action: false }));
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  }, [selectedSession, generateSchedule]);

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
              label="Program"
              value={kidData.classDetails?.selectedPackage || "Not Specified"}
            />
            <InfoCard
              label="Class Details"
              value={
                <div className="space-y-1">
                  {kidData.classDetails?.onlineClasses && (
                    <p>Online Classes: {kidData.classDetails.onlineClasses}</p>
                  )}
                  {kidData.classDetails?.offlineClasses && (
                    <p>
                      Offline Classes: {kidData.classDetails.offlineClasses}
                    </p>
                  )}
                  {kidData.classDetails?.numberOfClasses && (
                    <p>Total Classes: {kidData.classDetails.numberOfClasses}</p>
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
          />
        </div>

        {generatedSchedule.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                Generated Schedule
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

        {/* Fixed Submit Button */}
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
          onClose={() =>
            setModalState((prev) => ({ ...prev, reschedule: false }))
          }
          title="Reschedule Session"
        >
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Date
            </label>
            <input
              type="date"
              className="w-full p-2 border rounded-lg"
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Class
            </label>
            <div className="relative">
              <select
                onChange={(e) => {
                  const selected = availableClasses.find(
                    (c) => c.id === parseInt(e.target.value)
                  );
                  setSelectedTimeSlot(selected);
                }}
                className="w-full bg-white border rounded-lg p-3 text-gray-700"
              >
                <option value="">Select Class</option>
                {availableClasses.map((classItem) => (
                  <option key={classItem.id} value={classItem.id}>
                    {`${classItem.day} - ${classItem.startTime} (${classItem.coach})`}
                  </option>
                ))}
              </select>
            </div>
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
              onClick={() =>
                setModalState((prev) => ({ ...prev, reschedule: false }))
              }
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
            onClick={() =>
              setModalState((prev) => ({ ...prev, success: false }))
            }
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
