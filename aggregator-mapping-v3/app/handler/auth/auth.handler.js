const sendResponse = require('../../resources/responseApi')
const service = require('../../services/auth/auth.service')
const { validationResult } = require('express-validator');
const dotenv = require('dotenv');
dotenv.config();

const temporaryLogin = async (req, res) => {
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
    let message = 'successfully login'
    const { username, password } = req.body
    let data
    if (username === 'admin-aggregator') {
      data = await service.checkAdmin(username, password)
      return res.status(200).send(sendResponse.successLoginOracle1({
        auth: data
      }, message))
    } else {
      data = await service.checkNonAdminTemporary(req, username, password)
      if (password === process.env.DEFAULT_PASSWORD) {
        message = 'successfully login, using default password'
      }
      return res.status(200).send(sendResponse.successLoginOracle1(data, message))
    }
  } catch (error) {
    console.log(error)
    if (error.message == 'False Username or Password' || 'Inactive User' || 'LDAP Password Expired') {
      return res.status(401).send(sendResponse.unauthorized(error.message))
    } else if (error.message == 'User not Found') {
      return res.status(404).send({
        "status": false,
        "message": "user not found",
        "code": 404,
      })
    } else {
      return res.status(500).send(sendResponse.internalServerError())
    }
  }
}

async function login(req, res) {
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
    let message = 'successfully login'
    const { username, password } = req.body
    let data
    if (username === 'admin-aggregator') {
      data = await service.checkAdmin(username, password)
      return res.status(200).send(sendResponse.successLoginOracle1({
        auth: data
      }, message))
    } else {
      data = await service.checkNonAdmin(req, username, password)
      if (password === process.env.DEFAULT_PASSWORD) {
        message = 'successfully login, using default password'
      }
      return res.status(200).send(sendResponse.successLoginOracle1(data, message))
    }
  } catch (error) {
    console.log(error)
    if (error.message == 'False Username or Password' || 'Inactive User' || 'LDAP Password Expired') {
      return res.status(401).send(sendResponse.unauthorized(error.message))
    } else if (error.message == 'User not Found') {
      return res.status(404).send({
        "status": false,
        "message": "user not found",
        "code": 404,
      })
    } else {
      return res.status(500).send(sendResponse.internalServerError())
    }
  }
}

async function migrate(req, res) {
  try {
    const response = await service.migrateData(req.file.path)
    return res.status(200).send(sendResponse.successGet(response))
  } catch (error) {
    console.log(error)
    return res.status(500).send(sendResponse.internalServerError())
  }
}

module.exports = {
  login,
  migrate,
  temporaryLogin
}