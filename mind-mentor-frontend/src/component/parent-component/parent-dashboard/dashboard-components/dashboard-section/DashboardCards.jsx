import React from "react";

const DashboardCards = ({
  childrenData,
  setSelectedChild,
  selectedChild,
  handleAddKid,
  handleNavigateToProgram,
  selectedChildData,
  handleNavigateToDemo,
}) => {
  return (
    <div className="mb-8 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="flex flex-col space-y-4 mb-6 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
          Learning Dashboard
        </h1>

        {/* Child Selection Buttons */}
        <div className="flex flex-wrap gap-2 sm:gap-3 items-center">
          {childrenData.map((child, index) => (
            <button
              key={child.id}
              onClick={() => setSelectedChild(index)}
              className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full transition-all text-sm sm:text-base ${
                selectedChild === index
                  ? "bg-indigo-500 text-white shadow-lg shadow-indigo-200"
                  : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
              }`}
            >
              <img
                src={child.avatar}
                alt={child.name}
                className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex-shrink-0"
              />
              <span className="font-medium truncate max-w-[80px] sm:max-w-none">
                {child.name}
              </span>
            </button>
          ))}

          {/* Add Kid Button */}
          <button
            onClick={handleAddKid}
            className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-white text-indigo-500 hover:bg-indigo-50 rounded-full transition-all shadow-sm border border-slate-200 hover:border-indigo-200 flex-shrink-0"
            title="Add new child"
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
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

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Program Card */}
        <div
          className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-slate-100 cursor-pointer hover:shadow-md hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-200 group col-span-1 sm:col-span-2 lg:col-span-1"
          onClick={() => handleNavigateToProgram(selectedChildData.id)}
        >
          <div className="flex items-start justify-between h-full">
            <div className="flex-1 min-w-0">
              <div className="text-sm text-slate-500 group-hover:text-blue-600 mb-2">
                Program
              </div>
              <div className="font-semibold text-slate-700 flex items-center gap-2 group-hover:text-blue-700">
                {selectedChildData.program === "Chess" ? (
                  <>
                    <span className="text-xl">♟️</span>
                    <span className="truncate">Chess Program</span>
                  </>
                ) : selectedChildData.program === "Rubik's Cube" ? (
                  <>
                    <span className="text-xl">🎲</span>
                    <span className="truncate">Rubik's Cube Program</span>
                  </>
                ) : (
                  <>
                    <span className="text-xl">❓</span>
                    <span className="truncate">
                      {selectedChildData.program || "Not Selected"}
                    </span>
                  </>
                )}
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNavigateToProgram(selectedChildData.id);
              }}
              className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-full transition-all shadow-sm group-hover:bg-blue-200 ml-3 flex-shrink-0"
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

        {/* Enrollment/Demo Status Card */}
        {selectedChildData.enquiryStatus === "Active" ? (
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-slate-100 col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="text-sm text-slate-500 mb-2">Enrollment Status</div>
            <div className="font-semibold text-slate-700">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Active Student
              </span>
            </div>
          </div>
        ) : (
          <div
            className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-slate-100 cursor-pointer hover:shadow-md hover:border-green-200 hover:bg-green-50/30 transition-all duration-200 group col-span-1 sm:col-span-2 lg:col-span-1"
            onClick={() => handleNavigateToDemo(selectedChildData.id)}
          >
            <div className="flex items-start justify-between h-full">
              <div className="flex-1 min-w-0">
                <div className="text-sm text-slate-500 group-hover:text-green-600 mb-2">
                  Demo Status
                </div>
                <div className="font-semibold text-slate-700 group-hover:text-green-700">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
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
                className="flex items-center justify-center w-8 h-8 bg-green-100 text-green-600 hover:bg-green-200 rounded-full transition-all shadow-sm group-hover:bg-green-200 ml-3 flex-shrink-0"
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
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 002 2z"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Current Level Card */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="text-sm text-slate-500 mb-2">Current Level</div>
          <div className="font-semibold text-slate-700 text-lg">
            {selectedChildData.stats.level}
          </div>
        </div>

        {/* Next Class Card */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="text-sm text-slate-500 mb-2">Next Class</div>
          <div className="font-semibold text-slate-700 text-sm sm:text-base break-words">
            {selectedChildData.demoAssigned}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCards;
