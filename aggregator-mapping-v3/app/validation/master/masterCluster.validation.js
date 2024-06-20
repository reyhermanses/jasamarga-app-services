const { body } = require('express-validator')

exports.validate = (method) => {

  switch (method) {
    case 'create':
      return [
        // kode
        body('kode').not().isEmpty().withMessage('kode wajib diisi')
          .bail().
          isLength({ min: 3, max: 50 }).withMessage('kode minimal 3 karakter dan maksimal 50 karakter'),

        // name
        body('name').not().isEmpty().withMessage('name wajib diisi')
          .bail().
          isLength({ min: 3, max: 50 }).withMessage('name minimal 3 karakter dan maksimal 50 karakter'),

        // active
        body('active').not().isEmpty().withMessage('active wajib diisi')
          .bail().
          isBoolean().withMessage('active harus bertipe boolean'),
      ]
    case 'update':
      return [
        //  kode
        body('kode').optional({ nullable: true }).isLength({ min: 3, max: 50 }).withMessage('kode minimal 3 karakter dan maksimal 50 karakter'),
        body('name').optional({ nullable: true }).isLength({ min: 3, max: 50 }).withMessage('name minimal 3 karakter dan maksimal 50 karakter'),
        body('active').not().optional({ nullable: true }).isBoolean().withMessage('active harus bertipe boolean'),
      ]

    default:
      break;
  }
}