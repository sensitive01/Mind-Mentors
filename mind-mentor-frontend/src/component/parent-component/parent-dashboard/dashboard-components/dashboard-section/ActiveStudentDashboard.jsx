import React from "react";

const ActiveStudentDashboard = ({ childData }) => {
  return (
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
              <div className="text-xs text-blue-500 mt-1">
                Scheduled sessions
              </div>
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
              <div className="text-sm text-purple-600 font-medium">
                Remaining
              </div>
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
};

export default ActiveStudentDashboard;
