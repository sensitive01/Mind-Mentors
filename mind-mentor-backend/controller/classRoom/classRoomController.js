const joinClassroom = (req, res) => {
    try {
      const { roomId, userId } = req.body;
  
      console.log("Received join request:", req.body);
  
      if (!roomId || !userId) {
        return res.status(400).json({ message: "Room ID and User ID are required" });
      }
  
      console.log(`✅ User ${userId} is joining room ${roomId}`);
  
      res.status(200).json({ message: "Successfully joined classroom", roomId, userId });
    } catch (error) {
      console.error("❌ Error joining classroom:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  module.exports = {
    joinClassroom,
  };
  