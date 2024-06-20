const repository = require('../repositories/historyJabatan.repository')

async function getAllData(req) {
  let filter = {}

  if (req.query.limit) {
    filter.limit = req.query.limit ? req.query.limit : 0
  } else {
    filter.limit = 20
  }

  if (req.query.page) {
    filter.offset = (req.query.page && req.query.page != 1) ? (req.query.page - 1) * filter.limit : 0
  }

  return await repository.acquireAllData(filter, req.query.employee_id)
}

async function getOneByIdData(id) {
  const data = await repository.acquireById(id)
  return data
}

async function createData(data) {
  const insertedData = await repository.generate(data)
  return insertedData
}

async function updateData(id, data, username) {
  data.updated_by = username
  const updatedData = await repository.modernize(id, data)
  return updatedData
}

async function destroyData(id) {
  return await repository.remove(id)
}

module.exports = {
  getAllData,
  createData,
  updateData,
  getOneByIdData,
  destroyData
}