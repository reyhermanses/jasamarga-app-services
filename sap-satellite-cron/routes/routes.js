const express = require("express");
const router = express.Router();

const OmActionHandler = require("../app/handlers/om_action.handler");
const ApproverHandler = require("../app/handlers/approver.handler");
const OrgHandler = require("../app/handlers/org.handler");
const FamilyHandler = require("../app/handlers/family.handler");
const EducationHandler = require("../app/handlers/education.handler");
const DocumentHandler = require("../app/handlers/document.handler");
const PersonalDataHandler = require("../app/handlers/personalData.handler");
const PersonalIDHandler = require("../app/handlers/personalID.handler");
const TaxIDHandler = require("../app/handlers/taxID.handler");
const AddressHandler = require("../app/handlers/address.handler");
const BasicPayHandler = require("../app/handlers/basicPay.handler");
const BpjsKes = require("../app/handlers/bpjsKes.handler");
const BpjsTK = require("../app/handlers/bpjsTK.handler");
const omAction3Handler = require("../app/handlers/om_action_3.handler");
const payslipHandler = require("../app/handlers/payslip.handler");
const Trigger = require("../app/cronjob/cronjob_list");

router.get("/org", OrgHandler.transfer);
router.get("/om-action", OmActionHandler.transfer);
router.get("/om-action-3-19", omAction3Handler.transfer19);
router.get("/approver", ApproverHandler.transfer);
router.get("/bpjsKes", BpjsKes.transfer);
router.get("/bpjsTK", BpjsTK.transfer);
router.get("/family", FamilyHandler.transfer);
router.get("/education", EducationHandler.transfer);
router.get("/document", DocumentHandler.transfer);
router.get("/personalData", PersonalDataHandler.transfer);
router.get("/personalID", PersonalIDHandler.transfer);
router.get("/taxID", TaxIDHandler.transfer);
router.get("/address", AddressHandler.transfer);
router.get("/basicPay", BasicPayHandler.transfer);
router.get("/payslip", payslipHandler.transfer);
router.get("/trigger", Trigger.cronList);

module.exports = router;
