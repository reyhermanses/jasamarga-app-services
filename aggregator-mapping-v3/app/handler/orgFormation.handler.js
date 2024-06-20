const { validationResult } = require('express-validator');

const service = require('../services/orgFormation.service')
const { sequelize } = require('../../models');
const sendResponse = require('../resources/responseApi')

const upsert = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const extractedErrors = []
      errors.array().map(err => extractedErrors.push(
        {
          [err.param]: err.msg
        }
      ))
      return res.status(422).send(sendResponse.unprocessableEntityError(extractedErrors))
    }
    await service.upsertData(req, transaction)
    await transaction.commit();
    return res.status(200).send(sendResponse.successCreate(req.body.data))
  } catch (error) {
    await transaction.rollback();
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}

module.exports = {
  upsert
}