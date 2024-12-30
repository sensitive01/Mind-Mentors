import { ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const KidsLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [language, setLanguage] = useState("English");
  const [theme, setTheme] = useState("sky");
  const [step, setStep] = useState(1); // Track the current step (1: email, 2: password)
  const navigate = useNavigate();

  const themes = {
    sky: "bg-[#642b8f]", // Sky blue
  };




  const handleSubmit = (e) => {
    e.preventDefault();
    const hardcodedEmail = "coach@mindmentorz.com";
    const hardcodedPassword = "12345678";

    if (email === hardcodedEmail && password === hardcodedPassword) {
      localStorage.setItem("email", hardcodedEmail);
      navigate("/coachDashboard");
      console.log("Login successful! Navigating to the next screen...");
    } else {
      alert("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <div
        className={`${themes[theme]} text-white lg:w-2/5 p-8 flex flex-col justify-between relative`}
      >
        <div className="flex-grow flex flex-col justify-center">
          <h2 className="text-4xl font-bold leading-tight mb-4">Welcome to</h2>
          <img
            src={"https://i.ibb.co/YNTRqkj/mindmentorz.png"}
            alt="mindMentorImage"
            style={{ marginTop: "-50px" }}
          />
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
        {/* <button
          className="absolute top-1/2 -translate-y-1/2 right-0 p-2 rounded-l-full bg-white text-sky-600 hover:bg-opacity-90 transition duration-300"
          onClick={changeTheme}
        >
          <Settings size={24} />
        </button> */}
      </div>

      <div className="lg:w-3/5 p-8 bg-white flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center mb-8">
            <h2
              className={`text-3xl font-bold mb-4`}
              style={{ color: "#642b8f" }}
            >
              Coach Login
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 w-full">
            {step === 1 && (
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full max-w-lg px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="coach@mindmentorz.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setStep(2)} // Move to the password step
                  className={`mt-4 w-full ${themes[theme]} text-white py-3 px-4 rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition duration-300`}
                >
                  Next →
                </button>
              </div>
            )}

            {step === 2 && (
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setStep(1)} // Go back to the email step
                    className={`text-gray-600 hover:text-gray-800 transition duration-300`}
                  >
                    <ArrowLeft size={20} /> {/* Simple Back arrow */}
                  </button>
                </div>

                <input
                  type="password"
                  id="password"
                  className="w-full max-w-lg px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="12345678"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <div className="flex justify-between mt-4">
                  <button
                    type="submit"
                    className={`w-full ${themes[theme]} text-white py-3 px-4 rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition duration-300`}
                  >
                    LOGIN →
                  </button>
                </div>
              </div>
            )}
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
