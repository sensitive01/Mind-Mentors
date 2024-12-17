import React from 'react';
import { Star, Trophy, Medal, Crown } from 'lucide-react';

const KidsAchievements = () => {
  const achievements = [
    {
      id: 1,
      title: "Math Master",
      description: "Completed 10 math puzzles!",
      icon: <Star className="w-8 h-8 text-orange-500" />,
      progress: 80,
      unlocked: true
    },
    {
      id: 2,
      title: "Reading Champion",
      description: "Read 5 stories in a row!",
      icon: <Trophy className="w-8 h-8 text-orange-500" />,
      progress: 100,
      unlocked: true
    },
    {
      id: 3,
      title: "Science Explorer",
      description: "Complete all science quizzes",
      icon: <Medal className="w-8 h-8 text-orange-400" />,
      progress: 60,
      unlocked: false
    },
    {
      id: 4,
      title: "Super Student",
      description: "Login 7 days in a row",
      icon: <Crown className="w-8 h-8 text-orange-300" />,
      progress: 40,
      unlocked: false
    }
  ];

  return (
    <div className="p-6 bg-orange-50 min-h-screen">
      <h1 className="text-3xl font-bold text-orange-600 mb-8 text-center">
        My Awesome Achievements! 🌟
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {achievements.map((achievement) => (
          <div 
            key={achievement.id}
            className={`rounded-lg shadow-md p-4 transform transition-all duration-200 hover:scale-105 ${
              achievement.unlocked ? 'bg-white' : 'bg-gray-100'
            }`}
          >
            <div className="flex flex-row items-center space-x-4 pb-2 border-b border-gray-100">
              <div className="p-2 bg-orange-100 rounded-lg">
                {achievement.icon}
              </div>
              <h2 className={`text-lg font-semibold ${
                achievement.unlocked ? 'text-orange-600' : 'text-gray-500'
              }`}>
                {achievement.title}
              </h2>
            </div>
            
            <div className="pt-4">
              <p className="text-gray-600 mb-4">{achievement.description}</p>
              
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-orange-400 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${achievement.progress}%` }}
                />
              </div>
              <p className="text-sm text-gray-500 mt-2 text-right">
                {achievement.progress}% Complete
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KidsAchievements;