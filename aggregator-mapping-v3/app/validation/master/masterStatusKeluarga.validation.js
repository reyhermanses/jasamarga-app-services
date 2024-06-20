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

        body('type').not().isEmpty().withMessage('type wajib diisi')
          .bail().
          isLength({ min: 2, max: 20 }).withMessage('type minimal 2 karakter dan maksimal 20 karakter'),

        body('convert_families_status').not().isEmpty().withMessage('convert_families_status wajib diisi')
          .bail().
          isLength({ min: 2, max: 20 }).withMessage('convert_families_status minimal 2 karakter dan maksimal 20 karakter'),

        body('convert_families_object_id').not().isEmpty().withMessage('convert_families_object_id wajib diisi')
          .bail().
          isLength({ min: 2, max: 20 }).withMessage('convert_families_object_id minimal 2 karakter dan maksimal 20 karakter'),
      ]
    case 'update':
      return [
        body('description').optional({ nullable: true }).isLength({ min: 5, max: 50 }).withMessage('description minimal 5 karakter dan maksimal 50 karakter'),
        body('convert_families_status').optional({ nullable: true }).isLength({ min: 2, max: 20 }).withMessage('convert_families_status minimal 2 karakter dan maksimal 20 karakter'),
        body('convert_families_object_id').optional({ nullable: true }).isLength({ min: 2, max: 20 }).withMessage('convert_families_object_id minimal 2 karakter dan maksimal 20 karakter'),
        body('active').optional({ nullable: true }).isBoolean().withMessage('active harus bertipe boolean'),
      ]

    default:
      break;
  }
}