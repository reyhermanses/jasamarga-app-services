const {
  MasterKecamatan,
  MasterKelurahan
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
      model: MasterKecamatan,
      as: 'master_kecamatan',
    }],
  }

  if (query) {
    if ('kecamatan_id' in query) {
      filter.include[0].where = {
        id: query.kecamatan_id
      }
    }
  }

  return await MasterKelurahan.findAll(filter)
}

async function acquireById(id) {
  return await MasterKelurahan.findOne({
    where: {
      id: id
    },
    attributes: {
      exclude: ['created_at', 'updated_at', 'created_by', 'updated_by']
    }
  })
}

const acquiredByIDandKecamatanID = async (id, kecamatan_id) => {
  return await MasterKelurahan.findOne({
      where: {
          [Op.and] : [
              {
                  id : id
              },
              {
                  kecamatan_id : kecamatan_id
              }
          ]
      }
  })
}

async function acquireByCitySubdistrictId(subdistrictId) {
  return await MasterKelurahan.findOne({
    where: {
      kecamatan_id: subdistrictId
    },
    attributes: {
      exclude: ['created_at', 'updated_at', 'created_by', 'updated_by']
    }
  })
}

async function generate(data) {
  return await MasterKelurahan.create(data)
}

async function modernize(id, data) {
  return await MasterKelurahan.update(
    data, {
      where: {
        id: id
      }
    }
  )
}
async function remove(id) {
  return await MasterKelurahan.destroy({
    where: {
      id: id
    }
  })
}

module.exports = {
  acquireAllData,
  acquireById,
  acquireByCitySubdistrictId,
  generate,
  modernize,
  remove,
  acquiredByIDandKecamatanID
}