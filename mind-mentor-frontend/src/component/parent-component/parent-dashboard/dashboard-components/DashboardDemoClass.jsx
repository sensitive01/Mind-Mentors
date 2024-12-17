import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  AlertCircle,
  Users,
  BookOpenText,
  Video,
  RefreshCw,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { getDemoClass } from "../../../../api/service/parent/ParentService";

const DashboardDemoClass = () => {
  const { id } = useParams();
  const parentId = localStorage.getItem("parentId");
  const navigate = useNavigate();

  const [demoClass, setDemoClass] = useState(null);
  const [error, setError] = useState(null);
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    const fetchDemoClass = async () => {
      try {
        const response = await getDemoClass( id);
        setDemoClass(response.data.classDetails);
        console.log(response);
      } catch (err) {
        console.log("Error in getting demo class", err);
        setError("Failed to fetch demo class details");
      }
    };

    fetchDemoClass();
  }, [parentId, id]);

  const handleRequestDemo = () => {
    console.log("Requesting demo class");
    navigate(`/parent/kid/demo-class-shedule/${id}`);
  };

  const handleJoinClass = async () => {
    try {
      setIsJoining(true);
      // Implement your join class logic here
      // This might involve calling a service method to get the meeting link
      // For example:
      // const response = await joinDemoClass(parentId, id);
      // const meetingLink = response.data.meetingLink;
      // window.open(meetingLink, '_blank');

      // Placeholder for demonstration
      alert("Joining class - implement actual join logic");
    } catch (err) {
      console.error("Error joining class", err);
      setError("Failed to join the class");
    } finally {
      setIsJoining(false);
    }
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
              {demoClass ? "Upcoming Demo Class" : "No Demo Class Scheduled"}
            </h2>
          </div>

          <div className="p-6">
            {demoClass ? (
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

                <div className="border-t border-gray-100 pt-6 mt-6">
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

                {demoClass.selectedStudents &&
                  demoClass.selectedStudents.length > 0 && (
                    <div className="border-t border-gray-100 pt-6 mt-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="bg-indigo-50 p-2 rounded-lg">
                          <Users className="w-5 h-5 text-indigo-500" />
                        </div>
                        <p className="text-sm text-gray-500">
                          Enrolled Students
                        </p>
                      </div>
                      <div className="space-y-2">
                        {demoClass.selectedStudents.map((student) => (
                          <div
                            key={student.kidId}
                            className="bg-gray-50 p-3 rounded-lg"
                          >
                            <p className="text-gray-700">{student.kidName}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

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
            ) : (
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
                  className="bg-primary text-white py-2 px-6 rounded-lg transition-transform duration-200 shadow-[0px_8px_15px_rgba(0,0,0,0.4)] hover:shadow-[0px_12px_24px_rgba(0,0,0,0.5)] transform hover:translate-y-[-2px]"
                >
                  Request Demo Class
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardDemoClass;
