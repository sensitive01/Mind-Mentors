import React, { useState, useEffect } from "react";
import {
  Star,
  Trophy,
  Medal,
  Crown,
  Target,
  Award,
  Zap,
  Sparkles,
} from "lucide-react";

const KidsAchievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [tournamentAchievements, setTournamentAchievements] = useState([]);

  useEffect(() => {
    // Simulate fetching tournament wins from API
    const fetchTournamentWins = async () => {
      // Mock tournament wins data
      const mockTournamentWins = [
        {
          tournamentId: "687f32f6ebab2abe218b9395",
          tournamentName: "Chess Championship",
          position: 1, // 1st place
          date: "2025-07-12",
          participants: 45,
        },
        {
          tournamentId: "687f32f6ebab2abe218b9396",
          tournamentName: "Online Chess Battle",
          position: 2, // 2nd place
          date: "2025-07-15",
          participants: 32,
        },
      ];

      // Convert tournament wins to achievements
      const tournamentAchievements = mockTournamentWins.map((win, index) => ({
        id: `tournament_${win.tournamentId}`,
        title: getTournamentTitle(win.position, win.tournamentName),
        description: `${getPositionText(win.position)} in ${
          win.tournamentName
        } with ${win.participants} participants!`,
        icon: getTournamentIcon(win.position),
        progress: 100,
        unlocked: true,
        category: "tournament",
        position: win.position,
        date: win.date,
        tournamentName: win.tournamentName,
      }));

      setTournamentAchievements(tournamentAchievements);
    };

    fetchTournamentWins();
  }, []);

  useEffect(() => {
    // Combine base achievements with tournament achievements
    setAchievements([...tournamentAchievements,]);
  }, [tournamentAchievements]);

  const getTournamentTitle = (position, tournamentName) => {
    switch (position) {
      case 1:
        return `🥇 ${tournamentName} Champion`;
      case 2:
        return `🥈 ${tournamentName} Runner-up`;
      case 3:
        return `🥉 ${tournamentName} 3rd Place`;
      default:
        return `🏆 ${tournamentName} Participant`;
    }
  };

  const getPositionText = (position) => {
    switch (position) {
      case 1:
        return "1st Place";
      case 2:
        return "2nd Place";
      case 3:
        return "3rd Place";
      default:
        return `${position}th Place`;
    }
  };

  const getTournamentIcon = (position) => {
    switch (position) {
      case 1:
        return <Crown className="w-8 h-8 text-yellow-500" />;
      case 2:
        return <Award className="w-8 h-8 text-gray-400" />;
      case 3:
        return <Medal className="w-8 h-8 text-orange-600" />;
      default:
        return <Target className="w-8 h-8 text-blue-500" />;
    }
  };

  const getAchievementStyle = (achievement) => {
    if (achievement.category === "tournament") {
      switch (achievement.position) {
        case 1:
          return "bg-gradient-to-br from-yellow-100 to-yellow-200 border-2 border-yellow-300";
        case 2:
          return "bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-gray-300";
        case 3:
          return "bg-gradient-to-br from-orange-100 to-orange-200 border-2 border-orange-300";
        default:
          return "bg-gradient-to-br from-blue-100 to-blue-200 border-2 border-blue-300";
      }
    }
    return achievement.unlocked ? "bg-white" : "bg-gray-100";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="p-6  bg-gradient-to-b from-primary/90 to-primary/70 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2 text-center">
          My Awesome Achievements! 🌟
        </h1>
        <p className="text-center text-white mb-8">
          Keep learning and playing to unlock more achievements!
        </p>

        {/* Tournament Achievements Section */}
        {tournamentAchievements.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Trophy className="w-6 h-6 mr-2" />
              Tournament Victories
              <Sparkles className="w-5 h-5 ml-2 text-yellow-500" />
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tournamentAchievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl ${getAchievementStyle(
                    achievement
                  )}`}
                >
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="p-3 bg-white/80 rounded-full shadow-md">
                      {achievement.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 mb-1">
                        {achievement.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {achievement.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        Won on {formatDate(achievement.date)}
                      </p>
                    </div>
                    <div className="w-full bg-green-200 rounded-full h-3">
                      <div className="bg-green-500 h-3 rounded-full w-full animate-pulse" />
                    </div>
                    <div className="bg-green-100 px-3 py-1 rounded-full">
                      <span className="text-green-700 font-bold text-sm">
                        🎉 Achieved!
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KidsAchievements;
