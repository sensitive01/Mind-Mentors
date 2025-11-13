const mongoose = require("mongoose");
const ParentData = require("../../model/kimsdatabase/basicParentDataKIMS");
const xlsx = require("xlsx");
const path = require("path");

// Parse timestamps safely (handles both epoch ms and Excel dates)
const parseDate = (value) => {
  if (!value) return null;

  // Epoch in milliseconds (e.g. 1634094518000)
  if (!isNaN(value) && value.toString().length === 13) {
    return new Date(Number(value));
  }

  // Excel/ISO date
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
};

// Parse booleans safely (accepts TRUE/FALSE, true/false, 1/0, Yes/No)
const parseBool = (value) => {
  if (value === null || value === undefined) return false;
  return ["true", "yes", "1"].includes(value.toString().trim().toLowerCase());
};

const importParentExcel = async () => {
  try {
    // Connect to DB
    await mongoose.connect(
      `mongodb+srv://MindMentorz:3jQhR36LMPNNznsN@cluster0.f5db1.mongodb.net/mindmentors`
    );

    // Read CSV file
    const filePath = path.join(
      __dirname,
      "../../../../kimsdata/SkippedParentData.xlsx"
    );
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];

    // Parse rows, keep empty cells as null
    const jsonData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], {
      raw: false, // keep strings instead of converting to numbers
      defval: null,
    });

    if (!jsonData.length) {
      console.log("⚠️ Parent Excel file is empty");
      return;
    }

    // Format rows exactly as schema
    const formattedData = jsonData.map((row) => ({
      Added_Time: parseDate(row.Added_Time),
      Added_User: row.Added_User || null,
      Added_by: row.Added_by || null,

      Alternate_Email: row.Alternate_Email || null,
      Alternate_WhatsApp_Number: row.Alternate_WhatsApp_Number || null,

      Auto_Number: row.Auto_Number ? String(row.Auto_Number) : null,
      Communicaton_Opt_Out: parseBool(row.Communicaton_Opt_Out),
      Google_Review_Submitted: parseBool(row.Google_Review_Submitted),

      ID: row.ID ? String(row.ID) : null, // ✅ keeps long IDs intact
      Log: row.Log || null,

      Modified_Time: parseDate(row.Modified_Time),
      Modified_User: row.Modified_User || null,

      Name: {
        prefix: row["Name.prefix"] || null,
        first_name: row["Name.first_name"] || null,
        last_name: row["Name.last_name"] || null,
        suffix: row["Name.suffix"] || null,
      },

      Parents_Email: row.Parents_Email || null,
      Record_Status: row.Record_Status || null,
      WhatsApp_number: row.WhatsApp_number ? String(row.WhatsApp_number) : null, // ✅ preserves phone numbers
    }));

    // Insert everything (no deduplication, no skips)
    const inserted = await ParentData.insertMany(formattedData, {
      ordered: false, // continue even if errors
    });

    console.log(`✅ Migrated ${inserted.length} parent records successfully`);
  } catch (err) {
    console.error("❌ Error migrating parent data:", err);
  } finally {
    mongoose.connection.close();
    console.log("🔌 MongoDB connection closed");
  }
};

 importParentExcel ();
