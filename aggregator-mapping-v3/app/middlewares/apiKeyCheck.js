const dotenv = require('dotenv')
const service = require('../services/requester.service')
const sendResponse = require('../resources/responseApi')
dotenv.config()

const authenticateAdmin = async (req, res, next) => {
  try {
    if (req.api_key.role !== 'Admin') {
      const error = new Error('Unauthorized');
      error.statusCode = 403;
      throw error;
    }
    next()
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}

const checkRequester = async (req, res, next) => {
  try {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
      const error = new Error('Go Find Your Credential');
      error.statusCode = 401;
      throw error;
    }

    const validate = await service.getAllData(apiKey)
    if (!validate) {
      const error = new Error('Unauthorized');
      error.statusCode = 401;
      throw error;
    }
    req.api_key = validate
    next()
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}

const checkJMCLICK = async (req, res, next) => {
  try {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
      const error = new Error('Go Find Your Credential');
      error.statusCode = 401;
      throw error;
    }

    const validate = await service.getAllData(apiKey)
    if (!validate) {
      const error = new Error('Unauthorized');
      error.statusCode = 401;
      throw error;
    }

    if (validate.name !== 'JM-CLICK') {
      const error = new Error('Only JM-CLICK can access this service');
      error.statusCode = 401;
      throw error;
    }

    req.api_key = validate
    next()
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}

module.exports = {
  checkRequester,
  authenticateAdmin,
  checkJMCLICK
}