// const mongoose = require('mongoose');

// const operationDeptSchema = new mongoose.Schema({
//   // Existing fields
//   parentFirstName: { type: String, required: true },
//   parentLastName: { type: String, required: true },
//   kidFirstName: { type: String, required: true },
//   kidLastName: { type: String, required: true },
//   whatsappNumber: { type: String, required: true },
//   email: { type: String, required: true },
//   message: { type: String },
//   source: { type: String },
//   kidsAge: { type: Number },
//   kidsGender: { type: String },
//   programs: { type: String },
//   intentionOfParents: { type: String },
//   schoolName: { type: String },
//   address: { type: String },

//   // New Fields for Status and Notes
//   status: {
//     type: String,
//     enum: ['cold', 'warm'],
//     default: 'cold' // Default status is cold
//   },
//   notes: [
//     {
//       enquiryStageTag: { type: String, required: true },
//       addNoteTo: { type: String, default: 'parent' },  // Default is 'parent'
//       notes: { type: String, required: true }
//     }
//   ]
// }, { timestamps: true });

// module.exports = mongoose.model('OperationDept', operationDeptSchema);

const mongoose = require('mongoose');
const ProgramSchema = new mongoose.Schema({
  program: { type: String, required: true },
  level: { type: String, required: true }
});

const operationDeptSchema = new mongoose.Schema({
  parentFirstName: { type: String, required: true },
  parentLastName: { type: String, required: true },
  kidFirstName: { type: String, required: true },
  kidLastName: { type: String, required: true },
  whatsappNumber: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String },
  source: { type: String },
  kidsAge: { type: Number },
  kidsGender: { type: String },
  programs: {
    type: [ProgramSchema], // Array of objects with specific schema
    required: true
} ,

 intentionOfParents: { type: String },
  schoolName: { type: String },
  address: { type: String },
  schoolPincode:{ type: String },
  // New Fields
  enquiryStatus: { type: String, enum: ['Cold', 'Warm'], default: 'Cold' }, // Cold or Warm
  notes: { type: String }, // For adding notes
  scheduleDemo: {
    date: { type: Date },
    status: { type: String, enum: ['Scheduled', 'Completed', 'Cancelled'], default: 'Scheduled' }
  },
  referral: {
    referredTo: { type: String },
    referredEmail: { type: String }
  }
}, { timestamps: true });

module.exports = mongoose.model('OperationDept', operationDeptSchema);
