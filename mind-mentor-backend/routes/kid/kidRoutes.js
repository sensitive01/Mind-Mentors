const express = require("express");
const kidRoute = express();

const kidController = require("../../controller/kids/kidController")

kidRoute.post("/login",kidController.validateKidChessId)
kidRoute.post("/verify-pin",kidController.validateKidPin)




module.exports =  kidRoute