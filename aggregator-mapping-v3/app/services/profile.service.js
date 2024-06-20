const repository = require('../repositories/profile.repository')

async function getAllData(req) {
  return await repository.acquireAllData(req.query.employee_id)
}

async function getOneById(id) {
  const data = await repository.acquireById(id)
  return data
}

async function getOneByEmployeeIdData(id) {
  return await repository.acquireOneByEmployeeId(id)
}

async function destroyData(id) {
  return await repository.remove(id)
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

module.exports = {
  getAllData,
  getOneById,
  destroyData,
  createData,
  updateData,
  getOneByEmployeeIdData
}