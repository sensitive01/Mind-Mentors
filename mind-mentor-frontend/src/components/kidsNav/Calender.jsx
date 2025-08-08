import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  User,
  MapPin,
  Video,
  AlertCircle,
  CheckCircle,
  XCircle,
  BookOpen,
  Award,
  Grid,
  List,
  Filter,
  TrendingUp,
  CalendarPlus,
  Info,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchkidClassData,
  getIsSheduledResponse,
} from "../../api/service/parent/ParentService";

const ClassScheduleCalendar = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [viewMode, setViewMode] = useState("month");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showScheduleButton, setShowScheduleButton] = useState(false);

  // Fetch class data from API
  useEffect(() => {
    const fetchClassData = async () => {
      try {
        setLoading(true);
        const response = await fetchkidClassData(id);
        console.log("API Response:", response);

        if (response.status === 200) {
          const allSessions = response.data.classData.map((session) => ({
            ...session,
            parsedDate: new Date(session.classDate),
            startTime:
              session.scheduleDetails?.classTime || session.classTime || "",
            endTime: session.scheduleDetails?.endTime || "",
            coach:
              session.scheduleDetails?.coachName || session.coachName || "",
            center:
              session.scheduleDetails?.centerName || session.centerName || "",
            program: session.scheduleDetails?.program || session.program || "",
            level: session.scheduleDetails?.level || session.level || "",
            studentName:
              session.scheduleDetails?.studentName ||
              session.studentName ||
              "Student",
          }));

          console.log("Processed sessions:", allSessions);
          setSessions(allSessions);
        }
      } catch (error) {
        console.error("Error fetching class data:", error);
        setError("Failed to load class data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchClassData();
    }
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getIsSheduledResponse(id);
      if (response.status === 200) {
        setShowScheduleButton(response.data.data);
      }
    };
    fetchData();
  }, []);

  // Filter sessions for selected date
  useEffect(() => {
    const dateString = selectedDate.toISOString().split("T")[0];
    let filtered = sessions.filter((session) => {
      const sessionDate = new Date(session.classDate)
        .toISOString()
        .split("T")[0];
      return sessionDate === dateString;
    });

    if (statusFilter !== "all") {
      filtered = filtered.filter((session) => session.status === statusFilter);
    }

    setFilteredSessions(filtered);
  }, [selectedDate, sessions, statusFilter]);

  // Handle schedule new class
  const handleScheduleClass = () => {
    navigate(`/parent/kid/shedule-new-live-class/${id}`);
  };

  const handleRescheduleClass = () => {
    navigate(`/parent/kid/reshedule-sheduled-class/${id}`);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "scheduled":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "completed":
        return "bg-green-50 text-green-700 border-green-200";
      case "rescheduled":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "scheduled":
        return <Calendar className="w-4 h-4" />;
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "rescheduled":
        return <AlertCircle className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const getDaysInMonth = (year, month) =>
    new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const handleDateClick = (day) => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    setSelectedDate(newDate);
  };

  const getSessionsForDate = (year, month, day) => {
    const dateString = new Date(year, month, day).toISOString().split("T")[0];
    return sessions.filter((session) => {
      const sessionDate = new Date(session.classDate)
        .toISOString()
        .split("T")[0];
      return sessionDate === dateString;
    });
  };

  const renderCalendarDays = () => {
    const days = [];
    const totalDays = getDaysInMonth(
      currentDate.getFullYear(),
      currentDate.getMonth()
    );
    const firstDay = getFirstDayOfMonth(
      currentDate.getFullYear(),
      currentDate.getMonth()
    );

    // Empty cells for days before first day of month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className="h-20 bg-gray-50/50 border border-gray-100"
        ></div>
      );
    }

    // Calendar days
    for (let day = 1; day <= totalDays; day++) {
      const dateSessions = getSessionsForDate(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );

      const isToday =
        new Date().setHours(0, 0, 0, 0) ===
        new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          day
        ).setHours(0, 0, 0, 0);

      const isSelected =
        selectedDate.getDate() === day &&
        selectedDate.getMonth() === currentDate.getMonth() &&
        selectedDate.getFullYear() === currentDate.getFullYear();

      days.push(
        <div
          key={day}
          className={`h-20 border border-gray-100 p-2 cursor-pointer transition-all duration-200 hover:bg-indigo-50 relative overflow-hidden
            ${isToday ? "bg-blue-50 border-blue-200" : ""}
            ${
              isSelected
                ? "bg-indigo-100 border-indigo-300 ring-2 ring-indigo-200"
                : ""
            }`}
          onClick={() => handleDateClick(day)}
        >
          <div className="flex justify-between items-start mb-1">
            <span
              className={`text-sm font-medium rounded-full w-6 h-6 flex items-center justify-center
              ${isToday ? "bg-blue-500 text-white" : ""}
              ${isSelected && !isToday ? "bg-indigo-600 text-white" : ""}`}
            >
              {day}
            </span>
            {dateSessions.length > 0 && (
              <span className="bg-indigo-500 text-white text-xs px-1.5 py-0.5 rounded-full font-medium">
                {dateSessions.length}
              </span>
            )}
          </div>

          <div className="space-y-1">
            {dateSessions.slice(0, 2).map((session, index) => (
              <div
                key={session._id || index}
                className={`text-xs p-1 rounded border-l-2 truncate ${getStatusColor(
                  session.status
                )}`}
              >
                <div className="flex items-center gap-1">
                  {session.type === "online" ? (
                    <Video className="w-3 h-3" />
                  ) : (
                    <MapPin className="w-3 h-3" />
                  )}
                  <span>{session.startTime}</span>
                </div>
              </div>
            ))}
            {dateSessions.length > 2 && (
              <div className="text-xs text-gray-500 font-medium">
                +{dateSessions.length - 2} more
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

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
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Calculate stats from actual data
  const totalClasses = sessions.length;
  const completedClasses = sessions.filter(
    (s) => s.status === "completed"
  ).length;
  const scheduledClasses = sessions.filter(
    (s) => s.status === "scheduled"
  ).length;
  const progressPercentage =
    totalClasses > 0 ? Math.round((completedClasses / totalClasses) * 100) : 0;

  // Get upcoming classes
  const upcomingClasses = sessions
    .filter((session) => {
      const sessionDate = new Date(session.classDate);
      const today = new Date();
      return sessionDate >= today && session.status === "scheduled";
    })
    .sort((a, b) => new Date(a.classDate) - new Date(b.classDate))
    .slice(0, 3);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading class schedule...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Show simple no classes message when no sessions exist
  if (sessions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Class Schedule
                </h1>
                <p className="text-gray-600">
                  Track your child's learning journey
                </p>
              </div>

              {showScheduleButton ? (
                <button
                  onClick={handleRescheduleClass}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <CalendarPlus className="w-5 h-5" />
                  Reschedule Class
                </button>
              ) : (
                <button
                  onClick={handleScheduleClass}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <CalendarPlus className="w-5 h-5" />
                  Schedule Class
                </button>
              )}
            </div>
          </div>

          {/* No Classes Message */}
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center max-w-md px-4">
              <div className="mb-6">
                <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-10 h-10 text-gray-400" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                No Classes Scheduled
              </h3>
              <p className="text-gray-600 mb-6">
                You don't have any classes scheduled at the moment. Get started
                by scheduling your class!
              </p>
              {!showScheduleButton && (
                <button
                  onClick={handleScheduleClass}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
                >
                  <CalendarPlus className="w-5 h-5" />
                  Schedule Your First Class
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show full calendar interface when sessions exist
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Class Schedule
              </h1>
              <p className="text-gray-600">
                Track your child's learning journey
              </p>
            </div>

            {showScheduleButton ? (
              <button
                onClick={handleRescheduleClass}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl"
              >
                <CalendarPlus className="w-5 h-5" />
                Edit Class
              </button>
            ) : (
              <button
                onClick={handleScheduleClass}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl"
              >
                <CalendarPlus className="w-5 h-5" />
                Schedule Class
              </button>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {totalClasses}
                </p>
                <p className="text-sm text-gray-600">Total Classes</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {completedClasses}
                </p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-3">
              <div className="bg-amber-100 p-2 rounded-lg">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {scheduledClasses}
                </p>
                <p className="text-sm text-gray-600">Upcoming</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {progressPercentage}%
                </p>
                <p className="text-sm text-gray-600">Progress</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              {/* Calendar Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span>Class Calendar</span>
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setViewMode("month")}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        viewMode === "month"
                          ? "bg-white text-indigo-600"
                          : "bg-indigo-500 hover:bg-indigo-400"
                      }`}
                    >
                      <Grid className="w-4 h-4 inline mr-1" />
                      Month
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        viewMode === "list"
                          ? "bg-white text-indigo-600"
                          : "bg-indigo-500 hover:bg-indigo-400"
                      }`}
                    >
                      <List className="w-4 h-4 inline mr-1" />
                      List
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => navigateMonth(-1)}
                      className="p-2 hover:bg-indigo-500 rounded-lg transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="font-semibold text-lg min-w-[200px] text-center">
                      {months[currentDate.getMonth()]}{" "}
                      {currentDate.getFullYear()}
                    </span>
                    <button
                      onClick={() => navigateMonth(1)}
                      className="p-2 hover:bg-indigo-500 rounded-lg transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="text-sm bg-indigo-500 px-3 py-1.5 rounded-lg">
                    Selected:{" "}
                    {selectedDate.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </div>

              {/* Status Legend */}
              <div className="bg-gray-50 px-6 py-3 border-b flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span>Scheduled</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>Completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <span>Rescheduled</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span>Cancelled</span>
                </div>
              </div>

              {/* Calendar Grid or List View */}
              {viewMode === "month" ? (
                <div className="grid grid-cols-7">
                  {daysOfWeek.map((day) => (
                    <div
                      key={day}
                      className="py-3 text-center font-semibold text-gray-700 border-b border-gray-200 bg-gray-50"
                    >
                      {day}
                    </div>
                  ))}
                  {renderCalendarDays()}
                </div>
              ) : (
                <div className="p-6 max-h-96 overflow-y-auto">
                  <div className="mb-4 flex items-center gap-3">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
                    >
                      <option value="all">All Statuses</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="completed">Completed</option>
                      <option value="rescheduled">Rescheduled</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  {sessions
                    .filter(
                      (session) =>
                        statusFilter === "all" ||
                        session.status === statusFilter
                    )
                    .map((session) => (
                      <div
                        key={session._id}
                        className={`p-4 mb-3 rounded-xl border-l-4 shadow-sm transition-all hover:shadow-md ${getStatusColor(
                          session.status
                        )}`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-semibold text-lg mb-1">
                              Session {session.sessionNumber}
                            </div>
                            <div className="text-sm text-gray-600 mb-2">
                              {new Date(session.classDate).toLocaleDateString(
                                "en-US",
                                {
                                  weekday: "long",
                                  month: "long",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </div>
                            <div className="text-sm font-medium text-gray-700">
                              {session.program} - {session.level}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div
                              className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(
                                session.status
                              )}`}
                            >
                              {getStatusIcon(session.status)}
                              <span className="capitalize">
                                {session.status}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span>{session.startTime}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-500" />
                            <span>{session.coach}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {session.type === "online" ? (
                              <Video className="w-4 h-4 text-gray-500" />
                            ) : (
                              <MapPin className="w-4 h-4 text-gray-500" />
                            )}
                            <span className="capitalize">
                              {session.type} Class
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            <span className="truncate">{session.center}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Classes */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-600" />
                Upcoming Classes
              </h3>

              {upcomingClasses.length > 0 ? (
                <div className="space-y-4">
                  {upcomingClasses.map((session) => (
                    <div
                      key={session._id}
                      className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium text-gray-900">
                            Session {session.sessionNumber}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(session.classDate).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </p>
                        </div>
                        {session.type === "online" ? (
                          <Video className="w-4 h-4 text-blue-600" />
                        ) : (
                          <MapPin className="w-4 h-4 text-green-600" />
                        )}
                      </div>

                      <div className="text-sm text-gray-600 mb-3">
                        <p>{session.startTime}</p>
                        <p>{session.coach}</p>
                        <p className="text-xs text-gray-500">
                          {session.program} - {session.level}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-4 text-gray-500">
                  <Calendar className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">No upcoming classes</p>
                </div>
              )}
            </div>

            {/* Selected Date Details */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {selectedDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </h3>

              {filteredSessions.length > 0 ? (
                <div className="space-y-4">
                  {filteredSessions.map((session) => (
                    <div
                      key={session._id}
                      className={`p-4 rounded-lg border-l-4 ${getStatusColor(
                        session.status
                      )}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">
                          Session {session.sessionNumber}
                        </h4>
                        <div
                          className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(
                            session.status
                          )}`}
                        >
                          {getStatusIcon(session.status)}
                          <span className="capitalize">{session.status}</span>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{session.startTime}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>{session.coach}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          <span>{session.program}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {session.type === "online" ? (
                            <Video className="w-4 h-4" />
                          ) : (
                            <MapPin className="w-4 h-4" />
                          )}
                          <span className="capitalize">
                            {session.type} Class
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-4 text-gray-500">
                  <Calendar className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">No classes scheduled for this date</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassScheduleCalendar;
