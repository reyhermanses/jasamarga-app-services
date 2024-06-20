const service = require('../services/requester.service')
const sendResponse = require('../resources/responseApi')

async function getAll(req, res) {
    try {
        const data = await service.getAllData(req)
        return res.status(200).send(sendResponse.successGet(data))
    } catch (error) {
        console.log(error)
        return res.status(500).send(sendResponse.internalServerError())
    }
}

module.exports = {
    getAll
}