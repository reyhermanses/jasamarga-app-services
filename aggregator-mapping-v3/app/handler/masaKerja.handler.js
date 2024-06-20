const service = require('../services/masaKerja.service')
const sendResponse = require('../resources/responseApi')

async function sync(req, res, next) {
  try {
    const dataEmployee = await service.syncData()
    return res.status(200).send(sendResponse.successGet(dataEmployee))
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}

async function getAll(req, res, next) {
  try {
    const dataMasaKerja = await service.getAllData(req)
    return res.status(200).send(sendResponse.successGet(dataMasaKerja))
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}

module.exports = {
  sync,
  getAll
}