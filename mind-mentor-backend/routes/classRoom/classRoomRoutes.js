const express = require("express");
const classRoomController = require("../../controller/classRoom/classRoomController");

const router = express.Router();

// ✅ Route to handle classroom joining
router.post("/classroom-class", classRoomController.joinClassroom);

module.exports = router;
