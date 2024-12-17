import React from "react";
import { useNavigate } from "react-router-dom";
import mindmentors from "../../../../images/mindmentorz_logo.png";
import { HelpCircle, LogOut } from "lucide-react";

const KidTopbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="w-full bg-gradient-to-r from-primary/90 to-primary/70 shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <img
              src={mindmentors}
              alt="MindMentorz Logo"
              className="w-[180px] h-[50px] object-contain transition-transform hover:scale-105 opacity-90"
            />
          </div>

          <div className="flex items-center space-x-4">
            <button
              className="p-2 bg-white/20 rounded-full shadow-md hover:bg-white/30 transition-all duration-300 group"
              aria-label="Help"
            >
              <HelpCircle className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
            </button>

            <button
              onClick={handleLogout}
              className="p-2 bg-white/20 rounded-full shadow-md hover:bg-white/30 transition-all duration-300 group"
              aria-label="Logout"
            >
              <LogOut className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KidTopbar;