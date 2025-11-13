require("dotenv")
const XLSX = require("xlsx");
const mongoose = require("mongoose");
const { MONGO_USERNAME, MONGO_PASSWORD, MONGO_DATABASE_NAME } = require("../config/variables/variables");

// MongoDB connection string - update this with your actual connection string
const MONGODB_URI = `mongodb+srv://MindMentorz:3jQhR36LMPNNznsN@cluster0.f5db1.mongodb.net/mindmentors`;

console.log("MongoDB Credentials:");
console.log("Username:", MONGO_USERNAME,process.env.MONGO_USERNAME_MIND);
console.log("Password:", MONGO_PASSWORD ? "*** (set)" : "NOT SET");
console.log("Database:", MONGO_DATABASE_NAME);


// Student Schema
const studentSchema = new mongoose.Schema(
  {
    kidFirstName: String,
    kidLastName: String,
    kidsGender: String,
    kidsAge: Number,
    address: String,
    city: String,
    state: String,
    pincode: String,
    parentFirstName: String,
    contactNumber: String,
    email: String,
    schoolName: String,
    chessKidName: String,
    enquiryStatus: String,
    remainingClass: Number,
    attendedClass: {
      both: Number,
    },
    source: String,
    intentionOfParents: String,
    enquiryStage: String,
    Demo_Class_Date: Date,
    Demo_Count: Number,
    Demo_Taken_Day: String,
    Payment_Link: String,
    Photograph: String,
    Welcomed_by: String,
    Enrolled_by: String,
    Date_of_Joining: Date,
    Franchee_Notes: String,
    Games_Played: String,
  },
  { timestamps: true }
);

// Create model
const OperationDept = mongoose.model("OperationDept", studentSchema);

// Main function to process Excel and upload to MongoDB
async function uploadExcelToMongoDB(filePath) {
  try {
    // Connect to MongoDB
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB successfully");

    // Read the Excel file
    console.log("Reading Excel file...");
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);

    console.log(`Found ${data.length} records in Excel file`);

    // Map Excel data to MongoDB schema
    console.log("Mapping data to schema...");
    const students = data.map((row) => ({
      kidFirstName: row["Name.first_name"],
      kidLastName: row["Name.last_name"],
      kidsGender: row["Gender"],
      kidsAge: row["Age"],
      address: row["Address.address_line_1"],
      city: row["Address.district_city"],
      state: row["Address.state_province"],
      pincode: row["Address.postal_Code"],
      parentFirstName: row["Parent_Notes"] || row["Father.father_name"],
      contactNumber: row["Father.father_mobile_number"] || row["contactNumber"],
      email: row["Father.father_email"] || row["email"],
      schoolName: row["School"] || row["schoolName"],
      chessKidName: row["ChessKid_ID"],
      enquiryStatus: row["Active_Profile"] === true ? "Active" : "Pending",
      remainingClass: row["Classes_Remaining"],
      attendedClass: { both: row["Total_Classes_Attended"] },
      source: row["Lead_Source"],
      intentionOfParents: row["Intention_of_Parents"],
      enquiryStage: row["Record_Status"],
      Demo_Class_Date: row["Demo_Class_Date"],
      Demo_Count: row["Demo_Count"],
      Demo_Taken_Day: row["Demo_Taken_Day"],
      Payment_Link: row["Payment_Link"],
      Photograph: row["Photograph"],
      Welcomed_by: row["Welcomed_by"],
      Enrolled_by: row["Enrolled_by"],
      Date_of_Joining: row["Date_of_Joining"],
      Franchee_Notes: row["Franchisee_Notes"],
      Games_Played: row["Games_Played"],
    }));

    // Insert into MongoDB
    console.log("Uploading data to MongoDB...");
    const result = await OperationDept.insertMany(students);

    console.log(`Successfully uploaded ${result.length} students to MongoDB`);

    // Close the connection
    await mongoose.connection.close();
    console.log("MongoDB connection closed");

    return { success: true, count: result.length };
  } catch (err) {
    console.error("Error:", err.message);

    // Close the connection in case of error
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }

    return { success: false, error: err.message };
  }
}

// If this file is run directly, execute the upload
if (require.main === module) {
  const filePath = process.argv[2] || "./dummydata.xlsx";

  if (!filePath) {
    console.error("Please provide the path to the Excel file");
    console.log("Usage: node uploadExcel.js <path-to-excel-file>");
    process.exit(1);
  }

  console.log(`Processing file: ${filePath}`);

  uploadExcelToMongoDB(filePath)
    .then((result) => {
      if (result.success) {
        console.log(
          `✅ Upload completed successfully. ${result.count} records inserted.`
        );
        process.exit(0);
      } else {
        console.error("❌ Upload failed:", result.error);
        process.exit(1);
      }
    })
    .catch((err) => {
      console.error("❌ Unexpected error:", err);
      process.exit(1);
    });
}

module.exports = { uploadExcelToMongoDB };
