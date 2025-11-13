const express = require("express")
const kimsRoute = express()
const kimsKidDataController = require("../../controller/kimsController/oldData/getExistingKidDataController")


kimsRoute.get("/get-kims-kid-data",kimsKidDataController.getKimsKidData)

module.exports = kimsRoute