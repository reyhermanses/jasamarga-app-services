var express = require("express");
var router = express.Router();
require("express-router-group");

// ---------- AUTH ----------
const auth = require("../app/handler/auth/auth.handler");

// ---------- MIDDLEWARE ----------
const secure = require("../app/middlewares/secure");
const checkRequester = require("../app/middlewares/apiKeyCheck");

// ---------- HANDLERS ----------
const employee = require("../app/handler/employeeV2.handler");
const family = require("../app/handler/family.handler");

// ---------- ROUTES ----------
router.group("/employee", (router) => {
  router.get("/getall", checkRequester.checkRequester, employee.getAll);
  router.get("/getById/:id", checkRequester.checkRequester, employee.getByID);
  router.get(
    "/hierarchy/atasan",
    checkRequester.checkRequester,
    employee.getAtasan
  );
  router.get(
    "/hierarchy/bawahan",
    checkRequester.checkRequester,
    employee.getBawahan
  );
  router.get("/organization", checkRequester.checkRequester, employee.getCount);
  router.get("/family", checkRequester.checkRequester, family.getAllAlternate);
});

module.exports = router;
