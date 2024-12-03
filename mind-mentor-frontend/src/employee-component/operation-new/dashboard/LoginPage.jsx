// import { useState } from "react";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// import {employeeEmailVerification,operationPasswordVerification} from "../api/service/employee/EmployeeService"
// const LoginPage = () => {
//   const navigate = useNavigate();

//   const [step, setStep] = useState(1);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleEmailSubmit = async (e) => {
//     e.preventDefault();
//     const existEmployee = await employeeEmailVerification(email);
//     console.log(existEmployee);
//     if (existEmployee.status === 200) {
//       setStep(2);
//     }
//   };

//   const handlePasswordSubmit = async (e) => {
//     e.preventDefault();

//     console.log("Logging in with", email, password);
//     try {
//       console.log("Welcome to opertaopn dept");
//       const response = await operationPasswordVerification(email, password);
//       console.log(response);
//       if (response.status === 200) {
//         toast.success(response?.data?.message);
//         localStorage.setItem(
//           "email",
//           response?.data?.email || "operationdept@gmail.com"
//         );
//         setTimeout(() => {
//           navigate("/employee-operation-dashboard");
//         }, 1500);
//       }
//     } catch (err) {
//       console.log("Error in opertaion dept login ", err);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50">
//       <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
//         <div className="mb-6">
//           <h1 className="text-2xl font-semibold text-center text-gray-900">
//             Sign In
//           </h1>
//         </div>

//         {/* Step 1: Email */}
//         {step === 1 && (
//           <form onSubmit={handleEmailSubmit} className="space-y-6">
//             <div>
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="operations@sensitive.co.in"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
//                 required
//               />
//             </div>

//             <button
//               type="submit"
//               className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
//             >
//               Next
//             </button>

//             <div className="text-center space-y-2">
//               <div>
//                 <a
//                   href="#"
//                   className="text-sm text-blue-600 hover:text-blue-800"
//                 >
//                   Forgot Password?
//                 </a>
//               </div>
//               <div className="text-sm text-gray-600">
//                 Dont have an account?{" "}
//                 <a href="#" className="text-blue-600 hover:text-blue-800">
//                   Sign Up
//                 </a>
//               </div>
//             </div>
//           </form>
//         )}

//         {/* Step 2: Password */}
//         {step === 2 && (
//           <form onSubmit={handlePasswordSubmit} className="space-y-6">
//             <div>
//               <input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="Enter your password"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
//                 required
//               />
//             </div>

//             <button
//               type="submit"
//               className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
//             >
//               Sign In
//             </button>

//             <div className="text-center space-y-2">
//               <div>
//                 <a
//                   href="#"
//                   className="text-sm text-blue-600 hover:text-blue-800"
//                 >
//                   Forgot Password?gvfvvvvvvvvvvvvvvvvvh
//                 </a>
//               </div>
//               <div className="text-sm text-gray-600">
//                 Dont have an account?{" "}
//                 <a href="#" className="text-blue-600 hover:text-blue-800">
//                   Sign Up
//                 </a>
//               </div>
//             </div>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// };

// export default LoginPage;


// // import { useState } from "react";
// // import { toast } from "react-toastify";
// // import { useNavigate } from "react-router-dom";
// // import {employeeEmailVerification,operationPasswordVerification} from "../api/service/employee/EmployeeService"
// // const LoginPage = () => {
// //   const navigate = useNavigate();

// //   const [step, setStep] = useState(1);
// //   const [email, setEmail] = useState("");
// //   const [password, setPassword] = useState("");

// //   const handleEmailSubmit = async (e) => {
// //     e.preventDefault();
// //     const existEmployee = await employeeEmailVerification(email);
// //     console.log(existEmployee);
// //     if (existEmployee.status === 200) {
// //       setStep(2);
// //     }
// //   };

// //   const handlePasswordSubmit = async (e) => {
// //     e.preventDefault();

// //     console.log("Logging in with", email, password);
// //     try {
// //       console.log("Welcome to opertaopn dept");
// //       const response = await operationPasswordVerification(email, password);
// //       console.log(response);
// //       if (response.status === 200) {
// //         toast.success(response?.data?.message);
// //         localStorage.setItem(
// //           "email",
// //           response?.data?.email || "operationdept@gmail.com"
// //         );
// //         setTimeout(() => {
// //           navigate("/employee-operation-dashboard");
// //         }, 1500);
// //       }
// //     } catch (err) {
// //       console.log("Error in opertaion dept login ", err);
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen flex items-center justify-center bg-gray-50">
// //       <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
// //         <div className="mb-6">
// //           <h1 className="text-2xl font-semibold text-center text-gray-900">
// //             Sign In
// //           </h1>
// //         </div>

// //         {/* Step 1: Email */}
// //         {step === 1 && (
// //           <form onSubmit={handleEmailSubmit} className="space-y-6">
// //             <div>
// //               <input
// //                 type="email"
// //                 value={email}
// //                 onChange={(e) => setEmail(e.target.value)}
// //                 placeholder="operations@sensitive.co.in"
// //                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
// //                 required
// //               />
// //             </div>

// //             <button
// //               type="submit"
// //               className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
// //             >
// //               Next
// //             </button>

// //             <div className="text-center space-y-2">
// //               <div>
// //                 <a
// //                   href="#"
// //                   className="text-sm text-blue-600 hover:text-blue-800"
// //                 >
// //                   Forgot Password?
// //                 </a>
// //               </div>
// //               <div className="text-sm text-gray-600">
// //                 Dont have an account?{" "}
// //                 <a href="#" className="text-blue-600 hover:text-blue-800">
// //                   Sign Up
// //                 </a>
// //               </div>
// //             </div>
// //           </form>
// //         )}

// //         {/* Step 2: Password */}
// //         {step === 2 && (
// //           <form onSubmit={handlePasswordSubmit} className="space-y-6">
// //             <div>
// //               <input
// //                 type="password"
// //                 value={password}
// //                 onChange={(e) => setPassword(e.target.value)}
// //                 placeholder="Enter your password"
// //                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
// //                 required
// //               />
// //             </div>

// //             <button
// //               type="submit"
// //               className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
// //             >
// //               Sign In
// //             </button>

// //             <div className="text-center space-y-2">
// //               <div>
// //                 <a
// //                   href="#"
// //                   className="text-sm text-blue-600 hover:text-blue-800"
// //                 >
// //                   Forgot Password?gvfvvvvvvvvvvvvvvvvvh
// //                 </a>
// //               </div>
// //               <div className="text-sm text-gray-600">
// //                 Dont have an account?{" "}
// //                 <a href="#" className="text-blue-600 hover:text-blue-800">
// //                   Sign Up
// //                 </a>
// //               </div>
// //             </div>
// //           </form>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default LoginPage;


// import { useState } from "react";
// import { ArrowLeft, ChevronDown, Settings, ArrowRight } from "lucide-react";

// const KidsLoginPage = () => {
//   const [chessId, setChessId] = useState("");
//   const [language, setLanguage] = useState("English");
//   const [theme, setTheme] = useState("sky");

//   const themes = {
//     sky: "bg-sky-600",
//     indigo: "bg-indigo-600",
//     green: "bg-green-600",
//     red: "bg-red-600",
//     purple: "bg-purple-600",
//   };

//   const textThemes = {
//     sky: "text-sky-600",
//     indigo: "text-indigo-600",
//     green: "text-green-600",
//     red: "text-red-600",
//     purple: "text-purple-600",
//   };

//   const changeTheme = () => {
//     const themeKeys = Object.keys(themes);
//     const currentIndex = themeKeys.indexOf(theme);
//     const nextIndex = (currentIndex + 1) % themeKeys.length;
//     setTheme(themeKeys[nextIndex]);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     console.log("Login submitted", { chessId });
//   };

//   return (
//     <div className="flex flex-col lg:flex-row min-h-screen">
//       <div
//         className={`${themes[theme]} text-white lg:w-2/5 p-8 flex flex-col justify-between relative`}
//       >
//         <div className="flex-grow flex flex-col justify-center">
//           <h2 className="text-4xl font-bold leading-tight mb-4">Welcome to</h2>
//           <img src={'https://i.ibb.co/9Hw0qVn/mindmentorz.png'} alt="mindMentorImage" />
//         </div>
//         <div className="flex justify-between items-center">
//           <button className="flex items-center text-sm hover:underline transition duration-300">
//             <ArrowLeft size={16} className="mr-2" /> back to site
//           </button>
//           <div className="relative">
//             <button
//               className="flex items-center text-sm focus:outline-none hover:bg-opacity-20 hover:bg-black p-2 rounded transition duration-300"
//               onClick={() =>
//                 setLanguage(language === "English" ? "Hindi" : "English")
//               }
//             >
//               <span className="mr-2">🇬🇧</span>
//               <span>{language}</span>
//               <ChevronDown size={16} className="ml-1" />
//             </button>
//           </div>
//         </div>
//         <button
//           className="absolute top-1/2 -translate-y-1/2 right-0 p-2 rounded-l-full bg-white text-sky-600 hover:bg-opacity-90 transition duration-300"
//           onClick={changeTheme}
//         >
//           <Settings size={24} />
//         </button>
//       </div>

//       <div className="lg:w-3/5 p-8 bg-white flex items-center justify-center">
//         <div className="w-full max-w-md">
//           <div className="flex flex-col items-center mb-8">
//             <h2 className={`text-3xl font-bold ${textThemes[theme]} mb-4`}>
//               Kids Login
//             </h2>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-6 w-full">
//             <div>
//               <label
//                 htmlFor="chessId"
//                 className="block text-sm font-medium text-gray-700 mb-1"
//               >
//               Enter your kids chess kid id
//               </label>
//               <input
//                 type="text"
//                 id="mobile"
//                 className="w-full max-w-lg px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
//                 placeholder="Chess ID"
//                 value={chessId}
//                 onChange={(e) => setChessId(e.target.value)}
//                 required
//               />
//             </div>

//             <button
//               type="submit"
//               className={`w-full ${themes[theme]} text-white py-3 px-4 rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition duration-300`}
//             >
//               LOGIN →
//             </button>
//           </form>

//           <div className="mt-4 flex justify-center">
//             <button
//               className="flex items-center text-gray-700 hover:underline transition duration-300"
//               onClick={() => console.log("Navigate to Create Account")}
//             >
//               Create an Account <ArrowRight size={16} className="ml-1" />
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default KidsLoginPage;

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
    sky: "bg-[#642b8f]",     // Sky blue
  };
  const textThemes = {
    sky: "color-[#642b8f]",     // Sky blue
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const hardcodedEmail = "operations@mindmentoz.com";
    const hardcodedPassword = "12345678";

    if (email === hardcodedEmail && password === hardcodedPassword) {
       navigate("/employee-operation-dashboard");
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
            style={{marginTop:"-50px"}}
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
            <h2 className={`text-3xl font-bold mb-4`} style={{color:'#642b8f'}}>
              Employee Login
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
                  placeholder="Enter your email"
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
      placeholder="Enter your password"
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