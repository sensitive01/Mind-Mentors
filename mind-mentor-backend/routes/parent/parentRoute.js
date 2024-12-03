const express = require("express");
const parentRoute = express();
const parentController =require("../../controller/parent/parentController")


parentRoute.post("/login",parentController.parentLogin)

parentRoute.post("/verify-otp",parentController.parentVerifyOtp)

parentRoute.post("/parent-kids-registration",parentController.parentStudentRegistration)

parentRoute.post("/parent-book-demo-class",parentController.parentBookDemoClass)

parentRoute.get("/get-kids-data/:id",parentController.getKidsDataList)

parentRoute.get("/manage-child-login/:id",parentController.getChildData)

parentRoute.post("/manage-child-pin/:id",parentController.changeChildPin)

parentRoute.get("/get-demo-class-data/:kidId",parentController.getDemoClassDetails)
parentRoute.post("/book-new-demo-class/:kidId",parentController.parentBookNewDemoClass)

parentRoute.post("/add-new-kid/:parentId",parentController.parentAddNewKid)


parentRoute.get("/getprofiledata/:parentId",parentController.getParentProfileData)











parentRoute.get("/get-child-data-profile-management/:kidId",parentController.getKidData)
parentRoute.post("/edit-child-data-profile-management/:kidId",parentController.editKidData)

parentRoute.get("/get-parent-data-profile-management/:parentId",parentController.getParentData)
parentRoute.post("/edit-parent-data-profile-management/:parentId",parentController.editParentData)


















module.exports =  parentRoute