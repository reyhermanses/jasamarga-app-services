const axios = require("axios");
const moment = require("moment");
require('dotenv').config();

const { OmAction319 } = require("../../models");

const getSAP19 = async (changeDate = null) => {
  try {
    const response = await axios.post(
      changeDate ?
        `${process.env.SAP_URL}` +
        `?sap-client=120&sat-table=JM_OM_ACTION3&mode=19&changedate=` +
        changeDate :
        process.env.SAP_URL +
        `?sap-client=120&sat-table=JM_OM_ACTION3&mode=19&changedate=` +
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

const transferData19 = async (changeDate = null) => {
  const dataSAP = await getSAP19(changeDate)
  if (dataSAP.length > 0) {
    const cleanData = cleansingData(dataSAP)
    await OmAction319.destroy({
      where: {
        change_on: changeDate ? changeDate : moment().add(-1, "days").format("YYYYMMDD")
      }
    })
    for (const item of cleanData) {
      item.created_by = 'ADMIN'
      await OmAction319.create(item)
    }
    return cleanData
  }
  return []
}

module.exports = { transferData19 }