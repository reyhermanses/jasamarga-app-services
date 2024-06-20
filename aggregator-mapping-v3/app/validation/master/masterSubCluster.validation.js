const { body } = require('express-validator')

exports.validate = (method) => {

  switch (method) {
    case 'create':
      return [
        body('cluster_kode').not().isEmpty().withMessage('cluster_kode wajib diisi')
          .bail().
          isLength({ min: 2, max: 50 }).withMessage('cluster_kode minimal 2 karakter dan maksimal 50 karakter'),

        body('kode').not().isEmpty().withMessage('kode wajib diisi')
          .bail().
          isLength({ min: 2, max: 20 }).withMessage('kode minimal 2 karakter dan maksimal 20 karakter'),

        body('name').not().isEmpty().withMessage('name wajib diisi')
          .bail().
          isLength({ min: 5, max: 100 }).withMessage('name minimal 5 karakter dan maksimal 100 karakter'),

        body('fungsi').not().isEmpty().withMessage('fungsi wajib diisi')
      ]
    case 'update':
      return [
        body('cluster_kode').optional({ nullable: true }).isLength({ min: 2, max: 50 }).withMessage('cluster_kode minimal 2 karakter dan maksimal 50 karakter'),
        body('kode').optional({ nullable: true }).isLength({ min: 2, max: 20 }).withMessage('kode minimal 2 karakter dan maksimal 20 karakter'),
        body('name').optional({ nullable: true }).isLength({ min: 5, max: 100 }).withMessage('name minimal 5 karakter dan maksimal 100 karakter'),
      ]

    default:
      break;
  }
}