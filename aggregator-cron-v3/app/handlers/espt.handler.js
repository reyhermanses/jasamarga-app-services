const service = require("../services/espt.service");
const sendResponse = require("../resources/responseApi");

const handlerSap = async (req, res) => {
  try {
    let response = await service.serviceSap(req.query);
    return res.status(200).send(sendResponse.successTransaction());
  } catch (error) {
    console.log(error);
    return res.status(500).send(sendResponse.internalServerError());
  }
};

async function getAll(req, res) {
  try {
    const data = await service.getAllDataEspt(req);
    return res.status(200).send(sendResponse.successGet(data));
  } catch (error) {
    console.log(error);
    return res.status(500).send(sendResponse.internalServerError());
  }
}

module.exports = {
  handlerSap,
  getAll,
};
