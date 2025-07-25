const express = require("express");
const router = express.Router();
const axios = require("axios");
const Class = require("../../model/bbbClassModel/bbbClassModel");
const { buildUrl } = require("../../utils/bigblue"); // Utility function to build signed BBB URLs

const BASE_URL = "http://aswinraj.online";
const SECRET = "InhUDw8YmwzaScfbnu14ItbUukbRNPqNQs1XAFiwk";
// ✅ Route 1: Create a new class
router.post("/create-class", async (req, res) => {
  const { className, coachName } = req.body;

  if (!className || !coachName) {
    return res
      .status(400)
      .json({ error: "Class name and coach name are required" });
  }

  const classId = Math.random().toString(36).substr(2, 8);
  const meetingID = `class-${classId}`;

  // const createQuery = `name=${encodeURIComponent(
  //   className
  // )}&meetingID=${meetingID}&attendeePW=apwd&moderatorPW=mpwd&welcome=Welcome+to+${encodeURIComponent(
  //   className
  // )}!`;

  const createQuery = `name=${encodeURIComponent(
  className
)}&meetingID=${meetingID}&attendeePW=apwd&moderatorPW=mpwd&welcome=Welcome+to+${encodeURIComponent(
  className
)}!&record=true&autoStartRecording=true&allowStartStopRecording=false`;

  const createUrl = buildUrl(BASE_URL, "create", createQuery, SECRET);

  try {
    await axios.get(createUrl); // Create BBB meeting

    // ✅ Save class info to MongoDB
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
      `fullName=${encodeURIComponent(
        coachName
      )}&meetingID=${meetingID}&password=mpwd&redirect=true`,
      SECRET
    );

    const joinKidUrl = `https://live.mindmentorz.in/kid/join-class-room/${classId}`;

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

// ✅ Route 2: Get class details by classId (used when kid joins)
router.get("/get-class/:classId", async (req, res) => {
  const { classId } = req.params;

  try {
    const classData = await Class.findOne({ classId });

    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }

    res.status(200).json({
      meetingID: classData.meetingID,
      started: classData.started,
      className: classData.className,
      coachName: classData.coachName,
    });
  } catch (error) {
    console.error("Error fetching class details:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/sign-join-url", async (req, res) => {
  const { fullName, meetingID, password } = req.body;

  if (!fullName || !meetingID || !password) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  try {
    // Build the properly signed URL using the buildUrl utility
    const joinQuery = `fullName=${encodeURIComponent(
      fullName
    )}&meetingID=${meetingID}&password=${password}&redirect=true`;
    const signedUrl = buildUrl(BASE_URL, "join", joinQuery, SECRET);

    res.json({ signedUrl });
  } catch (error) {
    console.error("Error signing URL:", error);
    res.status(500).json({ error: "Failed to sign join URL" });
  }
});

router.get("/get-recordings-link/:meetingID", async (req, res) => {
  const { meetingID } = req.params;
  console.log("Requested meetingID:", meetingID);

  if (!meetingID) {
    return res
      .status(400)
      .json({ error: "meetingID query parameter is required" });
  }

  try {
    const classRecord = await Class.findOne(
      { meetingID },
      { internalMeetingID: 1 }
    );

    if (classRecord && classRecord.internalMeetingID) {
      const link = `https://aswinraj.online/playback/presentation/2.3/${classRecord.internalMeetingID}`;
      return res.status(200).json({ links: link });
    } else {
      return res
        .status(404)
        .json({ message: "No recording found for the given meetingID" });
    }
  } catch (error) {
    console.error("Error in getting the recordings:", error);
    res.status(500).json({ error: "Failed to get the recordings" });
  }
});

module.exports = router;
