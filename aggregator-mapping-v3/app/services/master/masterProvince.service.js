const repository = require('../../repositories/master/masterProvince.repository')

async function getAllData(req) {
  let filter = {}

  if (req.query.page)
    filter.offset = (req.query.page && req.query.page != 1) ? (req.query.page - 1) * req.query.limit : 0

  if (req.query.limit)
    filter.limit = req.query.limit ? req.query.limit : 0

  return await repository.acquireAllData(filter)
}

async function getOneById(id) {
  return await repository.acquireById(id)
}

async function createData(data) {

  let dataCountry = await repository.acquireCountryById(data.country_id)

  if (!dataCountry) {
    return "country tidak ditemukan"
  }

  let insertedData = await repository.generate(data)
  return insertedData
}

async function updateData(id, data, username) {
  let dataUpdate = {}
  if (data.country_id != null) {
    let dataCountry = await repository.acquireCountryById(data.country_id)

    if (!dataCountry) {
      return "country tidak ditemukan"
    }

    dataUpdate.country_id = data.country_id
  }

  if (data.description != null) {
    dataUpdate.description = data.description
  }

  if (data.active != null) {
    dataUpdate.active = data.active
  }

  dataUpdate.updated_by = username

  return await repository.modernize(id, dataUpdate)
}

async function destroyData(id) {
  return await repository.remove(id)
}

module.exports = {
  getAllData,
  getOneById,
  createData,
  updateData,
  destroyData
}