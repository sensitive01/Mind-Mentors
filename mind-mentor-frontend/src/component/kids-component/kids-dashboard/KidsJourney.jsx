import React from "react";
import {
  Star,
  Crown,
  Trophy,
  Target,
  Zap,
  Book,
  Sword,
  Flag,
} from "lucide-react";

const ChessKidsJourney = () => {
  const checkpoints = [
    {
      id: 1,
      title: "Pawn's First Steps",
      description: "Learn how pieces move!",
      icon: <Star className="w-6 h-6 text-yellow-400" />,
      completed: true,
      kidAvatar: "👶",
      chessEmoji: "♟️",
    },
    {
      id: 2,
      title: "Knight's Adventure",
      description: "Master the L-shaped jumps",
      icon: <Sword className="w-6 h-6 text-blue-400" />,
      completed: true,
      kidAvatar: "🧒",
      chessEmoji: "♞",
    },
    {
      id: 3,
      title: "Bishop's Path",
      description: "Diagonal power moves",
      icon: <Zap className="w-6 h-6 text-purple-400" />,
      completed: false,
      current: true,
      kidAvatar: "👦",
      chessEmoji: "♗",
    },
    {
      id: 4,
      title: "Rook's Castle",
      description: "Straight line domination",
      icon: <Target className="w-6 h-6 text-red-400" />,
      completed: false,
      kidAvatar: "👧",
      chessEmoji: "♖",
    },
    {
      id: 5,
      title: "Queen's Wisdom",
      description: "Ultimate chess power",
      icon: <Crown className="w-6 h-6 text-pink-400" />,
      completed: false,
      kidAvatar: "🧑",
      chessEmoji: "♕",
    },
    {
      id: 6,
      title: "King's Victory",
      description: "Chess master achieved!",
      icon: <Trophy className="w-6 h-6 text-gold-400" />,
      completed: false,
      kidAvatar: "👑",
      chessEmoji: "♔",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/90 to-primary/70 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            🏰 Chess Kingdom Adventure 🏰
          </h1>
          <p className="text-white/90 text-lg">
            Journey through the magical world of chess!
          </p>
        </div>

        {/* Journey Path */}
        <div className="relative">
          {/* Main curved path */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 800 600"
            style={{ zIndex: 1 }}
          >
            <defs>
              <linearGradient
                id="pathGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop
                  offset="0%"
                  style={{ stopColor: "#fbbf24", stopOpacity: 0.8 }}
                />
                <stop
                  offset="100%"
                  style={{ stopColor: "#f59e0b", stopOpacity: 0.8 }}
                />
              </linearGradient>
            </defs>
            <path
              d="M100 100 Q200 50 300 100 T500 150 Q600 200 700 150 Q750 200 800 250"
              stroke="url(#pathGradient)"
              strokeWidth="8"
              fill="none"
              strokeDasharray="15,10"
              className="animate-pulse"
            />
          </svg>

          {/* Checkpoints */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-8">
            {checkpoints.map((checkpoint, index) => {
              const isEven = index % 2 === 0;
              const delay = index * 0.2;

              return (
                <div
                  key={checkpoint.id}
                  className={`relative transform transition-all duration-500 hover:scale-105`}
                  style={{
                    animationDelay: `${delay}s`,
                    marginTop:
                      index % 3 === 1 ? "3rem" : index % 3 === 2 ? "6rem" : "0",
                  }}
                >
                  {/* Checkpoint Card */}
                  <div
                    className={`relative p-6 rounded-2xl border-3 transition-all duration-300 ${
                      checkpoint.completed
                        ? "bg-green-100/90 border-green-400 shadow-green-200/50"
                        : checkpoint.current
                        ? "bg-yellow-100/90 border-yellow-400 shadow-yellow-200/50 animate-bounce"
                        : "bg-white/90 border-gray-300 shadow-gray-200/50"
                    } shadow-xl backdrop-blur-sm`}
                  >
                    {/* Kid Avatar with Chess Piece */}
                    <div className="flex justify-center mb-4">
                      <div
                        className={`relative w-20 h-20 rounded-full flex items-center justify-center text-3xl ${
                          checkpoint.completed
                            ? "bg-green-200"
                            : checkpoint.current
                            ? "bg-yellow-200"
                            : "bg-gray-200"
                        } shadow-lg border-4 border-white`}
                      >
                        {checkpoint.kidAvatar}

                        {/* Chess piece overlay */}
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-indigo-300">
                          <span className="text-lg">
                            {checkpoint.chessEmoji}
                          </span>
                        </div>

                        {/* Completion badge */}
                        {checkpoint.completed && (
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="3"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="text-center">
                      <div className="flex justify-center mb-2">
                        <div
                          className={`p-2 rounded-full ${
                            checkpoint.completed
                              ? "bg-green-500"
                              : checkpoint.current
                              ? "bg-yellow-500"
                              : "bg-gray-400"
                          }`}
                        >
                          {checkpoint.icon}
                        </div>
                      </div>

                      <h3
                        className={`font-bold text-lg mb-2 ${
                          checkpoint.completed
                            ? "text-green-800"
                            : checkpoint.current
                            ? "text-yellow-800"
                            : "text-gray-700"
                        }`}
                      >
                        {checkpoint.title}
                      </h3>

                      <p
                        className={`text-sm mb-4 ${
                          checkpoint.completed
                            ? "text-green-600"
                            : checkpoint.current
                            ? "text-yellow-700"
                            : "text-gray-600"
                        }`}
                      >
                        {checkpoint.description}
                      </p>

                      {/* Action Button */}
                      {checkpoint.current && (
                        <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-full text-sm font-bold transition-all duration-200 transform hover:scale-105 shadow-lg">
                          Start Playing! 🎯
                        </button>
                      )}

                      {checkpoint.completed && (
                        <div className="text-green-600 font-semibold text-sm flex items-center justify-center">
                          <span className="mr-1">✨</span> Completed!{" "}
                          <span className="ml-1">✨</span>
                        </div>
                      )}

                      {!checkpoint.completed && !checkpoint.current && (
                        <div className="text-gray-500 font-semibold text-sm flex items-center justify-center">
                          <span className="mr-1">🔒</span> Locked
                        </div>
                      )}
                    </div>

                    {/* Decorative elements */}
                    <div className="absolute -top-3 -left-3 w-6 h-6 bg-white rounded-full shadow-md opacity-80"></div>
                    <div className="absolute -bottom-2 -right-3 w-4 h-4 bg-white rounded-full shadow-md opacity-60"></div>
                  </div>

                  {/* Connection dots */}
                  {index < checkpoints.length - 1 && (
                    <div className="hidden lg:block absolute -right-4 top-1/2 transform -translate-y-1/2">
                      <div className="w-8 h-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Floating chess pieces decoration */}
          <div className="absolute top-4 left-4 text-4xl opacity-20 animate-bounce">
            ♛
          </div>
          <div
            className="absolute top-20 right-8 text-3xl opacity-20 animate-bounce"
            style={{ animationDelay: "0.5s" }}
          >
            ♜
          </div>
          <div
            className="absolute bottom-20 left-12 text-3xl opacity-20 animate-bounce"
            style={{ animationDelay: "1s" }}
          >
            ♝
          </div>
          <div
            className="absolute bottom-4 right-4 text-2xl opacity-20 animate-bounce"
            style={{ animationDelay: "1.5s" }}
          >
            ♞
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-12 bg-white/20 rounded-full p-1 backdrop-blur-sm">
          <div
            className="h-3 bg-gradient-to-r from-green-400 to-yellow-400 rounded-full transition-all duration-500"
            style={{ width: "33%" }}
          ></div>
        </div>
        <p className="text-center text-white/90 mt-2 font-semibold">
          Progress: 2/6 Levels Complete! 🎉
        </p>
      </div>
    </div>
  );
};

export default ChessKidsJourney;
