const express = require("express");
const coachRoute = express();
const coachController = require('../../controller/coach/coachController');




coachRoute.post("/shedule-class-availability/:id",coachController.saveCoachAvailability)
coachRoute.get("/fetch-my-sheduled-class/:id",coachController.getMyScheduledClasses)
coachRoute.post("/add-class-feedback-attandance/:coachId/:classId",coachController.addFeedBackAndAttandance)
coachRoute.get("/get-class-data/:classId",coachController.getClassData)



// coachRoute.get("/fetch-coach-availability",coachController.getAvailableCoach)








// Email & Password Verification
// CoachRoute.post('/email-verification', CoachController.operationEmailVerification);
// CoachRoute.post('/password-verification', CoachController.operationPasswordVerification);

// // Enquiry Form CRUD
// CoachRoute.post('/enquiry-form', CoachController.enquiryFormData);
// CoachRoute.get('/enquiry-form', CoachController.getAllEnquiries);
// CoachRoute.put('/enquiry-form/:id', CoachController.updateEnquiry);
// CoachRoute.delete('/enquiry-form/:id', CoachController.deleteEnquiry);
// // Enquiry Form CRUD
// CoachRoute.post('/leaves-form', CoachController.createLeave);
// CoachRoute.get('/leaves-form', CoachController.getAllLeaves);
// CoachRoute.put('/leaves-form/:id', CoachController.updateLeave);
// CoachRoute.delete('/leaves-form/:id', CoachController.deleteLeave);
// // New Routes for Prospects, Demo, Notes, and Referrals
// CoachRoute.put('/prospect-status/:id', CoachController.updateProspectStatus);

// CoachRoute.put('/enquiry-status/:id', CoachController.updateEnquiryStatus);
// // CoachRoute.post('/attendance/mark', CoachController.createAttendance);
// // CoachRoute.get('/attendance/', CoachController.fetchAttendance)
// CoachRoute.put('/schedule-demo/:id', CoachController.scheduleDemo);
// CoachRoute.put('/add-notes/:id', CoachController.addNotes);
// CoachRoute.put('/refer-to-friend/:id', CoachController.referToFriend);

module.exports = coachRoute;
