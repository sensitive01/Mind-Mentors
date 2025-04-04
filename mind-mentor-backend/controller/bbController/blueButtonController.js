const crypto = require("crypto");
const axios = require("axios");

const BBB_BASE_URL = "http://localhost:5173/bigbluebutton/api/";
const BBB_SECRET = "330a8b08c3b4c61533e1d0c334";
const MEETING_ID = "coaching-session";

// Function to generate checksum
const generateChecksum = (query) => {
    return crypto.createHash("sha1").update(query + BBB_SECRET).digest("hex");
};

// ✅ Create Meeting (Only Call This Once)
exports.createMeeting = async (req, res) => {
  try {
    const { name, role } = req.body;
    
    // These would come from your environment variables
    const BBB_SERVER = process.env.BBB_SERVER_URL;
    const BBB_SECRET = process.env.BBB_SECRET_KEY;
    const MEETING_ID = process.env.CLASSROOM_ID;
    
    // Build the join URL with proper parameters
    const params = [
      `meetingID=${MEETING_ID}`,
      `fullName=${encodeURIComponent(name)}`,
      `role=${role}`,
      'guest=true'
    ].join('&');
    
    // Create checksum (required by BBB)
    const checksum = crypto
      .createHash('sha1')
      .update(`join${params}${BBB_SECRET}`)
      .digest('hex');
    
    // Final join URL
    const joinUrl = `${BBB_SERVER}/bigbluebutton/api/join?${params}&checksum=${checksum}`;
    
    res.status(200).json({ joinUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get Join URL for Coach
exports.joinCoach = (req, res) => {
    try {
        const fullName = "Coach";
        const password = "mod123"; // Coach joins as a moderator

        const query = `join?fullName=${encodeURIComponent(fullName)}&meetingID=${MEETING_ID}&password=${password}`;
        const checksum = generateChecksum(query);

        const joinUrl = `${BBB_BASE_URL}${query}&checksum=${checksum}`;
        res.json({ joinUrl });
    } catch (error) {
        console.error("Error generating join URL:", error);
        res.status(500).json({ error: "Error generating join URL" });
    }
};

// ✅ Get Join URL for Kid
exports.joinKid = (req, res) => {
    try {
        const fullName = "Kid";
        const password = "attendee123"; // Kid joins as an attendee

        const query = `join?fullName=${encodeURIComponent(fullName)}&meetingID=${MEETING_ID}&password=${password}`;
        const checksum = generateChecksum(query);

        const joinUrl = `${BBB_BASE_URL}${query}&checksum=${checksum}`;
        res.json({ joinUrl });
    } catch (error) {
        console.error("Error generating join URL:", error);
        res.status(500).json({ error: "Error generating join URL" });
    }
};
