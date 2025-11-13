const mongoose = require("mongoose");

const ClassScheduleSchema = new mongoose.Schema({
  Added_Time: { type: Date },
  Added_User: { type: String },
  Class_End_Time: { type: Date },
  Class_ID: { type: String, unique: true }, // unique ID for tracking
  Class_Level: { type: String },
  Class_Log: { type: String },
  Class_Over: { type: Boolean },
  Class_Start_Date_Time: { type: Date },
  Class_Start_Time: { type: String },
  Class_Status_Place_Holder: { type: String },

  Coach_Logged_In: { type: Boolean },
  Coach_Login_Time: { type: Date },
  Coach_Name: { type: String },

  Day: { type: String },
  Demo_Session: { type: String },
  Kid_Link: { type: String }, // foreign key to kids
  Max_Class_Strength: { type: Number },
  Meeting_ID: { type: String },

  Modified_Time: { type: Date },
  Modified_User: { type: String },

  My_Class_Place_Holder: { type: String },
  Number_of_Active_Kids: { type: Number },
  Program: { type: String },
  Record_Status: { type: String },
  Time: { type: String },
  Today_class_status_for_temp_kids: { type: String },
  Zoom_Link: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("ClassScheduleKIMS", ClassScheduleSchema);
