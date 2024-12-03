// import { useNavigate } from "react-router-dom";
// // import mindmentors from "../../../images/mindmentorz";
// // import info from "../../../../images/info_icon.png"; 
// // import logoout from "../../../../images/logout icon.png"

// const Topbar = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="flex flex-col w-full">
//       <div className="flex justify-between items-center px-5 py-2 bg-white">
//         <div className="flex items-center">
//           <img 
//             src={'https://mind-mentors.vercel.app/assets/mindmentorz-Ch2CsWeh.png'}
//             alt="MindMentorz Logo" 
//             className="w-[200px] h-[50px] object-contain mr-5"
//           />
//         </div>

//         <div className="flex items-center space-x-4">
       
//           <button className="p-2 hover:bg-white rounded-full transition-colors duration-200">
//             <img 
//               src={'https://mind-mentors.vercel.app/assets/info_icon-DRHRNADU.png'} 
//               alt="User Profile"
//               className="w-11 h-11 object-cover rounded-full"
//             />
//           </button>

//           <button 
//             className="p-2 hover:bg-white rounded-full transition-colors duration-200"
//             onClick={() => navigate("/")}
//           >
//             <img 
//               src={'https://mind-mentors.vercel.app/assets/logout%20icon-BHuLKzGJ.png'} 
//               alt="Log Out" 
//               className="w-11 h-11 object-cover rounded-full"
//             />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Topbar;
import React from 'react';
import { useNavigate } from "react-router-dom";

const Topbar = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-between items-center px-5 py-3 bg-white 
        shadow-md  // Changed from custom shadow to Tailwind's built-in shadow
        border-b border-gray-100 
        transition-all duration-300 
        hover:shadow-lg  // Use Tailwind's hover shadow variant"
      >
        <div className="flex items-center">
          <img 
            src={'https://mind-mentors.vercel.app/assets/mindmentorz-Ch2CsWeh.png'}
            alt="MindMentorz Logo" 
            className="w-[200px] h-[50px] object-contain mr-5 
              transition-transform duration-300 
              hover:scale-105"
          />
        </div>

        <div className="flex items-center space-x-4">
          {/* Info Button */}
          <button 
            className="p-2 
            hover:bg-purple-50 
            rounded-full 
            transition-all 
            duration-300 
            group 
            relative"
          >
            <img 
              src={'https://mind-mentors.vercel.app/assets/info_icon-DRHRNADU.png'} 
              alt="User Profile"
              className="w-11 h-11 object-cover rounded-full 
                shadow-md  // Tailwind's standard shadow
                group-hover:shadow-lg  // Enhanced shadow on hover
                transition-shadow 
                duration-300"
            />
            <span className="absolute 
              -top-2 
              -right-2 
              bg-purple-500 
              text-white 
              rounded-full 
              px-2 
              py-1 
              text-xs 
              opacity-0 
              group-hover:opacity-100 
              transition-opacity 
              duration-300">
              Info
            </span>
          </button>

          {/* Logout Button */}
          <button 
            className="p-2 
            hover:bg-red-50 
            rounded-full 
            transition-all 
            duration-300 
            group 
            relative"
            onClick={() => navigate("/")}
          >
            <img 
              src={'https://mind-mentors.vercel.app/assets/logout%20icon-BHuLKzGJ.png'} 
              alt="Log Out" 
              className="w-11 h-11 object-cover rounded-full 
                shadow-md  // Tailwind's standard shadow
                group-hover:shadow-lg  // Enhanced shadow on hover
                transition-shadow 
                duration-300"
            />
            <span className="absolute 
              -top-2 
              -right-2 
              bg-red-500 
              text-white 
              rounded-full 
              px-2 
              py-1 
              text-xs 
              opacity-0 
              group-hover:opacity-100 
              transition-opacity 
              duration-300">
              Logout
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Topbar;