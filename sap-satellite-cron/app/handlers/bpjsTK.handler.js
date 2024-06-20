const service = require('../services/bpjsTK.service')
const sendResponse = require('../resources/responseApi')

const transfer = async (req, res, next) => {
  try {
    const data = await service.transferData(req.query.changedate);
    return res.status(200).send(sendResponse.successGet(data));
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}

module.exports = {
  transfer
}