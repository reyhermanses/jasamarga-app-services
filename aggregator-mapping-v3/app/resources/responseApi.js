function successGet(data) {
  let dataResult = {
    "status": true,
    "message": "successfully get data",
    "code": 200,
    "total": data.length,
    "data": data
  }
  return dataResult
}

function resourceExist(message) {
  return {
    "status": false,
    "message": message,
    "code": 409
  }
}

function successUpload(fileName) {
  return {
    "status": true,
    "message": "Upload Success",
    "code": 200,
    "file_name": fileName
  }
}

function successOrder(orderId) {
  let data = {
    "status": true,
    "message": "Order Registered",
    "code": 200,
    "order_id": orderId
  }
  return data
}

function successLogin(data, message) {
  return {
    "status": true,
    "message": message,
    "code": 200,
    "is_logged_in": 1,
    "token": data,
  }
}

function successLoginOracle1(data, message) {
  return {
    "status": 200,
    "message": message,
    "total": data.length,
    "data": data
  }
}

function forbidden(message) {
  let dataUnauthorized = {
    "status": false,
    "message": message,
    "code": 403
  }
  return dataUnauthorized
}

function unauthorized(message) {
  let dataUnauthorized = {
    "status": false,
    "message": message,
    "code": 401
  }
  return dataUnauthorized
}

function successUpdate(data) {
  let dataResult = {
    "status": true,
    "message": "successfully update data",
    "code": 200,
    "length": data.length,
    "data": data
  }
  return dataResult
}

function successTransaction() {
  return {
    "status": true,
    "message": "Transaction Success",
    "code": 200
  }
}

function internalServerError() {
  let dataError = {
    "status": false,
    "message": "internal server error, check console logs",
    "code": 500,
  }
  return dataError
}

function internalServerErrorWithData(error) {
  let dataError = {
    "status": false,
    "message": "internal server error",
    "code": 500,
    "errors": error
  }
  return dataError
}

function failedToUpload() {
  let error = {
    "status": false,
    "message": "something went wrong when uploading file",
    "code": 400,
  }
  return error
}

function userExist() {
  return {
    "status": false,
    "message": "user already exists",
    "code": 400,
  }
}

function processingTransaction(data) {
  return {
    "status": true,
    "message": "data is processing",
    "code": 200,
    "data": data
  }
}

function unprocessableEntityError(data) {
  let dataError = {
    "status": false,
    "message": "unprocessable entity",
    "code": 422,
    "errors": data
  }
  return dataError
}

function unprocessableEntityFile(message) {
  let dataError = {
    "status": false,
    "message": message,
    "code": 422
  }
  return dataError
}

function successCreate(idData) {
  let dataInput = {
    "status": true,
    "message": "successfully create data",
    "code": 201,
    "id": idData,
  }
  return dataInput
}

function successDelete(id) {
  let data = {
    "status": true,
    "message": "successfully delete data",
    "code": 201,
    "id": id
  }
  return data
}

function dataNotFoundException() {
  let dataNotFound = {
    "status": false,
    "message": "data not found",
    "code": 404
  }
  return dataNotFound
}

function NotFoundHttpException() {
  let notFound = {
    "status": false,
    "message": "Route not found",
    "code": 404
  }
  return notFound
}

function uploadFileException() {
  return {
    "status": false,
    "message": "Please Upload Photo File",
    "code": 400
  }
}

module.exports = {
  successGet,
  internalServerError,
  successCreate,
  dataNotFoundException,
  successUpdate,
  unauthorized,
  successLogin,
  successDelete,
  uploadFileException,
  successUpload,
  successOrder,
  successTransaction,
  unprocessableEntityError,
  userExist,
  forbidden,
  NotFoundHttpException,
  failedToUpload,
  internalServerErrorWithData,
  unprocessableEntityFile,
  resourceExist,
  successLoginOracle1, // rey
  processingTransaction
}