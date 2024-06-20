const { body } = require('express-validator')

exports.validate = (method) => {

  switch (method) {
    case 'create':
      return [
        // bank_key
        body('bank_key').not().isEmpty().withMessage('bank_key wajib diisi')
          .bail().
          isLength({ min: 3, max: 20 }).withMessage('name minimal 3 karakter dan maksimal 20 karakter'),

        // bank_name
        body('bank_name').not().isEmpty().withMessage('bank_name wajib diisi')
          .bail().
          isLength({ min: 5, max: 50 }).withMessage('bank_name minimal 5 karakter dan maksimal 50 karakter'),


      ]
    case 'update':
      return [
        // bank_key
        body('bank_key').optional({ nullable: true }).isLength({ min: 3, max: 20 }).withMessage('bank_key minimal 3 karakter dan maksimal 20 karakter'),

        // bank_name
        body('bank_name').optional({ nullable: true }).isLength({ min: 5, max: 50 }).withMessage('bank_name minimal 5 karakter dan maksimal 50 karakter'),


      ]

    default:
      break;
  }
}