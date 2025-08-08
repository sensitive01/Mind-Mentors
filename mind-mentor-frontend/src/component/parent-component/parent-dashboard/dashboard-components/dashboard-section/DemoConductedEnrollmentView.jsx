import React from "react";

const DemoConductedEnrollmentView = ({childData, handleEnrollNow }) => {
  return (
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
              <span className="text-sm text-slate-700">
                One-on-one coaching
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-green-500">✓</span>
              <span className="text-sm text-slate-700">
                Flexible scheduling
              </span>
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
              <span className="text-sm text-slate-700">
                Regular assessments
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoConductedEnrollmentView;
