import React, { useState } from "react";
import boyAvatar from "../../../../assets/boyavatar.avif";
import girlAvatar from "../../../../assets/girlavatar.jpg";

const ParentDashboard = () => {
  const [selectedChild, setSelectedChild] = useState(0);
  const children = [
    {
      id: 1,
      name: "Alex",
      avatar: boyAvatar,
      classType: "chess", // Only chess class
      attendance: {
        total: 16,
        attended: 9,
        nextClass: "Today, 4:00 PM",
      },
      stats: {
        level: "Beginner Knight",
        progress: 65,
        streak: 5,
        totalGames: 24,
        wins: 15,
        timeSpent: "12h",
        nextMilestone: "Learn castle move",
      },
      recentAchievements: [
        {
          title: "First Checkmate!",
          date: "2 days ago",
          icon: "♟️",
          color: "bg-purple-100",
        },
        {
          title: "5-day Practice Streak",
          date: "Today",
          icon: "🔥",
          color: "bg-orange-100",
        },
        {
          title: "Completed Pawn Lesson",
          date: "Yesterday",
          icon: "📚",
          color: "bg-blue-100",
        },
      ],
    },
    {
      id: 2,
      name: "Sarah",
      avatar: girlAvatar,
      classType: "rubiks", // Only Rubik's cube class
      attendance: {
        total: 16,
        attended: 12,
        nextClass: "Tomorrow, 3:00 PM",
      },
      stats: {
        level: "F2L Explorer",
        progress: 75,
        streak: 4,
        avgTime: "1:45",
        bestTime: "1:20",
        nextMilestone: "Learn advanced F2L",
      },
      recentAchievements: [
        {
          title: "Sub 2-minute Solve",
          date: "Today",
          icon: "🎲",
          color: "bg-blue-100",
        },
        {
          title: "4-day Practice Streak",
          date: "Today",
          icon: "🔥",
          color: "bg-orange-100",
        },
        {
          title: "Mastered White Cross",
          date: "Yesterday",
          icon: "📚",
          color: "bg-green-100",
        },
      ],
    },
  ];

  const selectedChildData = children[selectedChild];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-4 md:p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold text-slate-800">Learning Dashboard</h1>
          <div className="flex gap-3">
            {children.map((child, index) => (
              <button
                key={child.id}
                onClick={() => setSelectedChild(index)}
                className={`flex items-center gap-3 px-5 py-2.5 rounded-full transition-all ${
                  selectedChild === index
                    ? "bg-indigo-500 text-white shadow-lg shadow-indigo-200"
                    : "bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                <img src={child.avatar} alt={child.name} className="w-8 h-8 rounded-full" />
                <span className="font-medium">{child.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Stats with Attendance */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
            <div className="text-sm text-slate-500">Class Type</div>
            <div className="font-semibold text-slate-700 mt-1 flex items-center gap-2">
              {selectedChildData.classType === "chess" ? (
                <>
                  <span className="text-xl">♟️</span> Chess Class
                </>
              ) : (
                <>
                  <span className="text-xl">🎲</span> Rubik's Cube Class
                </>
              )}
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
            <div className="text-sm text-slate-500">Class Attendance</div>
            <div className="font-semibold text-slate-700 mt-1">
              {selectedChildData.attendance.attended}/{selectedChildData.attendance.total} Classes
              <div className="mt-1 h-1.5 bg-slate-100 rounded-full">
                <div
                  className="h-full bg-indigo-500 rounded-full"
                  style={{
                    width: `${(selectedChildData.attendance.attended / selectedChildData.attendance.total) * 100}%`,
                  }}
                />
              </div>
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl">
                  {selectedChildData.classType === "chess" ? "♟️" : "🎲"}
                </span>
                <h3 className="text-lg font-semibold text-slate-800">
                  Learning Progress
                </h3>
              </div>
              {selectedChildData.classType === "chess" ? (
                <span className="text-sm font-medium text-indigo-600">
                  {selectedChildData.stats.wins} wins
                </span>
              ) : (
                <span className="text-sm font-medium text-indigo-600">
                  Best time: {selectedChildData.stats.bestTime}
                </span>
              )}
            </div>

            <div className="space-y-6">
              {/* Progress Bar */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-slate-600">Progress to next level</span>
                  <span className="text-sm font-medium text-slate-700">
                    {selectedChildData.stats.progress}%
                  </span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full">
                  <div
                    className="h-full bg-indigo-500 rounded-full"
                    style={{ width: `${selectedChildData.stats.progress}%` }}
                  />
                </div>
              </div>

              {/* Practice Streak */}
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🔥</span>
                  <div>
                    <div className="font-medium text-slate-800">
                      {selectedChildData.stats.streak} Day Streak!
                    </div>
                    <div className="text-sm text-slate-600">Keep practicing daily</div>
                  </div>
                </div>
              </div>

              {/* Next Milestone */}
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="text-sm text-slate-600">Next milestone</div>
                <div className="font-medium text-slate-800 mt-1">
                  {selectedChildData.stats.nextMilestone}
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
              {selectedChildData.recentAchievements.map((achievement, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-4 p-3 ${achievement.color} rounded-lg`}
                >
                  <span className="text-2xl">{achievement.icon}</span>
                  <div className="flex-1">
                    <div className="font-medium text-slate-800">{achievement.title}</div>
                    <div className="text-sm text-slate-500">{achievement.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;