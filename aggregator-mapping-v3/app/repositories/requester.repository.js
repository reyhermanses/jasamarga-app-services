const {
  Requester,
  sequelize
} = require('../../models')
require('dotenv').config()

const acquireAllData = async (key = null) => {
  const filter = {
    raw: true
  }

  if (key) {
    filter.where = {
      key: key
    }
  }

  return await Requester.findOne(filter)
}

module.exports = {
  acquireAllData
}