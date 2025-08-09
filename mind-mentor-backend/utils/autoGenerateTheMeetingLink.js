const cron = require("node-cron");
const axios = require("axios");
const ClassSchedule = require("../model/classSheduleModel.js");

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

cron.schedule("* * * * *", async () => {
  const now = new Date();
  const currentDay = daysOfWeek[now.getDay()];
  console.log("⏰ Cron job is running at", now.toLocaleString());
  console.log("📅 Today is:", currentDay);

  const classes = await ClassSchedule.find({
    day: currentDay,
    meetingLinkCreated: false,
  });

  for (const cls of classes) {
    const classTimeStr = cls.classTime?.split(" - ")[0]; // e.g. "4:45 PM"
    console.log("classTimeStr", classTimeStr);
    if (!classTimeStr) {
      console.log("⛔ classTime not found or invalid:", cls.classTime);
      continue;
    }

    // Build Date object for today + classTime
    const todayStr = now.toISOString().split("T")[0]; // e.g. "2025-08-06"
    const fullTimeStr = `${todayStr} ${classTimeStr}`;
    const classTime = new Date(fullTimeStr);

    if (isNaN(classTime.getTime())) {
      console.log("❌ Invalid date from classTime:", fullTimeStr);
      continue;
    }

    const diffInMin = Math.floor((classTime - now) / (1000 * 60));
    console.log(`🕒 Class at: ${classTime}, Diff: ${diffInMin} min`);

    if (diffInMin === 7) {
      try {
        const res = await axios.post(
          `http://localhost:3000/api/new-class/create-new-class-link-admin/${cls._id}`,
          {
            className: "MindMentorz Online",
            coachName: cls.coachName || "Coach",
          }
        );
        console.log("✅ Meeting link created:", res.data);
      } catch (err) {
        console.error("❌ Failed to create meeting link:", err.message);
      }
    }
  }
});
