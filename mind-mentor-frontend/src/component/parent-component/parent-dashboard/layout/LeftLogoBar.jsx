import { ArrowLeft } from "lucide-react";
import mindMentorImage from "../../../../images/mindmentorz_logo.png";
import { useNavigate } from "react-router-dom";

const LeftLogoBar = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-[#642b8f] text-white w-full lg:w-2/5 flex flex-col justify-between min-h-[40vh] md:min-h-[60vh] lg:min-h-screen px-4 py-6 sm:px-6 lg:p-8">
      <div className="flex-grow flex flex-col justify-center items-center lg:items-start text-center lg:text-left">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-4">
          Welcome to
        </h2>
        <img
          src={mindMentorImage}
          alt="Mind Mentorz Logo"
          className="w-full max-w-xs sm:max-w-sm lg:max-w-[80%] h-auto object-contain"
        />
      </div>
      <div className="flex justify-center lg:justify-start items-center w-full mt-6">
        <button
          onClick={() => navigate("/")}
          className="flex items-center text-xs sm:text-sm hover:underline transition-all duration-300 hover:opacity-80"
        >
          <ArrowLeft size={16} className="mr-1 sm:mr-2" />
          Back to site
        </button>
      </div>
    </div>
  );
};

export default LeftLogoBar;
