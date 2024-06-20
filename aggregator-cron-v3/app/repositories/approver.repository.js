const axios = require("axios");
const moment = require("moment");
require('dotenv').config()

const {
  Employee,
  PendingRequest,
  EmployeePosition,
  MasterPosition
} = require("../../models");

const {
  Op
} = require("sequelize");

const acquireData = async (changeDate = null) => {
  const response = await axios.post(
    changeDate ?
      `${process.env.SAP_URL}` +
      `&sat-table=JM_APPROVER&mode=17&changedate=` +
      changeDate :
      process.env.SAP_URL +
      `&sat-table=JM_APPROVER&mode=17&changedate=` +
      moment().add(-1, "days").format("YYYYMMDD"), {}, {
    auth: {
      username: process.env.SAP_USER,
      password: process.env.SAP_PASSWORD,
    },
  }
  );
  return response;
}

const acquireDataPusat = async (persNumber) => {
  return await EmployeePosition.findOne({
    where: {
      personnel_number: persNumber
    },
    include: [
      {
        model: Employee,
        as: 'employee_position',
        where: {
          is_pusat: true
        }
      },
      {
        model: MasterPosition,
        as: 'position_detail'
      }
    ]
  })
}

const checkPendingRequest = async (persNumber, change_on) => {
  return await PendingRequest.findOne({
    where: {personnel_number: persNumber, change_on: change_on},
  });
  
}

module.exports = {
  acquireData,
  acquireDataPusat,
  checkPendingRequest
}