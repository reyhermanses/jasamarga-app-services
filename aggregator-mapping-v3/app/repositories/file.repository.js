const { EmployeeFile, Employee, sequelize, EmployeePosition } = require('../../models')
const { Op } = require("sequelize");
require('dotenv').config()
let axios = require('axios')
let moment = require('moment');
const fileHelper = require('../middlewares/fileHelper')

async function acquireAllData(filter = {}, empId = null) {

  let filterAll = {
    attributes: {
      exclude: ['created_at', 'updated_at', 'created_by', 'updated_by']
    },
    include: [
      {
        model: Employee,
        as: 'employee_file',
        attributes: ['id', 'name'],
        include: [
          {
            model: EmployeePosition,
            as: 'position',
            attributes: ['npp']
          }
        ]
      },
    ]
  }

  if (filter) {
    filterAll.offset = filter.offset,
      filterAll.limit = filter.limit
  }

  filterAll.where = {}

  if (empId) {
    filterAll.where.employee_id = empId
  }

  if (filter.active) {
    filterAll.where.active = filter.active
  }

  return await EmployeeFile.findAndCountAll(filterAll)
}

async function acquireByEmployeeId(empId) {
  return await EmployeeFile.findAll({
    where: {
      employee_id: empId
    },
    attributes: ['id', 'url', 'type']
  })
}

async function acquireProfilePicture(empId) {
  return await EmployeeFile.findOne({
    where: {
      [Op.and]: [
        {
          employee_id: empId
        },
        {
          type: 'Profile'
        }
      ]
    }
  })
}

async function upsert(data) {
  return await EmployeeFile.findOne({
    where: {
      [Op.and]: [
        {
          employee_id: data.employee_id
        },
        {
          type: data.type
        },
      ]
    }
  }).then((obj) => {
    if (obj) {
      data.updated_at = moment()
      fileHelper.remove(obj.url)
      return obj.update(data);
    }
    data.created_at = moment()
    data.updated_at = moment()
    return EmployeeFile.create(data);
  })
}

module.exports = {
  acquireAllData,
  acquireByEmployeeId,
  acquireProfilePicture,
  upsert
}