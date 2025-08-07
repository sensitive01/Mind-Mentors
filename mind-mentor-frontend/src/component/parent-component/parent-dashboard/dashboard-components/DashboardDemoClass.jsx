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
  HelpCircle,
  X,
  ChevronRight,
  User,
  Key,
  Monitor,
  Smartphone,
  Navigation,
  GraduationCap,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { getDemoClass } from "../../../../api/service/parent/ParentService";
import kidLoginPage from "../../../../assets/kidlogin.png";
import kidPinPage from "../../../../assets/kidPinPage.png";

const DashboardDemoClass = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [demoClass, setDemoClass] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showGuide, setShowGuide] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [kidData, setKidData] = useState({});

  useEffect(() => {
    const fetchDemoClass = async () => {
      try {
        setLoading(true);
        const response = await getDemoClass(id);
        console.log("response", response);
        if (response.status === 200) {
          setDemoClass(response.data.data);
          setKidData(response.data.kidData);
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

  const handleEnrollNow = () => {
    navigate(`/parent-package-selection/${demoClass.kidId}`);
  };

  const handleOpenMap = () => {
    window.open("https://maps.app.goo.gl/hiZ5And16YiociXQ6?g_st=ipc", "_blank");
  };

  const handleNavigateToLogin = () => {
    const mmid = kidData?.chessId || "";
    const baseUrl = import.meta.env.VITE_BASE_ROUTE;
    const loginUrl = `/kids/login?mmid=${mmid}`;
    window.open(loginUrl, "_blank");
    setShowGuide(false);
  };

  const guideSteps = [
    {
      title: "Your Child's Login Details",
      content: (
        <div className="space-y-3">
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">Chess Kid ID:</p>
            <p className="font-bold text-blue-800 text-lg">
              {kidData?.chessId || "Loading..."}
            </p>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">PIN:</p>
            <p className="font-bold text-purple-800 text-lg">
              {kidData?.kidPin || "Loading..."}
            </p>
          </div>
        </div>
      ),
      icon: <Key className="w-8 h-8 text-blue-600" />,
      animation: "🔑",
    },
    {
      title: "Enter Chess Kid ID",
      content: (
        <div className="space-y-3">
          <p className="text-sm text-gray-600 mb-3">
            Type your Chess Kid ID in the MMID field
          </p>
          <div className="bg-gray-100 p-4 rounded-lg">
            <img
              src={kidLoginPage}
              alt="MMID Input Field"
              className="w-full rounded border"
            />
          </div>
        </div>
      ),
      icon: <User className="w-8 h-8 text-green-600" />,
      animation: "⌨️",
    },
    {
      title: "Enter PIN Code",
      content: (
        <div className="space-y-3">
          <p className="text-sm text-gray-600 mb-3">
            Type your PIN in the password field
          </p>
          <div className="bg-gray-100 p-4 rounded-lg">
            <img
              src={kidPinPage}
              alt="PIN Input Field"
              className="w-full rounded border"
            />
          </div>
        </div>
      ),
      icon: <Key className="w-8 h-8 text-purple-600" />,
      animation: "🔐",
    },
    {
      title: "Join Your Class",
      content: "Click 'Join Class' button when it appears on your dashboard",
      icon: <Video className="w-8 h-8 text-red-600" />,
      animation: "🎥",
    },
  ];

  const nextStep = () => {
    if (currentStep < guideSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleNavigateToLogin();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const GuideModal = () => {
    const step = guideSteps[currentStep];

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-sm w-full p-6 relative max-h-[90vh] overflow-y-auto">
          <button
            onClick={() => setShowGuide(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Avatar */}
          <div className="text-center mb-6">
            <div className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center mb-4 animate-bounce">
              <span className="text-3xl">{step.animation}</span>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              {step.title}
            </h3>
            <div className="text-gray-600 text-sm font-medium">
              {typeof step.content === "string" ? (
                <p>{step.content}</p>
              ) : (
                step.content
              )}
            </div>
          </div>

          {/* Progress */}
          <div className="flex justify-center mb-6">
            <div className="flex space-x-1">
              {guideSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentStep
                      ? "bg-blue-500 scale-125"
                      : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                currentStep === 0
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-blue-600 hover:bg-blue-50"
              }`}
            >
              Previous
            </button>

            {currentStep === guideSteps.length - 1 ? (
              <button
                onClick={handleNavigateToLogin}
                className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 text-sm font-medium"
              >
                Go to Login
              </button>
            ) : (
              <button
                onClick={nextStep}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 text-sm font-medium"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const AttendanceInstructions = () => {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center animate-pulse">
              <span className="text-xl">🤖</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                Need Help Joining?
              </h3>
              <p className="text-sm text-gray-600">
                Click here for step-by-step guide
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowGuide(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 font-medium shadow-lg"
          >
            Show Me How
          </button>
        </div>
      </div>
    );
  };

  const renderScheduledClass = () => {
    return (
      <>
        {demoClass.type !== "offline" && <AttendanceInstructions />}
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
                    <p className="text-sm font-medium text-gray-500">
                      Schedule
                    </p>
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

              {/* Map Section for Offline Classes */}
              {demoClass.type === "offline" && (
                <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="text-base font-semibold text-gray-800">
                          Visit Our Center
                        </h4>
                        <p className="text-sm text-gray-600">
                          Get directions to the academy
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleOpenMap}
                      className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center space-x-2 text-sm font-medium"
                    >
                      <Navigation className="w-4 h-4" />
                      <span>Open Map</span>
                    </button>
                  </div>
                </div>
              )}
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
            </div>
          </div>
        </div>
      </>
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

            {/* Enrollment Call-to-Action */}
            <div className="mt-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎉</span>
                </div>
                <h4 className="text-lg font-bold text-gray-800 mb-2">
                  Great Job!
                </h4>
                <p className="text-gray-600 text-sm mb-4">
                  Your demo class was successfully completed. Ready to continue
                  your learning journey?
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Status & Enrollment Card */}
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

            {/* Enroll Now Button */}
            <button
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-sm"
              onClick={handleEnrollNow}
            >
              <GraduationCap className="w-5 h-5" />
              <span>Enroll Now</span>
            </button>
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

      {showGuide && <GuideModal />}
    </div>
  );
};

export default DashboardDemoClass;
