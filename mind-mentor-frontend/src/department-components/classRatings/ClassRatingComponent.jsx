import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, MessageSquare, CheckCircle, Star, Sparkles } from 'lucide-react';

const ClassRating = ({ userType = 'kid', classId = 'default-class', sessionEnded = false }) => {
  const [rating, setRating] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [remark, setRemark] = useState('');
  const [remarkSubmitted, setRemarkSubmitted] = useState(false);
  const [remarkLookedInto, setRemarkLookedInto] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  const isCoach = userType === 'coach';

  const submitRating = async (value) => {
    setIsSubmitting(true);
    setMessage('');
    
    try {
      const response = await fetch('/api/rate-class', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating: value,
          classId: classId,
          userType: userType,
          timestamp: new Date().toISOString()
        }),
      });

      if (response.ok) {
        setRating(value);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
        setMessage(value === 1 ? '🎉 Amazing! Thanks for the positive vibes!' : '💙 Thank you for your honest feedback!');
        // Show thank you message after a delay
        setTimeout(() => setShowThankYou(true), 2000);
      } else {
        throw new Error('Failed to submit rating');
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      setMessage('Oops! Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitRemark = async () => {
    if (!remark.trim()) {
      setMessage('Please share your thoughts before submitting! 💭');
      return;
    }

    setIsSubmitting(true);
    setMessage('');
    
    try {
      const response = await fetch('/api/submit-remark', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          remark: remark.trim(),
          classId: classId,
          coachId: userType,
          timestamp: new Date().toISOString(),
          status: 'pending'
        }),
      });

      if (response.ok) {
        setRemarkSubmitted(true);
        setMessage('✨ Your insights have been shared with our team!');
        // Show thank you message after remark submission
        setTimeout(() => setShowThankYou(true), 2000);
      } else {
        throw new Error('Failed to submit remark');
      }
    } catch (error) {
      console.error('Error submitting remark:', error);
      setMessage('Oops! Failed to submit your remark. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleThumbsUp = () => {
    if (rating === null) {
      submitRating(1);
    }
  };

  const handleThumbsDown = () => {
    if (rating === null) {
      submitRating(-1);
    }
  };

  return (
    <div className="relative mt-24">
      {/* Thank You Overlay */}
      {showThankYou && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center shadow-2xl transform animate-slideUp">
            {/* Animated Confetti */}
            <div className="absolute inset-0 overflow-hidden rounded-3xl">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-3 h-3 animate-bounce"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    backgroundColor: ['#ffd700', '#ff6347', '#4169e1', '#32cd32', '#ff1493', '#00ced1'][i % 6],
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${2 + Math.random() * 2}s`,
                    borderRadius: '50%'
                  }}
                />
              ))}
            </div>
            
            {/* Logo/Icon */}
            <div className="mb-6 relative">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
                <Sparkles className="text-white" size={40} />
              </div>
            </div>
            
            {/* Thank You Message */}
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Thanks for joining today!
            </h2>
            
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              Hope the {isCoach ? 'session' : 'classes'} {isCoach ? 'was' : 'were'} productive and engaging.<br />
              We look forward to seeing you in the next session!
            </p>
            
            {/* Close Button */}
            <button
              onClick={() => setShowThankYou(false)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-full font-semibold hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Continue
            </button>
            
            {/* Footer */}
            <div className="mt-6 text-sm text-gray-500">
              © 2025 • Have a great day!
            </div>
          </div>
        </div>
      )}

      {/* Confetti Effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            >
              <Star className="text-yellow-400" size={Math.random() * 16 + 8} />
            </div>
          ))}
        </div>
      )}

      <div className="max-w-lg mx-auto p-8 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 rounded-3xl shadow-2xl border border-white/50 backdrop-blur-sm">
        {/* Header Section */}
        <div className="text-center mb-8 relative">
          <div className="absolute -top-4 -right-4">
            <Sparkles className="text-purple-400 animate-pulse" size={24} />
          </div>
          <div className="absolute -top-2 -left-2">
            <Star className="text-pink-400 animate-spin" size={16} />
          </div>
          
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            <h2 className="text-3xl font-black mb-3 tracking-tight">
              {isCoach ? '🎯 Coach Feedback Hub' : '⭐ Rate Your Experience'}
            </h2>
          </div>
          <p className="text-gray-600 font-medium text-lg">
            {isCoach ? 'Share your session insights!' : 'Tell us how awesome it was!'}
          </p>
        </div>

        {/* Rating Section */}
        <div className="flex justify-center space-x-12 mb-8">
          {/* Thumbs Up Button */}
          <div className="relative">
            <button
              onClick={handleThumbsUp}
              disabled={rating !== null || isSubmitting}
              className={`relative p-6 rounded-full transition-all duration-300 transform hover:scale-125 active:scale-95 ${
                rating === 1
                  ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-2xl shadow-green-300/50 animate-pulse'
                  : rating === null
                  ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-600 hover:from-green-200 hover:to-emerald-200 hover:shadow-xl shadow-lg'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              } ${isSubmitting ? 'animate-bounce' : ''}`}
            >
              <ThumbsUp size={40} className="drop-shadow-sm" />
              {rating === 1 && (
                <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-1 animate-ping">
                  <Star size={12} className="text-white" />
                </div>
              )}
            </button>
            <p className="text-center mt-3 font-semibold text-green-600">Love it!</p>
          </div>

          {/* Thumbs Down Button */}
          <div className="relative">
            <button
              onClick={handleThumbsDown}
              disabled={rating !== null || isSubmitting}
              className={`relative p-6 rounded-full transition-all duration-300 transform hover:scale-125 active:scale-95 ${
                rating === -1
                  ? 'bg-gradient-to-r from-red-400 to-rose-500 text-white shadow-2xl shadow-red-300/50 animate-pulse'
                  : rating === null
                  ? 'bg-gradient-to-r from-red-100 to-rose-100 text-red-600 hover:from-red-200 hover:to-rose-200 hover:shadow-xl shadow-lg'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              } ${isSubmitting ? 'animate-bounce' : ''}`}
            >
              <ThumbsDown size={40} className="drop-shadow-sm" />
              {rating === -1 && (
                <div className="absolute -top-2 -right-2 bg-blue-400 rounded-full p-1 animate-ping">
                  <CheckCircle size={12} className="text-white" />
                </div>
              )}
            </button>
            <p className="text-center mt-3 font-semibold text-red-600">Needs work</p>
          </div>
        </div>

        {/* Coach Remark Section */}
        {isCoach && sessionEnded && (
          <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200/50 shadow-inner">
            <div className="flex items-center mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-2 rounded-xl mr-3">
                <MessageSquare className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Session Insights
              </h3>
            </div>
            
            {!remarkSubmitted ? (
              <div className="space-y-4">
                <textarea
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  placeholder="Share your thoughts about the session... What went well? Any challenges? ✨"
                  className="w-full p-4 border-2 border-blue-200 rounded-xl resize-none focus:outline-none focus:ring-4 focus:ring-blue-300/50 focus:border-blue-400 transition-all duration-300 bg-white/80 backdrop-blur-sm text-gray-700 placeholder-gray-500"
                  rows="4"
                  disabled={isSubmitting}
                />
                <button
                  onClick={submitRemark}
                  disabled={isSubmitting || !remark.trim()}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                      Sharing insights...
                    </div>
                  ) : (
                    '🚀 Share My Insights'
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-white/80 p-4 rounded-xl border border-blue-200 shadow-sm">
                  <p className="text-gray-700 italic font-medium">"{remark}"</p>
                </div>
                <div className={`flex items-center justify-center p-3 rounded-xl ${
                  remarkLookedInto 
                    ? 'bg-green-100 text-green-700 border border-green-200' 
                    : 'bg-orange-100 text-orange-700 border border-orange-200'
                }`}>
                  <CheckCircle size={20} className="mr-2" />
                  <span className="font-semibold">
                    {remarkLookedInto ? '✅ Reviewed by SD Team' : '⏳ Awaiting SD Team Review'}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Status Message */}
        {message && (
          <div className={`text-center p-4 rounded-2xl mt-6 font-semibold text-lg shadow-lg ${
            message.includes('Oops') || message.includes('wrong')
              ? 'bg-gradient-to-r from-red-100 to-rose-100 text-red-700 border border-red-200' 
              : 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200'
          } transform transition-all duration-500 ${showConfetti ? 'animate-bounce' : ''}`}>
            {message}
          </div>
        )}

        {/* Rating Status */}
        {rating !== null && !isSubmitting && (
          <div className="text-center mt-6 p-4 bg-white/60 rounded-2xl border border-purple-200">
            <p className="text-gray-600 font-medium">
              You rated this {isCoach ? 'session' : 'class'}: 
              <span className={`ml-2 font-bold text-lg ${rating === 1 ? 'text-green-600' : 'text-red-600'}`}>
                {rating === 1 ? '🎉 Awesome!' : '💙 Thanks for the feedback!'}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassRating;