import React, { useEffect, useState } from "react";
import boyAvatar from "../../../../assets/boyavatar.avif";
import girlAvatar from "../../../../assets/girlavatar.jpg";
import {
  getMyKidData,
  getParentName,
  updateParentName,
} from "../../../../api/service/parent/ParentService";
import { useNavigate } from "react-router-dom";
import { ChevronRight, UserPlus } from "lucide-react";

const NameUpdateModal = ({
  showNameModal,
  setIsDefaultName,
  newParentName,
  setNewParentName,
  handleNameSubmit,
  nameUpdateLoading,
}) => {
  if (!showNameModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">
          Update Your Name
        </h2>
        <p className="text-slate-600 mb-4">
          Please enter your name to personalize your experience.
        </p>
        <input
          type="text"
          value={newParentName}
          onChange={(e) => setNewParentName(e.target.value)}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Enter your name"
          autoFocus
        />
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setIsDefaultName(false)}
            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleNameSubmit}
            className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors disabled:opacity-50"
            disabled={nameUpdateLoading || !newParentName.trim()}
          >
            {nameUpdateLoading ? "Updating..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

const ParentDashboard = () => {
  const navigate = useNavigate();
  const parentId = localStorage.getItem("parentId");
  const [selectedChild, setSelectedChild] = useState(0);
  const [childrenData, setChildrenData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [parentName, setParentName] = useState("");
  const [showNameModal, setShowNameModal] = useState(false);
  const [newParentName, setNewParentName] = useState("");
  const [nameUpdateLoading, setNameUpdateLoading] = useState(false);
  const [isDefaultName, setIsDefaultName] = useState(false);

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
    const fetchParentName = async () => {
      try {
        const response = await getParentName(parentId);
        console.log(response);
        if (response.status === 200) {
          setParentName(response.data.parentName);
          setIsDefaultName(response.data.isDefaultName);
        }
      } catch (error) {
        console.error("Error fetching parent name:", error);
      }
    };

    fetchParentName();
  }, [parentId]);

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
            const enquiryStatus = kid.enquiryStatus || "Pending";

            // Format demo class info if available
            const demoClassInfo = kid.demoClass
              ? formatDemoClassInfo(kid.demoClass)
              : null;

            // Create default stats based on enquiry status and demo status
            let stats = {};
            let attendance = {};
            let recentAchievements = [];

            if (enquiryStatus === "Active") {
              // Full dashboard data for active enquiries (enrolled students)
              stats = {
                level: program.level || "Beginner",
                progress: 75,
                streak: 8,
                totalGames: program.program === "Chess" ? 32 : 0,
                wins: program.program === "Chess" ? 20 : 0,
                avgTime: program.program === "Rubik's Cube" ? "1:35" : "",
                bestTime: program.program === "Rubik's Cube" ? "1:15" : "",
                timeSpent: "18h",
                nextMilestone:
                  program.program === "Chess"
                    ? "Learn advanced tactics"
                    : "Master OLL algorithms",
              };

              attendance = {
                total: 20,
                attended: 16,
                missed: 4,
                remaining: 8,
                percentage: 80,
                nextClass: demoClassInfo
                  ? demoClassInfo.displayText
                  : "Tomorrow, 4:00 PM",
              };

              recentAchievements = [
                {
                  title:
                    program.program === "Chess"
                      ? "Won Tournament Match!"
                      : "Sub 90-second Solve",
                  date: "2 days ago",
                  icon: program.program === "Chess" ? "♟️" : "🎲",
                  color: "bg-purple-100",
                },
                {
                  title: "8-day Practice Streak",
                  date: "Today",
                  icon: "🔥",
                  color: "bg-orange-100",
                },
                {
                  title:
                    program.program === "Chess"
                      ? "Mastered Knight Forks"
                      : "Learned F2L Method",
                  date: "3 days ago",
                  icon: "📚",
                  color: "bg-blue-100",
                },
              ];
            } else if (
              demoStatus === "Conducted" &&
              enquiryStatus === "Pending"
            ) {
              // Demo conducted but not enrolled - show demo results
              stats = {
                level: program.level || "Beginner",
                progress: 35,
                streak: 2,
                totalGames: program.program === "Chess" ? 5 : 0,
                wins: program.program === "Chess" ? 3 : 0,
                avgTime: program.program === "Rubik's Cube" ? "2:30" : "",
                bestTime: program.program === "Rubik's Cube" ? "2:15" : "",
                timeSpent: "3h",
                nextMilestone: "Complete enrollment to continue",
              };

              attendance = {
                total: 1,
                attended: 1,
                missed: 0,
                remaining: 0,
                percentage: 100,
                nextClass: "Complete enrollment to schedule next class",
              };

              recentAchievements = [
                {
                  title: "Demo Class Completed!",
                  date: "Recently",
                  icon: "🎉",
                  color: "bg-green-100",
                },
                {
                  title:
                    program.program === "Chess"
                      ? "Learned Basic Moves"
                      : "First Cube Solve",
                  date: "In demo class",
                  icon: program.program === "Chess" ? "♟️" : "🎲",
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
              enquiryStatus,
              demoClassInfo,
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
    navigate("/parent/add-kid/true");
  };

  // Navigation handlers for the icon buttons
  const handleNavigateToDemo = (kidId) => {
    navigate(`/parent/kid/demo-class-shedule/${kidId}`);
  };

  const handleNameSubmit = async () => {
    if (!newParentName.trim()) return;

    setNameUpdateLoading(true);
    try {
      const response = await updateParentName(parentId, newParentName);
      if (response.status === 200) {
        setParentName(newParentName);
        setIsDefaultName(false);
        setShowNameModal(false);
      }
    } catch (error) {
      console.error("Error updating parent name:", error);
    } finally {
      setNameUpdateLoading(false);
    }
  };

  const handleNavigateToProgram = (kidId) => {
    navigate(`/parent/kid/demo-class-shedule/${kidId}`);
  };

  // NEW: Handle enrollment navigation
  const handleEnrollNow = (kidId) => {
    navigate(`/parent-package-selection/${kidId}`);
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
        <NameUpdateModal
          showNameModal={isDefaultName}
          setIsDefaultName={setIsDefaultName}
          newParentName={newParentName}
          setNewParentName={setNewParentName}
          handleNameSubmit={handleNameSubmit}
          nameUpdateLoading={nameUpdateLoading}
        />
        <div className="bg-white rounded-lg shadow-lg p-6 text-center max-w-lg mx-auto">
          <div className="bg-purple-100 w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center group hover:scale-110 transition-transform duration-300">
            <UserPlus className="w-6 h-6 text-primary group-hover:rotate-12 transition-transform" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Begin Your Child's Journey
          </h3>
          <p className="text-gray-600 mb-4 text-sm max-w-md mx-auto">
            Transform your child's potential into mastery. Start their chess
            adventure today.
          </p>
          <button
            onClick={() => navigate("/parent/add-kid/true")}
            className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-primary hover:from-primary hover:to-primary text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <UserPlus className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
            Add Your Champion
            <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    );
  }

  const selectedChildData = childrenData[selectedChild];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-4 md:p-6">
      {/* Header Section */}
      <NameUpdateModal
        showNameModal={isDefaultName}
        setIsDefaultName={setIsDefaultName}
        newParentName={newParentName}
        setNewParentName={setNewParentName}
        handleNameSubmit={handleNameSubmit}
        nameUpdateLoading={nameUpdateLoading}
      />
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

          {/* Conditional second card based on enquiry status */}
          {selectedChildData.enquiryStatus === "Active" ? (
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
              <div className="text-sm text-slate-500">Enrollment Status</div>
              <div className="font-semibold text-slate-700 mt-1">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active Student
                </span>
              </div>
            </div>
          ) : (
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
                        selectedChildData.demoStatus === "Conducted"
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
          )}

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

      {/* Conditional Main Content based on Status */}
      {selectedChildData.enquiryStatus === "Active" ? (
        <ActiveStudentDashboard childData={selectedChildData} />
      ) : selectedChildData.demoStatus === "Conducted" &&
        selectedChildData.enquiryStatus === "Pending" ? (
        <DemoConductedEnrollmentView
          childData={selectedChildData}
          handleEnrollNow={handleEnrollNow}
        />
      ) : selectedChildData.demoStatus === "Pending" ? (
        <DemoPendingView childData={selectedChildData} navigate={navigate} />
      ) : selectedChildData.demoStatus === "Scheduled" ? (
        <DemoScheduledView childData={selectedChildData} />
      ) : (
        <CompleteDashboardView childData={selectedChildData} />
      )}
    </div>
  );
};

// NEW: Demo Conducted with Enrollment Pending View
const DemoConductedEnrollmentView = ({ childData, handleEnrollNow }) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    {/* Main Content */}
    <div className="lg:col-span-2 space-y-6">
      {/* Demo Results Card */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">🎉</span>
          <h3 className="text-lg font-semibold text-slate-800">
            Demo Class Completed Successfully!
          </h3>
        </div>

        {/* Demo Class Details */}
        {childData.demoClassInfo && (
          <div className="bg-green-50 rounded-lg p-6 mb-6">
            <div className="flex items-start gap-4">
              <span className="text-3xl">✅</span>
              <div className="flex-1">
                <h4 className="font-semibold text-slate-800 text-lg mb-3">
                  Demo Class Details
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-sm text-slate-600">Program</div>
                    <div className="font-medium text-slate-800 mt-1 flex items-center gap-2">
                      <span className="text-xl">
                        {childData.program === "Chess" ? "♟️" : "🎲"}
                      </span>
                      {childData.demoClassInfo.program}
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4">
                    <div className="text-sm text-slate-600">Level</div>
                    <div className="font-medium text-slate-800 mt-1">
                      {childData.demoClassInfo.level}
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4">
                    <div className="text-sm text-slate-600">Class Time</div>
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
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enrollment Call to Action */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h4 className="text-xl font-semibold mb-2">
                Ready to Start the Learning Journey?
              </h4>
              <p className="text-indigo-100 mb-4">
                {childData.name} showed great potential in the demo class!
                Choose a package to continue learning and unlock their full
                potential.
              </p>
            </div>
            <button
              onClick={() => handleEnrollNow(childData.id)}
              className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors whitespace-nowrap ml-4"
            >
              Enroll Now
            </button>
          </div>
        </div>
      </div>
    </div>

    {/* Sidebar */}
    <div className="space-y-6">
      {/* Recent Achievements */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Demo Achievements
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

      {/* Next Steps */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          What's Next?
        </h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
            <span className="text-2xl">1️⃣</span>
            <div>
              <div className="font-medium text-slate-800">Choose Package</div>
              <div className="text-sm text-slate-600">
                Select the perfect learning plan for {childData.name}
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
            <span className="text-2xl">2️⃣</span>
            <div>
              <div className="font-medium text-slate-800">Start Classes</div>
              <div className="text-sm text-slate-600">
                Begin regular learning sessions with expert coaches
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
            <span className="text-2xl">3️⃣</span>
            <div>
              <div className="font-medium text-slate-800">Track Progress</div>
              <div className="text-sm text-slate-600">
                Monitor achievements and skill development
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Package Highlights */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Package Benefits
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-green-500">✓</span>
            <span className="text-sm text-slate-700">One-on-one coaching</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-green-500">✓</span>
            <span className="text-sm text-slate-700">Flexible scheduling</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-green-500">✓</span>
            <span className="text-sm text-slate-700">Progress tracking</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-green-500">✓</span>
            <span className="text-sm text-slate-700">
              Interactive learning tools
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-green-500">✓</span>
            <span className="text-sm text-slate-700">Regular assessments</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Enhanced Active Student Dashboard with Class Statistics
const ActiveStudentDashboard = ({ childData }) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    {/* Main Dashboard Section */}
    <div className="lg:col-span-2 space-y-6">
      {/* Class Statistics - Enhanced for Active Students */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📊</span>
            <h3 className="text-lg font-semibold text-slate-800">
              Class Statistics
            </h3>
          </div>
          <span className="text-sm font-medium text-indigo-600">
            {childData.attendance.percentage}% Attendance
          </span>
        </div>

        {/* Enhanced Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4 text-center hover:bg-blue-100 transition-colors">
            <div className="text-2xl font-bold text-blue-600">
              {childData.attendance.total}
            </div>
            <div className="text-sm text-blue-600 font-medium">
              Total Classes
            </div>
            <div className="text-xs text-blue-500 mt-1">Scheduled sessions</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center hover:bg-green-100 transition-colors">
            <div className="text-2xl font-bold text-green-600">
              {childData.attendance.attended}
            </div>
            <div className="text-sm text-green-600 font-medium">Attended</div>
            <div className="text-xs text-green-500 mt-1">
              Completed successfully
            </div>
          </div>
          <div className="bg-red-50 rounded-lg p-4 text-center hover:bg-red-100 transition-colors">
            <div className="text-2xl font-bold text-red-600">
              {childData.attendance.missed}
            </div>
            <div className="text-sm text-red-600 font-medium">Missed</div>
            <div className="text-xs text-red-500 mt-1">Absent sessions</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center hover:bg-purple-100 transition-colors">
            <div className="text-2xl font-bold text-purple-600">
              {childData.attendance.remaining}
            </div>
            <div className="text-sm text-purple-600 font-medium">Remaining</div>
            <div className="text-xs text-purple-500 mt-1">Classes left</div>
          </div>
        </div>

        {/* Attendance Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-slate-600">Attendance Rate</span>
            <span className="text-sm font-medium text-slate-700">
              {childData.attendance.percentage}%
            </span>
          </div>
          <div className="h-3 bg-slate-100 rounded-full">
            <div
              className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full transition-all duration-500"
              style={{ width: `${childData.attendance.percentage}%` }}
            />
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Great attendance record! Keep it up!
          </div>
        </div>
      </div>

      {/* Learning Progress */}
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
              {childData.stats.wins} wins / {childData.stats.totalGames} games
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
                className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${childData.stats.progress}%` }}
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
                  Keep practicing daily to maintain your streak
                </div>
              </div>
            </div>
          </div>

          {/* Time Spent Learning */}
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-600">Total Time Spent</div>
                <div className="font-medium text-slate-800 mt-1">
                  {childData.stats.timeSpent}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-slate-600">Next Milestone</div>
                <div className="font-medium text-slate-800 mt-1">
                  {childData.stats.nextMilestone}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Sidebar */}
    <div className="space-y-6">
      {/* Recent Achievements */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Recent Achievements
        </h3>
        <div className="space-y-3">
          {childData.recentAchievements.length > 0 ? (
            childData.recentAchievements.map((achievement, index) => (
              <div
                key={index}
                className={`flex items-center gap-4 p-3 ${achievement.color} rounded-lg hover:shadow-sm transition-shadow`}
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

      {/* Quick Stats */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Quick Stats
        </h3>
        <div className="space-y-3">
          {childData.program === "Chess" && (
            <>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Total Games</span>
                <span className="font-medium text-slate-800">
                  {childData.stats.totalGames}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Games Won</span>
                <span className="font-medium text-slate-800 text-green-600">
                  {childData.stats.wins}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Win Rate</span>
                <span className="font-medium text-slate-800">
                  {Math.round(
                    (childData.stats.wins / childData.stats.totalGames) * 100
                  )}
                  %
                </span>
              </div>
            </>
          )}
          {childData.program === "Rubik's Cube" && (
            <>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Best Time</span>
                <span className="font-medium text-slate-800 text-green-600">
                  {childData.stats.bestTime}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Average Time</span>
                <span className="font-medium text-slate-800">
                  {childData.stats.avgTime}
                </span>
              </div>
            </>
          )}
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-600">Practice Streak</span>
            <span className="font-medium text-slate-800 text-orange-600">
              {childData.stats.streak} days
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// View for when demo is pending
const DemoPendingView = ({ childData, navigate }) => (
  <div className="space-y-6">
    {/* Side by Side Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Schedule Demo Class Card */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 text-center">
        <div className="mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📅</span>
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-3">
            Schedule Demo Class
          </h3>
          <p className="text-slate-600 mb-6">
            Book a free demo class for {childData.name} to experience our
            interactive chess learning platform.
          </p>
          <div className="space-y-3">
            <button
              className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
              onClick={() =>
                navigate(`/parent/kid/demo-class-shedule/${childData.id}`)
              }
            >
              Schedule Demo Class
            </button>
            <div className="text-sm text-slate-500">
              Free • 60 minutes • Interactive
            </div>
          </div>
        </div>
      </div>

      {/* Choose Package Card */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 text-center">
        <div className="mb-4">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📦</span>
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-3">
            Choose Package
          </h3>
          <p className="text-slate-600 mb-6">
            Select the perfect chess learning package tailored to{" "}
            {childData.name}'s skill level and goals.
          </p>
          <div className="space-y-3">
            <button
              className="w-full px-6 py-3 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 transition-colors"
              onClick={() => navigate(`/parent-kid-package-selection`)}
            >
              Choose Package
            </button>
            <div className="text-sm text-slate-500">
              Multiple options • Flexible pricing
            </div>
          </div>
        </div>
      </div>
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
                        {childData?.classInfo?.nextClassDate}
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4">
                      <div className="text-sm text-slate-600">Time</div>
                      <div className="font-medium text-slate-800 mt-1">
                        {childData?.demoClassInfo.classTime}
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
