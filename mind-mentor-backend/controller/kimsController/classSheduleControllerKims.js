const mongoose = require("mongoose");
const xlsx = require("xlsx");
const path = require("path");
const ClassSchedule = require("../../model/kimsdatabase/classSheduleDataKims");

// ✅ Helpers
const parseNumber = (value) => {
  if (value === undefined || value === null || value === "") return null;
  const num = Number(value.toString().trim());
  return isNaN(num) ? null : num;
};

const parseDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return isNaN(date.getTime()) ? null : date;
};

// ✅ Import Function
const importClassSchedule = async () => {
  try {
    // 1. Connect to MongoDB
    await mongoose.connect(
      `mongodb+srv://MindMentorz:3jQhR36LMPNNznsN@cluster0.f5db1.mongodb.net/mindmentors`,
      { useNewUrlParser: true }
    );
    console.log("✅ Connected to MongoDB");

    // 2. Load Excel file
    const filePath = path.join(
      __dirname,
      "../../../../kimsdata/basic#Class_Schedule.csv"
    );
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const jsonData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (!jsonData.length) {
      console.log("⚠️ Class Schedule Excel file is empty");
      return;
    }

    // 3. Format rows
    const formattedData = jsonData.map((row) => ({
      Added_Time: parseDate(row.Added_Time),
      Added_User: row.Added_User || null,
      Class_End_Time: parseDate(row.Class_End_Time),
      Class_ID: row.Class_ID || null,
      Class_Level: row.Class_Level || null,
      Class_Log: row.Class_Log || null,
      Class_Over: row.Class_Over === "true" || row.Class_Over === true,
      Class_Start_Date_Time: parseDate(row.Class_Start_Date_Time),
      Class_Start_Time: row.Class_Start_Time || null,
      Class_Status_Place_Holder: row.Class_Status_Place_Holder || null,

      Coach_Logged_In:
        row.Coach_Logged_In === "true" || row.Coach_Logged_In === true,
      Coach_Login_Time: parseDate(row.Coach_Login_Time),
      Coach_Name: row.Coach_Name || null,

      Day: row.Day || null,
      Demo_Session: row.Demo_Session || null,
      Kid_Link: row.Kid_Link || null,
      Max_Class_Strength: parseNumber(row.Max_Class_Strength),
      Meeting_ID: row.Meeting_ID || null,

      Modified_Time: parseDate(row.Modified_Time),
      Modified_User: row.Modified_User || null,

      My_Class_Place_Holder: row.My_Class_Place_Holder || null,
      Number_of_Active_Kids: parseNumber(row.Number_of_Active_Kids),
      Program: row.Program || null,
      Record_Status: row.Record_Status || null,
      Time: row.Time || null,
      Today_class_status_for_temp_kids:
        row.Today_class_status_for_temp_kids || null,
      Zoom_Link: row.Zoom_Link || null,
    }));

    // 4. Insert all (duplicates allowed)
    const inserted = await ClassSchedule.insertMany(formattedData, {
      ordered: false,
    });
    console.log(`✅ Imported ${inserted.length} class schedules successfully`);
  } catch (error) {
    console.error("❌ Error importing class schedule:", error);
  } finally {
    mongoose.connection.close();
    console.log("🔌 MongoDB connection closed");
  }
};

importClassSchedule();
