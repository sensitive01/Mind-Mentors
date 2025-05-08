import {
  Calendar as CalendarIcon,
  Clock,
  UserCheck,
  UserX,
  AlertCircle,
  X,
  ChevronLeft,
  ChevronRight,
  LogOut,
  LogIn,
  Sigma,
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  getMyAttandanceData,
  isAttandaceMarked,
  markEmployeeAttandance,
} from "../../../api/service/employee/EmployeeService";
import { toast, ToastContainer } from "react-toastify";

const EmployeeAttendance = () => {
  const empId = localStorage.getItem("empId");

  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [attendanceData, setAttendanceData] = useState({});
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [attendanceCounts, setAttendanceCounts] = useState({
    present: 0,
    absent: 0,
    late: 0,
    totalWorkingDays: 0,
  });
  const [attendanceStatus, setAttendanceStatus] = useState("login");

  const today = new Date();
  const todayString = `${today.getFullYear()}-${(today.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;

  // Fetch attendance status (login/logout)
  useEffect(() => {
    const fetchAttendanceStatus = async () => {
      try {
        const response = await isAttandaceMarked(empId);
        console.log("Attendance status response:", response);

        if (response && response.data) {
          setAttendanceStatus(response.data.nextAction);
        }
      } catch (error) {
        console.error("Error fetching attendance status:", error);
        toast.error("Failed to check attendance status");
      }
    };

    fetchAttendanceStatus();
  }, [empId]);

  // Fetch attendance data and counts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await getMyAttandanceData(empId);
        console.log("Attendance data response:", response);
        
        if (response.status === 200) {
          // Process attendance summary to create a map for the calendar
          const attendanceMap = {};
          
            response.data.attendanceSummary.forEach(record => {
              if (record.date && record.status) {
                attendanceMap[record.date] = record.status.toLowerCase();
              }
            });
            setAttendanceData(attendanceMap);
        
          
          // Update attendance counts
            const { counts } = response.data;
            console.log("Attendance counts:", counts);
            
            setAttendanceCounts({
              present: counts.present || 0,
              absent: counts.absent || 0,
              late: counts.late || 0,
              totalWorkingDays: counts.totalWorkingDays || 0,
            });
        }
      } catch (error) {
        console.error("Error fetching attendance data:", error);
        toast.error("Failed to load attendance data");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [empId]);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handleMarkAttendance = async (action) => {
    setIsLoading(true);

    const now = new Date();

    let status;
    if (action === "login") {
      const isLate = now.getHours() >= 9 && now.getMinutes() > 0;
      status = isLate ? "Late" : "Present";
    } else if (action === "logout") {
      status = "Logout";
    }

    try {
      const response = await markEmployeeAttandance(empId, status, action);

      if (response.status === 201) {
        toast.success(
          `${action === "login" ? "Login" : "Logout"} marked successfully!`
        );

        if (action === "login") {
          // Update attendance data and counts
          setAttendanceData((prev) => ({
            ...prev,
            [todayString]: status.toLowerCase(),
          }));

          const countType = status === "Late" ? "late" : "present";
          setAttendanceCounts((prev) => ({
            ...prev,
            [countType]: prev[countType] + 1,
          }));
        }

        setAttendanceStatus(
          action === "login" ? "logout" : "attendance marked"
        );

        setShowAttendanceModal(false);
      } else {
        toast.error(`Failed to mark ${action}`);
      }
    } catch (error) {
      console.error(`Error marking ${action}:`, error);
      toast.error(`Error marking ${action}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentYear, selectedMonth);
    const firstDay = getFirstDayOfMonth(currentYear, selectedMonth);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${currentYear}-${(selectedMonth + 1)
        .toString()
        .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;

      // Get status from attendance data (case insensitive matching)
      let status = attendanceData[dateString];
      
      // Convert the status to lowercase for consistency if it exists
      if (status) {
        status = status.toLowerCase();
      }

      // For past dates without status, mark as absent for weekdays
      if (!status && new Date(dateString) < new Date(todayString)) {
        const dateObj = new Date(dateString);
        const dayOfWeek = dateObj.getDay();

        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          status = "absent";
        }
      }

      days.push({ day, status, dateString });
    }

    return days;
  };

  const handlePreviousMonth = () => {
    if (selectedMonth === 0) {
      setCurrentYear((prev) => prev - 1);
      setSelectedMonth(11);
    } else {
      setSelectedMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setCurrentYear((prev) => prev + 1);
      setSelectedMonth(0);
    } else {
      setSelectedMonth((prev) => prev + 1);
    }
  };

  const attendanceRate =
    attendanceCounts.totalWorkingDays > 0
      ? Math.round(
          ((attendanceCounts.present+ attendanceCounts.late)/ attendanceCounts.totalWorkingDays) * 100
        )
      : 0;

  // Improved attendance modal for login
  const AttendanceModal = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;

    // Check if employee is late (after 9 AM)
    const isLate = hours >= 9 && minutes > 0;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Mark Today's Attendance</h3>
            <button
              onClick={() => setShowAttendanceModal(false)}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Employee ID Display */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-500">Employee ID</div>
            <div className="font-medium">{empId}</div>
          </div>

          {/* Date and Time Display */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center text-purple-600 mb-1">
                <CalendarIcon className="w-4 h-4 mr-1" />
                <span className="text-sm">Date</span>
              </div>
              <div className="font-medium">
                {today.getDate()} {months[today.getMonth()]}{" "}
                {today.getFullYear()}
              </div>
            </div>

            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center text-blue-600 mb-1">
                <Clock className="w-4 h-4 mr-1" />
                <span className="text-sm">Time</span>
              </div>
              <div className="font-medium">{formattedTime}</div>
            </div>
          </div>

          {/* Status Indicator */}
          <div
            className={`mb-6 p-3 rounded-lg text-center ${
              isLate ? "bg-yellow-50" : "bg-green-50"
            }`}
          >
            <div className="font-medium mb-1">Status</div>
            <div
              className={`inline-flex items-center px-2 py-1 rounded-full ${
                isLate
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {isLate ? (
                <>
                  <Clock className="w-4 h-4 mr-1" />
                  <span>Late</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4 mr-1" />
                  <span>On Time</span>
                </>
              )}
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={() => handleMarkAttendance("login")}
            disabled={isLoading}
            className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center"
          >
            {isLoading ? (
              <span>Processing...</span>
            ) : (
              <>
                <UserCheck className="w-5 h-5 mr-2" />
                <span>Confirm Login</span>
              </>
            )}
          </button>
        </div>
      </div>
    );
  };

  const StatBox = ({ value, label, icon: Icon, color }) => (
    <div className={`flex flex-col items-center justify-center p-2 rounded-lg`}>
      <div className={`p-2 rounded-full ${color} mb-1`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="text-xl font-bold">{value}</div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  );

  // Generate button based on attendance status
  const renderAttendanceButton = () => {
    if (attendanceStatus === "login") {
      return (
        <button
          onClick={() => setShowAttendanceModal(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
        >
          <LogIn className="w-5 h-5 mr-2" />
          Mark Login
        </button>
      );
    } else if (attendanceStatus === "logout") {
      return (
        <button
          onClick={() => handleMarkAttendance("logout")}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Mark Logout
        </button>
      );
    } else {
      return (
        <div className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg flex items-center">
          <UserCheck className="w-5 h-5 mr-2" />
          Attendance Marked
        </div>
      );
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {showAttendanceModal && attendanceStatus === "login" && (
        <AttendanceModal />
      )}

      {/* Status Summary Card */}
      <div className="bg-white rounded-lg shadow-md mb-6 p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold flex items-center">
            <UserCheck className="w-5 h-5 mr-2 text-purple-600" />
            Attendance Summary
          </h2>

          {renderAttendanceButton()}
        </div>

        {isLoading ? (
          <div className="text-center py-4">Loading attendance data...</div>
        ) : (
          <>
            <div className="grid grid-cols-5 gap-2 mb-4">
            <StatBox
            
                value={attendanceCounts.totalWorkingDays}
                label="Total Days"
                icon={Sigma}
                color="bg-green-500"
              />
              <StatBox
                value={attendanceCounts.present}
                label="Present"
                icon={UserCheck}
                color="bg-green-500"
              />
              <StatBox
                value={attendanceCounts.absent}
                label="Absent"
                icon={UserX}
                color="bg-red-500"
              />
              <StatBox
                value={attendanceCounts.late}
                label="Late"
                icon={Clock}
                color="bg-yellow-500"
              />
              <StatBox
                value={`${attendanceRate}%`}
                label="Rate"
                icon={AlertCircle}
                color="bg-purple-500"
              />
            </div>

            {/* Progress Bar */}
            <div className="mb-2">
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: `${attendanceRate}%` }}
                ></div>
              </div>
            </div>
            <div className="text-xs text-gray-500 text-right">
              {attendanceCounts.present} of {attendanceCounts.totalWorkingDays}{" "}
              working days
            </div>
          </>
        )}
      </div>

      {/* Mini Calendar */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={handlePreviousMonth}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <h3 className="font-medium flex items-center">
            <CalendarIcon className="w-4 h-4 mr-2 text-purple-600" />
            {months[selectedMonth]} {currentYear}
          </h3>

          <button
            onClick={handleNextMonth}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 mb-2">
          {["S", "M", "T", "W", "T", "F", "S"].map((day, idx) => (
            <div
              key={idx}
              className="text-center text-xs font-medium text-gray-500"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {generateCalendarDays().map((item, index) => {
            if (!item) {
              return <div key={`empty-${index}`} className="h-8" />;
            }

            const { day, status, dateString } = item;
            const isToday = dateString === todayString;
            const isWeekend =
              new Date(dateString).getDay() === 0 ||
              new Date(dateString).getDay() === 6;

            // Determine the styling based on status
            let dayClass =
              "flex items-center justify-center h-8 w-8 rounded-full mx-auto";
            let textClass = isWeekend ? "text-gray-400" : "text-gray-700";

            if (isToday) {
              dayClass += " border-2 border-purple-500";
              textClass = "font-bold";
            }

            // Case-insensitive status comparison
            const statusLower = status ? status.toLowerCase() : null;
            
            if (statusLower === "present") {
              dayClass += " bg-green-100";
            } else if (statusLower === "absent") {
              dayClass += " bg-red-100";
            } else if (statusLower === "late") {
              dayClass += " bg-yellow-100";
            }

            return (
              <div key={`day-${index}`} className="text-center">
                <div className={dayClass}>
                  <span className={textClass}>{day}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex justify-center space-x-4 mt-4 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-100 rounded-full mr-1"></div>
            <span>Present</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-100 rounded-full mr-1"></div>
            <span>Absent</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-100 rounded-full mr-1"></div>
            <span>Late</span>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        style={{ marginTop: "50px" }}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        pauseOnFocusLoss
      />
    </div>
  );
};

export default EmployeeAttendance;