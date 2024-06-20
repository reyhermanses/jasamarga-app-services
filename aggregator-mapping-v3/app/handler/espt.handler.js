const service = require("../services/espt.service");
const sendResponse = require("../resources/responseApi");
const { validationResult } = require("express-validator");
const { sequelize } = require("../../models");

async function handlerSap(req, res) {
  try {
    let data = await service.serviceSap();
    return res.status(200).send(sendResponse.successGet(data));
  } catch (error) {
    console.log(error);
    return res.status(500).send(sendResponse.internalServerError());
  }
}

async function getAll(req, res) {
  try {
    const data = await service.getAllDataEspt(req);
    return res.status(200).send(sendResponse.successGet(data));
  } catch (error) {
    console.log(error);
    return res.status(500).send(sendResponse.internalServerError());
  }
}

module.exports = {
  handlerSap,
  getAll,
};
