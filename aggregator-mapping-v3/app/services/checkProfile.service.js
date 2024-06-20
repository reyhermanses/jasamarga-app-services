const repository = require("../repositories/checkProfile.repository");

const getData = async (req) => {
  const data = await repository.acquireData(
    req.query.unit_id,
    req.query.company_id
  );
  return data;
};

const getByIDData = async (id) => {
  const data = await repository.acquireByID(id);
  return data;
};

module.exports = { getData, getByIDData };
