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

const ClassFeedbackSystem = ({
  userType = "kid",
  classId = "default-class",
  sessionEnded = true,
  logoUrl = null,
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

  const handleKidResponse = (questionId, rating) => {
    setKidResponses((prev) => ({
      ...prev,
      [questionId]: rating,
    }));
  };

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

    const totalScore = Object.values(kidResponses).reduce(
      (sum, rating) => sum + rating,
      0
    );

    try {
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

  const submitCoachFeedback = async () => {
    if (!coachFeedback.trim()) {
      setMessage("Please share your feedback before submitting! 💭");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
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

  const getProgress = () => {
    const answered = Object.keys(kidResponses).length;
    return (answered / kidQuestions.length) * 100;
  };

  const styles = {
    container: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f8f0ff 0%, #fce7f3 50%, #e0e7ff 100%)",
    },
    headerGradient: {
      background: "linear-gradient(90deg, #8b5cf6 0%, #ec4899 100%)",
      color: "white",
    },
    feedbackCard: {
      background: "rgba(255, 255, 255, 0.9)",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(255, 255, 255, 0.5)",
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
    },
    progressGradient: {
      background: "linear-gradient(90deg, #8b5cf6 0%, #ec4899 100%)",
    },
    btnGradient: {
      background: "linear-gradient(90deg, #8b5cf6 0%, #ec4899 100%)",
      border: "none",
      color: "white",
      transition: "all 0.3s ease",
    },
    btnCoach: {
      backgroundColor: "#3b82f6",
      border: "none",
      color: "white",
      transition: "all 0.3s ease",
    },
    thumbBtn: {
      transition: "all 0.3s ease",
      border: "2px solid",
      width: "60px",
      height: "60px",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    questionCard: {
      background: "#f9fafb",
      border: "1px solid #e5e7eb",
      transition: "transform 0.2s ease",
    },
    logoContainer: {
      width: "2.5rem",
      height: "2.5rem",
      background: "linear-gradient(90deg, #8b5cf6 0%, #ec4899 100%)",
      borderRadius: "0.5rem",
    },
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0, 0, 0, 0.5)",
      backdropFilter: "blur(5px)",
      zIndex: 1050,
    },
    confettiContainer: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      pointerEvents: "none",
      overflow: "hidden",
      zIndex: 1040,
    },
  };

  // Bootstrap Classes
  const bootstrapClasses = `
    .btn-gradient:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(139, 92, 246, 0.4);
    }
    .btn-coach:hover {
      background-color: #2563eb !important;
      transform: translateY(-2px);
    }
    .thumb-btn:hover {
      transform: scale(1.1);
    }
    .thumb-btn:active {
      transform: scale(0.95);
    }
    .question-card:hover {
      transform: translateY(-2px);
    }
    @keyframes confetti-fall {
      0% { transform: translateY(-100vh) rotate(0deg); }
      100% { transform: translateY(100vh) rotate(360deg); }
    }
    .confetti-item {
      animation: confetti-fall 3s linear infinite;
    }
    @media (max-width: 576px) {
      .thumb-btn { width: 50px !important; height: 50px !important; }
      .logo-container { width: 2rem !important; height: 2rem !important; }
    }
  `;

  return (
    <>
      <style>{bootstrapClasses}</style>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
      
      <div style={styles.container} className="d-flex flex-column">
        {/* Header Row */}
        <div className="container-fluid" style={styles.headerGradient}>
          <div className="row align-items-center py-2 py-md-3">
            <div className="col-6 col-md-8">
              <div className="d-flex align-items-center">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="Logo"
                    className="img-fluid"
                    style={{ height: "2rem", maxHeight: "3rem" }}
                  />
                ) : (
                  <div
                    className="d-flex align-items-center justify-content-center"
                    style={styles.logoContainer}
                  >
                    <Sparkles size={16} />
                  </div>
                )}
                <span className="ms-2 fw-bold d-none d-sm-inline">
                  Class Feedback
                </span>
              </div>
            </div>
            <div className="col-6 col-md-4 text-end">
              <span className="badge bg-dark bg-opacity-25 px-2 py-1 rounded-pill small">
                {isCoach ? "Coach View" : "Student View"}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content Row */}
        <div className="container-fluid flex-grow-1 py-2 py-md-3" style={{ minHeight: "calc(100vh - 80px)" }}>
          <div className="row h-100">
            {/* Main Card - Full width on mobile, centered on larger screens */}
            <div className="col-12 col-xl-10 offset-xl-1 col-xxl-8 offset-xxl-2 h-100">
              <div className="card h-100 border-0 rounded-3" style={styles.feedbackCard}>
                
                {/* Card Header */}
                <div className="card-header border-0 text-center py-3 py-md-4" style={styles.headerGradient}>
                  <div className="container-fluid">
                    <div className="row">
                      <div className="col-12">
                        <h2 className="h4 h-md-3 h-lg-2 mb-1 mb-md-2 fw-bold">
                          {isCoach ? "🎯 Coach Feedback" : "⭐ Tell Us About Your Class!"}
                        </h2>
                        <p className="mb-0 small opacity-75">
                          {isCoach
                            ? "Share your session insights with our team"
                            : "Your feedback helps us make classes better!"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Body - Scrollable Content */}
                <div className="card-body flex-grow-1 p-2 p-md-3 p-lg-4" style={{ overflowY: "auto", maxHeight: "calc(100vh - 300px)" }}>
                  <div className="container-fluid">
                    
                    {/* Kid Feedback Section */}
                    {!isCoach && (
                      <>
                        {/* Progress Bar Row */}
                        <div className="row mb-3 mb-md-4">
                          <div className="col-12">
                            <div className="d-flex justify-content-between small text-muted mb-2">
                              <span>Progress</span>
                              <span>{Object.keys(kidResponses).length}/{kidQuestions.length}</span>
                            </div>
                            <div className="progress" style={{ height: "0.5rem" }}>
                              <div
                                className="progress-bar"
                                style={{
                                  ...styles.progressGradient,
                                  width: `${getProgress()}%`,
                                  transition: "width 0.5s ease",
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>

                        {/* Questions Grid */}
                        <div className="row g-2 g-md-3">
                          {kidQuestions.map((q, index) => (
                            <div key={q.id} className="col-12 col-lg-6">
                              <div className="card h-100 question-card" style={styles.questionCard}>
                                <div className="card-body p-3">
                                  <div className="row align-items-start mb-2 mb-md-3">
                                    <div className="col-2 col-md-1">
                                      <span className="fs-5">{q.emoji}</span>
                                    </div>
                                    <div className="col-10 col-md-11">
                                      <h6 className="card-title mb-0 small fw-semibold">
                                        {index + 1}. {q.question}
                                      </h6>
                                    </div>
                                  </div>

                                  <div className="row justify-content-center">
                                    <div className="col-auto">
                                      <div className="d-flex gap-4 justify-content-center">
                                        {/* Thumbs Up */}
                                        <button
                                          onClick={() => handleKidResponse(q.id, 1)}
                                          disabled={kidResponses[q.id] !== undefined}
                                          className="btn thumb-btn"
                                          style={{
                                            ...styles.thumbBtn,
                                            borderColor: "#22c55e",
                                            color: kidResponses[q.id] === 1 ? "white" : "#22c55e",
                                            backgroundColor: kidResponses[q.id] === 1 ? "#22c55e" : "rgba(34, 197, 94, 0.1)",
                                            opacity: kidResponses[q.id] === undefined || kidResponses[q.id] === 1 ? 1 : 0.5,
                                          }}
                                        >
                                          <ThumbsUp size={20} />
                                        </button>

                                        {/* Thumbs Down */}
                                        <button
                                          onClick={() => handleKidResponse(q.id, -1)}
                                          disabled={kidResponses[q.id] !== undefined}
                                          className="btn thumb-btn"
                                          style={{
                                            ...styles.thumbBtn,
                                            borderColor: "#ef4444",
                                            color: kidResponses[q.id] === -1 ? "white" : "#ef4444",
                                            backgroundColor: kidResponses[q.id] === -1 ? "#ef4444" : "rgba(239, 68, 68, 0.1)",
                                            opacity: kidResponses[q.id] === undefined || kidResponses[q.id] === -1 ? 1 : 0.5,
                                          }}
                                        >
                                          <ThumbsDown size={20} />
                                        </button>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Response Indicator */}
                                  {kidResponses[q.id] !== undefined && (
                                    <div className="text-center mt-2 mt-md-3">
                                      <span
                                        className={`badge ${
                                          kidResponses[q.id] === 1
                                            ? "bg-success bg-opacity-25 text-success"
                                            : "bg-danger bg-opacity-25 text-danger"
                                        }`}
                                      >
                                        <CheckCircle size={12} className="me-1" />
                                        {kidResponses[q.id] === 1 ? "Great!" : "Got it!"}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Score Display */}
                        {kidFeedbackSubmitted && (
                          <div className="row mt-3 mt-md-4">
                            <div className="col-12">
                              <div className="alert alert-success">
                                <h6 className="alert-heading">Feedback Submitted!</h6>
                                <p className="mb-0">
                                  Your Score:{" "}
                                  <strong>
                                    {Object.values(kidResponses).reduce((sum, rating) => sum + rating, 0)}/
                                    {kidQuestions.length}
                                  </strong>
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {/* Coach Feedback Section */}
                    {isCoach && sessionEnded && (
                      <>
                        <div className="row mb-3 mb-md-4">
                          <div className="col-12">
                            <div className="d-flex align-items-center">
                              <div className="bg-primary p-2 rounded me-2 me-md-3">
                                <MessageSquare size={20} color="white" />
                              </div>
                              <h5 className="mb-0 text-primary fw-bold">Session Feedback</h5>
                            </div>
                          </div>
                        </div>

                        {!coachFeedbackSubmitted ? (
                          <div className="row">
                            <div className="col-12">
                              <textarea
                                value={coachFeedback}
                                onChange={(e) => setCoachFeedback(e.target.value)}
                                placeholder="Share your feedback about the session:
• Student engagement levels
• Learning objectives achieved
• Technical issues (if any)
• Overall session quality
• Suggestions for improvement"
                                className="form-control border-2 border-primary"
                                rows={window.innerWidth < 768 ? 4 : 6}
                                disabled={isSubmitting}
                                style={{ resize: "none", backgroundColor: "white" }}
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="row">
                            <div className="col-12">
                              <div className="alert alert-primary mb-3">
                                <p className="mb-0 fst-italic">"{coachFeedback}"</p>
                              </div>
                              <div className="alert alert-success d-flex align-items-center">
                                <CheckCircle size={20} className="me-2" />
                                <span className="fw-semibold">Feedback Submitted Successfully</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {/* Status Message */}
                    {message && (
                      <div className="row mt-3 mt-md-4">
                        <div className="col-12">
                          <div
                            className={`alert text-center ${
                              message.includes("Oops") ||
                              message.includes("wrong") ||
                              message.includes("Please answer")
                                ? "alert-danger"
                                : "alert-success"
                            }`}
                          >
                            {message}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer - Submit Button */}
                <div className="card-footer border-0 bg-transparent p-2 p-md-3 p-lg-4 pt-0">
                  <div className="container-fluid">
                    <div className="row">
                      <div className="col-12">
                        {/* Submit Button for Kids */}
                        {!isCoach && !kidFeedbackSubmitted && (
                          <button
                            onClick={submitKidFeedback}
                            disabled={
                              isSubmitting ||
                              Object.keys(kidResponses).length < kidQuestions.length
                            }
                            className="btn w-100 py-2 py-md-3 fw-semibold btn-gradient"
                            style={styles.btnGradient}
                          >
                            {isSubmitting ? (
                              <div className="d-flex align-items-center justify-content-center">
                                <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                                <span>Submitting...</span>
                              </div>
                            ) : (
                              <div className="d-flex align-items-center justify-content-center">
                                <Send size={18} className="me-2" />
                                <span>Submit My Feedback</span>
                              </div>
                            )}
                          </button>
                        )}

                        {/* Submit Button for Coach */}
                        {isCoach && sessionEnded && !coachFeedbackSubmitted && (
                          <button
                            onClick={submitCoachFeedback}
                            disabled={isSubmitting || !coachFeedback.trim()}
                            className="btn w-100 py-2 py-md-3 fw-semibold btn-coach"
                            style={styles.btnCoach}
                          >
                            {isSubmitting ? (
                              <div className="d-flex align-items-center justify-content-center">
                                <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                                <span>Submitting...</span>
                              </div>
                            ) : (
                              <div className="d-flex align-items-center justify-content-center">
                                <Send size={18} className="me-2" />
                                <span>Submit Feedback</span>
                              </div>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Thank You Modal */}
        {showThankYou && (
          <div style={styles.overlay} className="d-flex align-items-center justify-content-center p-3">
            <div className="modal-dialog modal-sm">
              <div className="modal-content border-0 shadow-lg">
                <div className="modal-body text-center p-4">
                  <div className="mb-3">
                    <div
                      className="d-inline-flex align-items-center justify-content-center rounded-circle mx-auto"
                      style={{
                        width: "4rem",
                        height: "4rem",
                        background: "linear-gradient(90deg, #8b5cf6 0%, #ec4899 100%)",
                      }}
                    >
                      <Sparkles size={32} color="white" />
                    </div>
                  </div>
                  <h5 className="mb-3">Thanks for your feedback!</h5>
                  <p className="text-muted mb-4">Your input helps us make classes even better.</p>
                  <button
                    onClick={() => setShowThankYou(false)}
                    className="btn btn-gradient px-4"
                    style={styles.btnGradient}
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Confetti Effect */}
        {showConfetti && (
          <div style={styles.confettiContainer}>
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="confetti-item position-absolute"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random()}s`,
                }}
              >
                <Star className="text-warning" size={Math.random() * 8 + 8} />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ClassFeedbackSystem;