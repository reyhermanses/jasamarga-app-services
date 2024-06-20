const service = require("../services/payslip.service");
const sendResponse = require("../resources/responseApi");

const transfer = async (req, res, next) => {
  try {
    const data = await service.transferData(
      req.query.period,
      req.query.personnel_number
    );
    return res.status(200).send(sendResponse.successGet(data));
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

module.exports = {
  transfer,
};
