const service = require("../services/employeeV2.service");
const sendResponse = require("../resources/responseApi");

const getByID = async (req, res, next) => {
  try {
    const { id } = req.params

    const data = await service.getByIDData(id)
    return res.status(200).send(sendResponse.successGet(data));
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}

const getAll = async (req, res, next) => {
  try {
    let data;
    if (req.query.type) {
      data = await service.getAllTinyData(req.query);
    } else {
      data = await service.getAllData(req.query);
    }
    return res.status(200).send(sendResponse.successGet(data));
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

const getAtasan = async (req, res, next) => {
  try {
    const data = await service.getAtasanData(req.query);
    return res.status(200).send(data);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

const getBawahan = async (req, res, next) => {
  try {
    const data = await service.getBawahanData(req.query);
    return res.status(200).send(data);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

const getCount = async (req, res, next) => {
  try {
    const data = await service.getCountData(req.query);
    return res.status(200).send(sendResponse.successGet(data));
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

module.exports = {
  getAll,
  getAtasan,
  getBawahan,
  getCount,
  getByID
};
