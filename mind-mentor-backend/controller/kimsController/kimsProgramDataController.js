const mongoose = require("mongoose");
const ProgramData = require("../../model/kimsdatabase/programDataKims");

const seedProgramData = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://MindMentorz:3jQhR36LMPNNznsN@cluster0.f5db1.mongodb.net/mindmentors`,
      { useNewUrlParser: true, useUnifiedTopology: true }
    );
    console.log("✅ Connected to MongoDB");

    // Updated dataset from your Excel table
    const programDocs = [
      { ID: "123252000000487043", SEQUENCE_NUMBER: -1, CHOICE: "Choice 1" },
      { ID: "123252000000487047", SEQUENCE_NUMBER: -1, CHOICE: "Choice 2" },
      { ID: "123252000000487051", SEQUENCE_NUMBER: -1, CHOICE: "Choice 3" },
      { ID: "123252000000487071", SEQUENCE_NUMBER: 1, CHOICE: "Chess" },
      { ID: "123252000000487075", SEQUENCE_NUMBER: 2, CHOICE: "Coding" },
      { ID: "123252000000487079", SEQUENCE_NUMBER: 3, CHOICE: "Robotics" },
      { ID: "123252000000487083", SEQUENCE_NUMBER: 4, CHOICE: "Rubik's Cube" },
      {
        ID: "123252000003877059",
        SEQUENCE_NUMBER: 5,
        CHOICE: "Spreadsheets & AI",
      },
    ];

    // Clear existing records (optional)
    await ProgramData.deleteMany({});
    console.log("🧹 Cleared existing ProgramData collection");

    // Insert new records
    const inserted = await ProgramData.insertMany(programDocs, {
      ordered: true,
    });
    console.log(`✅ Successfully inserted ${inserted.length} programs`);
  } catch (error) {
    console.error("❌ Error inserting Program Data:", error);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 MongoDB connection closed");
  }
};

seedProgramData();
