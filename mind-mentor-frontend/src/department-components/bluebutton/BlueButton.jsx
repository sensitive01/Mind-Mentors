import React from "react";
import { JitsiMeeting } from "@jitsi/react-sdk";

const VideoCall = () => {
  return (
    <div style={{ width: "100%", height: "600px" }}>
      <JitsiMeeting
        roomName="my-classroom@123"
        configOverwrite={{
          startWithAudioMuted: true,
          startWithVideoMuted: true,
          lobbyMode: false, // ✅ Disables the waiting room
          disableModeratorIndicator: true, // ✅ Prevents assigning a moderator
        }}
        userInfo={{
          displayName: "Guest User",
        }}
        getIFrameRef={(iframeRef) => {
          iframeRef.style.height = "100%";
          iframeRef.style.width = "100%";
        }}
      />
    </div>
  );
};

export default VideoCall;
