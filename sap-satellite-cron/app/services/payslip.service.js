const axios = require("axios");
const moment = require("moment");
require("dotenv").config();

const { Payslip } = require("../../models");

const getAggregator = async () => {
  try {
    const config = {
      headers: {
        "X-API-KEY": process.env.AGG_API_KEY,
      },
    };

    const response = await axios.get(
      `${process.env.AGGREGATOR_URL}` + "/api/v1/employee?kd_comp=JSMR",
      config
    );
    return response.data.data;
  } catch (error) {
    console.log(`ada error Agg "${error.message}"`);
    return [];
  }
};

const getSAP = async (period, personnelNumber) => {
  try {
    const response = await axios.post(
      `${process.env.SAP_URL}` +
        `?sap-client=120&mode=06&changedate=${period}&pernr=${personnelNumber}`,
      {},
      {
        auth: {
          username: process.env.SAP_USER,
          password: process.env.SAP_PASSWORD,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(`ada error SAP "${error.message}"`);
    return [];
  }
};

const cleansingData = (data) => {
  if (data.length != 0) {
    let responseFiltered = data;
    if (typeof responseFiltered === "string") {
      const removeBacklash = responseFiltered.replaceAll(/\\/g, "");
      responseFiltered = JSON.parse(removeBacklash);
    }
    return responseFiltered;
  } else {
    return [];
  }
};

const transferData = async (period = null, personnelNumber = null) => {
  let resultPayslip = [];
  if (personnelNumber) {
    const dataSAP = await getSAP(
      period ? period : moment().format("YYYYMM"),
      personnelNumber
    );

    // Convert the data to an object suitable for insertion
    const payslipObject = {};
    dataSAP.forEach((item) => {
      payslipObject[item.description] = item.value;
    });
    resultPayslip.push(payslipObject);
    await Payslip.destroy({
      where: {
        Personnel_No: payslipObject.Personnel_No,
        Periode: payslipObject.Periode,
      },
    });
  } else {
    const data = await getAggregator();
    for (const oneItem of data) {
      try {
        const dataSAP = await getSAP(
          period ? period : moment().format("YYYYMM"),
          oneItem.position[0].personnel_number
        );

        const payslipObject = {};
        dataSAP.forEach((item) => {
          payslipObject[item.description] = item.value;
        });

        resultPayslip.push(payslipObject);
        await Payslip.destroy({
          where: {
            Personnel_No: payslipObject.Personnel_No,
            Periode: payslipObject.Periode,
          },
        });
      } catch (error) {
        continue;
      }
    }
  }

  // cleansing data
  const filteredArray = resultPayslip.filter(
    (item) => item.Personnel_No !== null
  );

  await Payslip.bulkCreate(filteredArray);
  return resultPayslip;
};

module.exports = {
  transferData,
};
