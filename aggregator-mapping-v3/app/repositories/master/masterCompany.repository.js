const { MasterCompany } = require('../../../models')
let moment = require('moment')

async function acquireAllData(filter = {}) {
  filter.attributes = {
    exclude: ['created_at', 'updated_at', 'created_by', 'updated_by']
  }
  return await MasterCompany.findAll(filter)
}

async function acquireById(id) {
  return await MasterCompany.findOne({
    where: {
      id: id
    },
    attributes: {
      exclude: ['created_at', 'updated_at', 'created_by', 'updated_by']
    }
  })
}

async function generate(data) {
  return await MasterCompany.create(data)
}

async function modernize(id, data) {
  return await MasterCompany.update(
    data,
    {
      where: {
        id: id
      }
    }
  )
}

async function remove(id) {
  return await MasterCompany.destroy({
    where: {
      id: id
    }
  })
}

module.exports = {
  acquireAllData,
  acquireById,
  generate,
  modernize,
  remove
}