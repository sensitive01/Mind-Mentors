const mongoose = require("mongoose");
const xlsx = require("xlsx");
const path = require("path");
const EnrollmentKims = require("../../model/kimsdatabase/kimsEnrollmentModel");

// ✅ Helper: parse epoch ms → Date
const parseDate = (val) => {
  if (!val) return null;
  const num = Number(val);
  if (!isNaN(num)) {
    const d = new Date(num);
    return isNaN(d.getTime()) ? null : d;
  }
  const d = new Date(val);
  return isNaN(d.getTime()) ? null : d;
};

// ✅ Helper: safe number
const parseNumber = (val) => {
  if (val === undefined || val === null || val === "") return null;
  const n = Number(val);
  return isNaN(n) ? null : n;
};

const importEnrollmentKims = async () => {
  try {
    // 1. Connect to DB
    await mongoose.connect(
      `mongodb+srv://MindMentorz:3jQhR36LMPNNznsN@cluster0.f5db1.mongodb.net/mindmentors`,
      { useNewUrlParser: true }
    );
    console.log("✅ Connected to MongoDB");

    // 2. Load Excel/CSV file
    const filePath = path.join(
      __dirname,
      "../../../../kimsdata/basic#Enrollment.csv"
    );
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const jsonData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (!jsonData.length) {
      console.log("⚠️ Enrollment file is empty");
      return;
    }

    // 3. Format Data
    const formatted = jsonData.map((row) => ({
      Added_Time: parseDate(row.Added_Time),
      Added_User: row.Added_User || null,
      Auto_Number: parseNumber(row.Auto_Number),
      ID: row.ID?.toString(),
      Level: row.Level || null,
      Modified_Time: parseDate(row.Modified_Time),
      Modified_User: row.Modified_User || null,
      Record_Status: parseNumber(row.Record_Status),
    }));

    // 4. Insert into DB
    const result = await EnrollmentKims.insertMany(formatted, {
      ordered: false,
    });
    console.log(`✅ Inserted ${result.length} enrollment records`);
  } catch (err) {
    console.error("❌ Error importing enrollment data:", err);
  } finally {
    mongoose.connection.close();
    console.log("🔌 MongoDB connection closed");
  }
};

importEnrollmentKims();
