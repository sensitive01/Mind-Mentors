import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Video,
  Award,
  Target
} from 'lucide-react';
import { operationDeptInstance } from '../../../api/axios/operationDeptInstance';
import toast from 'react-hot-toast';
import { getKidDemoClass } from '../../../api/service/kid/KidService';

const KidsDemoClass = ({ demoClassId }) => {
  const kidId = localStorage.getItem("kidId")
  const [demoClass, setDemoClass] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDemoClassDetails = async () => {
      try {
        setLoading(true);
        const response = await getKidDemoClass(kidId);
        setDemoClass(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching demo class details:', err);
        setError('Failed to load demo class details');
        toast.error('Unable to fetch demo class information');
        setLoading(false);
      }
    };

    fetchDemoClassDetails();
  }, [kidId]);

  const handleBookDemoClass = async () => {
    try {
      await operationDeptInstance.post('/book-demo-class', {
        demoClassId: demoClassId
      });
      toast.success('Demo class booked successfully!');
    } catch (err) {
      console.error('Error booking demo class:', err);
      toast.error('Failed to book demo class');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-100 to-purple-100">
        <Target size={64} className="text-blue-600 animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen bg-red-50 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-xl shadow-xl text-center max-w-md w-full">
          <div className="mb-4 flex justify-center">
            <Award className="text-red-500" size={48} />
          </div>
          <h2 className="text-xl font-bold text-red-600 mb-2">Oops! Something Went Wrong</h2>
          <p className="text-gray-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!demoClass) {
    return (
      <div className="h-screen bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-xl shadow-xl text-center max-w-md w-full">
          <Target size={64} className="mx-auto mb-4 text-blue-600" />
          <h2 className="text-xl font-bold text-blue-800">No Class Details Available</h2>
        </div>
      </div>
    );
  }

  // Format date
  const formattedDate = new Date(demoClass.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className=" bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Colorful Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 relative">
          <div className="absolute top-2 right-2">
            <Target size={32} className="text-white/20" />
          </div>
          <h1 className="text-xl font-extrabold mb-1 drop-shadow-md">
            {demoClass.programs[0].program} Adventures
          </h1>
          <p className="text-sm text-blue-100 font-medium">
            {demoClass.programs[0].programLevel} Level Challenge
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 gap-4 p-4">
          {/* Left Column - Class Details */}
          <div className="space-y-4">
            {/* Date Field with Hover Effects */}
            <div 
              className="bg-blue-50 p-3 rounded-xl shadow-md 
              transition-all duration-300 ease-in-out 
              hover:bg-blue-100 hover:shadow-lg 
              hover:scale-105 cursor-pointer group"
            >
              <div className="flex items-center space-x-3">
                <Calendar 
                  className="text-blue-600 
                  group-hover:text-blue-800 
                  group-hover:animate-bounce" 
                  size={24} 
                />
                <div>
                  <h3 className="text-sm font-bold text-blue-800 
                  group-hover:text-blue-900 
                  transition-colors duration-300">
                    Awesome Day
                  </h3>
                  <p className="text-xs text-blue-600 
                  group-hover:text-blue-800 
                  transition-colors duration-300">
                    {formattedDate}
                  </p>
                </div>
              </div>
            </div>

            {/* Time Field with Hover Effects */}
            <div 
              className="bg-purple-50 p-3 rounded-xl shadow-md 
              transition-all duration-300 ease-in-out 
              hover:bg-purple-100 hover:shadow-lg 
              hover:scale-105 cursor-pointer group"
            >
              <div className="flex items-center space-x-3">
                <Clock 
                  className="text-purple-600 
                  group-hover:text-purple-800 
                  group-hover:animate-spin" 
                  size={24} 
                />
                <div>
                  <h3 className="text-sm font-bold text-purple-800 
                  group-hover:text-purple-900 
                  transition-colors duration-300">
                    Exciting Time
                  </h3>
                  <p className="text-xs text-purple-600 
                  group-hover:text-purple-800 
                  transition-colors duration-300">
                    {demoClass.time}
                  </p>
                </div>
              </div>
            </div>

            {/* Online Classroom Field with Hover Effects */}
            <div 
              className="bg-green-50 p-3 rounded-xl shadow-md 
              transition-all duration-300 ease-in-out 
              hover:bg-green-100 hover:shadow-lg 
              hover:scale-105 cursor-pointer group"
            >
              <div className="flex items-center space-x-3">
                <Video 
                  className="text-green-600 
                  group-hover:text-green-800 
                  group-hover:animate-pulse" 
                  size={24} 
                />
                <div>
                  <h3 className="text-sm font-bold text-green-800 
                  group-hover:text-green-900 
                  transition-colors duration-300">
                    Magic Portal
                  </h3>
                  <p className="text-xs text-green-600 
                  group-hover:text-green-800 
                  transition-colors duration-300">
                    Online Classroom
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Class Excitement */}
          <div className="space-y-4">
            {/* Chess Journey Field with Hover Effects */}
            <div 
              className="bg-yellow-50 p-4 rounded-xl shadow-md 
              transition-all duration-300 ease-in-out 
              hover:bg-yellow-100 hover:shadow-lg 
              hover:scale-105"
            >
              <h3 className="text-base font-bold text-yellow-800 mb-2 
              group-hover:text-yellow-900 
              transition-colors duration-300">
                Your Chess Journey Begins!
              </h3>
              <p className="text-xs text-yellow-600 leading-relaxed 
              group-hover:text-yellow-800 
              transition-colors duration-300">
                Embark on an epic chess adventure where strategy meets fun! Learn to think like a chess master!
              </p>
            </div>

            {/* Superpowers Field with Hover Effects */}
            <div 
              className="bg-indigo-50 p-4 rounded-xl shadow-md 
              transition-all duration-300 ease-in-out 
              hover:bg-indigo-100 hover:shadow-lg 
              hover:scale-105"
            >
              <h4 className="text-base font-bold text-indigo-800 mb-3 
              group-hover:text-indigo-900 
              transition-colors duration-300">
                Superpowers You'll Gain
              </h4>
              <ul className="space-y-2">
                {[
                  "Chess Ninja Moves",
                  "Brain-Boosting Strategies",
                  "Victory Planning Skills"
                ].map((power, index) => (
                  <li 
                    key={index} 
                    className="flex items-center text-xs text-indigo-600 font-medium 
                    hover:text-indigo-800 hover:translate-x-2 
                    transition-all duration-300 ease-in-out cursor-pointer"
                  >
                    <Award 
                      size={16} 
                      className="mr-2 text-indigo-500 
                      group-hover:text-indigo-700 
                      transition-colors duration-300" 
                    />
                    {power}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-4 flex justify-center">
          <button 
            onClick={handleBookDemoClass}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full 
            text-sm font-bold hover:from-blue-700 hover:to-purple-700 
            transform hover:scale-105 transition-all shadow-md 
            flex items-center space-x-2 
            hover:animate-pulse"
          >
            <span>Join the Adventure!</span>
            <Award size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default KidsDemoClass;