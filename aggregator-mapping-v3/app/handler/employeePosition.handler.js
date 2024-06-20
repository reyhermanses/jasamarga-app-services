const service = require('../services/employeePosition.service')
const sendResponse = require('../resources/responseApi')

const { validationResult } = require('express-validator');

const get = async (req, res, next) => {
  try {
    const data = await service.getData(req.query)
    return res.status(200).send(sendResponse.successGet(data))
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}

const create = async (req, res, next) => {
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

    req.body.created_by = req.api_key.name

    let insertedData = await service.createData(req.body)
    return res.status(200).send(sendResponse.successCreate(insertedData.dataValues.id))

  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}

const update = async (req, res, next) => {
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

    req.body.updated_by = req.api_key.name

    const updatedData = await service.updateData(req.params.id, req.body)

    return res.status(200).send(sendResponse.successUpdate(updatedData))

  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}

const destroy = async (req, res, next) => {
  try {
    await service.destroyData(req.params.id)
    return res.status(201).send(sendResponse.successDelete(req.params.id))
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}

module.exports = {
  get,
  create,
  update,
  destroy
}