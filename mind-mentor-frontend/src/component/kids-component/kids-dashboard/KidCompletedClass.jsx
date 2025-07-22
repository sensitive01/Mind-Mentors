import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  User,
  Award,
  MessageCircle,
  CheckCircle2,
  Trophy,
  Star,
  Medal,
  Crown,
  Sparkles,
} from "lucide-react";
import { getMyCompletedClasses } from "../../../api/service/kid/KidService";

const KidCompletedClass = () => {
  const [completedClasses, setCompletedClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCard, setActiveCard] = useState(null);
  const kidId = localStorage.getItem("kidId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getMyCompletedClasses(kidId);
        setCompletedClasses(response.data.filteredData || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching completed classes:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const getClassEmoji = (program, level) => {
    const programEmojis = {
      Chess: "♟️",
      Math: "🔢",
      Science: "🔬",
      Art: "🎨",
      Music: "🎵",
    };
    return programEmojis[program] || "🎯";
  };

  const getLevelBadge = (level) => {
    const levelInfo = {
      "Absolute Beginner": {
        emoji: "🌱",
        color: "bg-green-400",
        text: "Sprout",
      },
      Beginner: { emoji: "⭐", color: "bg-blue-400", text: "Rising Star" },
      Intermediate: { emoji: "🚀", color: "bg-purple-400", text: "Rocket" },
      Advanced: { emoji: "👑", color: "bg-yellow-400", text: "Champion" },
    };
    return (
      levelInfo[level] || {
        emoji: "🎯",
        color: "bg-gray-400",
        text: "Explorer",
      }
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/90 to-primary/70 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Trophy className="w-8 h-8 text-white animate-pulse" />
              </div>
            </div>
            <p className="text-white text-xl font-bold mt-4 animate-bounce">
              Loading your achievements... ✨
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!completedClasses.length) {
    return (
      <div className="min-h-screen  bg-gradient-to-b from-primary/90 to-primary/70 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-20">
            <div className="relative inline-block mb-8">
              <Trophy className="w-24 h-24 text-yellow-300 animate-bounce" />
              <Sparkles className="w-8 h-8 text-white absolute -top-2 -right-2 animate-ping" />
            </div>
            <h2 className="text-4xl font-extrabold text-white mb-4 drop-shadow-lg">
              Ready for Adventure? 🚀
            </h2>
            <p className="text-white/90 text-xl mb-6">
              Complete your first class to unlock awesome achievements!
            </p>
            <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-6 max-w-md mx-auto">
              <p className="text-white font-semibold">
                🌟 Your journey starts here! 🌟
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  bg-gradient-to-b from-primary/90 to-primary/70 p-4 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Playful Header */}
        <header className="text-center mb-8">
          <div className="relative inline-block">
            <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg mb-2 animate-bounce">
              My Awesome Classes! 🎉
            </h1>
            <Sparkles className="w-8 h-8 text-yellow-300 absolute -top-2 -right-8 animate-ping" />
          </div>
          <p className="text-xl text-white/90 font-medium mb-4">
            Look at all the amazing things you've learned! ✨
          </p>
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full">
            <Trophy className="w-6 h-6 text-yellow-300" />
            <span className="text-white font-bold text-lg">
              {completedClasses.length} Classes Completed! 🏆
            </span>
          </div>
        </header>

        {/* Achievement Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {completedClasses.map((classItem, index) => {
            const levelBadge = getLevelBadge(classItem.classDetails.level);
            const classEmoji = getClassEmoji(classItem.classDetails.program);

            return (
              <div
                key={classItem.classId}
                className={`
                  bg-white rounded-3xl shadow-2xl p-6 transform transition-all duration-300 
                  ${
                    activeCard === index
                      ? "scale-105 ring-4 ring-yellow-300"
                      : "hover:scale-105"
                  }
                  cursor-pointer relative overflow-hidden group
                `}
                onMouseEnter={() => setActiveCard(index)}
                onMouseLeave={() => setActiveCard(null)}
              >
                {/* Animated Rainbow Top */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 group-hover:animate-pulse"></div>

                {/* Floating Elements */}
                <div className="absolute top-4 right-4">
                  <div
                    className={`w-12 h-12 ${levelBadge.color} rounded-full flex items-center justify-center text-2xl animate-bounce shadow-lg`}
                  >
                    {levelBadge.emoji}
                  </div>
                </div>

                {/* Class Header */}
                <div className="flex items-start mb-4">
                  <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-3 mr-4">
                    <span className="text-4xl">{classEmoji}</span>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-extrabold text-purple-800 mb-1">
                      {classItem.classDetails.program}
                    </h2>
                    <div
                      className={`inline-block px-3 py-1 ${levelBadge.color} text-white rounded-full text-sm font-bold`}
                    >
                      {levelBadge.text}
                    </div>
                  </div>
                </div>

                {/* Fun Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-xl p-3 text-center">
                    <Calendar className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                    <p className="text-xs text-blue-600 font-semibold">Date</p>
                    <p className="text-sm font-bold text-blue-800">
                      {formatDate(classItem.conductedDate)}
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-3 text-center">
                    <Clock className="w-5 h-5 text-green-600 mx-auto mb-1" />
                    <p className="text-xs text-green-600 font-semibold">Time</p>
                    <p className="text-sm font-bold text-green-800">
                      {classItem.classDetails.classTime}
                    </p>
                  </div>
                </div>

                {/* Coach Info */}
                <div className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-xl p-3 mb-4">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-orange-600" />
                    <span className="text-orange-600 font-semibold text-sm">
                      Your Awesome Coach
                    </span>
                  </div>
                  <p className="font-bold text-orange-800">
                    {classItem.classDetails.coachName} 👨‍🏫
                  </p>
                </div>

                {/* Attendance Badge */}
                <div className="flex justify-center mb-4">
                  {classItem.studentDetails.attendance === "Present" ? (
                    <div className="bg-gradient-to-r from-green-400 to-emerald-400 text-white px-4 py-2 rounded-full flex items-center gap-2 font-bold animate-pulse">
                      <CheckCircle2 className="w-5 h-5" />
                      Great Job! Present! 🎉
                    </div>
                  ) : (
                    <div className="bg-gradient-to-r from-gray-400 to-gray-500 text-white px-4 py-2 rounded-full flex items-center gap-2 font-bold">
                      Missed Class 😔
                    </div>
                  )}
                </div>

                {/* Coach Feedback */}
                <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <MessageCircle className="w-5 h-5 text-pink-600 mt-1" />
                    <div>
                      <p className="text-sm font-bold text-pink-600 mb-2">
                        🌟 Coach Says:
                      </p>
                      <p className="text-pink-800 font-medium text-sm leading-relaxed">
                        "{classItem.coachClassFeedBack}"
                      </p>
                    </div>
                  </div>
                </div>

                {/* Additional Notes */}
                {classItem.studentDetails.feedback &&
                  classItem.studentDetails.feedback !== "ok" && (
                    <div className="bg-gradient-to-r from-indigo-100 to-blue-100 rounded-xl p-4 mb-4">
                      <div className="flex items-start gap-3">
                        <Star className="w-5 h-5 text-indigo-600 mt-1" />
                        <div>
                          <p className="text-sm font-bold text-indigo-600 mb-2">
                            ✨ Special Notes:
                          </p>
                          <p className="text-indigo-800 font-medium text-sm leading-relaxed">
                            {classItem.studentDetails.feedback}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                {/* Action Button */}
                {/* <div className="text-center">
                  <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-8 rounded-full hover:from-purple-600 hover:to-pink-600 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl">
                    View Details 🔍
                  </button>
                </div> */}

                {/* Floating Achievement Stars */}
                <div className="absolute -top-1 -left-1 w-6 h-6 text-yellow-400 animate-spin">
                  ⭐
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 text-pink-400 animate-bounce">
                  💖
                </div>
              </div>
            );
          })}
        </div>

        {/* Fun Footer */}
        <footer className="text-center mt-12">
          <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-8 max-w-2xl mx-auto">
            <h3 className="text-3xl font-extrabold text-white mb-4">
              Keep Going, Superstar! 🌟
            </h3>
            <p className="text-white/90 text-lg mb-4">
              You're doing amazing! Every class makes you smarter and stronger!
              💪
            </p>
            <div className="flex justify-center gap-4 text-4xl">
              🚀 🎯 🏆 ⭐ 🎉
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default KidCompletedClass;
