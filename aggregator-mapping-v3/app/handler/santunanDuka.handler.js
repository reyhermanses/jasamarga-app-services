const serviceSantunanDuka = require('../services/santunanDuka.service')
const sendResponse = require('../resources/responseApi')

async function handlerSap(req, res) {
    try {
        const data = await serviceSantunanDuka.serviceSap(req)
        return res.status(200).send(sendResponse.successTransaction())
    } catch (error) {
        console.error(error)
    }
}
module.exports = {
    handlerSap
}