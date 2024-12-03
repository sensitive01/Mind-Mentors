/* eslint-disable react/prop-types */
import { Monitor, Users, PenTool, BookMarked, Maximize2 } from "lucide-react";

const MetricTile = ({ number, label, icon: Icon, isAlternate, progress }) => {
  const baseClasses =
    "flex flex-col items-center justify-center h-48 p-6 transition-all duration-300";
  const colorClasses = isAlternate
    ? "bg-[#642b8f] text-white hover:bg-[#522375]"
    : "bg-[#f8a213] text-white hover:bg-[#e09212]";

  return (
    <div
      className={`${baseClasses} ${colorClasses} hover:shadow-lg group cursor-pointer relative`}
    >
  
      <div
        className={`p-3 rounded-full mb-3 transition-all duration-300 ${
          isAlternate
            ? "bg-white/15 group-hover:bg-white/20"
            : "bg-white/15 group-hover:bg-white/20"
        }`}
      >
        <Icon className="w-8 h-8 text-white" />
      </div>

   
      <span className="text-4xl font-bold tracking-tight group-hover:scale-105 transition-transform duration-300 mb-2">
        {number}
      </span>

     
      <span className="text-sm font-medium text-white/90 text-center">
        {label}
      </span>

   
      {progress !== undefined && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300 bg-white/80"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const MetricsCards = () => {
  const metrics = [
    {
      number: "85%",
      label: "Get 10 attending",
      icon: Monitor,
      progress: 85,
    },
    {
      number: "90%",
      label: "Less than 10 complaints",
      icon: Users,
      progress: 90,
    },
    {
      number: "75%",
      label: "Student Satisfaction",
      icon: PenTool,
      progress: 75,
    },
    {
      number: "45%",
      label: "Content Upload",
      icon: BookMarked,
      progress: 45,
    },
    {
      number: "95%",
      label: "Profile Completion",
      icon: Maximize2,
      progress: 95,
    },
    {
      number: "60%",
      label: "Learning Progress",
      icon: PenTool,
      progress: 60,
    },
    {
      number: "88%",
      label: "Attendance Rate",
      icon: Users,
      progress: 88,
    },
    {
      number: "70%",
      label: "Overall Performance",
      icon: Monitor,
      progress: 70,
    },
  ];

  return (
    <div className="">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0.5  bg-gray-200 rounded-xl overflow-hidden shadow-xl">
        {metrics.map((metric, index) => (
          <MetricTile
            key={index}
            number={metric.number}
            label={metric.label}
            icon={metric.icon}
            isAlternate={(index + Math.floor(index / 4)) % 2 === 0}
            progress={metric.progress}
          />
        ))}
      </div>
    </div>
  );
};

export default MetricsCards;
