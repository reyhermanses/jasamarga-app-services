const repository = require('../../repositories/master/masterGradeLevel.repository')

async function getAllData(req) {
  const keys = Object.keys(req.query);
  const checkKeys = keys.filter((obj) => {
    return (
      obj !== "page" &&
      obj !== "limit" &&
      obj !== "grade" &&
      obj !== "level" &&
      obj !== "sublevel" &&
      obj !== "subgroup_id"
    );
  });

  if (checkKeys.length > 0) {
    const error = new Error("filter is invalid");
    error.statusCode = 422;
    throw error;
  }

  let filter = {};

  if (req.query.limit) {
    filter.limit = req.query.limit ? req.query.limit : 0;
    delete req.query.limit;
  } else {
    filter.limit = 20;
  }

  if (req.query.page) {
    filter.offset =
      req.query.page && req.query.page != 1
        ? (req.query.page - 1) * filter.limit
        : 0;
    delete req.query.page;
  }


  const data = await repository.acquireAllData(filter, req.query);

  return {
    total_pages: Math.ceil(data.count / filter.limit),
    current_page: req.query.page || 1,
    ...data,
  };
}

const getOneByIdData = async (id) => {
  return await repository.acquireById(id)
}

const getBySubgroupId = async (id) => {
  return await repository.acquireBySubgroupId(id)
}

const createData = async (data) => {
  let insertingData = await repository.generate(data)
  return insertingData
}

const updateData = async (id, data, username) => {
  let dataUpdate = data
  dataUpdate.updated_by = username

  return await repository.modernize(id, dataUpdate)
}

const destroyData = async (id) => {
  return await repository.remove(id)
}

module.exports = {
  getAllData,
  getOneByIdData,
  getBySubgroupId,
  createData,
  updateData,
  destroyData
}