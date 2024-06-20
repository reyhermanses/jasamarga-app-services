const repository = require('../repositories/organizationHierarchy.repository')
const Redis = require("../../config/redis");

const resetRedis = require("../resources/resetRedis")

async function getAllData(req) {
  let filter = {}

  if (req.query.page)
    filter.offset = (req.query.page && req.query.page != 1) ? (req.query.page - 1) * req.query.limit : 0

  if (req.query.limit)
    filter.limit = req.query.limit ? req.query.limit : 0

  return await repository.acquireAllData(filter, req.query.name, req.query.parent_id)
}

async function getAllDataByPosition(req) {
  return await repository.acquireGroupByPosition()
}

async function getOneById(id) {
  const data = await repository.acquireById(id)
  let dataFinal = JSON.parse(JSON.stringify(data))
  dataFinal.children = {
    total: dataFinal.children.length,
    data: dataFinal.children
  }
  return dataFinal
}

async function updateData(id, data) {
  const dataUpdate = await repository.modernize(id, data)
  await resetRedis()
  return dataUpdate
}

async function create(data) {
  const dataCreate = await repository.create(data);
  await resetRedis()
  return dataCreate
}

const getDataFormation = async (req) => {
  if (!req.query.org_id && !req.query.personal_area_id) {
    const { reply } = await Redis.get("org-formation");

    if (reply) {
      return JSON.parse(reply);
    }
  }
  const initOrg = req.query.org_id ? parseInt(req.query.org_id) : 40000000
  let initialData = {}
  let allData = {}
  let dataInit = await repository.acquireById(initOrg)

  if (!req.query.org_id && req.query.personal_area_id) {
    initialData = await repository.acquireFormationByPersonalArea(req.query.personal_area_id)
    allData = {}
  } else {
    initialData = await repository.acquireInitialFormation(initOrg)
    allData = {
      id: initOrg,
      name: dataInit.name,
      relation: dataInit.relation,
      job: await repository.acquireFilledPosition('organization', initOrg),
    }
  }

  let data = []

  for (obj of initialData) {
    const childData = await repository.acquireFormation(obj.id)
    data.push(childData)
  }

  if (!req.query.org_id && req.query.personal_area_id) {
    allData = data
  } else {
    allData.subRows = data
  }

  if (!req.query.org_id && !req.query.personal_area_id) {
    Redis.set("org-formation", JSON.stringify(allData));
  }
  return allData
}

const getFilterFormationData = async (req) => {
  const filter = {
    personal_area_id: req.query.personal_area_id,
    relation: 'unit_kerja'
  }

  if (req.query.parent_id) {
    filter.id = req.query.parent_id
  }

  return data = await repository.acquireFilterFormation(filter)
}

const checkChildOrgData = async (id, search) => {
  const filter = {
    id: id
  }

  const data = await repository.acquireFilterFormation(filter)
  const obj = data.find(obj => obj.id == search);

  return obj
}

module.exports = {
  getAllData,
  getOneById,
  getAllDataByPosition,
  updateData,
  getDataFormation,
  create,
  getFilterFormationData,
  checkChildOrgData
}