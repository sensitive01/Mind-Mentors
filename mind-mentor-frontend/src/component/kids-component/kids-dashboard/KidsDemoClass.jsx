import { useState, useEffect, useRef } from "react";
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
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
} from "lucide-react";
import toast from "react-hot-toast";
import { getDemoClass } from "../../../api/service/parent/ParentService";
import { io } from "socket.io-client";

// WebRTC Meeting Component for Kids
const WebRTCMeeting = ({ onClose, classId }) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  const socketRef = useRef(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState("Connecting...");

  useEffect(() => {
    // Create socket connection on the correct namespace
    // const socket = io("http://localhost:3000/meeting");
    const socket = io("https://live.mindmentorz.in/employee/operation/meeting");

    socketRef.current = socket;

    // Generate a unique user ID
    const userId = `kid_${Math.floor(Math.random() * 1000000)}`;

    // Set up connection status listener
    socket.on("connect", () => {
      console.log("Socket connected!");
      setConnectionStatus("Socket connected. Joining room...");

      // Join the room with the class ID
      socket.emit("join-room", {
        roomId: "classId" || "default-room",
        userId: userId,
        userName: "Student",
        userType: "student",
      });
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      setConnectionStatus("Connection error. Please try again.");
    });

    socket.on("room-info", (data) => {
      console.log("Room info received:", data);
      setConnectionStatus(
        `Connected. ${data.numParticipants} participant(s) in room.`
      );
    });

    socket.on("user-joined", (data) => {
      console.log("User joined:", data);
      setConnectionStatus(
        `${data.userName} (${data.userType}) joined the room`
      );
      // Start WebRTC connection when another user joins
      startPeerConnection(data.userId);
    });

    const startWebRTC = async () => {
      try {
        // Get user media
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        localStreamRef.current = stream;

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        // Create peer connection
        const peerConnection = new RTCPeerConnection({
          iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            { urls: "stun:stun1.l.google.com:19302" },
            { urls: "stun:stun2.l.google.com:19302" },
          ],
        });
        peerConnectionRef.current = peerConnection;

        // Add tracks to peer connection
        stream.getTracks().forEach((track) => {
          peerConnection.addTrack(track, stream);
        });

        // Handle incoming tracks
        peerConnection.ontrack = (event) => {
          setConnectionStatus("Remote stream received!");
          if (remoteVideoRef.current && event.streams[0]) {
            remoteVideoRef.current.srcObject = event.streams[0];
          }
        };

        // Send ICE candidates to the signaling server
        peerConnection.onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit("ice-candidate", {
              roomId: classId || "default-room",
              userId: userId,
              candidate: event.candidate,
            });
          }
        };

        peerConnection.oniceconnectionstatechange = () => {
          console.log(
            "ICE connection state:",
            peerConnection.iceConnectionState
          );
          setConnectionStatus(
            `ICE state: ${peerConnection.iceConnectionState}`
          );
        };

        // Listen for remote ICE candidates
        socket.on("ice-candidate", async (data) => {
          try {
            if (peerConnectionRef.current) {
              await peerConnectionRef.current.addIceCandidate(
                new RTCIceCandidate(data.candidate)
              );
            }
          } catch (error) {
            console.error("Error adding ICE candidate:", error);
          }
        });

        // Handle offer and answer
        socket.on("offer", async (data) => {
          try {
            const pc = peerConnectionRef.current;
            if (pc && pc.signalingState !== "have-remote-offer") {
              await pc.setRemoteDescription(
                new RTCSessionDescription(data.offer)
              );
              const answer = await pc.createAnswer();
              await pc.setLocalDescription(answer);
              socket.emit("answer", {
                roomId: classId || "default-room",
                userId: userId,
                answer: answer,
              });
            }
          } catch (error) {
            console.error("Error handling offer:", error);
            setConnectionStatus("Error handling offer");
          }
        });

        socket.on("answer", async (data) => {
          try {
            const pc = peerConnectionRef.current;
            if (pc && pc.signalingState === "have-local-offer") {
              await pc.setRemoteDescription(
                new RTCSessionDescription(data.answer)
              );
            }
          } catch (error) {
            console.error("Error handling answer:", error);
            setConnectionStatus("Error handling answer");
          }
        });
      } catch (error) {
        console.error("Error starting WebRTC:", error);
        setConnectionStatus(`Error: ${error.message}`);
      }
    };

    const startPeerConnection = async (targetUserId) => {
      try {
        if (!peerConnectionRef.current) {
          console.error("PeerConnection not initialized");
          return;
        }

        const offer = await peerConnectionRef.current.createOffer();
        await peerConnectionRef.current.setLocalDescription(offer);

        socket.emit("offer", {
          roomId: classId || "default-room",
          userId: userId,
          targetUserId: targetUserId,
          offer: offer,
        });

        setConnectionStatus("Offer sent, waiting for answer...");
      } catch (error) {
        console.error("Error creating offer:", error);
        setConnectionStatus(`Error creating offer: ${error.message}`);
      }
    };

    startWebRTC();

    // Cleanup function
    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [classId]);

  const toggleMic = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicOn(audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOn(videoTrack.enabled);
      }
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden p-4 flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <div className="text-primary font-bold text-xl">Live Class</div>
        <div className="text-primary text-sm">{connectionStatus}</div>
        <button
          onClick={onClose}
          className="bg-primary/10 hover:bg-primary/20 text-primary rounded-full p-2"
        >
          Close
        </button>
      </div>

      <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="col-span-2 bg-gray-100 rounded-2xl overflow-hidden relative">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          {!remoteVideoRef.current?.srcObject && (
            <div className="absolute inset-0 flex items-center justify-center bg-primary/10">
              <div className="text-center">
                <Rocket
                  size={48}
                  className="text-primary mx-auto animate-bounce mb-2"
                />
                <p className="text-primary font-bold">
                  Waiting for teacher to join...
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-100 rounded-2xl overflow-hidden relative">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 left-2 bg-primary/70 text-white px-2 py-1 rounded-lg text-sm">
            You
          </div>
        </div>
      </div>

      <div className="flex justify-center space-x-4 p-4 bg-primary/10 rounded-full">
        <button
          onClick={toggleMic}
          className={`rounded-full p-3 ${
            isMicOn ? "bg-primary text-white" : "bg-red-500 text-white"
          }`}
        >
          {isMicOn ? <Mic size={24} /> : <MicOff size={24} />}
        </button>
        <button
          onClick={toggleVideo}
          className={`rounded-full p-3 ${
            isVideoOn ? "bg-primary text-white" : "bg-red-500 text-white"
          }`}
        >
          {isVideoOn ? <VideoIcon size={24} /> : <VideoOff size={24} />}
        </button>
        <button
          onClick={onClose}
          className="bg-red-500 text-white rounded-full p-3"
        >
          Leave
        </button>
      </div>
    </div>
  );
};

const KidsDemoClass = () => {
  const kidId = localStorage.getItem("kidId");
  const [demoClass, setDemoClass] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMeetingOpen, setIsMeetingOpen] = useState(false);

  useEffect(() => {
    const fetchDemoClassDetails = async () => {
      try {
        setLoading(true);
        const response = await getDemoClass(kidId);
        console.log(response);
        setDemoClass(response.data.classDetails);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching demo class details:", err);
        setError("Failed to load demo class details");
        toast.error("Unable to fetch demo class information");
        setLoading(false);
      }
    };

    fetchDemoClassDetails();
  }, [kidId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-primary to-primary/80 animate-background">
        <Rocket size={64} className="text-white animate-bounce" />
        <div className="absolute animate-ping w-40 h-40 bg-primary/30 rounded-full opacity-50"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen bg-primary/10 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-2xl text-center max-w-md w-full border-4 border-primary/30">
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

  if (!demoClass) {
    return (
      <div className="h-screen bg-gradient-to-r from-primary/90 to-primary/70 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-2xl text-center max-w-md w-full border-4 border-primary/30">
          <Star size={64} className="mx-auto mb-4 text-primary animate-spin" />
          <h2 className="text-2xl font-bold text-primary">
            No Class Adventures Today
          </h2>
          <p className="text-primary/80 mt-2">
            Check back later for exciting missions!
          </p>
        </div>
      </div>
    );
  }

  const handleJoinClass = () => {
    // Instead of opening an external link, open the WebRTC meeting
    setIsMeetingOpen(true);
  };

  const handleCloseMeeting = () => {
    setIsMeetingOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-primary/90 to-primary/70 flex items-center justify-center p-4">
      {isMeetingOpen ? (
        <div className="w-full h-screen max-w-6xl">
          <WebRTCMeeting
            onClose={handleCloseMeeting}
            classId={demoClass._id || "default-room"}
          />
        </div>
      ) : (
        <div className="w-full bg-white rounded-3xl shadow-2xl overflow-hidden border-8 border-white relative max-w-4xl">
          {/* Playful Header */}
          <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-6 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 transform rotate-45 bg-white/20 w-40 h-40 rounded-full"></div>
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-primary/70 to-primary/90 animate-pulse"></div>

            <h1 className="text-2xl font-extrabold mb-2 drop-shadow-md relative z-10">
              🏆 {demoClass.program} Champion Quest
            </h1>
            <p className="text-base text-white/90 font-medium relative z-10">
              {demoClass.level} Level Training
            </p>
          </div>

          {/* Content Grid */}
          <div className="grid md:grid-cols-2 gap-6 p-6">
            {/* Left Column - Class Details */}
            <div className="space-y-4">
              {/* Date Field */}
              <div
                className="bg-primary/10 p-4 rounded-2xl shadow-md 
                transform transition-all hover:scale-105 hover:shadow-xl"
              >
                <div className="flex items-center space-x-4">
                  <Calendar className="text-primary" size={32} />
                  <div>
                    <h3 className="text-base font-bold text-primary">
                      Mission Day
                    </h3>
                    <p className="text-sm text-primary/70">
                      {demoClass.day}{" "}
                      {new Date(demoClass.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Time Field */}
              <div
                className="bg-primary/10 p-4 rounded-2xl shadow-md 
                transform transition-all hover:scale-105 hover:shadow-xl"
              >
                <div className="flex items-center space-x-4">
                  <Clock className="text-primary" size={32} />
                  <div>
                    <h3 className="text-base font-bold text-primary">
                      Adventure Time
                    </h3>
                    <p className="text-sm text-primary/70">
                      {demoClass.classTime}
                    </p>
                  </div>
                </div>
              </div>

              {/* Coach Field */}
              <div
                className="bg-primary/10 p-4 rounded-2xl shadow-md 
                transform transition-all hover:scale-105 hover:shadow-xl"
              >
                <div className="flex items-center space-x-4">
                  <User className="text-primary" size={32} />
                  <div>
                    <h3 className="text-base font-bold text-primary">
                      Mission Guide
                    </h3>
                    <p className="text-sm text-primary/70">
                      {demoClass.coachName || "Expert Instructor"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Additional Details */}
            <div className="space-y-4">
              {/* Class Type & Level */}
              <div
                className="bg-primary/10 p-4 rounded-2xl shadow-md 
                transform transition-all hover:scale-105 hover:shadow-xl"
              >
                <h3 className="text-xl font-bold text-primary mb-2">
                  🎯 Your Training Details
                </h3>
                <div className="space-y-2">
                  <p className="text-sm text-primary/70 flex items-center">
                    <Award size={20} className="mr-2 text-primary" />
                    Type: {demoClass.classType}
                  </p>
                  <p className="text-sm text-primary/70 flex items-center">
                    <Target size={20} className="mr-2 text-primary" />
                    Level: {demoClass.level}
                  </p>
                  <p className="text-sm text-primary/70 flex items-center">
                    <Star size={20} className="mr-2 text-primary" />
                    Status: {demoClass.status}
                  </p>
                </div>
              </div>

              {/* Learner Superpowers */}
              <div
                className="bg-primary/10 p-4 rounded-2xl shadow-md 
                transform transition-all hover:scale-105 hover:shadow-xl"
              >
                <h4 className="text-xl font-bold text-primary mb-3">
                  🌟 Your Learning Adventure
                </h4>
                <ul className="space-y-2">
                  {[
                    "Skill Building 🧠",
                    "Fun Learning 🎉",
                    "Expert Guidance 🏆",
                  ].map((power, index) => (
                    <li
                      key={index}
                      className="flex items-center text-sm text-primary/70 font-medium 
                      hover:text-primary 
                      transition-all duration-300 ease-in-out"
                    >
                      <Award size={20} className="mr-2 text-primary" />
                      {power}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-primary/10 p-6 flex justify-center space-x-4">
            <button
              onClick={handleJoinClass}
              className="bg-gradient-to-r from-primary to-primary/80 text-white 
              px-8 py-3 rounded-full text-base font-bold 
              hover:from-primary/90 hover:to-primary 
              transform hover:scale-110 transition-all 
              shadow-xl flex items-center space-x-3 
              hover:animate-pulse"
            >
              <Video size={24} />
              <span>Join Class</span>
              <ExternalLink size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default KidsDemoClass;
