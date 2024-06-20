const axios = require("axios");
const moment = require("moment");
require('dotenv').config()

const acquireData = async (changeDate = null) => {
  const response = await axios.post(
    changeDate ?
      `${process.env.SAP_URL}` +
      `&sat-table=JM_DOCUMENT&mode=05&changedate=` +
      changeDate :
      process.env.SAP_URL +
      `&sat-table=JM_DOCUMENT&mode=05&changedate=` +
      moment().add(-1, "days").format("YYYYMMDD"), {}, {
    auth: {
      username: process.env.SAP_USER,
      password: process.env.SAP_PASSWORD,
    },
  }
  );
  return response;
}

module.exports = {
  acquireData
}