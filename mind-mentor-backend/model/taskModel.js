const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema(
  {
    enquiryStageTag: { type: String, },
    addNoteTo: { type: String, default: "parent" }, // Default is 'parent'
    notes: { type: String, },
  },
  { _id: false } // Disabling _id for subdocuments
);

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
      id: {
        type: mongoose.Schema.Types.ObjectId, // Storing the employee's ID
      },
      name: {
        type: String, // Storing the employee's name
      },
      email: {
        type: String, // Storing the employee's email
      },
      department:{type:String},
    },
    assignedTo: {
      type: String,
    },
    assignedTodepartment:{type: String},
    status: {
      type: String,
      default: "Pending",
    },
    assignedToName:{type:String},
    statusUpdatedBy: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
      name: { type: String,    },
      email: { type: String,    },
      department:{ type: String, }
    },
    notes: [NoteSchema], // Embedding NoteSchema
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Task", TaskSchema);
