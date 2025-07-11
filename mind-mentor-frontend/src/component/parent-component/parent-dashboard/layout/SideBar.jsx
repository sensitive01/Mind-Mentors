import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Calendar,
  Clock,
  PlayCircle,
  HelpCircle,
  Award,
  Users,
  Package,
} from "lucide-react";
import account from "../../../../images/boy.png";
import refer from "../../../../images/Refer.png";
import hoverAudio from "../../../../images/tunetank.com_mouse-hover.wav";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [scrollPosition, setScrollPosition] = useState(0);
  const [audio] = useState(new Audio(hoverAudio)); // Fixed: Use the imported hoverAudio file

  const isActive = (path) => location.pathname === path;

  const playHoverSound = () => {
    audio.volume = 0.5; // Set a comfortable volume level
    audio.currentTime = 0; // Reset sound to start
    audio.play().catch((err) => console.log("Audio play failed:", err));
  };

  // Initialize audio
  useEffect(() => {
    // Preload the audio
    audio.load();

    // Cleanup
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [audio]);

  const navLinks = [
    { path: "/parent/dashboard", icon: Home, label: "Home", iconSize: 19 },
    { path: "/parent/kid", icon: Users, label: "Kids", iconSize: 19 },
    {
      path: "/parent-kid-package-selection",
      icon: Package,
      label: "Package Selection",
      iconSize: 19,
    },
    {
      path: "/parent/walkthrough-video",
      icon: PlayCircle,
      label: "Walkthrough",
      iconSize: 19,
    },
    {
      path: "/parent/support",
      icon: HelpCircle,
      label: "Support",
      iconSize: 19,
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      setScrollPosition(position);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isScrolled = scrollPosition > 100;

  return (
    <aside className="w-[130px] bg-white flex flex-col h-screen sticky top-0 left-0">
      {/* Profile Section */}
      <div className="h-[80px] flex items-center justify-center mb-4">
        <button
          onClick={() => navigate("/parent/profile/manage")}
          className="relative group"
          onMouseEnter={playHoverSound}
        >
          <div className="w-12 h-12 rounded-full overflow-hidden transform transition-all duration-500 ease-in-out group-hover:scale-110 group-hover:shadow-lg group-hover:ring-4 group-hover:ring-[#642b8f] mt-6">
            <img
              src={account}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-3 h-3 bg-green-500 rounded-full absolute bottom-0 right-0 border-2 border-white"></div>
        </button>
      </div>

      {/* Navigation Links */}
      <nav className={`flex-1 py-4 ${isScrolled ? "hidden" : ""}`}>
        <div className="space-y-4 px-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onMouseEnter={playHoverSound}
              className={`group relative flex flex-col items-center justify-center py-4 px-2 rounded-lg transition-all duration-300 ease-in-out ${
                isActive(link.path) ? "bg-[#642b8f]" : "hover:bg-[#F3E5F5]"
              }`}
            >
              <div
                className={`absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-full bg-[#642b8f] rounded-r-full transition-all duration-300 ease-in-out ${
                  isActive(link.path)
                    ? "opacity-100"
                    : "opacity-0 group-hover:opacity-50"
                }`}
              />
              <div className="mb-3 transition-transform duration-300 ease-in-out group-hover:scale-110">
                <link.icon
                  size={link.iconSize}
                  className={`transition-colors duration-300 ${
                    isActive(link.path)
                      ? "text-white"
                      : "text-gray-600 group-hover:text-[#642b8f]"
                  }`}
                />
              </div>
              <span
                className={`text-xs font-medium text-center leading-tight transition-all duration-300 ${
                  isActive(link.path)
                    ? "text-white font-semibold"
                    : "text-gray-600 group-hover:text-[#642b8f]"
                }`}
              >
                {link.label}
              </span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Refer Section */}
      <div className={`p-3 mt-auto ${isScrolled ? "hidden" : ""}`}>
        <div
          onClick={() => navigate("/parent/new-referal")}
          onMouseEnter={playHoverSound}
          className="w-full relative group cursor-pointer transform transition-all duration-500 ease-in-out hover:scale-105"
        >
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#642b8f]/0 to-[#642b8f]/0 transition-opacity duration-300 group-hover:from-[#642b8f]/10 group-hover:to-[#642b8f]/10" />
          <img
            src={refer}
            alt="refer"
            className="w-full h-auto object-contain relative z-10 rounded-lg"
          />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
