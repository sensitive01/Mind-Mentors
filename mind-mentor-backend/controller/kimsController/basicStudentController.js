const mongoose = require("mongoose");
const xlsx = require("xlsx");
const path = require("path");
const StudentData = require("../../model/kimsdatabase/basicStudentsDb");

// Helpers
const parseDate = (value) => {
  if (!value) return null;
  if (!isNaN(value) && value.toString().length === 13) {
    return new Date(Number(value)); // Epoch
  }
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
};

const parseBool = (value) => {
  if (value === null || value === undefined) return false;
  return ["true", "yes", "1"].includes(value.toString().trim().toLowerCase());
};

const importExcelWithReport = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://MindMentorz:3jQhR36LMPNNznsN@cluster0.f5db1.mongodb.net/mindmentors`,
      { useNewUrlParser: true, useUnifiedTopology: true }
    );

    console.log("✅ Connected to MongoDB");

    const filePath = path.join(
      __dirname,
      "../../../../kimsdata/skippedStudents.xlsx"
    );
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];

    const jsonData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], {
      raw: false,
      defval: null,
    });

    if (!jsonData.length) {
      console.log("⚠️ Excel file is empty");
      return;
    }

    console.log(`📦 Found ${jsonData.length} rows in Excel`);

    const formattedData = jsonData.map((row, index) => {
      const formattedRow = { __row: index + 2 }; // track Excel row (row 1 = header)

      for (const [key, value] of Object.entries(row)) {
        if (
          key.toLowerCase().includes("time") ||
          key.toLowerCase().includes("date")
        ) {
          formattedRow[key] = parseDate(value);
        } else if (key.toLowerCase().includes("id")) {
          formattedRow[key] = value ? String(value) : null;
        } else if (
          key.toLowerCase().includes("flag") ||
          key.toLowerCase().includes("active") ||
          key.toLowerCase().includes("paused") ||
          key.toLowerCase().includes("prospect") ||
          key.toLowerCase().includes("cold") ||
          key.toLowerCase().includes("renewal") ||
          key.toLowerCase().includes("rubik") ||
          key.toLowerCase().includes("spreadsheets")
        ) {
          formattedRow[key] = parseBool(value);
        } else {
          formattedRow[key] = value !== undefined ? value : null;
        }
      }

      return formattedRow;
    });

    let insertedCount = 0;
    let failedCount = 0;
    let errorDetails = [];

    try {
      const insertedDocs = await StudentData.insertMany(formattedData, {
        ordered: false,
      });
      insertedCount = insertedDocs.length;
    } catch (err) {
      if (err.writeErrors && err.writeErrors.length > 0) {
        failedCount = err.writeErrors.length;
        errorDetails = err.writeErrors.map((we) => ({
          row: formattedData[we.index].__row, // Excel row number
          id: formattedData[we.index].ID || null,
          reason: we.errmsg || we.err.message,
        }));
        insertedCount = err.result.result.nInserted;
      } else {
        throw err; // rethrow if not a writeErrors case
      }
    }

    console.log("📊 Migration Report:");
    console.log(`   Total Rows   : ${jsonData.length}`);
    console.log(`   Inserted     : ${insertedCount}`);
    console.log(`   Failed       : ${failedCount}`);

    if (failedCount > 0) {
      console.log("   ❌ Failures:");
      console.table(errorDetails);
    }
  } catch (error) {
    console.error("❌ Fatal Import Error:", error);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 MongoDB connection closed");
  }
};

importExcelWithReport();
