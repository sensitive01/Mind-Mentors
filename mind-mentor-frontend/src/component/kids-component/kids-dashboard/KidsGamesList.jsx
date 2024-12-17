import React, { useState } from "react";
import { 
  Gamepad2, 
  Puzzle, 
  Rocket, 
  PawPrint, 
  Brain, 
  Trophy, 
  Lock, 
  Unlock 
} from "lucide-react";

const KidsGamesList = () => {
  const [unlockedGames, setUnlockedGames] = useState([
    "Chess Adventure",
    "Puzzle Master"
  ]);

  const gameCategories = [
    {
      id: 1,
      name: "Chess Games",
      icon: <Gamepad2 className="w-12 h-12 text-orange-600" />,
      games: [
        {
          title: "Chess Adventure",
          description: "Explore chess kingdoms and solve strategic puzzles!",
          difficulty: "Beginner",
          locked: false,
          icon: "♟️",
          color: "bg-orange-100"
        },
        {
          title: "Speed Chess Challenge",
          description: "Race against the clock in quick chess matches!",
          difficulty: "Intermediate",
          locked: true,
          icon: "⏱️",
          color: "bg-orange-200"
        }
      ]
    },
    {
      id: 2,
      name: "Brain Teasers",
      icon: <Brain className="w-12 h-12 text-orange-600" />,
      games: [
        {
          title: "Puzzle Master",
          description: "Solve mind-bending puzzles and logic challenges!",
          difficulty: "Beginner",
          locked: false,
          icon: "🧩",
          color: "bg-orange-150"
        },
        {
          title: "Memory Matrix",
          description: "Test and improve your memory skills!",
          difficulty: "Advanced",
          locked: true,
          icon: "🧠",
          color: "bg-orange-225"
        }
      ]
    },
    {
      id: 3,
      name: "Strategy Quest",
      icon: <Rocket className="w-12 h-12 text-orange-600" />,
      games: [
        {
          title: "Castle Conquest",
          description: "Build your kingdom and defend your castle!",
          difficulty: "Intermediate",
          locked: true,
          icon: "🏰",
          color: "bg-orange-175"
        },
        {
          title: "Space Strategist",
          description: "Navigate through cosmic challenges!",
          difficulty: "Advanced",
          locked: true,
          icon: "🚀",
          color: "bg-orange-125"
        }
      ]
    }
  ];

  const handleGameUnlock = (gameTitle) => {
    if (!unlockedGames.includes(gameTitle)) {
      setUnlockedGames([...unlockedGames, gameTitle]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-orange-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-orange-600 mb-4 animate-bounce">
            🎮 Kids Game Zone 🧩
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Exciting educational games that make learning fun and challenging!
          </p>
        </div>

        {/* Game Categories */}
        <div className="space-y-8">
          {gameCategories.map((category) => (
            <div key={category.id} className="bg-white/80 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center mb-6">
                {category.icon}
                <h2 className="text-3xl font-bold ml-4 text-orange-900">{category.name}</h2>
              </div>

              {/* Games Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {category.games.map((game) => (
                  <div 
                    key={game.title}
                    className={`${game.color} rounded-2xl overflow-hidden 
                      shadow-md transform hover:scale-105 transition-all duration-300
                      border-2 border-orange-200/50`}
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-4">
                          <span className="text-5xl">{game.icon}</span>
                          <div>
                            <h3 className="text-xl font-bold text-orange-900">{game.title}</h3>
                            <span className="text-sm text-orange-700 font-medium">
                              {game.difficulty} Level
                            </span>
                          </div>
                        </div>
                        {game.locked ? (
                          <Lock className="w-8 h-8 text-orange-500 opacity-60" />
                        ) : (
                          <Unlock className="w-8 h-8 text-green-500" />
                        )}
                      </div>

                      <p className="text-sm text-orange-800 mb-4 italic">
                        {game.description}
                      </p>

                      <button
                        onClick={() => handleGameUnlock(game.title)}
                        disabled={!game.locked}
                        className={`w-full py-3 px-4 rounded-xl font-bold text-sm
                          ${game.locked 
                            ? 'bg-orange-300 text-orange-900 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700'}
                          transform active:scale-95 transition-all duration-200
                          flex items-center justify-center space-x-2`}
                      >
                        {game.locked ? 'Locked' : 'Play Now!'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Achievements Section */}
        <div className="mt-12 text-center bg-white/80 rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-orange-600 mb-6">
            🏆 Achievements Unlocked
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-orange-50 p-4 rounded-xl">
              <Trophy className="w-12 h-12 mx-auto text-orange-500 mb-2" />
              <h4 className="font-bold text-orange-900">Game Explorer</h4>
              <p className="text-sm text-orange-700">Completed first game!</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-xl">
              <PawPrint className="w-12 h-12 mx-auto text-orange-500 mb-2" />
              <h4 className="font-bold text-orange-900">Learning Path</h4>
              <p className="text-sm text-orange-700">Started your gaming journey</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-xl">
              <Puzzle className="w-12 h-12 mx-auto text-orange-500 mb-2" />
              <h4 className="font-bold text-orange-900">Problem Solver</h4>
              <p className="text-sm text-orange-700">Solved first puzzle</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KidsGamesList;