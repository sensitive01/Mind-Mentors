import React from "react";

const ActiveStudentDashboard = ({ childData }) => {
  // Get raw class data for detailed display
  const rawData = childData.rawClassData;

  // Calculate additional metrics
  const completionRate =
    childData.attendance.total > 0
      ? Math.round(
          (childData.attendance.attended / childData.attendance.total) * 100
        )
      : 0;

  const classesInProgress =
    childData.attendance.total -
    childData.attendance.attended -
    childData.attendance.missed;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Dashboard Section */}
      <div className="lg:col-span-2 space-y-6">
        {/* Enhanced Class Statistics with Real Data */}
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

          {/* Real Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4 text-center hover:bg-blue-100 transition-colors">
              <div className="text-2xl font-bold text-blue-600">
                {childData.attendance.total}
              </div>
              <div className="text-sm text-blue-600 font-medium">
                Total Classes
              </div>
              <div className="text-xs text-blue-500 mt-1">
                Enrolled sessions
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

          {/* Additional Class Details */}
          {(rawData?.canceledClass?.both > 0 ||
            rawData?.pausedClass?.both > 0) && (
            <div className="grid grid-cols-2 gap-4 mb-6">
              {rawData?.canceledClass?.both > 0 && (
                <div className="bg-yellow-50 rounded-lg p-4 text-center">
                  <div className="text-xl font-bold text-yellow-600">
                    {rawData.canceledClass.both}
                  </div>
                  <div className="text-sm text-yellow-600 font-medium">
                    Canceled
                  </div>
                  <div className="text-xs text-yellow-500 mt-1">
                    Rescheduled sessions
                  </div>
                </div>
              )}
              {rawData?.pausedClass?.both > 0 && (
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-xl font-bold text-gray-600">
                    {rawData.pausedClass.both}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    Paused
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Temporarily paused
                  </div>
                </div>
              )}
            </div>
          )}

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
                className={`h-full rounded-full transition-all duration-500 ${
                  childData.attendance.percentage >= 80
                    ? "bg-gradient-to-r from-green-400 to-green-500"
                    : childData.attendance.percentage >= 60
                    ? "bg-gradient-to-r from-yellow-400 to-yellow-500"
                    : "bg-gradient-to-r from-red-400 to-red-500"
                }`}
                style={{ width: `${childData.attendance.percentage}%` }}
              />
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {childData.attendance.percentage >= 80
                ? "Excellent attendance record! Keep it up!"
                : childData.attendance.percentage >= 60
                ? "Good attendance! Try to attend more classes."
                : "Please try to attend classes regularly for better progress."}
            </div>
          </div>

          {/* Class Breakdown by Mode */}
          {(rawData?.totalClassCount?.online > 0 ||
            rawData?.totalClassCount?.offline > 0) && (
            <div className="mt-6 p-4 bg-slate-50 rounded-lg">
              <h4 className="text-sm font-medium text-slate-700 mb-3">
                Class Mode Breakdown
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {rawData?.totalClassCount?.online > 0 && (
                  <div>
                    <div className="text-xs text-slate-600 mb-1">
                      Online Classes
                    </div>
                    <div className="text-sm">
                      <span className="font-medium text-green-600">
                        {rawData.attendedClass.online}
                      </span>
                      <span className="text-slate-400"> / </span>
                      <span className="text-slate-600">
                        {rawData.totalClassCount.online}
                      </span>
                    </div>
                  </div>
                )}
                {rawData?.totalClassCount?.offline > 0 && (
                  <div>
                    <div className="text-xs text-slate-600 mb-1">
                      Offline Classes
                    </div>
                    <div className="text-sm">
                      <span className="font-medium text-green-600">
                        {rawData.attendedClass.offline}
                      </span>
                      <span className="text-slate-400"> / </span>
                      <span className="text-slate-600">
                        {rawData.totalClassCount.offline}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
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
                  Course Completion
                </span>
                <span className="text-sm font-medium text-slate-700">
                  {completionRate}%
                </span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
              <div className="text-xs text-slate-500 mt-1">
                {childData.attendance.attended} of {childData.attendance.total}{" "}
                classes completed
              </div>
            </div>

            {/* Practice Streak */}
            <div className="bg-orange-50 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🔥</span>
                <div>
                  <div className="font-medium text-slate-800">
                    {childData.stats.streak} Class Streak!
                  </div>
                  <div className="text-sm text-slate-600">
                    Based on recent attendance pattern
                  </div>
                </div>
              </div>
            </div>

            {/* Time Spent Learning */}
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-600">
                    Estimated Study Time
                  </div>
                  <div className="font-medium text-slate-800 mt-1">
                    {childData.stats.timeSpent}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Based on {childData.attendance.attended} attended classes
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-600">Next Goal</div>
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
                <div className="text-slate-600">
                  Keep attending classes to unlock achievements!
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Quick Stats */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Quick Stats
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Classes Attended</span>
              <span className="font-medium text-slate-800 text-green-600">
                {childData.attendance.attended}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Classes Remaining</span>
              <span className="font-medium text-slate-800">
                {childData.attendance.remaining}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Attendance Rate</span>
              <span
                className={`font-medium ${
                  childData.attendance.percentage >= 80
                    ? "text-green-600"
                    : childData.attendance.percentage >= 60
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                {childData.attendance.percentage}%
              </span>
            </div>
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
                {childData.stats.totalGames > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Win Rate</span>
                    <span className="font-medium text-slate-800">
                      {Math.round(
                        (childData.stats.wins / childData.stats.totalGames) *
                          100
                      )}
                      %
                    </span>
                  </div>
                )}
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
          </div>
        </div>

        {/* Class Summary */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Class Summary
          </h3>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">
                {Math.round(
                  (childData.attendance.attended / childData.attendance.total) *
                    100
                )}
                %
              </div>
              <div className="text-sm text-slate-600">Course Progress</div>
            </div>
            <div className="text-center p-3 bg-slate-50 rounded-lg">
              <div className="text-sm text-slate-600">Next Class</div>
              <div className="font-medium text-slate-800 mt-1">
                {childData.attendance.nextClass}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveStudentDashboard;
