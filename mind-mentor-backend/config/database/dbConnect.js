// const mongoose = require("mongoose");

// const dbConnect = () => {
//   console.log("Welcome to database");

//   mongoose
//     .connect(
//       process.env.MONGO_URI,
//       {
//         serverSelectionTimeoutMS: 30000,
//         socketTimeoutMS: 45000,
//       }
//     )
//     .then(() => {
//       console.log("Connected to the database Atlas");
//     })
//     .catch((err) => {
//       console.error("Error in connecting the database", err);
//     });
// };

// module.exports = dbConnect;


const mongoose = require("mongoose");

const dbConnect = () => {
  console.log("Welcome to database");

  mongoose
    .connect(
        "mongodb+srv://MindMentorz:3jQhR36LMPNNznsN@cluster0.f5db1.mongodb.net/mindmentors",
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