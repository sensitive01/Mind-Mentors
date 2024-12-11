import React from "react";

const MeetingRoom = ({ joinUrl }) => {
  return (
    <div>
      <h1>Join Meeting</h1>
      {joinUrl ? (
        <iframe
          src={joinUrl}
          title="Zoho Meeting Room"
          width="100%"
          height="600"
          allow="camera; microphone; fullscreen"
        ></iframe>
      ) : (
        <p>No meeting URL provided. Please schedule a meeting first.</p>
      )}
    </div>
  );
};

export default MeetingRoom;
