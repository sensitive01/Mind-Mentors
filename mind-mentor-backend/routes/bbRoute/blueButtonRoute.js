const express = require("express");
const bbController = require("../../controller/bbController/blueButtonController");

const router = express.Router();

router.post("/join", bbController.createMeeting);
router.get("/join-coach", bbController.joinCoach);
router.get("/join-kid", bbController.joinKid);

module.exports = router;
