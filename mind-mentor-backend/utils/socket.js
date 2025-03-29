// In your socket server
const { Server } = require("socket.io");

function initSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "*", // Restrict in production
      methods: ["GET", "POST"],
    },
  });
  
  const meetingIo = io.of("/meeting");
  
  // Track active rooms
  const activeRooms = {};
  
  meetingIo.on("connection", (socket) => {
    console.log(`✅ A user connected to meeting: ${socket.id}`);
    
    socket.on("join-room", ({ roomId, userId, userName, userType }) => {
      console.log(`User ${userName} joining room ${roomId} with user type ${userType}`);
      
      if (!roomId || !userId) {
        console.error("❌ Missing roomId or userId");
        return;
      }
      
      // Join the room
      socket.join(roomId);
      
      // Track users in rooms
      if (!activeRooms[roomId]) {
        activeRooms[roomId] = [];
      }
      activeRooms[roomId].push({
        socketId: socket.id,
        userId,
        userName,
        userType
      });
      
      console.log(`✅ User ${userName} (${userType}) joined room ${roomId}`);
      console.log(`Room ${roomId} has ${activeRooms[roomId].length} participants`);
      
      // Notify others in the room
      socket.to(roomId).emit("user-joined", { userId, userName, userType });
      
      // Notify joining user about other participants
      const room = meetingIo.adapter.rooms.get(roomId);
      if (room) {
        socket.emit("room-info", { 
          numParticipants: room.size,
          participants: activeRooms[roomId].filter(p => p.socketId !== socket.id)
        });
      }
    });
    
    // Handle disconnect
    socket.on("disconnect", () => {
      console.log(`❌ User disconnected: ${socket.id}`);
      
      // Remove user from active rooms
      for (const roomId in activeRooms) {
        activeRooms[roomId] = activeRooms[roomId].filter(p => p.socketId !== socket.id);
        if (activeRooms[roomId].length === 0) {
          delete activeRooms[roomId];
        }
      }
    });
    
    // WebRTC signaling
    socket.on("offer", (data) => {
      console.log(`🔄 Relaying offer from ${socket.id} to room ${data.roomId}`);
      socket.to(data.roomId).emit("offer", data);
    });
    
    socket.on("answer", (data) => {
      console.log(`🔄 Relaying answer from ${socket.id} to room ${data.roomId}`);
      socket.to(data.roomId).emit("answer", data);
    });
    
    socket.on("ice-candidate", (data) => {
      console.log(`🔄 Relaying ICE candidate from ${socket.id} to room ${data.roomId}`);
      socket.to(data.roomId).emit("ice-candidate", data);
    });
  });
}

module.exports = { initSocket };