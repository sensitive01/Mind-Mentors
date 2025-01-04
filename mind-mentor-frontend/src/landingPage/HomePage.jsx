// import React from 'react';
// import { Users, User, Baby, Briefcase } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// const HomePage = () => {
//   const navigate = useNavigate();

//   const userTypes = [
//     {
//       title: 'Parent',
//       icon: User,
//       description: 'Join your child on their magical learning adventure! Monitor activities and celebrate every achievement together 🎉',
//       path: '/parent/login',
//       color: 'blue',
//       avatar: (
//         <div className="relative transform transition-transform hover:scale-110">
//           <div className="w-24 h-24 bg-gradient-to-br from-blue-200 to-blue-300 rounded-full flex items-center justify-center shadow-lg">
//             <svg className="w-16 h-16" viewBox="0 0 48 48" fill="none">
//               <circle cx="24" cy="16" r="10" fill="#4B5563"/>
//               <path d="M4 42C4 32 14 28 24 28C34 28 44 32 44 42" stroke="#4B5563" strokeWidth="4"/>
//               <circle cx="36" cy="12" r="6" fill="#EF4444" opacity="0.8"/>
//             </svg>
//           </div>
//           <div className="absolute -right-2 -top-1 animate-bounce">
//             <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
//               <span className="text-white text-xl">❤️</span>
//             </div>
//           </div>
//         </div>
//       )
//     },
//     {
//       title: 'Kid',
//       icon: Baby,
//       description: 'Start your exciting journey full of fun games, cool rewards, and amazing discoveries! 🚀',
//       path: '/kids/login',
//       color: 'green',
//       avatar: (
//         <div className="relative transform transition-transform hover:scale-110">
//           <div className="w-24 h-24 bg-gradient-to-br from-green-200 to-green-300 rounded-full flex items-center justify-center shadow-lg">
//             <svg className="w-16 h-16" viewBox="0 0 48 48" fill="none">
//               <circle cx="24" cy="18" r="8" fill="#4B5563"/>
//               <path d="M8 42C8 32 16 30 24 30C32 30 40 32 40 42" stroke="#4B5563" strokeWidth="4"/>
//               <circle cx="38" cy="16" r="4" fill="#FBBF24" className="animate-pulse"/>
//               <circle cx="10" cy="16" r="4" fill="#FBBF24" className="animate-pulse"/>
//             </svg>
//           </div>
//           <div className="absolute -right-2 -top-1 animate-bounce">
//             <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
//               <span className="text-white text-xl">🌟</span>
//             </div>
//           </div>
//         </div>
//       )
//     },
//     {
//       title: 'Employee',
//       icon: Briefcase,
//       description: 'Access administrative tools and manage system operations efficiently',
//       path: '/employee-login',
//       color: 'purple',
//       avatar: (
//         <div className="w-24 h-24 bg-gradient-to-br from-purple-200 to-purple-300 rounded-full flex items-center justify-center shadow-lg">
//           <Briefcase className="w-12 h-12 text-purple-600" />
//         </div>
//       )
//     }
//   ];

//   const getColorClasses = (color) => {
//     const colors = {
//       blue: {
//         bg: 'bg-gradient-to-r from-blue-500 to-blue-600',
//         hover: 'hover:from-blue-600 hover:to-blue-700',
//         light: 'bg-gradient-to-br from-blue-50 to-blue-100',
//         text: 'text-blue-600',
//         border: 'border-blue-200',
//         shadow: 'shadow-blue-200'
//       },
//       green: {
//         bg: 'bg-gradient-to-r from-green-500 to-green-600',
//         hover: 'hover:from-green-600 hover:to-green-700',
//         light: 'bg-gradient-to-br from-green-50 to-green-100',
//         text: 'text-green-600',
//         border: 'border-green-200',
//         shadow: 'shadow-green-200'
//       },
//       purple: {
//         bg: 'bg-gradient-to-r from-purple-500 to-purple-600',
//         hover: 'hover:from-purple-600 hover:to-purple-700',
//         light: 'bg-gradient-to-br from-purple-50 to-purple-100',
//         text: 'text-purple-600',
//         border: 'border-purple-200',
//         shadow: 'shadow-purple-200'
//       }
//     };
//     return colors[color];
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-blue-50 via-purple-50 to-green-50">
//       <div className="max-w-6xl mx-auto px-4 py-12">
//         {/* Header */}
//         <div className="text-center mb-16">
//           <div className="flex justify-center mb-8">
//             <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-6 rounded-full shadow-xl shadow-purple-200/50 animate-bounce">
//               <Users className="w-16 h-16 text-blue-600" />
//             </div>
//           </div>
//           <h1 className="text-6xl font-bold mb-6 animate-fade-in">
//             Welcome to{' '}
//             <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
//               KidSystem
//             </span>
//           </h1>
//           <p className="text-xl text-gray-600 font-medium">
//             Choose your adventure and let's begin! ✨
//           </p>
//         </div>

//         {/* User Type Cards */}
//         <div className="grid md:grid-cols-3 gap-8">
//           {userTypes.map((userType) => {
//             const colors = getColorClasses(userType.color);
//             return (
//               <div
//                 key={userType.title}
//                 className={`bg-white rounded-2xl shadow-xl ${colors.shadow} overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl border-2 ${colors.border}`}
//               >
//                 <div className={`${colors.light} p-8 flex justify-center items-center`}>
//                   {userType.avatar}
//                 </div>

//                 <div className="p-8">
//                   <h2 className="text-3xl font-bold text-gray-900 mb-4">
//                     {userType.title}
//                   </h2>
//                   <p className="text-lg text-gray-600 mb-8 h-24">
//                     {userType.description}
//                   </p>
//                   <button
//                     onClick={() => navigate(userType.path)}
//                     className={`w-full ${colors.bg} ${colors.hover} text-white font-semibold px-6 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-3`}
//                   >
//                     <userType.icon className="w-6 h-6" />
//                     Continue as {userType.title}
//                   </button>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HomePage;

import React from "react";
import { User, Baby, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();

  const userTypes = [
    {
      title: "Parent Login",
      icon: User,
      description:
        "Access your parent dashboard and monitor your child's progress",
      color: "from-primary/80 to-primary",
      path: "/parent/login",
      delay: "delay-0",
    },
    {
      title: "Kid Login",
      icon: Baby,
      description: "Start your learning adventure!",
      color: "from-primary/70 to-primary/90",
      path: "/kids/login",
      delay: "delay-100",
    },
    {
      title: "Employee Login",
      icon: Briefcase,
      description: "Access administrative tools and resources",
      color: "from-primary/60 to-primary/80",
      path: "/employee-login",
      delay: "delay-200",
    },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="max-w-4xl w-full space-y-8">
        {/* Header with animation */}
        <div className="text-center animate-slideDown">
          <h1 className="text-4xl font-bold text-primary mb-2 animate-pulse">
            Welcome Back!
          </h1>
          <p className="text-gray-600 animate-fadeIn delay-300">
            Choose your login type to continue
          </p>
        </div>

        {/* Login Options */}
        <div className="grid md:grid-cols-3 gap-6">
          {userTypes.map((type) => (
            <div
              key={type.title}
              onClick={() => handleNavigation(type.path)}
              className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-xl 
                transition-all duration-300 overflow-hidden cursor-pointer
                animate-slideUp ${type.delay}
                hover:scale-105 transform`}
            >
              {/* Gradient Background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${type.color} opacity-0 
                group-hover:opacity-100 transition-opacity duration-300`}
              />

              {/* Content */}
              <div
                className="relative p-6 h-full flex flex-col items-center text-center 
                group-hover:text-white transition-colors duration-300"
              >
                <div
                  className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 
                  group-hover:bg-white/10 transform group-hover:scale-110 transition-transform duration-300
                  animate-bounce"
                >
                  <type.icon
                    className="w-8 h-8 text-primary group-hover:text-white 
                    transition-colors duration-300"
                  />
                </div>

                <h3
                  className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-white
                  transform group-hover:-translate-y-1 transition-transform duration-300"
                >
                  {type.title}
                </h3>

                <p
                  className="text-gray-600 mb-6 group-hover:text-white/90
                  transform group-hover:-translate-y-1 transition-transform duration-300"
                >
                  {type.description}
                </p>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNavigation(type.path);
                  }}
                  className="mt-auto w-full py-3 px-4 bg-white text-primary font-medium rounded-xl shadow-sm 
                  group-hover:bg-primary/10 group-hover:text-white transition-all duration-300 
                  border-2 border-transparent group-hover:border-white/30
                  transform hover:scale-105 active:scale-95"
                >
                  Continue
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Optional Help Text with animation */}
        <div className="text-center text-gray-600 animate-fadeIn delay-500">
          <p className="hover:text-primary transition-colors duration-300 cursor-pointer">
            Need help? Contact support
          </p>
        </div>
      </div>
    </div>
  );
};

// Add these custom animations to your Tailwind CSS configuration
const styles = `
@layer utilities {
  .animate-fadeIn {
    animation: fadeIn 0.5s ease-in forwards;
  }
  
  .animate-slideDown {
    animation: slideDown 0.5s ease-out forwards;
  }
  
  .animate-slideUp {
    animation: slideUp 0.5s ease-out forwards;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  @keyframes slideDown {
    from {
      transform: translateY(-20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
}
`;

export default LoginPage;
