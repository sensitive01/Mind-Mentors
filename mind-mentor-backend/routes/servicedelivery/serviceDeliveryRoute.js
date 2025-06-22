const express = require('express');
const serviceRoute = express.Router();
const serviceController = require('../../controller/servicedelivery/seviceController');



serviceRoute.get("/get-active-enquiry-data",serviceController.getAllActiveEnquiries)
serviceRoute.get("/get-class-shedule",serviceController.getClassShedules)
serviceRoute.get("/get-center-class-shedule",serviceController.getCenterClassShedules)

serviceRoute.get("/get-coach-data",serviceController.getCoachData)
serviceRoute.get("/get-coach-availabledata-table",serviceController.getCoachAvailableDays)
serviceRoute.get("/get-class-student-data/:classId", serviceController.getClassAndStudentsData);
serviceRoute.get("/get-active-kid-class-data/:enqId", serviceController.getActiveKidAndClassData);
serviceRoute.get("/display-selected-class/:enqId", serviceController.displaySelectedClass);
serviceRoute.get("/get-all-scheduled-class-data/:enqId", serviceController.getScheduledClassData);
serviceRoute.get("/get-class-student-data/:classId", serviceController.getClassStudentData);






serviceRoute.post("/save-class-shedule/:id",serviceController.timeTableShedules)
serviceRoute.post("/save-coach-availabledays",serviceController.saveCoachAvailableDays)
serviceRoute.post("/save-class-data/:empId", serviceController.saveClassData);
serviceRoute.post("/assign-whole-class", serviceController.assignWholeClass);

serviceRoute.post("/pause-class-temporary/:enqId/:classId", serviceController.pauseTheClassTemporary);
serviceRoute.post("/resume-the-class/:enqId/:classId", serviceController.resumeTheClassBack);







serviceRoute.put("/edit-coach-availability/:id", serviceController.updateCoachAvailabilityData);


serviceRoute.delete("/delete-coach-availability/:id", serviceController.deleteCoachAvailability);


















module.exports = serviceRoute;
