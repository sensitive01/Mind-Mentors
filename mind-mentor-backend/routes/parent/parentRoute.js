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







parentRoute.post("/login",parentController.parentLogin)
parentRoute.post("/verify-otp",parentController.parentVerifyOtp)
parentRoute.post("/parent-kids-registration",parentController.parentStudentRegistration)
parentRoute.post("/parent-book-demo-class",parentController.parentBookDemoClass)
parentRoute.post("/manage-child-pin/:id",parentController.changeChildPin)
parentRoute.post("/book-new-demo-class/:kidId",parentController.parentBookNewDemoClass)
parentRoute.post("/add-new-kid/:parentId",parentController.parentAddNewKid)
parentRoute.post("/save-kid-availability/:kidId",parentController.saveKidAvailability)


parentRoute.put("/update-kid-availability/:availId",parentController.updateKidAvailability)
parentRoute.put("/update-kid-availability-status/:availId",parentController.updateKidAvailabilityStatus)


parentRoute.delete("/delete-kid-availability/:availId",parentController.deleteKidAvailabilityStatus)
















parentRoute.get("/get-child-data-profile-management/:kidId",parentController.getKidData)
parentRoute.post("/edit-child-data-profile-management/:kidId",parentController.editKidData)

parentRoute.get("/get-parent-data-profile-management/:parentId",parentController.getParentData)
parentRoute.post("/edit-parent-data-profile-management/:parentId",parentController.editParentData)


















module.exports =  parentRoute