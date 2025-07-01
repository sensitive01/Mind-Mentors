import React from "react";
import {
  Book,
  ChevronRight,
  Sparkles,
  Star,
  Trophy,
  User,
  UserPlus,
  Calendar,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const KidsDetails = ({ kids }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
      {/* Add the CSS animation styles */}
      <style jsx>{`
        @keyframes moving-line {
          0% {
            background: linear-gradient(90deg, #8b5cf6 0%, #8b5cf6 100%);
            background-size: 25% 2px;
            background-position: 0% 0%;
            background-repeat: no-repeat;
          }
          25% {
            background: linear-gradient(90deg, #8b5cf6 0%, #8b5cf6 100%);
            background-size: 100% 2px;
            background-position: 0% 0%;
            background-repeat: no-repeat;
          }
          25.01% {
            background: linear-gradient(180deg, #8b5cf6 0%, #8b5cf6 100%);
            background-size: 2px 25%;
            background-position: 100% 0%;
            background-repeat: no-repeat;
          }
          50% {
            background: linear-gradient(180deg, #8b5cf6 0%, #8b5cf6 100%);
            background-size: 2px 100%;
            background-position: 100% 0%;
            background-repeat: no-repeat;
          }
          50.01% {
            background: linear-gradient(270deg, #8b5cf6 0%, #8b5cf6 100%);
            background-size: 25% 2px;
            background-position: 100% 100%;
            background-repeat: no-repeat;
          }
          75% {
            background: linear-gradient(270deg, #8b5cf6 0%, #8b5cf6 100%);
            background-size: 100% 2px;
            background-position: 100% 100%;
            background-repeat: no-repeat;
          }
          75.01% {
            background: linear-gradient(0deg, #8b5cf6 0%, #8b5cf6 100%);
            background-size: 2px 25%;
            background-position: 0% 100%;
            background-repeat: no-repeat;
          }
          100% {
            background: linear-gradient(0deg, #8b5cf6 0%, #8b5cf6 100%);
            background-size: 2px 100%;
            background-position: 0% 100%;
            background-repeat: no-repeat;
          }
        }

        .animate-moving-line {
          animation: moving-line 3s infinite linear;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="relative mb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="relative z-10">
              <div className="relative inline-block">
                <h2 className="text-2xl font-bold text-gray-800 mb-1">
                  My Champions
                  <Sparkles className="inline-block ml-2 w-4 h-4 text-yellow-400" />
                </h2>
                <div className="absolute -top-2 -left-2 w-8 h-8 bg-yellow-200 rounded-full opacity-20 animate-pulse"></div>
              </div>
              <p className="text-sm text-gray-600">
                Nurturing young minds through chess
              </p>
            </div>
            <button
              onClick={() => navigate("/parent/add-kid")}
              className="group px-3 py-2 rounded-lg bg-primary text-white font-medium shadow-lg hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1"
            >
              <span className="flex items-center text-sm">
                <UserPlus className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                Add Champion
              </span>
            </button>
          </div>
        </div>

        {kids?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {kids.map((kid) => (
              <div
                onClick={() => navigate(`/parent/kid/attendance/${kid._id}`)}
                key={kid?._id}
                className="group relative cursor-pointer"
              >
                {/* Purple moving line around 4 sides */}
                <div className="absolute -inset-[1px] rounded-lg animate-moving-line group-hover:opacity-80 transition-all duration-500"></div>

                {/* Main card content */}
                <div className="relative bg-white rounded-lg m-[2px] overflow-hidden">
                  <div className="h-16 bg-gradient-to-r from-primary to-primary relative">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIgZmlsbD0id2hpdGUiIG9wYWNpdHk9IjAuMyIvPjwvc3ZnPg==')] opacity-20"></div>

                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                      <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-75 group-hover:opacity-100 transition-opacity blur"></div>
                        {kid?.imageUrl ? (
                          <img
                            src={kid.imageUrl}
                            alt={`${kid.kidsName}'s profile`}
                            className="relative w-14 h-14 rounded-full object-cover border-3 border-white"
                          />
                        ) : (
                          <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center border-3 border-white">
                            <User size={24} className="text-primary" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="px-3 pt-8 pb-3">
                    <div className="text-center mb-3">
                      <h3 className="text-lg font-bold text-gray-800 mb-1">
                        {kid.kidsName || "Champion"}
                      </h3>
                      <div className="bg-gradient-to-r from-primary to-primary text-white rounded-full px-2 py-0.5 inline-block">
                        <span className="text-xs font-medium">
                          ID: {kid.chessId}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="bg-green-50 rounded-lg p-2 text-center">
                        <Calendar className="w-3 h-3 text-green-500 mx-auto mb-1" />
                        <span className="text-xs text-gray-600">Attended</span>
                        <p className="text-sm font-bold text-green-600">
                          {kid.totalClassesAttended || 0}
                        </p>
                      </div>
                      <div className="bg-orange-50 rounded-lg p-2 text-center">
                        <Clock className="w-3 h-3 text-orange-500 mx-auto mb-1" />
                        <span className="text-xs text-gray-600">Remaining</span>
                        <p className="text-sm font-bold text-orange-600">
                          {kid.classesRemaining || 0}
                        </p>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-2">
                      <div className="flex items-center gap-1 text-gray-700 mb-1">
                        <Trophy className="w-3 h-3 text-yellow-500" />
                        <span className="text-xs font-medium">Program</span>
                      </div>
                      <div className="space-y-1">
                        {kid?.selectedProgram?.length > 0 ? (
                          kid.selectedProgram.map((program, index) => (
                            <div key={index} className="text-center">
                              <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-0.5 rounded-full font-medium inline-block">
                                {program.program || "Chess"}
                              </span>
                              <div className="text-xs text-gray-600 mt-0.5">
                                {program.level || "Beginner"}
                              </div>
                            </div>
                          ))
                        ) : (
                          <span className="text-gray-500 text-xs">
                            No active programs
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-6 text-center max-w-lg mx-auto">
            <div className="bg-purple-100 w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center group hover:scale-110 transition-transform duration-300">
              <UserPlus className="w-6 h-6 text-primary group-hover:rotate-12 transition-transform" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Begin Your Child's Chess Journey
            </h3>
            <p className="text-gray-600 mb-4 text-sm max-w-md mx-auto">
              Transform your child's potential into mastery. Start their chess
              adventure today.
            </p>
            <button
              onClick={() => navigate("/parent/add-kid")}
              className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-primary hover:from-primary hover:to-primary text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <UserPlus className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
              Add Your First Champion
              <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default KidsDetails;
