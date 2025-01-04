
import chessImage from "../../images/Animation - 1735989396976.gif";
const ChessLoader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white backdrop-blur-sm z-50">
      <div className="bg-white rounded-lg p-8 shadow-xl flex flex-col items-center">
        <div className="w-32 h-32 flex items-center justify-center">
          <img 
            src={chessImage} 
            alt="Loading..." 
            className="w-full h-full object-contain animate-pulse"
          />
        </div>
        <p className="mt-4 text-lg font-semibold text-green-700 animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  );
};




// import React from 'react';
// import { DotLottieReact } from '@lottiefiles/dotlottie-react';

// const App = () => {
//   return (
//     <DotLottieReact
//       src="https://lottie.host/26a0a3db-a29d-48e0-9624-e40ae3dcbb3a/ofUTVHCnwC.lottie"
//       loop
//       autoplay
//     />
//   );
// };


export default ChessLoader;