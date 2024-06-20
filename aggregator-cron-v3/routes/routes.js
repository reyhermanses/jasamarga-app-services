const express = require("express");
const router = express.Router();
require("express-router-group");

// LIST JALANKAN OTOMATIS JAM 2
const autoCron2AM = require("../app/cronjob/cronjobList");

// LIST JALANKAN SEMUA MANUAL
const autoCron = require("../app/handlers/autoCron.handler");

// LIST JALANKAN MANUAL SATU-SATU
const OmActionHandler = require("../app/handlers/omAction.handler");
const ApproverHandler = require("../app/handlers/approver.handler");
const EducationHandler = require("../app/handlers/education.handler");
const FamilyHandler = require("../app/handlers/family.handler");
const masaKerjaHandler = require("../app/handlers/masaKerja.handler");
const profileHandler = require("../app/handlers/profile.handler");
const orgHandler = require("../app/handlers/organization.handler");
const OmAction3Handler = require("../app/handlers/omAction3.handler");
const payslipHandler = require("../app/handlers/payslip.handler");
const bankDetailHandler = require("../app/handlers/bank_detail.handler");
const esptHandler = require("../app/handlers/espt.handler");
const santunanHandler = require("../app/handlers/santunanDuka.handler");
const pendingRequest = require("../app/handlers/pendingRequest.handler");
const masaKerja = require("../app/handlers/masaKerja.handler");
const hrdHisSertifikasi = require("../app/handlers/hrdHisSertifikasi.handler");
const hrdHisSertifikasiFiles = require("../app/handlers/hrdHisSertifikasiFiles.handler");

router.get("/auto-2am", autoCron2AM.cronList);
router.get("/auto", autoCron.launch);

router.get("/om-action", OmActionHandler.get);
router.get("/om-action-3", OmAction3Handler.get);
router.get("/approver", ApproverHandler.get);
router.get("/education", EducationHandler.get);
router.get("/family", FamilyHandler.get);
router.get("/masa-kerja", masaKerjaHandler.get);
router.get("/org-leader", orgHandler.get);
router.get("/org-hierarchy", orgHandler.getHierarchy)
router.get("/pending-requests", pendingRequest.getCurrent);
router.get("/sertifikasi", hrdHisSertifikasi.get);
router.get("/sertifikasi_files", hrdHisSertifikasiFiles.get);

router.group("/profile", (router) => {
  router.get("/sync", profileHandler.get);
  router.get("/personal-data", profileHandler.getPersonalData)
  router.get("/personal-id", profileHandler.getPersonalID)
  router.get("/address", profileHandler.getAddress)
  router.get("/tax-id", profileHandler.getTax)
  router.get("/bpjs-kes", profileHandler.getBPJSKes)
  router.get("/bpjs-tk", profileHandler.getBPJSTK)
});

router.group("/payslip", (router) => {
  router.post("/", payslipHandler.get);
  router.post("/offcycle/", payslipHandler.getOffcycle);
  router.post("/doucble-offcycle/", payslipHandler.getDoubleOffcycle);
});

router.post("/bank-details", bankDetailHandler.handlerSap);

router.get("/espt", esptHandler.handlerSap);

router.post("/santunan-duka", santunanHandler.handlerSap);

router.get("/masa-kerja", masaKerja.get);

module.exports = router;
