const { body } = require('express-validator')
const { acquireById: acquireEmployee } = require('../../repositories/employee.repository')

exports.validate = (method) => {
  switch (method) {
    case 'create':
      return [
        // employee_id
        body('employee_id')
          .custom(async (value, { req }) => {
            if (!value) {
              return Promise.reject('employee_id wajib diisi')
            }
            const dataEmployee = await acquireEmployee(value)
            if (!dataEmployee) {
              return Promise.reject(
                'employee_id tidak ditemukan'
              );
            }
          }),
        // tahun
        body('tahun').not().isEmpty().withMessage('tahun wajib diisi')
          .bail().isInt().withMessage('tahun harus bertipe integer'),

        // pelatihan
        body('pelatihan').not().isEmpty().withMessage('pelatihan wajib diisi')
          .bail().
          isLength({ min: 2, max: 255 }).withMessage('pelatihan minimal 2 karakter dan maksimal 255 karakter'),

        // pelaksanaan
        body('pelaksanaan').not().isEmpty().withMessage('pelaksanaan wajib diisi')
          .bail().
          isLength({ min: 2, max: 255 }).withMessage('pelaksanaan minimal 2 karakter dan maksimal 255 karakter'),

        // tgl_awal
        body('tgl_awal').not().isEmpty().withMessage('tgl_awal wajib diisi')
          .bail().isDate().withMessage('tgl_awal harus bertipe tanggal'),

        // tgl_akhir
        body('tgl_akhir').not().isEmpty().withMessage('tgl_akhir wajib diisi')
          .bail().isDate().withMessage('tgl_akhir harus bertipe tanggal'),

        // hari
        body('hari').optional({ nullable: true }).isInt().withMessage('hari harus bertipe integer'),

        // tempat
        body('tempat').not().isEmpty().withMessage('tempat wajib diisi')
          .bail().
          isLength({ min: 2, max: 255 }).withMessage('tempat minimal 2 karakter dan maksimal 255 karakter'),

        // kota
        body('kota').not().isEmpty().withMessage('kota wajib diisi')
          .bail().
          isLength({ min: 2, max: 255 }).withMessage('kota minimal 2 karakter dan maksimal 255 karakter'),

        // inisiator
        body('inisiator').not().isEmpty().withMessage('inisiator wajib diisi')
          .bail().
          isLength({ min: 2, max: 255 }).withMessage('inisiator minimal 2 karakter dan maksimal 255 karakter'),

        // no_penugasan
        body('no_penugasan').not().isEmpty().withMessage('no_penugasan wajib diisi')
          .bail().
          isLength({ min: 2, max: 255 }).withMessage('no_penugasan minimal 2 karakter dan maksimal 255 karakter'),

        // klp_plth1
        body('klp_plth1').not().isEmpty().withMessage('klp_plth1 wajib diisi')
          .bail().
          isLength({ min: 2, max: 255 }).withMessage('klp_plth1 minimal 2 karakter dan maksimal 255 karakter'),

        // klp_plth2
        body('klp_plth2').not().isEmpty().withMessage('klp_plth2 wajib diisi')
          .bail().
          isLength({ min: 2, max: 255 }).withMessage('klp_plth2 minimal 2 karakter dan maksimal 255 karakter'),

        // negara
        body('negara').not().isEmpty().withMessage('negara wajib diisi')
          .bail().
          isLength({ min: 2, max: 255 }).withMessage('negara minimal 2 karakter dan maksimal 255 karakter'),

        // nosertifikat
        body('nosertifikat').not().isEmpty().withMessage('nosertifikat wajib diisi')
          .bail().
          isLength({ min: 2, max: 255 }).withMessage('nosertifikat minimal 2 karakter dan maksimal 255 karakter'),

        // nilai
        body('nilai').not().isEmpty().withMessage('nilai wajib diisi')
          .bail().
          isLength({ min: 1, max: 255 }).withMessage('nilai minimal 1 karakter dan maksimal 255 karakter'),

        // peringkat
        body('peringkat').not().isEmpty().withMessage('peringkat wajib diisi')
          .bail().
          isLength({ min: 1, max: 255 }).withMessage('peringkat minimal 1 karakter dan maksimal 255 karakter'),

        // biaya
        body('biaya').optional({ nullable: true }).isFloat().withMessage('biaya harus bertipe integer'),
      ]
    case 'update':
      return [
        // employee_id
        body('employee_id')
          .custom(async (value, { req }) => {
            if (!value) {
              return Promise.reject('employee_id wajib diisi')
            }
            const dataEmployee = await acquireEmployee(value)
            if (!dataEmployee) {
              return Promise.reject(
                'employee_id tidak ditemukan'
              );
            }
          }).optional({ nullable: true }),
        // tahun
        body('tahun').optional({ nullable: true }).isInt().withMessage('tahun harus bertipe integer'),

        // pelatihan
        body('pelatihan').optional({ nullable: true }).isLength({ min: 2, max: 255 }).withMessage('pelatihan minimal 2 karakter dan maksimal 255 karakter'),

        // pelaksanaan
        body('pelaksanaan').optional({ nullable: true }).isLength({ min: 2, max: 255 }).withMessage('pelaksanaan minimal 2 karakter dan maksimal 255 karakter'),

        // tgl_awal
        body('tgl_awal').optional({ nullable: true }).isDate().withMessage('tgl_awal harus bertipe tanggal'),

        // tgl_akhir
        body('tgl_akhir').optional({ nullable: true }).isDate().withMessage('tgl_akhir harus bertipe tanggal'),

        // hari
        body('hari').optional({ nullable: true }).isInt().withMessage('hari harus bertipe integer'),

        // tempat
        body('tempat').optional({ nullable: true }).isLength({ min: 2, max: 255 }).withMessage('tempat minimal 2 karakter dan maksimal 255 karakter'),

        // kota
        body('kota').optional({ nullable: true }).isLength({ min: 2, max: 255 }).withMessage('kota minimal 2 karakter dan maksimal 255 karakter'),

        // inisiator
        body('inisiator').optional({ nullable: true }).isLength({ min: 2, max: 255 }).withMessage('inisiator minimal 2 karakter dan maksimal 255 karakter'),

        // no_penugasan
        body('no_penugasan').optional({ nullable: true }).isLength({ min: 2, max: 255 }).withMessage('no_penugasan minimal 2 karakter dan maksimal 255 karakter'),

        // klp_plth1
        body('klp_plth1').optional({ nullable: true }).isLength({ min: 2, max: 255 }).withMessage('klp_plth1 minimal 2 karakter dan maksimal 255 karakter'),

        // klp_plth2
        body('klp_plth2').optional({ nullable: true }).isLength({ min: 2, max: 255 }).withMessage('klp_plth2 minimal 2 karakter dan maksimal 255 karakter'),

        // negara
        body('negara').optional({ nullable: true }).isLength({ min: 2, max: 255 }).withMessage('negara minimal 2 karakter dan maksimal 255 karakter'),

        // nosertifikat
        body('nosertifikat').optional({ nullable: true }).isLength({ min: 2, max: 255 }).withMessage('nosertifikat minimal 2 karakter dan maksimal 255 karakter'),

        // nilai
        body('nilai').optional({ nullable: true }).isLength({ min: 1, max: 255 }).withMessage('nilai minimal 1 karakter dan maksimal 255 karakter'),

        // peringkat
        body('peringkat').optional({ nullable: true }).isLength({ min: 1, max: 255 }).withMessage('peringkat minimal 1 karakter dan maksimal 255 karakter'),

        // biaya
        body('biaya').optional({ nullable: true }).isFloat().withMessage('biaya harus bertipe integer'),
      ]

    default:
      break;
  }
}