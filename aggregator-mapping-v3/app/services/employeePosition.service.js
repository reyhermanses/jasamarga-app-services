const repository = require('../repositories/employeePosition.repository')

const getData = async (query) => {
  const keys = Object.keys(query);
  const checkKeys = keys.filter((obj) => {
    return (
      obj !== "employee_id" &&
      obj !== "npp" &&
      obj !== "personnel_number" &&
      obj !== "new_npp" &&
      obj !== "position_id" &&
      obj !== "atasan_id" &&
      obj !== "atasan_position_id" &&
      obj !== "action" &&
      obj !== "atasan_ap_id" &&
      obj !== "atasan_ap_position_id" &&
      obj !== "cost_center" &&
      obj !== "ket_ap" &&
      obj !== "is_main" &&
      obj !== "kd_comp" &&
      obj !== "name"
    );
  });

  if (checkKeys.length > 0) {
    const error = new Error("filter is invalid");
    error.statusCode = 422;
    throw error;
  }

  return await repository.acquireAllData(query)
}

const createData = async (body) => {
  return await repository.generate(body)
}

const updateData = async (id, data) => {
  const checkData = await repository.acquireById(id)

  if (!checkData) {
    const error = new Error("Data not found");
    error.statusCode = 404;
    throw error;
  }

  return await repository.modernize(id, data)
}

async function destroyData(id) {
  const checkData = await repository.acquireById(id)

  if (!checkData) {
    const error = new Error("Data not found");
    error.statusCode = 404;
    throw error;
  }
  return await repository.remove(id);
}

module.exports = {
  getData,
  createData,
  updateData,
  destroyData
}