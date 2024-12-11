import React from "react";
import { Calendar, Clock, Star, Users, Video, Sword } from "lucide-react";

const KidsChessClassSchedule = () => {
  const classSchedule = [
    {
      id: 1,
      program: "Chess Adventurers",
      coach: "Captain Chess",
      date: "Tue, Dec 17",
      time: "4:00 PM - 5:00 PM",
      starRating: 4.8,
      meetingLink: "https://example.com/chess-basics",
      backgroundColor: "bg-blue-100",
      textColor: "text-blue-900",
      icon: "🏰",
      level: "Beginner Explorers",
      description: "Learn chess through exciting stories and games!",
    },
    {
      id: 2,
      program: "Chess Ninja Warriors",
      coach: "Sensei Strategy",
      date: "Wed, Dec 18",
      time: "3:30 PM - 4:30 PM",
      starRating: 5,
      meetingLink: "https://example.com/chess-tactics",
      backgroundColor: "bg-green-100",
      textColor: "text-green-900",
      icon: "🥷",
      level: "Tactics Masters",
      description: "Become a chess strategy superhero!",
    },
    {
      id: 3,
      program: "Magical Chess Kingdom",
      coach: "Wizard Wallace",
      date: "Thu, Dec 19",
      time: "5:00 PM - 6:00 PM",
      starRating: 4.7,
      meetingLink: "https://example.com/chess-champions",
      backgroundColor: "bg-purple-100",
      textColor: "text-purple-900",
      icon: "🧙‍♂️",
      level: "Magic Move Makers",
      description: "Unleash your inner chess wizard!",
    },
    {
      id: 4,
      program: "Robo-Chess Challenge",
      coach: "Tech Tina",
      date: "Fri, Dec 20",
      time: "4:30 PM - 5:30 PM",
      starRating: 4.9,
      meetingLink: "https://example.com/speed-chess",
      backgroundColor: "bg-red-100",
      textColor: "text-red-900",
      icon: "🤖",
      level: "Future Champions",
      description: "Code-like strategies and lightning moves!",
    },
    {
      id: 5,
      program: "Pirate Chess Crew",
      coach: "Captain Checkmate",
      date: "Mon, Dec 16",
      time: "3:00 PM - 4:00 PM",
      starRating: 4.6,
      meetingLink: "https://example.com/chess-strategy",
      backgroundColor: "bg-yellow-100",
      textColor: "text-yellow-900",
      icon: "🏴‍☠️",
      level: "Strategy Buccaneers",
      description: "Sail the seas of strategic chess!",
    },
    {
      id: 6,
      program: "Dragon Chess League",
      coach: "Professor Pawns",
      date: "Wed, Dec 18",
      time: "2:00 PM - 3:00 PM",
      starRating: 4.8,
      meetingLink: "https://example.com/chess-fun",
      backgroundColor: "bg-orange-100",
      textColor: "text-orange-900",
      icon: "🐉",
      level: "Junior Dragons",
      description: "Breathe fire into your chess skills!",
    },
  ];

  const StarRating = ({ rating }) => (
    <div className="flex items-center">
      {[...Array(5)].map((_, index) => (
        <Star
          key={index}
          fill={index < Math.floor(rating) ? "currentColor" : "none"}
          className={`w-4 h-4 ${
            index < Math.floor(rating) ? "text-yellow-500" : "text-gray-300"
          }`}
        />
      ))}
      <span className="ml-2 text-sm font-bold">({rating})</span>
    </div>
  );

  const LevelBadge = ({ level }) => (
    <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/80 shadow-sm">
      <span className="text-xs font-bold">{level}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-blue-600 mb-4 animate-bounce">
            🎮 Chess Adventure Academy 🎮
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join us for exciting chess lessons where learning meets fun! 
            Perfect for young minds aged 6-12.
          </p>
        </div>

        {/* Class Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classSchedule.map((classItem) => (
            <div
              key={classItem.id}
              className={`${classItem.backgroundColor} rounded-2xl overflow-hidden 
                shadow-xl transform hover:scale-102 transition-all duration-300
                border-2 border-white/50 backdrop-blur-sm`}
            >
              {/* Card Header */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-4xl">{classItem.icon}</span>
                    <div>
                      <h2 className="text-xl font-bold mb-1">{classItem.program}</h2>
                      <StarRating rating={classItem.starRating} />
                    </div>
                  </div>
                  <LevelBadge level={classItem.level} />
                </div>

                {/* Class Details */}
                <div className="space-y-3 bg-white/60 rounded-xl p-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    <span className="font-medium">{classItem.date}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-green-500" />
                    <span className="font-medium">{classItem.time}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-purple-500" />
                    <span className="font-medium">Coach {classItem.coach}</span>
                  </div>
                </div>

                <p className="text-sm italic text-center mb-4">{classItem.description}</p>

                {/* Join Button */}
                <button
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 
                    text-white py-3 px-4 rounded-xl font-bold text-sm
                    hover:from-blue-600 hover:to-purple-600 
                    transform active:scale-95 transition-all duration-200
                    flex items-center justify-center space-x-2"
                >
                  <Video className="w-5 h-5" />
                  <span>Join Class!</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Section */}
        <div className="mt-12 text-center bg-white/80 rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-blue-600 mb-4">
            ⭐️ Benefits of Our Chess Classes ⭐️
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="p-4">
              <span className="text-3xl mb-2 block">🧠</span>
              <h4 className="font-bold mb-2">Strategic Thinking</h4>
              <p className="text-sm text-gray-600">Develop problem-solving skills</p>
            </div>
            <div className="p-4">
              <span className="text-3xl mb-2 block">🤝</span>
              <h4 className="font-bold mb-2">Social Skills</h4>
              <p className="text-sm text-gray-600">Make friends and learn teamwork</p>
            </div>
            <div className="p-4">
              <span className="text-3xl mb-2 block">🎯</span>
              <h4 className="font-bold mb-2">Focus & Patience</h4>
              <p className="text-sm text-gray-600">Improve concentration abilities</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KidsChessClassSchedule;