import React, { useState, useEffect, useRef } from "react";
import { JitsiMeeting } from '@jitsi/react-sdk';

const SampleTestComponent = () => {
  const [roomName, setRoomName] = useState(`classroom-${Date.now()}`);
  const [startMeeting, setStartMeeting] = useState(false);
  const apiRef = useRef(null);
  const [whiteboardActive, setWhiteboardActive] = useState(false);

  const handleApiReady = (apiObj) => {
    console.log("Jitsi Meet API ready", apiObj);
    apiRef.current = apiObj;
    
    // Explicitly set moderator status
    if (apiObj && apiObj.executeCommand) {
      apiObj.executeCommand('avatarUrl', 'https://placekitten.com/100/100');
      
      // Add listener for whiteboard state
      apiObj.addListener('whiteboardStatusChanged', (data) => {
        setWhiteboardActive(data.isWhiteboardVisible);
      });
    }
  };

  const toggleWhiteboard = () => {
    if (apiRef.current) {
      if (whiteboardActive) {
        apiRef.current.executeCommand('closeWhiteboard');
      } else {
        apiRef.current.executeCommand('initializeWhiteboard');
      }
    }
  };

  return (
    <div className="flex flex-col items-center p-5">
      {!startMeeting ? (
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Start Your Classroom</h2>
          <button
            onClick={() => setStartMeeting(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Start Class
          </button>
          <p className="mt-2">Share this Room Name with Kids: <b>{roomName}</b></p>
        </div>
      ) : (
        <div className="w-full h-screen">
          <div className="mb-2 p-2 bg-gray-100 rounded flex items-center space-x-2">
            <button
              onClick={toggleWhiteboard}
              className={`px-3 py-1 rounded ${whiteboardActive ? 'bg-green-600 text-white' : 'bg-gray-300'}`}
            >
              {whiteboardActive ? 'Hide Whiteboard' : 'Show Whiteboard'}
            </button>
            
            {whiteboardActive && (
              <div className="text-sm text-gray-700">
                Use the drawing tools in the whiteboard panel
              </div>
            )}
          </div>
          
          <JitsiMeeting
            domain="meet.jit.si"
            roomName={roomName}
            userInfo={{
              displayName: 'Coach',
              email: 'coach@example.com'
            }}
            onApiReady={handleApiReady}
            getIFrameRef={(iframeRef) => { iframeRef.style.height = '700px'; }}
            configOverwrite={{
              startWithAudioMuted: false,
              startWithVideoMuted: false,
              prejoinPageEnabled: false,
              disableThirdPartyRequests: true,
              // Enable whiteboard feature
              whiteboard: {
                enabled: true,
                collabServerBaseUrl: 'https://excalidraw-backend.jitsi.net'
              },
              // Important settings for moderator rights
              enableClosePage: true,
              toolbarButtons: [
                'microphone', 'camera', 'desktop', 'participants-pane',
                'settings', 'raisehand', 'videoquality', 'chat', 'security',
                'whiteboard'
              ],
              // Grant host privileges to the coach
              moderator: true,
              testing: {
                enableEncodedTransformSupport: true
              }
            }}
            interfaceConfigOverwrite={{
              SHOW_JITSI_WATERMARK: false,
              SHOW_WATERMARK_FOR_GUESTS: false,
              DEFAULT_BACKGROUND: "#282c34",
              TOOLBAR_BUTTONS: [
                'microphone', 'camera', 'desktop', 'participants-pane',
                'settings', 'raisehand', 'videoquality', 'chat', 'security',
                'whiteboard'
              ],
              // Make sure coach can admit participants
              SETTINGS_SECTIONS: ['devices', 'language', 'moderator', 'profile', 'calendar'],
              // Automatically grant moderator to the Coach
              AUTO_ASSIGN_MODERATOR: true
            }}
          />
        </div>
      )}
    </div>
  );
};

export default SampleTestComponent;