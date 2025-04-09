const crypto = require("crypto");
const axios = require("axios");

const BBB_SECRET = "InhUDw8YmwzaScfbnu14ItbUukbRNPqNQs1XAFiwk";
const BBB_URL = "https://aswinraj.online/bigbluebutton/api";
const meetingID = "class-uyj3m7lv";

// Step 1: Create string to hash
const query = `meetingID=${meetingID}`;
const stringToHash = `getRecordings${query}${BBB_SECRET}`;

// Step 2: Generate checksum
const checksum = crypto.createHash("sha1").update(stringToHash).digest("hex");

// Step 3: Call the API
const apiUrl = `${BBB_URL}/getRecordings?${query}&checksum=${checksum}`;

axios
  .get(apiUrl)
  .then((res) => {
    console.log("✅ Recordings:", res.data);
  })
  .catch((err) => {
    console.error("❌ Error fetching recordings:", err.message);
  });
