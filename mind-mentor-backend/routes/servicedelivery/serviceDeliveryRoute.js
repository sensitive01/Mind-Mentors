const express = require('express');
const serviceRoute = express.Router();
const serviceController = require('../../controller/servicedelivery/seviceController');






serviceRoute.post("/save-class-shedule/:id",serviceController.timeTableShedules)
serviceRoute.get("/get-class-shedule",serviceController.getClassShedules)











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
