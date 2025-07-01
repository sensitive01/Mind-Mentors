import { useNavigate } from "react-router-dom";
import mindmentors from "../../../../images/mindmentorz.png";
import info from "../../../../images/info_icon.png";
import logoout from "../../../../images/logout icon.png";

const ParentTopBar = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white shadow-lg">
      <div className="flex justify-between items-center px-5 py-2">
        <div className="flex items-center">
          <img
            src={mindmentors}
            alt="MindMentorz Logo"
            className="w-[200px] h-[50px] object-contain mr-5"
          />
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
            <img
              src={info}
              alt="User Profile"
              className="w-11 h-11 object-cover rounded-full"
            />
          </button>

          <button
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            onClick={() => {
              localStorage.clear(); 
              navigate("/");
            }}
            
          >
            <img
              src={logoout}
              alt="Log Out"
              className="w-11 h-11 object-cover rounded-full"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParentTopBar;
