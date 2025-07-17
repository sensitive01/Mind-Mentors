const { Server } = require("socket.io");

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*", // replace with your frontend domain in prod
      methods: ["GET", "POST"],
    },
    transports: ["websocket"],
  });

  // Track rooms and their participants
  const roomParticipants = new Map(); // roomId -> Set of participant objects

  io.on("connection", (socket) => {
    console.log("✅ Socket connected:", socket.id);

    // Helper function to get participant info
    const getParticipantInfo = (userId) => {
      return {
        userId,
        socketId: socket.id,
        joinedAt: new Date().toISOString()
      };
    };

    // Join employee's personal room
    socket.on("joinRoom", ({ userId }) => {
      socket.join(`employee_${userId}`);
      console.log(`Employee ${userId} joined their personal room`);
    });

    // Join a ticket room with multiple participants
    socket.on("joinTicketRoom", ({ ticketId, userId }) => {
      // Join the room
      socket.join(ticketId);
      
      // Initialize room if not exists
      if (!roomParticipants.has(ticketId)) {
        roomParticipants.set(ticketId, new Set());
      }
      
      // Add participant to room
      const participant = getParticipantInfo(userId);
      roomParticipants.get(ticketId).add(participant);
      
      console.log(`Employee ${userId} joined ticket room ${ticketId}`);
      
      // Notify others in the room about new participant
      socket.to(ticketId).emit("participantJoined", {
        ticketId,
        participant,
        participants: Array.from(roomParticipants.get(ticketId)),
        timestamp: new Date().toISOString()
      });
      
      // Send current participants to the new joiner
      socket.emit("roomParticipants", {
        ticketId,
        participants: Array.from(roomParticipants.get(ticketId))
      });
    });

    // Handle message sending to room
    socket.on("sendMessage", (data) => {
      if (!roomParticipants.has(data.ticketId)) {
        console.error(`Ticket room ${data.ticketId} doesn't exist`);
        return;
      }
      
      io.to(data.ticketId).emit("receiveMessage", {
        ...data,
        participants: Array.from(roomParticipants.get(data.ticketId)),
        timestamp: new Date().toISOString()
      });
    });

    // Handle typing indicators with participant context
    socket.on("typing", ({ ticketId, isTyping, userName, userId }) => {
      if (!roomParticipants.has(ticketId)) return;
      
      const participant = Array.from(roomParticipants.get(ticketId))
        .find(p => p.userId === userId);
      
      socket.to(ticketId).emit("typingStatus", {
        ticketId,
        isTyping,
        userName,
        userId,
        participant,
        timestamp: new Date().toISOString()
      });
    });

    // Handle participant leaving a room
    socket.on("leaveTicketRoom", ({ ticketId, userId }) => {
      if (roomParticipants.has(ticketId)) {
        const participants = roomParticipants.get(ticketId);
        const participant = Array.from(participants).find(p => p.userId === userId);
        
        if (participant) {
          participants.delete(participant);
          socket.leave(ticketId);
          
          // Notify others about participant leaving
          socket.to(ticketId).emit("participantLeft", {
            ticketId,
            participant,
            remainingParticipants: Array.from(participants),
            timestamp: new Date().toISOString()
          });
          
          // Clean up empty rooms
          if (participants.size === 0) {
            roomParticipants.delete(ticketId);
          }
        }
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected:", socket.id);
      
      // Find and remove this socket from all rooms
      roomParticipants.forEach((participants, ticketId) => {
        const participant = Array.from(participants).find(p => p.socketId === socket.id);
        
        if (participant) {
          participants.delete(participant);
          
          // Notify others about disconnection
          io.to(ticketId).emit("participantDisconnected", {
            ticketId,
            participant,
            remainingParticipants: Array.from(participants),
            timestamp: new Date().toISOString()
          });
          
          // Clean up empty rooms
          if (participants.size === 0) {
            roomParticipants.delete(ticketId);
          }
        }
      });
    });

    // Get room participants
    socket.on("getRoomParticipants", ({ ticketId }, callback) => {
      if (roomParticipants.has(ticketId)) {
        callback({
          success: true,
          participants: Array.from(roomParticipants.get(ticketId))
        });
      } else {
        callback({ success: false, message: "Room not found" });
      }
    });
  });

  // Health check
  setInterval(() => {
    io.emit("healthCheck", {
      timestamp: new Date().toISOString(),
      activeRooms: roomParticipants.size
    });
  }, 30000);
};

const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
};

module.exports = { initSocket, getIO };