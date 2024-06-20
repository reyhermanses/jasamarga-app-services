const service = require('../services/sapObjectRelation.service')
const sendResponse = require('../resources/responseApi')

async function getByChangedate(req, res, next) {
    try {
        const data = await service.getDataByChangedate(req)
        return res.status(200).send(sendResponse.successGet(data))
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

async function sync(req, res, next) {
    try {
        const data = await service.getDataSAP(req)
        return res.status(200).send(sendResponse.successGet(data))
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

module.exports = {
    getByChangedate,
    sync
}