const { body } = require('express-validator')

exports.validate = (method) => {

  switch (method) {
    case 'create':
      return [
        // jenjang
        body('jenjang').not().isEmpty().withMessage('jenjang wajib diisi')
          .bail().
          isLength({ min: 2, max: 20 }).withMessage('jenjang minimal 2 karakter dan maksimal 20 karakter')
      ]
    case 'update':
      return [
        //  jenjang
        body('jenjang').optional({ nullable: true }).isLength({ min: 2, max: 20 }).withMessage('jenjang minimal 2 karakter dan maksimal 20 karakter')
      ]

    default:
      break;
  }
}