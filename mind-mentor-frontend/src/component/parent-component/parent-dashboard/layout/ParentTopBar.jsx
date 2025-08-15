import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, User, LogOut } from "lucide-react";
import mindmentors from "../../../../images/mindmentorz.png";
import info from "../../../../images/info_icon.png";
import account from "../../../../images/boy.png";

const ParentTopBar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleProfileClick = () => {
    navigate("/parent/profile/manage");
    setIsDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="relative group flex items-center justify-center p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-full overflow-hidden transform transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:shadow-lg group-hover:ring-2 group-hover:ring-[#642b8f]">
                <img
                  src={account}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full absolute bottom-0 right-0 border-2 border-white"></div>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-1">
                <button
                  onClick={handleProfileClick}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <User size={16} className="mr-3 text-gray-500" />
                  Profile
                </button>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsDropdownOpen(false);
                  }}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <LogOut size={16} className="mr-3 text-gray-500" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentTopBar;
