const express = require('express');
const CoachRoute = express.Router();
const CoachController = require('../../controller/servicedelivery/seviceController');

// Email & Password Verification
CoachRoute.post('/email-verification', CoachController.operationEmailVerification);
CoachRoute.post('/password-verification', CoachController.operationPasswordVerification);

// Enquiry Form CRUD
CoachRoute.post('/enquiry-form', CoachController.enquiryFormData);
CoachRoute.get('/enquiry-form', CoachController.getAllEnquiries);
CoachRoute.put('/enquiry-form/:id', CoachController.updateEnquiry);
CoachRoute.delete('/enquiry-form/:id', CoachController.deleteEnquiry);
// Enquiry Form CRUD
CoachRoute.post('/leaves-form', CoachController.createLeave);
CoachRoute.get('/leaves-form', CoachController.getAllLeaves);
CoachRoute.put('/leaves-form/:id', CoachController.updateLeave);
CoachRoute.delete('/leaves-form/:id', CoachController.deleteLeave);
// New Routes for Prospects, Demo, Notes, and Referrals
CoachRoute.put('/prospect-status/:id', CoachController.updateProspectStatus);

CoachRoute.put('/enquiry-status/:id', CoachController.updateEnquiryStatus);
CoachRoute.post('/attendance/mark', CoachController.createAttendance);
CoachRoute.get('/attendance/', CoachController.fetchAttendance)
CoachRoute.put('/schedule-demo/:id', CoachController.scheduleDemo);
CoachRoute.put('/add-notes/:id', CoachController.addNotes);
CoachRoute.put('/refer-to-friend/:id', CoachController.referToFriend);

module.exports = CoachRoute;