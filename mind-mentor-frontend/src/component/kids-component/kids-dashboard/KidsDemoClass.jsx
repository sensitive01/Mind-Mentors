import { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Video,
  Award,
  Target,
  Star,
  Rocket,
  ExternalLink,
  User
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getDemoClass } from '../../../api/service/parent/ParentService';

const KidsDemoClass = () => {
  const kidId = localStorage.getItem("kidId")
  const [demoClass, setDemoClass] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDemoClassDetails = async () => {
      try {
        setLoading(true);
        const response = await getDemoClass(kidId);
        console.log(response)
        setDemoClass(response.data.classDetails);
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
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-primary to-primary/80 animate-background">
        <Rocket size={64} className="text-white animate-bounce" />
        <div className="absolute animate-ping w-40 h-40 bg-primary/30 rounded-full opacity-50"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen bg-primary/10 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-2xl text-center max-w-md w-full border-4 border-primary/30">
          <div className="mb-4 flex justify-center">
            <Target className="text-primary animate-bounce" size={64} />
          </div>
          <h2 className="text-2xl font-bold text-primary mb-4">Oops! Adventure Paused</h2>
          <p className="text-gray-700 text-base">{error}</p>
        </div>
      </div>
    );
  }

  if (!demoClass) {
    return (
      <div className="h-screen bg-gradient-to-r from-primary/90 to-primary/70 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-2xl text-center max-w-md w-full border-4 border-primary/30">
          <Star size={64} className="mx-auto mb-4 text-primary animate-spin" />
          <h2 className="text-2xl font-bold text-primary">No Class Adventures Today</h2>
          <p className="text-primary/80 mt-2">Check back later for exciting missions!</p>
        </div>
      </div>
    );
  }

  const handleJoinClass = () => {
    window.open(demoClass.meetingLink, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-primary/90 to-primary/70 flex items-center justify-center p-4">
      <div className="w-full bg-white rounded-3xl shadow-2xl overflow-hidden border-8 border-white relative max-w-4xl">
        {/* Playful Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-6 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 transform rotate-45 bg-white/20 w-40 h-40 rounded-full"></div>
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-primary/70 to-primary/90 animate-pulse"></div>
          
          <h1 className="text-2xl font-extrabold mb-2 drop-shadow-md relative z-10">
            🏆 {demoClass.program} Champion Quest
          </h1>
          <p className="text-base text-white/90 font-medium relative z-10">
            {demoClass.level} Level Training
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 gap-6 p-6">
          {/* Left Column - Class Details */}
          <div className="space-y-4">
            {/* Date Field */}
            <div 
              className="bg-primary/10 p-4 rounded-2xl shadow-md 
              transform transition-all hover:scale-105 hover:shadow-xl"
            >
              <div className="flex items-center space-x-4">
                <Calendar 
                  className="text-primary" 
                  size={32} 
                />
                <div>
                  <h3 className="text-base font-bold text-primary">
                    Mission Day
                  </h3>
                  <p className="text-sm text-primary/70">
                    {demoClass.day} {new Date(demoClass.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Time Field */}
            <div 
              className="bg-primary/10 p-4 rounded-2xl shadow-md 
              transform transition-all hover:scale-105 hover:shadow-xl"
            >
              <div className="flex items-center space-x-4">
                <Clock 
                  className="text-primary" 
                  size={32} 
                />
                <div>
                  <h3 className="text-base font-bold text-primary">
                    Adventure Time
                  </h3>
                  <p className="text-sm text-primary/70">
                    {demoClass.classTime}
                  </p>
                </div>
              </div>
            </div>

            {/* Coach Field */}
            <div 
              className="bg-primary/10 p-4 rounded-2xl shadow-md 
              transform transition-all hover:scale-105 hover:shadow-xl"
            >
              <div className="flex items-center space-x-4">
                <User 
                  className="text-primary" 
                  size={32} 
                />
                <div>
                  <h3 className="text-base font-bold text-primary">
                    Mission Guide
                  </h3>
                  <p className="text-sm text-primary/70">
                    {demoClass.coachName || 'Expert Instructor'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Additional Details */}
          <div className="space-y-4">
            {/* Class Type & Level */}
            <div 
              className="bg-primary/10 p-4 rounded-2xl shadow-md 
              transform transition-all hover:scale-105 hover:shadow-xl"
            >
              <h3 className="text-xl font-bold text-primary mb-2">
                🎯 Your Training Details
              </h3>
              <div className="space-y-2">
                <p className="text-sm text-primary/70 flex items-center">
                  <Award size={20} className="mr-2 text-primary" />
                  Type: {demoClass.classType}
                </p>
                <p className="text-sm text-primary/70 flex items-center">
                  <Target size={20} className="mr-2 text-primary" />
                  Level: {demoClass.level}
                </p>
                <p className="text-sm text-primary/70 flex items-center">
                  <Star size={20} className="mr-2 text-primary" />
                  Status: {demoClass.status}
                </p>
              </div>
            </div>

            {/* Learner Superpowers */}
            <div 
              className="bg-primary/10 p-4 rounded-2xl shadow-md 
              transform transition-all hover:scale-105 hover:shadow-xl"
            >
              <h4 className="text-xl font-bold text-primary mb-3">
                🌟 Your Learning Adventure
              </h4>
              <ul className="space-y-2">
                {[
                  "Skill Building 🧠",
                  "Fun Learning 🎉",
                  "Expert Guidance 🏆"
                ].map((power, index) => (
                  <li 
                    key={index} 
                    className="flex items-center text-sm text-primary/70 font-medium 
                    hover:text-primary 
                    transition-all duration-300 ease-in-out"
                  >
                    <Award 
                      size={20} 
                      className="mr-2 text-primary" 
                    />
                    {power}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-primary/10 p-6 flex justify-center space-x-4">
          <button 
            onClick={handleJoinClass}
            className="bg-gradient-to-r from-primary to-primary/80 text-white 
            px-8 py-3 rounded-full text-base font-bold 
            hover:from-primary/90 hover:to-primary 
            transform hover:scale-110 transition-all 
            shadow-xl flex items-center space-x-3 
            hover:animate-pulse"
          >
            <Video size={24} />
            <span>Join Class</span>
            <ExternalLink size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default KidsDemoClass;