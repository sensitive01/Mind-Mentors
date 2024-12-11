import React, { useState } from 'react';
import { 
  UserCircle, 
  Trophy, 
  Calendar, 
  Star, 
  Book, 
  Award,
  Rocket,
  Target
} from 'lucide-react';

const KidsChessDashboard = () => {
  const [activeSection, setActiveSection] = useState(null);

  const chessLevels = [
    { name: 'Pawn Recruit', icon: <Trophy className="text-blue-500" />, color: 'bg-blue-50' },
    { name: 'Knight Apprentice', icon: <Rocket className="text-purple-500" />, color: 'bg-purple-50' },
    { name: 'Bishop Pro', icon: <Target className="text-green-500" />, color: 'bg-green-50' }
  ];

  const challengeCards = [
    { 
      title: 'Checkmate Challenge', 
      description: 'Defeat the AI in 3 moves!', 
      icon: <Trophy className="text-yellow-500" size={32} />,
      bgColor: 'bg-yellow-50'
    },
    { 
      title: 'Puzzle Master', 
      description: 'Solve tricky chess puzzles', 
      icon: <Book className="text-red-500" size={32} />,
      bgColor: 'bg-red-50'
    }
  ];

  return (
    <div className="min-h-screen bg-[#ffefd2] p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Playful Header */}
        <header className="text-center mb-10 animate-fade-in">
          <h1 className="text-6xl font-extrabold text-transparent bg-clip-text 
            bg-gradient-to-r from-blue-600 to-purple-600 
            drop-shadow-lg mb-2">
            Chess Adventurers
          </h1>
          <p className="text-xl text-blue-800 font-medium">
            Where every move tells a story!
          </p>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Section with Gamified Elements */}
          <section 
            className={`bg-white rounded-3xl shadow-2xl p-6 text-center 
            transform transition-all duration-300 
            ${activeSection === 'profile' ? 'scale-105 ring-4 ring-blue-300' : 'hover:scale-105'}
            cursor-pointer`}
            onClick={() => setActiveSection('profile')}
          >
            <div className="relative">
              <UserCircle 
                className="mx-auto text-blue-600 
                animate-bounce" 
                size={100} 
              />
              <span className="absolute top-0 right-0 bg-green-500 text-white 
                rounded-full px-2 py-1 text-xs">
                Online
              </span>
            </div>
            
            <h2 className="text-3xl font-bold text-blue-800 mt-4">
              Chess Ninja
            </h2>

            {/* Level Progress */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              {chessLevels.map((level, index) => (
                <div 
                  key={index} 
                  className={`p-3 rounded-xl ${level.color} 
                  flex flex-col items-center 
                  transform transition hover:scale-110`}
                >
                  {level.icon}
                  <p className="text-xs font-semibold text-blue-800 mt-2">
                    {level.name}
                  </p>
                </div>
              ))}
            </div>

            <button 
              className="mt-6 w-full bg-gradient-to-r from-blue-600 to-purple-600 
              text-white py-3 rounded-full 
              hover:from-blue-700 hover:to-purple-700 
              transition-all transform hover:scale-105 
              shadow-md font-bold"
            >
              🏆 View Achievements
            </button>
          </section>

          {/* Learning Challenges */}
          <section 
            className={`bg-white rounded-3xl shadow-2xl p-6 
            transform transition-all duration-300 
            ${activeSection === 'challenges' ? 'scale-105 ring-4 ring-purple-300' : 'hover:scale-105'}
            cursor-pointer`}
            onClick={() => setActiveSection('challenges')}
          >
            <div className="flex items-center space-x-4 mb-6">
              <Award className="text-purple-600" size={40} />
              <h2 className="text-3xl font-bold text-purple-800">
                Daily Challenges
              </h2>
            </div>

            <div className="space-y-6">
              {challengeCards.map((challenge, index) => (
                <div 
                  key={index} 
                  className={`${challenge.bgColor} p-4 rounded-2xl 
                  flex items-center justify-between 
                  hover:shadow-lg transition-all transform hover:scale-105`}
                >
                  <div>
                    <h3 className="text-xl font-bold text-purple-900">
                      {challenge.title}
                    </h3>
                    <p className="text-sm text-purple-700">
                      {challenge.description}
                    </p>
                  </div>
                  {challenge.icon}
                </div>
              ))}
            </div>

            <button 
              className="mt-6 w-full bg-gradient-to-r from-purple-600 to-pink-600 
              text-white py-3 rounded-full 
              hover:from-purple-700 hover:to-pink-700 
              transition-all transform hover:scale-105 
              shadow-md font-bold"
            >
              🚀 Start Challenge
            </button>
          </section>

          {/* Upcoming Classes */}
          <section 
            className={`bg-white rounded-3xl shadow-2xl p-6 
            transform transition-all duration-300 
            ${activeSection === 'classes' ? 'scale-105 ring-4 ring-green-300' : 'hover:scale-105'}
            cursor-pointer`}
            onClick={() => setActiveSection('classes')}
          >
            <div className="flex items-center space-x-4 mb-6">
              <Calendar className="text-green-600" size={40} />
              <h2 className="text-3xl font-bold text-green-800">
                Chess Adventures
              </h2>
            </div>

            <div className="space-y-6">
              <div 
                className="bg-green-50 p-4 rounded-2xl 
                flex items-center justify-between 
                hover:shadow-lg transition-all transform hover:scale-105"
              >
                <div>
                  <h3 className="text-xl font-bold text-green-900">
                    Chess Basics Bootcamp
                  </h3>
                  <p className="text-sm text-green-700">
                    Every Saturday • 10 AM
                  </p>
                </div>
                <button 
                  className="bg-green-500 text-white px-4 py-2 
                  rounded-full hover:bg-green-600 
                  transition-colors"
                >
                  Join
                </button>
              </div>
              <div 
                className="bg-teal-50 p-4 rounded-2xl 
                flex items-center justify-between 
                hover:shadow-lg transition-all transform hover:scale-105"
              >
                <div>
                  <h3 className="text-xl font-bold text-teal-900">
                    Strategy Masters
                  </h3>
                  <p className="text-sm text-teal-700">
                    Every Sunday • 11 AM
                  </p>
                </div>
                <button 
                  className="bg-teal-500 text-white px-4 py-2 
                  rounded-full hover:bg-teal-600 
                  transition-colors"
                >
                  Join
                </button>
              </div>
            </div>

            <button 
              className="mt-6 w-full bg-gradient-to-r from-green-600 to-teal-600 
              text-white py-3 rounded-full 
              hover:from-green-700 hover:to-teal-700 
              transition-all transform hover:scale-105 
              shadow-md font-bold"
            >
              📅 View Full Schedule
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default KidsChessDashboard;