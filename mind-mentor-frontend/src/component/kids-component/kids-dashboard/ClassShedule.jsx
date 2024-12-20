import { Calendar, Clock, Users, Video, Star, History, PlayCircle, CalendarClock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getMyClassData } from "../../../api/service/kid/KidService";

const KidsChessClassSchedule = () => {
  const [activeTab, setActiveTab] = useState('live');
  const [classData, setClassData] = useState({
    conducted: [],
    live: [],
    upcoming: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const kidId = localStorage.getItem("kidId");

  useEffect(() => {
    const fetchMyClassData = async () => {
      try {
        setLoading(true);
        const response = await getMyClassData(kidId);
        setClassData(response?.data?.responseData);
      } catch (err) {
        setError('Failed to fetch class data');
      } finally {
        setLoading(false);
      }
    };
    fetchMyClassData();
  }, [kidId]);

  const tabs = [
    { id: 'conducted', label: 'Past Adventures', icon: History, emoji: '📚' },
    { id: 'live', label: 'Live Games', icon: PlayCircle, emoji: '🎮' },
    { id: 'upcoming', label: 'Coming Soon', icon: CalendarClock, emoji: '🎯' }
  ];

  const EmptyState = ({ message }) => (
    <div className="text-center py-12">
      <div className="text-6xl mb-4 animate-bounce">🎲</div>
      <h3 className="text-xl font-bold text-purple-600 mb-2">No Chess Adventures Yet!</h3>
      <p className="text-purple-500">{message}</p>
    </div>
  );

  const ClassCard = ({ classInfo, type }) => (
    <div className="relative transform transition-all duration-300 hover:scale-105">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl transform rotate-1"></div>
      <div className="relative bg-white rounded-2xl p-6 shadow-xl border-4 border-purple-200">
        {/* Class Type Badge */}
        <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 py-1 rounded-full font-bold shadow-lg transform rotate-3">
          {type === 'live' ? '🎮 LIVE' : type === 'upcoming' ? '🌟 COMING UP' : '📚 COMPLETED'}
        </div>

        <div className="mb-4">
          <h3 className="text-2xl font-bold text-purple-600 mb-2">
            {classInfo.classData?.program || classInfo.program || 'Chess Class'} 
          </h3>
          <span className="inline-block bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm font-bold">
            {classInfo.classData?.level || classInfo.level || 'All Levels'}
          </span>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-center bg-purple-50 p-3 rounded-lg">
            <Calendar className="w-6 h-6 text-purple-500 mr-3" />
            <span className="font-medium text-purple-600">
              {classInfo.classData?.day || classInfo.day || 'Game Day!'}
            </span>
          </div>
          
          <div className="flex items-center bg-pink-50 p-3 rounded-lg">
            <Clock className="w-6 h-6 text-pink-500 mr-3" />
            <span className="font-medium text-pink-600">
              {classInfo.classData?.classTime || classInfo.classTime}
            </span>
          </div>
          
          <div className="flex items-center bg-orange-50 p-3 rounded-lg">
            <Users className="w-6 h-6 text-orange-500 mr-3" />
            <span className="font-medium text-orange-600">
              Coach {classInfo.classData?.coachName || classInfo.coachName}
            </span>
          </div>
        </div>

        {classInfo.student?.feedback && (
          <div className="bg-yellow-50 p-4 rounded-xl mb-4">
            <div className="flex items-center mb-2">
              <Star className="w-5 h-5 text-yellow-500 mr-2" fill="currentColor" />
              <span className="font-bold text-yellow-700">Coach's Feedback</span>
            </div>
            <p className="text-yellow-600">{classInfo.student.feedback}</p>
          </div>
        )}

        {(type === 'live' || type === 'upcoming') && classInfo.meetingLink && (
          <button 
            onClick={() => window.open(classInfo.meetingLink, '_blank')}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 
              text-white px-6 py-3 rounded-xl font-bold text-lg shadow-lg transform transition-all duration-200 
              hover:scale-105 hover:shadow-xl flex items-center justify-center gap-2"
          >
            <Video className="w-6 h-6" />
            {type === 'live' ? '🎮 Join the Fun!' : '🎯 Get Ready!'}
          </button>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-8">
        <div className="text-center">
          <div className="text-6xl animate-bounce mb-4">♟️</div>
          <p className="text-purple-600 text-xl">Setting up the chess board...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-8">
        <div className="text-center">
          <div className="text-6xl mb-4">😟</div>
          <p className="text-red-500 text-xl">Oops! Something went wrong</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
            Chess Adventure Time! 🎮
          </h1>
          <p className="text-xl text-purple-500">Ready for some amazing chess adventures?</p>
        </div>

        {/* Fun Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {tabs.map(({ id, label, emoji }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full text-lg font-bold transition-all duration-300
                ${activeTab === id 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105' 
                  : 'bg-white text-purple-600 hover:bg-purple-50'}`}
            >
              <span className="text-2xl">{emoji}</span>
              {label}
            </button>
          ))}
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeTab === 'conducted' && (
            classData.conducted?.length > 0 
              ? classData.conducted.map(classInfo => (
                  <ClassCard key={classInfo._id} classInfo={classInfo} type="conducted" />
                ))
              : <EmptyState message="Your chess journey is about to begin! 🚀" />
          )}
          
          {activeTab === 'live' && (
            classData.live?.length > 0
              ? classData.live.map(classInfo => (
                  <ClassCard key={classInfo._id} classInfo={classInfo} type="live" />
                ))
              : <EmptyState message="No live games right now. Check back soon! 🎮" />
          )}
          
          {activeTab === 'upcoming' && (
            classData.upcoming?.length > 0
              ? classData.upcoming.map(classInfo => (
                  <ClassCard key={classInfo._id} classInfo={classInfo} type="upcoming" />
                ))
              : <EmptyState message="More adventures coming soon! 🌟" />
          )}
        </div>
      </div>
    </div>
  );
};

export default KidsChessClassSchedule;