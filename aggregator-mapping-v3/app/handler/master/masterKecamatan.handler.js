const service = require('../../services/master/masterKecamatan.service')
const sendResponse = require('../../resources/responseApi')
const {
  validationResult
} = require('express-validator');
const {
  sequelize
} = require('../../../models')

async function getAll(req, res) {
  try {
    let data = await service.getData(req)
    return res.status(200).send(sendResponse.successGet(data))
  } catch (error) {
    console.log(error)
    return res.status(500).send(sendResponse.internalServerError())
  }
}

async function getOneById(req, res) {
  try {
    let data = await service.getById(req.params.id)
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

async function getOneByCityId(req, res) {
  try {
    let data = await service.getByCityId(req.params.id)
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

async function create(req, res) {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const extractedErrors = []
      errors.array().map(err => extractedErrors.push({
        [err.param]: err.msg
      }))
      return res.status(422).send(sendResponse.unprocessableEntityError(extractedErrors))
    }
    const {
      city_id,
      name,
      active
    } = req.body

    let insertedData = await service.create({
      city_id,
      name,
      active,
      "created_by": req.api_key.name
    })
    return res.status(200).send(sendResponse.successCreate(insertedData.dataValues.id))
  } catch (error) {
    console.log(error)
    return res.status(500).send(sendResponse.internalServerError())
  }
}

async function update(req, res) {
  const t = await sequelize.transaction();
  try {
    let data = await service.getById(req.params.id)
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

      let updatedData = await service.update(req.params.id, req.body, req.api_key.name)
      await t.commit();
      return res.status(200).send(sendResponse.successUpdate(updatedData))
    }
  } catch (error) {
    console.log(error)
    await t.rollback();
    return res.status(500).send(sendResponse.internalServerError())
  }
}

async function destroy(req, res) {
  try {
    let searchData = await service.getById(req.params.id)
    if (!searchData) {
      return res.status(404).send(sendResponse.dataNotFoundException())
    } else {
      await service.destroy(req.params.id)
      return res.status(201).send(sendResponse.successDelete(req.params.id))
    }
  } catch (error) {
    console.log(error)
    return res.status(500).send(sendResponse.internalServerError())
  }
}

module.exports = {
  getAll,
  getOneById,
  getOneByCityId,
  create,
  update,
  destroy
}