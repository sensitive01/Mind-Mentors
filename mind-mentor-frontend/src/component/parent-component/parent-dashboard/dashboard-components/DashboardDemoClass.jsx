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
  MapPin,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { getDemoClass } from "../../../../api/service/parent/ParentService";

const DashboardDemoClass = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [demoClass, setDemoClass] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDemoClass = async () => {
      try {
        setLoading(true);
        const response = await getDemoClass(id);
        if (response.status === 200) {
          setDemoClass(response.data.data);
        } 
 
      } catch (err) {
        console.log("Error in getting demo class", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDemoClass();
  }, [id]);

  const handleReschedule = () => {
    navigate(`/parent/kid/demo-class-shedule/${id}`);
  };

  const renderScheduledClass = () => {
    return (
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Info Card */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800">
              Demo Class Details
            </h3>
          </div>
          <div className="p-6">
            <div className="grid sm:grid-cols-2 gap-6 mb-6">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-50 p-3 rounded-xl">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Schedule</p>
                  <p className="text-gray-800 font-medium mt-1">
                    {demoClass.date}
                  </p>
                  <p className="text-gray-600 text-sm">{demoClass.time}</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-purple-50 p-3 rounded-xl">
                  <BookOpenText className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Program</p>
                  <p className="text-gray-800 font-medium mt-1">
                    {demoClass.program}
                  </p>
                  <p className="text-gray-600 text-sm">
                    Level: {demoClass.level}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 mb-6">
              <div className="flex items-start space-x-4">
                <div className="bg-green-50 p-3 rounded-xl">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Coach</p>
                  <p className="text-gray-800 font-medium mt-1">
                    {demoClass.coachName}
                  </p>
                  <p className="text-gray-600 text-sm">Expert Instructor</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-orange-50 p-3 rounded-xl">
                  {demoClass.type === "offline" ? (
                    <MapPin className="w-6 h-6 text-orange-600" />
                  ) : (
                    <Video className="w-6 h-6 text-orange-600" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Class Type
                  </p>
                  <p className="text-gray-800 font-medium mt-1 capitalize">
                    {demoClass.type}
                  </p>
                  {demoClass.type === "offline" && demoClass.centerName && (
                    <p className="text-gray-600 text-sm">
                      {demoClass.centerName}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status & Action Card */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800">
              Class Status
            </h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="bg-blue-50 p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-600">Status</p>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {demoClass.status}
                </span>
              </div>
            </div>

            {/* Reschedule Button */}
            <button
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-sm"
              onClick={handleReschedule}
            >
              <RefreshCw className="w-5 h-5" />
              <span>Reschedule Class</span>
            </button>

            {/* Schedule Information */}
            <div className="mt-6 p-4 bg-blue-50 rounded-xl">
              <h4 className="font-medium text-gray-800 mb-3">
                Schedule Information
              </h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Every class happens at a minimum schedule of 1 hour and your
                final schedule will be assigned by the service delivery team as
                per your child's convenient timings.
              </p>
            </div>

            {/* Guidelines */}
            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <h4 className="font-medium text-gray-800 mb-3">Guidelines</h4>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2 text-gray-600 text-sm">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>
                    {demoClass.type === "offline"
                      ? "Arrive 10 minutes early"
                      : "Join 5 minutes early"}
                  </span>
                </li>
                <li className="flex items-center space-x-2 text-gray-600 text-sm">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>
                    {demoClass.type === "offline"
                      ? "Bring required materials"
                      : "Check internet connection"}
                  </span>
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

  const renderConductedClass = () => {
    return (
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Info Card */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800">
              Class Details
            </h3>
          </div>
          <div className="p-6">
            <div className="grid sm:grid-cols-2 gap-6 mb-6">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-50 p-3 rounded-xl">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Schedule</p>
                  <p className="text-gray-800 font-medium mt-1">
                    {demoClass.date}
                  </p>
                  <p className="text-gray-600 text-sm">{demoClass.time}</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-purple-50 p-3 rounded-xl">
                  <BookOpenText className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Program</p>
                  <p className="text-gray-800 font-medium mt-1">
                    {demoClass.program}
                  </p>
                  <p className="text-gray-600 text-sm">
                    Level: {demoClass.level}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-green-50 p-3 rounded-xl">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Coach</p>
                <p className="text-gray-800 font-medium mt-1">
                  {demoClass.coachName}
                </p>
                <p className="text-gray-600 text-sm">Expert Instructor</p>
              </div>
            </div>
          </div>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800">
              Class Status
            </h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="bg-green-50 p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-600">Status</p>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  Completed
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">
                  Class Completion
                </p>
                <div className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-gray-800 font-medium">
                    Successfully Completed
                  </span>
                </div>
              </div>
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
          onClick={handleReschedule}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 inline-flex items-center space-x-2"
        >
          <Calendar className="w-5 h-5" />
          <span className="font-medium">Schedule Demo Class</span>
        </button>

        {/* Schedule Information for No Class state */}
        <div className="mt-6 p-4 bg-blue-50 rounded-xl">
          <p className="text-gray-600 text-sm leading-relaxed">
            Every class happens at a minimum schedule of 1 hour and your final
            schedule will be assigned by the service delivery team as per your
            child's convenient timings.
          </p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading demo class details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
          : renderScheduledClass()}
      </div>
    </div>
  );
};

export default DashboardDemoClass;
