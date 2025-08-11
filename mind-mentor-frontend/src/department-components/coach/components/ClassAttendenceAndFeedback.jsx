import { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  User,
  BookOpen,
  GraduationCap,
  MessageCircle,
  Users,
  UserCheck,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  addFeedbackAndAttandance,
  getClassData,
} from "../../../api/service/employee/coachService";
import { toast, ToastContainer } from "react-toastify";

const ClassAttendanceAndFeedback = () => {
  const navigate = useNavigate();
  const empId = localStorage.getItem("empId");
  const { classId } = useParams();
  const [classDetails, setClassDetails] = useState({});

  // Available levels for students
  const availableLevels = [
    "Absolute Beginner",
    "Lower Beginner",
    "Upper Beginner",
    "Lower Intermediate",
    "Upper Intermediate",
    "Advanced",
  ];

  useEffect(() => {
    const fetchclassData = async () => {
      const response = await getClassData(classId);
      console.log(response);
      if (response.status === 200) {
        setClassDetails(response.data.ClassScheduleData);
      }
    };
    fetchclassData();
  }, []);

  const [attendance, setAttendance] = useState({});
  const [individualFeedback, setIndividualFeedback] = useState({});
  const [studentLevelUpdates, setStudentLevelUpdates] = useState({});
  const [overallClassFeedback, setOverallClassFeedback] = useState("");
  const [showIndividualFeedbackInput, setShowIndividualFeedbackInput] =
    useState({});
  const [showLevelUpdateInput, setShowLevelUpdateInput] = useState({});
  const [showOverallFeedback, setShowOverallFeedback] = useState(false);

  const toggleAttendance = (studentId) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: !prev[studentId],
    }));
  };

  const handleLevelUpdate = (studentId, newLevel) => {
    setStudentLevelUpdates((prev) => ({
      ...prev,
      [studentId]: newLevel,
    }));
  };

  // Function to check if demo student requirements are met
  const isDemoStudentComplete = (studentId) => {
    const hasFeedback = individualFeedback[studentId]?.trim();
    const hasLevelUpdate = studentLevelUpdates[studentId];
    return hasFeedback && hasLevelUpdate;
  };

  // Function to get incomplete demo students
  const getIncompleteDemoStudents = () => {
    const demoStudents = classDetails?.demoAssignedKid || [];
    return demoStudents.filter(
      (student) => !isDemoStudentComplete(student.kidId)
    );
  };

  const handleSubmit = async () => {
    // Check if all demo students have required fields
    const incompleteDemoStudents = getIncompleteDemoStudents();

    if (incompleteDemoStudents.length > 0) {
      const studentNames = incompleteDemoStudents
        .map((s) => s.kidName)
        .join(", ");
      toast.error(
        `Please provide both feedback and level update for demo students: ${studentNames}`
      );
      return;
    }

    // Combine selected students and demo students
    const allStudents = [
      ...(classDetails?.selectedStudents || []),
      ...(classDetails?.demoAssignedKid || []),
    ];

    const submissionData = allStudents.map((student) => ({
      studentId: student.kidId,
      studentName: student.kidName,
      present: attendance[student.kidId] || false,
      feedback: individualFeedback[student.kidId] || "",
      levelUpdate: studentLevelUpdates[student.kidId] || null,
      studentType: classDetails?.selectedStudents?.find(
        (s) => s.kidId === student.kidId
      )
        ? "regular"
        : "demo",
    }));

    // Add overall class feedback to submission
    const finalSubmissionData = {
      students: submissionData,
      overallClassFeedback: overallClassFeedback,
      classId: classId,
      coachId: empId,
    };

    console.log("Submission data:", finalSubmissionData);

    const response = await addFeedbackAndAttandance(
      empId,
      classId,
      finalSubmissionData
    );
    console.log(response);
    if (response.status === 201) {
      toast.success(response.data.message);
      setTimeout(() => {
        navigate("/coachScheduleClass");
      }, 1500);
    }
  };

  // Get all students (regular + demo)
  const allStudents = [
    ...(classDetails?.selectedStudents || []),
    ...(classDetails?.demoAssignedKid || []),
  ];

  const regularStudentsCount = classDetails?.selectedStudents?.length || 0;
  const demoStudentsCount = classDetails?.demoAssignedKid?.length || 0;

  const renderStudentCard = (student, isDemo = false) => {
    const isComplete = isDemo ? isDemoStudentComplete(student.kidId) : true;

    return (
      <div
        key={student.kidId}
        className={`bg-white p-4 rounded-lg shadow border ${
          isDemo ? "border-green-200" : "border-blue-200"
        } ${
          !isComplete ? "ring-2 ring-red-200" : ""
        } transition-shadow hover:shadow-md`}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-2 h-2 ${
                isDemo ? "bg-green-500" : "bg-blue-500"
              } rounded-full`}
            ></div>
            <h4 className="text-lg font-semibold">{student.kidName}</h4>
            <span
              className={`text-xs ${
                isDemo
                  ? "bg-green-100 text-green-800"
                  : "bg-blue-100 text-blue-800"
              } px-2 py-1 rounded-full`}
            >
              {isDemo ? "Demo" : "Regular"}
            </span>
            {student.currentLevel && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                Current: {student.currentLevel}
              </span>
            )}
            {isDemo && !isComplete && (
              <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Required
              </span>
            )}
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => toggleAttendance(student.kidId)}
              className={`px-4 py-2 rounded-md text-white transition-colors ${
                attendance[student.kidId]
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-gray-600 hover:bg-gray-700"
              }`}
            >
              {attendance[student.kidId] ? "Present" : "Mark As Present"}
            </button>

            <button
              onClick={() =>
                setShowIndividualFeedbackInput((prev) => ({
                  ...prev,
                  [student.kidId]: !prev[student.kidId],
                }))
              }
              className={`px-4 py-2 rounded-md border ${
                isDemo && !individualFeedback[student.kidId]?.trim()
                  ? "border-red-300 text-red-600 bg-red-50"
                  : "border-gray-300 hover:bg-gray-50"
              } flex items-center gap-2`}
            >
              <MessageCircle className="w-4 h-4" />
              Feedback{isDemo && " *"}
            </button>
            <button
              onClick={() =>
                setShowLevelUpdateInput((prev) => ({
                  ...prev,
                  [student.kidId]: !prev[student.kidId],
                }))
              }
              className={`px-4 py-2 rounded-md border flex items-center gap-2 ${
                isDemo && !studentLevelUpdates[student.kidId]
                  ? "border-red-300 text-red-600 bg-red-50"
                  : "border-indigo-300 text-indigo-600 hover:bg-indigo-50"
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Update Level{isDemo && " *"}
            </button>
          </div>
        </div>

        {/* Individual Feedback Input */}
        {showIndividualFeedbackInput[student.kidId] && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Individual Feedback{isDemo && " (Required)"}
              {isDemo && <span className="text-red-500 ml-1">*</span>}
            </label>
            <textarea
              className={`w-full p-2 border rounded-md focus:ring-2 focus:border-transparent ${
                isDemo && !individualFeedback[student.kidId]?.trim()
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-300 focus:ring-indigo-500"
              }`}
              rows="3"
              placeholder={`Enter individual feedback for ${
                student.kidName
              }...${isDemo ? " (This is mandatory for demo students)" : ""}`}
              value={individualFeedback[student.kidId] || ""}
              onChange={(e) =>
                setIndividualFeedback((prev) => ({
                  ...prev,
                  [student.kidId]: e.target.value,
                }))
              }
            />
            {isDemo && !individualFeedback[student.kidId]?.trim() && (
              <p className="text-red-500 text-sm mt-1">
                Feedback is required for demo students
              </p>
            )}
          </div>
        )}

        {/* Level Update Input */}
        {showLevelUpdateInput[student.kidId] && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Update Student Level{isDemo ? " (Required)" : " (Optional)"}
              {isDemo && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select
              className={`w-full p-2 border rounded-md focus:ring-2 focus:border-transparent ${
                isDemo && !studentLevelUpdates[student.kidId]
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-300 focus:ring-indigo-500"
              }`}
              value={studentLevelUpdates[student.kidId] || ""}
              onChange={(e) => handleLevelUpdate(student.kidId, e.target.value)}
            >
              <option value="">
                {isDemo
                  ? "-- Select New Level (Required) --"
                  : "-- Select New Level (Optional) --"}
              </option>
              {availableLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
            {isDemo && !studentLevelUpdates[student.kidId] && (
              <p className="text-red-500 text-sm mt-1">
                Level update is required for demo students
              </p>
            )}
            {studentLevelUpdates[student.kidId] && (
              <div className="mt-2 p-2 bg-indigo-50 rounded text-sm">
                <span className="text-indigo-700">
                  Level will be updated to:{" "}
                  <strong>{studentLevelUpdates[student.kidId]}</strong>
                </span>
                {!isDemo && (
                  <button
                    onClick={() => handleLevelUpdate(student.kidId, "")}
                    className="ml-2 text-indigo-600 hover:text-indigo-800 underline"
                  >
                    Clear
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-center text-indigo-900 mb-2">
            Class Attendance & Feedback
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

          {/* Student Count Summary */}
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <div className="flex flex-wrap justify-center items-center gap-6">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium">
                  Regular Students: {regularStudentsCount}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium">
                  Demo Students: {demoStudentsCount}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                <span className="text-sm font-medium">
                  Total Students: {allStudents.length}
                </span>
              </div>
            </div>
          </div>

          {/* Overall Class Feedback Section */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-gray-700">
                Overall Class Feedback
              </h3>
              <button
                onClick={() => setShowOverallFeedback(!showOverallFeedback)}
                className="px-4 py-2 rounded-md border border-indigo-300 text-indigo-600 hover:bg-indigo-50 flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                {showOverallFeedback ? "Hide" : "Add"} Overall Feedback
              </button>
            </div>

            {showOverallFeedback && (
              <div className="bg-indigo-50 p-4 rounded-lg">
                <textarea
                  className="w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  rows="4"
                  placeholder="Enter overall feedback for the entire class (e.g., class performance, topics covered, general observations)..."
                  value={overallClassFeedback}
                  onChange={(e) => setOverallClassFeedback(e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Regular Students Section */}
          {regularStudentsCount > 0 && (
            <div className="space-y-4 mb-8">
              <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Regular Students ({regularStudentsCount})
              </h3>
              {classDetails?.selectedStudents?.map((student) =>
                renderStudentCard(student, false)
              )}
            </div>
          )}

          {/* Demo Students Section */}
          {demoStudentsCount > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-green-600" />
                Demo Students ({demoStudentsCount})
                <span className="text-sm text-red-600 font-normal">
                  * Feedback & Level Update Required
                </span>
              </h3>
              {classDetails?.demoAssignedKid?.map((student) =>
                renderStudentCard(student, true)
              )}
            </div>
          )}

          {/* No Students Message */}
          {allStudents.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No students assigned to this class yet.</p>
            </div>
          )}
        </div>

        <div className="p-6 border-t">
          <button
            onClick={handleSubmit}
            disabled={allStudents.length === 0}
            className="w-full py-3 bg-primary hover:bg-primary disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-md transition-colors font-medium"
          >
            Submit Attendance & Feedback
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
        style={{ marginTop: "60px" }}
      />
    </div>
  );
};

export default ClassAttendanceAndFeedback;
