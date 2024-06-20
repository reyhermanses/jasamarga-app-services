const { validationResult } = require("express-validator");

const service = require("../services/mobility.service");
const sendResponse = require("../resources/responseApi");
const { sequelize } = require("../../models");

const rangkap = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const extractedErrors = [];
      errors.array().map((err) =>
        extractedErrors.push({
          [err.param]: err.msg,
        })
      );
      return res
        .status(422)
        .send(sendResponse.unprocessableEntityError(extractedErrors));
    }
    const data = await service.generateRangkapData(
      req.body,
      req.api_key.name,
      transaction
    );
    await transaction.commit();
    return res.status(200).send(sendResponse.successGet(data));
  } catch (error) {
    await transaction.rollback();
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

const genratePensiunTerminate = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    if (
      !req.query.mode ||
      (req.query.mode !== "terminate" && req.query.mode !== "pensiun")
    ) {
      return res
        .status(422)
        .send(sendResponse.unprocessableEntityError("mode is invalid"));
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const extractedErrors = [];
      errors.array().map((err) =>
        extractedErrors.push({
          [err.param]: err.msg,
        })
      );
      return res
        .status(422)
        .send(sendResponse.unprocessableEntityError(extractedErrors));
    }

    const data = await service.generatePensiunTerminateData(
      req.body,
      req.api_key.name,
      req.query.mode,
      transaction
    );
    await transaction.commit();
    return res.status(200).send(sendResponse.successGet(data));
  } catch (error) {
    await transaction.rollback();
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

const generatePromosiRotasiDemosi = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    if (
      !req.query.mode ||
      (req.query.mode !== "rotasi" &&
        req.query.mode !== "promosi" &&
        req.query.mode !== "demosi")
    ) {
      return res
        .status(422)
        .send(sendResponse.unprocessableEntityError("mode is invalid"));
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const extractedErrors = [];
      errors.array().map((err) =>
        extractedErrors.push({
          [err.param]: err.msg,
        })
      );
      return res
        .status(422)
        .send(sendResponse.unprocessableEntityError(extractedErrors));
    }
    const data = await service.generatePromosiRotasiDemosiData(
      req.body,
      req.api_key.name,
      req.query.mode,
      transaction
    );
    await transaction.commit();
    return res.status(200).send(sendResponse.successGet(data));
  } catch (error) {
    await transaction.rollback();
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

const paramsValidation = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const extractedErrors = [];
      errors.array().map((err) =>
        extractedErrors.push({
          [err.param]: err.msg,
        })
      );
      return res
        .status(422)
        .send(sendResponse.unprocessableEntityError(extractedErrors));
    }
    next();
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

const updateHistoryJabatanJmClick = async (req, res, next) => {
  try {
    const update = await service.updateHistoryJabatanJmClickData(req);
    return res.status(200).send(sendResponse.successUpdate(update));
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

module.exports = {
  generatePromosiRotasiDemosi,
  genratePensiunTerminate,
  rangkap,
  paramsValidation,
  updateHistoryJabatanJmClick,
};
