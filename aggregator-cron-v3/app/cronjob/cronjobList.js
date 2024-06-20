const CronJob = require("node-cron");
const moment = require("moment");
const axios = require("axios");

const sendResponse = require("../resources/responseApi");
const educationService = require("../services/education.service");
const familyService = require("../services/family.service");
const omActionService = require("../services/omAction.service");
const approverService = require("../services/approver.service");
const profileService = require("../services/profile.service");
const masaKerjaService = require("../services/masaKerja.service");
const orgService = require("../services/organization.service");
const pendingRequestService = require("../services/pendingRequest.service");
const userAuthService = require("../services/userAuth.service");
const hrdHisSertifikasi = require('../services/hrdHisSertifikasi.service');
const hrdHisSertifikasiFiles = require('../services/hrdHisSertifikasiFiles.service');
const resetRedis = require("../services/redisReset.service");

// discord notification
const { sendDiscordNotification } = require("../../utils/discord");

const cronList = async (req, res) => {
  try {
    console.log(`CRON STARTING AT 2 AM EVERYDAY`);
    const scheduledAt2 = CronJob.schedule("0 2 * * *", async () => {
      try {
        console.log(req.query.changedate);
        console.log(moment().format());
        console.log("========== ORG DATA ( ORG ONLY ) ==========");
        console.log("==========start==========");
        await orgService.getData(req, "org_only");
        console.log("==========done==========");
        console.log("========== EDUCATION DATA ==========");
        console.log("==========start==========");
        await educationService.getData(req);
        console.log("==========done==========");
        console.log("========== FAMILY DATA ==========");
        console.log("==========start==========");
        await familyService.getData(req);
        console.log("==========done==========");
        console.log("========== OM ACTION DATA ==========");
        console.log("==========start==========");
        await omActionService.getData(req);
        console.log("==========done==========");
        console.log("========== PENDING REQUESTS ==========");
        console.log("==========start==========");
        await pendingRequestService.runCron(req, res);
        console.log("==========done==========");
        console.log("========== APPROVER DATA ==========");
        console.log("==========start==========");
        await approverService.getData(req);
        console.log("==========done==========");
        console.log("========== ORG DATA ( LEADER ) ==========");
        console.log("==========start==========");
        await orgService.getData(req, "ubah_leader");
        console.log("==========done==========");
        console.log("========== PROFILE DATA ==========");
        console.log("==========start==========");
        await profileService.getData(req);
        console.log("==========done==========");
        console.log("========== COUNTING MASA KERJA ==========");
        console.log("==========start==========");
        await masaKerjaService.countMasaKerja();
        console.log("==========done==========");
        console.log("========== SERTIFIKASI DATA ==========");
        console.log("==========start==========");
        await hrdHisSertifikasi.getData(req);
        console.log("==========done==========");
        console.log("========== SERTIFIKASI FILES DATA ==========");
        console.log("==========start==========");
        await hrdHisSertifikasiFiles.getData(req);
        console.log("==========done==========");
        console.log("========== RESETTING REDIS ==========");
        await resetRedis();
        console.log("========== RESETTING DEFAULT PASSWORD ==========");
        await userAuthService.resetDefaultPassword();
        await axios.post(
          "http://cronjob-monitoring-backend-aggregator-postgres-v3.apps.ocprd.jasamarga.co.id/api/report",
          {
            changedate: moment().add(-1, "days").format("YYYYMMDD"),
            status: true,
          }
        );
        sendDiscordNotification(
          "Cronjob Sukses DIjalankan",
          0x00ff00,
          "SUCCESS",
          "DAILY CRON"
        );
      } catch (error) {
        console.log("error", error.message);
        sendDiscordNotification(
          error.message,
          0xff0000,
          "FAILED",
          "DAILY CRON"
        );
      }
      console.log("************ CRON FINISHED, GOOD LUCK ************");
    });
    scheduledAt2.start();
    return res.status(200).send({
      status: true,
      message: "cron scheduled",
      code: 200,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send(sendResponse.internalServerError());
  }
};

module.exports = {
  cronList,
};
