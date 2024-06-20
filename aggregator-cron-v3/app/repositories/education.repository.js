const axios = require("axios");
const moment = require("moment");
require('dotenv').config()

const {
  Employee,
  EmployeePosition,
  MasterCountry,
  EmployeeEducation,
  EmployeeProfile
} = require("../../models");

const {
  Op
} = require("sequelize");

const acquireData = async (changeDate = null) => {
  const response = await axios.post(
    changeDate ?
      `${process.env.SAP_URL}` +
      `&sat-table=JM_EDUCATION&mode=20&changedate=` +
      changeDate :
      process.env.SAP_URL +
      `&sat-table=JM_EDUCATION&mode=20&changedate=` +
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

const remove = async (empId) => {
  return await EmployeeEducation.destroy({
    where: {
      employee_id: empId
    }
  });
}

const acquireCountry = async (code) => {
  return await MasterCountry.findOne({
    where: {
      code: code
    },
    attributes: {
      exclude: ['created_at', 'updated_at', 'created_by', 'updated_by']
    }
  })
}

const upsertEducation = async (data) => {
  return await EmployeeEducation.findOne({
    where: {
      [Op.and]: [
        {
          employee_id: data.employee_id,
        },
        {
          changedate: data.changedate,
        },
        {
          name: data.name,
        },
        {
          ref_jenjang_pendidikan_id: data.ref_jenjang_pendidikan_id,
        },
      ],
    },
  }).then((obj) => {
    if (obj) {
      data.updated_by = "aggregator-cron";
      return obj.update(data);
    }
    return EmployeeEducation.create(data);
  });
}

const upsertLastEducation = async (data) => {
  return await EmployeeProfile.findOne({
    where: {
      [Op.and]: [{
        employee_id: data.employee_id
      }]
    }
  }).then((obj) => {
    if (obj) {
      data.updated_by = 'aggregator-cron'
      return obj.update(data);
    } else {
      return EmployeeProfile.create(data);
    }
  })
}

module.exports = {
  acquireData,
  acquireDataPusat,
  acquireCountry,
  upsertEducation,
  upsertLastEducation,
  remove
}