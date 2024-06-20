const sendResponse = require('../../resources/responseApi')
const service = require('../../services/jm_click/user.service')

async function getAll(req, res, next) {
    try {
        const data = await service.getAllData()
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
        const data = await service.syncData()
        return res.status(200).send(sendResponse.successGet(data))
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

module.exports = {
    getAll,
    sync
}