const express = require("express");
const { createZoomMeeting } = require("../../utils/generateZoomSignature"); // Assuming this is your utils path

const zoomRoute = express.Router();

// const ZOOM_API_KEY = "ChkFppFRmmzbQKT6jiQlA";
// const ZOOM_API_SECRET = "A8hGnAi3u6v5LkfRT1fWCVU2Z9qQEqi3";
const ZOOM_API_KEY = "1R8cvp2KTCGJQl9zzX8gQ";
const ZOOM_API_SECRET = "vraDNr4XDr8C3itjb6q8ml5CPMMH8QXs";
const USER_ID = "aswinrajr07@gmail.com"; 

// zoomRoute.get("/zoom", async (req, res) => {
//   try {
//     const meetingData = await createZoomMeeting(); // Await the meeting creation
//     if (meetingData) {
//       res.json(meetingData); // Send back the meeting data (link and signature)
//     } else {
//       res.status(500).json({ message: "Failed to create Zoom meeting" });
//     }
//   } catch (error) {
//     console.error("Error in /zoom route:", error);
//     res.status(500).json({ message: "Error creating Zoom meeting" });
//   }
// });

zoomRoute.post("/create-meeting", async (req, res) => {
  try {
    const response = await axios.post(
      `https://api.zoom.us/v2/users/${USER_ID}/meetings`,
      {
        topic: "My Zoom Meeting",
        type: 1, // Instant Meeting
        settings: { host_video: true, participant_video: true },
      },
      {
        headers: {
          Authorization: `Bearer ${ZOOM_API_KEY}:${ZOOM_API_SECRET}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error creating Zoom meeting", error });
  }
});

module.exports = zoomRoute;
