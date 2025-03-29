import React, { useState, useRef } from "react";
import { JitsiMeeting } from "@jitsi/react-sdk";

const SampleKidComponent = () => {
  const [roomName, setRoomName] = useState("");
  const [joinMeeting, setJoinMeeting] = useState(false);
  const [waitingForModerator, setWaitingForModerator] = useState(false);
  const apiRef = useRef(null);

  const handleApiReady = (apiObj) => {
    console.log("Jitsi Meet API ready", apiObj);
    apiRef.current = apiObj;

    // Listen for conference events
    if (apiObj && apiObj.addEventListener) {
      // Set waiting initially - will be cleared when joined
      setWaitingForModerator(true);

      apiObj.addEventListener("videoConferenceJoined", () => {
        console.log("Joined the conference");
        setWaitingForModerator(false);
      });

      apiObj.addEventListener("participantRoleChanged", (event) => {
        console.log("Role changed", event);
      });

      apiObj.addEventListener("connectionEstablished", () => {
        console.log("Connection established");
      });

      apiObj.addEventListener("connectionFailed", () => {
        console.log("Connection failed");
        // Could add logic to handle reconnection
      });

      apiObj.addEventListener("audioMuteStatusChanged", (muted) => {
        console.log("Audio mute status changed", muted);
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
                roomName ? "bg-green-600" : "bg-gray-400"
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
              displayName: "Student",
            }}
            onApiReady={handleApiReady}
            getIFrameRef={(iframeRef) => {
              iframeRef.style.height = "700px";
              // Add proper permissions to the iframe
              iframeRef.allow =
                "camera; microphone; display-capture; autoplay; clipboard-write";
            }}
            configOverwrite={{
              startWithAudioMuted: true,
              startWithVideoMuted: false,
              disableThirdPartyRequests: true,
              prejoinPageEnabled: false,
              // Better browser compatibility settings
              resolution: 720,
              constraints: {
                video: {
                  height: {
                    ideal: 720,
                    max: 720,
                    min: 180,
                  },
                },
              },
              disableDeepLinking: true,
              useNewBrowserCheck: false,
              useStunTurn: true,
              // Improved P2P settings for better connectivity
              p2p: {
                enabled: true,
                preferH264: true,
                disableH264: false,
                useStunTurn: true,
              },
              // STUN/TURN servers to help with NAT traversal
              stunServers: [
                { urls: "stun:stun.l.google.com:19302" },
                { urls: "stun:stun1.l.google.com:19302" },
              ],
              // Setting for students
              startSilent: false,
              enableLobbyChat: true,
              // Whiteboard access for students
              whiteboard: {
                enabled: true,
                collabServerBaseUrl: "https://excalidraw-backend.jitsi.net",
              },
              // Explicitly define browser capabilities
              flags: {
                sourceNameSignaling: true,
                sendMultipleVideoStreams: true,
                receiveMultipleVideoStreams: true,
              },
            }}
            interfaceConfigOverwrite={{
              SHOW_JITSI_WATERMARK: false,
              SHOW_WATERMARK_FOR_GUESTS: false,
              DEFAULT_BACKGROUND: "#282c34",
              // Limited toolbar for students
              TOOLBAR_BUTTONS: [
                "microphone",
                "camera",
                "chat",
                "raisehand",
                "videoquality",
                "whiteboard",
              ],
              DISABLE_JOIN_LEAVE_NOTIFICATIONS: false,
              // Force low bandwidth mode options
              DISABLE_VIDEO_BACKGROUND: true,
              DISABLE_DOMINANT_SPEAKER_INDICATOR: false,
              DISABLE_FOCUS_INDICATOR: false,
              // Set low bandwidth mode initially
              enableLowBandwidth: true,
              // Add a fallback for WebRTC
              preferH264: true,
              // Improve browser compatibility
              DISABLE_RINGING: true,
              AUDIO_LEVEL_PRIMARY_COLOR: "rgba(255,255,255,0.4)",
              PROVIDER_NAME: "Classroom",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default SampleKidComponent;
