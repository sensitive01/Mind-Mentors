import { useEffect, useState } from 'react';
import { Calendar, Clock, User, BookOpen, GraduationCap, MessageCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { addFeedbackAndAttandance, getClassData } from '../../api/service/employee/coachService';
import { toast, ToastContainer } from 'react-toastify';

const ClassAttendanceAndFeedback = () => {
  const navigate = useNavigate()
  const empId = localStorage.getItem("empId")
  const {classId} = useParams()
  const [classDetails,setClassDetails]  =useState({})

  useEffect(()=>{
    const fetchclassData = async()=>{
      const response= await getClassData(classId)
      console.log(response)
      if(response.status===200){
        setClassDetails(response.data.ClassScheduleData)
      }
    }
    fetchclassData()
  },[])
  

  const [attendance, setAttendance] = useState({});
  const [feedback, setFeedback] = useState({});
  const [showFeedbackInput, setShowFeedbackInput] = useState({});

  const toggleAttendance = (studentId) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: !prev[studentId],
    }));
  };

  const handleSubmit = async() => {
    const submissionData = classDetails?.selectedStudents?.map((student) => ({
      studentId: student.kidId,
      studentName: student.kidName,
      present: attendance[student.kidId] || false,
      feedback: feedback[student.kidId] || "",
    }));
    console.log("Submission data:", submissionData);
    const response = await addFeedbackAndAttandance(empId,classId,submissionData)
    console.log(response)
    if(response.status===201){
      toast.success(response.data.message)
      setTimeout(() => {
        navigate("/coachScheduleClass")
      }, 1500);
    }
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
              Students ({classDetails?.selectedStudents?.length})
            </h3>
            
            {classDetails?.selectedStudents?.map((student) => (
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
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        pauseOnFocusLoss
      />
    </div>
  );
};

export default ClassAttendanceAndFeedback;