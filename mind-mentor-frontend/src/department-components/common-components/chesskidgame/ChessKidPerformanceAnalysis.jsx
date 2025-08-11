import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Trophy,
  Target,
  Clock,
  Brain,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { getChessKidPerformance } from "../../../api/service/employee/EmployeeService";

const ChessKidPerformanceAnalysis = () => {
  const { chessKidId } = useParams();
  const [performanceData, setPerformanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getChessKidPerformance(chessKidId);
        if (response.status === 200) {
          const responseData = response.data;
          console.log("API Response:", responseData);

          // Handle different response formats
          let latestData;
          let allDataEntries = [];

          if (responseData.data && Array.isArray(responseData.data)) {
            allDataEntries = responseData.data;
            latestData = responseData.data[responseData.data.length - 1];
          } else if (responseData.data) {
            latestData = responseData.data;
            allDataEntries = [responseData.data];
          } else if (Array.isArray(responseData)) {
            allDataEntries = responseData;
            latestData = responseData[responseData.length - 1];
          } else {
            latestData = responseData;
            allDataEntries = [responseData];
          }

          if (latestData && latestData.alltime && latestData.last7days) {
            setPerformanceData({
              current: latestData,
              history: allDataEntries,
            });
            setError(null);
          } else {
            throw new Error("Invalid data structure received from API");
          }
        }
      } catch (error) {
        console.error("Error fetching performance data:", error);
        setError("Failed to load performance data: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    if (chessKidId) {
      fetchData();
    }
  }, [chessKidId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading performance data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="text-xl font-semibold mb-2">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!performanceData?.current?.alltime || !performanceData?.current?.last7days) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="text-xl font-semibold mb-2">Data Error</p>
          <p>Performance data is missing</p>
        </div>
      </div>
    );
  }

  const currentData = performanceData.current;
  const historyData = performanceData.history || [currentData];

  // Safe access with default values
  const safeGetStats = (statsObj) => {
    return statsObj || { wins: 0, draws: 0, losses: 0, ratingChange: 0 };
  };

  const blitzStats = safeGetStats(currentData.alltime?.blitzStats);
  const puzzleStats = currentData.alltime?.puzzleStats || { correct: 0, attempted: 0, ratingChange: 0 };
  const slowChessStats = safeGetStats(currentData.alltime?.slowChessStats);

  // Generate daily improvement tracking from real API data using createdAt
  const generateDailyImprovement = () => {
    if (historyData.length === 0) return [];

    console.log("Processing data with createdAt timestamps:", historyData);

    // Process each entry with actual createdAt date
    const processedData = historyData.map((entry, index) => {
      let entryDate;
      let displayDate;
      
      try {
        // Use createdAt timestamp
        if (entry.createdAt) {
          entryDate = new Date(entry.createdAt);
          displayDate = entryDate.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
        } else {
          // Fallback to ObjectId timestamp
          const objectId = entry._id;
          const timestamp = parseInt(objectId.substring(0, 8), 16) * 1000;
          entryDate = new Date(timestamp);
          displayDate = entryDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
        
        console.log(`Entry ${index + 1}: ${entry.createdAt} -> ${displayDate}`);
        
      } catch (error) {
        console.error("Error processing date:", error);
        entryDate = new Date();
        displayDate = `Entry ${index + 1}`;
      }

      return {
        date: displayDate,
        actualDate: entryDate,
        fullTimestamp: entry.createdAt,
        // The 3 ratings you want on Y-axis
        "Blitz Rating": entry.blitzRating || 800,
        "Puzzle Rating": entry.puzzleRating || 800,
        "Slow Chess Rating": entry.slowChessRating || 800,
        // Additional useful metrics
        "Games Played": (entry.alltime?.blitzStats?.wins || 0) + (entry.alltime?.blitzStats?.draws || 0) + (entry.alltime?.blitzStats?.losses || 0),
        "Puzzles Solved": entry.alltime?.puzzleStats?.correct || 0,
        "Win Rate": (() => {
          const totalGames = (entry.alltime?.blitzStats?.wins || 0) + (entry.alltime?.blitzStats?.draws || 0) + (entry.alltime?.blitzStats?.losses || 0);
          return totalGames > 0 ? parseFloat(((entry.alltime?.blitzStats?.wins || 0) / totalGames * 100).toFixed(1)) : 0;
        })(),
      };
    }).sort((a, b) => a.actualDate - b.actualDate); // Sort by actual date

    console.log("Processed daily data:", processedData);
    return processedData;
  };

  const dailyImprovementData = generateDailyImprovement();

  // Calculate improvement metrics
  const totalGames = blitzStats.wins + blitzStats.draws + blitzStats.losses;
  const winRate = totalGames > 0 ? ((blitzStats.wins / totalGames) * 100).toFixed(1) : 0;
  const puzzleAccuracy = puzzleStats.attempted > 0 ? ((puzzleStats.correct / puzzleStats.attempted) * 100).toFixed(1) : 0;

  // Current performance level
  const getPerformanceLevel = () => {
    const avgRating = (currentData.blitzRating + currentData.puzzleRating) / 2;
    if (avgRating >= 1200) return { level: "Advanced", color: "green", icon: "🏆" };
    if (avgRating >= 900) return { level: "Intermediate", color: "blue", icon: "⭐" };
    if (avgRating >= 600) return { level: "Beginner+", color: "yellow", icon: "📈" };
    return { level: "Beginner", color: "gray", icon: "🎯" };
  };

  const performanceLevel = getPerformanceLevel();

  const StatCard = ({ title, value, icon, subtitle, color = "blue", trend = null }) => (
    <div className={`bg-white rounded-xl shadow-lg p-6 border-l-4 border-${color}-500 hover:shadow-xl transition-all duration-300`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <div className="flex items-center space-x-2">
            <p className={`text-3xl font-bold text-${color}-600 mt-1`}>{value}</p>
            {trend && (
              <span className={`text-sm px-2 py-1 rounded-full ${trend > 0 ? 'bg-green-100 text-green-800' : trend < 0 ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                {trend > 0 ? `+${trend}` : trend}
              </span>
            )}
          </div>
          {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 bg-${color}-100 rounded-full`}>{icon}</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                {currentData.firstName || "Unknown"} {currentData.lastName || "Player"}
              </h1>
              <p className="text-gray-600 text-lg">@{currentData.username || "unknown"}</p>
              <div className="flex items-center mt-4 space-x-4">
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                  {currentData.level || "N/A"}
                </span>
                <span className={`bg-${performanceLevel.color}-100 text-${performanceLevel.color}-800 px-3 py-1 rounded-full text-sm font-medium`}>
                  {performanceLevel.icon} {performanceLevel.level}
                </span>
              </div>
            </div>
            <div className="text-right">
              <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-2" />
              <p className="text-gray-600">Chess Improvement Monitor</p>
            </div>
          </div>
        </div>

        {/* Key Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Blitz Rating (Play)"
            value={currentData.blitzRating || 800}
            icon={<Target className="w-6 h-6 text-green-600" />}
            color="green"
            trend={blitzStats.ratingChange}
            subtitle={`${winRate}% win rate`}
          />
          <StatCard
            title="Puzzle Rating"
            value={currentData.puzzleRating || 800}
            icon={<Brain className="w-6 h-6 text-blue-600" />}
            color="blue"
            trend={puzzleStats.ratingChange}
            subtitle={`${puzzleAccuracy}% accuracy`}
          />
          <StatCard
            title="Slow Chess Rating"
            value={currentData.slowChessRating || 800}
            icon={<Clock className="w-6 h-6 text-purple-600" />}
            color="purple"
            trend={slowChessStats.ratingChange}
            subtitle={`${slowChessStats.wins + slowChessStats.draws + slowChessStats.losses} games`}
          />
        </div>

        {/* Main Improvement Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
            <TrendingUp className="w-6 h-6 mr-3 text-green-600" />
            Chess Ratings Over Time (Real Data)
          </h3>
          
          {dailyImprovementData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={450}>
                <LineChart data={dailyImprovementData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 11 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    interval={0}
                  />
                  <YAxis 
                    label={{ value: 'Chess Rating', angle: -90, position: 'insideLeft' }}
                    domain={['dataMin - 50', 'dataMax + 100']}
                  />
                  <Tooltip 
                    formatter={(value, name) => [value, name]}
                    labelFormatter={(label) => `Date/Time: ${label}`}
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #ccc',
                      borderRadius: '12px',
                      boxShadow: '0 8px 25px -8px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend />
                  
                  {/* All 3 Rating Lines */}
                  <Line 
                    type="monotone" 
                    dataKey="Blitz Rating" 
                    stroke="#10b981" 
                    strokeWidth={4}
                    dot={{ fill: "#10b981", r: 6, strokeWidth: 2 }}
                    activeDot={{ r: 8, stroke: "#10b981", strokeWidth: 3, fill: "#fff" }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Puzzle Rating" 
                    stroke="#3b82f6" 
                    strokeWidth={4}
                    dot={{ fill: "#3b82f6", r: 6, strokeWidth: 2 }}
                    activeDot={{ r: 8, stroke: "#3b82f6", strokeWidth: 3, fill: "#fff" }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Slow Chess Rating" 
                    stroke="#8b5cf6" 
                    strokeWidth={4}
                    dot={{ fill: "#8b5cf6", r: 6, strokeWidth: 2 }}
                    activeDot={{ r: 8, stroke: "#8b5cf6", strokeWidth: 3, fill: "#fff" }}
                  />
                </LineChart>
              </ResponsiveContainer>
              
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="font-semibold text-gray-700 mb-1">📊 Data Points:</p>
                    <p>{dailyImprovementData.length} real entries</p>
                    <p className="text-xs text-gray-600">
                      From: {dailyImprovementData[0]?.date}<br/>
                      To: {dailyImprovementData[dailyImprovementData.length - 1]?.date}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700 mb-1">🎯 Current Ratings:</p>
                    <p className="text-green-600">Blitz: {currentData.blitzRating}</p>
                    <p className="text-blue-600">Puzzle: {currentData.puzzleRating}</p>
                    <p className="text-purple-600">Slow Chess: {currentData.slowChessRating}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700 mb-1">📈 Overall Changes:</p>
                    <p className={`${blitzStats.ratingChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      Blitz: {blitzStats.ratingChange >= 0 ? '+' : ''}{blitzStats.ratingChange}
                    </p>
                    <p className={`${puzzleStats.ratingChange >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                      Puzzle: {puzzleStats.ratingChange >= 0 ? '+' : ''}{puzzleStats.ratingChange}
                    </p>
                    <p className={`${slowChessStats.ratingChange >= 0 ? 'text-purple-600' : 'text-red-600'}`}>
                      Slow: {slowChessStats.ratingChange >= 0 ? '+' : ''}{slowChessStats.ratingChange}
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <div className="text-center">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg">No rating data available yet</p>
                <p className="text-sm">Data will appear as chess games are played</p>
              </div>
            </div>
          )}
        </div>

        {/* Game Results Analysis */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
          {/* Blitz Games Win/Loss/Draw Pie Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-green-600" />
              Blitz Game Results
            </h3>
            {totalGames > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Wins", value: blitzStats.wins, color: "#10b981" },
                        { name: "Draws", value: blitzStats.draws, color: "#f59e0b" },
                        { name: "Losses", value: blitzStats.losses, color: "#ef4444" }
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, value, percent }) =>
                        `${name}: ${value} (${(percent * 100).toFixed(1)}%)`
                      }
                      labelLine={false}
                    >
                      <Cell fill="#10b981" />
                      <Cell fill="#f59e0b" />
                      <Cell fill="#ef4444" />
                    </Pie>
                    <Tooltip 
                      formatter={(value, name) => [value, `${name} Games`]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{blitzStats.wins}</p>
                    <p className="text-sm text-green-700">Wins</p>
                    <p className="text-xs text-gray-600">{((blitzStats.wins / totalGames) * 100).toFixed(1)}%</p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <p className="text-2xl font-bold text-yellow-600">{blitzStats.draws}</p>
                    <p className="text-sm text-yellow-700">Draws</p>
                    <p className="text-xs text-gray-600">{((blitzStats.draws / totalGames) * 100).toFixed(1)}%</p>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg">
                    <p className="text-2xl font-bold text-red-600">{blitzStats.losses}</p>
                    <p className="text-sm text-red-700">Losses</p>
                    <p className="text-xs text-gray-600">{((blitzStats.losses / totalGames) * 100).toFixed(1)}%</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                <div className="text-center">
                  <Target className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg">No games played yet</p>
                  <p className="text-sm">Start playing blitz games to see results</p>
                </div>
              </div>
            )}
          </div>

          {/* Puzzle Performance */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Brain className="w-5 h-5 mr-2 text-blue-600" />
              Puzzle Performance
            </h3>
            {puzzleStats.attempted > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Correct", value: puzzleStats.correct, color: "#10b981" },
                        { name: "Incorrect", value: puzzleStats.attempted - puzzleStats.correct, color: "#ef4444" }
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, value, percent }) =>
                        `${name}: ${value} (${(percent * 100).toFixed(1)}%)`
                      }
                      labelLine={false}
                    >
                      <Cell fill="#10b981" />
                      <Cell fill="#ef4444" />
                    </Pie>
                    <Tooltip 
                      formatter={(value, name) => [value, `${name} Puzzles`]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{puzzleStats.correct}</p>
                    <p className="text-sm text-green-700">Correct</p>
                    <p className="text-xs text-gray-600">{puzzleAccuracy}% accuracy</p>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg">
                    <p className="text-2xl font-bold text-red-600">{puzzleStats.attempted - puzzleStats.correct}</p>
                    <p className="text-sm text-red-700">Incorrect</p>
                    <p className="text-xs text-gray-600">{puzzleStats.attempted} total</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                <div className="text-center">
                  <Brain className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg">No puzzles attempted yet</p>
                  <p className="text-sm">Start solving puzzles to see accuracy</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Summary */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Performance Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-medium text-gray-700 mb-4 text-green-600">✅ Strengths</h4>
              <ul className="space-y-3">
                {blitzStats.ratingChange > 0 && (
                  <li className="flex items-center text-green-700 bg-green-50 p-3 rounded-lg">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Improving in Blitz games (+{blitzStats.ratingChange} points)
                  </li>
                )}
                {puzzleStats.ratingChange > 0 && (
                  <li className="flex items-center text-green-700 bg-green-50 p-3 rounded-lg">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Excellent puzzle progress (+{puzzleStats.ratingChange} points)
                  </li>
                )}
                {parseFloat(winRate) > 50 && (
                  <li className="flex items-center text-green-700 bg-green-50 p-3 rounded-lg">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Good win rate ({winRate}%)
                  </li>
                )}
                {parseFloat(puzzleAccuracy) > 60 && (
                  <li className="flex items-center text-green-700 bg-green-50 p-3 rounded-lg">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Strong puzzle accuracy ({puzzleAccuracy}%)
                  </li>
                )}
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-medium text-gray-700 mb-4 text-amber-600">🎯 Focus Areas</h4>
              <ul className="space-y-3">
                {blitzStats.ratingChange < 0 && (
                  <li className="flex items-center text-amber-700 bg-amber-50 p-3 rounded-lg">
                    <span className="w-2 h-2 bg-amber-500 rounded-full mr-3"></span>
                    Blitz rating needs attention ({blitzStats.ratingChange} points)
                  </li>
                )}
                {puzzleStats.attempted === 0 && (
                  <li className="flex items-center text-amber-700 bg-amber-50 p-3 rounded-lg">
                    <span className="w-2 h-2 bg-amber-500 rounded-full mr-3"></span>
                    Start solving puzzles to improve tactics
                  </li>
                )}
                {slowChessStats.wins + slowChessStats.draws + slowChessStats.losses === 0 && (
                  <li className="flex items-center text-amber-700 bg-amber-50 p-3 rounded-lg">
                    <span className="w-2 h-2 bg-amber-500 rounded-full mr-3"></span>
                    Try slow chess games for deeper thinking
                  </li>
                )}
                {currentData.alltime?.lessonCount === 0 && (
                  <li className="flex items-center text-amber-700 bg-amber-50 p-3 rounded-lg">
                    <span className="w-2 h-2 bg-amber-500 rounded-full mr-3"></span>
                    Consider taking chess lessons
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChessKidPerformanceAnalysis;