const mongoose = require("mongoose");
const xlsx = require("xlsx");
const path = require("path");
const RelEnrollmentCentre = require("../../model/kimsdatabase/relBtwEnrollmentCenter");

const importRelEnrollmentCentreExcelWithReport = async () => {
  try {
    // 🔗 Connect to MongoDB
    await mongoose.connect(
      `mongodb+srv://MindMentorz:3jQhR36LMPNNznsN@cluster0.f5db1.mongodb.net/mindmentors`,
      { useNewUrlParser: true, useUnifiedTopology: true }
    );
    console.log("✅ Connected to MongoDB");

    // 📁 File path
    const filePath = path.join(
      __dirname,
      "../../../../kimsdata/rel#Enrolled_Centre#Kids.csv" // update if file name differs
    );

    // 📖 Read Excel/CSV file
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

    // 🧩 Format data properly
    const formattedData = jsonData
      .map((row, index) => {
        const kidId = row["Kids#RECORD_LINK_ID#BASE"]
          ? String(row["Kids#RECORD_LINK_ID#BASE"]).trim()
          : null;
        const centreId = row["Centres#RECORD_LINK_ID#REF"]
          ? String(row["Centres#RECORD_LINK_ID#REF"]).trim()
          : null;

        // Skip rows missing required fields
        if (!kidId || !centreId) return null;

        return {
          __row: index + 2, // for reference in error logs
          kidId,
          centreId,
        };
      })
      .filter(Boolean); // remove null rows

    console.log(`🧾 Ready to insert ${formattedData.length} valid records`);

    // 📤 Insert data into MongoDB
    let insertedCount = 0;
    let failedCount = 0;
    let errorDetails = [];

    try {
      const insertedDocs = await RelEnrollmentCentre.insertMany(formattedData, {
        ordered: false,
      });
      insertedCount = insertedDocs.length;
    } catch (err) {
      if (err.writeErrors && err.writeErrors.length > 0) {
        failedCount = err.writeErrors.length;
        errorDetails = err.writeErrors.map((we) => ({
          row: formattedData[we.index].__row,
          kidId: formattedData[we.index].kidId,
          centreId: formattedData[we.index].centreId,
          reason: we.errmsg || we.err.message,
        }));
        insertedCount = err.result?.result?.nInserted || 0;
      } else {
        throw err;
      }
    }

    // 📊 Final Report
    console.log("\n📊 Migration Report:");
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

importRelEnrollmentCentreExcelWithReport();
