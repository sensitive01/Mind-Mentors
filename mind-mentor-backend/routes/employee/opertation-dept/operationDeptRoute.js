const express = require("express");
const operationRoute = express.Router();
const operationController = require("../../../controller/employee/operation-dept/oprationDeptController");
const ActivityLog = require("../../../model/taskLogModel");

// Email & Password Verification



operationRoute.get("/enquiry-form", operationController.getAllEnquiries);
operationRoute.get("/get-shedule-demo-class", operationController.getAllSheduleClass);
operationRoute.get("/fetch-all-logs/:id", operationController.fetchAllLogs);
operationRoute.get("/get-demo-class-student-data/:enqId", operationController.getDemoClassAndStudentsData);
operationRoute.get("/get-demo-class-student-data-group/:classId", operationController.getDemoClassAndStudentsDataGroup);
operationRoute.get("/get-demo-class-for-individual-kid/:enqId", operationController.getSheduledDemoClassDataOfKid);
operationRoute.get("/get-kids-data", operationController.getAllKidData);
operationRoute.get("/get-parent-data", operationController.getAllParentData);
operationRoute.get("/get-prospects-data", operationController.getProspectsData);
operationRoute.get("/get-prospects-student-data", operationController.getProspectsStudentsData);
operationRoute.get("/get-conducted-demo-class", operationController.getConductedDemoClass);
operationRoute.get("/get-my-leaves/:empId", operationController.getMyLeaveData);
operationRoute.get("/get-leaves/:levId", operationController.getMyIndividualLeave);
operationRoute.get("/get-dropdown-data", operationController.getDropDownData);
operationRoute.get("/specific-kid-assign-task/:id", operationController.specificKidAssignTask);
operationRoute.get("/fetch-all-status-logs/:id", operationController.fetchAllStatusLogs);
operationRoute.get("/get-package-data", operationController.getPackageData);
operationRoute.get("/get-discount-vouchers/:enqId", operationController.getDiscountVouchers);
operationRoute.get("/get-the-physical-center-name", operationController.getThePhysicalCenterName);
operationRoute.get("/get-employee-data/:empId", operationController.getEmployeeData);
operationRoute.get("/is-attandance-marked/:empId", operationController.isAttendanceMarked);
operationRoute.get("/get-my-attandance-data/:empId", operationController.getMyAttendanceData);
operationRoute.get("/leaves-form", operationController.getAllLeaves);
operationRoute.get("/attendance/", operationController.fetchAttendance);
operationRoute.get("/tasks", operationController.getAllTasks);
operationRoute.get("/all-task", operationController.getAllTasks);
operationRoute.get("/my-pending-tasks/:id", operationController.getMyPendingTasks);
operationRoute.get("/assign-task-to-others/:id", operationController.assignTaskToOthers);
operationRoute.get("/tasks/:id", operationController.getTaskById);
operationRoute.get("/taskslogs/:id", operationController.getActivityLogsByTaskId);
operationRoute.get("/get-attandance-data/:id",operationController.getAllAttandanceData);
operationRoute.get(
  "/get-parent-discount-vouchers/:parentId/:kidId",
  operationController.getParentDiscoauntVouchers
);







operationRoute.post("/email-verification",operationController.operationEmailVerification);
operationRoute.post("/password-verification",operationController.operationPasswordVerification);
operationRoute.post("/enquiry-form", operationController.enquiryFormData);
operationRoute.post("/shedule-demo-class/:id", operationController.scheduleDemoClass);
operationRoute.post("/save-demo-class/:empId", operationController.saveDemoClassData);
operationRoute.post("/send-payment-package-data/:enqId", operationController.savePaymentData);
operationRoute.post("/department-paynow-option", operationController.departmentPayNowOption);
operationRoute.post("/update-payment-data", operationController.updatePaymentData);
operationRoute.post("/make-a-call-to-parent", operationController.makeaCallToParent);
operationRoute.post("/save-employee-attance-data/:empId", operationController.createAttendance);








operationRoute.put("/enquiry-form/:enqId/step/:step", operationController.updateEnquiryDetails);
operationRoute.put("/move-to-prospects/:id", operationController.updateProspectData);
operationRoute.put("/move-to-enquiry/:id", operationController.moveBackToEnquiry);
operationRoute.put("/enquiry-form/:id", operationController.updateEnquiry)
operationRoute.put("/prospect-status/:id",operationController.updateProspectStatus);
operationRoute.put("/enquiry-status/:id",operationController.updateEnquiryStatus);
operationRoute.put("/schedule-demo/:id", operationController.scheduleDemo);
operationRoute.put("/update-conducted-enrollment-status/:empId/:id", operationController.updateEnrollmentStatus);
operationRoute.put("/add-notes/:id", operationController.addNotes);
operationRoute.put("/cancel-demo-class-for-a-kid/:enqId/:classId/:empId", operationController.cancelDemoClassForKid);
operationRoute.put("/reshedule-demo-class-for-a-kid/:classId/:empId", operationController.rescheduleDemoClass);





operationRoute.delete("/enquiry-form/:id", operationController.deleteEnquiry);





operationRoute.post("/register",operationController.registerEmployee)
operationRoute.post("/leaves-form", operationController.createLeave);
operationRoute.post("/tasks", operationController.createTask);



operationRoute.put("/leaves-form/:id", operationController.updateLeave);
operationRoute.put("/refer-to-friend/:id", operationController.referToFriend);
operationRoute.put("/tasks/:id", operationController.updateTask);
operationRoute.put("/tasks/:id/status", operationController.updateTaskStatus);
operationRoute.put("/tasks/notes/:id", operationController.addNotesToTasks);




operationRoute.delete("/leaves-form/:id", operationController.deleteLeave);
operationRoute.delete("/tasks/:id", operationController.deleteTask);















module.exports = operationRoute;
