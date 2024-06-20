require('dotenv').config()
let axios = require('axios')
let moment = require('moment')
require('dotenv').config()

const {
  Employee,
  EmployeePosition,
  EmployeeProfile,
  MasterCity,
  MasterProvince,
  MasterKelurahan,
  MasterKecamatan
} = require("../../models");

const {
  Op
} = require("sequelize");

const acquireData = async (changeDate = null, tableName) => {
  const response = await axios.post(
    changeDate ?
      `${process.env.SAP_URL}` + `&sat-table=${tableName}&mode=16&changedate=` + changeDate :
      process.env.SAP_URL + `&sat-table=${tableName}&mode=16&changedate=` + moment().add(-1, 'days').format('YYYYMMDD'), {}, {
    auth: {
      username: process.env.SAP_USER,
      password: process.env.SAP_PASSWORD
    }
  }
  )
  return response
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

const acquireCityByDescription = async (desc) => {
  return await MasterCity.findOne({
    where: {
      description: {
        [Op.iLike]: `${desc}`
      }
    }
  })
}

async function acquireProvinceByDescription(desc) {
  return await MasterProvince.findOne({
    where: {
      description: desc
    }
  })
}

const acquireKecamatanByName = async (name) => {
  return await MasterKecamatan.findOne({
    where: {
      name: {
        [Op.iLike]: `${name}`
      }
    }
  })
}

const acquireKelurahanByName = async (name) => {
  return await MasterKelurahan.findOne({
    where: {
      name: {
        [Op.iLike]: `${name}`
      }
    }
  })
}

async function acquireProvinceByID(id) {
  return await MasterProvince.findOne({
    where: {
      id: id
    }
  })
}

async function upsert(data) {
  // return await EmployeeProfile.findOne({
  //   where: {
  //     [Op.and]: [{
  //       employee_id: data.employee_id
  //     }]
  //   }
  // }).then((obj) => {
  //   if (obj) {
  //     data.updated_by = 'aggregator-cron'
  //     return obj.update(data);
  //   } else {
  //     return EmployeeProfile.create(data);
  //   }
  // })

  const dataProfile = await EmployeeProfile.findOne({
    where: {
      employee_id: data.employee_id
    }
  })
  if (dataProfile) {
    data.updated_by = 'aggregator-cron'
    await dataProfile.update(data);
  } else {
    await EmployeeProfile.create(data);
  }

  const dataEmployee = await Employee.findByPk(data.employee_id)
  await dataEmployee.update({ name: data.name, updated_by: 'aggregator-cron' })
  return data
}

module.exports = {
  acquireData,
  acquireDataPusat,
  upsert,
  acquireCityByDescription,
  acquireProvinceByDescription,
  acquireProvinceByID,
  acquireKecamatanByName,
  acquireKelurahanByName
}