
const express = require("express");
const router = express.Router();
const { buildUrl } = require("../../utils/bigblue");
const axios = require("axios");

const BASE_URL = "https://bbb.mindmentorz.in";
const SECRET = "UEjv0E4538Y4nXT5Aj5WyaZ0cj3tZzuAxh2y8H7K4E";

// Store active meetings (in-memory, use database in production)
const activeClasses = {};

// Start meeting with a specific class ID
router.post("/start", async (req, res) => {
  const { classId, className, coachName } = req.body;
  
  if (!classId || !className || !coachName) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  const meetingID = `class-${classId}`;
  const createQuery = `name=${encodeURIComponent(className)}&meetingID=${meetingID}&attendeePW=apwd&moderatorPW=mpwd&welcome=Welcome+to+${encodeURIComponent(className)}!`;

  const createUrl = buildUrl(BASE_URL, "create", createQuery, SECRET);
  console.log("createUrl:", createUrl);

  try {
    // Create the meeting
    await axios.get(createUrl);

    // Generate moderator join URL
    const joinModQuery = `fullName=${encodeURIComponent(coachName)}&meetingID=${meetingID}&password=mpwd&redirect=true`;
    const joinModUrl = buildUrl(BASE_URL, "join", joinModQuery, SECRET);
    
    // Store active class information
    activeClasses[classId] = {
      meetingID,
      className,
      coachName,
      startTime: new Date()
    };

    console.log("joinModUrl:", joinModUrl);
    res.json({ joinModUrl, classId });
  } catch (err) {
    console.error("Error creating meeting:", err.message);
    res.status(500).send("Failed to create meeting");
  }
});

// Join meeting as attendee (kid)
router.get("/join", (req, res) => {
  const { name, classId } = req.query;
  
  if (!name || !classId) {
    return res.status(400).send("Missing name or class ID");
  }
  
  // Check if the class exists
  if (!activeClasses[classId]) {
    return res.status(404).send("This class is not currently active");
  }

  const meetingID = `class-${classId}`;
  const joinUserQuery = `fullName=${encodeURIComponent(name)}&meetingID=${meetingID}&password=apwd&redirect=true`;
  const joinUserUrl = buildUrl(BASE_URL, "join", joinUserQuery, SECRET);
  
  console.log("joinUserUrl:", joinUserUrl);
  res.redirect(joinUserUrl);
});

// Get all active classes
router.get("/active-classes", (req, res) => {
  res.json({ classes: activeClasses });
});

module.exports = router;