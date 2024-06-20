const {
  MasterKecamatan,
  MasterCity
} = require('../../../models')
const {
  Op
} = require("sequelize");

async function acquireAllData(query = null) {
  let filter = {
    attributes: {
      exclude: ['created_at', 'updated_at', 'created_by', 'updated_by']
    },
    include: [{
      model: MasterCity,
      as: 'master_city',
    }],
  }

  if (query) {
    if ('city_id' in query) {
      filter.include[0].where = {
        id: query.city_id
      }
    }
  }

  // return filter;
  return await MasterKecamatan.findAll(filter)
}

async function acquireById(id) {
  return await MasterKecamatan.findOne({
    where: {
      id: id
    },
    attributes: {
      exclude: ['created_at', 'updated_at', 'created_by', 'updated_by']
    }
  })
}

async function acquireByCityId(cityId) {
  return await MasterKecamatan.findOne({
    where: {
      city_id: cityId
    },
    attributes: {
      exclude: ['created_at', 'updated_at', 'created_by', 'updated_by']
    }
  })
}

const acquiredByIDandCityID = async (id, city_id) => {
  return await MasterKecamatan.findOne({
      where: {
          [Op.and] : [
              {
                  id : id
              },
              {
                  city_id : city_id
              }
          ]
      }
  })
}

async function generate(data) {
  return await MasterKecamatan.create(data)
}

async function modernize(id, data) {
  return await MasterKecamatan.update(
    data, {
      where: {
        id: id
      }
    }
  )
}
async function remove(id) {
  return await MasterKecamatan.destroy({
    where: {
      id: id
    }
  })
}

module.exports = {
  acquireAllData,
  acquireById,
  acquireByCityId,
  generate,
  modernize,
  remove,
  acquiredByIDandCityID
}