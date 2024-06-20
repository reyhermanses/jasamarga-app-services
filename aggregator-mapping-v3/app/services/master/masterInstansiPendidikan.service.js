const repository = require("../../repositories/master/masterInstansiPendidikan.repository");

const getAllData = async (req) => {
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

  if (req.query.name) {
    filter.name = req.query.name;
  }

  if (req.query.active) {
    filter.active = req.query.active;
  }

  const data = await repository.acquireAllData(filter);

  return {
    total_pages: Math.ceil(data.count / filter.limit),
    current_page: req.query.page || 1,
    ...data,
  };
};

async function getOneById(id) {
  return await repository.acquireById(id);
}

const createData = async (data) => {
  let insertedData = await repository.generate(data);
  return insertedData;
};

const updateData = async (id, data, username) => {
  data.updated_by = username;
  return await repository.modernize(id, data);
};

const destroyData = async (id) => {
  return await repository.remove(id);
};

module.exports = {
  getAllData,
  createData,
  updateData,
  destroyData,
  getOneById,
};
