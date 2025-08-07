const ChessLoader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-primary/90 to-primary/70 backdrop-blur-sm z-50">
      <div className="relative">
        {/* Glowing chess board effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 rounded-3xl blur-xl opacity-30 animate-pulse"></div>

        {/* Main loader container */}
        <div className="relative bg-white rounded-3xl p-12 shadow-2xl border-2 border-amber-200">
          {/* Chess board grid */}
          <div className="grid ml-24  grid-cols-4 gap-1 w-24 h-24 mb-8 p-2 bg-amber-900 rounded-lg shadow-inner">
            {/* Alternating chess squares */}
            {[...Array(16)].map((_, i) => {
              const row = Math.floor(i / 4);
              const col = i % 4;
              const isLight = (row + col) % 2 === 0;
              const delay = i * 0.1;
              
              return (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-sm shadow-sm ${
                    isLight ? 'bg-amber-100' : 'bg-amber-800'
                  } transform-gpu`}
                  style={{
                    animation: "chess-square-pulse 2s ease-in-out infinite",
                    animationDelay: `${delay}s`,
                  }}
                ></div>
              );
            })}
          </div>

          {/* Animated chess pieces */}
          <div className="flex justify-center space-x-4 mb-6">
            <div
              className="text-4xl transform-gpu"
              style={{
                animation: "piece-bounce 1.5s ease-in-out infinite",
                animationDelay: "0s",
              }}
            >
              ♔
            </div>
            <div
              className="text-4xl transform-gpu"
              style={{
                animation: "piece-bounce 1.5s ease-in-out infinite",
                animationDelay: "0.2s",
              }}
            >
              ♕
            </div>
            <div
              className="text-4xl transform-gpu"
              style={{
                animation: "piece-bounce 1.5s ease-in-out infinite",
                animationDelay: "0.4s",
              }}
            >
              ♖
            </div>
            <div
              className="text-4xl transform-gpu"
              style={{
                animation: "piece-bounce 1.5s ease-in-out infinite",
                animationDelay: "0.6s",
              }}
            >
              ♗
            </div>
            <div
              className="text-4xl transform-gpu"
              style={{
                animation: "piece-bounce 1.5s ease-in-out infinite",
                animationDelay: "0.8s",
              }}
            >
              ♘
            </div>
            <div
              className="text-4xl transform-gpu"
              style={{
                animation: "piece-bounce 1.5s ease-in-out infinite",
                animationDelay: "1s",
              }}
            >
              ♙
            </div>
          </div>

          {/* Loading text with chess theme */}
          <div className="text-center">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-800 bg-clip-text text-transparent mb-3">
              Calculating Move
            </h3>
            <div className="flex justify-center items-center space-x-2">
              <div
                className="w-3 h-3 bg-amber-500 rounded-full animate-bounce shadow-lg"
                style={{ animationDelay: "0s" }}
              ></div>
              <div
                className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce shadow-lg"
                style={{ animationDelay: "0.15s" }}
              ></div>
              <div
                className="w-3 h-3 bg-amber-600 rounded-full animate-bounce shadow-lg"
                style={{ animationDelay: "0.3s" }}
              ></div>
            </div>
          </div>

          {/* Thinking indicator */}
          <div className="mt-4 text-center">
            <div className="inline-flex items-center space-x-2 text-amber-700">
              <div
                className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"
                style={{ animationDelay: "0s" }}
              ></div>
              <span className="text-sm font-medium opacity-75">Thinking</span>
              <div
                className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"
                style={{ animationDelay: "0.5s" }}
              ></div>
            </div>
          </div>
        </div>

        {/* Custom CSS animations */}
        <style jsx>{`
          @keyframes chess-square-pulse {
            0%, 100% {
              transform: scale(1);
              opacity: 0.7;
            }
            50% {
              transform: scale(1.1);
              opacity: 1;
              box-shadow: 0 0 10px rgba(245, 158, 11, 0.5);
            }
          }

          @keyframes piece-bounce {
            0%, 100% {
              transform: translateY(0) rotate(0deg) scale(1);
              text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
            }
            25% {
              transform: translateY(-10px) rotate(2deg) scale(1.05);
              text-shadow: 4px 4px 8px rgba(0,0,0,0.3);
            }
            50% {
              transform: translateY(-5px) rotate(-1deg) scale(1.02);
              text-shadow: 3px 3px 6px rgba(0,0,0,0.25);
            }
            75% {
              transform: translateY(-12px) rotate(1deg) scale(1.03);
              text-shadow: 4px 4px 8px rgba(0,0,0,0.3);
            }
          }

          /* Add hover effect for the entire loader */
          .relative:hover .grid {
            animation-duration: 1s;
          }

          .relative:hover [style*="piece-bounce"] {
            animation-duration: 1s;
          }
        `}</style>
      </div>
    </div>
  );
};

export default ChessLoader;