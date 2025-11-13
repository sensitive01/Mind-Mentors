const mongoose = require("mongoose");
const xlsx = require("xlsx");
const path = require("path");
const RelKidCentre = require("../../model/kimsdatabase/relKidCentre");

const importRelKidCentreExcelWithReport = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://MindMentorz:3jQhR36LMPNNznsN@cluster0.f5db1.mongodb.net/mindmentors`,
      { useNewUrlParser: true, useUnifiedTopology: true }
    );

    console.log("✅ Connected to MongoDB");

    const filePath = path.join(
      __dirname,
      "../../../../kimsdata/kidCentreRelation.xlsx" // <-- update path
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

    const formattedData = jsonData.map((row, index) => ({
      __row: index + 2,
      KidID: row["Kids#RECORD_LINK_ID#BASE"]
        ? String(row["Kids#RECORD_LINK_ID#BASE"])
        : null,
      CentreID: row["Centres#RECORD_LINK_ID#REF"]
        ? String(row["Centres#RECORD_LINK_ID#REF"])
        : null,
    }));

    let insertedCount = 0;
    let failedCount = 0;
    let errorDetails = [];

    try {
      const insertedDocs = await RelKidCentre.insertMany(formattedData, {
        ordered: false,
      });
      insertedCount = insertedDocs.length;
    } catch (err) {
      if (err.writeErrors && err.writeErrors.length > 0) {
        failedCount = err.writeErrors.length;
        errorDetails = err.writeErrors.map((we) => ({
          row: formattedData[we.index].__row,
          KidID: formattedData[we.index].KidID,
          CentreID: formattedData[we.index].CentreID,
          reason: we.errmsg || we.err.message,
        }));
        insertedCount = err.result.result.nInserted;
      } else {
        throw err;
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

importRelKidCentreExcelWithReport();
