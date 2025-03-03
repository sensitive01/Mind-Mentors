const express = require('express');
const hrRoutes = express.Router();
const  hrController= require("../../controller/humenresource/hrController")

hrRoutes.post("/add-new-employee",hrController.createNewEmployee)
hrRoutes.get("/get-all-physicalcenters",hrController.getAllPhysicalCenters)


module.exports = hrRoutes