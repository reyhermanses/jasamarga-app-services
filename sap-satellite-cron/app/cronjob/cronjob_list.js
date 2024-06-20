const CronJob = require("node-cron");
const moment = require("moment");
moment.locale("id"); // default the locale to Indonesian

// TASK
const org = require("../services/org.service");
const approver = require("../services/approver.service");
const address = require("../services/address.service");
const basicPay = require("../services/basicPay.service");
const bpjsKes = require("../services/bpjsKes.service");
const bpjsTK = require("../services/bpjsTK.service");
const document = require("../services/document.service");
const education = require("../services/education.service");
const family = require("../services/family.service");
const omAction = require("../services/om_action.service");
const omAction3 = require("../services/om_action_3.service");
const personalData = require("../services/personalData.service");
const personalID = require("../services/personalID.service");
const payslip = require("../services/payslip.service");
const taxID = require("../services/taxID.service");

const cronList = async (req, res, next) => {
  try {
    console.log(`Scheduler di-Set Mulai ${moment().format("LLLL")}`);
    const scheduler = CronJob.schedule("0 2 * * *", async () => {
      console.log(`${moment().format("LLLL")}`);
      console.log("========== ORG DATA STARTED ==========");
      const orgData = await org.transferData(null);
      console.log(`Total Ada ${orgData.length} Data Organisasi telah Diproses`);
      console.log(`========== ORG DATA FINISHED ==========
      
      `);
      console.log("========== APPROVER DATA STARTED ==========");
      const approverData = await approver.transferData(null);
      console.log(
        `Total Ada ${approverData.length} Data Approval telah Diproses`
      );
      console.log(`========== APPROVER DATA FINISHED ==========
      
      `);
      console.log("========== OM ACTION DATA STARTED ==========");
      const omActionData = await omAction.transferData(null);
      console.log(
        `Total Ada ${omActionData.length} Data OM Action telah Diproses`
      );
      console.log(`========== OM ACTION DATA FINISHED ==========
      
      `);
      console.log("========== OM ACTION 3 MODE 19 DATA STARTED ==========");
      const omAction319Data = await omAction3.transferData19(null);
      console.log(
        `Total Ada ${omAction319Data.length} Data OM Action 3 Mode 19 telah Diproses`
      );
      console.log(`========== OM ACTION 3 MODE 19 DATA FINISHED ==========
      
      `);
      console.log("========== DOCUMENT DATA STARTED ==========");
      const documentData = await document.transferData(null);
      console.log(
        `Total Ada ${documentData.length} Data Document telah Diproses`
      );
      console.log(`========== DOCUMENT DATA FINISHED ==========
      
      `);
      console.log("========== ADDRESS DATA STARTED ==========");
      const addresData = await address.transferData(null);
      console.log(`Total Ada ${addresData.length} Data Address telah Diproses`);
      console.log(`========== ADDRESS DATA FINISHED ==========
      
      `);
      console.log("========== BASIC PAY DATA STARTED ==========");
      const basicPayData = await basicPay.transferData(null);
      console.log(
        `Total Ada ${basicPayData.length} Data Basic Pay telah Diproses`
      );
      console.log(`========== BASIC PAY DATA FINISHED ==========
      
      `);
      console.log("========== BPJS KES DATA STARTED ==========");
      const bpjsKesData = await bpjsKes.transferData(null);
      console.log(
        `Total Ada ${bpjsKesData.length} Data BPJS Kesehatan telah Diproses`
      );
      console.log(`========== BPJS KES DATA FINISHED ==========
      
      `);
      console.log("========== BPJS TK DATA STARTED ==========");
      const bpjsTKData = await bpjsTK.transferData(null);
      console.log(
        `Total Ada ${bpjsTKData.length} Data BPJS Ketenagakerjaan telah Diproses`
      );
      console.log(`========== BPJS TK DATA FINISHED ==========
      
      `);
      console.log("========== EDUCATION DATA STARTED ==========");
      const educationData = await education.transferData(null);
      console.log(
        `Total Ada ${educationData.length} Data Education telah Diproses`
      );
      console.log(`========== EDUCATION DATA FINISHED ==========
      
      `);
      console.log("========== FAMILY DATA STARTED ==========");
      const familyData = await family.transferData(null);
      console.log(`Total Ada ${familyData.length} Data Family telah Diproses`);
      console.log(`========== FAMILY DATA FINISHED ==========
      
      `);
      console.log("========== PERSONAL DATA STARTED ==========");
      const fetchPersonalData = await personalData.transferData(null);
      console.log(
        `Total Ada ${fetchPersonalData.length} Data Personal telah Diproses`
      );
      console.log(`========== PERSONAL DATA FINISHED ==========
      
      `);
      console.log("========== PERSONAL ID STARTED ==========");
      const personalIDData = await personalID.transferData(null);
      console.log(
        `Total Ada ${personalIDData.length} Data Personal ID telah Diproses`
      );
      console.log(`========== PERSONAL ID FINISHED ==========
      
      `);
      console.log("========== TAX ID STARTED ==========");
      const taxIDData = await taxID.transferData(null);
      console.log(`Total Ada ${taxIDData.length} Data Tax ID telah Diproses`);
      console.log(`========== TAX ID FINISHED ==========
      
      `);
      console.log("========== PAYSLIP STARTED ==========");
      const payslipData = await payslip.transferData(null, null);
      console.log(
        `Total Ada ${payslipData.length} Data Payslip telah Diproses`
      );
      console.log(`========== PAYSLIP FINISHED ==========
      
      `);
    });
    scheduler.start();
    return res.status(200).send({
      status: true,
      message: "cron scheduled",
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
  cronList,
};
