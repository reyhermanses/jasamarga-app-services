const repository = require('../repositories/file.repository')
const masterPositionRepository = require('../repositories/master/masterPosition.repository')

const path = require('path')

require('dotenv').config()
async function getAllData(req) {
  let filter = {}

  if (req.query.limit) {
    filter.limit = req.query.limit ? req.query.limit : 0
  } else {
    filter.limit = 20
  }

  if (req.query.page) {
    filter.offset = (req.query.page && req.query.page != 1) ? (req.query.page - 1) * filter.limit : 0
  }

  if (req.query.active) {
    filter.active = req.query.active
  }

  const data = await JSON.parse(JSON.stringify(await repository.acquireAllData(filter, req.query.employee_id)))

  data.rows.map(obj => {
    obj.url = `${process.env.HOST}/api/v1/file?filename=${obj.url}`
    return obj
  })

  return { total_pages: Math.ceil(data.count / filter.limit), current_page: req.query.page || 1, ...data }
}

async function updateProfileData(filename, empId, userName) {

  const dataUpdate = {
    employee_id: empId,
    type: 'Profile',
    active: true,
    url: `EmployeeFile/Profile/${filename}`,
    created_by: userName,
    updated_by: userName
  }
  await repository.upsert(dataUpdate)
  return filename
}

async function updateDataKtp(filename, empId, userName) {
  const dataUpdate = {
    employee_id: empId,
    type: 'attachment_ktp',
    active: true,
    url: `${filename}`,
    created_by: userName,
    updated_by: userName
  }
  await repository.upsert(dataUpdate)
  return filename
}

async function updateDataKK(filename, empId, userName) {

  const dataUpdate = {
    employee_id: empId,
    type: 'attachment_kk',
    active: true,
    url: `${filename}`,
    created_by: userName,
    updated_by: userName
  }

  await repository.upsert(dataUpdate)
  return filename
}

async function updateDataBPJSKet(filename, empId, userName) {

  const dataUpdate = {
    employee_id: empId,
    type: 'attachment_bpjs_ket',
    active: true,
    url: `${filename}`,
    created_by: userName,
    updated_by: userName
  }

  await repository.upsert(dataUpdate)
  return filename
}

async function updateDataBPJSKes(filename, empId, userName) {

  const dataUpdate = {
    employee_id: empId,
    type: 'attachment_bpjs_kes',
    active: true,
    url: `${filename}`,
    created_by: userName,
    updated_by: userName
  }

  await repository.upsert(dataUpdate)
  return filename
}

async function updateDataNPWP(filename, empId, userName) {

  const dataUpdate = {
    employee_id: empId,
    type: 'attachment_npwp',
    active: true,
    url: `${filename}`,
    created_by: userName,
    updated_by: userName
  }

  await repository.upsert(dataUpdate)
  return filename
}

async function updateDataBukuNikah(filename, empId, userName) {

  const dataUpdate = {
    employee_id: empId,
    type: 'attachment_buku_nikah',
    active: true,
    url: `${filename}`,
    created_by: userName,
    updated_by: userName
  }

  await repository.upsert(dataUpdate)
  return filename
}

async function updateDataDanaPensiun(filename, empId, userName) {

  const dataUpdate = {
    employee_id: empId,
    type: 'attachment_dana_pensiun',
    active: true,
    url: `${filename}`,
    created_by: userName,
    updated_by: userName
  }

  await repository.upsert(dataUpdate)
  return filename
}

const upsertDataSK = async (filename, positionId, userName) => {
  const dataUpdate = {
    file_sk: filename,
    updated_by: userName
  }

  await masterPositionRepository.modernize(positionId, dataUpdate)
  return filename
}

module.exports = {
  getAllData,
  updateProfileData,
  updateDataKtp,
  updateDataKK,
  updateDataBPJSKet,
  updateDataBPJSKes,
  updateDataNPWP,
  updateDataBukuNikah,
  updateDataDanaPensiun,
  upsertDataSK
}