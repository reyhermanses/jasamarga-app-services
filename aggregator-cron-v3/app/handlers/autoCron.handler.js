const axios = require("axios");
const moment = require("moment");

const educationService = require("../services/education.service");
const familyService = require("../services/family.service");
const omActionService = require("../services/omAction.service");
const approverService = require("../services/approver.service");
const profileService = require("../services/profile.service");
const masaKerjaService = require("../services/masaKerja.service");
const orgService = require("../services/organization.service");
const pendingRequestService = require("../services/pendingRequest.service");
const hrdHisSertifikasi = require('../services/hrdHisSertifikasi.service');
const hrdHisSertifikasiFiles = require('../services/hrdHisSertifikasiFiles.service');
const resetRedis = require("../services/redisReset.service");

// discord notification
const { sendDiscordNotification } = require("../../utils/discord");

const launch = async (req, res, next) => {
  try {
    const dataOrganization = await orgService.getData(req, "org_only");
    const dataFamily = await familyService.getData(req);
    const dataEducation = await educationService.getData(req);
    const dataPendingRequest = await pendingRequestService.runCron(req, res);
    const dataOmAction = await omActionService.getData(req);
    const dataApprover = await approverService.getData(req);
    const dataLeader = await orgService.getData(req, "ubah_leader");
    const dataProfile = await profileService.getData(req);
    const dataSertifikasi = await hrdHisSertifikasi.getData(req);
    const dataSertifikasiFiles = await hrdHisSertifikasiFiles.getData(req);
    await resetRedis();
    let statisticChangedate = moment().add(-1, "days").format("YYYYMMDD");

    if (req.query.changedate) {
      statisticChangedate = req.query.changedate;
    }

    if (req.query.personnel_number) {
      statisticChangedate = null;
    }

    if (statisticChangedate !== null) {
      try {
        await axios.post(
          "http://cronjob-monitoring-backend-aggregator-postgres-v3.apps.ocprd.jasamarga.co.id/api/report",
          {
            changedate:
              req.query.changedate && !req.query.personnel_number
                ? req.query.changedate
                : moment().add(-1, "days").format("YYYYMMDD"),
            status: true,
          }
        );
      } catch (error) {
        console.log("error sending statistics", error.message);
      }
    }
    masaKerjaService.countMasaKerja();
    sendDiscordNotification(
      "Cronjob Sukses DIjalankan Secara Manual",
      0x00ff00,
      "SUCCESS",
      "DAILY CRON"
    );
    return res.status(200).send({
      status: true,
      message:
        "cron running successfully, kindly wait for counting EMPLOYEE MASA KERJA for finish...",
      data: {
        organization: dataOrganization,
        family: dataFamily,
        education: dataEducation,
        pending_requests: dataPendingRequest,
        om_action: dataOmAction,
        approver: dataApprover,
        profile: dataProfile,
        leader: dataLeader,
        sertifikasi: dataSertifikasi,
        sertifikasi_files: dataSertifikasiFiles,
      },
      code: 200,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

module.exports = {
  launch,
};
