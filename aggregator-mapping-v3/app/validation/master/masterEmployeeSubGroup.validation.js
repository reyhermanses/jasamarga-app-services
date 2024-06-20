const { body } = require('express-validator')

exports.validate = (method) => {

  switch (method) {
    case 'create':
      return [
        // master_employee_group_id
        body('master_employee_group_id').not().isEmpty().withMessage('master_employee_group_id wajib diisi'),

        // subgroup
        body('key').not().isEmpty().withMessage('key wajib diisi')
          .bail().
          isLength({ min: 1, max: 50 }).withMessage('key minimal 1 karakter dan maksimal 50 karakter'),

        // subgroup
        body('subgroup').not().isEmpty().withMessage('subgroup wajib diisi')
          .bail().
          isLength({ min: 5, max: 100 }).withMessage('subgroup minimal 5 karakter dan maksimal 100 karakter'),

        // active
        body('active').not().isEmpty().withMessage('active wajib diisi')
          .bail().isBoolean().withMessage('active harus bertipe boolean'),

        // master_employee_group_id
        body('master_employee_group_id').not().isEmpty().withMessage('master_employee_group_id wajib diisi')
      ]
    case 'update':
      return [
        // key
        body('key').optional({ nullable: true }).isLength({ min: 1, max: 50 }).withMessage('key minimal 1 karakter dan maksimal 50 karakter'),

        // subgroup
        body('subgroup').optional({ nullable: true }).isLength({ min: 5, max: 100 }).withMessage('subgroup minimal 5 karakter dan maksimal 100 karakter'),

        // active
        body('active').optional({ nullable: true }).isBoolean().withMessage('active harus bertipe boolean'),
      ]

    default:
      break;
  }
}