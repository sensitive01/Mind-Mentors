const express = require("express");
const operationRoute = express.Router();
const operationController = require("../../../controller/employee/operation-dept/oprationDeptController");

// Email & Password Verification


operationRoute.get("/enquiry-form", operationController.getAllEnquiries);
operationRoute.get("/leaves-form", operationController.getAllLeaves);
operationRoute.get("/attendance/", operationController.fetchAttendance);
operationRoute.get("/tasks", operationController.getAllTasks);
operationRoute.get("/my-tasks/:id", operationController.getMyTasks);
operationRoute.get("/get-shedule-demo-class", operationController.getAllSheduleClass);
operationRoute.get("/fetch-all-logs/:id", operationController.fetchAllLogs);
operationRoute.get("/get-demo-class-student-data/:classId", operationController.getDemoClassAndStudentsData);
operationRoute.get("/get-kids-data", operationController.getAllKidData);
operationRoute.get("/get-parent-data", operationController.getAllParentData);
operationRoute.get("/get-prospects-data", operationController.getProspectsData);
operationRoute.get("/get-prospects-student-data", operationController.getProspectsStudentsData);
operationRoute.get("/get-conducted-demo-class", operationController.getConductedDemoClass);



operationRoute.post("/register",operationController.registerEmployee)
operationRoute.post("/email-verification",operationController.operationEmailVerification);
operationRoute.post("/password-verification",operationController.operationPasswordVerification);
operationRoute.post("/leaves-form", operationController.createLeave);
operationRoute.post("/enquiry-form", operationController.enquiryFormData);
operationRoute.post("/attendance/mark", operationController.createAttendance);
operationRoute.post("/tasks", operationController.createTask);
operationRoute.post("/shedule-demo-class/:id", operationController.scheduleDemoClass);
operationRoute.post("/save-demo-class/:empId", operationController.saveDemoClassData);


operationRoute.put("/move-to-prospects/:id", operationController.updateProspectData);
operationRoute.put("/enquiry-form/:id", operationController.updateEnquiry)
operationRoute.put("/leaves-form/:id", operationController.updateLeave);
operationRoute.put("/prospect-status/:id",operationController.updateProspectStatus);
operationRoute.put("/enquiry-status/:id",operationController.updateEnquiryStatus);
operationRoute.put("/schedule-demo/:id", operationController.scheduleDemo);
operationRoute.put("/add-notes/:id", operationController.addNotes);
operationRoute.put("/refer-to-friend/:id", operationController.referToFriend);
operationRoute.put("/tasks/:id", operationController.updateTask);
operationRoute.put("/update-conducted-enrollment-status/:id", operationController.updateEnrollmentStatus);


operationRoute.delete("/enquiry-form/:id", operationController.deleteEnquiry);
operationRoute.delete("/leaves-form/:id", operationController.deleteLeave);
operationRoute.delete("/tasks/:id", operationController.deleteTask);














operationRoute.get(
  "/get-attandance-data/:id",
  operationController.getAllAttandanceData
);

module.exports = operationRoute;
