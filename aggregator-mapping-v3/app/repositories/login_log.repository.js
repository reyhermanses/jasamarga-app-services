const {
  LoginLog
} = require("../../models");

const generate = async (data) => {
  return await LoginLog.create(data)
}

module.exports = {
  generate
}