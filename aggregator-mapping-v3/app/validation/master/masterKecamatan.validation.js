const repocity = require('../../repositories/master/masterCity.repository')
const {
  body
} = require('express-validator')

exports.validate = (method) => {

  switch (method) {
    case 'create':
      return [
        body('city_id').not().isEmpty().withMessage('city wajib diisi').custom(async (value, {
          req
        }) => {
          let dataCity = await repocity.acquireById(value)
          if (!dataCity) {
            return Promise.reject('city_id tidak ditemukan')
          }
        }),
        body('name').not().isEmpty().withMessage('name wajib diisi'),
        body('active').not().isEmpty().withMessage('active wajib diisi')
          .bail().isBoolean().withMessage('active harus bertipe boolean'),
      ]
    case 'update':
      return [
        body('city_id').not().isEmpty().withMessage('city wajib diisi').custom(async (value) => {
          let dataCity = await repocity.acquireById(value)
          if (!dataCity) {
            return Promise.reject('city_id tidak ditemukan')
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