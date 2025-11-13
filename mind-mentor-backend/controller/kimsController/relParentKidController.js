const mongoose = require("mongoose");
const fs = require("fs");
const xlsx = require("xlsx");
const path = require("path");

const ParentData = require("../../model/kimsdatabase/basicParentDataKIMS");
const StudentData = require("../../model/kimsdatabase/basicStudentsDb");
const ParentKidLink = require("../../model/kimsdatabase/relBtwParentKid");

// ✅ MongoDB connection string
const MONGO_URI = `mongodb+srv://MindMentorz:3jQhR36LMPNNznsN@cluster0.f5db1.mongodb.net/mindmentors`;

const importRelations = async () => {
  let conn;
  try {
    conn = await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");

    const filePath = path.join(
      __dirname,
      "../../../../kimsdata/skippedRelations.xlsx" // or .xlsx
    );

    // Read workbook safely (supports csv and xlsx)
    let workbook;
    if (filePath.endsWith(".csv")) {
      const fileContent = fs.readFileSync(filePath, "utf8");
      workbook = xlsx.read(fileContent, { type: "string" });
    } else {
      workbook = xlsx.readFile(filePath);
    }

    const sheetName = workbook.SheetNames[0];
    const jsonData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], {
      defval: "", // keep empty cells as empty string
      raw: false, // parse numbers as strings
      blankrows: false, // ignore blank rows
    });

    if (!jsonData || jsonData.length === 0) {
      console.log("⚠️ Relation file is empty");
      return;
    }

    console.log(`📦 Found ${jsonData.length} rows in the relation file`);

    // Summary counters
    let insertedCount = 0;
    let skippedCount = 0;
    let failedCount = 0;
    let processedCount = 0;

    // Collect details for later export
    const skippedRows = [];
    const failedRows = [];

    // Ensure output directory exists
    const outDir = path.join(__dirname, "../../../../kimsdata/output");
    fs.mkdirSync(outDir, { recursive: true });

    const logTotals = () => {
      process.stdout.write(
        `\rProcessed: ${processedCount}/${jsonData.length} | Inserted: ${insertedCount} | Skipped: ${skippedCount} | Failed: ${failedCount}`
      );
    };

    for (const [index, row] of jsonData.entries()) {
      processedCount++;
      try {
        // Coerce IDs to string and trim whitespace
        const parentExcelIdRaw = row["Parents#RECORD_LINK_ID#REF"];
        const kidExcelIdRaw = row["Kids#RECORD_LINK_ID#BASE"];

        // Normalize to string. If the cell is numeric, raw:false kept it as string; still coerce for safety
        const parentExcelId =
          parentExcelIdRaw !== null &&
          parentExcelIdRaw !== undefined &&
          String(parentExcelIdRaw).trim() !== ""
            ? String(parentExcelIdRaw).trim()
            : null;
        const kidExcelId =
          kidExcelIdRaw !== null &&
          kidExcelIdRaw !== undefined &&
          String(kidExcelIdRaw).trim() !== ""
            ? String(kidExcelIdRaw).trim()
            : null;

        if (!parentExcelId || !kidExcelId) {
          skippedCount++;
          skippedRows.push({
            row: index + 2, // approximate Excel line (header row assumed 1)
            parentId: parentExcelId,
            kidId: kidExcelId,
            reason: "Missing Parent or Kid ID",
          });
          console.log(
            `\n⚠️ Row ${
              index + 1
            } skipped (missing ID) -> parent:${parentExcelId} kid:${kidExcelId}`
          );
          logTotals();
          // periodic checkpoint
          if (processedCount % 100 === 0) console.log("");
          continue;
        }

        // Find parent & kid in DB (ID field assumed string in DB)
        const parent = await ParentData.findOne({ ID: parentExcelId }).lean();
        const kid = await StudentData.findOne({ ID: kidExcelId }).lean();

        if (parent && kid) {
          // Avoid duplicate relation
          const exists = await ParentKidLink.findOne({
            parentId: parent._id,
            kidId: kid._id,
          }).lean();

          if (!exists) {
            await ParentKidLink.create({
              parentId: parent._id,
              kidId: kid._id,
            });
            insertedCount++;
            console.log(
              `\n✅ Row ${
                index + 1
              } inserted (Parent ${parentExcelId} <-> Kid ${kidExcelId})`
            );
          } else {
            skippedCount++;
            skippedRows.push({
              row: index + 2,
              parentId: parentExcelId,
              kidId: kidExcelId,
              reason: "Duplicate relation",
            });
            console.log(
              `\n⚠️ Row ${
                index + 1
              } skipped (duplicate relation) -> parent:${parentExcelId} kid:${kidExcelId}`
            );
          }
        } else {
          skippedCount++;
          skippedRows.push({
            row: index + 2,
            parentId: parentExcelId,
            kidId: kidExcelId,
            reason: `Parent or Kid not found in DB${
              parent ? "" : " (parent missing)"
            }${kid ? "" : " (kid missing)"}`,
          });
          console.log(
            `\n⚠️ Row ${
              index + 1
            } skipped (Parent or Kid not found) -> parent:${parentExcelId} kid:${kidExcelId}`
          );
        }

        logTotals();
        if (processedCount % 100 === 0) console.log(""); // newline for readability every 100
      } catch (err) {
        failedCount++;
        failedRows.push({
          row: index + 2,
          error: err.message,
          rawRow: row,
        });
        console.error(`\n❌ Row ${index + 1} failed: ${err.message}`);
        logTotals();
        if (processedCount % 100 === 0) console.log("");
      }
    } // end loop

    // final newline after progress bar
    console.log("");

    // Final summary
    console.log("\n✅ Import complete!");
    console.log(`   Total Rows : ${jsonData.length}`);
    console.log(`   Inserted   : ${insertedCount}`);
    console.log(`   Skipped    : ${skippedCount}`);
    console.log(`   Failed     : ${failedCount}`);

    // Save skipped and failed rows to CSV/JSON files for auditing
    const ts = new Date().toISOString().replace(/[:.]/g, "-");
    if (skippedRows.length > 0) {
      const skippedSheet = xlsx.utils.json_to_sheet(skippedRows);
      const skippedCsv = xlsx.utils.sheet_to_csv(skippedSheet);
      const skippedPath = path.join(outDir, `rel_import_skipped_${ts}.csv`);
      fs.writeFileSync(skippedPath, skippedCsv, "utf8");
      fs.writeFileSync(
        path.join(outDir, `rel_import_skipped_${ts}.json`),
        JSON.stringify(skippedRows, null, 2),
        "utf8"
      );
      console.log(`\n⚠️ Skipped rows exported to: ${skippedPath}`);
    } else {
      console.log("\nNo skipped rows to export.");
    }

    if (failedRows.length > 0) {
      const failedSheet = xlsx.utils.json_to_sheet(failedRows);
      const failedCsv = xlsx.utils.sheet_to_csv(failedSheet);
      const failedPath = path.join(outDir, `rel_import_failed_${ts}.csv`);
      fs.writeFileSync(failedPath, failedCsv, "utf8");
      fs.writeFileSync(
        path.join(outDir, `rel_import_failed_${ts}.json`),
        JSON.stringify(failedRows, null, 2),
        "utf8"
      );
      console.log(`\n❌ Failed rows exported to: ${failedPath}`);
    } else {
      console.log("\nNo failed rows to export.");
    }

    console.log("\nDone.");
  } catch (error) {
    console.error("❌ Fatal Error importing relations:", error);
  } finally {
    if (mongoose && mongoose.connection && mongoose.connection.readyState) {
      await mongoose.connection.close();
      console.log("🔌 MongoDB connection closed");
    }
  }
};

importRelations();
