const { MasterPersonalArea, MasterPersonalSubArea } = require('../../../models')
let moment = require('moment')

async function acquireAllData(filter = {}) {
  filter.attributes = {
    exclude: ['created_at', 'updated_at', 'created_by', 'updated_by']
  }
  return await MasterPersonalArea.findAll(filter)
}

async function upsert(data) {
  return await MasterPersonalArea.findOne({
    where: {
      id: data.id
    }
  }).then((obj) => {
    if (obj) {
      data.updated_by = 'cron-db'
      return obj.update(data);
    }
    data.created_by = data.created_by,
      data.created_at = moment()
    data.updated_at = moment()
    return MasterPersonalArea.create(data);
  })
}

async function acquireById(id) {
  return await MasterPersonalArea.findOne({
    where: {
      id: id
    },
    include: {
      model: MasterPersonalSubArea,
      as: 'personal_sub_area',
      attributes: {
        exclude: ['created_at', 'updated_at', 'created_by', 'updated_by']
      }
    },
    attributes: {
      exclude: ['created_at', 'updated_at', 'created_by', 'updated_by']
    }
  })
}

async function generate(data) {
  return await MasterPersonalArea.create(data)
}

async function modernize(id, data) {
  return await MasterPersonalArea.update(
    data,
    {
      where: {
        id: id
      }
    }
  )
}

async function remove(id) {
  return await MasterPersonalArea.destroy({
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
  remove,
  upsert
}