import React, { useState } from "react";
import { JitsiMeeting } from '@jitsi/react-sdk';

const SampleKidComponet = () => {
  const [roomName, setRoomName] = useState("");
  const [joinMeeting, setJoinMeeting] = useState(false);
  const [waitingForModerator, setWaitingForModerator] = useState(false);

  const handleApiReady = (apiObj) => {
    console.log("Jitsi Meet API ready", apiObj);
    
    // Listen for conference events
    if (apiObj && apiObj.addEventListener) {
      apiObj.addEventListener('videoConferenceJoined', () => {
        setWaitingForModerator(false);
      });
      
      apiObj.addEventListener('participantRoleChanged', (event) => {
        console.log("Role changed", event);
      });
    }
  };

  return (
    <div className="flex flex-col items-center p-5">
      {!joinMeeting ? (
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Join a Classroom</h2>
          <input
            type="text"
            placeholder="Enter Room Name"
            className="border p-2 rounded mb-2 w-64"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />
          <div>
            <button
              onClick={() => roomName && setJoinMeeting(true)}
              disabled={!roomName}
              className={`${
                roomName ? 'bg-green-600' : 'bg-gray-400'
              } text-white px-4 py-2 rounded mt-2`}
            >
              Join Class
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full h-screen">
          {waitingForModerator && (
            <div className="absolute z-10 top-0 left-0 right-0 bg-yellow-100 p-2 text-center">
              Waiting for the coach to start the meeting...
            </div>
          )}
          <JitsiMeeting
            domain="meet.jit.si"
            roomName={roomName}
            userInfo={{
              displayName: 'Kid'
            }}
            onApiReady={handleApiReady}
            getIFrameRef={(iframeRef) => { iframeRef.style.height = '700px'; }}
            configOverwrite={{
              startWithAudioMuted: true,
              startWithVideoMuted: false,
              disableThirdPartyRequests: true,
              prejoinPageEnabled: false,
              // Setting for students
              startSilent: false,
              enableLobbyChat: true
            }}
            interfaceConfigOverwrite={{
              SHOW_JITSI_WATERMARK: false,
              SHOW_WATERMARK_FOR_GUESTS: false,
              DEFAULT_BACKGROUND: "#282c34",
              // Limited toolbar for students
              TOOLBAR_BUTTONS: ['microphone', 'camera', 'chat', 'raisehand'],
              DISABLE_JOIN_LEAVE_NOTIFICATIONS: false
            }}
          />
        </div>
      )}
    </div>
  );
};

export default SampleKidComponet;