const express = require('express');
const CenterRoute = express.Router();
const MarketController = require('../../controller/centeradmin/centerAdminController');

// Email & Password Verification
CenterRoute.post('/email-verification', MarketController.operationEmailVerification);
CenterRoute.post('/password-verification', MarketController.operationPasswordVerification);

// Enquiry Form CRUD
CenterRoute.post('/enquiry-form', MarketController.enquiryFormData);
CenterRoute.get('/enquiry-form', MarketController.getAllEnquiries);
CenterRoute.put('/enquiry-form/:id', MarketController.updateEnquiry);
CenterRoute.delete('/enquiry-form/:id', MarketController.deleteEnquiry);
// Enquiry Form CRUD
CenterRoute.post('/leaves-form', MarketController.createLeave);
CenterRoute.get('/leaves-form', MarketController.getAllLeaves);
CenterRoute.put('/leaves-form/:id', MarketController.updateLeave);
CenterRoute.delete('/leaves-form/:id', MarketController.deleteLeave);
// New Routes for Prospects, Demo, Notes, and Referrals
CenterRoute.put('/prospect-status/:id', MarketController.updateProspectStatus);

CenterRoute.put('/enquiry-status/:id', MarketController.updateEnquiryStatus);
CenterRoute.post('/attendance/mark', MarketController.createAttendance);
CenterRoute.get('/attendance/', MarketController.fetchAttendance)
CenterRoute.put('/schedule-demo/:id', MarketController.scheduleDemo);
CenterRoute.put('/add-notes/:id', MarketController.addNotes);
CenterRoute.put('/refer-to-friend/:id', MarketController.referToFriend);

module.exports = CenterRoute;
