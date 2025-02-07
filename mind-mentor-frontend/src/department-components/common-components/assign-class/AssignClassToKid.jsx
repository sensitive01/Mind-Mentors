import React, { useState } from 'react';
import { Calendar, Clock, User, X } from 'lucide-react';

const AssignClassToKid = () => {
  // Dummy data for available classes
  const dummyClasses = [
    {
      id: 1,
      day: 'Monday',
      time: '09:00 AM',
      teacher: 'John Smith',
      subject: 'Mathematics',
      level: 'Intermediate',
      capacity: 15,
      enrolled: 8
    },
    {
      id: 2,
      day: 'Tuesday',
      time: '02:00 PM',
      teacher: 'Sarah Wilson',
      subject: 'Science',
      level: 'Beginner',
      capacity: 12,
      enrolled: 5
    },
    {
      id: 3,
      day: 'Wednesday',
      time: '11:00 AM',
      teacher: 'Mike Johnson',
      subject: 'English',
      level: 'Advanced',
      capacity: 10,
      enrolled: 7
    },
    {
      id: 4,
      day: 'Thursday',
      time: '03:30 PM',
      teacher: 'Emma Davis',
      subject: 'Coding',
      level: 'Intermediate',
      capacity: 8,
      enrolled: 4
    }
  ];

  const [selectedClasses, setSelectedClasses] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleClassSelection = (classItem) => {
    if (selectedClasses.find(item => item.id === classItem.id)) {
      setSelectedClasses(selectedClasses.filter(item => item.id !== classItem.id));
    } else {
      setSelectedClasses([...selectedClasses, classItem]);
    }
  };

  const handleConfirm = () => {
    if (selectedClasses.length > 0) {
      setShowPopup(true);
    }
  };

  const removeSelectedClass = (classId) => {
    setSelectedClasses(selectedClasses.filter(item => item.id !== classId));
  };

  const filteredClasses = dummyClasses.filter(classItem =>
    classItem.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    classItem.teacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
    classItem.day.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Class Assignment</h1>
          <p className="text-gray-600">Select multiple classes to assign</p>
        </div>

        {/* Search and Selected Classes */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by subject, teacher, or day..."
            className="w-full p-2 border rounded-lg mb-4"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {selectedClasses.length > 0 && (
            <div className="bg-white p-4 rounded-lg shadow mb-4">
              <h2 className="text-lg font-semibold mb-2">Selected Classes ({selectedClasses.length})</h2>
              <div className="flex flex-wrap gap-2">
                {selectedClasses.map((classItem) => (
                  <div key={classItem.id} className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                    <span className="text-sm">{classItem.subject} - {classItem.day}</span>
                    <button
                      onClick={() => removeSelectedClass(classItem.id)}
                      className="ml-2 text-blue-700 hover:text-blue-900"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Available Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClasses.map((classItem) => (
            <div
              key={classItem.id}
              onClick={() => handleClassSelection(classItem)}
              className={`cursor-pointer p-4 rounded-lg transition-all ${
                selectedClasses.find(item => item.id === classItem.id)
                  ? 'bg-blue-50 border-2 border-blue-500'
                  : 'bg-white border border-gray-200 hover:border-blue-500'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <span className="font-semibold text-lg">{classItem.subject}</span>
                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {classItem.level}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="text-sm">{classItem.day}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="text-sm">{classItem.time}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <User className="w-4 h-4 mr-2" />
                  <span className="text-sm">{classItem.teacher}</span>
                </div>
                
                <div className="text-sm text-gray-600">
                  {classItem.enrolled}/{classItem.capacity} Students
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Confirm Button */}
        <div className="fixed bottom-4 right-4">
          <button
            onClick={handleConfirm}
            disabled={selectedClasses.length === 0}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Confirm Selection ({selectedClasses.length})
          </button>
        </div>

        {/* Confirmation Popup */}
        {showPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">Confirm Class Selection</h2>
              <div className="space-y-3 mb-6">
                {selectedClasses.map((classItem) => (
                  <div key={classItem.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{classItem.subject}</p>
                      <p className="text-sm text-gray-600">
                        {classItem.day} at {classItem.time}
                      </p>
                    </div>
                    <span className="text-sm text-gray-600">{classItem.teacher}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowPopup(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    alert('Classes assigned successfully!');
                    setShowPopup(false);
                    setSelectedClasses([]);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignClassToKid;