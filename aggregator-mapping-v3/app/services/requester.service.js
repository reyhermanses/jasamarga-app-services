const repository = require('../repositories/requester.repository')

async function getAllData(key) {
  return await repository.acquireAllData(key)
}

module.exports = {
  getAllData
}