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
  MessageSquare
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
        setError("Failed to fetch demo class details");
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
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-50 p-2 rounded-lg">
              <Calendar className="w-5 h-5 text-indigo-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Day & Time</p>
              <p className="text-gray-700">
                {classDetails.day} ({classDetails.classTime})
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-50 p-2 rounded-lg">
              <BookOpenText className="w-5 h-5 text-indigo-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Program</p>
              <p className="text-gray-700">
                {classDetails.program} ({classDetails.level})
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500">Coach</p>
              <p className="text-gray-700 font-medium">
                {classDetails.coachName}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="text-gray-700 font-medium">
                {demoClass.status}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Attendance Details</h3>
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Check className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">Attendance Status:</span>
              </div>
              <span className="font-medium text-gray-900">{student.attendance}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-blue-500" />
                <span className="text-gray-700">Feedback:</span>
              </div>
              <span className="font-medium text-gray-900">{student.feedback}</span>
            </div>
          </div>
        </div>

        {/* <div className="flex justify-end mt-6">
          <button
            onClick={handleRequestDemo}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center"
          >
            <RefreshCw className="mr-2 w-5 h-5" />
            Schedule Another Demo
          </button>
        </div> */}
      </div>
    );
  };

  const renderUpcomingClass = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-50 p-2 rounded-lg">
              <Calendar className="w-5 h-5 text-indigo-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Day & Time</p>
              <p className="text-gray-700">
                {demoClass.day} ({demoClass.classTime})
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-50 p-2 rounded-lg">
              <BookOpenText className="w-5 h-5 text-indigo-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Program</p>
              <p className="text-gray-700">
                {demoClass.program} ({demoClass.level})
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500">Coach</p>
              <p className="text-gray-700 font-medium">
                {demoClass.coachName}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="text-gray-700 font-medium">
                {demoClass.status}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <button
            className="flex-1 flex items-center justify-center bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors duration-200"
            disabled={isJoining}
            onClick={() => {
              window.location.href = demoClass.meetingLink;
            }}
          >
            <Video className="mr-2 w-5 h-5" />
            {isJoining ? "Joining..." : "Join Class"}
          </button>

          <button
            className="flex-1 flex items-center justify-center bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-200"
            onClick={handleRequestDemo}
          >
            <RefreshCw className="mr-2 w-5 h-5" />
            Reschedule
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate("/parent/kid/attendance/:id")}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800">
              {!demoClass ? "No Demo Class Scheduled" : 
                demoClass.status === "Conducted" ? "Completed Demo Class" : "Upcoming Demo Class"}
            </h2>
          </div>

          <div className="p-6">
            {!demoClass ? (
              <div className="text-center py-8">
                <div className="mb-4 bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Demo Class Scheduled
                </h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  Would you like to schedule a demo class? Our team will help
                  you find the perfect time slot.
                </p>
                <button
                  onClick={handleRequestDemo}
                  className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition-colors duration-200"
                >
                  Request Demo Class
                </button>
              </div>
            ) : demoClass.status === "Conducted" ? (
              renderConductedClass()
            ) : (
              renderUpcomingClass()
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardDemoClass;