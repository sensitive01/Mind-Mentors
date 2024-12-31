const mongoose = require('mongoose');

// Tournament Schema
const tournamentSchema = new mongoose.Schema({
  tournamentDate: { type: Date },
  tournamentCentre: { type: String },
  time: { type: String }, // Time should be a string to store in HH:mm format
  tournamentType: { type: String },
  registrationFee: { type: Number },
  registeredKids: { type: [String] }, // Or Number, depending on your use case
  numberOfParticipants: { type: Number },
}, { timestamps: true });


// Notification Schema
const notificationSchema = new mongoose.Schema({
  title: { type: String, },
  body: { type: String, },
  type: { type: String, },
  createdAt: { type: Date, default: Date.now }
});

// Holiday Schema
const holidaySchema = new mongoose.Schema({
  holidayName: { type: String, },
  startDate: { type: Date, },
  endDate: { type: Date, },
  description: { type: String, },
  status: { type: String, enum: ['Active', 'Inactive'] },
}, { timestamps: true });

// allowanceDeductionSchema
const allowanceDeductionSchema = new mongoose.Schema({
  employeeName: { type: String, }, // Store the employee's name
  allowance: {
    type: String,
    enum: ['HRA', 'Travel', 'Medical', 'Other'],
  },
  deduction: {
    type: String,
    enum: ['Tax', 'Loan', 'Other'],
  },
  amount: { type: Number, },
}, { timestamps: true });

const expenseSchema = new mongoose.Schema({
  category: { type: String, enum: ['Travel', 'Food', 'Utilities', 'Others'] },
  description: { type: String },
  amount: { type: Number },
  date: { type: Date },
}, { timestamps: true });

const transactionSchema = new mongoose.Schema({
  transactionId: { type: String },
  employeeName: { type: String },
  transactionType: { type: String, enum: ['Credit', 'Debit'] },
  amount: { type: Number },
  status: { type: String, enum: ['Pending', 'Completed', 'Failed'] },
  date: { type: Date },
}, { timestamps: true });

const chatSchema = new mongoose.Schema({
  ticketId: { type: String,   unique: true }, // Custom Ticket ID
  category: { type: String },
  messages: [
    {
      sender: {
        _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
        firstName: { type: String },
        lastName: { type: String }
      },
      receiver: {
        _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
        firstName: { type: String },
        lastName: { type: String }
      },
      message: { type: String },
      attachment: { type: String },
      createdAt: { type: Date, default: Date.now }
    }
  ],
  status: { type: String, enum: ['Pending', 'In Progress', 'Resolved'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });



// Create models
const Tournament = mongoose.model('Tournament', tournamentSchema);
const Notification = mongoose.model('Notification', notificationSchema);
const Holiday = mongoose.model('Holiday', holidaySchema);
const AllowanceDeduction = mongoose.model('AllowanceDeduction', allowanceDeductionSchema);
const Expense = mongoose.model('Expense', expenseSchema);
const Transaction = mongoose.model('Transaction', transactionSchema);
const Chat = mongoose.model('Chat', chatSchema);

// Export models
module.exports = { Tournament, Notification, Holiday, AllowanceDeduction, Expense, Transaction, Chat };