const express = require("express");
const operationRoute = express.Router();
const operationController = require("../../../controller/employee/operation-dept/oprationDeptController");

// Email & Password Verification

operationRoute.post("/register",operationController.registerEmployee)

operationRoute.post(
  "/email-verification",
  operationController.operationEmailVerification
);
operationRoute.post(
  "/password-verification",
  operationController.operationPasswordVerification
);

// Enquiry Form CRUD
operationRoute.post("/enquiry-form", operationController.enquiryFormData);
operationRoute.get("/enquiry-form", operationController.getAllEnquiries);
operationRoute.put("/move-to-prospects/:id", operationController.updateProspectData);


operationRoute.put("/enquiry-form/:id", operationController.updateEnquiry);
operationRoute.delete("/enquiry-form/:id", operationController.deleteEnquiry);
// Enquiry Form CRUD
operationRoute.post("/leaves-form", operationController.createLeave);
operationRoute.get("/leaves-form", operationController.getAllLeaves);
operationRoute.put("/leaves-form/:id", operationController.updateLeave);
operationRoute.delete("/leaves-form/:id", operationController.deleteLeave);
// New Routes for Prospects, Demo, Notes, and Referrals
operationRoute.put(
  "/prospect-status/:id",
  operationController.updateProspectStatus
);

operationRoute.put(
  "/enquiry-status/:id",
  operationController.updateEnquiryStatus
);
operationRoute.post("/attendance/mark", operationController.createAttendance);
operationRoute.get("/attendance/", operationController.fetchAttendance);

operationRoute.put("/schedule-demo/:id", operationController.scheduleDemo);
operationRoute.put("/add-notes/:id", operationController.addNotes);
operationRoute.put("/refer-to-friend/:id", operationController.referToFriend);

operationRoute.post("/tasks", operationController.createTask);
operationRoute.get("/tasks", operationController.getAllTasks);
operationRoute.get("/my-tasks/:id", operationController.getMyTasks);

operationRoute.put("/tasks/:id", operationController.updateTask);
operationRoute.delete("/tasks/:id", operationController.deleteTask);

operationRoute.get("/get-kids-data", operationController.getAllKidData);
operationRoute.get("/get-parent-data", operationController.getAllParentData);

operationRoute.get("/get-prospects-data", operationController.getProspectsData);

operationRoute.get("/get-prospects-student-data", operationController.getProspectsStudentsData);


operationRoute.post("/shedule-demo-class/:id", operationController.scheduleDemoClass);

operationRoute.get("/get-shedule-demo-class", operationController.getAllSheduleClass);





operationRoute.get(
  "/get-attandance-data/:id",
  operationController.getAllAttandanceData
);

module.exports = operationRoute;
