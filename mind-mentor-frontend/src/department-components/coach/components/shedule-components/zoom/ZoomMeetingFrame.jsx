// import React, { useState, useEffect } from "react";
// import { X as CloseIcon, Maximize, Minimize } from "lucide-react";

// const ZoomMeetingFrame = ({ zoomLink, onClose }) => {
//   const [isLoading, setIsLoading] = useState(true);
//   const [isFullscreen, setIsFullscreen] = useState(false);

//   // Modify the Zoom link to force web client
//   const getModifiedZoomLink = (originalLink) => {
//     try {
//       const url = new URL(originalLink);
//       // Force Zoom web client parameters
//       url.searchParams.set("browser", "1");
//       url.searchParams.set("zc", "0");
//       url.searchParams.set("_x_zm_webview", "true");
//       return url.toString();
//     } catch (error) {
//       console.error("Error modifying zoom link:", error);
//       return originalLink;
//     }
//   };

//   useEffect(() => {
//     const handleFullscreenChange = () => {
//       setIsFullscreen(!!document.fullscreenElement);
//     };

//     document.addEventListener("fullscreenchange", handleFullscreenChange);
//     return () =>
//       document.removeEventListener("fullscreenchange", handleFullscreenChange);
//   }, []);

//   const toggleFullscreen = async () => {
//     try {
//       const frameElement = document.getElementById("zoom-frame-container");
//       if (!document.fullscreenElement) {
//         await frameElement.requestFullscreen();
//       } else {
//         await document.exitFullscreen();
//       }
//     } catch (error) {
//       console.error("Error toggling fullscreen:", error);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 bg-white flex flex-col">
//       <div className="flex justify-between items-center px-4 py-2 bg-gray-100 border-b">
//         <h2 className="text-lg font-semibold">Zoom Meeting</h2>
//         <div className="flex gap-2">
//           <button
//             onClick={toggleFullscreen}
//             className="p-2 rounded-full hover:bg-gray-200 transition-colors"
//             aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
//           >
//             {isFullscreen ? (
//               <Minimize className="w-5 h-5" />
//             ) : (
//               <Maximize className="w-5 h-5" />
//             )}
//           </button>
//           <button
//             onClick={onClose}
//             className="p-2 rounded-full hover:bg-gray-200 transition-colors"
//             aria-label="Close meeting"
//           >
//             <CloseIcon className="w-5 h-5" />
//           </button>
//         </div>
//       </div>

//       <div className="flex-1 relative" id="zoom-frame-container">
//         <iframe
//           id="zoom-meeting-frame"
//           src={getModifiedZoomLink(zoomLink)}
//           allow="camera; microphone; fullscreen; display-capture; autoplay; clipboard-write; screen-wake-lock; geolocation"
//           className="w-full h-full border-0"
//           onLoad={() => setIsLoading(false)}
//           sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation allow-top-navigation-by-user-activation"
//           title="Zoom Meeting"
//         />

//         {isLoading && (
//           <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
//             <div className="text-center">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4" />
//               <p className="text-gray-600">Loading Zoom meeting...</p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ZoomMeetingFrame;
