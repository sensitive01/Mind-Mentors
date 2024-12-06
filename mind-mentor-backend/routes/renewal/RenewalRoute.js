const express = require('express');
const RenewalRoute = express.Router();
const MarketController = require('../../controller/renewal/renewalController');

// Email & Password Verification
RenewalRoute.post('/email-verification', MarketController.operationEmailVerification);
RenewalRoute.post('/password-verification', MarketController.operationPasswordVerification);

// Enquiry Form CRUD
RenewalRoute.post('/enquiry-form', MarketController.enquiryFormData);
RenewalRoute.get('/enquiry-form', MarketController.getAllEnquiries);
RenewalRoute.put('/enquiry-form/:id', MarketController.updateEnquiry);
RenewalRoute.delete('/enquiry-form/:id', MarketController.deleteEnquiry);
// Enquiry Form CRUD
RenewalRoute.post('/leaves-form', MarketController.createLeave);
RenewalRoute.get('/leaves-form', MarketController.getAllLeaves);
RenewalRoute.put('/leaves-form/:id', MarketController.updateLeave);
RenewalRoute.delete('/leaves-form/:id', MarketController.deleteLeave);
// New Routes for Prospects, Demo, Notes, and Referrals
RenewalRoute.put('/prospect-status/:id', MarketController.updateProspectStatus);

RenewalRoute.put('/enquiry-status/:id', MarketController.updateEnquiryStatus);
RenewalRoute.post('/attendance/mark', MarketController.createAttendance);
RenewalRoute.get('/attendance/', MarketController.fetchAttendance)
RenewalRoute.put('/schedule-demo/:id', MarketController.scheduleDemo);
RenewalRoute.put('/add-notes/:id', MarketController.addNotes);
RenewalRoute.put('/refer-to-friend/:id', MarketController.referToFriend);

module.exports = RenewalRoute;
