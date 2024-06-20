const repoKecamatan = require('../../repositories/master/masterKecamatan.repository')
const {
  body
} = require('express-validator')

exports.validate = (method) => {

  switch (method) {
    case 'create':
      return [
        body('kecamatan_id').not().isEmpty().withMessage('Subdistrict wajib diisi').custom(async (value) => {
          let dataKecamatan = await repoKecamatan.acquireById(value)
          if (!dataKecamatan) {
            return Promise.reject('kecamatan_id tidak ditemukan')
          }
        }),
        body('name').not().isEmpty().withMessage('Ward name wajib diisi'),
        body('active').not().isEmpty().withMessage('active wajib diisi')
          .bail().isBoolean().withMessage('active harus bertipe boolean'),
      ]
    case 'update':
      return [
        body('kecamatan_id').not().isEmpty().withMessage('city wajib diisi').custom(async (value) => {
          let dataKecamatan = await repoKecamatan.acquireById(value)
          if (!dataKecamatan) {
            return Promise.reject('kecamatan_id tidak ditemukan')
          }
        }),
        body('name').not().isEmpty().withMessage('name wajib diisi'),
        body('active').not().isEmpty().withMessage('active wajib diisi')
          .bail().isBoolean().withMessage('active harus bertipe boolean'),
      ]

    default:
      break;
  }
}