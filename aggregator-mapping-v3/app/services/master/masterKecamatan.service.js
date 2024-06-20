const repository = require('../../repositories/master/masterKecamatan.repository')

async function getData(req) {
  return await repository.acquireAllData(req.query)
}

async function getById(id) {
  return await repository.acquireById(id)
}

async function getByCityId(id) {
  return await repository.acquireByCityId(id)
}

async function create(data) {
  let insertingData = await repository.generate(data)
  return insertingData
}

async function update(id, data, username) {
  let dataUpdate = {}
  if (data.city_id != null) {
    dataUpdate.city_id = data.city_id
  }

  if (data.name != null) {
    dataUpdate.name = data.name
  }

  dataUpdate.updated_by = username

  return await repository.modernize(id, dataUpdate)
}

async function destroy(id) {
  return await repository.remove(id)
}

module.exports = {
  getData,
  getById,
  getByCityId,
  create,
  update,
  destroy
}