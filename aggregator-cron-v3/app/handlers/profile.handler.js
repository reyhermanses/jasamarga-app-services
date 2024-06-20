const service = require('../services/profile.service')
const sendResponse = require('../resources/responseApi')

const get = async (req, res, next) => {
  try {
    const data = await service.getData(req);
    return res.status(200).send(sendResponse.successGet(data));
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}

const getPersonalData = async (req, res, next) => {
  try {
    const data = await service.getDataPersonalData(req);
    return res.status(200).send(sendResponse.successGet(data));
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}

const getPersonalID = async (req, res, next) => {
  try {
    const data = await service.getDataPersonalID(req);
    return res.status(200).send(sendResponse.successGet(data));
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}

const getBPJSKes = async (req, res, next) => {
  try {
    const data = await service.getDataBPJSKes(req);
    return res.status(200).send(sendResponse.successGet(data));
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}

const getBPJSTK = async (req, res, next) => {
  try {
    const data = await service.getDataBPJSTK(req);
    return res.status(200).send(sendResponse.successGet(data));
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}

const getTax = async (req, res, next) => {
  try {
    const data = await service.getDataTax(req);
    return res.status(200).send(sendResponse.successGet(data));
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}

const getAddress = async (req, res, next) => {
  try {
    const data = await service.getDataAddress(req);
    return res.status(200).send(sendResponse.successGet(data));
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}

module.exports = {
  get,
  getPersonalData,
  getPersonalID,
  getBPJSKes,
  getBPJSTK,
  getTax,
  getAddress
}