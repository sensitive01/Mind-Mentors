const mongoose = require("mongoose");
const xlsx = require("xlsx");
const path = require("path");
const KidClassScheduleLink = require("../../model/kimsdatabase/relBtwClassSheduleKid");

const importKidClassScheduleLink = async () => {
  try {
    // 1. Connect to MongoDB
    await mongoose.connect(
      `mongodb+srv://MindMentorz:3jQhR36LMPNNznsN@cluster0.f5db1.mongodb.net/mindmentors`,
      { useNewUrlParser: true }
    );
    console.log("✅ Connected to MongoDB");

    // 2. Load Excel/CSV
    const filePath = path.join(
      __dirname,
      "../../../../kimsdata/rel#Active_Kids#Class_Schedule.csv"
    );
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const jsonData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (!jsonData.length) {
      console.log("⚠️ File is empty!");
      return;
    }

    // 3. Format Data
    const formatted = jsonData.map((row) => ({
      Class_Schedule_Record_Link_ID_BASE: row["Class_Schedule#RECORD_LINK_ID#BASE"]?.toString(),
      Kids_Record_Link_ID_REF: row["Kids#RECORD_LINK_ID#REF"]?.toString(),
    }));

    // 4. Bulk insert
    const bulkOps = formatted.map((doc) => ({
      insertOne: { document: doc },
    }));

    const result = await KidClassScheduleLink.bulkWrite(bulkOps, { ordered: false });

    console.log(`✅ Inserted: ${result.insertedCount || 0}`);
    console.log(`⚠️ Failed: ${formatted.length - (result.insertedCount || 0)}`);
  } catch (err) {
    console.error("❌ Error importing Kid vs ClassSchedule:", err);
  } finally {
    mongoose.connection.close();
    console.log("🔌 MongoDB connection closed");
  }
};

 importKidClassScheduleLink () ;
