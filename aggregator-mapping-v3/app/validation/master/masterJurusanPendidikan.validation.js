const { body } = require('express-validator')

exports.validate = (method) => {

  switch (method) {
    case 'create':
      return [
        body('name').not().isEmpty().withMessage('name wajib diisi')
          .bail().
          isLength({ min: 5, max: 100 }).withMessage('name minimal 5 karakter dan maksimal 100 karakter'),

        body('active').not().isEmpty().withMessage('active wajib diisi')
          .bail().isBoolean().withMessage('active harus bertipe boolean'),
      ]
    case 'update':
      return [
        body('name').optional({ nullable: true }).isLength({ min: 5, max: 100 }).withMessage('name minimal 5 karakter dan maksimal 100 karakter'),
        body('active').optional({ nullable: true }).isBoolean().withMessage('active harus bertipe boolean'),
      ]

    default:
      break;
  }
}