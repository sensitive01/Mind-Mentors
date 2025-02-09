const axios = require("axios");
const jwt = require("jsonwebtoken");

// Zoom Credentials
const ZOOM_CLIENT_ID = "1R8cvp2KTCGJQl9zzX8gQ";
const ZOOM_CLIENT_SECRET = "vraDNr4XDr8C3itjb6q8ml5CPMMH8QXs";

// Generate a signature for the Zoom Web SDK
const generateZoomSignature = (meetingNumber) => {
  const payload = {
    sdkKey: ZOOM_CLIENT_ID,
    meetingNumber: meetingNumber,
    role: 0, // 0: attendee, 1: host
    iat: new Date().getTime() - 30000,
    exp: new Date().getTime() + 5000,
  };

  const signature = jwt.sign(payload, ZOOM_CLIENT_SECRET);

  return signature;
};

// Create a Zoom meeting
const createZoomMeeting = async () => {
  try {
    const response = await axios.post(
      "https://api.zoom.us/v2/users/me/meetings",
      {
        topic: "Test Meeting",
        type: 2, // Scheduled meeting
        start_time: "2025-01-30T12:00:00Z", // Use appropriate time in ISO 8601 format
        duration: 30,
        timezone: "UTC",
        agenda: "Discuss project",
        settings: {
          host_video: true,
          participant_video: true,
          mute_upon_entry: true,
          join_before_host: true,
          audio: "voip",
          auto_recording: "none",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${ZOOM_OAUTH_ACCESS_TOKEN}`, // Correct OAuth token should go here
        },
      }
    );

    const meetingData = response.data;
    const meetingNumber = meetingData.id;
    const signature = generateZoomSignature(meetingNumber);

    return {
      meetingLink: meetingData.join_url,
      signature,
    };
  } catch (error) {
    console.error("Error creating Zoom meeting:", error);
    return null;
  }
};

module.exports = { createZoomMeeting };
