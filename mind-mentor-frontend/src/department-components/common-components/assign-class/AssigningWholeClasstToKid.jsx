import React, { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  Award,
  X,
  Trash2,
  ChevronDown,
  CalendarClock,
} from "lucide-react";
import {
  assignWholeClass,
  getActiveKidData,
} from "../../../api/service/employee/serviceDeliveryService";
import { useParams } from "react-router-dom";

const AssigningWholeClassToKid = () => {
  const { enqId } = useParams();
  const [kidData, setKidData] = useState(null);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [generatedSchedule, setGeneratedSchedule] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [cancelledSessions, setCancelledSessions] = useState(new Set());
  const [showToast, setShowToast] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [isRescheduleDropdownOpen, setIsRescheduleDropdownOpen] =
    useState(false);

  // Available classes data
  const availableClasses = [
    {
      id: 1,
      day: "Monday",
      startTime: "10:00 AM",
      endTime: "",
      coach: "Puja",
      type: "online",
    },
    {
      id: 2,
      day: "Wednesday",
      startTime: "11:00 AM",
      endTime: "",
      coach: "Puja",
      type: "offline",
    },
    {
      id: 3,
      day: "Friday",
      startTime: "05:00 PM",
      endTime: "",
      coach: "Jayram",
      type: "online",
    },
    {
      id: 4,
      day: "Saturday",
      startTime: "09:00 AM",
      endTime: "",
      coach: "Jayram",
      type: "offline",
    },
    {
      id: 5,
      day: "Tuesday",
      startTime: "04:00 PM",
      endTime: "",
      coach: "Ravi",
      type: "online",
    },
  ];

  useEffect(() => {
    fetchKidData();
  }, [enqId]);

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

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString().slice(-2);
    return `${day}-${month}-${year}`;
  };

  const handleClassSelection = (classItem) => {
    const isSelected = selectedClasses.some((c) => c.id === classItem.id);
    if (isSelected) {
      const updatedClasses = selectedClasses.filter(
        (c) => c.id !== classItem.id
      );
      setSelectedClasses(updatedClasses);
      const newSchedule = generateAlternatingSchedule(updatedClasses);
      setGeneratedSchedule(newSchedule);
    } else {
      const newSelectedClasses = [...selectedClasses, classItem];
      setSelectedClasses(newSelectedClasses);
      const newSchedule = generateAlternatingSchedule(newSelectedClasses);
      setGeneratedSchedule(newSchedule);
      setIsDropdownOpen(false);
    }
  };

  const generateAlternatingSchedule = (classes) => {
    if (!classes.length || !kidData?.classDetails) return [];

    const totalOnlineClasses = kidData.classDetails.onlineClasses || 0;
    const totalOfflineClasses = kidData.classDetails.offlineClasses || 0;

    let schedule = [];
    let currentDate = new Date();
    let onlineCount = 0;
    let offlineCount = 0;
    let currentIndex = 0;

    while (
      onlineCount < totalOnlineClasses ||
      offlineCount < totalOfflineClasses
    ) {
      const classItem = classes[currentIndex % classes.length];

      // Alternate between online and offline classes
      const isOnlineSlot = schedule.length % 2 === 0;

      if (isOnlineSlot && onlineCount < totalOnlineClasses) {
        schedule.push({
          ...classItem,
          sessionId: `${classItem.id}-online-${onlineCount}`,
          sessionNumber: schedule.length + 1,
          type: "online",
          classDate: new Date(currentDate),
          formattedDate: formatDate(currentDate),
          status: "scheduled",
        });
        onlineCount++;
      } else if (!isOnlineSlot && offlineCount < totalOfflineClasses) {
        schedule.push({
          ...classItem,
          sessionId: `${classItem.id}-offline-${offlineCount}`,
          sessionNumber: schedule.length + 1,
          type: "offline",
          classDate: new Date(currentDate),
          formattedDate: formatDate(currentDate),
          status: "scheduled",
        });
        offlineCount++;
      }

      currentDate = new Date(currentDate.getTime() + 2 * 24 * 60 * 60 * 1000);
      currentIndex++;
    }

    return schedule.sort((a, b) => a.classDate - b.classDate);
  };

  const handleSessionAction = (session) => {
    setSelectedSession(session);
    setShowActionModal(true);
  };

  const handleSessionDelete = () => {
    const newCancelledSessions = new Set(cancelledSessions);
    newCancelledSessions.add(selectedSession.sessionId);
    setCancelledSessions(newCancelledSessions);

    const updatedSchedule = generatedSchedule.map((session) =>
      session.sessionId === selectedSession.sessionId
        ? { ...session, status: "cancelled" }
        : session
    );

    const newSession = regenerateSchedule(selectedSession);
    setGeneratedSchedule([...updatedSchedule, newSession]);

    setShowActionModal(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSessionReschedule = () => {
    setShowActionModal(false);
    setShowRescheduleModal(true);
    setSelectedTimeSlot(null);
  };

  const handleRescheduleConfirm = () => {
    if (!selectedDate || !selectedTimeSlot) return;

    const updatedSchedule = generatedSchedule.map((session) => {
      if (session.sessionId === selectedSession.sessionId) {
        return {
          ...session,
          ...selectedTimeSlot,
          classDate: selectedDate,
          formattedDate: formatDate(selectedDate),
          status: "rescheduled",
        };
      }
      return session;
    });

    setGeneratedSchedule(updatedSchedule);
    setShowRescheduleModal(false);
    setSelectedDate(null);
    setSelectedTimeSlot(null);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const regenerateSchedule = (cancelledSession) => {
    const schedule = [...generatedSchedule];
    const lastDate = new Date(Math.max(...schedule.map((s) => s.classDate)));
    const newDate = new Date(lastDate.getTime() + 7 * 24 * 60 * 60 * 1000);

    return {
      ...cancelledSession,
      sessionId: `${cancelledSession.id}-${
        cancelledSession.type
      }-new-${Date.now()}`,
      classDate: newDate,
      formattedDate: formatDate(newDate),
      status: "scheduled",
    };
  };

  const handleSubmit = async () => {
    setShowModal(true);
    const submissionData = {
      studentId: enqId,
      studentName: kidData?.kidName,
      selectedClasses,
      generatedSchedule: generatedSchedule.filter(
        (session) => !cancelledSessions.has(session.sessionId)
      ),
      cancelledSessions: Array.from(cancelledSessions),
    };

    console.log("Submitted Data:", submissionData);
    const response = await assignWholeClass(submissionData);
    console.log(response);
  };

  const ClassCard = ({ session }) => (
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
              <span
                className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                  session.type === "online"
                    ? "bg-blue-100 text-primary"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {session.type}
              </span>
              {session.status === "cancelled" && (
                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-700">
                  Cancelled
                </span>
              )}
              {session.status === "rescheduled" && (
                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">
                  Rescheduled
                </span>
              )}
            </div>
            <h3 className="text-base font-medium text-gray-700">
              {session.day}
            </h3>
          </div>

          {session.status !== "cancelled" && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSessionAction(session)}
                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200"
                title="Cancel session"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
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
  );

  // Action Modal
  const ActionModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">Session Action</h3>
          <button
            onClick={() => setShowActionModal(false)}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-gray-600 mb-6">
          Do you want to reschedule or delete Session{" "}
          {selectedSession?.sessionNumber}?
        </p>
        <div className="flex gap-4">
          <button
            onClick={handleSessionReschedule}
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
      </div>
    </div>
  );

  // Reschedule Modal
  const RescheduleModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">
            Reschedule Session
          </h3>
          <button
            onClick={() => setShowRescheduleModal(false)}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

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
            <button
              onClick={() =>
                setIsRescheduleDropdownOpen(!isRescheduleDropdownOpen)
              }
              className="w-full bg-white border rounded-lg p-3 text-left hover:border-blue-500 transition-all flex items-center justify-between shadow-sm"
            >
              <span className="text-gray-700">
                {selectedTimeSlot
                  ? `${selectedTimeSlot.day} - ${selectedTimeSlot.startTime} (${selectedTimeSlot.coach})`
                  : "Select Class"}
              </span>
              <ChevronDown
                className={`w-5 h-5 text-gray-400 transition-transform ${
                  isRescheduleDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isRescheduleDropdownOpen && (
              <div className="absolute z-20 mt-2 w-full bg-white rounded-lg shadow-lg border">
                <div className="p-3">
                  {availableClasses.map((classItem) => (
                    <div
                      key={classItem.id}
                      onClick={() => {
                        setSelectedTimeSlot(classItem);
                        setIsRescheduleDropdownOpen(false);
                      }}
                      className="flex items-center hover:bg-gray-50 p-2 rounded-lg cursor-pointer mb-2 last:mb-0"
                    >
                      <div className="flex-1 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="font-medium text-gray-800 w-20">
                            {classItem.day}
                          </span>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">
                              {classItem.startTime}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Award className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">
                              {classItem.coach}
                            </span>
                          </div>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            classItem.type === "online"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {classItem.type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleRescheduleConfirm}
            className="flex-1 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!selectedDate || !selectedTimeSlot}
          >
            Confirm Reschedule
          </button>
          <button
            onClick={() => setShowRescheduleModal(false)}
            className="flex-1 bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  if (!kidData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto p-4">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow mb-4 p-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Class Assignment
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-500">Student Name</span>
              <p className="font-semibold text-gray-800 mt-1">
                {kidData.kidName}
              </p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-500">Program</span>
              <p className="font-semibold text-gray-800 mt-1">
                {kidData.classDetails?.selectedPackage || "Not Specified"}
              </p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="space-y-1">
                <p className="font-semibold text-gray-800">
                  Online Classes: {kidData.classDetails?.onlineClasses || 0}
                </p>
                <p className="font-semibold text-gray-800">
                  Offline Classes: {kidData.classDetails?.offlineClasses || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Class Selection Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full bg-white border rounded-lg p-3 text-left hover:border-blue-500 transition-all flex items-center justify-between shadow-sm"
            >
              <span className="text-gray-700">
                {selectedClasses.length === 0
                  ? "Select Classes"
                  : `${selectedClasses.length} Classes Selected`}
              </span>
              <ChevronDown
                className={`w-5 h-5 text-gray-400 transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute z-10 mt-2 w-full bg-white rounded-lg shadow-lg border">
                <div className="p-3">
                  {availableClasses.map((classItem) => (
                    <label
                      key={classItem.id}
                      className="flex items-center hover:bg-gray-50 p-2 rounded-lg cursor-pointer mb-2 last:mb-0"
                    >
                      <input
                        type="checkbox"
                        checked={selectedClasses.some(
                          (c) => c.id === classItem.id
                        )}
                        onChange={() => handleClassSelection(classItem)}
                        className="w-4 h-4 text-primary rounded border-gray-300 mr-3"
                      />
                      <div className="flex-1 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="font-medium text-gray-800 w-20">
                            {classItem.day}
                          </span>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">
                              {classItem.startTime}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Award className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">
                              {classItem.coach}
                            </span>
                          </div>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            classItem.type === "online"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {classItem.type}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Generated Schedule */}
        {generatedSchedule.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                Generated Schedule
              </h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm text-gray-600">Online Class</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm text-gray-600">Offline Class</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-sm text-gray-600">Cancelled Class</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span className="text-sm text-gray-600">
                    Rescheduled Class
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {generatedSchedule.map((session) => (
                <ClassCard key={session.sessionId} session={session} />
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

        {/* Success Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">Success</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-gray-600 mb-6">
                Classes have been successfully assigned!
              </p>
              <button
                onClick={() => setShowModal(false)}
                className="w-full bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Action Modal */}
        {showActionModal && <ActionModal />}

        {/* Reschedule Modal */}
        {showRescheduleModal && <RescheduleModal />}
      </div>
    </div>
  );
};

export default AssigningWholeClassToKid;
