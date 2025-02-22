import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Calendar,
  AlertCircle,
  Users,
  BookOpenText,
  Video,
  RefreshCw,
  Check,

  Clock,
  
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { getDemoClass } from "../../../../api/service/parent/ParentService";

const DashboardDemoClass = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [demoClass, setDemoClass] = useState(null);
  const [error, setError] = useState(null);
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    const fetchDemoClass = async () => {
      try {
        const response = await getDemoClass(id);
        if (response.data.combinedData && response.data.combinedData.status === "Conducted") {
          setDemoClass(response.data.combinedData);
        } else {
          setDemoClass(response.data.classDetails);
        }
      } catch (err) {
        console.log("Error in getting demo class", err);

      }
    };

    fetchDemoClass();
  }, [id]);

  const handleRequestDemo = () => {
    navigate(`/parent/kid/demo-class-shedule/${id}`);
  };

  const renderConductedClass = () => {
    const { classDetails, student } = demoClass;
    return (
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Info Card */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800">Class Details</h3>
          </div>
          <div className="p-6">
            <div className="grid sm:grid-cols-2 gap-6 mb-6">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-50 p-3 rounded-xl">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Schedule</p>
                  <p className="text-gray-800 font-medium mt-1">{classDetails.day}</p>
                  <p className="text-gray-600 text-sm">{classDetails.classTime}</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-purple-50 p-3 rounded-xl">
                  <BookOpenText className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Program</p>
                  <p className="text-gray-800 font-medium mt-1">{classDetails.program}</p>
                  <p className="text-gray-600 text-sm">Level: {classDetails.level}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-green-50 p-3 rounded-xl">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Coach</p>
                <p className="text-gray-800 font-medium mt-1">{classDetails.coachName}</p>
                <p className="text-gray-600 text-sm">Expert Instructor</p>
              </div>
            </div>
          </div>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800">Class Status</h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="bg-green-50 p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-600">Status</p>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  {demoClass.status}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Attendance</p>
                <div className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-gray-800 font-medium">{student.attendance}</span>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Feedback</p>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-gray-700">{student.feedback}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderUpcomingClass = () => {
    return (
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Info Card */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800">Upcoming Class Details</h3>
          </div>
          <div className="p-6">
            <div className="grid sm:grid-cols-2 gap-6 mb-6">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-50 p-3 rounded-xl">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Schedule</p>
                  <p className="text-gray-800 font-medium mt-1">{demoClass.day}</p>
                  <p className="text-gray-600 text-sm">{demoClass.classTime}</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-purple-50 p-3 rounded-xl">
                  <BookOpenText className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Program</p>
                  <p className="text-gray-800 font-medium mt-1">{demoClass.program}</p>
                  <p className="text-gray-600 text-sm">Level: {demoClass.level}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-green-50 p-3 rounded-xl">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Coach</p>
                <p className="text-gray-800 font-medium mt-1">{demoClass.coachName}</p>
                <p className="text-gray-600 text-sm">Expert Instructor</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Card */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800">Quick Actions</h3>
          </div>
          <div className="p-6 space-y-4">
            <button
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-sm"
              disabled={isJoining}
              onClick={() => {
                window.location.href = demoClass.meetingLink;
              }}
            >
              <Video className="w-5 h-5" />
              <span>{isJoining ? "Joining..." : "Join Class"}</span>
            </button>

            <button
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-sm"
              onClick={handleRequestDemo}
            >
              <RefreshCw className="w-5 h-5" />
              <span>Reschedule Class</span>
            </button>

            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <h4 className="font-medium text-gray-800 mb-3">Guidelines</h4>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2 text-gray-600 text-sm">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Join 5 minutes early</span>
                </li>
                <li className="flex items-center space-x-2 text-gray-600 text-sm">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Check internet connection</span>
                </li>
                <li className="flex items-center space-x-2 text-gray-600 text-sm">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Keep materials ready</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderNoClass = () => (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center max-w-md px-4">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
            <Clock className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-3">
          No Demo Class Scheduled
        </h3>
        <p className="text-gray-600 mb-6">
          Ready to begin your learning journey? Schedule a demo class with our
          experienced coaches at your preferred time.
        </p>
        <button
          onClick={handleRequestDemo}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 inline-flex items-center space-x-2"
        >
          <Calendar className="w-5 h-5" />
          <span className="font-medium">Schedule Demo Class</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/parent/kid/attendance/:id")}
              className="p-2 hover:bg-gray-50 rounded-lg transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-semibold text-gray-800">
              {!demoClass
                ? "Demo Class"
                : demoClass.status === "Conducted"
                ? "Completed Demo Class"
                : "Upcoming Demo Class"}
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-xl">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {!demoClass
          ? renderNoClass()
          : demoClass.status === "Conducted"
          ? renderConductedClass()
          : renderUpcomingClass()}
      </div>
    </div>
  );
};

export default DashboardDemoClass;