var express = require("express");
var masterRouter = express.Router();
require("express-router-group");

// AUTH MIDDLEWARE
const secure = require("../app/middlewares/secure");
const checkRequester = require("../app/middlewares/apiKeyCheck");
const fileHelper = require("../app/middlewares/fileHelper");

// VALIDATOR
const masterEmployeeGroupValidation = require("../app/validation/master/masterEmployeeGroup.validation");
const masterEmployeeSubGroupValidation = require("../app/validation/master/masterEmployeeSubGroup.validation");
const masterBidangValidation = require("../app/validation/master/masterBidang.validation");
const masterJobValidation = require("../app/validation/master/masterJob.validation");
const masterCompanyValidation = require("../app/validation/master/masterCompany.validation");
const masterPersonalAreaValidation = require("../app/validation/master/masterPersonalArea.validation");
const masterPersonalSubAreaValidation = require("../app/validation/master/masterPersonalSubArea.validation");
const masterPositionValidation = require("../app/validation/master/masterPosition.validation");
const masterCountryValidation = require("../app/validation/master/masterCountry.validation");
const masterJobFunctionValidation = require("../app/validation/master/masterJobFunction.validation");
const masterProvinceValidation = require("../app/validation/master/masterProvince.validation");
const masterCityValidation = require("../app/validation/master/masterCity.validation");
const masterReligionValidation = require("../app/validation/master/masterReligion.validation");
const masterBankKeyValidation = require("../app/validation/master/masterBankKey.validation");
const masterBusinessAreaValidation = require("../app/validation/master/masterBusinessArea.validation");
const masterClusterValidation = require("../app/validation/master/masterCluster.validation");
const masterJenjangPendidikanValidation = require("../app/validation/master/masterJenjangPendidikan.validation");
const masterJurusanPendidikanValidation = require("../app/validation/master/masterJurusanPendidikan.validation");
const masterLayerValidation = require("../app/validation/master/masterLayer.validation");
const masterMutasiValidation = require("../app/validation/master/masterMutasi.validation");
const masterStatusKeluargaValidation = require("../app/validation/master/masterStatusKeluarga.validation");
const masterSubClusterValidation = require("../app/validation/master/masterSubCluster.validation");
const masterInstansiPendidikanValidation = require("../app/validation/master/masterInstansiPendidikan.validation");
const masterGelarPendidikanValidation = require("../app/validation/master/masterGelarPendidikan.validation");
const masterFakultasPendidikanValidation = require("../app/validation/master/masterFakultasPendidikan.validation");
const masterGradeLevelValidation = require("../app/validation/master/masterGradeLevel.validation");

// MASTER
const masterEmployeeGroup = require("../app/handler/master/masterEmployeeGroup.handler");
const masterBankKey = require("../app/handler/master/masterBankKey.handler");
const masterEmployeeSubGroup = require("../app/handler/master/masterEmployeeSubGroup.handler");
const masterBidang = require("../app/handler/master/masterBidang.handler");
const masterJob = require("../app/handler/master/masterJob.handler");
const masterCompany = require("../app/handler/master/masterCompany.handler");
const masterPersonalArea = require("../app/handler/master/masterPersonalArea.handler");
const masterPersonalSubArea = require("../app/handler/master/masterPersonalSubArea.handler");
const masterPosition = require("../app/handler/master/masterPosition.handler");
const masterCountry = require("../app/handler/master/masterCountry.handler");
const masterJobFunction = require("../app/handler/master/masterJobFunction.handler");
const masterProvince = require("../app/handler/master/masterProvince.handler");
const masterCity = require("../app/handler/master/masterCity.handler");
const masterReligion = require("../app/handler/master/masterReligion.handler");
const masterBusinessArea = require("../app/handler/master/masterBusinessArea.handler");
const masterCluster = require("../app/handler/master/masterCluster.handler");
const masterJenjangPendidikan = require("../app/handler/master/masterJenjangPendidikan.handler");
const masterJurusanPendidikan = require("../app/handler/master/masterJurusanPendidikan.handler");
const masterLayer = require("../app/handler/master/masterLayer.handler");
const masterMutasi = require("../app/handler/master/masterMutasi.handler");
const masterStatusKeluarga = require("../app/handler/master/masterStatusKeluarga.handler");
const masterSubCluster = require("../app/handler/master/masterSubCluster.handler");
const masterInstansiPendidikan = require("../app/handler/master/masterInstansiPendidikan.handler");
const masterGelarPendidikan = require("../app/handler/master/masterGelarPendidikan.handler");
const masterFakultasPendidikan = require("../app/handler/master/masterFakultasPendidikan.handler");
const masterGradeLevel = require("../app/handler/master/masterGradeLevel.handler");

masterRouter.group("/instansi_pendidikan", (router) => {
  router.get(
    "/",
    checkRequester.checkRequester,
    masterInstansiPendidikan.getAll
  );
  router.post(
    "/",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    masterInstansiPendidikanValidation.validate("create"),
    masterInstansiPendidikan.create
  );
  router.put(
    "/:id",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    masterInstansiPendidikanValidation.validate("update"),
    masterInstansiPendidikan.update
  );

  router.delete(
    "/:id",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    masterInstansiPendidikan.destroy
  );
});

masterRouter.group("/gelar_pendidikan", (router) => {
  router.get("/", checkRequester.checkRequester, masterGelarPendidikan.getAll);
  router.post(
    "/",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    masterGelarPendidikanValidation.validate("create"),
    masterGelarPendidikan.create
  );
  router.put(
    "/:id",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    masterGelarPendidikanValidation.validate("update"),
    masterGelarPendidikan.update
  );

  router.delete(
    "/:id",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    masterGelarPendidikan.destroy
  );
});

masterRouter.group("/grade_level", (router) => {
  router.get("/", checkRequester.checkRequester, masterGradeLevel.getAll);
  router.post(
    "/",
    checkRequester.checkRequester,
    masterGradeLevelValidation.validate("create"),
    masterGradeLevel.create
  );
  router.put(
    "/:id",
    checkRequester.checkRequester,
    masterGradeLevelValidation.validate("update"),
    masterGradeLevel.update
  );
  router.delete(
    "/:id",
    checkRequester.checkRequester,
    masterGradeLevel.destroy
  );
});

masterRouter.group("/fakultas_pendidikan", (router) => {
  router.get(
    "/",
    checkRequester.checkRequester,
    masterFakultasPendidikan.getAll
  );
  router.post(
    "/",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    masterFakultasPendidikanValidation.validate("create"),
    masterFakultasPendidikan.create
  );
  router.put(
    "/:id",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    masterFakultasPendidikanValidation.validate("update"),
    masterFakultasPendidikan.update
  );

  router.delete(
    "/:id",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    masterFakultasPendidikan.destroy
  );
});

masterRouter.group("/employee_group", (router) => {
  router.get("/", checkRequester.checkRequester, masterEmployeeGroup.getAll);
  router.get("/:id", checkRequester.checkRequester, masterEmployeeGroup.getOne);
  router.post(
    "/",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    masterEmployeeGroupValidation.validate("create"),
    masterEmployeeGroup.create
  );
  router.put(
    "/:id",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    masterEmployeeGroupValidation.validate("update"),
    masterEmployeeGroup.update
  );
  router.delete(
    "/:id",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    masterEmployeeGroup.destroy
  );
});

masterRouter.group("/bank_key", (router) => {
  router.get("/", checkRequester.checkRequester, masterBankKey.getAll);
  router.get("/:id", checkRequester.checkRequester, masterBankKey.getOne);
  router.post(
    "/",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    masterBankKeyValidation.validate("create"),
    masterBankKey.create
  );
  router.put(
    "/:id",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    masterBankKeyValidation.validate("update"),
    masterBankKey.update
  );
  router.delete(
    "/:id",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    masterBankKey.destroy
  );
});

masterRouter.group("/employee_sub_group", (router) => {
  router.get("/", checkRequester.checkRequester, masterEmployeeSubGroup.getAll);
  router.get(
    "/:id",
    checkRequester.checkRequester,
    masterEmployeeSubGroup.getOne
  );
  router.post(
    "/",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    masterEmployeeSubGroupValidation.validate("create"),
    masterEmployeeSubGroup.create
  );
  router.put(
    "/:id",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    masterEmployeeSubGroupValidation.validate("update"),
    masterEmployeeSubGroup.update
  );
  router.delete(
    "/:id",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    masterEmployeeSubGroup.destroy
  );
});

masterRouter.group("/bidang", (router) => {
  router.get("/", checkRequester.checkRequester, masterBidang.getAll);
  router.get("/:id", checkRequester.checkRequester, masterBidang.getOne);
  router.post(
    "/",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    masterBidangValidation.validate("create"),
    masterBidang.create
  );
  router.put(
    "/:id",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    masterBidangValidation.validate("update"),
    masterBidang.update
  );
  router.delete(
    "/:id",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    masterBidang.destroy
  );
});

masterRouter.group("/job", (router) => {
  router.get("/", checkRequester.checkRequester, masterJob.getAll);
  router.get("/:id", checkRequester.checkRequester, masterJob.getOne);
  router.post(
    "/",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    masterJobValidation.validate("create"),
    masterJob.create
  );
  router.put(
    "/:id",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    masterJobValidation.validate("update"),
    masterJob.update
  );
  router.delete(
    "/:id",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    masterJob.destroy
  );
});

masterRouter.group("/company", (router) => {
  router.get("/", checkRequester.checkRequester, masterCompany.getAll);
  router.get("/:id", checkRequester.checkRequester, masterCompany.getOne);
  router.post(
    "/",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    masterCompanyValidation.validate("create"),
    masterCompany.create
  );
  router.put(
    "/:id",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    masterCompanyValidation.validate("update"),
    masterCompany.update
  );
  router.delete(
    "/:id",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    masterCompany.destroy
  );
});

masterRouter.group("/personal_area", (router) => {
  router.get("/", checkRequester.checkRequester, masterPersonalArea.getAll);
  router.get("/:id", checkRequester.checkRequester, masterPersonalArea.getOne);
  router.post(
    "/",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    masterPersonalAreaValidation.validate("create"),
    masterPersonalArea.create
  );
  router.put(
    "/:id",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    masterPersonalAreaValidation.validate("update"),
    masterPersonalArea.update
  );
  router.delete(
    "/:id",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    masterPersonalArea.destroy
  );
});

masterRouter.group("/personal_sub_area", (router) => {
  router.get("/", checkRequester.checkRequester, masterPersonalSubArea.getAll);
  router.get(
    "/:id",
    checkRequester.checkRequester,
    masterPersonalSubArea.getOne
  );
  router.post(
    "/",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    masterPersonalSubAreaValidation.validate("create"),
    masterPersonalSubArea.create
  );
  router.put(
    "/:id",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    masterPersonalSubAreaValidation.validate("update"),
    masterPersonalSubArea.update
  );
  router.delete(
    "/:id",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    masterPersonalSubArea.destroy
  );
});

masterRouter.group("/position", (router) => {
  router.get("/", checkRequester.checkRequester, masterPosition.getAll);
  router.get(
    "/org/:id",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    masterPosition.getByOrgId
  );
  router.get(
    "/jm_click",
    checkRequester.checkRequester,
    masterPosition.getJmClikBlankPosition
  );
  router.get("/:id", checkRequester.checkRequester, masterPosition.getOne);
  router.post(
    "/",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    masterPositionValidation.validate("create"),
    masterPosition.create
  );
  router.post(
    "/mass_upload_jabatan",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    fileHelper.uploadToDisk,
    masterPosition.createMass
  );
  router.put(
    "/jm_click/:id/:employeeId",
    checkRequester.checkJMCLICK,
    fileHelper.streamFormJmClickUpdateMobility,
    masterPositionValidation.validate("update_jmclick"),
    masterPosition.paramsValidation,
    masterPosition.updateMasterPositionJmClick
  );
  router.put(
    "/:id",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    masterPositionValidation.validate("update"),
    masterPosition.update
  );
  router.delete(
    "/:id",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    masterPosition.destroy
  );
});

masterRouter.group("/country", (router) => {
  router.get("/", checkRequester.checkRequester, masterCountry.getAll);
  router.get("/:id", checkRequester.checkRequester, masterCountry.getOne);
  router.post(
    "/",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    masterCountryValidation.validate("create"),
    masterCountry.create
  );
  router.put(
    "/:id",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    masterCountryValidation.validate("update"),
    masterCountry.update
  );
  router.delete(
    "/:id",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    masterCountry.destroy
  );
});

masterRouter.group("/job_function", (router) => {
  router.get("/", checkRequester.checkRequester, masterJobFunction.getAll);
  router.get("/:id", checkRequester.checkRequester, masterJobFunction.getOne);
  router.post(
    "/",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    masterJobFunctionValidation.validate("create"),
    masterJobFunction.create
  );
  router.put(
    "/:id",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    masterJobFunctionValidation.validate("update"),
    masterJobFunction.update
  );
  router.delete(
    "/:id",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    masterJobFunction.destroy
  );
});

masterRouter.group("/province", (router) => {
  router.get("/", checkRequester.checkRequester, masterProvince.getAll);
  router.get("/:id", checkRequester.checkRequester, masterProvince.getOne);
  router.post(
    "/",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    masterProvinceValidation.validate("create"),
    masterProvince.create
  );
  router.put(
    "/:id",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    masterProvinceValidation.validate("update"),
    masterProvince.update
  );
  router.delete(
    "/:id",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    masterProvince.destroy
  );
});

masterRouter.group("/city", (router) => {
  router.get("/", checkRequester.checkRequester, masterCity.getAll);
  router.get("/:id", checkRequester.checkRequester, masterCity.getOne);
  router.post(
    "/",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    masterCityValidation.validate("create"),
    masterCity.create
  );
  router.put(
    "/:id",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    masterCityValidation.validate("update"),
    masterCity.update
  );
  router.delete(
    "/:id",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    masterCity.destroy
  );
});

masterRouter.group("/religion", (router) => {
  router.get("/", checkRequester.checkRequester, masterReligion.getAll);
  router.get("/:id", checkRequester.checkRequester, masterReligion.getOne);
  router.post(
    "/",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    masterReligionValidation.validate("create"),
    masterReligion.create
  );
  router.put(
    "/:id",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    masterReligionValidation.validate("update"),
    masterReligion.update
  );
  router.delete(
    "/:id",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    masterReligion.destroy
  );
});

masterRouter.group("/business_area", (router) => {
  router.get("/", checkRequester.checkRequester, masterBusinessArea.getAll);
  router.get("/:id", checkRequester.checkRequester, masterBusinessArea.getOne);
  router.post(
    "/",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    masterBusinessAreaValidation.validate("create"),
    masterBusinessArea.create
  );
  router.put(
    "/:id",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    masterBusinessAreaValidation.validate("update"),
    masterBusinessArea.update
  );
  router.delete(
    "/:id",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    masterBusinessArea.destroy
  );
});

masterRouter.group("/cluster", (router) => {
  router.get("/", checkRequester.checkRequester, masterCluster.getAll);
  router.get("/:id", checkRequester.checkRequester, masterCluster.getOne);
  router.post(
    "/",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    masterClusterValidation.validate("create"),
    masterCluster.create
  );
  router.put(
    "/:id",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    masterClusterValidation.validate("update"),
    masterCluster.update
  );
  router.delete(
    "/:id",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    masterCluster.destroy
  );
});

masterRouter.group("/jenjang_pendidikan", (router) => {
  router.get(
    "/",
    checkRequester.checkRequester,
    masterJenjangPendidikan.getAll
  );
  router.get(
    "/:id",
    checkRequester.checkRequester,
    masterJenjangPendidikan.getOne
  );
  router.post(
    "/",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    masterJenjangPendidikanValidation.validate("create"),
    masterJenjangPendidikan.create
  );
  router.put(
    "/:id",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    masterJenjangPendidikanValidation.validate("update"),
    masterJenjangPendidikan.update
  );
  router.delete(
    "/:id",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    masterJenjangPendidikan.destroy
  );
});

masterRouter.group("/jurusan_pendidikan", (router) => {
  router.get(
    "/",
    checkRequester.checkRequester,
    masterJurusanPendidikan.getAll
  );
  router.get(
    "/:id",
    checkRequester.checkRequester,
    masterJurusanPendidikan.getOne
  );
  router.post(
    "/",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    masterJurusanPendidikanValidation.validate("create"),
    masterJurusanPendidikan.create
  );
  router.put(
    "/:id",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    masterJurusanPendidikanValidation.validate("update"),
    masterJurusanPendidikan.update
  );
  router.delete(
    "/:id",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    masterJurusanPendidikan.destroy
  );
});

masterRouter.group("/layer", (router) => {
  router.get("/", checkRequester.checkRequester, masterLayer.getAll);
  router.get("/:id", checkRequester.checkRequester, masterLayer.getOne);
  router.post(
    "/",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    masterLayerValidation.validate("create"),
    masterLayer.create
  );
  router.put(
    "/:id",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    masterLayerValidation.validate("update"),
    masterLayer.update
  );
  router.delete(
    "/:id",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    masterLayer.destroy
  );
});

masterRouter.group("/mutasi", (router) => {
  router.get("/", checkRequester.checkRequester, masterMutasi.getAll);
  router.get("/:id", checkRequester.checkRequester, masterMutasi.getOne);
  router.post(
    "/",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    masterMutasiValidation.validate("create"),
    masterMutasi.create
  );
  router.put(
    "/:id",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    masterMutasiValidation.validate("update"),
    masterMutasi.update
  );
  router.delete(
    "/:id",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    masterMutasi.destroy
  );
});

masterRouter.group("/status_keluarga", (router) => {
  router.get("/", checkRequester.checkRequester, masterStatusKeluarga.getAll);
  router.get(
    "/:id",
    checkRequester.checkRequester,
    masterStatusKeluarga.getOne
  );
  router.post(
    "/",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    masterStatusKeluargaValidation.validate("create"),
    masterStatusKeluarga.create
  );
  router.put(
    "/:id",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    masterStatusKeluargaValidation.validate("update"),
    masterStatusKeluarga.update
  );
  router.delete(
    "/:id",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    masterStatusKeluarga.destroy
  );
});

masterRouter.group("/sub_cluster", (router) => {
  router.get("/", checkRequester.checkRequester, masterSubCluster.getAll);
  router.get("/:id", checkRequester.checkRequester, masterSubCluster.getOne);
  router.post(
    "/",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    masterSubClusterValidation.validate("create"),
    masterSubCluster.create
  );
  router.put(
    "/:id",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    masterSubClusterValidation.validate("update"),
    masterSubCluster.update
  );
  router.delete(
    "/:id",
    checkRequester.checkRequester,
    checkRequester.authenticateAdmin,
    masterSubCluster.destroy
  );
});

module.exports = masterRouter;
