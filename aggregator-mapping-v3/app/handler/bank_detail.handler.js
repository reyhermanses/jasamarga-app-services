const service = require('../services/bank_detail.service')
const sendResponse = require('../resources/responseApi')
const {
    validationResult
} = require('express-validator')
const {
    sequelize
} = require('../../models')


async function handlerSap(req, res){
    try {
        const data = await service.serviceSap(req)
        return res.status(200).send(sendResponse.successTransaction())
    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    handlerSap
}