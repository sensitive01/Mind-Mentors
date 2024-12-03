/* eslint-disable react/prop-types */
import { ListChecks, CheckCircle, AlertCircle, Ticket } from 'lucide-react';

const PerformanceMetric = ({ number, label, icon: Icon, numberColor }) => (
  <div className="flex items-center gap-4">
    <div className="relative">
      <div className="w-12 h-12 rounded-full border-2 border-purple-500 flex items-center justify-center bg-white">
        <Icon className="w-6 h-6 text-purple-500" />
      </div>
    </div>
    <div className="flex flex-col">
      <span className={`text-2xl font-bold ${numberColor}`}>{number}</span>
      <span className="text-gray-600 text-sm">{label}</span>
    </div>
  </div>
);

const PerformanceMetrix = () => {
  const metrics = [
    {
      number: 40,
      label: "Attends",
      icon: ListChecks,
      numberColor: "text-orange-500"
    },
    {
      number: 125,
      label: "Tasks Done",
      icon: CheckCircle,
      numberColor: "text-purple-500"
    },
    {
      number: 17,
      label: "Complaints",
      icon: AlertCircle,
      numberColor: "text-red-500"
    },
    {
      number: 18,
      label: "Referrals",
      icon: Ticket,
      numberColor: "text-blue-500"
    }
  ];

  return (
    <div className="p-6 bg-white rounded-lg">
      <div className="flex items-center gap-2 mb-8">
        <svg 
          viewBox="0 0 24 24" 
          className="w-6 h-6 text-purple-500"
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
        >
          <path d="M2 12L7 3L12 12L17 3L22 12" />
        </svg>
        <h2 className="text-xl font-semibold text-gray-800">Performance Indicator</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {metrics.map((metric, index) => (
          <PerformanceMetric
            key={index}
            number={metric.number}
            label={metric.label}
            icon={metric.icon}
            numberColor={metric.numberColor}
          />
        ))}
      </div>
    </div>
  );
};

export default PerformanceMetrix;