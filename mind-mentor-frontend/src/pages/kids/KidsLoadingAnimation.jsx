import React, { useState, useEffect } from 'react';
import { Rocket, Star, Cloud } from 'lucide-react';

const KidsLoadingAnimation = () => {
  const [progress, setProgress] = useState(0);
  const [cloudPositions, setCloudPositions] = useState([
    { left: '10%', top: '20%' },
    { left: '70%', top: '40%' },
    { left: '30%', top: '60%' }
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 1;
      });

      // Randomly move clouds
      setCloudPositions(prev => prev.map(cloud => ({
        left: `${Math.max(0, Math.min(90, parseFloat(cloud.left) + (Math.random() * 4 - 2)))}%`,
        top: `${Math.max(0, Math.min(90, parseFloat(cloud.top) + (Math.random() * 4 - 2)))}%`
      })));
    }, 50);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-primary/80 to-primary flex items-center justify-center overflow-hidden">
      {/* Animating Clouds */}
      {cloudPositions.map((cloud, index) => (
        <Cloud 
          key={index} 
          className="absolute text-white/50 opacity-50 animate-bounce"
          style={{ 
            left: cloud.left, 
            top: cloud.top,
            width: '100px',
            height: '100px'
          }}
        />
      ))}

      {/* Rocket */}
      <div className="flex flex-col items-center">
        <div 
          className="transform transition-all duration-500"
          style={{ 
            transform: `translateY(-${progress}px)`, 
            transition: 'transform 0.5s ease-in-out' 
          }}
        >
          <Rocket 
            className="text-secondary animate-pulse" 
            size={200} 
            strokeWidth={1.5}
          />
        </div>

        {/* Progress Bar */}
        <div className="w-64 bg-white/30 rounded-full h-6 mt-4 overflow-hidden">
          <div 
            className="bg-secondary h-full rounded-full transition-all duration-500"
            style={{ 
              width: `${progress}%`,
              transition: 'width 0.5s ease-in-out'
            }}
          />
        </div>

        {/* Loading Text */}
        <div className="mt-4 text-white text-2xl font-bold animate-bounce">
          Loading Adventure...
        </div>

        {/* Sparkling Stars */}
        {[...Array(5)].map((_, index) => (
          <Star 
            key={index} 
            className="absolute text-quaternary animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: '30px',
              height: '30px'
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default KidsLoadingAnimation;