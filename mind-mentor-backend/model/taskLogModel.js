const mongoose = require('mongoose');

const ActivityLogSchema = new mongoose.Schema({
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true,
  },
  action: {
    type: String,
    enum: ['CREATE', 'UPDATE', 'STATUS_UPDATE', 'ADD_NOTE', 'DELETE'],
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
  },
  performedByName: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const ActivityLog = mongoose.model('ActivityLog', ActivityLogSchema);
module.exports = ActivityLog;
