const service = require('../services/training.service')
const sendResponse = require('../resources/responseApi')

const { validationResult } = require('express-validator');

const moment = require("moment");
moment.locale('id');

async function getAll(req, res, next) {
  try {
    const dataTraining = await service.getAllData(req)
    return res.status(200).send(sendResponse.successGet(dataTraining))
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
      let datUpdate = await service.updateData(req.params.id, req.body)
      return res.status(200).send(sendResponse.successUpdate(datUpdate))
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

async function getExcelHistory(req, res) {
  try {
    const buffer = await service.getExcelHistoryData(req);

    res.setHeader('Content-Disposition', `attachment; filename="history_training ${moment().format('LLLL')}.xlsx"`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    res.send(buffer);
  } catch (error) {
    console.log(error);
    return res.status(500).send(sendResponse.internalServerError());
  }
}

module.exports = {
  getAll,
  create,
  update,
  destroy,
  getExcelHistory
}