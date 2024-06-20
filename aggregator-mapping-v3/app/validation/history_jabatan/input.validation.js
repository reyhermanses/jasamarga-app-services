const { body } = require('express-validator')
const repository = require('../../repositories/historyJabatan.repository')

exports.validate = (method) => {
  switch (method) {
    case 'create':
      return [
        // employee_id
        body('employee_id').not().isEmpty().withMessage('employee_id wajib diisi')
          .bail().
          isInt().withMessage('employee_id harus bertipe integer')
          .bail()
          .custom(async (value) => {
            let dataEmployee = await repository.acquireEmployeeById(value)
            if (!dataEmployee) {
              return Promise.reject(
                'employee_id tidak ditemukan'
              );
            }
          }),

        // angkatan
        body('angkatan').not().isEmpty().withMessage('angkatan wajib diisi')
          .bail().
          isInt().withMessage('angkatan harus bertipe integer'),

        // posisi
        body('posisi').not().isEmpty().withMessage('posisi wajib diisi'),

        // sk_posisi
        body('sk_posisi').not().isEmpty().withMessage('sk_posisi wajib diisi'),

        // awal_posisi
        body('awal_posisi').not().isEmpty().withMessage('awal_posisi wajib diisi')
          .bail()
          .isDate().withMessage('awal_posisi harus bertipe format tanggal'),

        // akhir_posisi
        body('akhir_posisi').not().isEmpty().withMessage('akhir_posisi wajib diisi')
          .bail()
          .isDate().withMessage('akhir_posisi harus bertipe format tanggal'),

        // grade
        body('grade').not().isEmpty().withMessage('grade wajib diisi')
          .bail()
          .isLength({ min: 2, max: 10 }).withMessage('grade minimal 2 karakter dan maksimal 10 karakter'),

        // level
        body('level').not().isEmpty().withMessage('level wajib diisi')
          .bail()
          .isLength({ min: 2, max: 10 }).withMessage('level minimal 2 karakter dan maksimal 10 karakter'),

        // konversi
        body('konversi').not().isEmpty().withMessage('konversi wajib diisi')
          .bail()
          .isLength({ min: 2, max: 10 }).withMessage('konversi minimal 2 karakter dan maksimal 10 karakter'),

        // unit
        body('unit').not().isEmpty().withMessage('unit wajib diisi'),

        // kd_comp
        body('kd_comp').not().isEmpty().withMessage('kd_comp wajib diisi')
          .bail().
          isInt().withMessage('kd_comp harus bertipe integer')
          .bail().
          custom(async (value) => {
            let dataCompany = await repository.acquireCompanyById(value)
            if (!dataCompany) {
              return Promise.reject(
                'kd_comp tidak ditemukan'
              );
            }
          }),

        // cluster
        body('cluster').optional({ nullable: true })
          .isLength({ min: 2, max: 50 }).withMessage('cluster minimal 2 karakter dan maksimal 50 karakter'),

        // sub_cluster
        body('sub_cluster').optional({ nullable: true })
          .isLength({ min: 2, max: 50 }).withMessage('sub_cluster minimal 2 karakter dan maksimal 50 karakter'),

        // sk_position_date
        body('sk_position_date').not().isEmpty().withMessage('sk_position_date wajib diisi')
          .bail()
          .isDate().withMessage('sk_position_date harus bertipe format tanggal'),

        // action
        body('action').not().isEmpty().withMessage('action wajib diisi'),

        // is_main
        body('is_main').not().isEmpty().withMessage('is_main wajib diisi')
          .bail().
          isBoolean().withMessage('is_main harus bertipe boolean'),
      ]
    case 'update':
      return [
        // employee_id
        body('employee_id').optional({ nullable: true }).isInt().withMessage('employee_id harus bertipe integer')
          .bail().
          custom(async (value) => {
            let dataEmployee = await repository.acquireEmployeeById(value)
            if (!dataEmployee) {
              return Promise.reject(
                'employee_id tidak ditemukan'
              );
            }
          }),

        // angkatan
        body('angkatan').optional({ nullable: true }).isInt().withMessage('angkatan harus bertipe integer'),

        // awal_posisi
        body('awal_posisi').optional({ nullable: true }).isDate().withMessage('awal_posisi harus bertipe format tanggal'),

        // akhir_posisi
        body('akhir_posisi').optional({ nullable: true }).isDate().withMessage('akhir_posisi harus bertipe format tanggal'),

        // grade
        body('grade').optional({ nullable: true }).isLength({ min: 2, max: 10 }).withMessage('grade minimal 2 karakter dan maksimal 10 karakter'),

        // level
        body('level').optional({ nullable: true }).isLength({ min: 2, max: 10 }).withMessage('level minimal 2 karakter dan maksimal 10 karakter'),

        // konversi
        body('konversi').optional({ nullable: true }).isLength({ min: 2, max: 10 }).withMessage('konversi minimal 2 karakter dan maksimal 10 karakter'),

        // kd_comp
        body('kd_comp').optional({ nullable: true }).isInt().withMessage('kd_comp harus bertipe integer')
          .bail().
          custom(async (value) => {
            let dataCompany = await repository.acquireCompanyById(value)
            if (!dataCompany) {
              return Promise.reject(
                'kd_comp tidak ditemukan'
              );
            }
          }),

        // cluster
        body('cluster').optional({ nullable: true })
          .isLength({ min: 2, max: 50 }).withMessage('cluster minimal 2 karakter dan maksimal 50 karakter'),

        // sub_cluster
        body('sub_cluster').optional({ nullable: true })
          .isLength({ min: 2, max: 50 }).withMessage('sub_cluster minimal 2 karakter dan maksimal 50 karakter'),

        // sk_position_date
        body('sk_position_date').optional({ nullable: true }).isDate().withMessage('sk_position_date harus bertipe format tanggal'),

        // is_main
        body('is_main').optional({ nullable: true }).isBoolean().withMessage('is_main harus bertipe boolean'),
      ]

    default:
      break;
  }
}