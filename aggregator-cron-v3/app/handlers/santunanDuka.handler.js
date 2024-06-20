const serviceSantunanDuka = require("../services/santunanDuka.service");
const sendResponse = require("../resources/responseApi");

const handlerSap = async (req, res) => {
  try {
    const data = await serviceSantunanDuka.serviceSap(req.query);
    return res.status(200).send(sendResponse.successTransaction());
  } catch (error) {
    console.error(error);
  }
};
module.exports = {
  handlerSap,
};
