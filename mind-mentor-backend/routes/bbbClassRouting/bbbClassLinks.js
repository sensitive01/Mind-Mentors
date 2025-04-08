const express = require("express");
const router = express.Router();
const axios = require("axios");
const Class = require("../../model/bbbClassModel/bbbClassModel");
const { buildUrl } = require("../../utils/bigblue"); // Assuming this exists

const BASE_URL = "https://aswinraj.online";
const SECRET = "UEjv0E4538Y4nXT5Aj5WyaZ0cj3tZzuAxh2y8H7K4E";

// Create a new class and return links
router.post("/create-class", async (req, res) => {
  const { className, coachName } = req.body;

  if (!className || !coachName) {
    return res.status(400).json({ error: "Class name and coach name required" });
  }

  const classId = Math.random().toString(36).substr(2, 8); // Simple unique ID
  const meetingID = `class-${classId}`;

  const createQuery = `name=${encodeURIComponent(className)}&meetingID=${meetingID}&attendeePW=apwd&moderatorPW=mpwd&welcome=Welcome+to+${encodeURIComponent(className)}!`;
  const createUrl = buildUrl(BASE_URL, "create", createQuery, SECRET);

  try {
    await axios.get(createUrl);

    const newClass = new Class({
      classId,
      className,
      coachName,
      meetingID,
      started: true,
      startTime: new Date(),
    });

    await newClass.save();

    const joinCoachUrl = buildUrl(
      BASE_URL,
      "join",
      `fullName=${encodeURIComponent(coachName)}&meetingID=${meetingID}&password=mpwd&redirect=true`,
      SECRET
    );

    const joinKidUrl = buildUrl(
      BASE_URL,
      "join",
      `fullName=Kid&meetingID=${meetingID}&password=apwd&redirect=true`,
      SECRET
    );

    res.json({
      message: "Class created successfully",
      classId,
      joinCoachUrl,
      joinKidUrl,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to create class" });
  }
});

module.exports = router;
