const service = require('../../services/master/masterEmployeeSubGroup.service')
const sendResponse = require('../../resources/responseApi')
const { validationResult } = require('express-validator');
const { sequelize } = require('../../../models')

async function getAll(req, res) {
  try {
    let data = await service.getAllData(req)
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
    const { key, subgroup, active, master_employee_group_id } = req.body

    let insertedData = await service.createData({ key, subgroup, active, master_employee_group_id, "created_by": req.api_key.name })

    if (insertedData == "master employee group tidak ditemukan") {
      return res.status(422).send(sendResponse.unprocessableEntityError(insertedData))
    }

    return res.status(200).send(sendResponse.successCreate(insertedData.dataValues.id))
  } catch (error) {
    console.log(error)
    return res.status(500).send(sendResponse.internalServerError())
  }
}

async function update(req, res) {
  const t = await sequelize.transaction();
  try {
    let data = await service.getOneById(req.params.id)
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

      if (updatedData == "master employee group tidak ditemukan") {
        return res.status(422).send(sendResponse.unprocessableEntityError(updatedData))
      }

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
    let searchData = await service.getOneById(req.params.id)
    if (!searchData) {
      return res.status(404).send(sendResponse.dataNotFoundException())
    } else {
      await service.destroyData(req.params.id)
      return res.status(201).send(sendResponse.successDelete(req.params.id))
    }
  } catch (error) {
    console.log(error)
    return res.status(500).send(sendResponse.internalServerError())
  }
}

module.exports = {
  getAll,
  getOne,
  create,
  update,
  destroy
}