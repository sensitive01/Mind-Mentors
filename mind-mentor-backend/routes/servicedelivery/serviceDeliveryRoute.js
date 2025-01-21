const express = require('express');
const serviceRoute = express.Router();
const serviceController = require('../../controller/servicedelivery/seviceController');




serviceRoute.get("/get-class-shedule",serviceController.getClassShedules)
serviceRoute.get("/get-coach-data",serviceController.getCoachData)
serviceRoute.get("/get-coach-availabledata-table",serviceController.getCoachAvailableDays)
serviceRoute.get("/get-class-student-data/:classId", serviceController.getClassAndStudentsData);


serviceRoute.post("/save-class-shedule/:id",serviceController.timeTableShedules)
serviceRoute.post("/save-coach-availabledays",serviceController.saveCoachAvailableDays)
serviceRoute.post("/save-class-data/:empId", serviceController.saveClassData);


serviceRoute.put("/edit-coach-availability/:id", serviceController.updateCoachAvailabilityData);


serviceRoute.delete("/delete-coach-availability/:id", serviceController.deleteCoachAvailability);


















module.exports = serviceRoute;
