const service = require("../services/masaKerja.service");
const sendResponse = require("../resources/responseApi");

const get = async (req, res, next) => {
  try {
    const data = await service.countMasaKerja(req.query.employee_id);
    return res.status(200).send(sendResponse.successGet(data));
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

module.exports = {
  get,
};