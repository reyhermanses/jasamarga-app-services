const repository = require('../repositories/hobby.repository')

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

  const data = await repository.acquireAllData(filter, req.query.employee_id)

  return { total_pages: Math.ceil(data.count / filter.limit), current_page: req.query.page || 1, ...data }
}

async function createData(data) {
  return await repository.generate(data)
}

async function updateData(id, data) {
  return await repository.modernize(id, data)
}

async function getOneByIdData(id) {
  return await repository.acquireById(id)
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