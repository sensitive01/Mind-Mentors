import React, { useEffect } from "react";
import { ZoomMtg } from "@zoomus/websdk";

// Your Zoom Credentials (Get from Zoom Developer Dashboard)
const API_KEY = "ChkFppFRmmzbQKT6jiQlA";
const API_SECRET = "A8hGnAi3u6v5LkfRT1fWCVU2Z9qQEqi3";

const ZoomMeeting = ({ meetingNumber, password, userName = "Participant" }) => {
  useEffect(() => {
    ZoomMtg.setZoomJSLib("https://source.zoom.us/2.13.0/lib", "/av");
    ZoomMtg.preLoadWasm();
    ZoomMtg.prepareJssdk();

    ZoomMtg.init({
      leaveUrl: "http://localhost:3000", // Redirect after meeting ends
      success: () => {
        ZoomMtg.join({
          signature: generateSignature(meetingNumber),
          apiKey: API_KEY,
          meetingNumber: meetingNumber,
          userName: userName,
          password: password,
          success: () => console.log("Joined meeting successfully"),
          error: (err) => console.error("Error joining meeting", err),
        });
      },
      error: (err) => console.error("Zoom Init Error", err),
    });
  }, [meetingNumber, password, userName]);

  return <div id="zoomMeetingContainer"></div>;
};

// ✅ Function to Generate Signature (Normally done in the backend)
const generateSignature = (meetingNumber) => {
  const crypto = require("crypto");
  const timestamp = new Date().getTime() - 30000;
  const msg = Buffer.from(API_KEY + meetingNumber + timestamp + 0).toString("base64");
  const hash = crypto.createHmac("sha256", API_SECRET).update(msg).digest("base64");
  return `${API_KEY}.${meetingNumber}.${timestamp}.0.${hash}`;
};

export default ZoomMeeting;
