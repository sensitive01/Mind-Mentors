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
import CompleteDashboardView from "./dashboard-section/CompleteDashboardView";
import DemoConductedEnrollmentView from "./dashboard-section/DemoConductedEnrollmentView";
import ActiveStudentDashboard from "./dashboard-section/ActiveStudentDashboard";
import DemoPendingView from "./dashboard-section/DemoPendingView";
import DemoScheduledView from "./dashboard-section/DemoScheduledView";

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

  // Function to determine next class text
  const getNextClassText = (kid) => {
    const { enquiryStatus, demoStatus, demoClass, demoAssigned } = kid;

    // For active students - prioritize demoAssigned for demo classes, then regular class schedule
    if (enquiryStatus === "Active") {
      // If there's a demoAssigned and it's not "NA", use it (for demo classes)
      if (demoAssigned && demoAssigned !== "NA") {
        return demoAssigned;
      }
      // Otherwise use demo class info if available
      if (demoClass) {
        const demoClassInfo = formatDemoClassInfo(demoClass);
        return demoClassInfo?.displayText || "Check schedule for next class";
      }
      return "Check schedule for next class";
    }

    // For scheduled demos - prioritize demoAssigned if available
    if (demoStatus === "Scheduled") {
      if (demoAssigned && demoAssigned !== "NA") {
        return demoAssigned;
      }
      if (demoClass) {
        const demoClassInfo = formatDemoClassInfo(demoClass);
        return demoClassInfo?.displayText || "Demo class scheduled";
      }
      return "Demo class scheduled";
    }

    // For conducted demos
    if (demoStatus === "Conducted" && enquiryStatus === "Pending") {
      return "Complete enrollment to schedule next class";
    }

    // For pending demos
    if (demoStatus === "Pending") {
      return "Not scheduled yet";
    }

    return "Not scheduled yet";
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
            const demoClassInfo = kid?.demoClass
              ? formatDemoClassInfo(kid?.demoClass)
              : null;

            // Create stats and attendance based on enquiry status
            let stats = {};
            let attendance = {};
            let recentAchievements = [];

            if (enquiryStatus === "Active") {
              // Use REAL attendance data from API for active students
              const totalClasses = kid.totalClassCount?.both || 0;
              const attendedClasses = kid.attendedClass?.both || 0;
              const absentClasses = kid.absentClass?.both || 0;
              const remainingClasses = kid.remainingClass?.both || 0;
              const canceledClasses = kid.canceledClass?.both || 0;
              const pausedClasses = kid.pausedClass?.both || 0;

              // Calculate attendance percentage
              const attendancePercentage =
                totalClasses > 0
                  ? Math.round((attendedClasses / totalClasses) * 100)
                  : 0;

              // Real attendance object
              attendance = {
                total: totalClasses,
                attended: attendedClasses,
                missed: absentClasses,
                remaining: remainingClasses,
                canceled: canceledClasses,
                paused: pausedClasses,
                percentage: attendancePercentage,
                nextClass: getNextClassText(kid),
              };

              // Enhanced stats calculation based on progress
              const progressPercentage =
                totalClasses > 0
                  ? Math.round((attendedClasses / totalClasses) * 100)
                  : 0;

              stats = {
                level: program.level || "Beginner",
                progress: Math.min(progressPercentage, 100), // Cap at 100%
                streak: Math.min(attendedClasses, 15), // Approximate streak based on attended classes
                totalGames:
                  program.program === "Chess" ? attendedClasses * 2 : 0, // Estimate games per class
                wins:
                  program.program === "Chess"
                    ? Math.floor(attendedClasses * 1.5)
                    : 0,
                avgTime: program.program === "Rubik's Cube" ? "1:35" : "",
                bestTime: program.program === "Rubik's Cube" ? "1:15" : "",
                timeSpent: `${Math.round(attendedClasses * 1.5)}h`, // Estimate 1.5 hours per class
                nextMilestone:
                  remainingClasses > 0
                    ? `Complete ${remainingClasses} more classes`
                    : program.program === "Chess"
                    ? "Learn advanced tactics"
                    : "Master advanced algorithms",
              };

              // Dynamic achievements based on real data
              recentAchievements = [];

              if (attendedClasses > 0) {
                recentAchievements.push({
                  title: `Completed ${attendedClasses} Classes!`,
                  date: "Recently",
                  icon: "🎓",
                  color: "bg-green-100",
                });
              }

              if (attendancePercentage >= 80) {
                recentAchievements.push({
                  title: `${attendancePercentage}% Attendance Rate`,
                  date: "Excellent performance",
                  icon: "🏆",
                  color: "bg-yellow-100",
                });
              }

              if (attendedClasses >= 5) {
                recentAchievements.push({
                  title: "Consistent Learner",
                  date: "Great progress",
                  icon: "🔥",
                  color: "bg-orange-100",
                });
              }

              if (program.program === "Chess" && attendedClasses >= 3) {
                recentAchievements.push({
                  title: "Chess Tactics Mastery",
                  date: "Recent achievement",
                  icon: "♟️",
                  color: "bg-purple-100",
                });
              }

              if (program.program === "Rubik's Cube" && attendedClasses >= 3) {
                recentAchievements.push({
                  title: "Speed Solving Progress",
                  date: "Recent achievement",
                  icon: "🎲",
                  color: "bg-blue-100",
                });
              }

              // Ensure we have at least one achievement
              if (recentAchievements.length === 0) {
                recentAchievements.push({
                  title: "Learning Journey Started!",
                  date: "Keep going",
                  icon: "🌟",
                  color: "bg-blue-100",
                });
              }
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
                nextClass: getNextClassText(kid),
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
                nextClass: getNextClassText(kid),
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
                nextClass: getNextClassText(kid),
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
              demoAssigned: kid.demoAssigned, // Add demoAssigned to the transformed data
              attendance,
              stats,
              recentAchievements,
              // Add raw data for reference
              rawClassData: {
                totalClassCount: kid.totalClassCount,
                attendedClass: kid.attendedClass,
                remainingClass: kid.remainingClass,
                absentClass: kid.absentClass,
                canceledClass: kid.canceledClass,
                pausedClass: kid.pausedClass,
              },
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
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z"
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
              {selectedChildData.demoAssigned}
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

export default ParentDashboard;