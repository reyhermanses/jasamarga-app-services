const { body } = require('express-validator')

exports.validate = (method) => {

  switch (method) {
    case 'create':
      return [
        body('description').not().isEmpty().withMessage('description wajib diisi')
          .bail().
          isLength({ min: 5, max: 50 }).withMessage('description minimal 5 karakter dan maksimal 50 karakter'),

        body('active').not().isEmpty().withMessage('active wajib diisi')
          .bail().isBoolean().withMessage('active harus bertipe boolean'),
      ]
    case 'update':
      return [
        body('description').optional({ nullable: true }).isLength({ min: 5, max: 50 }).withMessage('description minimal 5 karakter dan maksimal 50 karakter'),
        body('active').optional({ nullable: true }).isBoolean().withMessage('active harus bertipe boolean'),
      ]

    default:
      break;
  }
}