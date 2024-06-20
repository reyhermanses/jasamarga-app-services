const repository = require('../repositories/orgFormation.repository')
const resetRedis = require("../resources/resetRedis")

const upsertData = async (req, transaction) => {
  for (const element of req.body.data) {
    await repository.modernizeOrGenerate(element, req.api_key.name, transaction)
  }
  await resetRedis()
  return req.body.data
}

module.exports = {
  upsertData
}