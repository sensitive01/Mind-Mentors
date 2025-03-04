import React, { useState } from 'react';
import { Clock, User, Calendar } from 'lucide-react';

const LiveClass = () => {
  // State for live class data - initialized with isLiveClassToday as false
  const [classData, setClassData] = useState({
    isLiveClassToday: false, // Initially set to false as requested
    day: "Monday",
    startTime: "10:00 AM",
    endTime: "11:00 AM",
    coach: "Puja"
  });

  // Primary theme color - you can adjust this to match your app's primary color
  const primaryColor = "#4f46e5"; // Indigo color as an example

  // Function to toggle live class status (for demonstration purposes)
  const toggleLiveClass = () => {
    setClassData(prevData => ({
      ...prevData,
      isLiveClassToday: !prevData.isLiveClassToday
    }));
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4" style={{ color: primaryColor }}>Live Class</h2>
      
      {/* Toggle button for demo purposes */}
      <button 
        onClick={toggleLiveClass}
        className="mb-4 text-xs px-2 py-1 rounded-md text-white"
        style={{ backgroundColor: primaryColor }}
      >
        Toggle class status (demo only)
      </button>
      
      {classData.isLiveClassToday ? (
        <div className="space-y-4">
          <div className="p-4 rounded" style={{ backgroundColor: `${primaryColor}20`, borderLeft: `4px solid ${primaryColor}` }}>
            <p className="font-medium" style={{ color: primaryColor }}>Live class scheduled for today</p>
          </div>
          
          <div className="flex items-center gap-3 text-gray-700">
            <Calendar size={20} style={{ color: primaryColor }} />
            <span>{classData.day}</span>
          </div>
          
          <div className="flex items-center gap-3 text-gray-700">
            <Clock size={20} style={{ color: primaryColor }} />
            <span>{classData.startTime} - {classData.endTime}</span>
          </div>
          
          <div className="flex items-center gap-3 text-gray-700">
            <User size={20} style={{ color: primaryColor }} />
            <span>Coach: {classData.coach}</span>
          </div>
          
          <button 
            className="mt-2 text-white py-2 px-4 rounded-md w-full transition-colors"
            style={{ backgroundColor: primaryColor, hover: { backgroundColor: `${primaryColor}dd` } }}
          >
            Join Live Class
          </button>
        </div>
      ) : (
        <div className="bg-gray-100 border-l-4 border-gray-400 p-6 rounded text-center">
          <p className="text-gray-700 font-medium">No live class scheduled for today</p>
          <p className="text-gray-500 text-sm mt-2">Check back tomorrow or view recorded sessions</p>
        </div>
      )}
    </div>
  );
};

export default LiveClass;