import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import mindmentors from "../../../../images/mindmentorz.png";
import info from "../../../../images/info_icon.png";
import logoutIcon from "../../../../images/logout icon.png";

const ParentTopBar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="bg-white shadow-lg h-16">
      <div className="flex justify-between items-center h-full px-3 sm:px-5 lg:px-6">
        {/* Left Section */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu size={20} className="text-gray-600" />
          </button>

          {/* Logo */}
          <div className="flex items-center">
            <img
              src={mindmentors}
              alt="MindMentorz Logo"
              className="w-[100px] sm:w-[130px] md:w-[160px] lg:w-[180px] xl:w-[200px] h-[25px] sm:h-[32px] md:h-[40px] lg:h-[45px] xl:h-[50px] object-contain"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
          {/* Info Icon - Hidden on very small screens */}
          <button className="hidden sm:flex items-center justify-center p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <img
              src={info}
              alt="Info"
              className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
            />
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center space-x-1 sm:space-x-2 p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors group"
          >
            <img
              src={logoutIcon}
              alt="Log Out"
              className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 object-contain"
            />
            <span className="hidden sm:block text-xs sm:text-sm lg:text-base font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
              Logout
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParentTopBar;