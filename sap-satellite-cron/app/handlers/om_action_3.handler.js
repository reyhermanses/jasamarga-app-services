const service = require('../services/om_action_3.service')
const sendResponse = require('../resources/responseApi')

const transfer19 = async (req, res, next) => {
  try {
    const data = await service.transferData19(req.query.changedate)
    return res.status(200).send(sendResponse.successGet(data))
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}

module.exports = { transfer19 }