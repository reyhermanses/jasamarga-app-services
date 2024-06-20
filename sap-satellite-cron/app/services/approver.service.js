const axios = require("axios");
const moment = require("moment");
require('dotenv').config()

const {
  Approver
} = require("../../models");

const getSAP = async (changeDate = null) => {
  try {
    const response = await axios.post(
      changeDate ?
        `${process.env.SAP_URL}` +
        `?sap-client=120&sat-table=JM_APPROVER&mode=17&changedate=` +
        changeDate :
        process.env.SAP_URL +
        `?sap-client=120&sat-table=JM_APPROVER&mode=17&changedate=` +
        moment().add(-1, "days").format("YYYYMMDD"), {}, {
      auth: {
        username: process.env.SAP_USER,
        password: process.env.SAP_PASSWORD,
      },
    }
    );
    return response.data;
  } catch (error) {
    console.log(`ada error "${error.message}"`)
    return []
  }
}

const cleansingData = (data) => {
  if (data.length != 0) {
    let responseFiltered = data;
    if (typeof responseFiltered === 'string') {
      const removeBacklash = responseFiltered.replaceAll(/\\/g, '');
      responseFiltered = JSON.parse(removeBacklash);
    }
    return responseFiltered
  } else {
    return []
  }
}

const transferData = async (changeDate = null) => {
  const dataSAP = await getSAP(changeDate)
  if (dataSAP.length > 0) {
    const cleanData = cleansingData(dataSAP)
    await Approver.destroy({
      where: {
        change_on: changeDate ? changeDate : moment().add(-1, "days").format("YYYYMMDD")
      }
    })
    for (item of cleanData) {
      item.created_by = 'ADMIN'
      await Approver.create(item)
    }
    return cleanData
  }
  return []
}

module.exports = {
  transferData
}