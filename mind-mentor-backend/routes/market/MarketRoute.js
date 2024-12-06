const express = require('express');
const MarketRoute = express.Router();
const MarketController = require('../../controller/marketassociate/marketingController');

// Email & Password Verification
MarketRoute.post('/email-verification', MarketController.operationEmailVerification);
MarketRoute.post('/password-verification', MarketController.operationPasswordVerification);

// Enquiry Form CRUD
MarketRoute.post('/enquiry-form', MarketController.enquiryFormData);
MarketRoute.get('/enquiry-form', MarketController.getAllEnquiries);
MarketRoute.put('/enquiry-form/:id', MarketController.updateEnquiry);
MarketRoute.delete('/enquiry-form/:id', MarketController.deleteEnquiry);
// Enquiry Form CRUD
MarketRoute.post('/leaves-form', MarketController.createLeave);
MarketRoute.get('/leaves-form', MarketController.getAllLeaves);
MarketRoute.put('/leaves-form/:id', MarketController.updateLeave);
MarketRoute.delete('/leaves-form/:id', MarketController.deleteLeave);
// New Routes for Prospects, Demo, Notes, and Referrals
MarketRoute.put('/prospect-status/:id', MarketController.updateProspectStatus);

MarketRoute.put('/enquiry-status/:id', MarketController.updateEnquiryStatus);
MarketRoute.post('/attendance/mark', MarketController.createAttendance);
MarketRoute.get('/attendance/', MarketController.fetchAttendance)
MarketRoute.put('/schedule-demo/:id', MarketController.scheduleDemo);
MarketRoute.put('/add-notes/:id', MarketController.addNotes);
MarketRoute.put('/refer-to-friend/:id', MarketController.referToFriend);

module.exports = MarketRoute;
