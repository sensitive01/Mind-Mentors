import React, { useEffect, useState } from "react";
import { Calendar, Clock, Award, PauseCircle, PlayCircle } from "lucide-react";
import { useParams } from "react-router-dom";
import { dispaySelectedClass } from "../../../api/service/employee/serviceDeliveryService";

export default function DisplaySelectedClass() {
  const { enqId } = useParams();
  const [kidName, setKidName] = useState("");
  const [data, setData] = useState([]);
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [pauseDate, setPauseDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [pauseRemarks, setPauseRemarks] = useState("");
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dispaySelectedClass(enqId);
        console.log("Response", response);
        if (response.status === 200) {
          setKidName(response.data.kidName);
          // Assuming class data comes from the same API
          setData(response.data.data || []);
          // You might want to check if the kid's classes are already paused
          // setIsPaused(response.data.isPaused || false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [enqId]);

  // Function to parse the date in "DD-MM-YY" format
  const parseFormattedDate = (dateStr) => {
    const [day, month, year] = dateStr.split("-");
    // Creating a date with format year-month-day and adding 2000 to year since it's in YY format
    return new Date(`20${year}-${month}-${day}`);
  };

  const handlePauseConfirm = async () => {
    try {
      // Implement your API call to pause classes
      // const response = await pauseClasses(enqId, pauseDate, pauseRemarks);
      console.log("Pausing classes from:", pauseDate, "Remarks:", pauseRemarks);

      // If API call is successful
      setIsPaused(true);
      setShowPauseModal(false);

      // Convert the selected pause date to a Date object
      const selectedPauseDate = new Date(pauseDate);
      
      // Update the class data to show cancelled status for classes after pause date
      const updatedData = data.map(session => {
        // Parse the DD-MM-YY formatted date
        const sessionDate = parseFormattedDate(session.formattedDate);
        
        if (sessionDate >= selectedPauseDate) {
          const updatedSession = { ...session, status: "cancelled" };
          console.log("Cancelled class:", updatedSession);
          return updatedSession;
        }
        return session;
      });
      
      // Log the complete updated data
      console.log("All updated classes:", updatedData);
      
      setData(updatedData);
    } catch (error) {
      console.error("Error pausing classes:", error);
    }
  };

  const handleResumeClasses = () => {
    // You might want to show a confirmation modal here as well
    // since rescheduling will be required
    setIsPaused(false);
    
    // Reset the cancelled status of future classes
    const updatedData = data.map(session => {
      if (session.status === "cancelled") {
        return { ...session, status: "rescheduled" };
      }
      return session;
    });
    
    setData(updatedData);
    // Implement your API call to resume classes
  };

  const ClassCard = ({ session, index }) => {
    // Determine the background color based on status
    let bgColor = "bg-white";
    if (session.status === "cancelled") {
      bgColor = "bg-red-50";
    } else if (session.status === "rescheduled") {
      bgColor = "bg-yellow-50";
    }

    return (
      <div
        className={`group relative ${bgColor} rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300`}
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
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm">{session.formattedDate}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-sm">{session.startTime || "TBD"}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <Award className="w-4 h-4 text-gray-400" />
              <span className="text-sm">{session.coach || "TBD"}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Pause Modal Component
  const PauseModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Pause Classes</h2>

        <div className="mb-4">
          <p className="text-gray-700 mb-4">
            When do you want to Pause the class from?
          </p>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pause Date
            </label>
            <input
              type="date"
              value={pauseDate}
              onChange={(e) => setPauseDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Remarks
            </label>
            <textarea
              value={pauseRemarks}
              onChange={(e) => setPauseRemarks(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              placeholder="Enter your remarks here..."
              style={{ resize: "none" }}
              // Fix for textarea focus issue
              autoFocus
            ></textarea>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={() => setShowPauseModal(false)}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none"
          >
            Cancel
          </button>
          <button
            onClick={handlePauseConfirm}
            className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none"
          >
            Confirm
          </button>
        </div>

        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> On Confirm, all active classes from the given
            date will be cancelled. On Resume, class rescheduling with remaining
            number of classes are mandatory.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto p-4">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow mb-4 p-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Class Schedule
          </h1>
          <div className="flex justify-between items-center">
            <div className="p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-500">Student Name</span>
              <p className="font-semibold text-gray-800 mt-1">
                {kidName || "Loading..."}
              </p>
            </div>

            {/* Pause/Resume Button */}
            {isPaused ? (
              <button
                onClick={handleResumeClasses}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <PlayCircle className="w-5 h-5" />
                Resume Classes
              </button>
            ) : (
              <button
                onClick={() => setShowPauseModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                <PauseCircle className="w-5 h-5" />
                Pause Classes
              </button>
            )}
          </div>
        </div>

        {/* Class Schedule Display */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Class Schedule</h2>
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
                <span className="text-sm text-gray-600">Rescheduled Class</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {data.length > 0 ? (
              data.map((session, index) => (
                <ClassCard
                  key={
                    session._id ? `${session._id}_${index}` : `session_${index}`
                  }
                  session={session}
                  index={index}
                />
              ))
            ) : (
              <div className="col-span-3 py-8 text-center text-gray-500">
                No class sessions available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Render Pause Modal if showPauseModal is true */}
      {showPauseModal && <PauseModal />}
    </div>
  );
}