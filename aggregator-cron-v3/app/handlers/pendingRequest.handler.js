const service = require('../services/pendingRequest.service')
const sendResponse = require('../resources/responseApi')

const getCurrent = async (req, res, next) => {
  try {
    const data = await service.getCurrentData()
    return res.status(200).send(sendResponse.successGet(data))
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}

module.exports = { getCurrent }