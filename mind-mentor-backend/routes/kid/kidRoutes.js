const express = require("express");
const kidRoute = express();

const kidController = require("../../controller/kids/kidController")


kidRoute.get("/get-democlass/:id",kidController.getDemoClass)
kidRoute.get("/get-my-class-data/:kidId",kidController.getKidClassData)
kidRoute.get("/get-my-today-class-data/:kidId",kidController.getMyTodayClassData)
kidRoute.get("/get-my-completed-class-data/:kidId",kidController.getMyCompletedClassData)
kidRoute.get("/get-my-upcoming-class-data/:kidId",kidController.getMyUpcomingClassData)





kidRoute.post("/login",kidController.validateKidChessId)
kidRoute.post("/verify-pin",kidController.validateKidPin)  


 


module.exports =  kidRoute