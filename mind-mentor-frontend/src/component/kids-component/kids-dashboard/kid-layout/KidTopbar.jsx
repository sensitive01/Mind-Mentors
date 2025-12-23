import React from "react";
import { useNavigate } from "react-router-dom";
import mindmentors from "../../../../images/mindmentorz_logo.png";
import { HelpCircle, LogOut, Menu } from "lucide-react";

const KidTopbar = ({ onMenuClick }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="w-full bg-gradient-to-r from-primary/90 to-primary/70 shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <Menu size={24} />
            </button>
            <img
              src={mindmentors}
              alt="MindMentorz Logo"
              className="w-[140px] sm:w-[180px] h-[40px] sm:h-[50px] object-contain transition-transform hover:scale-105 opacity-90"
            />
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              className="p-2 bg-white/20 rounded-full shadow-md hover:bg-white/30 transition-all duration-300 group"
              aria-label="Help"
            >
              <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:scale-110 transition-transform" />
            </button>

            <button
              onClick={handleLogout}
              className="p-2 bg-white/20 rounded-full shadow-md hover:bg-white/30 transition-all duration-300 group"
              aria-label="Logout"
            >
              <LogOut className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KidTopbar;
