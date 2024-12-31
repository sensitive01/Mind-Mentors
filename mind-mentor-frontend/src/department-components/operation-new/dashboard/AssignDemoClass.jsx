import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Calendar,
  Clock,
  User,
  Users,
  Tag,
  BookOpen,
  X,
  CheckCircle,
  GraduationCap
} from "lucide-react";
import { getDemoClassandStudentData, saveDemoClassDetails } from "../../../api/service/employee/EmployeeService";
import { toast } from "react-toastify";

const AssignDemoClass = () => {
  const navigate = useNavigate();
  const empId = localStorage.getItem("empId");
  const { id } = useParams();
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [classData, setClassData] = useState([]);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchRequiredClassStudentData = async () => {
      try {
        const response = await getDemoClassandStudentData(id);
        setClassData(response?.data?.classData);
        setStudents(response?.data?.kidsData);
      } catch (error) {
        console.error("Error fetching class and student data:", error);
      }
    };
    fetchRequiredClassStudentData();
  }, [id]);

  const handleStudentSelection = async (studentId) => {
    const updatedSelection = selectedStudents.includes(studentId)
      ? selectedStudents.filter(id => id !== studentId)
      : [...selectedStudents, studentId];
    
    setSelectedStudents(updatedSelection);
  };

  const handleSaveAssignments = async () => {
    try {
      const response = await saveDemoClassDetails(id, selectedStudents, empId);
      if (response.status === 200) {
        toast.success(response.data.message);
        setTimeout(() => navigate("/employee-operation/schedule"), 1500);
      }
    } catch (error) {
      toast.error("Failed to save assignments");
    }
  };

  const InfoCard = ({ icon: Icon, label, value, color = "text-purple-600" }) => (
    <div className="flex items-center space-x-2 bg-white p-3 rounded-lg shadow-sm">
      <Icon className={`${color} w-5 h-5`} />
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-purple-600 mb-2">Demo Class Assign</h1>
          <p className="text-gray-600">Assign students to available demo classes</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Class Details Section */}
          <div className="lg:col-span-2 space-y-6">
            {classData.map((classItem, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-purple-600 mb-4">
                    Class Information
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <InfoCard
                      icon={Calendar}
                      label="Day"
                      value={classItem.day}
                    />
                    <InfoCard
                      icon={Clock}
                      label="Time"
                      value={classItem.classTime}
                    />
                    <InfoCard
                      icon={User}
                      label="Coach"
                      value={classItem.coachName}
                    />
                    <InfoCard
                      icon={Users}
                      label="Students"
                      value={`${classItem.students || 0} Enrolled`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <InfoCard
                    icon={BookOpen}
                    label="Program"
                    value={classItem.program}
                  />
                  <InfoCard
                    icon={Tag}
                    label="Level"
                    value={classItem.level}
                  />
                </div>

                {classItem.selectedStudents?.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">
                      Currently Enrolled Students
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {classItem.selectedStudents.map((student, idx) => (
                        <div key={idx} className="flex items-center space-x-2 p-2 bg-purple-50 rounded-lg">
                          <GraduationCap className="w-4 h-4 text-purple-500" />
                          <span className="text-sm text-gray-700">{student.kidName}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Student Selection Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-purple-600 mb-4">
                Select Students
              </h2>
              
              <div className="space-y-2 max-h-[400px] overflow-y-auto mb-4">
                {students.map((student) => (
                  <div
                    key={student._id}
                    onClick={() => handleStudentSelection(student._id)}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors
                      ${selectedStudents.includes(student._id)
                        ? 'bg-purple-50 border-purple-200'
                        : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                  >
                    <div className="flex items-center space-x-3">
                      <GraduationCap className={`w-5 h-5 ${
                        selectedStudents.includes(student._id)
                          ? 'text-purple-600'
                          : 'text-gray-400'
                      }`} />
                      <span className="font-medium text-gray-700">
                        {student.kidFirstName}
                      </span>
                    </div>
                    {selectedStudents.includes(student._id) && (
                      <CheckCircle className="w-5 h-5 text-purple-600" />
                    )}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignDemoClass;