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
      <div className="flex justify-between items-center px-5 py-2">
        {/* Left: Logo */}
        <div className="flex items-center">
          <img
            src={mindmentors}
            alt="MindMentorz Logo"
            className="w-[200px] h-[50px] object-contain mr-5"
          />
        </div>

        {/* Right: Icons */}
        <div className="flex items-center space-x-4">
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-md transition duration-200"
          >
            <img
              src={logoutIcon}
              alt="Log Out"
              className="w-8 h-8 object-cover"
            />
            <span className="text-sm font-medium text-gray-700">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParentTopBar;
