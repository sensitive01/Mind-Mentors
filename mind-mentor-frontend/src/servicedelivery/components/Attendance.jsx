import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Coffee, PieChart, Sun, UserCheck, UserX } from 'lucide-react';
import React, { useState } from 'react';

const AttendanceCalendar = () => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [hoveredDate, setHoveredDate] = useState(null);
  const [activeTab, setActiveTab] = useState('summary');
  const [attendanceData, setAttendanceData] = useState({
    // Format: 'YYYY-MM-DD': status
    '2024-11-15': 'present',
    '2024-11-16': 'absent',
    '2024-11-17': 'leave',
    '2024-11-18': 'holiday',
  });

  // Calculate today's date string in YYYY-MM-DD format
  const today = new Date();
  const todayString = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
  // Check if today's attendance is already marked
  const isAttendanceMarked = attendanceData[todayString] === 'present';
  // Track statistics state
  const [statistics, setStatistics] = useState({
    summary: {
      totalWorkingDays: 30,
      present: 28,
      absent: 2,
      leave: 1,
      holiday: 4,
      attendance: '92%',
    },
    leaves: [
      { date: '2024-11-17', type: 'Sick Leave', status: 'Approved' },
      { date: '2024-11-25', type: 'Casual Leave', status: 'Pending' },
    ],
    upcomingHolidays: [
      { date: '2024-11-23', name: 'Thanksgiving' },
      { date: '2024-12-25', name: 'Christmas' },
    ]
  });

  const handleMarkAttendance = () => {
    // Update attendance data
    setAttendanceData(prev => ({
      ...prev,
      [todayString]: 'present'
    }));

    // Update statistics
    setStatistics(prev => ({
      ...prev,
      summary: {
        ...prev.summary,
        present: prev.summary.present + 1,
        attendance: `${((prev.summary.present + 1) / prev.summary.totalWorkingDays * 100).toFixed(0)}%`
      }
    }));
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 hover:bg-green-200 border-green-300';
      case 'absent':
        return 'bg-red-100 hover:bg-red-200 border-red-300';
      case 'leave':
        return 'bg-yellow-100 hover:bg-yellow-200 border-yellow-300';
      case 'holiday':
        return 'bg-blue-100 hover:bg-blue-200 border-blue-300';
      default:
        return 'bg-gray-50 hover:bg-white border-gray-200';
    }
  };

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const generateCalendarDays = (year, month) => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const handlePreviousMonth = () => {
    if (selectedMonth === 0) {
      setCurrentYear(prev => prev - 1);
      setSelectedMonth(11);
    } else {
      setSelectedMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setCurrentYear(prev => prev + 1);
      setSelectedMonth(0);
    } else {
      setSelectedMonth(prev => prev + 1);
    }
  };

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className={`bg-white rounded-lg p-4 shadow-md border-l-4 ${color} transform transition-all duration-300 hover:scale-105`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <Icon className={`w-8 h-8 ${color.replace('border', 'text')}`} />
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Calendar Section */}
        <div className="lg:w-2/3">
        {!isAttendanceMarked && selectedMonth === today.getMonth() && currentYear === today.getFullYear() && (
            <div className="mb-4 bg-white rounded-lg p-4 shadow-md border-l-4 border-[#642b8f]">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <UserCheck className="w-6 h-6 text-[#642b8f]" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Mark Today's Attendance</h3>
                    <p className="text-sm text-gray-600">Record your attendance for {new Date().toLocaleDateString()}</p>
                  </div>
                </div>
                <button
                  onClick={handleMarkAttendance}
                  className="px-4 py-2 bg-[#642b8f] text-white rounded-lg hover:bg-['642b8f] transition-colors duration-200 flex items-center space-x-2"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Mark Present</span>
                </button>
              </div>
            </div>
          )}
          <div className="bg-white rounded-xl shadow-xl overflow-hidden transition-all duration-300 transform hover:scale-[1.01]">
            {/* Header */}
            <div className=" p-6" style={{background:"#642b8f"}}>
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center space-x-4">
                  <CalendarIcon className="w-8 h-8" />
                  <h1 className="text-2xl font-bold">Service Delivery Attendance</h1>
                </div>
                <div className="text-xl">{currentYear}</div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between p-4 border-b">
              <button
                onClick={handlePreviousMonth}
                className="p-2 rounded-full hover:bg-white transition-colors duration-200"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <h2 className="text-xl font-semibold">
                {months[selectedMonth]} {currentYear}
              </h2>
              <button
                onClick={handleNextMonth}
                className="p-2 rounded-full hover:bg-white transition-colors duration-200"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="p-4">
              <div className="grid grid-cols-7 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="text-center font-semibold text-gray-600 p-2">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {generateCalendarDays(currentYear, selectedMonth).map((day, index) => {
                  const dateString = day ? `${currentYear}-${(selectedMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}` : '';
                  const status = attendanceData[dateString] || 'none';
                  const isToday = dateString === todayString;

                  return (
                    <div
                      key={index}
                      className={`relative aspect-square ${day ? getStatusColor(status) : 'bg-transparent'} 
                        rounded-lg border transition-all duration-300 transform
                        ${day ? 'hover:scale-105' : ''}`}
                      onMouseEnter={() => setHoveredDate(dateString)}
                      onMouseLeave={() => setHoveredDate(null)}
                    >
                      {day && (
                        <>
                          <div className="absolute top-1 left-2 text-gray-700">
                            {day}
                          </div>
                          {isToday && !attendanceData[todayString] && (
                            <button
                              onClick={handleMarkAttendance}
                              className="absolute inset-0 flex items-center justify-center bg-green-500 bg-opacity-0 hover:bg-opacity-20 transition-all duration-300"
                            >
                              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                                Mark Attendance
                              </span>
                            </button>
                          )}
                          {hoveredDate === dateString && status !== 'none' && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="bg-white px-2 py-1 rounded-full text-sm shadow-lg capitalize">
                                {status}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Legend */}
            <div className="p-4 border-t">
              <div className="flex flex-wrap gap-4 justify-center">
                {[
                  { status: 'present', color: 'bg-green-100' },
                  { status: 'absent', color: 'bg-red-100' },
                  { status: 'leave', color: 'bg-yellow-100' },
                  { status: 'holiday', color: 'bg-blue-100' }
                ].map(({ status, color }) => (
                  <div key={status} className="flex items-center space-x-2">
                    <div className={`w-4 h-4 rounded ${color}`}></div>
                    <span className="text-sm capitalize">{status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Sidebar */}
        <div className="lg:w-1/3 space-y-6">
          {/* Stats Cards */}
                  
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {/* First Card - Full Width */}
            <div className="col-span-2">
              <StatCard 
                icon={UserCheck} 
                title="Present Days" 
                value={statistics.summary.present}
                color="border-green-500"
              />
            </div>

            {/* Second Card - Half Width */}
            <StatCard 
              icon={UserX} 
              title="Absent Days" 
              value={statistics.summary.absent}
              color="border-red-500"
            />

            {/* Third Card - Half Width */}
            <StatCard 
              icon={Coffee} 
              title="Leaves Taken" 
              value={statistics.summary.leave}
              color="border-yellow-500"
            />

            {/* Fourth Card - Full Width */}
            <div className="col-span-2">
              <StatCard 
                icon={Sun} 
                title="Holidays" 
                value={statistics.summary.holiday}
                color="border-blue-500"
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="flex border-b">
              {[
                { id: 'summary', icon: PieChart, label: 'Summary' },
                { id: 'leaves', icon: Coffee, label: 'Leaves' },
                { id: 'holidays', icon: Sun, label: 'Holidays' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-4 py-3 flex items-center justify-center space-x-2 transition-colors duration-200
                    ${activeTab === tab.id ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            <div className="p-4">
              {activeTab === 'summary' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Working Days</span>
                    <span className="font-semibold">{statistics.summary.totalWorkingDays}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Attendance Rate</span>
                    <span className="font-semibold text-green-600">{statistics.summary.attendance}</span>
                  </div>
                </div>
              )}

              {activeTab === 'leaves' && (
                <div className="space-y-3">
                  {statistics.leaves.map((leave, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div>
                        <p className="font-medium">{leave.type}</p>
                        <p className="text-sm text-gray-600">{leave.date}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-sm ${
                        leave.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {leave.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'holidays' && (
                <div className="space-y-3">
                  {statistics.upcomingHolidays.map((holiday, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="font-medium">{holiday.name}</span>
                      <span className="text-sm text-gray-600">{holiday.date}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceCalendar;