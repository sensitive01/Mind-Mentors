const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {

    kidsRelatedTo: {
      type: String,
    },
    task: {
      type: String,

    },
    taskDate: {
      type: Date,
   
    },
    taskTime: {
      type: Date,
   
    },
    assignedBy: {
      type: String,
   
    },
    assignedTo: {
      type: String,
    },
    status: {
      type: String,
   
      default: "Pending",
    },
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model("Task", TaskSchema);
