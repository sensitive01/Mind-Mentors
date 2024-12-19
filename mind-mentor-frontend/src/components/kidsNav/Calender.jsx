import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedClass, setSelectedClass] = useState(null);

  useEffect(()=>{

  },[])


  const demoClassSchedule = {
   
    "2024-12-15": [
      {
        id: 1,
        title: "Chess",
        time: "09:00 - 10:30",
        instructor: "Aswin",
        status: "completed",
        attendance: "Present",
        topics: ["Chess"],
        recording: "math_101_rec_15.mp4"
      },
      {
        id: 2,
        title: "Chess",
        time: "11:00 - 12:30",
        instructor: "Prof. Johnson",
        status: "completed",
        topics: ["Chess"],
        recording: "math_101_rec_15.mp4",
      }
    ],
    "2024-12-19": [
      {
        id: 3,
        title: "Chess",
        time: "14:00 - 15:30",
        instructor: "Dr. White",
        status: "live",
        topics: ["Chess"],
        meetingLink: "https://meet.zoom.us/j/123456",
      }
    ],
    "2024-12-20": [
      {
        id: 4,
        title: "Chess",
        time: "10:00 - 11:30",
        instructor: "Dr. Green",
        status: "upcoming",
        attendance: "28/30",
        topics: ["Chess"],
        preReadingMaterial: "Chapter 5-6"
      }
    ]
  };

  const statusStyles = {
    completed: {
      container: "bg-gray-100 border-l-4 border-gray-500",
      dot: "bg-gray-500"
    },
    live: {
      container: "bg-green-50 border-l-4 border-green-500",
      dot: "bg-green-500 animate-pulse"
    },
    upcoming: {
      container: "bg-blue-50 border-l-4 border-blue-500",
      dot: "bg-blue-500"
    }
  };

  const getMonthStart = () => {
    return new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  };

  const getMonthEnd = () => {
    return new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  };

  const generateCalendarDays = () => {
    const start = getMonthStart();
    const end = getMonthEnd();
    const days = [];
    const padding = start.getDay();

    for (let i = 0; i < padding; i++) {
      days.push(null);
    }

    for (let i = 1; i <= end.getDate(); i++) {
      days.push(i);
    }

    return days;
  };

  const formatDateKey = (day) => {
    return `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const getClassesForDay = (day) => {
    const dateKey = formatDateKey(day);
    return demoClassSchedule[dateKey] || [];
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleClassClick = (classInfo) => {
    setSelectedClass(classInfo);
  };

  const handleCloseDetails = () => {
    setSelectedClass(null);
  };

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const calendarDays = generateCalendarDays();

  return (
    <div className="max-w-6xl mx-auto">
      {/* Calendar Header */}
      <div className="bg-white rounded-t-lg shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-100 rounded">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-semibold">
              {currentDate.toLocaleString("default", { month: "long" })} {currentDate.getFullYear()}
            </h2>
            <button onClick={handleNextMonth} className="p-2 hover:bg-gray-100 rounded">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-gray-500 mr-2"></div>
              <span>Completed</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse mr-2"></div>
              <span>Live</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
              <span>Upcoming</span>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white shadow rounded-b-lg">
        <div className="grid grid-cols-7 border-b">
          {daysOfWeek.map((day) => (
            <div key={day} className="p-4 text-center font-medium text-gray-600">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {calendarDays.map((day, index) => {
            const isCurrentMonth = day !== null;
            const classes = isCurrentMonth ? getClassesForDay(day) : [];
            const isToday = isCurrentMonth && 
              day === new Date().getDate() && 
              currentDate.getMonth() === new Date().getMonth() && 
              currentDate.getFullYear() === new Date().getFullYear();

            return (
              <div
                key={index}
                className={`min-h-[120px] p-2 border-b border-r ${
                  isCurrentMonth ? "bg-white" : "bg-gray-50"
                } ${isToday ? "bg-blue-50" : ""}`}
              >
                {isCurrentMonth && (
                  <>
                    <div className={`text-sm mb-1 ${
                      isToday ? "font-bold text-blue-600" : "text-gray-600"
                    }`}>
                      {day}
                    </div>
                    <div className="space-y-1">
                      {classes.map((classInfo) => (
                        <div
                          key={classInfo.id}
                          onClick={() => handleClassClick(classInfo)}
                          className={`${
                            statusStyles[classInfo.status].container
                          } p-2 rounded cursor-pointer text-sm transition-colors duration-200 hover:opacity-80`}
                        >
                          <div className="font-medium">{classInfo.title}</div>
                          <div className="text-xs text-gray-600 mt-1">{classInfo.time}</div>
                          <div className="flex items-center mt-1">
                            <div className={`w-2 h-2 rounded-full ${
                              statusStyles[classInfo.status].dot
                            } mr-1`}></div>
                            <span className="text-xs capitalize">{classInfo.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Class Details Modal */}
      {selectedClass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold">{selectedClass.title}</h3>
              <button
                onClick={handleCloseDetails}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-600">Time</div>
                <div>{selectedClass.time}</div>
              </div>
              
              <div>
                <div className="text-sm text-gray-600">Instructor</div>
                <div>{selectedClass.instructor}</div>
              </div>
              
              <div>
                <div className="text-sm text-gray-600">Status</div>
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full ${
                    statusStyles[selectedClass.status].dot
                  } mr-2`}></div>
                  <span className="capitalize">{selectedClass.status}</span>
                </div>
              </div>

              {selectedClass.status === "completed" && (
                <>
                  <div>
                    <div className="text-sm text-gray-600">Attendance</div>
                    <div>{selectedClass.attendance}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Recording</div>
                    <div className="text-blue-600 cursor-pointer hover:underline">
                      View Recording
                    </div>
                  </div>
                </>
              )}

              {selectedClass.status === "live" && (
                <div>
                  <div className="text-sm text-gray-600">Meeting Link</div>
                  <div className="text-blue-600 cursor-pointer hover:underline">
                    Join Class
                  </div>
                </div>
              )}

              {selectedClass.status === "upcoming" && (
                <div>
                  <div className="text-sm text-gray-600">Pre-reading Material</div>
                  <div>{selectedClass.preReadingMaterial}</div>
                </div>
              )}

              <div>
                <div className="text-sm text-gray-600">Topics</div>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedClass.topics.map((topic, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 px-2 py-1 rounded text-sm"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;