// AssignClasses.js
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Calendar,
  Clock,
  User,
  Users,
  Tag,
  BookOpen,
  CheckCircle,
  GraduationCap,
  AlertTriangle,
  History
} from "lucide-react";
import { toast } from "react-toastify";
import { getClassandStudentData, saveClassDetails } from "../../../api/service/employee/serviceDeliveryService";

const InfoCard = ({ icon: Icon, label, value, color = "text-purple-600" }) => (
  <div className="flex items-center space-x-2 bg-white p-3 rounded-lg shadow-sm">
    <Icon className={`${color} w-5 h-5`} />
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-semibold text-gray-900">{value}</p>
    </div>
  </div>
);

const EmptyState = ({ icon: Icon, title, message }) => (
  <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-sm">
    <Icon className="w-12 h-12 text-gray-400 mb-4" />
    <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
    <p className="text-gray-500 text-center">{message}</p>
  </div>
);

const AssignClasses = () => {
  const navigate = useNavigate();
  const empId = localStorage.getItem("empId");
  const { id } = useParams();
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [classData, setClassData] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequiredClassStudentData = async () => {
      try {
        setLoading(true);
        const response = await getClassandStudentData(id);
        console.log(response)
        setClassData(response?.data?.classData);
        setStudents(response?.data?.unselectedKids || []);
      } catch (error) {
        console.error("Error fetching class and student data:", error);
        toast.error("Failed to fetch class data");
      } finally {
        setLoading(false);
      }
    };
    fetchRequiredClassStudentData();
  }, [id]);

  const handleStudentSelection = (student) => {
    setSelectedStudents(prev => {
      const isSelected = prev.some(s => s.kidId === student.kidId);
      return isSelected ? prev.filter(s => s.kidId !== student.kidId) : [...prev, student];
    });
  };

  const handleSaveAssignments = async () => {
    try {
      const studentIds = selectedStudents.map(student => student.kidId);
      const response = await saveClassDetails(id, studentIds, empId);
      if (response.status === 200) {
        toast.success(response.data.message);
        setTimeout(() => navigate("/serviceScheduleClass"), 1500);
      }
    } catch (error) {
      toast.error("Failed to save assignments");
    }
  };

  const handleViewLogs = (logId, e) => {
    e.stopPropagation(); // Prevent student selection when clicking the logs icon
    navigate(`/service-delivary/completeEnquiryLogs/${logId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-purple-600 mb-2">Student Class Assign Dashboard</h1>
          <p className="text-gray-600">Assign students to available classes</p>
        </div>

        {!classData && (
          <EmptyState 
            icon={AlertTriangle}
            title="No Class Data Available"
            message="There is no class information available for this selection."
          />
        )}

        {classData && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-purple-600 mb-4">Class Information</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <InfoCard icon={Calendar} label="Day" value={classData.day} />
                    <InfoCard icon={Clock} label="Time" value={classData.classTime} />
                    <InfoCard icon={User} label="Coach" value={classData.coachName} />
                    <InfoCard icon={Users} label="Students" value={`${classData.students || 0} Enrolled`} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <InfoCard icon={BookOpen} label="Program" value={classData.program} />
                  <InfoCard icon={Tag} label="Level" value={classData.level} />
                </div>

                {classData.selectedStudents?.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">Currently Enrolled Students</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {classData.selectedStudents.map((student, idx) => (
                        <div key={idx} className="flex items-center space-x-2 p-2 bg-purple-50 rounded-lg">
                          <GraduationCap className="w-4 h-4 text-purple-500" />
                          <span className="text-sm text-gray-700">{student.kidName}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
                <h2 className="text-xl font-semibold text-purple-600 mb-4">Select Students</h2>
                
                {students.length === 0 ? (
                  <div className="text-center py-8">
                    <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No students available for assignment</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2 max-h-96 overflow-y-auto mb-4">
                      {students.map((student) => (
                        <div
                          key={student.kidId}
                          className={`flex items-center justify-between p-3 rounded-lg
                            ${selectedStudents.some(s => s.kidId === student.kidId)
                              ? 'bg-purple-50 border-purple-200'
                              : 'bg-gray-50 hover:bg-gray-100'
                            }`}
                        >
                          <div 
                            className="flex items-center space-x-3 flex-grow cursor-pointer"
                            onClick={() => handleStudentSelection(student)}
                          >
                            <GraduationCap className={`w-5 h-5 ${
                              selectedStudents.some(s => s.kidId === student.kidId)
                                ? 'text-purple-600'
                                : 'text-gray-400'
                            }`} />
                            <span className="font-medium text-gray-700">{student.kidFirstName}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={(e) => handleViewLogs(student._id, e)}
                              className="p-2 hover:bg-purple-100 rounded-full transition-colors"
                              title="View Logs"
                            >
                              <History className="w-5 h-5 text-purple-600" />
                            </button>
                            {selectedStudents.some(s => s.kidId === student.kidId) && (
                              <CheckCircle className="w-5 h-5 text-purple-600" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-sm text-gray-600">
                          {selectedStudents.length} students selected
                        </span>
                      </div>
                      <button
                        onClick={handleSaveAssignments}
                        disabled={selectedStudents.length === 0}
                        className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg
                          hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed
                          transition-colors duration-200"
                      >
                        Confirm Assignments
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignClasses;