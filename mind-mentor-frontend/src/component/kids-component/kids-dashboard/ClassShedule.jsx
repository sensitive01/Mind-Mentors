import { Calendar, Clock, Users, Video, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { getMyUpcomingClassData } from "../../../api/service/kid/KidService";

// Remove WebRTC component since you mentioned you're not using it

// Main component - ONLY upcoming classes
const KidsChessClassSchedule = () => {
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const kidId = localStorage.getItem("kidId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getMyUpcomingClassData(kidId);
        console.log("response", response);
        if (response.status === 200) {
          console.log(response.data.upcomingClass);
          setUpcomingClasses(response.data.upcomingClass || []);
          setLoading(false);
        }
      } catch (err) {
        setError(err.message || "Failed to load classes");
        setLoading(false);
      }
    };

    if (kidId) {
      fetchData();
    } else {
      setError("Kid ID not found");
      setLoading(false);
    }
  }, [kidId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  const isToday = (dateString) => {
    const classDate = new Date(dateString);
    const today = new Date();
    return classDate.toDateString() === today.toDateString();
  };

  const ClassCard = ({ classInfo }) => (
    <div className="relative group transform transition-all duration-300 hover:scale-105">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 rounded-3xl transform rotate-1 group-hover:rotate-2 transition-transform duration-300"></div>

      {/* Main card */}
      <div className="relative bg-white rounded-3xl p-8 shadow-2xl border-4 border-purple-200">
        {/* Status badges */}
        <div className="absolute -top-4 -right-4 flex flex-col gap-2">
          {isToday(classInfo.classDate) && (
            <div className="bg-gradient-to-r from-green-400 to-green-500 text-white px-4 py-2 rounded-full font-bold shadow-lg animate-pulse">
              🎮 TODAY!
            </div>
          )}
          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 py-2 rounded-full font-bold shadow-lg transform rotate-3">
            🌟 {classInfo.status.toUpperCase()}
          </div>
        </div>

        {/* Class title and level */}
        <div className="mb-6">
          <h3 className="text-3xl font-bold text-purple-600 mb-3">
            Chess Class - Session {classInfo.sessionNumber}
          </h3>
          <span className="inline-block bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-4 py-2 rounded-full text-lg font-bold border-2 border-purple-200">
            {classInfo.type === "online" ? "💻 Online Class" : "🏫 In-Person"}
          </span>
        </div>

        {/* Class details */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl">
            <Calendar className="w-7 h-7 text-purple-500 mr-4 flex-shrink-0" />
            <div>
              <span className="block font-bold text-purple-700 text-lg">
                {classInfo.day}
              </span>
              <span className="text-purple-600">
                {formatDate(classInfo.classDate)}
              </span>
            </div>
          </div>

          <div className="flex items-center bg-gradient-to-r from-pink-50 to-pink-100 p-4 rounded-xl">
            <Clock className="w-7 h-7 text-pink-500 mr-4 flex-shrink-0" />
            <div>
              <span className="block font-bold text-pink-700 text-lg">
                Session #{classInfo.sessionNumber}
              </span>
              <span className="text-pink-600">{classInfo.formattedDate}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const EmptyState = () => (
    <div className="text-center py-20">
      <div className="text-8xl mb-8 animate-bounce">🎯</div>
      <h3 className="text-4xl font-bold text-purple-600 mb-4">
        No Upcoming Classes
      </h3>
      <p className="text-xl text-purple-500 mb-8">
        New chess adventures will be scheduled soon!
      </p>
      <div className="flex justify-center gap-4">
        <div className="text-4xl animate-pulse">♔</div>
        <div className="text-4xl animate-pulse delay-100">♕</div>
        <div className="text-4xl animate-pulse delay-200">♖</div>
        <div className="text-4xl animate-pulse delay-300">♗</div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/90 to-primary/70 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-8xl animate-spin mb-6">♟️</div>
          <h2 className="text-3xl font-bold text-purple-600 mb-4">
            Loading your chess adventures...
          </h2>
          <div className="flex justify-center space-x-2">
            <div className="w-4 h-4 bg-purple-400 rounded-full animate-bounce"></div>
            <div className="w-4 h-4 bg-pink-400 rounded-full animate-bounce delay-100"></div>
            <div className="w-4 h-4 bg-orange-400 rounded-full animate-bounce delay-200"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-orange-50 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-8xl mb-6">😟</div>
          <h2 className="text-3xl font-bold text-red-500 mb-4">
            Oops! Something went wrong
          </h2>
          <p className="text-xl text-red-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/90 to-primary/70 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="text-8xl mb-6 animate-bounce">🎯</div>
          <h1 className="text-6xl text-white font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 mb-6 drop-shadow-lg">
            Upcoming Chess Adventures!
          </h1>
          <p className="text-2xl text-white drop-shadow-md">
            Get ready for amazing chess sessions ahead
          </p>

          {/* Chess pieces decoration */}
          <div className="flex justify-center gap-4 mt-8">
            <div className="text-4xl animate-pulse text-white">♔</div>
            <div className="text-4xl animate-pulse delay-100 text-white">♕</div>
            <div className="text-4xl animate-pulse delay-200 text-white">♖</div>
            <div className="text-4xl animate-pulse delay-300 text-white">♗</div>
            <div className="text-4xl animate-pulse delay-400 text-white">♘</div>
            <div className="text-4xl animate-pulse delay-500 text-white">♙</div>
          </div>
        </div>

        {/* Classes Grid or Empty State */}
        {upcomingClasses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {upcomingClasses.map((classInfo) => (
              <ClassCard
                key={classInfo._id || classInfo.sessionId}
                classInfo={classInfo}
              />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}

        {/* Bottom decoration */}
        {upcomingClasses.length > 0 && (
          <div className="text-center mt-16">
            <div className="text-6xl animate-bounce">🏆</div>
            <p className="text-xl text-white mt-4 drop-shadow-md">
              Ready to become a chess champion?
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KidsChessClassSchedule;
