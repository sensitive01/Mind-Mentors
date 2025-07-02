import React, { useState } from "react";
import {
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  CheckCircle,
  Star,
  Sparkles,
  Send,
} from "lucide-react";
import mindmentorzLogo from "../../assets/newLogo.png";

const ClassFeedbackSystem = ({
  userType = "kid",
  classId = "default-class",
  sessionEnded = true,
  logoUrl = mindmentorzLogo,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [showThankYou, setShowThankYou] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const [coachFeedback, setCoachFeedback] = useState("");
  const [coachFeedbackSubmitted, setCoachFeedbackSubmitted] = useState(false);

  const [kidResponses, setKidResponses] = useState({});
  const [kidFeedbackSubmitted, setKidFeedbackSubmitted] = useState(false);

  const isCoach = userType === "coach";

  const kidQuestions = [
    {
      id: "understanding",
      question: "Did you understand today's lesson?",
      emoji: "🧠",
    },
    {
      id: "quality",
      question: "How was the class quality?",
      emoji: "⭐",
    },
    {
      id: "video_quality",
      question: "Was the video and audio clear?",
      emoji: "📹",
    },
    {
      id: "activities",
      question: "Did you enjoy the class activities?",
      emoji: "🎯",
    },
    {
      id: "engagement",
      question: "Were you engaged throughout the class?",
      emoji: "🚀",
    },
    {
      id: "pace",
      question: "Was the class pace just right for you?",
      emoji: "⏰",
    },
  ];

  // Handle kid question response
  const handleKidResponse = (questionId, rating) => {
    setKidResponses((prev) => ({
      ...prev,
      [questionId]: rating,
    }));
  };

  // Submit kid feedback
  const submitKidFeedback = async () => {
    const answeredQuestions = Object.keys(kidResponses).length;
    if (answeredQuestions < kidQuestions.length) {
      setMessage(
        `Please answer all questions! (${answeredQuestions}/${kidQuestions.length} completed)`
      );
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    // Calculate total score
    const totalScore = Object.values(kidResponses).reduce(
      (sum, rating) => sum + rating,
      0
    );

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setKidFeedbackSubmitted(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      setMessage(
        `🎉 Awesome! Your feedback score: ${totalScore}/${kidQuestions.length}`
      );
      setTimeout(() => setShowThankYou(true), 2000);
    } catch (error) {
      console.error("Error submitting kid feedback:", error);
      setMessage("Oops! Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit coach feedback
  const submitCoachFeedback = async () => {
    if (!coachFeedback.trim()) {
      setMessage("Please share your feedback before submitting! 💭");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setCoachFeedbackSubmitted(true);
      setMessage("✨ Your feedback has been shared with our team!");
      setTimeout(() => setShowThankYou(true), 2000);
    } catch (error) {
      console.error("Error submitting coach feedback:", error);
      setMessage("Oops! Failed to submit your feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate progress for kids
  const getProgress = () => {
    const answered = Object.keys(kidResponses).length;
    return (answered / kidQuestions.length) * 100;
  };

  return (
    <div className="h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex flex-col overflow-hidden">
      {/* Header with Logo - Fixed height */}
      <div className="flex-shrink-0 bg-primary backdrop-blur-sm border-b border-purple-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-2 sm:py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="Logo"
                className="h-8 sm:h-10 lg:h-12 w-auto"
              />
            ) : (
              <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Sparkles
                  className="text-white"
                  size={
                    window.innerWidth < 640
                      ? 16
                      : window.innerWidth < 1024
                      ? 20
                      : 24
                  }
                />
              </div>
            )}
            <span className="ml-1 sm:ml-2 font-bold text-gray-800 text-sm sm:text-base lg:text-lg hidden xs:block">
              Class Feedback
            </span>
          </div>

          {/* Status indicator */}
          <div className="text-xs sm:text-sm lg:text-base text-white bg-black/20 px-2 py-1 rounded-full">
            {isCoach ? "Coach View" : "Student View"}
          </div>
        </div>
      </div>

      {/* Main Content - Flexible height with internal scrolling */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full max-w-7xl mx-auto p-2 sm:p-4 lg:p-6 flex flex-col">
          {/* Thank You Overlay */}
          {showThankYou && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
              <div className="max-w-xs sm:max-w-sm w-full bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center shadow-2xl mx-2">
                <div className="mb-3 sm:mb-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto flex items-center justify-center">
                    <Sparkles
                      className="text-white"
                      size={window.innerWidth < 640 ? 24 : 32}
                    />
                  </div>
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">
                  Thanks for your feedback!
                </h2>

                <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                  Your input helps us make classes even better.
                </p>

                <button
                  onClick={() => setShowThankYou(false)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 sm:px-6 py-2 rounded-full font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 text-sm sm:text-base"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Confetti Effect */}
          {showConfetti && (
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-40">
              {[
                ...Array(
                  window.innerWidth < 640
                    ? 15
                    : window.innerWidth < 1024
                    ? 20
                    : 30
                ),
              ].map((_, i) => (
                <div
                  key={i}
                  className="absolute animate-bounce"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${1 + Math.random()}s`,
                  }}
                >
                  <Star
                    className="text-yellow-400"
                    size={
                      Math.random() * (window.innerWidth < 640 ? 8 : 12) +
                      (window.innerWidth < 640 ? 6 : 8)
                    }
                  />
                </div>
              ))}
            </div>
          )}

          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-white/50 overflow-hidden flex flex-col h-full">
            {/* Header Section - Fixed */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 sm:p-4 lg:p-6 flex-shrink-0">
              <div className="text-center">
                <h2 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold mb-1 sm:mb-2">
                  {isCoach
                    ? "🎯 Coach Feedback"
                    : "⭐ Tell Us About Your Class!"}
                </h2>
                <p className="text-purple-100 text-xs sm:text-sm lg:text-base">
                  {isCoach
                    ? "Share your session insights with our team"
                    : "Your feedback helps us make classes better!"}
                </p>
              </div>
            </div>

            {/* Content Area - Scrollable */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-3 sm:p-4 lg:p-6">
                {/* Kid Feedback Section */}
                {!isCoach && (
                  <div className="space-y-3 sm:space-y-4">
                    {/* Progress Bar */}
                    <div className="mb-4 sm:mb-6">
                      <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-2">
                        <span>Progress</span>
                        <span>
                          {Object.keys(kidResponses).length}/
                          {kidQuestions.length}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-1.5 sm:h-2 rounded-full transition-all duration-500"
                          style={{ width: `${getProgress()}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Questions */}
                    <div className="space-y-3 sm:space-y-4">
                      {kidQuestions.map((q, index) => (
                        <div
                          key={q.id}
                          className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200"
                        >
                          <div className="flex items-start mb-2 sm:mb-3">
                            <span className="text-lg sm:text-xl mr-2 flex-shrink-0">
                              {q.emoji}
                            </span>
                            <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-800 leading-tight">
                              {index + 1}. {q.question}
                            </h3>
                          </div>

                          <div className="flex justify-center space-x-4 sm:space-x-6 lg:space-x-8">
                            {/* Thumbs Up */}
                            <button
                              onClick={() => handleKidResponse(q.id, 1)}
                              disabled={kidResponses[q.id] !== undefined}
                              className={`p-2 sm:p-3 lg:p-4 rounded-full transition-all duration-300 transform hover:scale-110 active:scale-95 ${
                                kidResponses[q.id] === 1
                                  ? "bg-green-500 text-white shadow-lg"
                                  : kidResponses[q.id] === undefined
                                  ? "bg-green-100 text-green-600 hover:bg-green-200"
                                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
                              }`}
                            >
                              <ThumbsUp
                                size={
                                  window.innerWidth < 640
                                    ? 20
                                    : window.innerWidth < 1024
                                    ? 24
                                    : 28
                                }
                              />
                            </button>

                            {/* Thumbs Down */}
                            <button
                              onClick={() => handleKidResponse(q.id, -1)}
                              disabled={kidResponses[q.id] !== undefined}
                              className={`p-2 sm:p-3 lg:p-4 rounded-full transition-all duration-300 transform hover:scale-110 active:scale-95 ${
                                kidResponses[q.id] === -1
                                  ? "bg-red-500 text-white shadow-lg"
                                  : kidResponses[q.id] === undefined
                                  ? "bg-red-100 text-red-600 hover:bg-red-200"
                                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
                              }`}
                            >
                              <ThumbsDown
                                size={
                                  window.innerWidth < 640
                                    ? 20
                                    : window.innerWidth < 1024
                                    ? 24
                                    : 28
                                }
                              />
                            </button>
                          </div>

                          {/* Response indicator */}
                          {kidResponses[q.id] !== undefined && (
                            <div className="text-center mt-2 sm:mt-3">
                              <span
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  kidResponses[q.id] === 1
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                <CheckCircle size={12} className="mr-1" />
                                {kidResponses[q.id] === 1
                                  ? "Great!"
                                  : "Got it!"}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Score Display */}
                    {kidFeedbackSubmitted && (
                      <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-green-50 rounded-lg sm:rounded-xl border border-green-200">
                        <h3 className="text-base sm:text-lg font-bold text-green-700 mb-1">
                          Feedback Submitted!
                        </h3>
                        <p className="text-sm sm:text-base text-green-600 font-medium">
                          Your Score:{" "}
                          {Object.values(kidResponses).reduce(
                            (sum, rating) => sum + rating,
                            0
                          )}
                          /{kidQuestions.length}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Coach Feedback Section */}
                {isCoach && sessionEnded && (
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center mb-3 sm:mb-4">
                      <div className="bg-blue-500 p-1.5 sm:p-2 rounded-lg mr-2 sm:mr-3">
                        <MessageSquare
                          className="text-white"
                          size={window.innerWidth < 640 ? 16 : 20}
                        />
                      </div>
                      <h3 className="text-base sm:text-lg lg:text-xl font-bold text-blue-600">
                        Session Feedback
                      </h3>
                    </div>

                    {!coachFeedbackSubmitted ? (
                      <div className="space-y-3 sm:space-y-4">
                        <textarea
                          value={coachFeedback}
                          onChange={(e) => setCoachFeedback(e.target.value)}
                          placeholder="Share your feedback about the session:
• Student engagement levels
• Learning objectives achieved
• Technical issues (if any)
• Overall session quality
• Suggestions for improvement"
                          className="w-full p-3 sm:p-4 border-2 border-blue-200 rounded-lg sm:rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all duration-300 bg-white text-gray-700 placeholder-gray-500 text-sm sm:text-base"
                          rows={window.innerWidth < 640 ? "4" : "6"}
                          disabled={isSubmitting}
                        />
                      </div>
                    ) : (
                      <div className="space-y-3 sm:space-y-4">
                        <div className="bg-blue-50 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-blue-200 max-h-24 sm:max-h-32 overflow-y-auto">
                          <p className="text-sm sm:text-base text-gray-700 italic">
                            "{coachFeedback}"
                          </p>
                        </div>
                        <div className="flex items-center justify-center p-2 sm:p-3 rounded-lg sm:rounded-xl bg-green-100 text-green-700">
                          <CheckCircle
                            size={window.innerWidth < 640 ? 16 : 20}
                            className="mr-2"
                          />
                          <span className="font-semibold text-sm sm:text-base">
                            Feedback Submitted Successfully
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Status Message */}
                {message && (
                  <div
                    className={`text-center p-2 sm:p-3 rounded-lg sm:rounded-xl mt-3 sm:mt-4 font-medium text-sm sm:text-base ${
                      message.includes("Oops") ||
                      message.includes("wrong") ||
                      message.includes("Please answer")
                        ? "bg-red-100 text-red-700 border border-red-200"
                        : "bg-green-100 text-green-700 border border-green-200"
                    }`}
                  >
                    {message}
                  </div>
                )}
              </div>
            </div>

            {/* Footer - Fixed Submit Button */}
            <div className="flex-shrink-0 p-3 sm:p-4 lg:p-6 pt-0">
              {/* Submit Button for Kids */}
              {!isCoach && !kidFeedbackSubmitted && (
                <button
                  onClick={submitKidFeedback}
                  disabled={
                    isSubmitting ||
                    Object.keys(kidResponses).length < kidQuestions.length
                  }
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2.5 sm:py-3 lg:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 shadow-lg text-sm sm:text-base lg:text-lg"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-2 border-white border-t-transparent mr-2"></div>
                      <span className="text-sm sm:text-base">
                        Submitting...
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Send
                        size={window.innerWidth < 640 ? 16 : 18}
                        className="mr-2"
                      />
                      <span className="text-sm sm:text-base">
                        Submit My Feedback
                      </span>
                    </div>
                  )}
                </button>
              )}

              {/* Submit Button for Coach */}
              {isCoach && sessionEnded && !coachFeedbackSubmitted && (
                <button
                  onClick={submitCoachFeedback}
                  disabled={isSubmitting || !coachFeedback.trim()}
                  className="w-full bg-blue-500 text-white py-2.5 sm:py-3 lg:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl font-semibold hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 text-sm sm:text-base lg:text-lg"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-2 border-white border-t-transparent mr-2"></div>
                      <span className="text-sm sm:text-base">
                        Submitting...
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Send
                        size={window.innerWidth < 640 ? 16 : 18}
                        className="mr-2"
                      />
                      <span className="text-sm sm:text-base">
                        Submit Feedback
                      </span>
                    </div>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassFeedbackSystem;
