const express = require("express");
const operationRoute = express();

const operationController = require("../../../controller/employee/operation-dept/oprationDeptController")


operationRoute.post("/email-verification",operationController.operationEmailVerification)
operationRoute.post("/password-verification",operationController.operationPasswordVerification)


operationRoute.post("/enquiry-form",operationController.enquiryFormData)




module.exports = operationRoute






