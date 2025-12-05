const express = require("express");
const { globalSearch } = require("../../../controller/employee/operation-dept/globalSearchController");
const globalSerchRouter = express.Router();

// ✅ GLOBAL SEARCH ROUTE
globalSerchRouter.get("/global-search", globalSearch);

module.exports = globalSerchRouter;
