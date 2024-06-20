const { validationResult } = require('express-validator');

const service = require('../../services/auth/auth_alternate.service')
const sendResponse = require('../../resources/responseApi')

const login = async (req, res, next) => {
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
    const data = await service.loginData(req.api_key.name, req.body)
    return res.status(200).send(sendResponse.successLoginOracle1(data, 'successfully login'))
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}

const refreshToken = async (req, res, next) => {
  try {
    const data = await service.refreshTokenData(req.body)
    return res.status(200).send(sendResponse.successLoginOracle1(data, 'successfully login'))
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}

module.exports = {
  login,
  refreshToken
}