const { body } = require('express-validator')

exports.validate = (method) => {

  switch (method) {
    case 'create':
      return [
        // name
        body('name').not().isEmpty().withMessage('name wajib diisi')
          .bail().
          isLength({ min: 5, max: 50 }).withMessage('name minimal 5 karakter dan maksimal 50 karakter'),

        // kd_comp
        body('kd_comp').not().isEmpty().withMessage('kd_comp wajib diisi')
          .bail().
          isLength({ min: 2, max: 50 }).withMessage('kd_comp minimal 2 karakter dan maksimal 50 karakter'),

        // nm_singkatan
        body('nm_singkatan').not().isEmpty().withMessage('nm_singkatan wajib diisi')
          .bail().
          isLength({ min: 2, max: 50 }).withMessage('nm_singkatan minimal 2 karakter dan maksimal 50 karakter'),

        // active
        body('active').not().isEmpty().withMessage('active wajib diisi')
          .bail().isBoolean().withMessage('active harus bertipe boolean'),
      ]
    case 'update':
      return [
        // name
        body('name').optional({ nullable: true }).isLength({ min: 5, max: 50 }).withMessage('name minimal 5 karakter dan maksimal 50 karakter'),

        // kd_comp
        body('kd_comp').optional({ nullable: true }).isLength({ min: 2, max: 50 }).withMessage('kd_comp minimal 2 karakter dan maksimal 50 karakter'),

        // nm_singkatan
        body('nm_singkatan').optional({ nullable: true }).isLength({ min: 2, max: 50 }).withMessage('nm_singkatan minimal 2 karakter dan maksimal 50 karakter'),

        // active
        body('active').optional({ nullable: true }).isBoolean().withMessage('active harus bertipe boolean'),
      ]

    default:
      break;
  }
}