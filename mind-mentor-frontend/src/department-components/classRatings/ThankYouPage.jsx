import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ThankYouPage = ({
  logoUrl = "https://images.squarespace-cdn.com/content/v1/5943b11db3db2be040e6fa54/1535040630596-MQ1OIS7VZQF0DO6ONZB2/download.png",
  title = "Thanks for joining today!",
  message = "Hope the classes were productive and engaging.\nWe look forward to seeing you in the next session!",
}) => {
  const navigate = useNavigate();
  const coachId = localStorage.getItem("EmpId");
  const role = localStorage.getItem("role")||localStorage.getItem("department");
  const kidId = localStorage.getItem("kidId");
  const sessionId = coachId || kidId;
  useEffect(() => {
    const timer = setTimeout(() => {
      const logo = document.querySelector(".logo");
      if (logo) {
        logo.classList.add("animated");
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const onReturnToDashboard = () => {
    navigate(`/class-feed-back/${role}/${sessionId}`);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      }}
    >
      <div
        className="max-w-2xl p-10 bg-white rounded-3xl shadow-xl text-center relative overflow-hidden"
        style={{
          boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)",
          animation: "fadeIn 1s ease-out",
        }}
      >
        <style jsx>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes confetti {
            0% {
              transform: translate(0, 0) rotate(0deg);
              opacity: 0;
            }
            10% {
              opacity: 1;
            }
            100% {
              transform: translate(var(--tx), var(--ty)) rotate(var(--r));
              opacity: 0;
            }
          }

          .confetti {
            position: absolute;
            width: 10px;
            height: 10px;
            opacity: 0;
            animation: confetti 5s ease-in-out infinite;
          }

          .confetti:nth-child(1) {
            --tx: -100px;
            --ty: -100px;
            --r: 180deg;
            animation-delay: 0s;
            background-color: #ffd700;
            left: 40%;
            top: 50%;
          }
          .confetti:nth-child(2) {
            --tx: 100px;
            --ty: -80px;
            --r: -180deg;
            animation-delay: 0.5s;
            background-color: #ff6347;
            left: 50%;
            top: 30%;
          }
          .confetti:nth-child(3) {
            --tx: -70px;
            --ty: -150px;
            --r: 90deg;
            animation-delay: 1s;
            background-color: #4169e1;
            left: 60%;
            top: 40%;
          }
          .confetti:nth-child(4) {
            --tx: 120px;
            --ty: -120px;
            --r: -90deg;
            animation-delay: 1.5s;
            background-color: #32cd32;
            left: 70%;
            top: 20%;
          }
          .confetti:nth-child(5) {
            --tx: -50px;
            --ty: -180px;
            --r: 270deg;
            animation-delay: 2s;
            background-color: #ff1493;
            left: 30%;
            top: 60%;
          }
        `}</style>

        <div className="mb-8 relative">
          <img
            src={logoUrl}
            alt="Logo"
            className="logo w-36 h-auto mx-auto transition-transform duration-300 hover:scale-105"
          />
          {/* Confetti elements */}
          <div className="confetti"></div>
          <div className="confetti"></div>
          <div className="confetti"></div>
          <div className="confetti"></div>
          <div className="confetti"></div>
        </div>

        <h2 className="text-gray-700 text-3xl leading-relaxed mb-6 font-semibold">
          {title}
        </h2>

        <p className="text-gray-600 text-lg leading-relaxed mb-8 whitespace-pre-line">
          {message}
        </p>

        <button
          onClick={onReturnToDashboard}
          className="inline-block px-7 py-3 text-white rounded-full text-base font-semibold transition-all duration-300 mt-2 border-none cursor-pointer hover:-translate-y-1"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
          }}
          onMouseEnter={(e) => {
            e.target.style.boxShadow = "0 6px 20px rgba(102, 126, 234, 0.6)";
          }}
          onMouseLeave={(e) => {
            e.target.style.boxShadow = "0 4px 15px rgba(102, 126, 234, 0.4)";
          }}
        >
          Return to Dashboard
        </button>

        <div className="mt-10 text-gray-500 text-sm">
          © 2025 • Have a great day!
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;
