const express = require("express");
const parentRoute = express();
const parentController =require("../../controller/parent/parentController")




parentRoute.get("/get-kids-data/:id",parentController.getKidsDataList)
parentRoute.get("/manage-child-login/:id",parentController.getChildData)
parentRoute.get("/get-demo-class-data/:kidId",parentController.getDemoClassDetails)
parentRoute.get("/getprofiledata/:parentId",parentController.getParentProfileData)
parentRoute.get("/get-kid-demo-class-details/:kidId",parentController.getKidDemoClassDetails)
parentRoute.get("/get-kid-availability/:kidId",parentController.getKidAvailability)
parentRoute.get("/get-kid-class-data/:kidId",parentController.getKidClassData)
parentRoute.get("/get-kid-attandance-data/:kidId",parentController.getKidClassAttendanceData) 
parentRoute.get("/get-payment-notification-data/:kidId/:parentId",parentController.getPaymentNotificationData) 
parentRoute.get("/get-paid-payment-information/:kidId",parentController.getKidPaidFeeData) 
parentRoute.get("/get-kid-data/:kidId",parentController.getParentKidData) 
parentRoute.get("/get-kid-enquiry-status/:kidId",parentController.getKidEnquiryStatus) 
parentRoute.get("/get-my-kid-data/:parentId",parentController.getMyKidData) 
parentRoute.get("/get-kid-live-class/:kidId",parentController.getKidTodayClass) 
parentRoute.get("/get-enqId-of-kid/:kidId",parentController.getTheKidEnqId) 
parentRoute.get("/get-parent-package-data",parentController.getThePackageData)
parentRoute.get("/get-kid-belong-to-data-support/:parentId",parentController.getKidDataParentBelongsTo)
parentRoute.get("/get-all-ticket-of-parent/:parentId",parentController.getAllTicketOfParent)
parentRoute.get("/get-my-referal-data/:referalId",parentController.getMyReferalData)
parentRoute.get("/get-my-selected-package-data/:parentId/:kidId",parentController.getMyselectedPackageData)
parentRoute.get("/get-kid-exist-program-data/:kidId",parentController.getKidExistProgramData)
parentRoute.get("/get-conducted-class-details/:kidId",parentController.getConductedClassDetails)
parentRoute.get("/get-my-name/:parentId",parentController.getMyName)
parentRoute.get("/get-kid-shedule-demo-details/:kidId",parentController.getParentSheduleDemoDetails)













parentRoute.post("/parent-submit-enquiry-form",parentController.parentSubmitEnquiryForm)
parentRoute.post("/login",parentController.parentLogin)
parentRoute.post("/verify-otp",parentController.parentVerifyOtp)
parentRoute.post("/parent-kids-registration",parentController.parentStudentRegistration)
parentRoute.post("/parent-book-demo-class",parentController.parentBookDemoClass)
parentRoute.post("/manage-child-pin/:id",parentController.changeChildPin)
parentRoute.post("/book-new-demo-class/:kidId",parentController.parentBookNewDemoClass)
parentRoute.post("/add-new-kid/:parentId",parentController.parentAddNewKid)
parentRoute.post("/save-kid-availability/:kidId",parentController.saveKidAvailability)
parentRoute.post("/save-payment-information-data/:parentId",parentController.savePaymentData)
parentRoute.post("/send-selected-package/:parentId",parentController.parentSelectThePackage)
parentRoute.post("/parent-add-new-kid-data/:parentId",parentController.parentAddNewKidData)
parentRoute.post("/parent-save-kid-name",parentController.parentSaveKidData)
parentRoute.post("/create-ticket-for-parent",parentController.createTicketForParent)
parentRoute.put("/update-ticket-chats/:ticketId",parentController.updateSupportChats)
parentRoute.post("/send-referal-data/:parentId",parentController.sendReferalData)
parentRoute.post("/save-program-level/:kidId",parentController.saveProgramAndLevel)
parentRoute.post("/book-demo-class-data/:kidId",parentController.parentBookDemoClassData)










parentRoute.put("/end-selected-chat/:ticketId",parentController.endSelectedChat)
parentRoute.put("/update-kid-availability/:availId",parentController.updateKidAvailability)
parentRoute.put("/update-kid-availability-status/:availId",parentController.updateKidAvailabilityStatus)
parentRoute.put("/parent-book-demo-class-in-profile/:kidId",parentController.parentBookDemoClassInProfile)
parentRoute.put("/update-my-name/:parentId",parentController.updateMyName)





parentRoute.delete("/delete-kid-availability/:availId",parentController.deleteKidAvailabilityStatus)
















parentRoute.get("/get-child-data-profile-management/:kidId",parentController.getKidData)
parentRoute.post("/edit-child-data-profile-management/:kidId",parentController.editKidData)

parentRoute.get("/get-parent-data-profile-management/:parentId",parentController.getParentData)
parentRoute.put("/edit-parent-data-profile-management/:parentId",parentController.editParentData)


















module.exports =  parentRoute