import { ArrowLeft, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  employeeEmailVerification,
  operationPasswordVerification,
} from "../../../api/service/employee/EmployeeService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const KidsLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [language, setLanguage] = useState("English");
  const [theme, setTheme] = useState("sky");
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const themes = {
    sky: "bg-[#642b8f]", // Sky blue
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const existEmployee = await employeeEmailVerification(email);
      if (existEmployee.status === 200) {
        setStep(2);
        toast.success("Email verified. Please enter your password.");
      } else {
        toast.error("Email not found. Please check your credentials.");
      }
    } catch (error) {
      console.error("Error verifying email:", error.response.data.message);
      toast.error(error.response.data.message);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await operationPasswordVerification(email, password);
      console.log(response);

      if (response.status === 200) {
        toast.success(response?.data?.message || "Login successful!");
        localStorage.setItem("empId", response?.data?.operationEmail?._id);
        localStorage.setItem(
          "department",
          response?.data?.operationEmail?.department
        );

        const department = response?.data?.operationEmail?.department;

        switch (department) {
          case "operation":
            navigate("/operation/department/dashboard");
            break;
          case "marketing":
            navigate("/marketing/department/dashboard");
            break;
          case "centeradmin":
            navigate("/centeradmin/department/dashboard");
            break;
          case "renewal":
            navigate("/renewal/department/dashboard");
            break;
          case "service-delivery":
            navigate("/service-delivery/department/dashboard");
            break;
          case "super-admin":
            navigate("/super-admin/department/dashboard");
            break;
          case "coach":
            navigate("/coach/department/dashboard");
            break;
          case "hr":
            navigate("/hr/department/employee-list");
            break;
          default:
            navigate("/");
        }

        setTimeout(() => {}, 1500);
      } else {
        toast.error("Invalid password. Please try again.");
      }
    } catch (error) {
      console.error("Error in operation department login:", error);
      toast.error(error.response.data.message);
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
      </div>

      <div className="lg:w-3/5 p-8 bg-white flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center mb-8">
            <h2
              className={`text-3xl font-bold mb-4`}
              style={{ color: "#642b8f" }}
            >
              Employee Login
            </h2>
          </div>

          <form className="space-y-6 w-full">
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
                  placeholder="operations@mindmentoz.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button
                  onClick={handleEmailSubmit}
                  type="button"
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
                    onClick={() => setStep(1)}
                    className={`text-gray-600 hover:text-gray-800 transition duration-300`}
                  >
                    <ArrowLeft size={20} />
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
                    onClick={handlePasswordSubmit}
                    className={`w-full ${themes[theme]} text-white py-3 px-4 rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition duration-300`}
                  >
                    LOGIN →
                  </button>
                </div>
              </div>
            )}
          </form>

          {/* <div className="mt-4 flex justify-center">
            <button
              className="flex items-center text-gray-700 hover:underline transition duration-300"
              onClick={() => console.log("Navigate to Create Account")}
            >
              Create an Account <ArrowRight size={16} className="ml-1" />
            </button>
          </div> */}
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default KidsLoginPage;
