import React from "react";

const DemoScheduledView = ({}) => {
  return (
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
                    <div className="font-medium text-slate-800">
                      First Layer
                    </div>
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
};

export default DemoScheduledView;
