const mongoose = require("mongoose");

const prizeSchema = new mongoose.Schema({
  position: { type: String, required: true },
  amount: { type: String, required: true }, 
});

const tournamentSchema = new mongoose.Schema(
  {
    tournamentName: { type: String, required: true },
    mode: { type: String, enum: ["online", "offline"], required: true },
    tournamentCentre: { type: String }, 
    centerId: { type: mongoose.Schema.Types.ObjectId, ref: "Center" }, 
    tournamentDate: { type: Date },
    time: { type: String },
    hasRegistrationFee: { type: Boolean, default: false },
    registrationFee: { type: Number, default: 0 },
    instructions: { type: String },
    numberOfParticipants: { type: Number },
    prizePool: [prizeSchema],
    registeredKids: { type: [String], default: [] },
  },
  { timestamps: true }
);

const notificationSchema = new mongoose.Schema({
  title: { type: String },
  body: { type: String },
  type: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const holidaySchema = new mongoose.Schema(
  {
    holidayName: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    description: { type: String },
    attachment: { type: String },
    category: { type: String },
  },
  { timestamps: true }
);

const allowanceDeductionSchema = new mongoose.Schema(
  {
    employeeName: { type: String },
    allowance: {
      type: String,
      enum: ["HRA", "Travel", "Medical", "Other"],
    },
    deduction: {
      type: String,
      enum: ["Tax", "Loan", "Other"],
    },
    amount: { type: Number },
  },
  { timestamps: true }
);

const expenseSchema = new mongoose.Schema(
  {
    category: { type: String, enum: ["Travel", "Food", "Utilities", "Others"] },
    description: { type: String },
    amount: { type: Number },
    date: { type: Date },
  },
  { timestamps: true }
);

const transactionSchema = new mongoose.Schema(
  {
    transactionId: { type: String },
    employeeName: { type: String },
    transactionType: { type: String, enum: ["Credit", "Debit"] },
    amount: { type: Number },
    status: { type: String, enum: ["Pending", "Completed", "Failed"] },
    date: { type: Date },
  },
  { timestamps: true }
);

const chatSchema = new mongoose.Schema(
  {
    ticketId: { type: String, unique: true }, // Custom Ticket ID
    category: { type: String },
    messages: [
      {
        sender: {
          _id: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
          firstName: { type: String },
          lastName: { type: String },
        },
        receiver: {
          _id: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
          firstName: { type: String },
          lastName: { type: String },
        },
        message: { type: String },
        attachment: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved"],
      default: "Pending",
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Create models
const Tournament = mongoose.model("Tournament", tournamentSchema);
const Notification = mongoose.model("Notification", notificationSchema);
const Holiday = mongoose.model("Holiday", holidaySchema);
const AllowanceDeduction = mongoose.model(
  "AllowanceDeduction",
  allowanceDeductionSchema
);
const Expense = mongoose.model("Expense", expenseSchema);
const Transaction = mongoose.model("Transaction", transactionSchema);
const Chat = mongoose.model("Chat", chatSchema);

// Export models
module.exports = {
  Tournament,
  Notification,
  Holiday,
  AllowanceDeduction,
  Expense,
  Transaction,
  Chat,
};
