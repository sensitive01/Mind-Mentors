import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Home, FileText, Grid, Leaf, Video, 
  Map, Trophy, Gamepad, UserCircle, ChevronRight 
} from "lucide-react";

const KidSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { path: "/kids/dashboard", icon: Home, label: "Home", color: "text-[#FF6B6B]" },
    { path: "/kids/demo-class", icon: FileText, label: "Class", color: "text-[#4ECDC4]" },
    { path: "/kids/class-schedule", icon: Grid, label: "Schedule", color: "text-[#45B7D1]" },
    { path: "/kids/chess-kid", icon: Gamepad, label: "Games", color: "text-[#FF9F1C]" },
    { path: "/kids/reports", icon: Trophy, label: "Achievements", color: "text-[#A64D79]" },
    { path: "/kids/certificates", icon: Map, label: "Journey", color: "text-[#6A5ACD]" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div 
      className="fixed top-0 left-0 bottom-0 w-[250px] bg-gradient-to-b from-[#FFF5E1] to-[#FFE4B5] flex flex-col shadow-2xl overflow-y-auto z-50"
      style={{
        height: '100vh', // Ensure full viewport height
        maxHeight: '100vh',
        minHeight: '100vh'
      }}
    >
      {/* Profile Section */}
      <div className="pt-6 pb-4 flex justify-center relative">
        <button 
          onClick={() => navigate("/kids/profile/manage")}
          className="relative group"
        >
          <div className={`w-16 h-16 rounded-full bg-gradient-to-br from-[#FF6B6B] to-[#4ECDC4] flex items-center justify-center shadow-lg transform transition-all duration-500 group-hover:scale-110`}>
            <UserCircle 
              size={48} 
              className="text-white w-full h-full transform group-hover:rotate-6 transition-transform"
            />
          </div>
          <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full animate-pulse"></div>
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 flex flex-col space-y-2 px-3 py-4 overflow-y-auto">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`group relative flex items-center py-3 px-3 rounded-xl transition-all duration-300 ease-in-out ${isActive(link.path) ? 'bg-white shadow-md scale-105' : 'hover:bg-white/50 hover:shadow-sm'}`}
          >
            {/* Icon Container */}
            <div className={`relative mr-3 transition-all duration-300 transform group-hover:scale-110 ${link.color} ${isActive(link.path) ? 'scale-125 rotate-6' : ''}`}>
              <link.icon 
                size={28} 
                strokeWidth={2} 
                className="group-hover:animate-bounce"
              />
            </div>

            {/* Label */}
            <span className={`text-sm font-bold transition-all duration-300 ${isActive(link.path) ? 'text-[#FF6B6B] scale-105' : 'text-gray-700 group-hover:text-[#FF6B6B]'}`}>
              {link.label}
            </span>
          </Link>
        ))}
      </nav>

      {/* Refer Section */}
      <div className="p-4 mt-auto">
        <div className="bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] rounded-2xl p-4 text-center relative overflow-hidden shadow-lg hover:scale-105 transition-all duration-300 group">
          <div className="absolute top-0 left-0 w-full h-full bg-white/10 transform -skew-x-12 group-hover:skew-x-0 transition-transform duration-300"></div>
          
          <h3 className="text-white font-bold text-lg mb-2">
            Refer a Friend
          </h3>
          <p className="text-white/80 text-xs mb-3">
            Earn cool rewards!
          </p>
          <button className="bg-white text-[#FF6B6B] px-4 py-2 rounded-full font-bold text-sm hover:bg-[#FF6B6B] hover:text-white transition-all duration-300">
            Invite Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default KidSidebar;
