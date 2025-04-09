import React, { useState, useRef, useEffect } from "react";
import {
  Typography,
  Button,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Grid,
  Paper,
} from "@mui/material";
import {
  Close as CloseIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
  Videocam as VideoOnIcon,
  VideocamOff as VideoOffIcon,
  CallEnd as CallEndIcon,
} from "@mui/icons-material";
import { customColors } from "../../Layout/customStyle";
import { io } from "socket.io-client";

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
    // const socket = io("https://live.mindmentorz.in/meeting");
    const socket = io("https://live.mindmentorz.in/employee/operation/meeting");

    socketRef.current = socket;

    // Generate a unique user ID
    const userId = `user_${Math.floor(Math.random() * 1000000)}`;

    // Set up connection status listener
    socket.on("connect", () => {
      console.log("Socket connected!");
      setConnectionStatus("Socket connected. Joining room...");

      // Join the room with the class ID
      socket.emit("join-room", {
        roomId: "classId" || "default-room",
        userId: userId,
        userName: "Coach",
        userType: "Coach",
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
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#111",
        color: "white",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <Typography variant="h6" sx={{ color: "white" }}>
          Virtual Classroom
        </Typography>
        <Box>
          <Typography variant="subtitle2" sx={{ color: "white", opacity: 0.7 }}>
            {connectionStatus}
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Video Area */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          p: 2,
          gap: 2,
          overflow: "hidden",
        }}
      >
        {/* Remote Video (Main) */}
        <Paper
          sx={{
            flex: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            bgcolor: "rgba(0,0,0,0.6)",
            position: "relative",
            overflow: "hidden",
            borderRadius: 2,
          }}
        >
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
          {!remoteVideoRef.current?.srcObject && (
            <Box
              sx={{
                position: "absolute",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                gap: 2,
                p: 3,
                bgcolor: "rgba(0,0,0,0.7)",
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" sx={{ color: "white" }}>
                Waiting for others to join...
              </Typography>
              <Typography variant="body2" sx={{ color: "white", opacity: 0.7 }}>
                Share the class link with others to invite them
              </Typography>
            </Box>
          )}
        </Paper>

        {/* Local Video (PIP) */}
        <Paper
          sx={{
            flex: { xs: 1, md: 0.5 },
            maxHeight: { xs: "30vh", md: "none" },
            bgcolor: "rgba(0,0,0,0.4)",
            position: "relative",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: 8,
              left: 8,
              bgcolor: "rgba(0,0,0,0.6)",
              px: 1,
              py: 0.5,
              borderRadius: 1,
            }}
          >
            <Typography variant="caption" sx={{ color: "white" }}>
              You
            </Typography>
          </Box>
        </Paper>
      </Box>

      {/* Controls */}
      <Box
        sx={{
          p: 3,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          borderTop: "1px solid rgba(255,255,255,0.1)",
          bgcolor: "rgba(0,0,0,0.3)",
        }}
      >
        <IconButton
          onClick={toggleMic}
          sx={{
            bgcolor: isMicOn ? "rgba(255,255,255,0.1)" : customColors.primary,
            color: "white",
            p: 2,
            "&:hover": {
              bgcolor: isMicOn ? "rgba(255,255,255,0.2)" : customColors.primary,
            },
          }}
        >
          {isMicOn ? <MicIcon /> : <MicOffIcon />}
        </IconButton>
        <IconButton
          onClick={toggleVideo}
          sx={{
            bgcolor: isVideoOn ? "rgba(255,255,255,0.1)" : customColors.primary,
            color: "white",
            p: 2,
            "&:hover": {
              bgcolor: isVideoOn
                ? "rgba(255,255,255,0.2)"
                : customColors.primary,
            },
          }}
        >
          {isVideoOn ? <VideoOnIcon /> : <VideoOffIcon />}
        </IconButton>
        <IconButton
          onClick={onClose}
          sx={{
            bgcolor: "#f44336",
            color: "white",
            p: 2,
            "&:hover": {
              bgcolor: "#d32f2f",
            },
          }}
        >
          <CallEndIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default WebRTCMeeting;
