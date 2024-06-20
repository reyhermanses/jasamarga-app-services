const service = require('../services/hobby.service')
const sendResponse = require('../resources/responseApi')

const { validationResult } = require('express-validator');

async function getAll(req, res, next) {
  try {
    const dataHobby = await service.getAllData(req)
    return res.status(200).send(sendResponse.successGet(dataHobby))
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}

async function create(req, res, next) {
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
    req.body.updated_by = req.api_key.name
    let insertedData = await service.createData(req.body)
    return res.status(200).send(sendResponse.successCreate(insertedData.dataValues.id))
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}

async function update(req, res, next) {
  try {
    let data = await service.getOneByIdData(req.params.id)
    if (!data) {
      return res.status(404).send(sendResponse.dataNotFoundException())
    } else {
      req.body.updated_by = req.api_key.name
      let dataUpdate = await service.updateData(req.params.id, req.body)
      return res.status(200).send(sendResponse.successUpdate(dataUpdate))
    }
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}

async function destroy(req, res, next) {
  try {
    let searchData = await service.getOneByIdData(req.params.id)
    if (!searchData) {
      return res.status(404).send(sendResponse.dataNotFoundException())
    } else {
      await service.destroyData(req.params.id)
      return res.status(201).send(sendResponse.successDelete(req.params.id))
    }
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}

module.exports = {
  getAll,
  create,
  update,
  destroy
}