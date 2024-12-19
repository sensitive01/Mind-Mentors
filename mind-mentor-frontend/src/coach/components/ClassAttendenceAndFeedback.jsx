import { useState } from 'react';
import { Calendar, Clock, User, BookOpen, GraduationCap, MessageCircle } from 'lucide-react';

const ClassAttendanceAndFeedback = () => {
  const classDetails = {
    day: "Thursday",
    classTime: "4:00 PM - 5:00 PM",
    coachName: "Aswin",
    program: "Chess",
    level: "Beginner",
    classType: "Demo",
    selectedStudents: [
      {
        kidId: "6763bb5ea8aeed9b6d951a51",
        kidName: "Kid 2",
        _id: "6763bb70a8aeed9b6d951a70",
      }
      
    ],
  };

  const [attendance, setAttendance] = useState({});
  const [feedback, setFeedback] = useState({});
  const [showFeedbackInput, setShowFeedbackInput] = useState({});

  const toggleAttendance = (studentId) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: !prev[studentId],
    }));
  };

  const handleSubmit = () => {
    const submissionData = classDetails.selectedStudents.map((student) => ({
      studentId: student.kidId,
      studentName: student.kidName,
      present: attendance[student.kidId] || false,
      feedback: feedback[student.kidId] || "",
    }));
    console.log("Submission data:", submissionData);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-center text-indigo-900 mb-2">
            Class Attendance
          </h1>
          <div className="flex justify-center">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
              {classDetails.classType}
            </span>
          </div>
        </div>

        <div className="p-6">
          {/* Class Details in Single Row */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-900" />
                <span className="text-sm">{classDetails.day}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-900" />
                <span className="text-sm">{classDetails.classTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-900" />
                <span className="text-sm">Coach: {classDetails.coachName}</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-900" />
                <span className="text-sm">{classDetails.program}</span>
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-indigo-900" />
                <span className="text-sm">Level: {classDetails.level}</span>
              </div>
            </div>
          </div>

          {/* Students List */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">
              Students ({classDetails.selectedStudents.length})
            </h3>
            
            {classDetails.selectedStudents.map((student) => (
              <div
                key={student.kidId}
                className="bg-white p-4 rounded-lg shadow border transition-shadow hover:shadow-md"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h4 className="text-lg font-semibold">{student.kidName}</h4>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleAttendance(student.kidId)}
                      className={`px-4 py-2 rounded-md text-white transition-colors ${
                        attendance[student.kidId]
                          ? 'bg-green-600 hover:bg-green-700'
                          : 'bg-red-600 hover:bg-red-700'
                      }`}
                    >
                      {attendance[student.kidId] ? "Present" : "Absent"}
                    </button>
                    <button
                      onClick={() =>
                        setShowFeedbackInput((prev) => ({
                          ...prev,
                          [student.kidId]: !prev[student.kidId],
                        }))
                      }
                      className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Feedback
                    </button>
                  </div>
                </div>
                
                {showFeedbackInput[student.kidId] && (
                  <div className="mt-4">
                    <textarea
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      rows="3"
                      placeholder="Enter your feedback here..."
                      value={feedback[student.kidId] || ""}
                      onChange={(e) => setFeedback((prev) => ({
                        ...prev,
                        [student.kidId]: e.target.value,
                      }))}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 border-t">
          <button 
            onClick={handleSubmit}
            className="w-full py-2 bg-primary hover:bg-primary text-white rounded-md transition-colors"
          >
            Submit Attendance
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClassAttendanceAndFeedback;