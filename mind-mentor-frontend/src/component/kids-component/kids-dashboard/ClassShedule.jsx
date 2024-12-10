import React from "react";
import { Calendar, Clock, Star, Users, Video, Sword } from "lucide-react";

const KidsChessClassSchedule = () => {
  // Playful chess class data for kids
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

  // Star rating component with kid-friendly design
  const StarRating = ({ rating }) => {
    return (
      <div className="flex items-center text-yellow-500">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            fill={index < Math.floor(rating) ? "currentColor" : "none"}
            className={`w-5 h-5 ${
              index < Math.floor(rating) ? "text-yellow-500" : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600 font-bold">({rating})</span>
      </div>
    );
  };

  // Level badge with playful design
  const LevelBadge = ({ level }) => {
    return (
      <span className="px-3 py-1 rounded-full text-xs font-bold bg-white shadow-md">
        {level}
      </span>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-blue-50 to-purple-50">
      <h1
        className="text-5xl font-extrabold text-center text-blue-700 mb-10 
        animate-bounce shadow-lg p-4 rounded-xl border-4 border-dashed border-yellow-400"
      >
        🏆 Epic Chess Adventures! 🏆
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {classSchedule.map((classItem) => (
          <div
            key={classItem.id}
            className={`${classItem.backgroundColor} ${classItem.textColor} 
              rounded-3xl p-6 shadow-2xl transform hover:scale-105 
              transition-all duration-300 hover:rotate-3 
              border-4 border-white`}
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-4">
                <span className="text-5xl drop-shadow-md">
                  {classItem.icon}
                </span>
                <h2 className="text-3xl font-black tracking-tight">
                  {classItem.program}
                </h2>
              </div>
              <StarRating rating={classItem.starRating} />
            </div>

            <div className="space-y-3 mb-4 bg-white bg-opacity-50 p-3 rounded-xl">
              <div className="flex items-center">
                <Calendar className="mr-2 w-6 h-6 text-blue-600" />
                <span className="font-bold">{classItem.date}</span>
              </div>

              <div className="flex items-center">
                <Clock className="mr-2 w-6 h-6 text-green-600" />
                <span className="font-bold">{classItem.time}</span>
              </div>

              <div className="flex items-center">
                <Users className="mr-2 w-6 h-6 text-purple-600" />
                <span className="font-bold">Coach: {classItem.coach}</span>
              </div>

              <div className="flex items-center space-x-2">
                <Sword className="w-6 h-6 text-red-600" />
                <LevelBadge level={classItem.level} />
              </div>
            </div>

            <p className="text-sm italic mb-4 text-center">
              {classItem.description}
            </p>

            <a
              href={classItem.meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center 
                bg-gradient-to-r from-blue-600 to-purple-600 
                text-white py-3 rounded-full 
                hover:from-blue-700 hover:to-purple-700 
                transition-colors transform active:scale-95 
                font-bold text-lg shadow-lg"
            >
              <Video className="mr-2 w-6 h-6" />
              Join the Adventure!
            </a>
          </div>
        ))}
      </div>

      <div className="text-center mt-10 bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-3xl font-bold text-blue-800 mb-4">
          🌟 Why Join Our Chess Classes? 🌟
        </h3>
        <p className="text-xl text-gray-700">
          Fun, friendship, and brain-boosting chess skills await! Learn, play,
          and become a chess champion! 🏆
        </p>
      </div>
    </div>
  );
};

export default KidsChessClassSchedule;
