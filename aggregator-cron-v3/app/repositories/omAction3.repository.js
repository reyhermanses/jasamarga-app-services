const axios = require("axios");
const moment = require("moment");
require('dotenv').config()

const {
  Employee,
  EmployeePosition,
  MasterPosition,
  HistoryJabatan,
  OrganizationHierarchy,
  UserAuth,
  MasterEmployeeSubGroup
} = require("../../models");

const {
  Op
} = require("sequelize");

const acquireData = async (changeDate = null) => {
  const response = await axios.post(
    changeDate ?
      `${process.env.SAP_URL}` +
      `&sat-table=JM_OM_ACTION3&mode=19&changedate=` +
      changeDate :
      process.env.SAP_URL +
      `&sat-table=JM_OM_ACTION3&mode=19&changedate=` +
      moment().add(-1, "days").format("YYYYMMDD"), {}, {
    auth: {
      username: process.env.SAP_USER,
      password: process.env.SAP_PASSWORD,
    },
  }
  );
  return response;
}

const acquireDatabase = async (persNumbers) => {
  const newData = await Employee.findOne({
    where: {
      is_pusat: true
    },
    include: [
      {
        model: EmployeePosition,
        as: 'position',
        where: {
          [Op.and]: [
            {
              personnel_number: persNumbers,
            },
            {
              is_main: true,
            }
          ],
        },
        include: [
          {
            model: MasterPosition,
            as: 'position_detail',
            include: [
              {
                model: OrganizationHierarchy,
                as: 'unit_position'
              }
            ]
          }
        ]
      }
    ]
  })
  return newData
}

const acquirePosition = async (positionId) => {
  return await MasterPosition.findByPk(positionId, { raw: true })
}

const upsertPosition = async (data, transaction) => {
  const findData = await MasterPosition.findByPk(data.id, { raw: true })
  if (findData) {
    data.updated_by = 'aggregator-cron'
    await MasterPosition.update(data, { where: { id: data.id }, transaction })
  } else {
    data.created_by = 'aggregator-cron'
    await MasterPosition.create(data, { transaction })
  }
  return data
}

const acquireDataOrganization = async (orgId) => {
  return await OrganizationHierarchy.findByPk(orgId, { raw: true })
}

const generateHistoryJabatan = async (data, transaction) => {
  return await HistoryJabatan.create(data, { transaction })
}

const upsertAuth = async (data, transaction) => {
  const findData = await UserAuth.findOne({
    where: {
      employee_id: data.employee_id
    },
    transaction
  })

  if (findData) {
    data.updated_by = 'aggregator-cron'
    await UserAuth.update(data, { where: { employee_id: data.employee_id }, transaction })
  } else {
    data.created_by = 'aggregator-cron'
    await UserAuth.create(data, { transaction })
  }

}

const upsertEmployeePosition = async (data, transaction) => {
  const findData = await EmployeePosition.findOne({
    where: {
      [Op.and]: [
        {
          employee_id: data.employee_id
        },
        {
          is_main: true
        }
      ]
    },
    transaction
  })

  if (findData) {
    data.updated_by = 'aggregator-cron'
    await EmployeePosition.update(
      data,
      {
        where: {
          [Op.and]: [
            {
              employee_id: data.employee_id
            },
            {
              is_main: true
            }
          ]
        },
        transaction
      })
  } else {
    data.created_by = 'aggregator-cron'
    await EmployeePosition.create(data, { transaction });
  }
  return data
}

const modernizeEmployee = async (id, data, transaction) => {
  return await Employee.update(
    data,
    {
      where: {
        id: id
      },
      transaction
    }
  )
}

const generateEmployee = async (data, transaction) => {
  return await Employee.create(data, { transaction })
}

const acquireSubGroupByKey = async (key) => {
  return await MasterEmployeeSubGroup.findOne({
    where: {
      key: key
    }
  })
}

module.exports = {
  acquireData,
  acquireDatabase,
  acquirePosition,
  upsertPosition,
  generateHistoryJabatan,
  upsertAuth,
  acquireDataOrganization,
  upsertEmployeePosition,
  modernizeEmployee,
  generateEmployee,
  acquireSubGroupByKey
}