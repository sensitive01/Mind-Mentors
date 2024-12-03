/* eslint-disable react/prop-types */

import { LayoutList } from 'lucide-react';

const CircularProgress = ({ progress }) => {
  const radius = 50;  
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative w-40 h-40 flex items-center justify-center">
      <svg className="w-full h-full -rotate-90">
      
        <circle
          cx="80"
          cy="80"
          r={radius}
          stroke="#F3F4F6"
          strokeWidth="10"
          fill="none"
          className="transition-all duration-300"
        />

        <circle
          cx="80"
          cy="80"
          r={radius}
          stroke="#9333EA"
          strokeWidth="10"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-in-out"
        />
      </svg>
   
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-purple-600">{progress}%</span>
        <span className="text-sm text-gray-500">Complete</span>
      </div>
    </div>
  );
};

const Classes = () => {
  return (
    <div className="w-full bg-white rounded-xl border border-[#b115b1] shadow-md hover:shadow-lg transition-shadow duration-300">

      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
            <LayoutList className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-[#b115b1] text-2xl font-semibold">Classes</h2>
            <p className="text-sm text-gray-500">Track your progress</p>
          </div>
        </div>
      </div>

      
      <div className="p-10 w-full flex flex-col items-center">
        <CircularProgress progress={60} />
        <div className="mt-6 text-center">
          <h3 className="text-lg font-semibold text-purple-600 mb-2">
            Classes Completed
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Youre making great progress!
          </p>
        </div>
        
      
        <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
          <span>Upgrade Now</span>
        </button>
      </div>
    </div>
  );
};

export default Classes;