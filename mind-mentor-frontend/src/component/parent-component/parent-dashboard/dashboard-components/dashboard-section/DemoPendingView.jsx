import React from "react";

const DemoPendingView = ({ childData, navigate }) => {
  return (
    <div className="w-full min-h-screen bg-gray-50 px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
      {/* Cards Container */}
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 lg:grid lg:grid-cols-2 lg:gap-6 xl:gap-8 lg:space-y-0">
        {/* Schedule Demo Class Card */}
        <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 lg:p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
          {/* Icon */}
          <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 lg:mb-6">
            <span className="text-xl sm:text-3xl lg:text-4xl">📅</span>
          </div>

          {/* Content */}
          <div className="text-center">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-2 sm:mb-3 lg:mb-4">
              Schedule Demo Class
            </h3>

            <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-4 sm:mb-6 lg:mb-8 leading-relaxed px-2 sm:px-0">
              Book a free demo class for <strong>{childData.name}</strong> to
              experience our interactive chess learning platform.
            </p>

            <button
              className="w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-semibold py-3 sm:py-4 lg:py-5 px-4 sm:px-6 lg:px-8 rounded-lg sm:rounded-xl transition-colors duration-200 mb-3 sm:mb-4 lg:mb-6 text-sm sm:text-base lg:text-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              onClick={() =>
                navigate(`/parent/kid/demo-class-shedule/${childData.id}`)
              }
            >
              Schedule Demo Class
            </button>

            {/* Features */}
            <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 lg:gap-6 text-xs sm:text-sm lg:text-base text-gray-500">
              <span className="flex items-center justify-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></span>
                Free
              </span>
              <span className="flex items-center justify-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                60 minutes
              </span>
              <span className="flex items-center justify-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></span>
                Interactive
              </span>
            </div>
          </div>
        </div>

        {/* Choose Package Card */}
        <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 lg:p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
          {/* Icon */}
          <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 lg:mb-6">
            <span className="text-xl sm:text-3xl lg:text-4xl">📦</span>
          </div>

          {/* Content */}
          <div className="text-center">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-2 sm:mb-3 lg:mb-4">
              Choose Package
            </h3>

            <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-4 sm:mb-6 lg:mb-8 leading-relaxed px-2 sm:px-0">
              Select the perfect chess learning package tailored to{" "}
              <strong>{childData.name}'s</strong> skill level and goals.
            </p>

            <button
              className="w-full bg-purple-500 hover:bg-purple-600 active:bg-purple-700 text-white font-semibold py-3 sm:py-4 lg:py-5 px-4 sm:px-6 lg:px-8 rounded-lg sm:rounded-xl transition-colors duration-200 mb-3 sm:mb-4 lg:mb-6 text-sm sm:text-base lg:text-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
              onClick={() => navigate(`/parent-kid-package-selection`)}
            >
              Choose Package
            </button>

            {/* Features */}
            <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 lg:gap-6 text-xs sm:text-sm lg:text-base text-gray-500">
              <span className="flex items-center justify-center gap-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0"></span>
                Multiple options
              </span>
              <span className="flex items-center justify-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></span>
                Flexible pricing
              </span>
            </div>
          </div>
        </div>

        {/* Information Banner - spans full width on desktop */}
        <div className="w-full bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg sm:rounded-xl p-3 sm:p-6 lg:p-8 border border-gray-200 lg:col-span-2">
          <div className="text-center">
            <h4 className="text-sm sm:text-lg lg:text-xl font-semibold text-gray-700 mb-2 sm:mb-3 lg:mb-4">
              🎯 Next Steps for {childData.name}
            </h4>
            <p className="text-xs sm:text-base lg:text-lg text-gray-600 leading-relaxed max-w-4xl mx-auto">
              Start with a free demo class to see if our teaching style matches{" "}
              {childData.name}'s learning preferences, then choose the package
              that best fits your goals and schedule.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoPendingView;
