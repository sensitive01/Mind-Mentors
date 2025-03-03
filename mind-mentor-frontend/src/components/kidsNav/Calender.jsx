import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, User, MapPin, Video, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { fetchkidClassData } from '../../api/service/parent/ParentService';

const ClassScheduleCalendar = ({ classData }) => {
  const {id}  =useParams()
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [viewMode, setViewMode] = useState('month');

  useEffect(() => {
    const fetchClassData = async()=>{
      const response = await fetchkidClassData(id)
      console.log(response)
      if (response.status==200) {
        const allSessions = response.data.classData[0].generatedSchedule.map(session => ({
          ...session,
          parsedDate: new Date(session.classDate)
        }));
        setSessions(allSessions);
      }

    }
    fetchClassData()
    // Process the class data when it's available

  }, [classData]);

  useEffect(() => {
    // Filter sessions for the selected date
    const dateString = selectedDate.toISOString().split('T')[0];
    const filteredSessions = sessions.filter(session => {
      const sessionDate = new Date(session.classDate).toISOString().split('T')[0];
      return sessionDate === dateString;
    });
    setFilteredSessions(filteredSessions);
  }, [selectedDate, sessions]);

  const daysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const getPreviousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const getNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const handleDateClick = (day) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(newDate);
  };

  const getSessionsForDate = (year, month, day) => {
    const dateString = new Date(year, month, day).toISOString().split('T')[0];
    return sessions.filter(session => {
      const sessionDate = new Date(session.classDate).toISOString().split('T')[0];
      return sessionDate === dateString;
    });
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-400';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-400';
      case 'rescheduled':
        return 'bg-amber-100 text-amber-800 border-amber-400';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-400';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return <Calendar className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'rescheduled':
        return <AlertCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const renderCalendarDays = () => {
    const days = [];
    const totalDays = daysInMonth(currentDate.getFullYear(), currentDate.getMonth());
    const firstDay = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-24 bg-gray-50 border border-gray-200 p-1"></div>
      );
    }

    // Add cells for each day of the month
    for (let day = 1; day <= totalDays; day++) {
      const dateSessions = getSessionsForDate(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );
      
      const isToday = new Date().setHours(0, 0, 0, 0) === 
                      new Date(currentDate.getFullYear(), currentDate.getMonth(), day).setHours(0, 0, 0, 0);
      
      const isSelected = selectedDate.getDate() === day && 
                        selectedDate.getMonth() === currentDate.getMonth() && 
                        selectedDate.getFullYear() === currentDate.getFullYear();

      days.push(
        <div 
          key={day} 
          className={`h-24 border border-gray-200 p-1 overflow-hidden transition-colors hover:bg-indigo-50 cursor-pointer
                    ${isToday ? 'bg-blue-50' : ''}
                    ${isSelected ? 'bg-indigo-100 border-indigo-400 border-2' : ''}`}
          onClick={() => handleDateClick(day)}
        >
          <div className="flex justify-between items-center mb-1">
            <span className={`text-sm font-medium rounded-full w-6 h-6 flex items-center justify-center
                            ${isToday ? 'bg-blue-500 text-white' : ''}
                            ${isSelected ? 'bg-indigo-600 text-white' : ''}`}>
              {day}
            </span>
            {dateSessions.length > 0 && (
              <span className="text-xs font-medium bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded-full">
                {dateSessions.length}
              </span>
            )}
          </div>
          <div className="space-y-1 overflow-hidden max-h-16">
            {dateSessions.slice(0, 2).map((session, index) => (
              <div 
                key={session._id || index} 
                className={`text-xs p-1 rounded truncate border-l-2 ${getStatusColor(session.status)}`}
              >
                {session.startTime} - {session.type}
              </div>
            ))}
            {dateSessions.length > 2 && (
              <div className="text-xs text-gray-500 font-medium">
                +{dateSessions.length - 2} more
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const formatSessionDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden">
      {/* Calendar Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Class Schedule</span>
          </h2>
          <div className="flex space-x-2">
            <button 
              onClick={() => setViewMode('month')}
              className={`px-3 py-1 rounded ${viewMode === 'month' ? 'bg-white text-indigo-600' : 'bg-indigo-500'}`}
            >
              Month
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded ${viewMode === 'list' ? 'bg-white text-indigo-600' : 'bg-indigo-500'}`}
            >
              List
            </button>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <button onClick={getPreviousMonth} className="p-1 hover:bg-indigo-500 rounded">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-medium text-lg">{months[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
            <button onClick={getNextMonth} className="p-1 hover:bg-indigo-500 rounded">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <div className="text-sm">
            Selected: {selectedDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="bg-gray-50 px-6 py-2 border-b flex items-center space-x-4 text-sm">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span>Scheduled</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span>Completed</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
          <span>Rescheduled</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span>Cancelled</span>
        </div>
      </div>

      {viewMode === 'month' ? (
        <>
          {/* Calendar Grid */}
          <div className="grid grid-cols-7">
            {daysOfWeek.map(day => (
              <div key={day} className="py-2 text-center font-medium text-gray-700 border-b border-gray-200 bg-gray-50">
                {day}
              </div>
            ))}
            {renderCalendarDays()}
          </div>
        </>
      ) : (
        <div className="p-4 max-h-96 overflow-y-auto">
          {sessions.length > 0 ? (
            sessions.map(session => (
              <div 
                key={session._id} 
                className={`p-3 mb-2 rounded-lg border-l-4 ${getStatusColor(session.status)}`}
                onClick={() => setSelectedDate(new Date(session.classDate))}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">Session {session.sessionNumber}</div>
                    <div className="text-sm text-gray-600">{formatSessionDate(session.classDate)}</div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(session.status)}`}>
                    {getStatusIcon(session.status)}
                    <span>{session.status}</span>
                  </div>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span>{session.startTime}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span>{session.coach}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 flex items-center justify-center">
                      {session.type === 'online' ? <Video className="w-4 h-4 text-gray-500" /> : <MapPin className="w-4 h-4 text-gray-500" />}
                    </div>
                    <span className="capitalize">{session.type}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-6 text-gray-500">
              No sessions found for the selected period
            </div>
          )}
        </div>
      )}

      {/* Selected Date Details */}
      <div className="border-t border-gray-200 p-4">
        <h3 className="font-medium text-lg mb-3">
          {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </h3>

        {filteredSessions.length > 0 ? (
          <div className="space-y-4">
            {filteredSessions.map(session => (
              <div 
                key={session._id} 
                className={`p-4 rounded-lg border-l-4 shadow-sm ${getStatusColor(session.status)}`}
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Session {session.sessionNumber}</h4>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(session.status)}`}>
                    {getStatusIcon(session.status)}
                    <span>{session.status}</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span>{session.startTime}</span>
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span>{session.coach}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {session.type === 'online' ? (
                        <>
                          <Video className="w-4 h-4 text-gray-500" />
                          <span>Online Class</span>
                        </>
                      ) : (
                        <>
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span>In-person Class</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">Day:</span> {session.day}
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">Session ID:</span> {session.sessionId}
                    </div>
                    {session.type === 'online' && (
                      <div>
                        <button className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
                          Join Session
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">No classes scheduled for this date</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassScheduleCalendar;