const service = require('../../services/master/masterKelurahan.service')
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

async function getOneBySubdistrictId(req, res) {
  try {
    let data = await service.getBySubdistrictId(req.params.id)
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
      kecamatan_id,
      name,
      active
    } = req.body

    let insertedData = await service.create({
      kecamatan_id,
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
  getOneBySubdistrictId,
  create,
  update,
  destroy
}