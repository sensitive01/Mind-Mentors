import React from "react";
import { Clock } from "lucide-react";

const ParentDashboard = () => {
  const upcomingClasses = [
    {
      id: 1,
      imgSrc: "/api/placeholder/80/80",
      alt: "Books",
    },
    {
      id: 2,
      imgSrc: "/api/placeholder/80/80",
      alt: "Chess piece",
    },
    {
      id: 3,
      imgSrc: "/api/placeholder/80/80",
      alt: "Pattern",
    },
    {
      id: 4,
      imgSrc: "/api/placeholder/80/80",
      alt: "Rubiks cube",
    },
  ];

  return (
    <div className="p-4 sm:p-6 bg-white min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-bold">
              Welcome, ChessCubeKids
            </h1>
            <p className="text-gray-700">Child's Progress</p>
          </div>
          <img
            src="/api/placeholder/48/48"
            alt="Chess Logo"
            className="w-10 h-10 sm:w-12 sm:h-12"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Upcoming Chess Classes */}
            <section>
              <h2 className="text-lg font-semibold mb-4">
                Upcoming Chess Classes
              </h2>
              <div className="flex flex-wrap gap-3 sm:gap-4 mb-4">
                {upcomingClasses.map((item) => (
                  <div
                    key={item.id}
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-orange-100 flex-shrink-0"
                  >
                    <img
                      src={item.imgSrc}
                      alt={item.alt}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                <button className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                  Join
                </button>
              </div>
            </section>

            {/* Track Progress Card */}
            <div className="bg-primary rounded-2xl p-4 sm:p-6 text-white">
              <div className="flex items-center space-x-3 mb-2">
                <img
                  src="/api/placeholder/24/24"
                  alt="Chess piece"
                  className="w-5 h-5 sm:w-6 sm:h-6"
                />
                <h2 className="text-base sm:text-lg font-semibold">
                  Track Progress
                </h2>
              </div>
              <p className="mb-4 text-sm sm:text-base">
                Monitor your child's chess journey
              </p>
              <button className="bg-white text-primary px-4 py-2 rounded-lg font-medium text-sm sm:text-base">
                Track now
              </button>
            </div>

            {/* Recent Chess Lesson */}
            <section>
              <h2 className="text-lg font-semibold mb-4">
                Recent Chess Lesson
              </h2>
              <div className="bg-primary rounded-2xl p-4 sm:p-6 text-white">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
                      <h3 className="text-base sm:text-lg font-semibold">
                        Rubik's Cube Class
                      </h3>
                    </div>
                    <p className="text-sm sm:text-base">
                      Cube Solving Techniques
                    </p>
                  </div>
                  <button className="bg-white text-primary px-4 py-2 rounded-lg font-medium text-sm sm:text-base w-full sm:w-auto">
                    Start
                  </button>
                </div>
              </div>
            </section>

            {/* Activities Overview */}
            <section>
              <h2 className="text-lg font-semibold mb-4">
                Activities Overview
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {["Practice", "Listen to", "Cube", "Cube Speed"].map(
                  (activity, index) => (
                    <div
                      key={index}
                      className="aspect-square rounded-full bg-primary flex items-center justify-center"
                    >
                      <img
                        src="/api/placeholder/32/32"
                        alt={activity}
                        className="w-6 h-6 sm:w-8 sm:h-8"
                      />
                    </div>
                  )
                )}
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Daily Chess Card */}
            <div className="bg-primary rounded-2xl p-4 sm:p-6 text-white">
              <h2 className="text-lg sm:text-xl font-semibold mb-4">
                Daily Chess
              </h2>
              <p className="mb-4 text-sm sm:text-base">
                Solve chess puzzles to improve skills!
              </p>
              <button className="bg-white text-primary px-4 py-2 rounded-lg font-medium w-full text-sm sm:text-base">
                Play now
              </button>
            </div>

            {/* Achievement Board */}
            <section>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                <h2 className="text-lg font-semibold">Achievement Board</h2>
                <span className="text-primary font-medium px-3 py-1 bg-orange-100 rounded-full text-xs sm:text-sm">
                  EXPLORE
                </span>
              </div>

              <div className="space-y-3">
                {[
                  {
                    title: "Chess",
                    score: "2398",
                    icon: "/api/placeholder/32/32",
                  },
                  {
                    title: "Your",
                    score: "2019",
                    icon: "/api/placeholder/32/32",
                  },
                  {
                    title: "Cubing",
                    score: "1832",
                    icon: "/api/placeholder/32/32",
                  },
                  {
                    title: "Your",
                    score: "420",
                    icon: "/api/placeholder/32/32",
                  },
                ].map((achievement, index) => (
                  <div
                    key={index}
                    className="bg-primary rounded-xl p-3 sm:p-4 text-white flex justify-between items-center"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                        <img
                          src={achievement.icon}
                          alt={achievement.title}
                          className="w-4 h-4 sm:w-6 sm:h-6"
                        />
                      </div>
                      <span className="text-sm sm:text-base">
                        {achievement.title}
                      </span>
                    </div>
                    <span className="text-sm sm:text-base font-medium">
                      {achievement.score}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
