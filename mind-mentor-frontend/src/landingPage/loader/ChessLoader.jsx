const RectangleLoader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white backdrop-blur-sm z-50">
      <div className="relative">
        {/* Glowing background effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-2xl blur-xl opacity-75 animate-pulse"></div>

        {/* Main loader container */}
        <div className="relative bg-white rounded-2xl p-12 shadow-2xl border border-gray-200">
          {/* Animated squares grid */}
          <div className="grid grid-cols-2 gap-3 w-20 h-20 mb-8">
            <div
              className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg shadow-lg transform-gpu"
              style={{
                animation: "square-dance 1.5s ease-in-out infinite",
                animationDelay: "0s",
              }}
            ></div>
            <div
              className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg shadow-lg transform-gpu"
              style={{
                animation: "square-dance 1.5s ease-in-out infinite",
                animationDelay: "0.3s",
              }}
            ></div>
            <div
              className="w-8 h-8 bg-gradient-to-br from-pink-400 to-pink-600 rounded-lg shadow-lg transform-gpu"
              style={{
                animation: "square-dance 1.5s ease-in-out infinite",
                animationDelay: "0.6s",
              }}
            ></div>
            <div
              className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-lg shadow-lg transform-gpu"
              style={{
                animation: "square-dance 1.5s ease-in-out infinite",
                animationDelay: "0.9s",
              }}
            ></div>
          </div>

          {/* Loading text with gradient */}
          <div className="text-center">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              Loading
            </h3>
            <div className="flex justify-center space-x-1">
              <div
                className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                style={{ animationDelay: "0s" }}
              ></div>
              <div
                className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </div>
        </div>

        {/* Custom CSS animations */}
        <style jsx>{`
          @keyframes square-dance {
            0%,
            100% {
              transform: scale(1) rotate(0deg);
              opacity: 0.8;
            }
            25% {
              transform: scale(1.2) rotate(5deg);
              opacity: 1;
            }
            50% {
              transform: scale(0.9) rotate(-5deg);
              opacity: 0.9;
            }
            75% {
              transform: scale(1.1) rotate(3deg);
              opacity: 1;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default RectangleLoader;
