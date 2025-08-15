import React from "react";

const DashboardCards = ({childrenData,setSelectedChild,selectedChild,handleAddKid,handleNavigateToProgram,selectedChildData,handleNavigateToDemo}) => {
  return (
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
  );
};

export default DashboardCards;
