import React, { useState, useEffect } from "react";
import { JitsiMeeting } from "@jitsi/react-sdk";

const JitsiClassroom = () => {
  const [meetingStarted, setMeetingStarted] = useState(false);
  const [roomName, setRoomName] = useState(`classroom-${Date.now()}`);
  const [displayName, setDisplayName] = useState("Teacher");
  const [jitsiConfigured, setJitsiConfigured] = useState(false);

  // Override browser detection BEFORE Jitsi loads
  useEffect(() => {
    // More aggressive approach to override browser detection
    const overrideBrowserDetection = () => {
      // 1. Override navigator.userAgent
      const originalUserAgent = navigator.userAgent;
      Object.defineProperty(navigator, "userAgent", {
        get: function () {
          return "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
        },
        configurable: true,
      });

      // 2. Override additional browser detection methods
      if (!navigator.mediaDevices) {
        navigator.mediaDevices = {};
      }

      // 3. Override appVersion
      const originalAppVersion = navigator.appVersion;
      Object.defineProperty(navigator, "appVersion", {
        get: function () {
          return "5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
        },
        configurable: true,
      });

      // 4. Override vendor
      const originalVendor = navigator.vendor;
      Object.defineProperty(navigator, "vendor", {
        get: function () {
          return "Google Inc.";
        },
        configurable: true,
      });

      // 5. Override platform
      const originalPlatform = navigator.platform;
      Object.defineProperty(navigator, "platform", {
        get: function () {
          return "Win32";
        },
        configurable: true,
      });

      console.log("Browser detection overridden");
      setJitsiConfigured(true);

      // Return cleanup function
      return () => {
        // Restore original values when component unmounts
        Object.defineProperty(navigator, "userAgent", {
          get: function () {
            return originalUserAgent;
          },
          configurable: true,
        });
        Object.defineProperty(navigator, "appVersion", {
          get: function () {
            return originalAppVersion;
          },
          configurable: true,
        });
        Object.defineProperty(navigator, "vendor", {
          get: function () {
            return originalVendor;
          },
          configurable: true,
        });
        Object.defineProperty(navigator, "platform", {
          get: function () {
            return originalPlatform;
          },
          configurable: true,
        });
      };
    };

    // Execute the override
    const cleanup = overrideBrowserDetection();

    // Add global script to override browser detection in iframes too
    const script = document.createElement("script");
    script.innerHTML = `
      // Global override of browser detection
      (function() {
        const originalUserAgent = navigator.userAgent;
        Object.defineProperty(navigator, 'userAgent', {
          get: function() { 
            return 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'; 
          },
          configurable: true
        });
        
        // Override appVersion
        Object.defineProperty(navigator, 'appVersion', {
          get: function() {
            return '5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
          },
          configurable: true
        });
        
        // Override vendor
        Object.defineProperty(navigator, 'vendor', {
          get: function() {
            return 'Google Inc.';
          },
          configurable: true
        });
        
        // Fake Chrome version
        if (!window.chrome) window.chrome = {};
        window.chrome.runtime = { id: 'fake' };
      })();
    `;
    document.head.appendChild(script);

    return () => {
      cleanup();
      document.head.removeChild(script);
    };
  }, []);

  const startMeeting = () => {
    setMeetingStarted(true);
  };

  return (
    <div className="flex flex-col items-center p-4">
      {!meetingStarted ? (
        <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-4 text-center">
            Start Your Classroom
          </h1>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Your Name:</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter your name"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Room Name:</label>
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter room name"
            />
          </div>

          <button
            onClick={startMeeting}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            disabled={!jitsiConfigured}
          >
            {jitsiConfigured ? "Start Classroom" : "Configuring..."}
          </button>

          {!jitsiConfigured && (
            <p className="text-sm text-yellow-600 mt-2">
              Preparing browser compatibility...
            </p>
          )}
        </div>
      ) : (
        <div className="w-full h-screen">
          <JitsiMeeting
            domain="meet.jit.si"
            roomName={roomName}
            userInfo={{
              displayName: displayName,
            }}
            configOverwrite={{
              // Completely disable browser check
              disableBrowserCheck: true,
              // Skip prejoin page
              prejoinPageEnabled: false,
              // Disable welcome page
              enableWelcomePage: false,
              // Start as host
              startWithAudioMuted: false,
              startWithVideoMuted: false,
              startAsModerator: true,
              // Disable notifications
              notifications: [],
              // Disable third-party requests
              disableThirdPartyRequests: true,
              // Force disable Jitsi watermark
              brandingRoomAlias: false,
              // Set resolution
              resolution: 720,
              // Configure ICE servers
              p2p: {
                enabled: true,
                preferH264: true,
                disableH264: false,
                useStunTurn: true,
              },
              // CRITICAL: This forces specific transport protocols
              websocket: false,
              testing: {
                p2pTestMode: false,
                testMode: false,
                noAutoPlayVideo: false,
                forceJVB121Ratio: -1,
              },
              // Force disable specific feature flags
              flags: {
                sourceNameSignaling: false,
                sendMultipleVideoStreams: false,
                receiveMultipleVideoStreams: false,
              },
              // Disable analytics
              analytics: {
                disabled: true,
                rtcstatsEnabled: false,
              },
              // Required for whiteboard and annotations
              whiteboard: {
                enabled: true,
              },
              // Toolbar customization
              toolbarButtons: [
                "microphone",
                "camera",
                "desktop",
                "participants-pane",
                "settings",
                "chat",
                "whiteboard",
                "security",
              ],
            }}
            interfaceConfigOverwrite={{
              DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
              SHOW_JITSI_WATERMARK: false,
              HIDE_INVITE_MORE_HEADER: true,
              MOBILE_APP_PROMO: false,
              SHOW_CHROME_EXTENSION_BANNER: false,
              TOOLBAR_ALWAYS_VISIBLE: true,
              // Force full support flag
              SHOW_UNSUPPORTED_BROWSER_PAGE: false,
              SHOW_BRAND_WATERMARK: false,
              SHOW_POWERED_BY: false,
              SHOW_PROMOTIONAL_CLOSE_PAGE: false,
              GENERATE_ROOMNAMES_ON_WELCOME_PAGE: false,
              APP_NAME: "Classroom",
              NATIVE_APP_NAME: "Classroom",
              PROVIDER_NAME: "Classroom",
            }}
            getIFrameRef={(iframeRef) => {
              iframeRef.style.height = "100%";
              iframeRef.style.width = "100%";
              iframeRef.allow =
                "camera; microphone; display-capture; autoplay; clipboard-write";

              // Try to inject script into iframe once loaded
              iframeRef.onload = () => {
                try {
                  const frameWindow = iframeRef.contentWindow;

                  // Inject script directly into iframe (may not work due to security policies)
                  const scriptTag = document.createElement("script");
                  scriptTag.text = `
                    // Override browser detection in the iframe
                    Object.defineProperty(navigator, 'userAgent', {
                      get: function() { 
                        return 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'; 
                      }
                    });
                    
                    // Override browser features detection
                    if (typeof JitsiMeetJS !== 'undefined') {
                      JitsiMeetJS.util.browser._detect = function() {
                        return {
                          name: 'chrome',
                          version: '120.0.0.0',
                          isChrome: true,
                          isElectron: false,
                          isFirefox: false,
                          isNWJS: false,
                          isSafari: false,
                          isWebKitBased: true,
                          supportsVideoQualityIndicator: true
                        };
                      };
                    }
                    
                    console.log("Iframe browser detection overridden");
                  `;

                  // Try using different methods to inject the script
                  try {
                    frameWindow.eval(scriptTag.text);
                  } catch (e) {
                    console.log("Failed direct eval:", e);
                  }
                } catch (e) {
                  console.log("Failed to access iframe:", e);
                }
              };
            }}
          />
        </div>
      )}
    </div>
  );
};

export default JitsiClassroom;
