const express = require("express");
const messageKartRoute = express();
const messageKartController =require("../../controller/msgKartController/saveMessageKartCallingDetails")

messageKartRoute.post("/save-message-kart-calling-details",messageKartController.handleCDRCallback)
module.exports = messageKartRoute
