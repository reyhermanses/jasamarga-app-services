const service = require('../services/template.service')
const moment = require("moment");
moment.locale('id');

const getMaster = async (req, res, next) => {
  try {
    const excelBuffer = await service.getMasterData(req);
    // Set the appropriate headers
    res.setHeader('Content-Disposition', `attachment; filename="master_guide ${moment().format('LLLL')}.xlsx"`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    // Send the Excel buffer as the response
    res.send(excelBuffer);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}

const getMasterPosition = async (req, res, next) => {
  try {
    const excelBuffer = await service.getMasterPositionData(req);
    // Set the appropriate headers
    res.setHeader('Content-Disposition', `attachment; filename="master_jabatan ${moment().format('LLLL')}.xlsx"`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    // Send the Excel buffer as the response
    res.send(excelBuffer);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}

module.exports = {
  getMaster,
  getMasterPosition
}