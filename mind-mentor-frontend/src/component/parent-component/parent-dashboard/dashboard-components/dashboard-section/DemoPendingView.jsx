import React from "react";

const DemoPendingView = ({childData, navigate}) => {
  return (
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
};

export default DemoPendingView;
