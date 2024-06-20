const service = require('../services/omAction3.service')
const sendResponse = require('../resources/responseApi')
const { sequelize } = require('../../models');

const get = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const data = await service.getData(req, transaction);
    await transaction.commit();
    return res.status(200).send(sendResponse.successGet(data));
  } catch (error) {
    await transaction.rollback();
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}

module.exports = {
  get
}