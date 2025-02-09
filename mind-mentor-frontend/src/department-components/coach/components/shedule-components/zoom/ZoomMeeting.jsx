// import React, { useEffect, useRef } from "react";
// import { ZoomVideo } from "@zoom/videosdk";

// const ZoomMeeting = ({ meetingNumber, userName, userRole, sdkKey, sdkSecret }) => {
//   const zoomRef = useRef(null);

//   useEffect(() => {
//     const initZoom = async () => {
//       const client = ZoomVideo.createClient();
      
//       await client.init("en-US", "CDN");

//       try {
//         await client.join(sdkKey, sdkSecret, meetingNumber, userName, userRole);
//         zoomRef.current = client;
//       } catch (error) {
//         console.error("Error joining Zoom meeting:", error);
//       }
//     };

//     initZoom();

//     return () => {
//       if (zoomRef.current) {
//         zoomRef.current.leave();
//       }
//     };
//   }, [meetingNumber, userName, userRole, sdkKey, sdkSecret]);

//   return (
//     <div id="zoom-meeting-container" style={{ width: "100%", height: "500px" }}>
//       <p>Loading Zoom Meeting...</p>
//     </div>
//   );
// };

// export default ZoomMeeting;
