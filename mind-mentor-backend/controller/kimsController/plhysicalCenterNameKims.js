const mongoose = require("mongoose");
const xlsx = require("xlsx");
const path = require("path");
const CenterData = require("../../model/kimsdatabase/physicalCenterKims");

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

// ✅ MongoDB connection
const MONGO_URI = `mongodb+srv://MindMentorz:3jQhR36LMPNNznsN@cluster0.f5db1.mongodb.net/mindmentors`;
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
});

const importCenters = async () => {
  try {
    const filePath = path.join(
      __dirname,
      "../../../../kimsdata/basic#Centres.csv"
    );
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const jsonData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (!jsonData.length) {
      console.log("⚠️ Center Excel file is empty");
      return;
    }

    const formattedData = jsonData.map((row) => ({
      Access_Email_Id_s: row.Access_Email_Id_s || null,
      Active_Centre: row.Active_Centre === "true" || row.Active_Centre === true,
      Added_Time: parseDate(row.Added_Time),
      Added_User: row.Added_User || null,

      Address: {
        address_line_1: row["Address.address_line_1"] || null,
        address_line_2: row["Address.address_line_2"] || null,
        district_city: row["Address.district_city"] || null,
        state_province: row["Address.state_province"] || null,
        postal_Code: row["Address.postal_Code"] || null,
        country: row["Address.country"] || null,
        latitude: parseNumber(row["Address.latitude"]),
        longitude: parseNumber(row["Address.longitude"]),
      },

      Centre_Name: row.Centre_Name || null,
      Cost_of_Online_class: parseNumber(row.Cost_of_Online_class),
      Cost_of_Physical_Class: parseNumber(row.Cost_of_Physical_Class),
      Different_Pricing_when_enrolled_centre:
        row.Different_Pricing_when_enrolled_centre || null,

      ID: row.ID || null,
      Invoice_prefix: row.Invoice_prefix || null,

      Modified_Time: parseDate(row.Modified_Time),
      Modified_User: row.Modified_User || null,

      Payment_Collection_by_FMM: row.Payment_Collection_by_FMM || null,
      Physical_Centre: row.Physical_Centre || null,
      Record_Status: row.Record_Status || null,
      Service_Centre: row.Service_Centre || null,
    }));

    const inserted = await CenterData.insertMany(formattedData, {
      ordered: false,
    });
    console.log(`✅ Imported ${inserted.length} centers successfully`);
  } catch (error) {
    console.error("❌ Error importing centers:", error);
  } finally {
    mongoose.connection.close();
    console.log("🔌 MongoDB connection closed");
  }
};

importCenters();
