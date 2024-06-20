const service = require('../services/organizationHierarchy.service')
const sendResponse = require('../resources/responseApi')
const {
  validationResult
} = require('express-validator')

async function getAll(req, res) {
  try {
    let data = await service.getAllData(req)
    return res.status(200).send(sendResponse.successGet(data))
  } catch (error) {
    console.log(error)
    return res.status(500).send(sendResponse.internalServerError())
  }
}

const getFormation = async (req, res, next) => {
  try {
    const data = await service.getDataFormation(req)
    return res.status(200).send(sendResponse.successGet(data))
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}

const getFilterFormation = async (req, res, next) => {
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

    const data = await service.getFilterFormationData(req)

    return res.status(200).send(sendResponse.successGet(data))
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}

async function getAllByPosition(req, res) {
  try {
    let data = await service.getAllDataByPosition(req)
    return res.status(200).send(sendResponse.successGet(data))
  } catch (error) {
    console.log(error)
    return res.status(500).send(sendResponse.internalServerError())
  }
}

async function getOne(req, res) {
  try {
    let data = await service.getOneById(req.params.id)
    if (!data) {
      return res.status(404).send(sendResponse.dataNotFoundException())
    } else {
      return res.status(200).send(sendResponse.successGet(data))
    }
  } catch (error) {
    console.log(error)
    return res.status(500).send(sendResponse.internalServerError())
  }
}

async function create(req, res, next) {
  try {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const extractedErrors = []
      errors.array().map(err => extractedErrors.push({
        [err.param]: err.msg
      }))
      return res.status(422).send(sendResponse.unprocessableEntityError(extractedErrors))
    }
    const createdData = await service.create(req.body)
    return res.status(200).send(sendResponse.successCreate(createdData))

  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}

async function update(req, res, next) {
  try {
    let data = await service.getOneById(req.params.id)
    if (!data) {
      return res.status(404).send(sendResponse.dataNotFoundException())
    } else {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const extractedErrors = []
        errors.array().map(err => extractedErrors.push({
          [err.param]: err.msg
        }))
        return res.status(422).send(sendResponse.unprocessableEntityError(extractedErrors))
      }
      const updatedData = await service.updateData(req.params.id, req.body)
      return res.status(200).send(sendResponse.successUpdate(updatedData))
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
  getOne,
  getAllByPosition,
  update,
  getFormation,
  create,
  getFilterFormation
}