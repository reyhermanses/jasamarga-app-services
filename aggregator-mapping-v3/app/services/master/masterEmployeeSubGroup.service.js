const repository = require('../../repositories/master/masterEmployeeSubGroup.repository')

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

  let dataMasterEmployeeGroup = await repository.acquireMasterEmployeeGroupById(data.master_employee_group_id)

  if (!dataMasterEmployeeGroup) {
    return "master employee group tidak ditemukan"
  }

  let insertedData = await repository.generate(data)
  return insertedData
}

async function updateData(id, data, username) {
  let dataUpdate = {}

  if (data.key != null) {
    dataUpdate.key = data.key
  }

  if (data.subgroup != null) {
    dataUpdate.subgroup = data.subgroup
  }

  if (data.master_employee_group_id != null) {
    let dataMasterEmployeeGroup = await repository.acquireMasterEmployeeGroupById(data.master_employee_group_id)

    if (!dataMasterEmployeeGroup) {
      return "master employee group tidak ditemukan"
    }
    dataUpdate.master_employee_group_id = data.master_employee_group_id
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