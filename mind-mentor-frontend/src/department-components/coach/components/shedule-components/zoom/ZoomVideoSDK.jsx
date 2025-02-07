// import React, { useEffect, useState } from "react";

// const ZoomMeeting = ({ meetingNumber, userName, userEmail, password }) => {
//   const [zoomSDKReady, setZoomSDKReady] = useState(false);

//   useEffect(() => {
//     const loadZoomSDK = async () => {
//       if (!window.ZoomMtg) {
//         console.log("Zoom SDK not loaded");
//         return;
//       }
//       window.ZoomMtg.preLoadWasm();
//       window.ZoomMtg.prepareJssdk();
//       setZoomSDKReady(true);
//     };

//     loadZoomSDK();
//   }, []);

//   const joinMeeting = () => {
//     if (!window.ZoomMtg) return;

//     window.ZoomMtg.init({
//       leaveUrl: "https://yourapp.com/leave",
//       success: () => {
//         window.ZoomMtg.join({
//           signature: generateSignature(meetingNumber),
//           apiKey: "YOUR_ZOOM_API_KEY", // Replace with your Zoom API Key
//           meetingNumber: meetingNumber,
//           userName: userName,
//           userEmail: userEmail,
//           passWord: password,
//           success: (res) => {
//             console.log("Successfully joined the meeting", res);
//           },
//           error: (err) => {
//             console.error("Error joining the meeting", err);
//           },
//         });
//       },
//       error: (error) => {
//         console.error("Zoom SDK initialization failed", error);
//       },
//     });
//   };

//   const generateSignature = (meetingNumber) => {
//     // You need to generate a signature using your API Key and Secret
//     // Typically done on the server side (explained below)
//     return "GENERATED_SIGNATURE"; // Replace with actual signature
//   };

//   return (
//     <div>
//       {zoomSDKReady ? (
//         <button onClick={joinMeeting}>Join Meeting</button>
//       ) : (
//         <p>Loading Zoom SDK...</p>
//       )}
//     </div>
//   );
// };

// export default ZoomMeeting;
