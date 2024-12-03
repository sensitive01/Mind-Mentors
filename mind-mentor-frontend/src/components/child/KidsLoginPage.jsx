import { useState } from "react";
import { ArrowLeft, ChevronDown, Settings, ArrowRight } from "lucide-react";
import mindMentorImage from "../../assets/mindmentorz.png";

const KidsLoginPage = () => {
  const [chessId, setChessId] = useState("");
  const [language, setLanguage] = useState("English");
  const [theme, setTheme] = useState("sky");

  const themes = {
    sky: "bg-sky-600",
    indigo: "bg-indigo-600",
    green: "bg-green-600",
    red: "bg-red-600",
    purple: "bg-purple-600",
  };

  const textThemes = {
    sky: "text-sky-600",
    indigo: "text-indigo-600",
    green: "text-green-600",
    red: "text-red-600",
    purple: "text-purple-600",
  };

  const changeTheme = () => {
    const themeKeys = Object.keys(themes);
    const currentIndex = themeKeys.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themeKeys.length;
    setTheme(themeKeys[nextIndex]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Login submitted", { chessId });
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <div
        className={`${themes[theme]} text-white lg:w-2/5 p-8 flex flex-col justify-between relative`}
      >
        <div className="flex-grow flex flex-col justify-center">
          <h2 className="text-4xl font-bold leading-tight mb-4">Welcome to</h2>
          <img src={mindMentorImage} alt="mindMentorImage" />
        </div>
        <div className="flex justify-between items-center">
          <button className="flex items-center text-sm hover:underline transition duration-300">
            <ArrowLeft size={16} className="mr-2" /> back to site
          </button>
          <div className="relative">
            <button
              className="flex items-center text-sm focus:outline-none hover:bg-opacity-20 hover:bg-black p-2 rounded transition duration-300"
              onClick={() =>
                setLanguage(language === "English" ? "Hindi" : "English")
              }
            >
              <span className="mr-2">🇬🇧</span>
              <span>{language}</span>
              <ChevronDown size={16} className="ml-1" />
            </button>
          </div>
        </div>
        <button
          className="absolute top-1/2 -translate-y-1/2 right-0 p-2 rounded-l-full bg-white text-sky-600 hover:bg-opacity-90 transition duration-300"
          onClick={changeTheme}
        >
          <Settings size={24} />
        </button>
      </div>

      <div className="lg:w-3/5 p-8 bg-white flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center mb-8">
            <h2 className={`text-3xl font-bold ${textThemes[theme]} mb-4`}>
              Kids Login
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 w-full">
            <div>
              <label
                htmlFor="chessId"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
              Enter your kids chess kid id
              </label>
              <input
                type="text"
                id="mobile"
                className="w-full max-w-lg px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="Chess ID"
                value={chessId}
                onChange={(e) => setChessId(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className={`w-full ${themes[theme]} text-white py-3 px-4 rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition duration-300`}
            >
              LOGIN →
            </button>
          </form>

          <div className="mt-4 flex justify-center">
            <button
              className="flex items-center text-gray-700 hover:underline transition duration-300"
              onClick={() => console.log("Navigate to Create Account")}
            >
              Create an Account <ArrowRight size={16} className="ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KidsLoginPage;
