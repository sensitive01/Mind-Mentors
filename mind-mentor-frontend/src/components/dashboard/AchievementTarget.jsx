/* eslint-disable react/prop-types */

import { Maximize2 } from "lucide-react";

const ProgressBar = ({ color, progress }) => (
  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
    <div
      className={`h-full rounded-full ${color}`}
      style={{ width: `${progress}%` }}
    />
  </div>
);

const TargetItem = ({ title, progress, color }) => (
  <div className="mb-8 last:mb-0">
    <h3 className="text-gray-600 text-lg mb-2.5">{title}</h3>
    <ProgressBar color={color} progress={progress} />
  </div>
);

const AchievementTarget = () => {
  const targets = [
    {
      title: "Get 10 attending",
      progress: 85,
      color: "bg-pink-500",
    },
    {
      title: "Get less than 10 complaint",
      progress: 90,
      color: "bg-blue-500",
    },
    {
      title: "Get less than 10 complaint",
      progress: 75,
      color: "bg-orange-500",
    },
    {
      title: "Upload 5 videos or articles",
      progress: 45,
      color: "bg-green-500",
    },
    {
      title: "Completing profile",
      progress: 95,
      color: "bg-cyan-500",
    },
  ];

  return (
    <div className="w-full max-w-2xl bg-white rounded-lg border border-[#b115b1] shadow-md p-6">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-11 h-11 rounded-full bg-purple-50 flex items-center justify-center">
          <Maximize2 className="w-5 h-5 text-purple-600" />
        </div>
        <h2 className="text-[#b115b1] text-2xl font-semibold">
        Achievement Target
        </h2>
      </div>

      <div className="space-y-8">
        {targets.map((target, index) => (
          <TargetItem
            key={index}
            title={target.title}
            progress={target.progress}
            color={target.color}
          />
        ))}
      </div>
    </div>
  );
};

export default AchievementTarget;
