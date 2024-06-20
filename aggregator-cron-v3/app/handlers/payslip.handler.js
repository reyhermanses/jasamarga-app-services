const service = require("../services/payslip.service");
const sendResponse = require("../resources/responseApi");

const get = async (req, res, next) => {
  try {
    await service.getData(req, res);
    return res.status(200).send(sendResponse.successTransaction());
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

const getOffcycle = async (req, res, next) => {
  try {
    const data = await service.getDataSAPOffcycle(req.query);
    return res.status(200).send(sendResponse.successTransaction());
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

const getDoubleOffcycle = async (req, res, next) => {
  try {
    const data = await service.getDataSAPDoubleOffcycle(req.query);
    return res.status(200).send(sendResponse.successTransaction());
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};


module.exports = {
  get,
  getOffcycle,
  getDoubleOffcycle,
};
