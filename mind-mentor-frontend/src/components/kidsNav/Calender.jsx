import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, User } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { fetchkidClassData } from '../../api/service/parent/ParentService';

const ParentClassSchedule = () => {
  const { id } = useParams();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState('month');
  const [classSchedule, setClassSchedule] = useState({});

  const formatDateKey = (day) => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    return `${year}-${month}-${formattedDay}`;
  };

  const formatDisplayDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    const fetchKidClass = async () => {
      try {
        const response = await fetchkidClassData(id);
        console.log(response)
        const formattedSchedule = {};
        
        // Process conducted classes
        response?.data?.responseData?.conducted.forEach(cls => {
          const conductedDate = new Date(cls.conductedDate);
          const dateKey = conductedDate.toISOString().split('T')[0];
          
          if (!formattedSchedule[dateKey]) {
            formattedSchedule[dateKey] = [];
          }
          
          formattedSchedule[dateKey].push({
            id: cls._id,
            title: cls.classData.program,
            time: cls.classData.classTime,
            instructor: cls.classData.coachName,
            status: 'completed',
            child: cls.student.name,
            location: `Level: ${cls.classData.level}`,
            attendance: cls.student.attendance,
            feedback: cls.student.feedback,
            meetingLink: cls.classData.meetingLink,
            actualDate: dateKey
          });
        });

        // Process live classes
        response?.data?.responseData?.live.forEach(cls => {
          const today = new Date();
          const dateKey = today.toISOString().split('T')[0];
          
          if (!formattedSchedule[dateKey]) {
            formattedSchedule[dateKey] = [];
          }
          
          formattedSchedule[dateKey].push({
            id: cls._id,
            title: cls.program,
            time: cls.classTime,
            instructor: cls.coachName,
            status: 'live',
            child: cls.selectedStudents.map(student => student.kidName).join(', '),
            location: `Level: ${cls.level}`,
            meetingLink: cls.meetingLink,
            actualDate: dateKey
          });
        });

        // Process upcoming classes
        response?.data?.responseData?.upcoming.forEach(cls => {
          const dayMapping = { 'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 'Thursday': 4, 'Friday': 5, 'Saturday': 6 };
          const targetDay = dayMapping[cls.day];
          const today = new Date();
          const daysUntilTarget = (targetDay + 7 - today.getDay()) % 7;
          const targetDate = new Date(today);
          targetDate.setDate(today.getDate() + daysUntilTarget);
          const dateKey = targetDate.toISOString().split('T')[0];

          if (!formattedSchedule[dateKey]) {
            formattedSchedule[dateKey] = [];
          }

          formattedSchedule[dateKey].push({
            id: cls._id,
            title: cls.program,
            time: cls.classTime,
            instructor: cls.coachName,
            status: 'upcoming',
            child: cls.selectedStudents.map(student => student.kidName).join(', '),
            location: `Level: ${cls.level}`,
            meetingLink: cls.meetingLink,
            actualDate: dateKey
          });
        });

        console.log('Formatted Schedule:', formattedSchedule);
        setClassSchedule(formattedSchedule);
      } catch (error) {
        console.error('Error fetching class data:', error);
      }
    };

    fetchKidClass();
  }, [id]);

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const generateCalendarDays = () => {
    const start = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const end = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const days = [];
    const padding = start.getDay();

    for (let i = 0; i < padding; i++) {
      days.push(null);
    }

    for (let i = 1; i <= end.getDate(); i++) {
      days.push(i);
    }

    return days;
  };

  const getClassesForDate = (dateKey) => {
    return classSchedule[dateKey] || [];
  };

  const handleDateClick = (day) => {
    if (day) {
      const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day+1);
      console.log(newDate)
      
      setSelectedDate(newDate);
      const dateKey = formatDateKey(day);
      console.log('Selected date key:', dateKey);
      console.log('Classes for this date:', getClassesForDate(dateKey));
    }
  };

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case 'live':
        return 'bg-green-100 text-green-800 border-l-4 border-green-500';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 border-l-4 border-blue-500';
      case 'completed':
        return 'bg-gray-100 text-gray-800 border-l-4 border-gray-500';
      default:
        return 'bg-gray-100 text-gray-800 border-l-4 border-gray-500';
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-xl">
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-6 rounded-t-lg">
        <div className="flex justify-between items-center text-white mb-6">
          <div className="flex items-center space-x-4">
            <Calendar className="w-6 h-6" />
            <h1 className="text-2xl font-semibold">Class Schedule</h1>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-white/80">
              <Clock className="w-5 h-5" />
              <span>{formatDisplayDate(selectedDate)}</span>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => setView('month')} 
                className={`px-3 py-1 rounded-md transition-colors ${view === 'month' ? 'bg-white text-indigo-600' : 'text-white hover:bg-white/10'}`}
              >
                Month
              </button>
              <button 
                onClick={() => setView('week')} 
                className={`px-3 py-1 rounded-md transition-colors ${view === 'week' ? 'bg-white text-indigo-600' : 'text-white hover:bg-white/10'}`}
              >
                Week
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button 
              onClick={handlePreviousMonth}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-medium">
              {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
            </h2>
            <button 
              onClick={handleNextMonth}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      <div className="border-b">
        <div className="grid grid-cols-7 bg-gray-50">
          {daysOfWeek.map(day => (
            <div key={day} className="p-4 text-center text-gray-700 font-medium border-r last:border-r-0">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7">
          {generateCalendarDays().map((day, index) => {
            const dateKey = day ? formatDateKey(day) : null;
            const classes = dateKey ? getClassesForDate(dateKey) : [];
            const isSelected = day === selectedDate.getDate() && 
                             currentDate.getMonth() === selectedDate.getMonth() &&
                             currentDate.getFullYear() === selectedDate.getFullYear();
            const isToday = day === new Date().getDate() && 
                          currentDate.getMonth() === new Date().getMonth() &&
                          currentDate.getFullYear() === new Date().getFullYear();

            return (
              <div
                key={index}
                onClick={() => handleDateClick(day)}
                className={`min-h-[120px] p-2 border-t border-r relative cursor-pointer transition-colors
                  ${!day ? 'bg-gray-50' : 'hover:bg-indigo-50'}
                  ${isSelected ? 'bg-indigo-50' : ''}
                  ${isToday ? 'bg-yellow-50' : ''}`}
              >
                {day && (
                  <>
                    <span className={`inline-flex items-center justify-center w-8 h-8 mb-1
                      ${isSelected ? 'bg-indigo-600 text-white rounded-full' : ''}
                      ${isToday && !isSelected ? 'bg-yellow-400 text-white rounded-full' : ''}`}
                    >
                      {day}
                    </span>
                    <div className="space-y-1">
                      {classes.map(cls => (
                        <div
                          key={cls.id}
                          className={`text-xs p-2 rounded-lg ${getStatusStyles(cls.status)}`}
                        >
                          <div className="font-medium">{cls.title}</div>
                          <div className="text-xs opacity-75">{cls.time}</div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Classes on {formatDisplayDate(selectedDate)}
        </h3>
        
        <div className="space-y-4">
          {getClassesForDate(selectedDate.toISOString().split('T')[0]).map(cls => (
            <div
              key={cls.id}
              className={`p-4 rounded-lg ${getStatusStyles(cls.status)}`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-lg">{cls.title}</h4>
                <span className={`px-3 py-1 text-sm rounded-full ${
                  cls.status === 'live' ? 'bg-green-100 text-green-800' :
                  cls.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {cls.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="w-4 h-4" />
                    <span>{cls.time}</span>
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <User className="w-4 h-4" />
                    <span>{cls.instructor}</span>
                  </div>
                  <div>{cls.location}</div>
                </div>

                <div>
                  <div className="mb-2">
                    <strong>Student:</strong> {cls.child}
                  </div>
                  {cls.status === 'completed' && (
                    <>
                      <div className="mb-2">
                        <strong>Attendance:</strong> {cls.attendance}
                      </div>
                      <div>
                        <strong>Feedback:</strong> {cls.feedback}
                      </div>
                    </>
                  )}
                  {(cls.status === 'live' || cls.status === 'upcoming') && (
                    <div>
                      <strong>Meeting Link:</strong>{' '}
                      <a 
                        href={cls.meetingLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Join Class
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ParentClassSchedule;