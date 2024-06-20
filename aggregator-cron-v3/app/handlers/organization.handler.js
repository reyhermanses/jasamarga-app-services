const service = require('../services/organization.service')
const sendResponse = require('../resources/responseApi')

const get = async (req, res, next) => {
  try {
    const data = await service.getData(req, 'ubah_leader');
    return res.status(200).send(sendResponse.successGet(data));
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}

const getHierarchy = async (req, res, next) => {
  try {
    const data = await service.getData(req, 'org_only');
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
  getHierarchy
}
