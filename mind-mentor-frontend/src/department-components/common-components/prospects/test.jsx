import { useEffect, useState } from "react";
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
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  getDemoClassandStudentData,
  getDemoClassById,
  getDemoSheduleClass,
  saveDemoClassDetails,
  cancelDemoClass,
  rescheduleDemoClass,
} from "../../../api/service/employee/EmployeeService";
import { toast, ToastContainer } from "react-toastify";
import AlertDialogBox from "../alertDialog/AlertDialogBox";

const AssignDemoClass = () => {
  const navigate = useNavigate();
  const empId = localStorage.getItem("empId");
  const department = localStorage.getItem("department");
  const { enqId, isSheduled } = useParams();
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [classData, setClassData] = useState([]);
  const [student, setStudent] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isSheduled === "true") {
          setIsEditing(true);
          const [demoClassResponse, availableClassesResponse] =
            await Promise.all([getDemoClassById(enqId), getDemoSheduleClass()]);

          setClassData(availableClassesResponse.data.scheduleData || []);

          const currentClass = demoClassResponse.data.classData[0];
          setSelectedClass(currentClass);

          // Set student data
          const studentData = demoClassResponse.data.kidsData;
          setStudent(studentData);

          // Auto-select the student by default (for editing mode)
          if (studentData && studentData.kidId) {
            setSelectedStudents([studentData.kidId]);
          }

          // Also set selected students from the current class if available
          if (currentClass?.selectedStudents && currentClass.selectedStudents.length > 0) {
            const existingStudentIds = currentClass.selectedStudents.map((student) => student.kidId);
            // Merge with the current student if not already included
            const allSelectedIds = studentData && studentData.kidId && !existingStudentIds.includes(studentData.kidId) 
              ? [...existingStudentIds, studentData.kidId]
              : existingStudentIds;
            setSelectedStudents(allSelectedIds);
          }
        } else {
          const response = await getDemoClassandStudentData(enqId);
          setClassData(response?.data?.classData || []);

          const studentData = response?.data?.kidsData;
          setStudent(studentData);

          // Auto-select the student by default (for new assignment mode)
          if (studentData && studentData.kidId) {
            setSelectedStudents([studentData.kidId]);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch data");
      }
    };
    fetchData();
  }, [enqId, isSheduled]);

  // Additional useEffect to ensure student is selected when student data is loaded
  useEffect(() => {
    if (student && student.kidId && selectedStudents.length === 0) {
      setSelectedStudents([student.kidId]);
    }
  }, [student]);

  const handleStudentSelection = (student) => {
    if (selectedStudents.includes(student.kidId)) {
      setSelectedStudents(
        selectedStudents.filter((id) => id !== student.kidId)
      );
    } else {
      setSelectedStudents([...selectedStudents, student.kidId]);
    }
  };

  const handleSaveAssignments = () => {
    console.log("Save assignemet");
    if (!selectedClass || selectedStudents.length === 0) {
      toast.warning("Please select both a class and students");
      return;
    }

    setConfirmationModal({
      isOpen: true,
      title: isEditing ? "Update Demo Class" : "Confirm Assignment",
      message: `Are you sure you want to ${
        isEditing ? "update" : "schedule"
      } this demo class?`,
      onConfirm: async () => {
        try {
          let response;
          if (isEditing) {
            console.log(
              "isediting",
              selectedClass._id,
              selectedStudents,
              empId
            );

            response = await rescheduleDemoClass(
              selectedClass._id,
              selectedStudents,
              empId
            );
          } else {
            console.log("Else");
            response = await saveDemoClassDetails(
              selectedClass._id,
              selectedStudents,
              empId
            );
          }

          if (response?.status === 200) {
            toast.success(
              isEditing
                ? "Demo class rescheduled successfully"
                : "Demo class scheduled successfully"
            );
            setTimeout(
              () => navigate(`/${department}/department/enrollment-data`),
              1500
            );
          }
        } catch (error) {
          toast.error(
            isEditing
              ? "Failed to reschedule demo class"
              : "Failed to save assignments"
          );
        } finally {
          setConfirmationModal({ ...confirmationModal, isOpen: false });
        }
      },
    });
  };

  const handleCancelDemoClass = () => {
    setConfirmationModal({
      isOpen: true,
      title: "Cancel Demo Class",
      message: "Are you sure you want to cancel this demo class?",
      onConfirm: async () => {
        try {
          const response = await cancelDemoClass(
            enqId,
            selectedClass._id,
            empId
          );
          if (response.status === 200) {
            toast.success("Demo class cancelled successfully");
            setTimeout(
              () => navigate(`/${department}/department/enrollment-data`),
              1500
            );
          }
        } catch (error) {
          toast.error("Failed to cancel demo class");
        } finally {
          setConfirmationModal({ ...confirmationModal, isOpen: false });
        }
      },
    });
  };

  const InfoCard = ({ icon: Icon, label, value, color = "text-primary" }) => (
    <div className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      <Icon className={`${color} w-4 h-4`} />
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-medium text-gray-900">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">
            {isEditing ? "Edit Demo Class" : "Demo Class Assignment"}
          </h1>
          <p className="text-sm text-gray-600">
            {isEditing
              ? "Modify demo class schedule"
              : "Schedule demo classes for students"}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Class Schedule
              </h2>

              <div className="relative mb-4">
                <div
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full p-3 border rounded-lg cursor-pointer flex justify-between items-center hover:border-blue-300 transition-all duration-200"
                >
                  {selectedClass ? (
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="text-sm font-medium">
                          {selectedClass.day}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="text-sm font-medium">
                          {selectedClass.classTime}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">
                      Select class schedules...
                    </span>
                  )}
                  {isDropdownOpen ? (
                    <ChevronUp className="w-4 h-4 text-primary" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-primary" />
                  )}
                </div>

                {isDropdownOpen && (
                  <div className="absolute z-20 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-64 overflow-y-auto">
                    {classData.map((classItem) => (
                      <div
                        key={classItem._id}
                        onClick={() => {
                          setSelectedClass(classItem);
                          setIsDropdownOpen(false);
                        }}
                        className={`p-3 cursor-pointer border-b last:border-b-0 transition-colors ${
                          selectedClass?._id === classItem._id
                            ? "bg-blue-50"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          {/* Left Section */}
                          <div className="flex items-center space-x-6 w-full">
                            {/* Day with Calendar Icon */}
                            <div className="flex items-center space-x-2 w-1/4">
                              <Calendar className="w-5 h-5 text-primary flex-shrink-0" />
                              <span className="text-sm font-medium text-gray-800 truncate">
                                {classItem.day}
                              </span>
                            </div>
                            {/* Time with Clock Icon */}
                            <div className="flex items-center space-x-2 w-1/4">
                              <Clock className="w-5 h-5 text-primary flex-shrink-0" />
                              <span className="text-sm font-medium text-gray-800 truncate">
                                {classItem.classTime}
                              </span>
                            </div>
                          </div>

                          {/* Right Section: Selected Indicator */}
                          {selectedClass?._id === classItem._id && (
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {selectedClass && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <InfoCard
                    icon={User}
                    label="Coach"
                    value={selectedClass.coachName}
                  />
                  <InfoCard
                    icon={Users}
                    label="Students"
                    value={`${
                      selectedClass.selectedStudents?.length || 0
                    } Enrolled`}
                  />
                  <InfoCard
                    icon={BookOpen}
                    label="Program"
                    value={selectedClass.program}
                  />
                  <InfoCard
                    icon={Tag}
                    label="Level"
                    value={selectedClass.level}
                  />
                </div>
              )}

              {selectedClass?.selectedStudents?.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Currently Enrolled Students
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedClass.selectedStudents.map((student) => (
                      <div
                        key={student.kidId}
                        className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md"
                      >
                        <GraduationCap className="w-4 h-4 text-blue-500" />
                        <span className="text-sm text-gray-700">
                          {student.kidName}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-4">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Select Student
              </h2>

              {student && (
                <div className="space-y-2 mb-4">
                  <div
                    onClick={() => handleStudentSelection(student)}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedStudents.includes(student.kidId)
                        ? "bg-blue-50 border-blue-200 border"
                        : "bg-gray-50 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <GraduationCap
                        className={`w-4 h-4 ${
                          selectedStudents.includes(student.kidId)
                            ? "text-primary"
                            : "text-gray-400"
                        }`}
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-700">
                          {student.kidFirstName}
                        </span>
                        <div className="text-xs text-gray-500">
                          {student.programs
                            .map((p) => `${p.program} - ${p.level}`)
                            .join(", ")}
                        </div>
                      </div>
                    </div>
                    {selectedStudents.includes(student.kidId) && (
                      <CheckCircle className="w-4 h-4 text-primary" />
                    )}
                  </div>
                </div>
              )}

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs text-gray-600">
                    {selectedStudents.length} student{selectedStudents.length !== 1 ? 's' : ''} selected
                  </span>
                </div>
                <div className="space-y-2">
                  <button
                    onClick={handleSaveAssignments}
                    disabled={!selectedClass || selectedStudents.length === 0}
                    className="w-full bg-primary text-white py-2 px-4 rounded-lg
                      text-sm font-medium
                      hover:bg-blue-700 
                      disabled:opacity-50 disabled:cursor-not-allowed
                      transition-colors duration-200"
                  >
                    {isEditing ? "Update Demo Class" : "Confirm Assignment"}
                  </button>

                  {isEditing && (
                    <button
                      onClick={handleCancelDemoClass}
                      className="w-full bg-red-500 text-white py-2 px-4 rounded-lg
                        text-sm font-medium
                        hover:bg-red-600
                        transition-colors duration-200"
                    >
                      Cancel Demo Class
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AlertDialogBox
        isOpen={confirmationModal.isOpen}
        onClose={() =>
          setConfirmationModal({ ...confirmationModal, isOpen: false })
        }
        onConfirm={confirmationModal.onConfirm}
        title={confirmationModal.title}
        message={confirmationModal.message}
      />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        pauseOnFocusLoss
        style={{ marginTop: "60px" }}
      />
    </div>
  );
};

export default AssignDemoClass;