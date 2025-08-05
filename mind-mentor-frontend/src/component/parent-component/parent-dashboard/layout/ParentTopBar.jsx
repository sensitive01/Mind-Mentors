import { useNavigate } from "react-router-dom";
import mindmentors from "../../../../images/mindmentorz.png";
import info from "../../../../images/info_icon.png";
import logoutIcon from "../../../../images/logout icon.png";

const ParentTopBar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="bg-white shadow-lg">
      <div className="flex justify-between items-center px-3 sm:px-5 py-2">
        {/* Left: Logo */}
        <div className="flex items-center">
          <img
            src={mindmentors}
            alt="MindMentorz Logo"
            className="w-[120px] sm:w-[150px] md:w-[200px] h-[30px] sm:h-[40px] md:h-[50px] object-contain mr-2 sm:mr-5"
          />
        </div>

        {/* Right: Icons */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center space-x-1 sm:space-x-2 p-1 sm:p-2 hover:bg-gray-100 rounded-md transition duration-200"
          >
            <img
              src={logoutIcon}
              alt="Log Out"
              className="w-6 h-6 sm:w-8 sm:h-8 object-cover"
            />
            <span className="hidden sm:block text-sm font-medium text-gray-700">
              Logout
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParentTopBar;
