const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  attendanceDate: { 
    type: Date, 
    required: true,
    validate: {
      validator: function (value) {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to midnight
        return value.getTime() === today.getTime();
      },
      message: "Attendance can only be marked for today's date.",
    },
  },
  time: { 
    type: Date, 
    required: true, 
  },
  employeeName: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    required: true, 
    enum: ['Present', 'Absent'],
  },
});

module.exports = mongoose.model('coachAttendance', AttendanceSchema);
