import { useState } from "react";
import { Book, Rocket, Star, Shield, Gamepad } from "lucide-react";

const KidsChessDashboard = () => {
  const [activeCard, setActiveCard] = useState(null);

  const dashboardSections = [
    {
      title: "My Chess Adventure",
      icon: <Rocket className="text-secondary" size={40} />,
      color: "bg-secondary/10",
      buttonColor: "bg-primary",
      description: "Your chess journey starts here!",
      sections: [
        {
          name: "Pawn Recruit",
          icon: <Shield className="text-secondary" size={30} />,
          progress: 65,
        },
        {
          name: "Knight Level",
          icon: <Star className="text-tertiary" size={30} />,
          progress: 45,
        },
      ],
    },
    {
      title: "Fun Challenges",
      icon: <Gamepad className="text-primary" size={40} />,
      color: "bg-tertiary/10",
      buttonColor: "bg-primary",
      description: "Cool chess missions await!",
      challenges: [
        {
          title: "Checkmate Challenge",
          description: "Defeat the AI in 3 moves!",
          reward: "🏆 Bronze Medal",
        },
        {
          title: "Puzzle Master",
          description: "Solve tricky chess puzzles",
          reward: "🌟 Bonus Points",
        },
      ],
    },
    {
      title: "Chess Classes",
      icon: <Book className="text-secondary" size={40} />,
      color: "bg-quaternary/10",
      buttonColor: "bg-primary",
      description: "Learn and grow together!",
      classes: [
        {
          name: "Chess Basics",
          time: "Sat 10 AM",
          difficulty: "Beginner",
        },
        {
          name: "Strategy Masters",
          time: "Sun 11 AM",
          difficulty: "Intermediate",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/90 to-primary/70 p-4 sm:p-6 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Playful Header */}
        <header className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg mb-2 animate-bounce">
            Chess Champions 🏆
          </h1>
          <p className="text-lg sm:text-xl text-white/90 font-medium">
            Discover, Learn, and Conquer!
          </p>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {dashboardSections.map((section, index) => (
            <div
              key={index}
              className={`
                bg-white rounded-3xl shadow-2xl p-6 transform transition-all duration-300 
                ${
                  activeCard === index
                    ? "scale-105 ring-4 ring-secondary"
                    : "hover:scale-105"
                }
                cursor-pointer relative overflow-hidden group
              `}
              onMouseEnter={() => setActiveCard(index)}
              onMouseLeave={() => setActiveCard(null)}
            >
              {/* Animated Background */}
              <div
                className={`
                absolute top-0 left-0 w-full h-1 
                ${section.color} 
                group-hover:animate-pulse
              `}
              ></div>

              {/* Section Header */}
              <div className="flex items-center mb-4 space-x-4">
                {section.icon}
                <h2 className="text-2xl font-bold text-primary">
                  {section.title}
                </h2>
              </div>

              {/* Description */}
              <p className="text-primary/70 mb-4">{section.description}</p>

              {/* Conditional Content Rendering */}
              {section.sections && (
                <div className="space-y-4">
                  {section.sections.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-quinary/20 p-3 rounded-xl flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        {item.icon}
                        <span className="font-semibold text-primary">
                          {item.name}
                        </span>
                      </div>
                      <div className="w-20 bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-secondary h-2.5 rounded-full"
                          style={{ width: `${item.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {section.challenges && (
                <div className="space-y-4">
                  {section.challenges.map((challenge, idx) => (
                    <div
                      key={idx}
                      className="bg-tertiary/10 p-3 rounded-xl flex items-center justify-between hover:bg-tertiary/20 transition"
                    >
                      <div>
                        <h3 className="font-bold text-primary">
                          {challenge.title}
                        </h3>
                        <p className="text-sm text-primary/70">
                          {challenge.description}
                        </p>
                      </div>
                      <span className="text-lg">{challenge.reward}</span>
                    </div>
                  ))}
                </div>
              )}

              {section.classes && (
                <div className="space-y-4">
                  {section.classes.map((classItem, idx) => (
                    <div
                      key={idx}
                      className="bg-quaternary/10 p-3 rounded-xl flex items-center justify-between hover:bg-quaternary/20 transition"
                    >
                      <div>
                        <h3 className="font-bold text-primary">
                          {classItem.name}
                        </h3>
                        <p className="text-sm text-primary/70">
                          {classItem.time}
                        </p>
                      </div>
                      <span className="bg-quaternary text-white px-2 py-1 rounded-full text-xs">
                        {classItem.difficulty}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Action Button */}
              <div className="flex justify-center mt-6">
                <button
                  className={`
                    px-8 py-3 rounded-full 
                    ${section.buttonColor}
                    text-white font-bold 
                    hover:brightness-110 hover:shadow-xl 
                    transform hover:-translate-y-1 
                    transition-all duration-300
                    shadow-md
                  `}
                >
                  Explore More
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Fun Footer */}
        <footer className="text-center mt-8 md:mt-12">
          <p className="text-white/70 text-sm">
            Let's make learning chess fun! 🚀♟️
          </p>
        </footer>
      </div>
    </div>
  );
};

export default KidsChessDashboard;
