const repository = require("../repositories/family.repository");
const repositoryEmployee = require("../repositories/education.repository");

async function getAllDataAlternate(req) {
  const data = await repository.acquireAllDataAlternate(req.query.employee_id);
  return data;
}

async function getAllData(req) {
  let filter = {};

  if (req.query.limit) {
    filter.limit = req.query.limit ? req.query.limit : 0;
  } else {
    filter.limit = 20;
  }

  if (req.query.page) {
    filter.offset =
      req.query.page && req.query.page != 1
        ? (req.query.page - 1) * filter.limit
        : 0;
  }

  const data = await repository.acquireAllData(filter, req.query.employee_id);

  return {
    total_pages: Math.ceil(data.count / filter.limit),
    current_page: req.query.page || 1,
    ...data,
  };
}

async function getOneById(id) {
  const data = await repository.acquireById(id);
  return data;
}

async function destroyData(id) {
  return await repository.remove(id);
}

async function createData(data) {
  const insertedData = await repository.generate(data);
  return insertedData;
}

async function updateData(id, data, username) {
  data.updated_by = username;
  const updatedData = await repository.modernize(id, data);
  return updatedData;
}

module.exports = {
  getAllData,
  getOneById,
  destroyData,
  createData,
  updateData,
  getAllDataAlternate,
};
