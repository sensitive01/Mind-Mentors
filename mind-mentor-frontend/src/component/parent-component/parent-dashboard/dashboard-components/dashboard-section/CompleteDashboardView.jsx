import React from "react";

const CompleteDashboardView = ({childData}) => {
  return (
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
};

export default CompleteDashboardView;
