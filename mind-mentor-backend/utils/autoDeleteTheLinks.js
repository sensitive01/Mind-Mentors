const cron = require("node-cron");
const ClassSchedule = require("../model/classSheduleModel");

console.log("✅ Class cleanup cron job loaded");

function getEndTime(classTime) {
  const [start, end] = classTime.split(" - ");
  const [endHourMin, endMeridian] = end.split(" ");
  let [hours, minutes] = endHourMin.split(":").map(Number);

  if (endMeridian === "PM" && hours !== 12) {
    hours += 12;
  } else if (endMeridian === "AM" && hours === 12) {
    hours = 0;
  }

  return { hours, minutes };
}

function getDayNameFromDate(date) {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[date.getDay()];
}

// Cron job runs every 10 minutes
cron.schedule("*/2 * * * *", async () => {
  console.log("🔄 Running class cleanup job based on day and time...");

  try {
    const allClasses = await ClassSchedule.find({
      coachJoinUrl: { $exists: true, $ne: null },
    });

    const now = new Date();
    const today = getDayNameFromDate(now);

    for (const cls of allClasses) {
      if (cls.day !== today) continue; // Only check today's classes

      const { hours, minutes } = getEndTime(cls.classTime);

      const endTime = new Date(now);
      endTime.setHours(hours, minutes, 0, 0);

      if (now >= endTime) {
        cls.coachJoinUrl = null;
        cls.kidJoinUrl = null;
        cls.meetingLinkCreated = false;

        await cls.save();
        console.log(`✅ Cleared meeting links for class ID: ${cls._id} (Day: ${cls.day})`);
      }
    }
  } catch (err) {
    console.error("❌ Error in class cleanup job:", err);
  }
});

console.log("✅ Class cleanup cron job scheduled based on weekday and time");
