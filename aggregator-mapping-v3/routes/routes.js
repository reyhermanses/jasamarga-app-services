var express = require("express");
var router = express.Router();
require("express-router-group");
// ---------- VALIDATION ----------
const loginValidation = require("../app/validation/auth/login.validation");
const employeeInputValidation = require("../app/validation/employee/input.validation");
const historyJabatanInputValidation = require("../app/validation/history_jabatan/input.validation");
const educationInputValidation = require("../app/validation/education/input.validation");
const familyInputValidation = require("../app/validation/family/input.validation");
const profileInputValidation = require("../app/validation/profile/input.validation");
const hobbyInputValidation = require("../app/validation/hobby/input.validation");
const trainingInputValidation = require("../app/validation/training/input.validation");
const skillInputValidation = require("../app/validation/skill/input.validation");
const employeePositionValidation = require("../app/validation/employee_position/input.validation");
const kecamatanValidation = require("../app/validation/master/masterKecamatan.validation");
const kelurahanValidation = require("../app/validation/master/masterKelurahan.validation");
const orgValidation = require("../app/validation/organization_hierarchy/input.validation");
const mobilityValidation = require("../app/validation/mobility/mobility.validation");
const jmClickHistoryJabatanValidation = require("../app/validation/history_jabatan/jmClick.validation");
const orgFormationValidation = require("../app/validation/org_formation/org_formation.validation");
const redisHandler = require("../app/handler/resetRedis.handler");
const checkProfile = require("../app/handler/checkProfile.handler");

// ---------- AUTH ----------
const auth = require("../app/handler/auth/auth.handler");
const authAlternate = require("../app/handler/auth/auth_alternate.handler");

// ---------- MIDDLEWARE ----------
const secure = require("../app/middlewares/secure");
const fileHelper = require("../app/middlewares/fileHelper");
const checkRequester = require("../app/middlewares/apiKeyCheck");

// ---------- HANDLER ----------
const organizationHierarchy = require("../app/handler/organizationHierarchy.handler");
const employee = require("../app/handler/employee.handler");
const historyJabatan = require("../app/handler/historyJabatan.handler");
const education = require("../app/handler/education.handler");
const family = require("../app/handler/family.handler");
const profile = require("../app/handler/profile.handler");
const file = require("../app/handler/file.handler");
const masaKerja = require("../app/handler/masaKerja.handler");
const hobby = require("../app/handler/hobby.handler");
const training = require("../app/handler/training.handler");
const user = require("../app/handler/jm_click/user.handler");
const payslip = require("../app/handler/payslip.handler");
const espt = require("../app/handler/espt.handler");
const objectRelation = require("../app/handler/sapObjectRelation.handler");
const skill = require("../app/handler/skill.handler");
const santunanDuka = require("../app/handler/santunanDuka.handler");
const bankDetail = require("../app/handler/bank_detail.handler");
const mandatoryColumn = require("../app/handler/mandatoryColumn.handler");
const employeePosition = require("../app/handler/employeePosition.handler");
const kecamatan = require("../app/handler/master/masterKecamatan.handler");
const kelurahan = require("../app/handler/master/masterKelurahan.handler");
const mobility = require("../app/handler/mobility.handler");
const template = require("../app/handler/template.handler");
const orgFormation = require("../app/handler/orgFormation.handler");

router.group("/auth", (router) => {
  router.post(
    "/login",
    checkRequester.checkRequester,
    loginValidation.validate(),
    auth.login
  );

  router.post(
    "/temporary_login",
    checkRequester.checkRequester,
    loginValidation.validate(),
    auth.temporaryLogin
  );

  router.post(
    "/alternate_login",
    checkRequester.checkRequester,
    authAlternate.login
  );

  router.post(
    "/refresh_token",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    authAlternate.refreshToken
  );

  router.post(
    "/migrate",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    fileHelper.uploadToDisk,
    auth.migrate
  );
});

router.group("/object_relation", (router) => {
  router.get("/:changedate", objectRelation.getByChangedate);
});

router.group("/employee_file", (router) => {
  router.get("/", checkRequester.checkRequester, file.getAll);
  // router.post('/profile')
});

router.group("/hobby", (router) => {
  router.get("/", checkRequester.checkRequester, hobby.getAll);
  router.post(
    "/",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    hobbyInputValidation.validate("create"),
    hobby.create
  );
  router.put(
    "/:id",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    hobbyInputValidation.validate("update"),
    hobby.update
  );
  router.delete(
    "/:id",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    hobby.destroy
  );
});

router.group("/user", (router) => {
  router.get("/", checkRequester.checkRequester, user.getAll);
  router.get("/sync", checkRequester.checkRequester, user.sync);
});

router.group("/training", (router) => {
  router.get("/", checkRequester.checkRequester, training.getAll);
  router.post(
    "/",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    trainingInputValidation.validate("create"),
    training.create
  );
  router.put(
    "/:id",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    trainingInputValidation.validate("update"),
    training.update
  );
  router.delete(
    "/:id",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    training.destroy
  );
  router.get(
    "/getHistory",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    training.getExcelHistory
  );
});

router.group("/wilayah", (router) => {
  router.group("/kecamatan", (router) => {
    router.get("/", checkRequester.checkRequester, kecamatan.getAll);
    router.get("/:id", checkRequester.checkRequester, kecamatan.getOneById);
    router.post(
      "/",
      checkRequester.checkRequester,
      kecamatanValidation.validate("create"),
      kecamatan.create
    );
    router.put(
      "/:id",
      checkRequester.checkRequester,
      kecamatanValidation.validate("update"),
      kecamatan.update
    );
    router.delete("/:id", checkRequester.checkRequester, kecamatan.destroy);
  });

  router.group("/kelurahan", (router) => {
    router.get("/", checkRequester.checkRequester, kelurahan.getAll);
    router.get("/:id", checkRequester.checkRequester, kelurahan.getOneById);
    router.post(
      "/",
      checkRequester.checkRequester,
      kelurahanValidation.validate("create"),
      kelurahan.create
    );
    router.put(
      "/:id",
      checkRequester.checkRequester,
      kelurahanValidation.validate("update"),
      kelurahan.update
    );
    router.delete("/:id", checkRequester.checkRequester, kelurahan.destroy);
  });
});

router.group("/organization_hierarchy", (router) => {
  router.get("/", checkRequester.checkRequester, organizationHierarchy.getAll);
  router.get(
    "/position",
    checkRequester.checkRequester,
    organizationHierarchy.getAllByPosition
  );
  router.get(
    "/formation",
    checkRequester.checkRequester,
    organizationHierarchy.getFormation
  );
  router.put(
    "/org_formation",
    checkRequester.checkRequester,
    orgFormationValidation.validate(),
    orgFormation.upsert
  );
  router.get(
    "/org_filter_formation",
    checkRequester.checkRequester,
    orgValidation.validate("filter"),
    organizationHierarchy.getFilterFormation
  );
  router.get(
    "/:id",
    checkRequester.checkRequester,
    organizationHierarchy.getOne
  );
  router.put(
    "/:id",
    checkRequester.checkRequester,
    orgValidation.validate("update"),
    organizationHierarchy.update
  );
});

router.group("/masa_kerja", (router) => {
  router.get("/", checkRequester.checkRequester, masaKerja.getAll);
  router.get("/sync", checkRequester.checkRequester, masaKerja.sync);
});

router.group("/file", (router) => {
  router.get("/", fileHelper.previewFile);
  router.get("/download", fileHelper.downloadFile);
  router.get("/getTemplate", fileHelper.getTemplate);
  router.post(
    "/getTemplateMaster",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    template.getMaster
  );
  router.post(
    "/upload",
    checkRequester.checkRequester,
    fileHelper.uploadAttachment,
    file.uploadAttachment
  );

  router.post(
    "/getTemplateMasterPosition",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    template.getMasterPosition
  );
});

router.group("/employee", (router) => {
  router.get("/", checkRequester.checkRequester, employee.getAll);
  router.get("/import_master", template.getMaster);
  router.post(
    "/mass_upload",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    fileHelper.uploadToDisk,
    employee.createMass
  );
  router.get("/jm-arsip", checkRequester.checkRequester, mandatoryColumn.get);
  router.group("/organization", (router) => {
    router.get("/", checkRequester.checkRequester, employee.getByOrg);
    router.get("/:id", checkRequester.checkRequester, employee.getOneByOrg);
  });
  router.group("/organization-unit", (router) => {
    router.get("/", checkRequester.checkRequester, employee.getByOrgLearning);
    // router.get(
    //   "/:id",
    //   checkRequester.checkRequester,
    //   employee.getOneByOrgLearning
    // );
  });
  router.group("/company", (router) => {
    router.get("/", checkRequester.checkRequester, employee.getByCompany);
    router.get("/:id", checkRequester.checkRequester, employee.getOneByCompany);
  });
  router.get("/:id", checkRequester.checkRequester, employee.getOne);
  router.get(
    "/hierarchy/:id",
    checkRequester.checkRequester,
    employee.getByHierarchy
  );
  router.get(
    "/jabatan/:id",
    checkRequester.checkRequester,
    employee.getOneByJabatan
  );
  router.delete(
    "/:id",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    employee.destroy
  );
  router.post(
    "/",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    employeeInputValidation.validate("create"),
    employee.create
  );
  router.post(
    "/mass",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    fileHelper.uploadToDisk,
    employee.createMass
  );
  router.put(
    "/:id",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    employeeInputValidation.validate("update"),
    employee.update
  );
});

router.get(
  "/employee-learning",
  checkRequester.checkRequester,
  employee.getEmployeeLearning
);
router.group("/family", (router) => {
  router.get("/", checkRequester.checkRequester, family.getAll);
  // checkRequester.checkJMCLICK,
  //   fileHelper.streamFormJmClickUpdateMobility,
  //   jmClickHistoryJabatanValidation.validate("update"),
  //   mobility.paramsValidation,
  //   mobility.updateHistoryJabatanJmClick
  router.post(
    "/",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    fileHelper.streamFormJmClickUpdateFamily,
    familyInputValidation.validate("create"),
    family.paramsValidation,
    family.create
  );
  router.put(
    "/:id",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    fileHelper.streamFormJmClickUpdateFamily,
    familyInputValidation.validate("update"),
    family.paramsValidation,
    family.update
  );
  router.get("/:id", checkRequester.checkRequester, family.getOne);
  router.delete(
    "/:id",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    family.destroy
  );
});

router.group("/profile", (router) => {
  router.get("/", checkRequester.checkRequester, profile.getAll);
  router.get(
    "/:id",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    profile.getOne
  );
  router.post(
    "/",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    profileInputValidation.validate("create"),
    profile.create
  );
  router.put(
    "/:id",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    profileInputValidation.validate("update"),
    profile.update
  );
  router.delete(
    "/:id",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    profile.destroy
  );
});

router.group("/education", (router) => {
  router.get("/", checkRequester.checkRequester, education.getAll);
  router.get("/:id", checkRequester.checkRequester, education.getOne);
  router.post(
    "/",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    educationInputValidation.validate("create"),
    education.create
  );
  router.put(
    "/:id",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    educationInputValidation.validate("update"),
    education.update
  );
  router.delete(
    "/:id",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    education.destroy
  );
});

router.group("/history_jabatan", (router) => {
  router.get("/", checkRequester.checkRequester, historyJabatan.getAll);
  router.post(
    "/",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    historyJabatanInputValidation.validate("create"),
    historyJabatan.create
  );
  router.put(
    "/jm_click/:id",
    checkRequester.checkJMCLICK,
    fileHelper.streamFormJmClickUpdateMobility,
    jmClickHistoryJabatanValidation.validate("update"),
    mobility.paramsValidation,
    mobility.updateHistoryJabatanJmClick
  );
  router.delete(
    "/jm_click/:id",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    historyJabatan.destroy
  );
  router.put(
    "/:id",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    historyJabatanInputValidation.validate("update"),
    historyJabatan.update
  );
  router.delete(
    "/:id",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    historyJabatan.destroy
  );
});

router.group("/skill", (router) => {
  router.get("/", checkRequester.checkRequester, skill.getAll);
  router.post(
    "/",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    skillInputValidation.validate("create"),
    skill.create
  );
  router.put(
    "/:id",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    skillInputValidation.validate("update"),
    skill.update
  );
  router.delete(
    "/:id",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    skill.destroy
  );
});

router.group("/payslip", (router) => {
  router.post("/", checkRequester.checkRequester, payslip.getSAP);
  router.post(
    "/offcycle",
    checkRequester.checkRequester,
    payslip.getSapOffcycle
  );
  router.get("/", checkRequester.checkRequester, payslip.getAll);
  router.post(
    "/status",
    checkRequester.checkRequester,
    payslip.getReqIsPublish
  );
});

router.group("/santunan-duka", (router) => {
  router.post("/", checkRequester.checkRequester, santunanDuka.handlerSap);
});

router.group("/bank-details", (router) => {
  router.post("/", checkRequester.checkRequester, bankDetail.handlerSap);
});

router.group("/espt", (router) => {
  router.get("/cron-job", checkRequester.checkRequester, espt.handlerSap);
  router.get("/", checkRequester.checkRequester, espt.getAll);
});

router.group("/employee_position", (router) => {
  router.get("/", checkRequester.checkRequester, employeePosition.get);
  router.post(
    "/",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    employeePositionValidation.validate("create"),
    employeePosition.create
  );
  router.put(
    "/:id",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    employeePositionValidation.validate("update"),
    employeePosition.update
  );
  router.delete(
    "/:id",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    employeePosition.destroy
  );
});

router.group("/mobility", (router) => {
  router.post(
    "/cycle",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    mobilityValidation.validate("promosi-demosi-rotasi"),
    mobility.generatePromosiRotasiDemosi
  );
  router.post(
    "/end",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    mobilityValidation.validate("terminate-promosi"),
    mobility.genratePensiunTerminate
  );
  router.post(
    "/rangkap",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    mobilityValidation.validate("rangkap"),
    mobility.rangkap
  );
});

router.get(
  "/reset-redis",
  checkRequester.checkRequester,
  redisHandler.resetRedis
);

router.group("/check_profile", (router) => {
  router.get("/", checkRequester.checkRequester, checkProfile.get);
  router.get("/:id", checkRequester.checkRequester, checkProfile.getById);
});

module.exports = router;
