import React, { useEffect, useState } from "react";
import {
  Clock,
  User,
  Calendar,
  MapPin,
  Monitor,
  Users,
  Video,
  Loader,
  AlertCircle,
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
  const [joiningClass, setJoiningClass] = useState(null); // Track which class is being joined

  const primaryColor = "#4f46e5";

  useEffect(() => {
    const fetchData = async () => {
      if (!kidId) return;

      setLoading(true);
      try {
        const response = await getKidLiveClass(kidId);
        if (response.status === 200) {
          console.log("Class data:", response.data.data); // Debug log
          setClassData(response.data.data);
          setKidName(response.data.kidName);
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
  }, [kidId]); // Added kidId to dependency array

  const isToday = (classDay) => {
    const today = new Date();
    const todayDayName = today.toLocaleDateString("en-US", { weekday: "long" }); // e.g., "Monday"

    // If classDay is a date string, get the day name from it
    if ((classDay && classDay.includes("-")) || classDay.includes("/")) {
      const classDate = new Date(classDay);
      const classDayName = classDate.toLocaleDateString("en-US", {
        weekday: "long",
      });
      return todayDayName.toLowerCase() === classDayName.toLowerCase();
    }

    // If classDay is already a day name (e.g., "Monday", "Tuesday")
    return todayDayName.toLowerCase() === classDay.toLowerCase();
  };

  const getTodayClasses = () => {
    const todayClasses = classData.filter((classItem) => {
      // Try both classDate and day fields
      const isClassToday = classItem.classDate
        ? isToday(classItem.classDate)
        : isToday(classItem.day);

      console.log(
        `Class ${classItem._id}: ${
          classItem.classDate || classItem.day
        } - Is today: ${isClassToday}`
      ); // Debug log
      return isClassToday;
    });

    console.log("Today's classes:", todayClasses); // Debug log
    return todayClasses;
  };

  const handleJoinClass = async (kidJoinUrl, classId) => {
    try {
      setJoiningClass(classId); // Set loading state for this specific class
      console.log("joinUrl", kidJoinUrl, "kidName", kidName);

      const urlParts = kidJoinUrl.split("/");
      const classRoomId = urlParts[urlParts.length - 1]; // Gets the last part (3g5hyd80)

      console.log("Extracted classRoomId:", classRoomId);
      const response = await axios.get(
        `https://live.mindmentorz.in/api/new-class/get-new-class/${classRoomId}`
      );

      const { meetingID } = response.data;

      const joinResponse = await axios.post(
        `https://live.mindmentorz.in/api/new-class/new-sign-join-url`,
        {
          fullName: kidName,
          meetingID: meetingID,
          password: "apwd",
        }
      );
      window.location.href = joinResponse.data.signedUrl;
    } catch (error) {
      console.error("Error joining session:", error);
      // You might want to show a toast/notification here
      alert("Failed to join session. Please try again.");
    } finally {
      setJoiningClass(null); // Clear loading state
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
    // Handle different time formats
    if (!timeString) return "Time not specified";

    // If it's already a formatted time, return as is
    if (timeString.includes("AM") || timeString.includes("PM")) {
      return timeString;
    }

    // If it's in HH:MM format, convert to 12-hour format
    try {
      const [hours, minutes] = timeString.split(":");
      const hour = parseInt(hours, 10);
      const minute = minutes || "00";
      const ampm = hour >= 12 ? "PM" : "AM";
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minute} ${ampm}`;
    } catch (e) {
      return timeString; // Return as is if parsing fails
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center">
            <Loader className="w-10 h-10 text-indigo-600 animate-spin" />
            <p className="mt-4 text-gray-600">Loading live classes...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const todayClasses = getTodayClasses();

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6" style={{ color: primaryColor }}>
        Today's Live Classes
      </h2>

      {todayClasses.length === 0 ? (
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-700 font-medium text-lg mb-2">
            No live classes scheduled for today
          </p>
          <p className="text-gray-500">
            Check back tomorrow or view your class schedule
          </p>
        </div>
      ) : (
        <div
          className="space-y-6 max-h-96 overflow-y-auto pr-2"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: `${primaryColor} #e5e7eb`,
          }}
        >
          <style jsx>{`
            div::-webkit-scrollbar {
              width: 8px;
            }
            div::-webkit-scrollbar-track {
              background: #f1f5f9;
              border-radius: 4px;
            }
            div::-webkit-scrollbar-thumb {
              background: ${primaryColor};
              border-radius: 4px;
            }
            div::-webkit-scrollbar-thumb:hover {
              background: #3730a3;
            }
          `}</style>
          {todayClasses.map((classItem) => (
            <div
              key={classItem._id}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {classItem.program} - {classItem.level}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span
                      className="px-3 py-1 rounded-full text-sm font-medium text-white"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {classItem.status || "Scheduled"}
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                      {classItem.type === "online" ? "Online" : "Offline"}
                    </span>
                  </div>
                </div>

                {classItem.type === "online" ? (
                  <Monitor className="w-8 h-8 text-blue-500" />
                ) : (
                  <MapPin className="w-8 h-8 text-green-500" />
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <Calendar
                    className="w-5 h-5"
                    style={{ color: primaryColor }}
                  />
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium text-gray-900">
                      {formatDate(classItem.classDate || classItem.day)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5" style={{ color: primaryColor }} />
                  <div>
                    <p className="text-sm text-gray-500">Time</p>
                    <p className="font-medium text-gray-900">
                      {formatTime(classItem.classTime)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <User className="w-5 h-5" style={{ color: primaryColor }} />
                  <div>
                    <p className="text-sm text-gray-500">Coach</p>
                    <p className="font-medium text-gray-900">
                      {classItem.coachName || "TBA"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5" style={{ color: primaryColor }} />
                  <div>
                    <p className="text-sm text-gray-500">Enrollment</p>
                    <p className="font-medium text-gray-900">
                      {classItem.enrolledKidCount || 0}/
                      {classItem.maximumKidCount || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {classItem.centerName && (
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="font-medium text-gray-700">Center</span>
                  </div>
                  <p className="text-gray-600">{classItem.centerName}</p>
                </div>
              )}

              {/* Action buttons section */}
              <div className="flex justify-end mt-4">
                {classItem.type === "online" && classItem.kidJoinUrl ? (
                  <button
                    onClick={() =>
                      handleJoinClass(classItem.kidJoinUrl, classItem._id)
                    }
                    disabled={joiningClass === classItem._id}
                    className="flex items-center gap-2 px-6 py-3 text-white rounded-lg font-medium transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    style={{
                      backgroundColor:
                        joiningClass === classItem._id
                          ? "#9ca3af"
                          : primaryColor,
                    }}
                  >
                    {joiningClass === classItem._id ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        Joining...
                      </>
                    ) : (
                      <>
                        <Video className="w-5 h-5" />
                        Join Live Class
                      </>
                    )}
                  </button>
                ) : classItem.type === "online" ? (
                  <div className="px-6 py-3 bg-gray-100 text-gray-600 rounded-lg font-medium">
                    <Video className="w-5 h-5 inline mr-2" />
                    Join URL Not Available
                  </div>
                ) : (
                  <div className="px-6 py-3 bg-green-100 text-green-700 rounded-lg font-medium">
                    <MapPin className="w-5 h-5 inline mr-2" />
                    Physical Class at Center
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {classData.length > todayClasses.length && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Upcoming Classes
          </h3>
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-64 overflow-y-auto pr-2"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: `${primaryColor} #e5e7eb`,
            }}
          >
            <style jsx>{`
              div::-webkit-scrollbar {
                width: 8px;
              }
              div::-webkit-scrollbar-track {
                background: #f1f5f9;
                border-radius: 4px;
              }
              div::-webkit-scrollbar-thumb {
                background: ${primaryColor};
                border-radius: 4px;
              }
              div::-webkit-scrollbar-thumb:hover {
                background: #3730a3;
              }
            `}</style>
            {classData
              .filter(
                (classItem) => !isToday(classItem.classDate || classItem.day)
              )
              .map((classItem) => (
                <div
                  key={classItem._id}
                  className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-900">
                      {classItem.program} - {classItem.level}
                    </h4>
                    <span className="text-sm text-gray-500">
                      {classItem.type}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>{formatDate(classItem.classDate || classItem.day)}</p>
                    <p>{formatTime(classItem.classTime)}</p>
                    <p>Coach: {classItem.coachName || "TBA"}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveClass;
