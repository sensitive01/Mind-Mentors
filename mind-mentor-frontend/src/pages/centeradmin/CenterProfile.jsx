import { Divider } from "@mui/material";
import Profile from "../../centeradmin-components/dashboard/Profile";
import Sidebar from "../../centeradmin-components/layout/Sidebar";
import Topbar from "../../component/parent-component/parent-dashboard/layout/Topbar";


const CenterProfile = () => {
  return (
    <div className="flex min-h-screen bg-white">
      <div className="fixed inset-y-0 left-0 z-50 w-64">
        <Sidebar />
      </div>
      <div className="ml-64 flex-1"> {/* Adjusted margin-left to match sidebar width */}
        <Topbar/>
\        <Profile />
      </div>
    </div>
  );
};

export default CenterProfile;




// // components/TutorSession.js
// import React, { useEffect, useRef, useState } from 'react';
// import ZegoExpressEngine from 'zego-express-engine-webrtc';

// const AppID = 1296094150; // Replace with your ZEGOCLOUD App ID
// const ServerSecret = '6ae0f42854031d2682da5d8286fac927'; // Replace with your ZEGOCLOUD Server Secret
// const UserID = `user_${Math.floor(Math.random() * 10000)}`; // Generate unique user ID
// const RoomID = 'tutorRoom'; // Example room ID for the session

// const TutorSession = () => {
//   const [isJoined, setIsJoined] = useState(false);
//   const localVideoRef = useRef(null);
//   const remoteVideoRef = useRef(null);

//   useEffect(() => {
//     const initZego = async () => {
//       // Initialize the ZegoExpressEngine
//       const zegoClient = new ZegoExpressEngine(AppID, ServerSecret);

//       // Login to the room
//       await zegoClient.loginRoom(
//         RoomID,
//         { userID: UserID, userName: UserID },
//         { userUpdate: true }
//       );

//       // Start publishing the local video stream
//       const streamID = `stream_${UserID}`;
//       const localStream = await zegoClient.createStream({
//         camera: { video: true, audio: true },
//       });
//       localVideoRef.current.srcObject = localStream;
//       localVideoRef.current.play();

//       zegoClient.startPublishingStream(streamID, localStream);

//       // Subscribe to the remote stream
//       zegoClient.on('roomStreamUpdate', async (roomID, updateType, streamList) => {
//         if (updateType === 'ADD') {
//           const remoteStream = await zegoClient.startPlayingStream(streamList[0].streamID);
//           remoteVideoRef.current.srcObject = remoteStream;
//           remoteVideoRef.current.play();
//         }
//       });

//       // Handle cleanup
//       return () => {
//         zegoClient.destroyStream(localStream);
//         zegoClient.logoutRoom(RoomID);
//         zegoClient.destroyEngine();
//       };
//     };

//     if (!isJoined) {
//       initZego();
//       setIsJoined(true);
//     }
//   }, [isJoined]);

//   return (
//     <div>
//       <h2>Coaching Session</h2>
//       <div style={{ display: 'flex', gap: '10px' }}>
//         <div>
//           <h3>Your Video</h3>
//           <video ref={localVideoRef} autoPlay muted style={{ width: '300px', border: '1px solid black' }}></video>
//         </div>
//         <div>
//           <h3>Student's Video</h3>
//           <video ref={remoteVideoRef} autoPlay style={{ width: '300px', border: '1px solid black' }}></video>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TutorSession;
