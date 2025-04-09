const express = require("express");
const router = express.Router();
const { buildUrl } = require("../../utils/bigblue");
const axios = require("axios");

const BASE_URL = "https://bbb.mindmentorz.in";
const SECRET = "UEjv0E4538Y4nXT5Aj5WyaZ0cj3tZzuAxh2y8H7K4E";

// Fixed meeting ID for now, you can generate dynamic ones if needed
const meetingID = "findmyhome-support";

// Start meeting and return moderator join link
router.get("/start", async (req, res) => {
  const createQuery = `name=Support+Room&meetingID=${meetingID}&attendeePW=apwd&moderatorPW=mpwd&welcome=Welcome+to+FindMyHome!`;

  const createUrl = buildUrl(BASE_URL, "create", createQuery, SECRET);
  console.log("createUrl:", createUrl);

  try {
    // Create the meeting
    await axios.get(createUrl);

    // Generate moderator join URL
    const joinModQuery = `fullName=Admin&meetingID=${meetingID}&password=mpwd&redirect=true`;
    const joinModUrl = buildUrl(BASE_URL, "join", joinModQuery, SECRET);
    console.log("joinModUrl:", joinModUrl);

    res.json({ joinModUrl });
  } catch (err) {
    console.error("Error creating meeting:", err.message);
    res.status(500).send("Failed to create meeting");
  }
});

// Join meeting as attendee (user)
router.get("/join", (req, res) => {
  const fullName = req.query.name || "User";
  const joinUserQuery = `fullName=${fullName}&meetingID=${meetingID}&password=apwd&redirect=true`;
  const joinUserUrl = buildUrl(BASE_URL, "join", joinUserQuery, SECRET);
  console.log("joinUserUrl:", joinUserUrl);

  res.redirect(joinUserUrl);
});

module.exports = router;
