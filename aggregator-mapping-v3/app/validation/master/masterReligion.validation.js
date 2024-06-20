const { body } = require('express-validator')

exports.validate = (method) => {

  switch (method) {
    case 'create':
      return [
        // religion
        body('religion').not().isEmpty().withMessage('religion wajib diisi')
          .bail().
          isLength({ min: 3 }).withMessage('religion minimal 3 karakter'),

        // active
        body('active').not().isEmpty().withMessage('active wajib diisi')
          .bail().isBoolean().withMessage('active harus bertipe boolean'),
      ]
    case 'update':
      return [
        //  religion
        body('religion').optional({ nullable: true }).isLength({ min: 3 }).withMessage('religion minimal 3 karakter'),

        // active
        body('active').optional({ nullable: true }).isBoolean().withMessage('active harus bertipe boolean'),
      ]

    default:
      break;
  }
}