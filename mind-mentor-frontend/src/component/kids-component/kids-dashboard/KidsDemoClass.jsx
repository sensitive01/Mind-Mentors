import  { useState, useEffect } from "react";
import axios from "axios";
import {
  Calendar,
  Clock,
  Video,
  Award,
  Target,
  Star,
  Rocket,
  ExternalLink,
  User,
  MapPin,
  Users,
} from "lucide-react";
import { getMyTodayClassData } from "../../../api/service/kid/KidService";

const KidsDemoClass = () => {
  const kidId = localStorage.getItem("kidId");
  const [classData, setClassData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [kidName, setKidName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getMyTodayClassData(kidId);
        setClassData(response.data.data);
        setKidName(response.data.kidName);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching class data:", err);
        setError("Failed to load class information");
        setLoading(false);
      }
    };
    fetchData();
  }, [kidId]);

  const handleJoinClass = async (classItem) => {
    try {
      console.log("kid link",classItem)
      const urlParts = classItem.kidJoinUrl.split("/");
      const classRoomId = urlParts[urlParts.length - 1];

      const response = await axios.get(
        `https://live.mindmentorz.in/api/new-class/get-new-class/${classRoomId}`
      );

      const { meetingID } = response.data;

      const joinResponse = await axios.post(
        `https://live.mindmentorz.in/api/new-class/new-sign-join-url`,
        {
          fullName: kidName,
          meetingID: meetingID,
          password: "apwd",
        }
      );
      window.location.href = joinResponse.data.signedUrl;
    } catch (error) {
      console.error("Error joining session:", error);
      alert("Failed to join session. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-primary to-blue-400 animate-background">
        <Rocket size={64} className="text-white animate-bounce" />
        <div className="absolute animate-ping w-40 h-40 bg-blue-300 rounded-full opacity-50"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen bg-blue-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-2xl text-center max-w-md w-full border-4 border-blue-200">
          <div className="mb-4 flex justify-center">
            <Target className="text-primary animate-bounce" size={64} />
          </div>
          <h2 className="text-2xl font-bold text-primary mb-4">
            Oops! Adventure Paused
          </h2>
          <p className="text-gray-700 text-base">{error}</p>
        </div>
      </div>
    );
  }

  if (!classData || classData.length === 0) {
    return (
      <div className="h-screen bg-gradient-to-r from-primary to-blue-400 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-2xl text-center max-w-md w-full border-4 border-blue-200">
          <Star size={64} className="mx-auto mb-4 text-primary animate-spin" />
          <h2 className="text-2xl font-bold text-primary">
            No Class Adventures Today
          </h2>
          <p className="text-blue-400 mt-2">
            Check back later for exciting missions, {kidName}!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-primary to-blue-400 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Classes Grid */}
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          {classData.map((classItem, index) => (
            <div
              key={classItem._id}
              className="w-full bg-white rounded-3xl shadow-2xl overflow-hidden border-8 border-white relative"
            >
              {/* Playful Header */}
              <div className="bg-gradient-to-r from-primary to-primary text-white p-6 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 transform rotate-45 bg-white/20 w-40 h-40 rounded-full"></div>
                <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-400 to-primary animate-pulse"></div>

                <h2 className="text-2xl font-extrabold mb-2 drop-shadow-md relative z-10">
                  🏆 {classItem.program} Champion Quest
                </h2>
                <p className="text-base text-white/90 font-medium relative z-10">
                  {classItem.level} Level Training
                </p>
                <div className="flex items-center mt-2 relative z-10">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-bold ${
                      classItem.type === "online"
                        ? "bg-green-400 text-green-900"
                        : "bg-orange-400 text-orange-900"
                    }`}
                  >
                    {classItem.type === "online" ? "💻 Online" : "🏢 Offline"}
                  </span>
                  <span
                    className={`ml-2 px-3 py-1 rounded-full text-sm font-bold ${
                      classItem.status === "Scheduled"
                        ? "bg-blue-400 text-blue-900"
                        : "bg-gray-400 text-gray-900"
                    }`}
                  >
                    {classItem.status}
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 p-6">
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-2xl shadow-md transform transition-all hover:scale-105 hover:shadow-xl">
                    <div className="flex items-center space-x-4">
                      <Calendar className="text-primary" size={32} />
                      <div>
                        <h3 className="text-base font-bold text-primary">
                          Mission Day
                        </h3>
                        <p className="text-sm text-primary">
                          {classItem.day},{" "}
                          {new Date(classItem.classDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-2xl shadow-md transform transition-all hover:scale-105 hover:shadow-xl">
                    <div className="flex items-center space-x-4">
                      <Clock className="text-primary" size={32} />
                      <div>
                        <h3 className="text-base font-bold text-primary">
                          Adventure Time
                        </h3>
                        <p className="text-sm text-primary">
                          {classItem.classTime}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-2xl shadow-md transform transition-all hover:scale-105 hover:shadow-xl">
                    <div className="flex items-center space-x-4">
                      <User className="text-primary" size={32} />
                      <div>
                        <h3 className="text-base font-bold text-primary">
                          Mission Guide
                        </h3>
                        <p className="text-sm text-primary">
                          {classItem.coachName}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-2xl shadow-md transform transition-all hover:scale-105 hover:shadow-xl">
                    <h3 className="text-xl font-bold text-primary mb-2">
                      🎯 Your Training Details
                    </h3>
                    <div className="space-y-2">
                      <p className="text-sm text-primary flex items-center">
                        <Award size={20} className="mr-2 text-primary" />
                        Program: {classItem.program}
                      </p>
                      <p className="text-sm text-primary flex items-center">
                        <Target size={20} className="mr-2 text-primary" />
                        Level: {classItem.level}
                      </p>
                      <p className="text-sm text-primary flex items-center">
                        <Users size={20} className="mr-2 text-primary" />
                        Students: {classItem.enrolledKidCount}/
                        {classItem.maximumKidCount}
                      </p>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-2xl shadow-md transform transition-all hover:scale-105 hover:shadow-xl">
                    <h4 className="text-xl font-bold text-primary mb-3">
                      🏫 Learning Center
                    </h4>
                    <div className="flex items-start space-x-2">
                      <MapPin
                        size={20}
                        className="text-primary mt-1 flex-shrink-0"
                      />
                      <p className="text-sm text-primary font-medium">
                        {classItem.centerName}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-6 flex justify-center space-x-4">
                {classItem.type === "online" && classItem.kidJoinUrl ? (
                  <button
                    onClick={() => handleJoinClass(classItem)}
                    className="bg-gradient-to-r from-primary to-primary text-white 
                    px-8 py-3 rounded-full text-base font-bold 
                    hover:from-primary hover:to-primary 
                    transform hover:scale-110 transition-all 
                    shadow-xl flex items-center space-x-3 
                    hover:animate-pulse"
                  >
                    <Video size={24} />
                    <span>Join Online Class</span>
                    <ExternalLink size={24} />
                  </button>
                ) : classItem.type === "offline" ? (
                  <div
                    className="bg-gradient-to-r from-orange-500 to-orange-400 text-white 
                  px-8 py-3 rounded-full text-base font-bold 
                  shadow-xl flex items-center space-x-3"
                  >
                    <MapPin size={24} />
                    <span>Offline Class - Visit Center</span>
                  </div>
                ) : (
                  <div
                    className="bg-gray-400 text-white 
                  px-8 py-3 rounded-full text-base font-bold 
                  shadow-xl flex items-center space-x-3"
                  >
                    <Clock size={24} />
                    <span>Join Link Not Available</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KidsDemoClass;
