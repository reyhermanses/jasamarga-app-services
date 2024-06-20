const axios = require("axios");
const moment = require("moment");
require('dotenv').config()

const {
  Employee,
  EmployeePosition,
  EmployeeFamily
} = require("../../models");

const {
  Op
} = require("sequelize");

const acquireData = async (changeDate = null) => {
  const response = await axios.post(
    changeDate ?
      `${process.env.SAP_URL}` +
      `&sat-table=JM_FAMILY_DETAIL&mode=05&changedate=` +
      changeDate :
      process.env.SAP_URL +
      `&sat-table=JM_FAMILY_DETAIL&mode=05&changedate=` +
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
      }
    ]
  })
}

const acquireDataSAPCondition = async (data) => {
  return await EmployeeFamily.findOne({
    where: {
      [Op.and]: [
        {
          employee_id: data.employee_id
        },
        {
          family_status_id: data.kode_hubungan
        },
        {
          object_id: data.object_id
        }
      ]
    }
  })
}

const generate = async (data) => {
  return await EmployeeFamily.create(data)
}

module.exports = {
  acquireData,
  acquireDataPusat,
  acquireDataSAPCondition,
  generate
}