import React, { useMemo } from 'react';
import { Calendar, Clock, GraduationCap, CheckCircle, XCircle } from 'lucide-react';

const studentData = {
  name: "Student Name",
  grade: "Grade 5"
};

const classAttendance = [
  {
    id: 1,
    subject: 'Chess',
    teacher: 'Mr. Johnson',
    status: 'present',
    date: '08th Oct, 2024',
    time: '10:45 am',
    duration: '60 mins'
  },
  // ... more attendance records
];

const Stats = () => {
  // Calculate attendance statistics
  const attendanceStats = useMemo(() => {
    const total = classAttendance.length;
    const attended = classAttendance.filter(class_ => class_.status === 'present').length;
    const missed = classAttendance.filter(class_ => class_.status === 'absent').length;
    const remaining = total - (attended + missed);

    return {
      total,
      attended,
      missed,
      remaining
    };
  }, [classAttendance]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 max-w-2xl mx-auto">
      {/* Header Section */}
      <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-purple-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-white text-xl font-semibold">
              {studentData?.name?.charAt(0) || 'S'}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{studentData?.name || 'Student Name'}</h2>
              <p className="text-sm text-gray-600">{studentData?.grade || 'Grade'}</p>
            </div>
          </div>
          <div className="text-sm text-purple-600 font-medium bg-white px-4 py-2 rounded-full shadow-sm">
            <Calendar className="w-4 h-4 inline-block mr-2" />
            Class Attendance
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="text-sm text-gray-600">Total Classes</div>
            <div className="text-2xl font-semibold text-gray-900">{attendanceStats.total}</div>
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="text-sm text-green-600">Attended</div>
            <div className="text-2xl font-semibold text-green-600">{attendanceStats.attended}</div>
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="text-sm text-red-600">Missed</div>
            <div className="text-2xl font-semibold text-red-600">{attendanceStats.missed}</div>
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="text-sm text-blue-600">Remaining</div>
            <div className="text-2xl font-semibold text-blue-600">{attendanceStats.remaining}</div>
          </div>
        </div>
      </div>

      {/* Attendance List */}
      <div className="p-6 max-h-80 overflow-y-auto">
        <div className="space-y-4">
          {classAttendance.map((class_) => (
            <div 
              key={class_.id} 
              className={`p-4 rounded-lg border ${
                class_.status === 'present' 
                  ? 'border-green-100 bg-green-50' 
                  : 'border-red-100 bg-red-50'
              } transition-all duration-200 hover:shadow-md`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <GraduationCap className={`w-5 h-5 ${
                    class_.status === 'present' ? 'text-green-600' : 'text-red-600'
                  }`} />
                  <span className="font-medium text-gray-900">{class_.subject}</span>
                </div>
                {class_.status === 'present' ? (
                  <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                    <CheckCircle className="w-4 h-4" />
                    Present
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-red-600 text-sm font-medium">
                    <XCircle className="w-4 h-4" />
                    Absent
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {class_.date}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {class_.time}
                </div>
                <div className="text-gray-500">({class_.duration})</div>
              </div>
              
              <div className="text-sm text-gray-600 mt-2">
                Teacher: {class_.teacher}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="m-5 pt-6 border-t border-gray-100 text-center">
        <button className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors duration-200">
          View Full Attendance History
        </button>
      </div>
    </div>
  );
};

export default Stats;