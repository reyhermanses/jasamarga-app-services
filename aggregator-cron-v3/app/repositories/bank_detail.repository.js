const { BankDetails, Employee } = require("../../models");

require("dotenv").config();

let axios = require("axios");
let moment = require("moment");

const { Op } = require("sequelize");

async function acquiredSap(dateNow) {
  // console.log(dateNow)
  let date = moment(dateNow).format("YYYYMMDD");
  const response = await axios.post(
    `${process.env.SAP_URL}` +
    `&sat-table=JM_BANK_DETAILS&mode=05&changedate=` +
    date,
    {},
    {
      auth: {
        username: `${process.env.SAP_USER}`,
        password: `${process.env.SAP_PASSWORD}`,
      },
    }
  );
  return response;
}

async function insertOrUpdate(data) {
  return await BankDetails.findOne({
    where: {
      [Op.and]: [
        {
          employee_id: data.employee_id,
        },
      ],
    },
  }).then((obj) => {
    if (obj) {
      data.updated_by = "aggregator-data";
      return obj.update(data);
    }
    data.created_by = "aggregator-data";
    return BankDetails.create(data);
  });
}

async function aquiredByEmployeeId(employee_id) {
  return await BankDetails.findOne({
    where: {
      employee_id: employee_id,
    },
  });
}

module.exports = {
  acquiredSap,
  insertOrUpdate,
  aquiredByEmployeeId,
};
