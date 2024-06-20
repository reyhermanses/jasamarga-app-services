const { body } = require('express-validator')

exports.validate = (method) => {

  switch (method) {
    case 'create':
      return [
        // description
        body('description').not().isEmpty().withMessage('description wajib diisi')
          .bail().
          isLength({ min: 5, max: 100 }).withMessage('description minimal 5 karakter dan maksimal 100 karakter')
      ]
    case 'update':
      return [
        //  description
        body('description').optional({ nullable: true }).isLength({ min: 5, max: 100 }).withMessage('description minimal 5 karakter dan maksimal 100 karakter')
      ]

    default:
      break;
  }
}