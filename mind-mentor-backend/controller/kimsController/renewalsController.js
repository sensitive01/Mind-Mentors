const mongoose = require("mongoose");
const xlsx = require("xlsx");
const path = require("path");
const RenewalData = require("../../model/kimsdatabase/renewalDataKims");

// ✅ Helper to parse numbers safely
const parseNumber = (val) => {
  if (val === undefined || val === null || val === "") return null;
  const num = Number(val.toString().trim());
  return isNaN(num) ? null : num;
};

// ✅ Helper to parse epoch → Date
const parseDate = (val) => {
  if (!val) return null;
  const num = Number(val);
  if (!isNaN(num)) return new Date(num); // epoch
  const date = new Date(val);
  return isNaN(date.getTime()) ? null : date;
};

// ✅ Helper to parse booleans (always true/false, lowercase)
const parseBoolean = (val) => {
  if (val === undefined || val === null || val === "") return false;
  if (typeof val === "boolean") return val;
  const str = val.toString().trim().toLowerCase();
  return str === "true" || str === "yes" || str === "1";
};

const importRenewalData = async () => {
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
      "../../../../kimsdata/basic#Renewals.csv"
    );
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const jsonData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (!jsonData.length) {
      console.log("⚠️ Renewal Excel file is empty");
      return;
    }

    // 3. Format data
    const formatted = jsonData.map((row) => ({
      Chesskid_Gold: parseBoolean(row.Chesskid_Gold),
      Added_Time: parseDate(row.Added_Time),
      Added_User: row.Added_User || null,
      CGST: parseNumber(row.CGST),
      Cancelled_Invoice: parseBoolean(row.Cancelled_Invoice),
      Expiry_Date: row.Expiry_Date || null,
      Pretax_Amount: parseNumber(row.Pretax_Amount),
      ID: row.ID?.toString(),
      Invoice_No: row.Invoice_No || null,
      Invoice_seriel_number: row.Invoice_seriel_number || null,
      Kid_ID: row.Kid_ID?.toString(),
      Kid_Name_prefix: row["Kid_Name.prefix"] || null,
      Kid_Name_first_name: row["Kid_Name.first_name"] || null,
      Kid_Name_last_name: row["Kid_Name.last_name"] || null,
      Kid_Name_suffix: row["Kid_Name.suffix"] || null,
      Last_Interacted_with: row.Last_Interacted_with || null,
      Last_interacted_with_user_prof:
        row.Last_interacted_with_user_prof || null,
      Mode_of_Payment: row.Mode_of_Payment || null,
      Modified_Time: parseDate(row.Modified_Time),
      Modified_User: row.Modified_User || null,
      Number_of_Classes: parseNumber(row.Number_of_Classes),
      Weekly_4_to_6_classes: row.Weekly_4_to_6_classes || null,
      Weekly_2_classes: row.Weekly_2_classes || null,
      Paid_Date: row.Paid_Date || null,
      Parent_Email: row.Parent_Email || null,
      Parent_Name_prefix: row["Parent_Name.prefix"] || null,
      Parent_Name_first_name: row["Parent_Name.first_name"] || null,
      Parent_Name_last_name: row["Parent_Name.last_name"] || null,
      Parent_Name_suffix: row["Parent_Name.suffix"] || null,
      Payment_Confirmed: parseBoolean(row.Payment_Confirmed),
      Payment_Count: parseNumber(row.Payment_Count),
      Payment_ID: row.Payment_ID || null,
      Payment_Mode: row.Payment_Mode || null,
      Payment_Success: parseBoolean(row.Payment_Success),
      Payment_confirmed_by: row.Payment_confirmed_by || null,
      Classes_before_8am_and_after_7pm_IST: parseBoolean(
        row.Classes_before_8_am_and_after_7_pm_IST
      ),
      Please_choose_the_type_of_Plan:
        row.Please_choose_the_type_of_Plan || null,
      Previous_Active_Profile: parseBoolean(row.Previous_Active_Profile),
      Previous_Class_Expiration_Date:
        row.Previous_Class_Expiration_Date || null,
      Previous_Date_of_Joining: row.Previous_Date_of_Joining || null,
      Previous_Last_Renewed_Date: row.Previous_Last_Renewed_Date || null,
      Previous_Paused_Profile: parseBoolean(row.Previous_Paused_Profile),
      Previous_Presales: parseBoolean(row.Previous_Presales),
      Previously_Classes_after_last_renewal: parseNumber(
        row.Previously_Classes_after_last_renewal
      ),
      Previously_Renewed_Amount: parseNumber(row.Previously_Renewed_Amount),
      Reason_for_Cancellation: row.Reason_for_Cancellation || null,
      Record_Status: parseNumber(row.Record_Status),
      Renewal_Type: row.Renewal_Type || null,
      Renewal_Type_Number: parseNumber(row.Renewal_Type_Number),
      SGST: parseNumber(row.SGST),
      Tax: parseNumber(row.Tax),
      Total_Amount: parseNumber(row.Total__Amount),
      Voucher_Amount: parseNumber(row.Voucher_Amount),
      Weekend_Classes: parseBoolean(row.Weekend_Classes),
    }));

    // 4. Bulk insert (track success/failure)
    const bulkOps = formatted.map((doc) => ({
      insertOne: { document: doc },
    }));

    const result = await RenewalData.bulkWrite(bulkOps, { ordered: false });

    const inserted = result.insertedCount || 0;
    const failed = formatted.length - inserted;

    console.log(`✅ Inserted: ${inserted}`);
    console.log(`⚠️ Failed: ${failed}`);

    // If failures, try to extract their IDs
    if (failed > 0) {
      const existing = await RenewalData.find(
        { ID: { $in: formatted.map((f) => f.ID) } },
        { ID: 1, _id: 0 }
      );
      const existingIDs = existing.map((d) => d.ID);
      const failedIDs = formatted
        .filter((f) => !existingIDs.includes(f.ID))
        .map((f) => f.ID);
      console.log("❌ Failed IDs:", failedIDs);
    }
  } catch (err) {
    console.error("❌ Error importing renewal data:", err);
  } finally {
    mongoose.connection.close();
    console.log("🔌 MongoDB connection closed");
  }
};

 importRenewalData();
