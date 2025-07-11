import React, { useEffect, useState } from "react";
import boyAvatar from "../../../../assets/boyavatar.avif";
import girlAvatar from "../../../../assets/girlavatar.jpg";
import { getMyKidData } from "../../../../api/service/parent/ParentService";
import { useNavigate } from "react-router-dom"; // Assuming you're using React Router

const ParentDashboard = () => {
  const navigate = useNavigate();
  const parentId = localStorage.getItem("parentId");
  const [selectedChild, setSelectedChild] = useState(0);
  const [childrenData, setChildrenData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to calculate the next occurrence of a given day
  const getNextDateForDay = (dayName) => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const today = new Date();
    const targetDay = days.indexOf(dayName);

    if (targetDay === -1) return "Invalid day";

    const todayDay = today.getDay();
    let daysUntilTarget = targetDay - todayDay;

    // If the target day is today or has passed this week, get next week's occurrence
    if (daysUntilTarget <= 0) {
      daysUntilTarget += 7;
    }

    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + daysUntilTarget);

    return targetDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Function to format demo class info
  const formatDemoClassInfo = (demoClass) => {
    if (!demoClass) return null;

    const nextClassDate = getNextDateForDay(demoClass.day);

    return {
      ...demoClass,
      nextClassDate,
      formattedTime: demoClass.classTime,
      displayText: `${demoClass.day}, ${demoClass.classTime}`,
    };
  };

  useEffect(() => {
    const fetchMyKid = async () => {
      try {
        setLoading(true);
        const response = await getMyKidData(parentId);

        if (response.status === 200) {
          const transformedData = response.data.kidData.map((kid) => {
            // Get the first program (if exists)
            const program =
              kid.selectedProgram && kid.selectedProgram.length > 0
                ? kid.selectedProgram[0]
                : { program: "Not selected", level: "Not assigned" };

            // Determine demo status
            const demoStatus = kid.scheduleDemo?.status || "Pending";

            // Format demo class info if available
            const demoClassInfo = kid.demoClass
              ? formatDemoClassInfo(kid.demoClass)
              : null;

            // Create default stats based on demo status
            let stats = {};
            let attendance = {};
            let recentAchievements = [];

            if (demoStatus === "Completed") {
              // Full dashboard data for completed demos
              stats = {
                level: program.level || "Beginner",
                progress: 65,
                streak: 5,
                totalGames: program.program === "Chess" ? 24 : 0,
                wins: program.program === "Chess" ? 15 : 0,
                avgTime: program.program === "Rubik's Cube" ? "1:45" : "",
                bestTime: program.program === "Rubik's Cube" ? "1:20" : "",
                timeSpent: "12h",
                nextMilestone:
                  program.program === "Chess"
                    ? "Learn castle move"
                    : "Learn advanced F2L",
              };

              attendance = {
                total: 16,
                attended: 9,
                nextClass: demoClassInfo
                  ? demoClassInfo.displayText
                  : "Today, 4:00 PM",
              };

              recentAchievements = [
                {
                  title:
                    program.program === "Chess"
                      ? "First Checkmate!"
                      : "Sub 2-minute Solve",
                  date: "2 days ago",
                  icon: program.program === "Chess" ? "♟️" : "🎲",
                  color: "bg-purple-100",
                },
                {
                  title: "5-day Practice Streak",
                  date: "Today",
                  icon: "🔥",
                  color: "bg-orange-100",
                },
                {
                  title:
                    program.program === "Chess"
                      ? "Completed Pawn Lesson"
                      : "Mastered White Cross",
                  date: "Yesterday",
                  icon: "📚",
                  color: "bg-blue-100",
                },
              ];
            } else if (demoStatus === "Scheduled") {
              // Limited data for scheduled demos
              stats = {
                level: program.level || "Beginner",
                progress: 0,
                streak: 0,
                nextMilestone: "Attend first class",
              };

              attendance = {
                total: 0,
                attended: 0,
                nextClass: demoClassInfo
                  ? demoClassInfo.displayText
                  : "Demo class (Scheduled)",
              };

              recentAchievements = [
                {
                  title: "Demo Class Scheduled!",
                  date: "Coming up",
                  icon: "📅",
                  color: "bg-green-100",
                },
              ];
            } else {
              // Minimal data for pending demos
              stats = {
                level: "Not started",
                progress: 0,
                streak: 0,
                nextMilestone: "Schedule demo class",
              };

              attendance = {
                total: 0,
                attended: 0,
                nextClass: "Not scheduled yet",
              };

              recentAchievements = [];
            }

            return {
              id: kid._id,
              name: kid.kidsName,
              avatar: kid.gender === "female" ? girlAvatar : boyAvatar,
              program: program.program,
              demoStatus,
              demoClassInfo, // Add demo class info
              attendance,
              stats,
              recentAchievements,
            };
          });

          setChildrenData(transformedData);
        } else {
          console.error("Error fetching kid data:", response.message);
          setChildrenData([]);
        }
      } catch (error) {
        console.error("Error fetching kid data:", error);
        setChildrenData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMyKid();
  }, [parentId]);

  const handleAddKid = () => {
    navigate("/parent/add-kid");
  };

  // Navigation handlers for the icon buttons
  const handleNavigateToDemo = (kidId) => {
    navigate(`/parent/kid/demo-class-shedule/${kidId}`);
  };

  const handleNavigateToProgram = (kidId) => {
    navigate(`/parent/kid/demo-class-shedule/${kidId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-4 md:p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // If no children data after loading, show empty state
  if (childrenData.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-4 md:p-6 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">👶</div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            No children found
          </h2>
          <p className="text-slate-600 mb-6">
            It looks like you haven't added any children to your account yet.
          </p>
          <button
            onClick={handleAddKid}
            className="px-6 py-3 bg-indigo-500 text-white rounded-lg font-medium hover:bg-indigo-600 transition-colors"
          >
            Add Your First Child
          </button>
        </div>
      </div>
    );
  }

  const selectedChildData = childrenData[selectedChild];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-4 md:p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold text-slate-800">
            Learning Dashboard
          </h1>
          <div className="flex gap-3 items-center">
            {childrenData.map((child, index) => (
              <button
                key={child.id}
                onClick={() => setSelectedChild(index)}
                className={`flex items-center gap-3 px-5 py-2.5 rounded-full transition-all ${
                  selectedChild === index
                    ? "bg-indigo-500 text-white shadow-lg shadow-indigo-200"
                    : "bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                <img
                  src={child.avatar}
                  alt={child.name}
                  className="w-8 h-8 rounded-full"
                />
                <span className="font-medium">{child.name}</span>
              </button>
            ))}
            {/* Add Kid Button */}
            <button
              onClick={handleAddKid}
              className="flex items-center justify-center w-12 h-12 bg-white text-indigo-500 hover:bg-indigo-50 rounded-full transition-all shadow-sm border border-slate-200 hover:border-indigo-200"
              title="Add new child"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div
            className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 cursor-pointer hover:shadow-md hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-200 group"
            onClick={() => handleNavigateToProgram(selectedChildData.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-sm text-slate-500 group-hover:text-blue-600">
                  Program
                </div>
                <div className="font-semibold text-slate-700 mt-1 flex items-center gap-2 group-hover:text-blue-700">
                  {selectedChildData.program === "Chess" ? (
                    <>
                      <span className="text-xl">♟️</span> Chess Program
                    </>
                  ) : selectedChildData.program === "Rubik's Cube" ? (
                    <>
                      <span className="text-xl">🎲</span> Rubik's Cube Program
                    </>
                  ) : (
                    <>
                      <span className="text-xl">❓</span>{" "}
                      {selectedChildData.program || "Not Selected"}
                    </>
                  )}
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNavigateToProgram(selectedChildData.id);
                }}
                className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-full transition-all shadow-sm group-hover:bg-blue-200"
                title="Select/Change Program"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div
            className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 cursor-pointer hover:shadow-md hover:border-green-200 hover:bg-green-50/30 transition-all duration-200 group"
            onClick={() => handleNavigateToDemo(selectedChildData.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-sm text-slate-500 group-hover:text-green-600">
                  Demo Status
                </div>
                <div className="font-semibold text-slate-700 mt-1 group-hover:text-green-700">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedChildData.demoStatus === "Completed"
                        ? "bg-green-100 text-green-800"
                        : selectedChildData.demoStatus === "Scheduled"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {selectedChildData.demoStatus}
                  </span>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNavigateToDemo(selectedChildData.id);
                }}
                className="flex items-center justify-center w-8 h-8 bg-green-100 text-green-600 hover:bg-green-200 rounded-full transition-all shadow-sm group-hover:bg-green-200"
                title="Manage Demo Class"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
            <div className="text-sm text-slate-500">Current Level</div>
            <div className="font-semibold text-slate-700 mt-1">
              {selectedChildData.stats.level}
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
            <div className="text-sm text-slate-500">Next Class</div>
            <div className="font-semibold text-slate-700 mt-1">
              {selectedChildData.attendance.nextClass}
            </div>
          </div>
        </div>
      </div>

      {/* Conditional Main Content based on Demo Status */}
      {selectedChildData.demoStatus === "Pending" ? (
        <DemoPendingView childData={selectedChildData} navigate={navigate} />
      ) : selectedChildData.demoStatus === "Scheduled" ? (
        <DemoScheduledView childData={selectedChildData} />
      ) : (
        <CompleteDashboardView childData={selectedChildData} />
      )}
    </div>
  );
};

// View for when demo is pending
const DemoPendingView = ({ childData, navigate }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 text-center py-12">
    <div className="max-w-md mx-auto">
      <div className="text-5xl mb-6">📅</div>
      <h2 className="text-2xl font-bold text-slate-800 mb-3">
        Demo Class Not Scheduled
      </h2>
      <p className="text-slate-600 mb-6">
        The demo class for {childData.name} hasn't been scheduled yet. Once
        scheduled, you'll be able to see more details here.
      </p>
      <button
        className="px-6 py-3 bg-indigo-500 text-white rounded-lg font-medium hover:bg-indigo-600 transition-colors"
        onClick={() => navigate(`/parent/kid/demo-class/${childData.id}`)}
      >
        Schedule Demo Class
      </button>
    </div>
  </div>
);

// View for when demo is scheduled but not completed
const DemoScheduledView = ({ childData }) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div className="lg:col-span-2">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">📅</span>
          <h3 className="text-lg font-semibold text-slate-800">
            Scheduled Demo Class
          </h3>
        </div>

        <div className="space-y-6">
          {/* Demo Class Details */}
          {childData.demoClassInfo && (
            <div className="bg-blue-50 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <span className="text-3xl">🎯</span>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-800 text-lg mb-3">
                    Class Details
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4">
                      <div className="text-sm text-slate-600">
                        Next Class Date
                      </div>
                      <div className="font-medium text-slate-800 mt-1">
                        {childData.demoClassInfo.nextClassDate}
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4">
                      <div className="text-sm text-slate-600">Time</div>
                      <div className="font-medium text-slate-800 mt-1">
                        {childData.demoClassInfo.classTime}
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4">
                      <div className="text-sm text-slate-600">Coach</div>
                      <div className="font-medium text-slate-800 mt-1">
                        {childData.demoClassInfo.coachName}
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4">
                      <div className="text-sm text-slate-600">
                        Program & Level
                      </div>
                      <div className="font-medium text-slate-800 mt-1">
                        {childData.demoClassInfo.program} -{" "}
                        {childData.demoClassInfo.level}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>

    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          What to Expect
        </h3>
        <div className="space-y-3">
          {childData.program === "Chess" ? (
            <>
              <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
                <span className="text-2xl">♟️</span>
                <div className="flex-1">
                  <div className="font-medium text-slate-800">
                    Basic Chess Rules
                  </div>
                  <div className="text-sm text-slate-500">
                    Learn how pieces move
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 bg-purple-50 rounded-lg">
                <span className="text-2xl">🏆</span>
                <div className="flex-1">
                  <div className="font-medium text-slate-800">First Game</div>
                  <div className="text-sm text-slate-500">
                    Play with an instructor
                  </div>
                </div>
              </div>
            </>
          ) : childData.program === "Rubik's Cube" ? (
            <>
              <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
                <span className="text-2xl">🎲</span>
                <div className="flex-1">
                  <div className="font-medium text-slate-800">
                    Cube Notation
                  </div>
                  <div className="text-sm text-slate-500">
                    Learn basic movements
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 bg-purple-50 rounded-lg">
                <span className="text-2xl">🔄</span>
                <div className="flex-1">
                  <div className="font-medium text-slate-800">First Layer</div>
                  <div className="text-sm text-slate-500">
                    Solving techniques
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <span className="text-2xl">📝</span>
              <div className="flex-1">
                <div className="font-medium text-slate-800">Introduction</div>
                <div className="text-sm text-slate-500">Program overview</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

// View for when demo is completed (full dashboard)
const CompleteDashboardView = ({ childData }) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    {/* Progress Section */}
    <div className="lg:col-span-2">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl">
              {childData.program === "Chess" ? "♟️" : "🎲"}
            </span>
            <h3 className="text-lg font-semibold text-slate-800">
              Learning Progress
            </h3>
          </div>
          {childData.program === "Chess" ? (
            <span className="text-sm font-medium text-indigo-600">
              {childData.stats.wins} wins
            </span>
          ) : (
            <span className="text-sm font-medium text-indigo-600">
              Best time: {childData.stats.bestTime}
            </span>
          )}
        </div>

        <div className="space-y-6">
          {/* Progress Bar */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-slate-600">
                Progress to next level
              </span>
              <span className="text-sm font-medium text-slate-700">
                {childData.stats.progress}%
              </span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full">
              <div
                className="h-full bg-indigo-500 rounded-full"
                style={{ width: `${childData.stats.progress}%` }}
              />
            </div>
          </div>

          {/* Class Attendance */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-slate-600">Class Attendance</span>
              <span className="text-sm font-medium text-slate-700">
                {childData.attendance.attended}/{childData.attendance.total}{" "}
                Classes
              </span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full">
              <div
                className="h-full bg-indigo-500 rounded-full"
                style={{
                  width: `${
                    (childData.attendance.attended /
                      Math.max(childData.attendance.total, 1)) *
                    100
                  }%`,
                }}
              />
            </div>
          </div>

          {/* Practice Streak */}
          <div className="bg-orange-50 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔥</span>
              <div>
                <div className="font-medium text-slate-800">
                  {childData.stats.streak} Day Streak!
                </div>
                <div className="text-sm text-slate-600">
                  Keep practicing daily
                </div>
              </div>
            </div>
          </div>

          {/* Next Milestone */}
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="text-sm text-slate-600">Next milestone</div>
            <div className="font-medium text-slate-800 mt-1">
              {childData.stats.nextMilestone}
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Achievements Section */}
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Recent Achievements
        </h3>
        <div className="space-y-3">
          {childData.recentAchievements.length > 0 ? (
            childData.recentAchievements.map((achievement, index) => (
              <div
                key={index}
                className={`flex items-center gap-4 p-3 ${achievement.color} rounded-lg`}
              >
                <span className="text-2xl">{achievement.icon}</span>
                <div className="flex-1">
                  <div className="font-medium text-slate-800">
                    {achievement.title}
                  </div>
                  <div className="text-sm text-slate-500">
                    {achievement.date}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-6">
              <div className="text-4xl mb-3">🏆</div>
              <div className="text-slate-600">No achievements yet</div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default ParentDashboard;
