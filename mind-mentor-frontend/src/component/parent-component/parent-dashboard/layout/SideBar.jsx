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
} from "lucide-react";
import account from "../../../../images/boy.png";
import refer from "../../../../images/Refer.png";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [scrollPosition, setScrollPosition] = useState(0);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: "/parent/dashboard", icon: Home, label: "Home", iconSize: 24 },
    { path: "/parent/kid", icon: Users, label: "Kids", iconSize: 24 },
    {
      path: "/parent/kid/attendance",
      icon: Calendar,
      label: "Class schedules",
      iconSize: 24,
    },
    { path: "#", icon: Clock, label: "Availability", iconSize: 24 },
    {
      path: "/parent/walkthrough-video",
      icon: PlayCircle,
      label: "Walkthrough",
      iconSize: 24,
    },
    {
      path: "/parent/support",
      icon: HelpCircle,
      label: "Support",
      iconSize: 24,
    },
    {
      path: "/parent/certificate",
      icon: Award,
      label: "Certificates",
      iconSize: 24,
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
    <div className="w-[130px] bg-white flex flex-col  h-screen overflow-hidden">
      <div className="pt-6 pb-4 flex justify-center relative ">
        <button
          onClick={() => navigate("/parent/profile/manage")}
          className="relative group"
        >
          <div className="w-12 h-12 rounded-full overflow-hidden transform transition-all duration-500 ease-in-out group-hover:scale-110 group-hover:shadow-lg group-hover:ring-4 group-hover:ring-[#642b8f]">
            <img
              src={account}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-3 h-3 bg-green-500 rounded-full absolute bottom-0 right-0 border-2 border-white"></div>
        </button>
      </div>

     
      <nav
        className={`flex-1 flex flex-col space-y-2 px-2 py-2 ${
          isScrolled ? "hidden" : ""
        }`}
      >
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`group relative flex flex-col items-center justify-center py-3 px-2 rounded-lg transition-all duration-300 ease-in-out ${
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
            <div
              className={`relative mb-2 transition-transform duration-300 ease-in-out ${
                link.isKid ? "w-16 h-16" : ""
              } ${isActive(link.path) ? "scale-110" : "group-hover:scale-110"}`}
            >
              {link.isKid ? (
                <Users
                  size={link.iconSize}
                  className={`transition-colors duration-300 ${
                    isActive(link.path)
                      ? "text-white" 
                      : "text-gray-600 group-hover:text-[#642b8f]" 
                  }`}
                />
              ) : (
                <link.icon
                  size={link.iconSize}
                  className={`transition-colors duration-300 ${
                    isActive(link.path)
                      ? "text-white" 
                      : "text-gray-600 group-hover:text-[#642b8f]"
                  }`}
                />
              )}
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
      </nav>

   
      <div
        className={`mt-auto  flex  justify-center ${
          isScrolled ? "hidden" : ""
        }`}
        onClick={() => navigate("/parent/new-referal")}
      >
        <div className="w-full relative group cursor-pointer transform transition-all duration-500 ease-in-out hover:scale-105">
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#642b8f]/0 to-[#642b8f]/0 transition-opacity duration-300 group-hover:from-[#642b8f]/10 group-hover:to-[#642b8f]/10" />
          <img
            src={refer}
            alt="refer"
            className="w-full h-auto object-contain relative z-10 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
