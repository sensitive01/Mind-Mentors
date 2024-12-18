/* eslint-disable react/prop-types */
import {
  Book,
  ChevronRight,
  Sparkles,
  Star,
  Trophy,
  User,
  UserPlus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const KidsDetails = ({ kids }) => {
  const navigate = useNavigate();

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="relative mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative z-10">
              <div className="relative inline-block">
                <h2 className="text-3xl font-bold text-gray-800 mb-1">
                  My Champions
                  <Sparkles className="inline-block ml-2 w-5 h-5 text-yellow-400" />
                </h2>
                <div className="absolute -top-3 -left-3 w-10 h-10 bg-yellow-200 rounded-full opacity-20 animate-pulse"></div>
              </div>
              <p className="text-gray-600">
                Nurturing young minds through the art of chess
              </p>
            </div>
            <button
              onClick={() => navigate("/parent/add-kid")}
              className="group px-4 py-2 rounded-xl bg-primary text-white font-medium shadow-lg hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1"
            >
              <span className="flex items-center">
                <UserPlus className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                Add New Champion
              </span>
            </button>
          </div>
        </div>

        {kids?.length > 0 ? (
          <div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 
            max-h-[calc(100vh-250px)] overflow-y-auto 
            pr-2 scrollbar-thin scrollbar-thumb-primary scrollbar-track-gray-100"
          >
            {kids.map((kid) => (
              <div
                onClick={() => navigate(`/parent/kid/attendance/${kid._id}`)}
                key={kid?._id}
                className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden"
              >
                <div className="h-24 bg-gradient-to-r from-primary to-primary relative">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIgZmlsbD0id2hpdGUiIG9wYWNpdHk9IjAuMyIvPjwvc3ZnPg==')] opacity-20"></div>
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                    <div className="relative group">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-75 group-hover:opacity-100 transition-opacity blur"></div>
                      {kid?.imageUrl ? (
                        <img
                          src={kid.imageUrl}
                          alt={`${kid.firstName}'s profile`}
                          className="relative w-20 h-20 rounded-full object-cover border-4 border-white"
                        />
                      ) : (
                        <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center border-4 border-white">
                          <User size={32} className="text-primary" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="px-4 pt-10 pb-4">
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">
                      {kid.kidsName || "Champion"}
                    </h3>
                    <div className="bg-gradient-to-r from-primary to-primary text-white rounded-full px-3 py-1 inline-block">
                      <span className="text-xs font-medium">
                        Chess ID: {kid.chessId}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="bg-purple-50 rounded-lg p-2 text-center">
                      <Book className="w-4 h-4 text-purple-500 mx-auto mb-1" />
                      <span className="text-xs text-gray-600">Lessons</span>
                      <p className="text-sm font-bold text-purple-600">12</p>
                    </div>
                    <div className="bg-pink-50 rounded-lg p-2 text-center">
                      <Star className="w-4 h-4 text-pink-500 mx-auto mb-1" />
                      <span className="text-xs text-gray-600">Level</span>
                      <p className="text-sm font-bold text-pink-600">
                        Advanced
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <div className="flex items-center gap-1 text-gray-700 mb-2">
                      <Trophy className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium">
                        Active Courses
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {kid?.programs?.length > 0 ? (
                        kid.programs.map((course, index) => (
                          <span
                            key={index}
                            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-0.5 rounded-full font-medium"
                          >
                            {course || "Chess"}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500 text-xs">
                          No active courses
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-xl p-8 text-center max-w-2xl mx-auto">
            <div className="bg-purple-100 w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center group hover:scale-110 transition-transform duration-300">
              <UserPlus className="w-8 h-8 text-primary group-hover:rotate-12 transition-transform" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Begin Your Childs Chess Journey
            </h3>
            <p className="text-gray-600 mb-6 text-base max-w-md mx-auto">
              Transform your childs potential into mastery. Start their chess
              adventure today.
            </p>
            <button
              onClick={() => navigate("/parent/add-kid")}
              className="inline-flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-primary to-primary hover:from-primary hover:to-primary text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <UserPlus className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
              Add Your First Champion
              <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default KidsDetails;