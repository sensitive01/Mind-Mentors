import  { useState, useRef } from 'react';
import { ArrowLeft, ChevronDown, Settings } from 'lucide-react';
import mindMentorImage from "../../assets/mindmentorz.png";

const KidsOtpPage = () => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [language, setLanguage] = useState("English");
  const [theme, setTheme] = useState("purple");

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

  const otpRefs = useRef([]);
  const handleOtpChange = (index, value) => {
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value && index < otp.length - 1) {
      otpRefs.current[index + 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("OTP submitted:", otp.join(''));
   
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <div
        className={`${themes[theme]} text-white lg:w-2/5 p-8 flex flex-col justify-between relative`}
      >
        <div className="flex-grow flex flex-col justify-center">
          <h2 className="text-4xl font-bold leading-tight mb-4">Welcome to</h2>
          <img src={mindMentorImage} alt="mindMentorImage" className="w-full" />
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
            <p className="text-sm text-gray-600">Please enter the OTP sent to your mobile number.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 w-full">
           
            <div className="flex justify-start mb-2">
              <label className="text-sm font-medium text-gray-700">Enter OTP</label>
            </div>

        
            <div className="flex justify-between space-x-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  ref={(el) => otpRefs.current[index] = el}
                  className="w-14 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  required
                />
              ))}
            </div>

            <button
              type="submit"
              className={`w-full ${themes[theme]} text-white py-3 px-4 rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition duration-300`}
            >
              LOGIN →
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default KidsOtpPage;
