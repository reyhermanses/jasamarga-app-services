const repository = require('../../repositories/master/masterPersonalSubArea.repository')

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

  let dataPersonalArea = await repository.acquirePersonalAreaById(data.master_personal_area_id)

  if (!dataPersonalArea) {
    return "personal area tidak ditemukan"
  }

  let insertedData = await repository.generate(data)
  return insertedData
}

async function updateData(id, data, username) {
  let dataUpdate = {}
  if (data.description != null) {
    dataUpdate.description = data.description
  }

  if (data.master_personal_area_id != null) {
    let dataPersonalArea = await repository.acquirePersonalAreaById(data.master_personal_area_id)

    if (!dataPersonalArea) {
      return "personal area tidak ditemukan"
    }

    dataUpdate.master_personal_area_id = data.master_personal_area_id
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