import React, { useEffect, useState } from "react";
import boyAvatar from "../../../../assets/boyavatar.avif";
import girlAvatar from "../../../../assets/girlavatar.jpg";
import {
  getEnrollementStageSteps,
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
import EnrollmentCompletionStage from "./dashboard-section/EnrollmentCompletionStage";
import DashboardCards from "./dashboard-section/DashboardCards";

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
      <div className="bg-white rounded-xl p-4 sm:p-6 max-w-md w-full mx-4">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-3 sm:mb-4">
          Update Your Name
        </h2>
        <p className="text-sm sm:text-base text-slate-600 mb-4">
          Please enter your name to personalize your experience.
        </p>
        <input
          type="text"
          value={newParentName}
          onChange={(e) => setNewParentName(e.target.value)}
          className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
          placeholder="Enter your name"
          autoFocus
        />
        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
          <button
            onClick={() => setIsDefaultName(false)}
            className="w-full sm:w-auto px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            onClick={handleNameSubmit}
            className="w-full sm:w-auto px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors disabled:opacity-50 text-sm sm:text-base"
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
  const [enrollmentStageData, setEnrollmentStageData] = useState(null);
  const [showEnrollmentStage, setShowEnrollmentStage] = useState(false);

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

  // Updated useEffect for enrollment stage data
  useEffect(() => {
    const fetchEnrollmentStageData = async () => {
      try {
        let kidId = null;

        if (childrenData.length > 0 && selectedChild < childrenData.length) {
          kidId = childrenData[selectedChild].id;
        }

        const response = await getEnrollementStageSteps(kidId);

        if (response.status === 200) {
          setEnrollmentStageData(response.data.data);
          setShowEnrollmentStage(
            !response.data.data.isEnrollmementStepCompleted
          );
        }
      } catch (error) {
        console.error("Error fetching enrollment stage data:", error);
      }
    };

    fetchEnrollmentStageData();
  }, [childrenData, selectedChild]);

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

    if (enquiryStatus === "Active") {
      if (demoAssigned && demoAssigned !== "NA") {
        return demoAssigned;
      }
      if (demoClass) {
        const demoClassInfo = formatDemoClassInfo(demoClass);
        return demoClassInfo?.displayText || "Check schedule for next class";
      }
      return "Check schedule for next class";
    }

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

    if (demoStatus === "Conducted" && enquiryStatus === "Pending") {
      return "Complete enrollment to schedule next class";
    }

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
            const program =
              kid.selectedProgram && kid.selectedProgram.length > 0
                ? kid.selectedProgram[0]
                : { program: "Not selected", level: "Not assigned" };

            const demoStatus = kid.scheduleDemo?.status || "Pending";
            const enquiryStatus = kid.enquiryStatus || "Pending";

            const demoClassInfo = kid?.demoClass
              ? formatDemoClassInfo(kid?.demoClass)
              : null;

            let stats = {};
            let attendance = {};
            let recentAchievements = [];

            if (enquiryStatus === "Active") {
              const totalClasses = kid.totalClassCount?.both || 0;
              const attendedClasses = kid.attendedClass?.both || 0;
              const absentClasses = kid.absentClass?.both || 0;
              const remainingClasses = kid.remainingClass?.both || 0;
              const canceledClasses = kid.canceledClass?.both || 0;
              const pausedClasses = kid.pausedClass?.both || 0;

              const attendancePercentage =
                totalClasses > 0
                  ? Math.round((attendedClasses / totalClasses) * 100)
                  : 0;

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

              const progressPercentage =
                totalClasses > 0
                  ? Math.round((attendedClasses / totalClasses) * 100)
                  : 0;

              stats = {
                level: program.level || "Beginner",
                progress: Math.min(progressPercentage, 100),
                streak: Math.min(attendedClasses, 15),
                totalGames:
                  program.program === "Chess" ? attendedClasses * 2 : 0,
                wins:
                  program.program === "Chess"
                    ? Math.floor(attendedClasses * 1.5)
                    : 0,
                avgTime: program.program === "Rubik's Cube" ? "1:35" : "",
                bestTime: program.program === "Rubik's Cube" ? "1:15" : "",
                timeSpent: `${Math.round(attendedClasses * 1.5)}h`,
                nextMilestone:
                  remainingClasses > 0
                    ? `Complete ${remainingClasses} more classes`
                    : program.program === "Chess"
                    ? "Learn advanced tactics"
                    : "Master advanced algorithms",
              };

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
              demoAssigned: kid.demoAssigned,
              attendance,
              stats,
              recentAchievements,
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

  const handleEnrollNow = (kidId) => {
    navigate(`/parent-package-selection/${kidId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-4 md:p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-slate-600 text-sm sm:text-base">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  // Empty state - no children added yet
  if (childrenData.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-4 sm:p-6 lg:p-8">
        <NameUpdateModal
          showNameModal={isDefaultName}
          setIsDefaultName={setIsDefaultName}
          newParentName={newParentName}
          setNewParentName={setNewParentName}
          handleNameSubmit={handleNameSubmit}
          nameUpdateLoading={nameUpdateLoading}
        />

        {/* Show Enrollment Steps when overall is false - even without kids */}
        {showEnrollmentStage && (
          <div className="mb-6 lg:mb-8">
            <EnrollmentCompletionStage enrollmentData={enrollmentStageData} />
          </div>
        )}

        {/* Empty State Card */}
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <UserPlus className="w-8 h-8 sm:w-10 sm:h-10 text-purple-600" />
            </div>

            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-800 mb-3 sm:mb-4">
              Begin Your Child's Journey
            </h3>

            <p className="text-sm sm:text-base text-slate-600 mb-6 sm:mb-8 leading-relaxed">
              Transform your child's potential into mastery. Start their chess
              adventure today.
            </p>

            <button
              onClick={() => navigate("/parent/add-kid/true")}
              className="w-full bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-semibold py-3 sm:py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-3 group transform hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base"
            >
              <UserPlus className="w-5 h-5 sm:w-6 sm:h-6" />
              <span>Add Your Champion</span>
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform duration-200" />
            </button>

            {/* Additional encouragement */}
            <div className="mt-6 pt-6 border-t border-slate-100">
              <p className="text-xs sm:text-sm text-slate-500">
                Join thousands of parents who've unlocked their child's
                potential
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const selectedChildData = childrenData[selectedChild];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-4 sm:p-6 lg:p-8">
      {/* Name Update Modal */}
      <NameUpdateModal
        showNameModal={isDefaultName}
        setIsDefaultName={setIsDefaultName}
        newParentName={newParentName}
        setNewParentName={setNewParentName}
        handleNameSubmit={handleNameSubmit}
        nameUpdateLoading={nameUpdateLoading}
      />

      {/* Dashboard Cards Section */}
      <DashboardCards
        childrenData={childrenData}
        setSelectedChild={setSelectedChild}
        selectedChild={selectedChild}
        handleAddKid={handleAddKid}
        handleNavigateToProgram={handleNavigateToProgram}
        selectedChildData={selectedChildData}
        handleNavigateToDemo={handleNavigateToDemo}
      />

      {/* Show Enrollment Steps when overall is false */}
      {showEnrollmentStage && (
        <div className="mb-6 lg:mb-8">
          <EnrollmentCompletionStage
            enrollmentData={enrollmentStageData}
            kidId={selectedChildData?.id}
          />
        </div>
      )}

      {/* Conditional Main Content based on Status */}
      <div className="space-y-6">
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
    </div>
  );
};

export default ParentDashboard;
