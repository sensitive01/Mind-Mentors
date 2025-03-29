import React, { useState, useEffect, useRef } from "react";
import { JitsiMeeting } from '@jitsi/react-sdk';

const SampleTestComponent = () => {
  const [roomName, setRoomName] = useState(`classroom-${Date.now()}`);
  const [startMeeting, setStartMeeting] = useState(false);
  const apiRef = useRef(null);
  const [whiteboardActive, setWhiteboardActive] = useState(false);

  // Force browser detection override
  useEffect(() => {
    // This injects a script that overrides the browser detection
    const script = document.createElement('script');
    script.innerHTML = `
      // Override browser detection
      if (typeof navigator !== 'undefined') {
        Object.defineProperty(navigator, 'userAgent', {
          get: function() { 
            return 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'; 
          }
        });
      }
    `;
    document.head.appendChild(script);
    
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const handleApiReady = (apiObj) => {
    console.log("Jitsi Meet API ready", apiObj);
    apiRef.current = apiObj;
    
    if (apiObj && apiObj.executeCommand) {
      apiObj.executeCommand('avatarUrl', 'https://placekitten.com/100/100');
      
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
            getIFrameRef={(iframeRef) => { 
              iframeRef.style.height = '700px'; 
              iframeRef.allow = "camera; microphone; display-capture; autoplay; clipboard-write";
              
              // Try to inject a script to override browser detection inside the iframe too
              try {
                setTimeout(() => {
                  const iframeDoc = iframeRef.contentDocument || iframeRef.contentWindow.document;
                  const script = iframeDoc.createElement('script');
                  script.textContent = `
                    // Override browser detection in iframe
                    Object.defineProperty(navigator, 'userAgent', {
                      get: function() { 
                        return 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'; 
                      }
                    });
                  `;
                  iframeDoc.head.appendChild(script);
                }, 1000); // Delay to ensure iframe is loaded
              } catch (e) {
                console.log("Cannot inject into iframe due to security restrictions", e);
              }
            }}
            configOverwrite={{
              // Force disable browser check
              disableBrowserCheck: true,
              // Use an alternative meeting handler
              useBridge: true,
              analyticsScriptUrls: [],
              startWithAudioMuted: false,
              startWithVideoMuted: false,
              prejoinPageEnabled: false,
              disableThirdPartyRequests: true,
              // Set up ICE servers explicitly
              iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' }
              ],
              // Turn off features that might be causing browser detection
              capScreenshareBitrate: true,
              disableVideoSuspendByDefault: true,
              pcStatsInterval: 10000,
              // Explicitly set we're on a supported browser
              testing: {
                assumeVideoSendingIsDisabled: false,
                capScreenshareBitrate: true,
                enableEncodedTransformSupport: true
              },
              // Whiteboard config
              whiteboard: {
                enabled: true,
                collabServerBaseUrl: 'https://excalidraw-backend.jitsi.net'
              },
              // Important settings for moderator rights
              toolbarButtons: [
                'microphone', 'camera', 'desktop', 'participants-pane',
                'settings', 'raisehand', 'videoquality', 'chat', 'security',
                'whiteboard'
              ],
              moderator: true
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
              AUTO_ASSIGN_MODERATOR: true,
              DISABLE_FOCUS_INDICATOR: true,
              // Disable features that might be causing issues
              filmStripOnly: false
            }}
          />
        </div>
      )}
    </div>
  );
};

export default SampleTestComponent;