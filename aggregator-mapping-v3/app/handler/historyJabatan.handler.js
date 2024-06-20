const service = require('../services/historyJabatan.service')
const sendResponse = require('../resources/responseApi')
const { validationResult } = require('express-validator')
const { sequelize } = require('../../models')

async function getAll(req, res) {
  try {
    let data = await service.getAllData(req)
    return res.status(200).send(sendResponse.successGet(data))
  } catch (error) {
    console.log(error)
    return res.status(500).send(sendResponse.internalServerError())
  }
}

async function create(req, res) {
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
    console.log(error)
    return res.status(500).send(sendResponse.internalServerError())
  }
}

const destroy = async (req, res, next) => {
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

async function update(req, res) {
  const t = await sequelize.transaction();
  try {
    let data = await service.getOneByIdData(req.params.id)
    if (!data) {
      return res.status(404).send(sendResponse.dataNotFoundException())
    } else {
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
      let updatedData = await service.updateData(req.params.id, req.body, req.api_key.name)
      await t.commit();
      return res.status(200).send(sendResponse.successUpdate(updatedData))
    }
  } catch (error) {
    console.log(error)
    await t.rollback();
    return res.status(500).send(sendResponse.internalServerError())
  }
}

module.exports = {
  getAll,
  create,
  update,
  destroy
}
