const service = require("../services/payslip.service");
const sendResponse = require("../resources/responseApi");
const { validationResult } = require("express-validator");
const { sequelize } = require("../../models");

async function getSAP(req, res) {
  try {
    await service.getDataSAPV3(req);
    return res.status(200).send(sendResponse.successTransaction());
    // return res.status(200).send(sendResponse.successGet(data))
  } catch (error) {
    console.log(error);
  }
}

async function getSapOffcycle(req, res) {
  try {
    await service.getDataSAPOffcycle(req);
    return res.status(200).send(sendResponse.successTransaction());
  } catch (error) {
    console.log(error);
  }
}

async function getAll(req, res) {
  try {
    const data = await service.getAllDataPayslip1(req);

    let message = "";

    if (data.length > 0) {
      message = "Successfully get data";
    } else message = "Data is empty";

    return res
      .status(200)
      .send(sendResponse.successLoginOracle1(data, message));
  } catch (error) {
    console.log(error);
    return res.status(500).send(sendResponse.internalServerError());
  }
}

async function getReqIsPublish(req, res) {
  try {
    await service.serviceUpdateIsPublish(req);
    return res.status(200).send(sendResponse.successTransaction());
  } catch (error) {
    console.log(error);
    return res.status(500).send(sendResponse.internalServerError());
  }
}

module.exports = {
  getSAP,
  getSapOffcycle,
  getAll,
  getReqIsPublish,
};
