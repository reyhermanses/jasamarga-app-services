const service = require('../services/file.service')
const sendResponse = require('../resources/responseApi')

async function getAll(req, res, next) {
  try {
    const data = await service.getAllData(req)
    return res.status(200).send(sendResponse.successGet(data))
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}

async function uploadAttachment(req, res, next) {
  try {
    req.filenames.forEach(async obj => {
      if (obj.name == 'Profile') {
        await service.updateProfileData(obj.filename, req.body.employee_id, req.api_key.name)
      }

      if (obj.name == 'attachment_ktp') {
        await service.updateDataKtp(obj.filename, req.body.employee_id, req.api_key.name)
      }

      if (obj.name == 'attachment_kk') {
        await service.updateDataKK(obj.filename, req.body.employee_id, req.api_key.name)
      }

      if (obj.name == 'attachment_bpjs_ket') {
        await service.updateDataBPJSKet(obj.filename, req.body.employee_id, req.api_key.name)
      }

      if (obj.name == 'attachment_bpjs_kes') {
        await service.updateDataBPJSKes(obj.filename, req.body.employee_id, req.api_key.name)
      }

      if (obj.name == 'attachment_npwp') {
        await service.updateDataNPWP(obj.filename, req.body.employee_id, req.api_key.name)
      }

      if (obj.name == 'attachment_buku_nikah') {
        await service.updateDataBukuNikah(obj.filename, req.body.employee_id, req.api_key.name)
      }

      if (obj.name == 'attachment_dana_pensiun') {
        await service.updateDataDanaPensiun(obj.filename, req.body.employee_id, req.api_key.name)
      }

      if (obj.name == 'file_sk') {
        await service.upsertDataSK(obj.filename, req.body.position_id, req.api_key.name)
      }
    })
    return res.status(200).send(sendResponse.successUpload(req.filenames))
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}

module.exports = {
  getAll,
  uploadAttachment
}