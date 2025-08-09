import React, { useState, useEffect } from "react";
import {
  MessageCircle,
  Bot,
  X,
  ChevronRight,
  Star,
  Shield,
  Target,
  Trophy,
  Users,
  BookOpen,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Phone,
  ArrowRight,
  Gamepad2,
  BarChart3,
  Heart,
  Zap,
  RefreshCw,
} from "lucide-react";
import { getChessKidUserName } from "../../../../api/service/parent/ParentService";
import { useNavigate } from "react-router-dom";

const ChessKidPractice = () => {
  const navigate = useNavigate();
  const [usernames, setUsernames] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedName, setSelectedName] = useState(null);
  const [sendingToBackend, setSendingToBackend] = useState(false);

  // AI Assistant states
  const [showAssistant, setShowAssistant] = useState(false);
  const [assistantStep, setAssistantStep] = useState("greeting");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getChessKidUserName();

      if (response.status === 200) {
        setUsernames(response.data.userName);
        setCurrentIndex(0);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error fetching ChessKid usernames:", error.message);
      setError("Failed to load usernames");
      setUsernames([]);
    } finally {
      setLoading(false);
    }
  };

  const sendNameToBackend = async (username) => {
    try {
      setSendingToBackend(true);
      setSelectedName(username);

      // Replace this URL with your actual backend endpoint
      const response = await fetch("/api/selected-username", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });

      if (!response.ok) {
        throw new Error("Failed to send username to backend");
      }

      const result = await response.json();
      console.log("Username sent successfully:", result);

      // Show success feedback
      setTimeout(() => setSelectedName(null), 2000);
    } catch (error) {
      console.error("Error sending username to backend:", error);
      setSelectedName(null);
      alert("Failed to send username to backend. Please try again.");
    } finally {
      setSendingToBackend(false);
    }
  };

  const handleConnectTeam = () => {
    navigate("/parent/support");
  };

  useEffect(() => {
    fetchData();

    // Show AI assistant after 3 seconds
    const timer = setTimeout(() => {
      setShowAssistant(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Auto-advance slider every 4 seconds
  useEffect(() => {
    if (usernames.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % usernames.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [usernames.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % usernames.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + usernames.length) % usernames.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // AI Assistant Component
  const AIAssistant = () => {
    if (!showAssistant) return null;

    return (
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-80 max-h-[480px] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-3 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-medium text-sm">ChessKid Assistant</h3>
                  <p className="text-xs opacity-90">Here to help</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowAssistant(false);
                  setAssistantStep("greeting");
                }}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-3 max-h-[400px] overflow-y-auto">
            {assistantStep === "greeting" && (
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="bg-gray-100 rounded-xl rounded-tl-none p-2 flex-1">
                    <p className="text-gray-800 text-sm">
                      Hi! I'm here to help you understand ChessKid and assist
                      with selecting the perfect username for your child. What
                      would you like to know?
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => setAssistantStep("why_chesskid")}
                    className="w-full p-2 text-left bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-purple-600" />
                      <span className="text-purple-700 font-medium text-sm">
                        Why ChessKid for My Child?
                      </span>
                    </div>
                    <p className="text-purple-600 text-xs mt-1">
                      Learn about the benefits and safety features
                    </p>
                  </button>

                  <button
                    onClick={() => setAssistantStep("username_help")}
                    className="w-full p-2 text-left bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-blue-600" />
                      <span className="text-blue-700 font-medium text-sm">
                        Help Me Choose Username
                      </span>
                    </div>
                    <p className="text-blue-600 text-xs mt-1">
                      Tips for selecting the best username
                    </p>
                  </button>

                  <button
                    onClick={() => setAssistantStep("how_it_works")}
                    className="w-full p-2 text-left bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Gamepad2 className="w-4 h-4 text-green-600" />
                      <span className="text-green-700 font-medium text-sm">
                        How Does ChessKid Work?
                      </span>
                    </div>
                    <p className="text-green-600 text-xs mt-1">
                      Understanding the platform features
                    </p>
                  </button>

                  <button
                    onClick={handleConnectTeam}
                    className="w-full p-2 text-left bg-orange-50 hover:bg-orange-100 rounded-lg border border-orange-200 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-orange-600" />
                      <span className="text-orange-700 font-medium text-sm">
                        Connect with Our Team
                      </span>
                    </div>
                    <p className="text-orange-600 text-xs mt-1">
                      Need personal assistance? Talk to us!
                    </p>
                  </button>

                  <button
                    onClick={() => setShowAssistant(false)}
                    className="w-full p-2 text-left bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-700 font-medium text-sm">
                        I'm all set!
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {assistantStep === "why_chesskid" && (
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="bg-gray-100 rounded-xl rounded-tl-none p-2 flex-1">
                    <p className="text-gray-800 text-sm">
                      Here's why ChessKid is perfect for your child:
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-1">
                      <Shield className="w-4 h-4 text-green-600" />
                      <span className="text-green-800 font-medium text-sm">
                        100% Safe Environment
                      </span>
                    </div>
                    <ul className="text-green-700 text-xs space-y-1 list-disc pl-4">
                      <li>No chat with strangers - only approved messages</li>
                      <li>Moderated content and kid-friendly interface</li>
                      <li>COPPA compliant and privacy protected</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-1">
                      <BarChart3 className="w-4 h-4 text-blue-600" />
                      <span className="text-blue-800 font-medium text-sm">
                        Track Real Progress
                      </span>
                    </div>
                    <ul className="text-blue-700 text-xs space-y-1 list-disc pl-4">
                      <li>Detailed progress reports for parents</li>
                      <li>Skill assessments and improvement areas</li>
                      <li>Game analysis and learning recommendations</li>
                    </ul>
                  </div>

                  <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                    <div className="flex items-center gap-2 mb-1">
                      <Heart className="w-4 h-4 text-purple-600" />
                      <span className="text-purple-800 font-medium text-sm">
                        Fun & Engaging Learning
                      </span>
                    </div>
                    <ul className="text-purple-700 text-xs space-y-1 list-disc pl-4">
                      <li>Interactive lessons with fun characters</li>
                      <li>Puzzle solving and mini-games</li>
                      <li>Achievement badges and rewards system</li>
                    </ul>
                  </div>
                </div>

                <button
                  onClick={() => setAssistantStep("greeting")}
                  className="w-full p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                >
                  ← Back to Menu
                </button>
              </div>
            )}

            {assistantStep === "username_help" && (
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="bg-gray-100 rounded-xl rounded-tl-none p-2 flex-1">
                    <p className="text-gray-800 text-sm">
                      Here's how to choose the perfect username for your child:
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                    <div className="flex items-center gap-2 mb-1">
                      <Target className="w-4 h-4 text-yellow-600" />
                      <span className="text-yellow-800 font-medium text-sm">
                        What Makes a Good Username?
                      </span>
                    </div>
                    <ul className="text-yellow-700 text-xs space-y-1 list-disc pl-4">
                      <li>Easy to remember and spell</li>
                      <li>Something your child likes or relates to</li>
                      <li>Avoids personal information (real name, age)</li>
                      <li>Positive and fun sounding</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-1">
                      <Zap className="w-4 h-4 text-blue-600" />
                      <span className="text-blue-800 font-medium text-sm">
                        Quick Selection Tips
                      </span>
                    </div>
                    <ul className="text-blue-700 text-xs space-y-1 list-disc pl-4">
                      <li>Browse through the slider to see all options</li>
                      <li>Click on any username in the list below</li>
                      <li>Consider names with chess themes</li>
                      <li>Think about what your child would enjoy</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertCircle className="w-4 h-4 text-green-600" />
                      <span className="text-green-800 font-medium text-sm">
                        Don't Worry!
                      </span>
                    </div>
                    <p className="text-green-700 text-xs">
                      You can always change the username later if needed. Our
                      team can help you with any adjustments.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setAssistantStep("greeting")}
                  className="w-full p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  ← Back to Menu
                </button>
              </div>
            )}

            {assistantStep === "how_it_works" && (
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="bg-gray-100 rounded-xl rounded-tl-none p-2 flex-1">
                    <p className="text-gray-800 text-sm">
                      Here's what your child can do on ChessKid:
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                    <div className="flex items-center gap-2 mb-1">
                      <BookOpen className="w-4 h-4 text-purple-600" />
                      <span className="text-purple-800 font-medium text-sm">
                        Interactive Lessons
                      </span>
                    </div>
                    <p className="text-purple-700 text-xs">
                      Step-by-step tutorials with fun characters that teach
                      chess basics, tactics, and strategy in an engaging way.
                    </p>
                  </div>

                  <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="w-4 h-4 text-orange-600" />
                      <span className="text-orange-800 font-medium text-sm">
                        Safe Online Play
                      </span>
                    </div>
                    <p className="text-orange-700 text-xs">
                      Play chess games with other kids worldwide in a completely
                      safe, moderated environment with no inappropriate content.
                    </p>
                  </div>

                  <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                    <div className="flex items-center gap-2 mb-1">
                      <Trophy className="w-4 h-4 text-red-600" />
                      <span className="text-red-800 font-medium text-sm">
                        Puzzles & Challenges
                      </span>
                    </div>
                    <p className="text-red-700 text-xs">
                      Solve daily puzzles, participate in tournaments, and earn
                      achievement badges to keep learning fun and rewarding.
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 p-2 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertCircle className="w-4 h-4 text-blue-600" />
                    <span className="text-blue-800 font-medium text-sm">
                      Parent Dashboard
                    </span>
                  </div>
                  <p className="text-blue-700 text-xs">
                    You'll get access to detailed progress reports showing your
                    child's improvement, time spent learning, and areas to focus
                    on.
                  </p>
                </div>

                <button
                  onClick={() => setAssistantStep("greeting")}
                  className="w-full p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  ← Back to Menu
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading usernames...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Error Loading Data
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchData}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (usernames.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-md">
          <div className="text-gray-400 text-5xl mb-4">📝</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            No Usernames Available
          </h2>
          <button
            onClick={fetchData}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Enhanced Header with Benefits */}
        <div className="mb-8">
          {/* Header with button on top right */}
          <div className="flex justify-between items-start mb-4">
            <div className="text-center flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                ChessKid Practice
              </h1>
              <p className="text-gray-600">
                Select a username to get your child started with safe online
                chess practice
              </p>
            </div>
            <button
              onClick={fetchData}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors flex items-center gap-2 ml-4 flex-shrink-0"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              {loading ? "Loading..." : "Get New Usernames"}
            </button>
          </div>

          {/* Benefits Banner */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-200">
            <div className="flex items-center justify-center gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-gray-700">
                  100% Safe
                </span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">
                  Track Progress
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-600" />
                <span className="text-sm font-medium text-gray-700">
                  Fun Learning
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Slider */}
        <div className="bg-white rounded-lg shadow-md mb-8 overflow-hidden">
          {/* Featured Username Display */}
          <div className="relative bg-gray-100 p-8 text-center">
            <div className="text-4xl font-bold text-gray-800 mb-2">
              {usernames[currentIndex]}
            </div>
            <div className="text-gray-500 text-sm mb-6">
              {currentIndex + 1} of {usernames.length}
            </div>
            <button
              onClick={() => sendNameToBackend(usernames[currentIndex])}
              disabled={sendingToBackend}
              className={`px-6 py-2 rounded font-medium transition-colors ${
                selectedName === usernames[currentIndex]
                  ? "bg-green-600 text-white"
                  : sendingToBackend
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-primary hover:bg-primary text-white"
              }`}
            >
              {selectedName === usernames[currentIndex]
                ? "✓ Selected"
                : sendingToBackend
                ? "Sending..."
                : "Select This Username"}
            </button>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-50 text-gray-600 p-2 rounded-full shadow-md transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-50 text-gray-600 p-2 rounded-full shadow-md transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center space-x-2 py-4 bg-white">
            {usernames.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex
                    ? "bg-primary"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Username List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
            All Available Usernames
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {usernames.map((username, index) => (
              <div
                key={index}
                onClick={() => goToSlide(index)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  index === currentIndex
                    ? "border-primary bg-blue-50"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <div className="text-center">
                  <div className="font-medium text-gray-800 mb-3">
                    {username}
                  </div>
                  {index === currentIndex && (
                    <div className="text-xs text-indigo-600 mb-2">
                      Currently showing
                    </div>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      sendNameToBackend(username);
                    }}
                    disabled={sendingToBackend}
                    className={`w-full py-1 px-3 text-sm rounded font-medium transition-colors ${
                      selectedName === username
                        ? "bg-green-600 text-white"
                        : sendingToBackend
                        ? "bg-gray-400 text-white cursor-not-allowed"
                        : "bg-primary hover:bg-primary text-white"
                    }`}
                  >
                    {selectedName === username
                      ? "✓ Selected"
                      : sendingToBackend
                      ? "Sending..."
                      : "Select"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Success Message */}
        {selectedName && (
          <div className="mt-6 text-center">
            <div className="inline-block bg-green-100 border border-green-300 text-green-700 px-4 py-2 rounded">
              Successfully sent "{selectedName}" to backend!
            </div>
          </div>
        )}

        {/* Auto-advance Info */}
        <div className="mt-6 text-center text-sm text-gray-500">
          Auto-advancing every 4 seconds
        </div>
      </div>

      {/* AI Assistant */}
      <AIAssistant />

      {/* Chat trigger when assistant is closed */}
      {!showAssistant && (
        <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={() => setShowAssistant(true)}
            className="w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center group hover:scale-110"
          >
            <MessageCircle className="w-7 h-7 group-hover:scale-110 transition-transform" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
              <span className="text-xs text-white font-bold">!</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default ChessKidPractice;
