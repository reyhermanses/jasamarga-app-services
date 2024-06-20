const service = require("../services/bank_detail.service");
const sendResponse = require("../resources/responseApi");

const handlerSap = async (req, res) => {
  try {
    const data = await service.serviceSap(req);
    return res.status(200).send(sendResponse.successTransaction());
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  handlerSap,
};
