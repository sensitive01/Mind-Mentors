import { Calendar, Clock, Users, Video, Star, History, PlayCircle, CalendarClock, Mic, MicOff, Video as VideoOn, VideoOff, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { getMyClassData } from "../../../api/service/kid/KidService";
import { io } from "socket.io-client";

// Create a WebRTC Meeting component for kids
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
    const socket = io("http://localhost:3000/meeting");
    socketRef.current = socket;
    
    // Generate a unique user ID
    const userId = `user_${Math.floor(Math.random() * 1000000)}`;
    
    // Set up connection status listener
    socket.on("connect", () => {
      console.log("Socket connected!");
      setConnectionStatus("Socket connected. Joining room...");
      
      // Join the room with the class ID
      socket.emit("join-room", {
        roomId: classId || "default-room",
        userId: userId,
        userName: "Student",
        userType: "student"
      });
    });
    
    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      setConnectionStatus("Connection error. Please try again.");
    });
    
    socket.on("room-info", (data) => {
      console.log("Room info received:", data);
      setConnectionStatus(`Connected. ${data.numParticipants} participant(s) in room.`);
    });
    
    socket.on("user-joined", (data) => {
      console.log("User joined:", data);
      setConnectionStatus(`${data.userName} (${data.userType}) joined the room`);
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
            { urls: "stun:stun2.l.google.com:19302" }
          ],
        });
        peerConnectionRef.current = peerConnection;

        // Add tracks to peer connection
        stream.getTracks().forEach(track => {
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
              candidate: event.candidate
            });
          }
        };
        
        peerConnection.oniceconnectionstatechange = () => {
          console.log("ICE connection state:", peerConnection.iceConnectionState);
          setConnectionStatus(`ICE state: ${peerConnection.iceConnectionState}`);
        };

        // Listen for remote ICE candidates
        socket.on("ice-candidate", async (data) => {
          try {
            if (peerConnectionRef.current) {
              await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
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
              await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
              const answer = await pc.createAnswer();
              await pc.setLocalDescription(answer);
              socket.emit("answer", {
                roomId: classId || "default-room",
                userId: userId,
                answer: answer
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
              await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
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
          offer: offer
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
        localStreamRef.current.getTracks().forEach(track => track.stop());
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
    <div className="webrtc-container">
      <div className="connection-status">
        Status: {connectionStatus}
      </div>
      
      <div className="video-container">
        <div className="remote-video">
          <video 
            ref={remoteVideoRef} 
            autoPlay 
            playsInline
            style={{ width: "100%", maxHeight: "100%" }}
          />
          {!remoteVideoRef.current?.srcObject && (
            <div className="waiting-message">
              Waiting for others to join...
            </div>
          )}
        </div>
        
        <div className="local-video">
          <video 
            ref={localVideoRef} 
            autoPlay 
            playsInline 
            muted
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div className="local-label">You</div>
        </div>
      </div>
      
      <div className="controls">
        <button onClick={toggleMic}>
          {isMicOn ? "Mute" : "Unmute"}
        </button>
        <button onClick={toggleVideo}>
          {isVideoOn ? "Turn Off Video" : "Turn On Video"}
        </button>
        <button onClick={onClose}>
          Leave
        </button>
      </div>
    </div>
  );
};

const KidsChessClassSchedule = () => {
  const [activeTab, setActiveTab] = useState('live');
  const [classData, setClassData] = useState({
    conducted: [],
    live: [],
    upcoming: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeClass, setActiveClass] = useState(null); // For WebRTC meeting

  const kidId = localStorage.getItem("kidId");

  useEffect(() => {
    const fetchMyClassData = async () => {
      try {
        setLoading(true);
        const response = await getMyClassData(kidId);
        setClassData(response?.data?.responseData);
      } catch (err) {
        setError('Failed to fetch class data');
      } finally {
        setLoading(false);
      }
    };
    fetchMyClassData();
  }, [kidId]);

  const tabs = [
    { id: 'conducted', label: 'Past Adventures', icon: History, emoji: '📚' },
    { id: 'live', label: 'Live Games', icon: PlayCircle, emoji: '🎮' },
    { id: 'upcoming', label: 'Coming Soon', icon: CalendarClock, emoji: '🎯' }
  ];

  const EmptyState = ({ message }) => (
    <div className="text-center py-12">
      <div className="text-6xl mb-4 animate-bounce">🎲</div>
      <h3 className="text-xl font-bold text-purple-600 mb-2">No Chess Adventures Yet!</h3>
      <p className="text-purple-500">{message}</p>
    </div>
  );

  const handleJoinClass = (e, classInfo) => {
    e.stopPropagation();
    setActiveClass(classInfo);
  };

  const handleCloseClass = () => {
    setActiveClass(null);
  };

  const ClassCard = ({ classInfo, type }) => (
    <div className="relative transform transition-all duration-300 hover:scale-105">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl transform rotate-1"></div>
      <div className="relative bg-white rounded-2xl p-6 shadow-xl border-4 border-purple-200">
        {/* Class Type Badge */}
        <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 py-1 rounded-full font-bold shadow-lg transform rotate-3">
          {type === 'live' ? '🎮 LIVE' : type === 'upcoming' ? '🌟 COMING UP' : '📚 COMPLETED'}
        </div>

        <div className="mb-4">
          <h3 className="text-2xl font-bold text-purple-600 mb-2">
            {classInfo.classData?.program || classInfo.program || 'Chess Class'} 
          </h3>
          <span className="inline-block bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm font-bold">
            {classInfo.classData?.level || classInfo.level || 'All Levels'}
          </span>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-center bg-purple-50 p-3 rounded-lg">
            <Calendar className="w-6 h-6 text-purple-500 mr-3" />
            <span className="font-medium text-purple-600">
              {classInfo.classData?.day || classInfo.day || 'Game Day!'}
            </span>
          </div>
          
          <div className="flex items-center bg-pink-50 p-3 rounded-lg">
            <Clock className="w-6 h-6 text-pink-500 mr-3" />
            <span className="font-medium text-pink-600">
              {classInfo.classData?.classTime || classInfo.classTime}
            </span>
          </div>
          
          <div className="flex items-center bg-orange-50 p-3 rounded-lg">
            <Users className="w-6 h-6 text-orange-500 mr-3" />
            <span className="font-medium text-orange-600">
              Coach {classInfo.classData?.coachName || classInfo.coachName}
            </span>
          </div>
        </div>

        {classInfo.student?.feedback && (
          <div className="bg-yellow-50 p-4 rounded-xl mb-4">
            <div className="flex items-center mb-2">
              <Star className="w-5 h-5 text-yellow-500 mr-2" fill="currentColor" />
              <span className="font-bold text-yellow-700">Coach's Feedback</span>
            </div>
            <p className="text-yellow-600">{classInfo.student.feedback}</p>
          </div>
        )}

        {(type === 'live' || type === 'upcoming') && (
          <button 
            onClick={(e) => handleJoinClass(e, classInfo)}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 
              text-white px-6 py-3 rounded-xl font-bold text-lg shadow-lg transform transition-all duration-200 
              hover:scale-105 hover:shadow-xl flex items-center justify-center gap-2"
          >
            <Video className="w-6 h-6" />
            {type === 'live' ? '🎮 Join the Fun!' : '🎯 Get Ready!'}
          </button>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-8">
        <div className="text-center">
          <div className="text-6xl animate-bounce mb-4">♟️</div>
          <p className="text-purple-600 text-xl">Setting up the chess board...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-8">
        <div className="text-center">
          <div className="text-6xl mb-4">😟</div>
          <p className="text-red-500 text-xl">Oops! Something went wrong</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-8">
      {activeClass && (
        <WebRTCMeeting 
          onClose={handleCloseClass} 
          classInfo={activeClass} 
        />
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
            Chess Adventure Time! 🎮
          </h1>
          <p className="text-xl text-purple-500">Ready for some amazing chess adventures?</p>
        </div>

        {/* Fun Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {tabs.map(({ id, label, emoji }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full text-lg font-bold transition-all duration-300
                ${activeTab === id 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105' 
                  : 'bg-white text-purple-600 hover:bg-purple-50'}`}
            >
              <span className="text-2xl">{emoji}</span>
              {label}
            </button>
          ))}
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeTab === 'conducted' && (
            classData.conducted?.length > 0 
              ? classData.conducted.map(classInfo => (
                  <ClassCard key={classInfo._id} classInfo={classInfo} type="conducted" />
                ))
              : <EmptyState message="Your chess journey is about to begin! 🚀" />
          )}
          
          {activeTab === 'live' && (
            classData.live?.length > 0
              ? classData.live.map(classInfo => (
                  <ClassCard key={classInfo._id} classInfo={classInfo} type="live" />
                ))
              : <EmptyState message="No live games right now. Check back soon! 🎮" />
          )}
          
          {activeTab === 'upcoming' && (
            classData.upcoming?.length > 0
              ? classData.upcoming.map(classInfo => (
                  <ClassCard key={classInfo._id} classInfo={classInfo} type="upcoming" />
                ))
              : <EmptyState message="More adventures coming soon! 🌟" />
          )}
        </div>
      </div>
    </div>
  );
};

export default KidsChessClassSchedule;