const mongoose = require("mongoose");

const dbConnect = () => {
  console.log("Welcome to database");

  mongoose
    .connect(
      process.env.MONGO_URI,
      {
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 45000,
      }
    )
    .then(() => {
      console.log("Connected to the database Atlas");
    })
    .catch((err) => {
      console.error("Error in connecting the database", err);
    });
};

module.exports = dbConnect;
