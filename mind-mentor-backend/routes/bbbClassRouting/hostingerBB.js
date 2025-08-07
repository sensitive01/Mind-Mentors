const express = require("express");
const router = express.Router();
const axios = require("axios");
const Class = require("../../model/bbbClassModel/bbbClassModel");
const { buildUrl } = require("../../utils/bigblue"); // Utility function to build signed BBB URLs
const xml2js = require("xml2js");
const ClassSchedule = require("../../model/classSheduleModel");

const BASE_URL = "https://class.mindmentorz.in";
const SECRET = "J4y5nIH5D0CeI3wJPS5ODc4Pgtw2jsFGwbMlY94ah4";

// ✅ Route 1: Create a new class
router.post("/create-new-class", async (req, res) => {
  const { className, coachName } = req.body;

  if (!className || !coachName) {
    return res
      .status(400)
      .json({ error: "Class name and coach name are required" });
  }

  const classId = Math.random().toString(36).substr(2, 8);
  const meetingID = `class-${classId}`;
  const createQuery = `name=${encodeURIComponent(
    className
  )}&meetingID=${meetingID}&attendeePW=apwd&moderatorPW=mpwd&welcome=Welcome+to+${encodeURIComponent(
    className
  )}!&record=true&autoStartRecording=true&allowStartStopRecording=false`;

  const createUrl = buildUrl(BASE_URL, "create", createQuery, SECRET);
  const parsedUrl = new URL(createUrl);
  const newCheckSumData = parsedUrl.searchParams.get("checksum");
  console.log("newCheckSumData", newCheckSumData);

  try {
    const data = await axios.get(createUrl); // Create BBB meeting
    console.log("data", data);
    const result = await xml2js.parseStringPromise(data.data, {
      explicitArray: false,
    });

    console.log("result", result);
    const internalMeetingID = result.response.internalMeetingID;

    // ✅ Save class info to MongoDB
    const newClass = new Class({
      classId,
      className,
      coachName,
      meetingID,
      started: true,
      startTime: new Date(),
      internalMeetingID,
      checkSum: newCheckSumData,
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

    const joinKidUrl = `https://live.mindmentorz.in/kid/join-the-class-room/${classId}`;

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

router.post(
  "/create-new-class-link-admin/:sheduledClassId",
  async (req, res) => {
    const { sheduledClassId } = req.params;
    const { className, coachName } = req.body;

    if (!className || !coachName) {
      return res
        .status(400)
        .json({ error: "Class name and coach name are required" });
    }

    const allClasses  =await ClassSchedule.find()
    console.log("allClasses",allClasses)

    const classData = await ClassSchedule.findById(sheduledClassId);
    if (!classData) {
      return res.status(404).json({ error: "Scheduled class not found" });
    }

    const classId = Math.random().toString(36).substr(2, 8);
    const meetingID = `class-${classId}`;
    const createQuery = `name=${encodeURIComponent(
      className
    )}&meetingID=${meetingID}&attendeePW=apwd&moderatorPW=mpwd&welcome=Welcome+to+${encodeURIComponent(
      className
    )}!&record=true&autoStartRecording=true&allowStartStopRecording=false`;

    const createUrl = buildUrl(BASE_URL, "create", createQuery, SECRET);
    const parsedUrl = new URL(createUrl);
    const newCheckSumData = parsedUrl.searchParams.get("checksum");

    try {
      const data = await axios.get(createUrl);
      const result = await xml2js.parseStringPromise(data.data, {
        explicitArray: false,
      });

      const internalMeetingID = result.response.internalMeetingID;

      const newClass = new Class({
        classId,
        className,
        coachName,
        meetingID,
        started: true,
        startTime: new Date(),
        internalMeetingID,
        checkSum: newCheckSumData,
        sheduledClassId,
      });

      await newClass.save();

      // Build join URLs
      const joinCoachUrl = buildUrl(
        BASE_URL,
        "join",
        `fullName=${encodeURIComponent(
          coachName
        )}&meetingID=${meetingID}&password=mpwd&redirect=true`,
        SECRET
      );

      const joinKidUrl = `https://live.mindmentorz.in/kid/join-the-class-room/${classId}`;

      // ✅ Update or add to ClassSchedule
      classData.coachJoinUrl = joinCoachUrl;
      classData.kidJoinUrl = joinKidUrl;
      classData.meetingLinkCreated = true;
      classData.bbTempClassId = classId;
      classData.updatedAt = new Date();

      await classData.save();

      res.json({
        message: "Class created and links updated successfully",
        classId,
        joinCoachUrl,
        joinKidUrl,
        meetingLinkCreated: true,
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: "Failed to create class" });
    }
  }
);

// ✅ Route 2: Get class details by classId (used when kid joins)
router.get("/get-new-class/:classId", async (req, res) => {
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

router.post("/new-sign-join-url", async (req, res) => {
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
      const link = `https://class.mindmentorz.in/playback/presentation/2.3/${classRecord.internalMeetingID}`;
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

router.get("/get-learning-statistic-data/:meetingID", async (req, res) => {
  console.log("Welcome to get-learning-statistic-data", req.body);
  const { meetingID } = req.params;
  console.log("meetingID:", meetingID);

  // Construct the external URL
  const url = `https://class.mindmentorz.in/learning-analytics-dashboard/?meeting=${meetingID}/zsur2sxyje0d/&lang=en`;

  try {
    const response = await axios.get(url);
    console.log("Response status:", response);
    console.log("Response content-type:", response.headers["content-type"]);

    // Check if the response is HTML (which it is)
    if (response.headers["content-type"]?.includes("text/html")) {
      console.log("Received HTML content, not XML/JSON", response);

      // Option 1: Return the HTML as is
      return res.status(200).json({
        success: true,
        contentType: "html",
        data: response.data,
        message: "Received HTML content from learning analytics dashboard",
      });

      // Option 2: If you need to extract data from the HTML, you could use a library like cheerio
      // const cheerio = require('cheerio');
      // const $ = cheerio.load(response.data);
      // // Extract specific data from the HTML
      // const title = $('title').text();
      // return res.status(200).json({ title, html: response.data });
    }

    // If it's actually XML/JSON, parse accordingly
    const contentType = response.headers["content-type"];
    if (
      contentType?.includes("application/xml") ||
      contentType?.includes("text/xml")
    ) {
      // Only try to parse as XML if content-type indicates XML
      xml2js.parseString(
        response.data,
        { explicitArray: false },
        (err, result) => {
          if (err) {
            console.error("XML parsing error:", err);
            return res
              .status(500)
              .json({ error: "Failed to parse XML response" });
          }
          return res.status(200).json(result);
        }
      );
    } else if (contentType?.includes("application/json")) {
      // If it's JSON, return as is
      return res.status(200).json(response.data);
    } else {
      // For other content types, return raw data with info
      return res.status(200).json({
        success: true,
        contentType: contentType,
        data: response.data,
      });
    }
  } catch (error) {
    console.error(
      "Error in getting the learning analytics data:",
      error.message
    );
    return res.status(500).json({
      error: "Failed to get the learning analytics data",
      details: error.message,
    });
  }
});

router.get("/get-attandance-report", async (req, res) => {
  try {
    let classData = await Class.find({
      internalMeetingID: { $exists: true, $ne: null, $ne: "" },
    }).lean(); // use .lean() for plain JS objects

    console.log("classData", classData);

    // Format and sort data
    classData = classData
      .map((item) => ({
        ...item,
        formattedStartTime: new Date(item.startTime).toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      }))
      .sort((a, b) => new Date(b.startTime) - new Date(a.startTime)); // latest first

    res.status(200).json({ success: true, data: classData });
  } catch (error) {
    console.error("Error in getting the recordings:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to get the recordings" });
  }
});

module.exports = router;
