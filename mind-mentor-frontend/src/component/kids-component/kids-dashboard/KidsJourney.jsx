import React from 'react';
import { Star, Flag, Map, Trophy, Lock } from 'lucide-react';

const KidsJourney = () => {
  const checkpoints = [
    {
      id: 1,
      title: "Starting Camp",
      description: "Begin your adventure!",
      icon: <Star className="w-8 h-8 text-yellow-500" />,
      completed: true,
      position: "left"
    },
    {
      id: 2,
      title: "Forest of Numbers",
      description: "Master basic math skills",
      icon: <Map className="w-8 h-8 text-green-500" />,
      completed: true,
      position: "right"
    },
    {
      id: 3,
      title: "Reading River",
      description: "Learn to read fluently",
      icon: <Flag className="w-8 h-8 text-blue-500" />,
      completed: false,
      current: true,
      position: "left"
    },
    {
      id: 4,
      title: "Victory Peak",
      description: "Become a learning champion!",
      icon: <Trophy className="w-8 h-8 text-purple-500" />,
      completed: false,
      locked: true,
      position: "right"
    }
  ];

  return (
    <div className="p-8 bg-orange-50 min-h-screen">
      <h1 className="text-3xl font-bold text-orange-600 mb-8 text-center">
        My Learning Adventure 🚀
      </h1>

      <div className="relative mx-auto max-w-4xl">
        {/* Main Road */}
        <div className="absolute top-0 bottom-0 left-1/2 w-8 bg-orange-200 transform -translate-x-1/2 rounded-full" />
        {/* Dotted Line */}
        <div className="absolute top-0 bottom-0 left-1/2 border-4 border-white border-dashed transform -translate-x-1/2" />

        <div className="relative grid grid-cols-2 gap-24">
          {checkpoints.map((checkpoint, index) => (
            <div key={checkpoint.id} className={`relative px-4 ${
              checkpoint.position === 'left' ? 'text-right' : 'text-left'
            }`}>
              {/* Vertical Connection Line */}
              <div className={`absolute ${
                checkpoint.position === 'left' 
                  ? 'right-0 w-32 h-1 top-1/2 transform -translate-y-1/2' 
                  : 'left-0 w-32 h-1 top-1/2 transform -translate-y-1/2'
              } bg-orange-300` } />

              {/* Checkpoint Card */}
              <div className={`relative p-6 rounded-xl border-2 transition-all duration-200 ${
                checkpoint.locked 
                  ? 'bg-gray-100 border-gray-200' 
                  : checkpoint.completed
                    ? 'bg-green-50 border-green-200'
                    : checkpoint.current
                      ? 'bg-orange-100 border-orange-300 animate-pulse'
                      : 'bg-white border-orange-200'
              }`}>
                {/* Checkpoint Content */}
                <div className="flex items-center space-x-4">
                  {checkpoint.position === 'left' && (
                    <div className={`p-3 rounded-full ${
                      checkpoint.locked ? 'bg-gray-200' : 'bg-white shadow-md'
                    }`}>
                      {checkpoint.locked ? (
                        <Lock className="w-8 h-8 text-gray-400" />
                      ) : checkpoint.icon}
                    </div>
                  )}

                  <div>
                    <h2 className={`font-bold text-lg ${
                      checkpoint.locked ? 'text-gray-400' : 'text-gray-800'
                    }`}>
                      {checkpoint.title}
                    </h2>

                    <p className={`text-sm ${
                      checkpoint.locked ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {checkpoint.description}
                    </p>

                    {checkpoint.current && (
                      <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors mt-2">
                        Start Learning
                      </button>
                    )}
                  </div>

                  {checkpoint.position === 'right' && (
                    <div className={`p-3 rounded-full ${
                      checkpoint.locked ? 'bg-gray-200' : 'bg-white shadow-md'
                    }`}>
                      {checkpoint.locked ? (
                        <Lock className="w-8 h-8 text-gray-400" />
                      ) : checkpoint.icon}
                    </div>
                  )}
                </div>

                {checkpoint.completed && (
                  <div className={`absolute ${
                    checkpoint.position === 'left' 
                      ? '-top-2 right-0' 
                      : '-top-2 left-0'
                  } bg-green-500 rounded-full p-1`}>
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KidsJourney;