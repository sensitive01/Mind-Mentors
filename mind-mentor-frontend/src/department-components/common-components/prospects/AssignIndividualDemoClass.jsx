import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Calendar,
  Clock,
  User,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  GraduationCap,
  BookOpen,
  Star,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import {
  getDemoClassandStudentData,
  saveDemoClassDetails,
} from "../../../api/service/employee/EmployeeService";

const AssignIndividualDemoClass = () => {
  const navigate = useNavigate();
  const empId = localStorage.getItem("empId");
  const { enqId, classId } = useParams();
  const [classData, setClassData] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchRequiredClassStudentData = async () => {
      try {
        const response = await getDemoClassandStudentData(enqId);
        setClassData(response?.data?.classData);
        setStudents(response?.data?.kidsData);
      } catch (error) {
        console.error("Error fetching class and student data:", error);
      }
    };
    fetchRequiredClassStudentData();
  }, []);

  const handleSaveAssignments = async () => {
    console.log(students);
    if (!selectedClass) {
      toast.error("Please select a class first");
      return;
    }

    try {
      const response = await saveDemoClassDetails(
        selectedClass._id,
        students.kidId,
        empId
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        setTimeout(() => navigate("/operation/department/prospects"), 1500);
      }
    } catch (error) {
      toast.error("Failed to save assignments");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-purple-800 mb-2">
            Demo Class Assignment
          </h1>
          <p className="text-gray-600">
            Schedule a demo class for your student
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Class Selection */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-purple-100">
              <div className="flex items-center space-x-3">
                <Calendar className="w-6 h-6 text-purple-600" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Available Classes
                </h2>
              </div>
            </div>

            <div className="p-6">
              <div className="relative">
                <div
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`w-full p-4 border-2 rounded-xl cursor-pointer flex justify-between items-center transition-all duration-200 ${
                    isDropdownOpen
                      ? "border-purple-500 ring-2 ring-purple-100"
                      : "border-gray-200 hover:border-purple-300"
                  }`}
                >
                  {selectedClass ? (
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-5 h-5 text-purple-600" />
                        <span className="font-medium">{selectedClass.day}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Clock className="w-5 h-5 text-purple-600" />
                        <span>{selectedClass.classTime}</span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-500">
                      Choose a class time...
                    </span>
                  )}
                  {isDropdownOpen ? (
                    <ChevronUp className="w-5 h-5 text-purple-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-purple-600" />
                  )}
                </div>

                {isDropdownOpen && (
                  <div className="absolute z-20 w-full mt-2 bg-white border rounded-xl shadow-xl max-h-64 overflow-y-auto">
                    {classData.map((classItem) => (
                      <div
                        key={classItem._id}
                        onClick={() => {
                          setSelectedClass(classItem);
                          setIsDropdownOpen(false);
                        }}
                        className="p-4 hover:bg-purple-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-3">
                              <Calendar className="w-5 h-5 text-purple-600" />
                              <span className="font-medium">
                                {classItem.day}
                              </span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <Clock className="w-5 h-5 text-purple-600" />
                              <span>{classItem.classTime}</span>
                            </div>
                          </div>
                          {selectedClass?._id === classItem._id && (
                            <CheckCircle className="w-5 h-5 text-purple-600" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Student Details */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-purple-100">
              <div className="flex items-center space-x-3">
                <GraduationCap className="w-6 h-6 text-purple-600" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Student Profile
                </h2>
              </div>
            </div>

            <div className="p-6">
              <div className="bg-purple-50 rounded-xl p-6 mb-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-purple-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {students.kidFirstName}
                    </h3>
                    <p className="text-sm text-gray-600">Student</p>
                  </div>
                </div>

                {students?.programs?.map((program, index) => (
                  <div
                    key={program._id}
                    className="ml-2 space-y-3 border-l-2 border-purple-200 pl-4"
                  >
                    <div className="flex items-center space-x-3">
                      <BookOpen className="w-5 h-5 text-purple-600" />
                      <span className="text-gray-700">{program.program}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Star className="w-5 h-5 text-purple-600" />
                      <span className="text-gray-700">{program.level}</span>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleSaveAssignments}
                disabled={!selectedClass}
                className="w-full bg-purple-600 text-white py-4 px-6 rounded-xl
                  hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]
                  disabled:hover:scale-100 font-medium text-sm"
              >
                Confirm Class Assignment
              </button>
            </div>
          </div>
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
        style={{ marginTop: "60px" }} // Adjust the value as needed
      />
    </div>
  );
};

export default AssignIndividualDemoClass;
