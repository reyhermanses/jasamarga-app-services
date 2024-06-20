const { body } = require('express-validator')

exports.validate = (method) => {

  switch (method) {
    case 'create':
      return [
        // description
        body('description').not().isEmpty().withMessage('description wajib diisi')
          .bail().
          isLength({ min: 5, max: 100 }).withMessage('description minimal 5 karakter dan maksimal 100 karakter'),

        // country_id
        body('country_id').not().isEmpty().withMessage('country_id wajib diisi'),

        // active
        body('active').not().isEmpty().withMessage('active wajib diisi')
          .bail().isBoolean().withMessage('active harus bertipe boolean'),
      ]
    case 'update':
      return [
        //  description
        body('description').optional({ nullable: true }).isLength({ min: 5, max: 100 }).withMessage('description minimal 5 karakter dan maksimal 100 karakter'),

        // active
        body('active').optional({ nullable: true }).isBoolean().withMessage('active harus bertipe boolean'),
      ]

    default:
      break;
  }
}