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


















// Email & Password Verification
// serviceRoute.post('/email-verification', serviceController.operationEmailVerification);
// serviceRoute.post('/password-verification', serviceController.operationPasswordVerification);

// // Enquiry Form CRUD
// serviceRoute.post('/enquiry-form', serviceController.enquiryFormData);
// serviceRoute.get('/enquiry-form', serviceController.getAllEnquiries);
// serviceRoute.put('/enquiry-form/:id', serviceController.updateEnquiry);
// serviceRoute.delete('/enquiry-form/:id', serviceController.deleteEnquiry);
// // Enquiry Form CRUD
// serviceRoute.post('/leaves-form', serviceController.createLeave);
// serviceRoute.get('/leaves-form', serviceController.getAllLeaves);
// serviceRoute.put('/leaves-form/:id', serviceController.updateLeave);
// serviceRoute.delete('/leaves-form/:id', serviceController.deleteLeave);
// // New Routes for Prospects, Demo, Notes, and Referrals
// serviceRoute.put('/prospect-status/:id', serviceController.updateProspectStatus);

// serviceRoute.put('/enquiry-status/:id', serviceController.updateEnquiryStatus);
// serviceRoute.post('/attendance/mark', serviceController.createAttendance);
// serviceRoute.get('/attendance/', serviceController.fetchAttendance)
// serviceRoute.put('/schedule-demo/:id', serviceController.scheduleDemo);
// serviceRoute.put('/add-notes/:id', serviceController.addNotes);
// serviceRoute.put('/refer-to-friend/:id', serviceController.referToFriend);

module.exports = serviceRoute;
