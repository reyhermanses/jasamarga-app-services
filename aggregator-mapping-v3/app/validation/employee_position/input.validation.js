const { body } = require('express-validator')
const repository = require('../../repositories/employeePosition.repository')
const positionRepository = require('../../repositories/master/masterPosition.repository')

exports.validate = (method) => {
  switch (method) {
    case 'create':
      return [
        // employee_id
        body('employee_id').optional({ nullable: true }).isInt().withMessage('employee_id harus bertipe integer')
          .custom(async (value, { req }) => {
            if (value) {
              const dataEmployee = await repository.acquireEmployeeById(value)
              if (!dataEmployee) {
                return Promise.reject(
                  'employee_id tidak ditemukan'
                );
              }
            }
          }),

        // npp
        body('npp').not().isEmpty().withMessage('npp wajib diisi')
          .bail().
          isLength({ min: 2, max: 20 }).withMessage('npp minimal 2 karakter dan maksimal 20 karakter'),

        // personnel_number
        body('personnel_number').not().isEmpty().withMessage('personnel_number wajib diisi')
          .bail().
          isLength({ min: 2, max: 20 }).withMessage('personnel_number minimal 2 karakter dan maksimal 20 karakter'),

        // new_npp
        body('new_npp').optional({ nullable: true }).
          isLength({ min: 2, max: 20 }).withMessage('new_npp minimal 2 karakter dan maksimal 20 karakter'),

        // position_id
        body('position_id').optional({ nullable: true }).isInt().withMessage('position_id harus bertipe integer')
          .custom(async (value, { req }) => {
            if (!value) {
              const dataPosition = await positionRepository.acquireById(value)
              if (!dataPosition) {
                return Promise.reject(
                  'position_id tidak ditemukan'
                );
              }
            }
          }),

        // atasan_id
        body('atasan_id').optional({ nullable: true }).isInt().withMessage('atasan_id harus bertipe integer')
          .custom(async (value, { req }) => {
            if (value) {
              const dataEmployee = await repository.acquireEmployeeById(value)
              if (!dataEmployee) {
                return Promise.reject(
                  'atasan_id tidak ditemukan'
                );
              }
            }
          }),

        // atasan_position_id
        body('atasan_position_id').optional({ nullable: true }).isInt().withMessage('atasan_position_id harus bertipe integer')
          .custom(async (value, { req }) => {
            if (!value) {
              const dataPosition = await positionRepository.acquireById(value)
              if (!dataPosition) {
                return Promise.reject(
                  'atasan_position_id tidak ditemukan'
                );
              }
            }
          }),

        // atasan_ap_id
        body('atasan_ap_id').optional({ nullable: true }).isInt().withMessage('atasan_ap_id harus bertipe integer').isInt().withMessage('atasan_ap_id harus bertipe integer')
          .custom(async (value, { req }) => {
            if (value) {
              const dataEmployee = await repository.acquireEmployeeById(value)
              if (!dataEmployee) {
                return Promise.reject(
                  'atasan_ap_id tidak ditemukan'
                );
              }
            }
          }),

        // atasan_ap_position_id
        body('atasan_ap_position_id').optional({ nullable: true }).isInt().withMessage('atasan_ap_position_id harus bertipe integer')
          .custom(async (value, { req }) => {
            if (!value) {
              const dataPosition = await positionRepository.acquireById(value)
              if (!dataPosition) {
                return Promise.reject(
                  'atasan_ap_position_id tidak ditemukan'
                );
              }
            }
          }),

        // cost_center
        body('cost_center').optional({ nullable: true }).isLength({ min: 3, max: 50 }).withMessage('cost_center minimal 3 karakter dan maksimal 50 karakter'),

        // ket_ap
        body('ket_ap').optional({ nullable: true }).isLength({ max: 100 }).withMessage('ket_ap maksimal 100 karakter'),

        // is_main
        body('is_main').not().isEmpty().withMessage('is_main wajib diisi')
          .bail().
          isBoolean().withMessage('is_main harus bertipe boolean')
          .custom(async (value, { req }) => {
            if (value && req.body.employee_id) {
              const existedMainData = await repository.acquireMainPositionEmployee(req.body.employee_id)
              if (existedMainData) {
                return Promise.reject('main position di karyawan ini sudah ada')
              }
            }
          })
      ];

    case 'update':
      return [
        // employee_id
        body('employee_id').optional({ nullable: true }).isInt().withMessage('employee_id harus bertipe integer')
          .custom(async (value, { req }) => {
            if (value) {
              const dataEmployee = await repository.acquireEmployeeById(value)
              if (!dataEmployee) {
                return Promise.reject(
                  'employee_id tidak ditemukan'
                );
              }
            }
          }),

        // npp
        body('npp').optional({ nullable: true }).isLength({ min: 2, max: 20 }).withMessage('npp minimal 2 karakter dan maksimal 20 karakter'),

        // personnel_number
        body('personnel_number').optional({ nullable: true }).isLength({ min: 2, max: 20 }).withMessage('personnel_number minimal 2 karakter dan maksimal 20 karakter'),

        // new_npp
        body('new_npp').optional({ nullable: true }).isLength({ min: 2, max: 20 }).withMessage('new_npp minimal 2 karakter dan maksimal 20 karakter'),

        // position_id
        body('position_id').optional({ nullable: true }).isInt().withMessage('position_id harus bertipe integer')
          .custom(async (value, { req }) => {
            if (!value) {
              const dataPosition = await positionRepository.acquireById(value)
              if (!dataPosition) {
                return Promise.reject(
                  'position_id tidak ditemukan'
                );
              }
            }
          }),

        // atasan_id
        body('atasan_id').optional({ nullable: true }).isInt().withMessage('atasan_id harus bertipe integer')
          .custom(async (value, { req }) => {
            if (value) {
              const dataEmployee = await repository.acquireEmployeeById(value)
              if (!dataEmployee) {
                return Promise.reject(
                  'atasan_id tidak ditemukan'
                );
              }
            }
          }),

        // atasan_position_id
        body('atasan_position_id').optional({ nullable: true }).isInt().withMessage('atasan_position_id harus bertipe integer')
          .custom(async (value, { req }) => {
            if (!value) {
              const dataPosition = await positionRepository.acquireById(value)
              if (!dataPosition) {
                return Promise.reject(
                  'atasan_position_id tidak ditemukan'
                );
              }
            }
          }),

        // atasan_ap_id
        body('atasan_ap_id').optional({ nullable: true }).isInt().withMessage('atasan_ap_id harus bertipe integer')
          .custom(async (value, { req }) => {
            if (value) {
              const dataEmployee = await repository.acquireEmployeeById(value)
              if (!dataEmployee) {
                return Promise.reject(
                  'atasan_ap_id tidak ditemukan'
                );
              }
            }
          }),

        // atasan_ap_position_id
        body('atasan_ap_position_id').optional({ nullable: true }).isInt().withMessage('atasan_ap_position_id harus bertipe integer')
          .custom(async (value, { req }) => {
            if (!value) {
              const dataPosition = await positionRepository.acquireById(value)
              if (!dataPosition) {
                return Promise.reject(
                  'atasan_ap_position_id tidak ditemukan'
                );
              }
            }
          }),

        // cost_center
        body('cost_center').optional({ nullable: true }).isLength({ min: 3, max: 50 }).withMessage('cost_center minimal 3 karakter dan maksimal 50 karakter'),

        // ket_ap
        body('ket_ap').optional({ nullable: true }).isLength({ max: 100 }).withMessage('ket_ap maksimal 100 karakter'),

        // is_main
        body('is_main').optional({ nullable: true }).isBoolean().withMessage('is_main harus bertipe boolean')
          .custom(async (value, { req }) => {
            if (value && req.body.employee_id) {
              const existedMainData = await repository.acquireMainPositionEmployee(req.body.employee_id)
              if (existedMainData) {
                return Promise.reject('main position di karyawan ini sudah ada')
              }
            }
          })
      ]
  }
}