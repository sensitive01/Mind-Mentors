import { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Video,
  Award,
  Target,
  Star,
  Rocket,
  Trophy
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getKidDemoClass } from '../../../api/service/kid/KidService';

const KidsDemoClass = () => {
  const kidId = localStorage.getItem("kidId")
  const [demoClass, setDemoClass] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDemoClassDetails = async () => {
      try {
        setLoading(true);
        const response = await getKidDemoClass(kidId);
        console.log(response)
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-amber-100 to-pink-100 animate-background">
        <Rocket size={64} className="text-orange-500 animate-bounce" />
        <div className="absolute animate-ping w-40 h-40 bg-orange-200 rounded-full opacity-50"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen bg-red-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-2xl text-center max-w-md w-full border-4 border-red-300">
          <div className="mb-4 flex justify-center">
            <Trophy className="text-red-500 animate-bounce" size={64} />
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">Oops! Adventure Paused</h2>
          <p className="text-gray-700 text-base">{error}</p>
        </div>
      </div>
    );
  }

  if (!demoClass) {
    return (
      <div className="h-screen bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-2xl text-center max-w-md w-full border-4 border-purple-300">
          <Star size={64} className="mx-auto mb-4 text-purple-600 animate-spin" />
          <h2 className="text-2xl font-bold text-purple-800">No Class Adventures Today</h2>
          <p className="text-purple-600 mt-2">Check back later for exciting missions!</p>
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
    <div className="min-h-screen bg-gradient-to-r from-amber-100 to-pink-100 flex items-center justify-center p-4">
      <div className="w-full bg-white rounded-3xl shadow-2xl overflow-hidden border-8 border-white relative">
        {/* Playful Header */}
        <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white p-6 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 transform rotate-45 bg-white/20 w-40 h-40 rounded-full"></div>
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-orange-400 to-pink-400 animate-pulse"></div>
          
          <h1 className="text-2xl font-extrabold mb-2 drop-shadow-md relative z-10">
            🚀 {demoClass.programs[0].program} Adventure Quest
          </h1>
          <p className="text-base text-white/90 font-medium relative z-10">
            Epic {demoClass.programs[0].programLevel} Level Challenge!
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 gap-6 p-6">
          {/* Left Column - Class Details */}
          <div className="space-y-4">
            {/* Date Field */}
            <div 
              className="bg-orange-50 p-4 rounded-2xl shadow-md 
              transform transition-all hover:scale-105 hover:shadow-xl 
              group cursor-pointer"
            >
              <div className="flex items-center space-x-4">
                <Calendar 
                  className="text-orange-500 group-hover:animate-bounce" 
                  size={32} 
                />
                <div>
                  <h3 className="text-base font-bold text-orange-800">
                    Mission Date
                  </h3>
                  <p className="text-sm text-orange-600">
                    {formattedDate}
                  </p>
                </div>
              </div>
            </div>

            {/* Time Field */}
            <div 
              className="bg-purple-50 p-4 rounded-2xl shadow-md 
              transform transition-all hover:scale-105 hover:shadow-xl 
              group cursor-pointer"
            >
              <div className="flex items-center space-x-4">
                <Clock 
                  className="text-purple-500 group-hover:animate-spin" 
                  size={32} 
                />
                <div>
                  <h3 className="text-base font-bold text-purple-800">
                    Adventure Time
                  </h3>
                  <p className="text-sm text-purple-600">
                    {demoClass.time}
                  </p>
                </div>
              </div>
            </div>

            {/* Online Classroom Field */}
            <div 
              className="bg-green-50 p-4 rounded-2xl shadow-md 
              transform transition-all hover:scale-105 hover:shadow-xl 
              group cursor-pointer"
            >
              <div className="flex items-center space-x-4">
                <Video 
                  className="text-green-500 group-hover:animate-pulse" 
                  size={32} 
                />
                <div>
                  <h3 className="text-base font-bold text-green-800">
                    Magic Portal
                  </h3>
                  <p className="text-sm text-green-600">
                    Online Classroom
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Class Excitement */}
          <div className="space-y-4">
            {/* Chess Journey Field */}
            <div 
              className="bg-yellow-50 p-4 rounded-2xl shadow-md 
              transform transition-all hover:scale-105 hover:shadow-xl"
            >
              <h3 className="text-xl font-bold text-yellow-800 mb-2">
                🏰 Your Epic Journey Begins!
              </h3>
              <p className="text-sm text-yellow-600 leading-relaxed">
                Prepare for an incredible adventure where every move tells a story! Learn secret chess strategies that'll make you a true champion!
              </p>
            </div>

            {/* Superpowers Field */}
            <div 
              className="bg-indigo-50 p-4 rounded-2xl shadow-md 
              transform transition-all hover:scale-105 hover:shadow-xl"
            >
              <h4 className="text-xl font-bold text-indigo-800 mb-3">
                🌟 Unlock Your Superpowers
              </h4>
              <ul className="space-y-2">
                {[
                  "Chess Ninja Moves 🥷",
                  "Brain-Boosting Strategies 🧠",
                  "Victory Planning Skills 🏆"
                ].map((power, index) => (
                  <li 
                    key={index} 
                    className="flex items-center text-sm text-indigo-600 font-medium 
                    hover:text-indigo-800 hover:translate-x-2 
                    transition-all duration-300 ease-in-out cursor-pointer"
                  >
                    <Award 
                      size={20} 
                      className="mr-2 text-indigo-500" 
                    />
                    {power}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="bg-gradient-to-r from-orange-100 to-pink-100 p-6 flex justify-center">
          <button 
            className="bg-gradient-to-r from-orange-500 to-pink-500 text-white 
            px-8 py-3 rounded-full text-base font-bold 
            hover:from-orange-600 hover:to-pink-600 
            transform hover:scale-110 transition-all 
            shadow-xl flex items-center space-x-3 
            hover:animate-pulse"
          >
            <Rocket size={24} />
            <span>Launch Your Adventure!</span>
            <Star size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default KidsDemoClass;