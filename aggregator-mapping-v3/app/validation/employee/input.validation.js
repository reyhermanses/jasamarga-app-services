const { body } = require('express-validator')

const masterEmployeeGroup = require('../../repositories/master/masterEmployeeGroup.repository')
const masterEmployeeSubGroup = require('../../repositories/master/masterEmployeeSubGroup.repository')
const masterCompany = require('../../repositories/master/masterCompany.repository')
const masterPosition = require('../../repositories/master/masterPosition.repository')
const employeePosition = require('../../repositories/employeePosition.repository')

exports.validate = (method) => {

  switch (method) {
    case 'create':
      return [
        // name
        body('name').not().isEmpty().withMessage('name wajib diisi')
          .bail().
          isLength({ min: 3, max: 50 }).withMessage('name minimal 3 karakter dan maksimal 50 karakter')
          .bail().
          matches(/^[a-zA-Z\s]+$/).withMessage('Name Hanya boleh mengandung Alphabet')
          .bail().
          customSanitizer(value => value.toUpperCase())
        ,

        // npp
        body('npp').not().isEmpty().withMessage('npp wajib diisi')
          .bail().
          custom(async (value, { req }) => {
            if (value) {
              const data = await employeePosition.checkNPP(req.body.position_id, value)
              if (!data) {
                return Promise.reject(
                  'npp sudah pernah dipakai'
                );
              }
            }
          }),

        // is_pusat
        body('is_pusat').not().isEmpty().withMessage('is_pusat wajib diisi')
          .bail().
          isBoolean().withMessage('is_pusat harus bertipe boolean'),

        // username
        body('username').not().isEmpty().withMessage('username wajib diisi'),

        // employee_status
        body('employee_status').not().isEmpty().withMessage('employee_status wajib diisi')
          .bail().
          isBoolean().withMessage('employee_status harus bertipe boolean'),

        // start_date
        body('start_date').not().isEmpty().withMessage('start_date wajib diisi')
          .bail().
          isDate().withMessage('start_date harus bertipe format tanggal'),

        // end_date
        body('end_date').optional({ nullable: true }).isDate().withMessage('end_date harus bertipe format tanggal'),

        // sk_position_date
        body('sk_position_date').not().isEmpty().withMessage('sk_position_date wajib diisi')
          .bail().
          isDate().withMessage('sk_position_date harus bertipe format tanggal'),

        // sk_position_no
        body('sk_position_no').not().isEmpty().withMessage('sk_position_no wajib diisi'),

        // employee_group_id
        body('employee_group_id').not().isEmpty().withMessage('employee_group_id wajib diisi')
          .bail().
          isInt().withMessage('employee_group_id harus bertipe integer')
          .custom(async (value, { req }) => {
            if (value) {
              const data = await masterEmployeeGroup.acquireById(value)
              if (!data) {
                return Promise.reject(
                  'employee_group_id tidak ditemukan'
                );
              }
            }
          }),

        // employee_sub_group_id
        body('employee_sub_group_id').optional({ nullable: true }).isInt().withMessage('employee_sub_group_id harus bertipe integer')
          .custom(async (value, { req }) => {
            if (value) {
              const data = await masterEmployeeSubGroup.acquireById(value)
              if (!data) {
                return Promise.reject(
                  'employee_sub_group_id tidak ditemukan'
                );
              }
            }
          }),

        // sap_emp_status
        body('sap_emp_status').optional({ nullable: true }).isBoolean().withMessage('sap_emp_status harus bertipe boolean'),

        // company_id_asal
        body('company_id_asal').not().isEmpty().withMessage('company_id_asal wajib diisi')
          .bail().
          isInt().withMessage('company_id_asal harus bertipe integer')
          .custom(async (value, { req }) => {
            const data = await masterCompany.acquireById(value)
            if (!data) {
              return Promise.reject(
                'company_id_asal tidak ditemukan'
              );
            }
          }),

        // company_id_penugasan
        body('company_id_penugasan').optional({ nullable: true }).isInt().withMessage('company_id_penugasan harus bertipe integer')
          .custom(async (value, { req }) => {
            if (value) {
              const data = await masterCompany.acquireById(value)
              if (!data) {
                return Promise.reject(
                  'company_id_penugasan tidak ditemukan'
                );
              }
            }
          }),

        // business_area_id

        // date_of_entry
        body('date_of_entry').optional({ nullable: true }).isDate().withMessage('date_of_entry harus bertipe format tanggal'),

        // is_rangkap_jabatan
        body('is_rangkap_jabatan').optional({ nullable: true }).isBoolean().withMessage('is_rangkap_jabatan harus bertipe boolean'),

        // is_penugasan
        body('is_penugasan').optional({ nullable: true }).isBoolean().withMessage('is_penugasan harus bertipe boolean'),

        // position_id
        body('position_id').not().isEmpty().withMessage('position_id wajib diisi')
          .bail()
          .custom(async (value, { req }) => {
            if (value) {
              const data = await masterPosition.acquireById(value)
              if (!data) {
                return Promise.reject(
                  'position_id tidak ditemukan'
                );
              }

              const filledPosition = await employeePosition.acquireByPositionId(value)
              if (filledPosition) {
                return Promise.reject(
                  'position_id sudah terisi'
                );
              }
            }
          }),
      ]
    case 'update':
      return [
        // name
        body('name').optional({ nullable: true }).
          isLength({ min: 3, max: 50 }).withMessage('name minimal 3 karakter dan maksimal 50 karakter')
          .bail().
          matches(/^[a-zA-Z\s]+$/).withMessage('Name Hanya boleh mengandung Alphabet')
          .bail().
          customSanitizer(value => value.toUpperCase()),

        // is_pusat
        body('is_pusat').optional({ nullable: true }).
          isBoolean().withMessage('is_pusat harus bertipe boolean'),

        // employee_status
        body('employee_status').optional({ nullable: true }).
          isBoolean().withMessage('employee_status harus bertipe boolean'),

        // start_date
        body('start_date').optional({ nullable: true }).isDate().withMessage('start_date harus bertipe format tanggal'),

        // end_date
        body('end_date').optional({ nullable: true }).isDate().withMessage('end_date harus bertipe format tanggal'),

        // employee_group_id
        body('employee_group_id').optional({ nullable: true }).isInt().withMessage('employee_group_id harus bertipe integer').custom(async (value, { req }) => {
          if (value) {
            const data = await masterEmployeeGroup.acquireById(value)
            if (!data) {
              return Promise.reject(
                'employee_group_id tidak ditemukan'
              );
            }
          }
        }),

        // employee_sub_group_id
        body('employee_sub_group_id').optional({ nullable: true }).isInt().withMessage('employee_sub_group_id harus bertipe integer')
          .custom(async (value, { req }) => {
            if (value) {
              const data = await masterEmployeeSubGroup.acquireById(value)
              if (!data) {
                return Promise.reject(
                  'employee_sub_group_id tidak ditemukan'
                );
              }
            }
          }),

        // sap_emp_status
        body('sap_emp_status').optional({ nullable: true }).isBoolean().withMessage('sap_emp_status harus bertipe boolean'),

        // company_id_asal
        body('company_id_asal').optional({ nullable: true }).isInt().withMessage('company_id_asal harus bertipe integer')
          .custom(async (value, { req }) => {
            const data = await masterCompany.acquireById(value)
            if (!data) {
              return Promise.reject(
                'company_id_asal tidak ditemukan'
              );
            }
          }),

        // company_id_penugasan
        body('company_id_penugasan').optional({ nullable: true }).isInt().withMessage('company_id_penugasan harus bertipe integer')
          .custom(async (value, { req }) => {
            const data = await masterCompany.acquireById(value)
            if (!data) {
              return Promise.reject(
                'company_id_penugasan tidak ditemukan'
              );
            }
          }),

        // business_area_id

        // date_of_entry
        body('date_of_entry').optional({ nullable: true }).isDate().withMessage('date_of_entry harus bertipe format tanggal'),

        // is_rangkap_jabatan
        body('is_rangkap_jabatan').optional({ nullable: true }).isBoolean().withMessage('is_rangkap_jabatan harus bertipe boolean'),

        // is_penugasan
        body('is_penugasan').optional({ nullable: true }).isBoolean().withMessage('is_penugasan harus bertipe boolean'),

        // position_id
        body('position_id').optional({ nullable: true }).isInt().withMessage('position_id harus bertipe integer')
          .bail()
          .custom(async (value, { req }) => {
            if (value) {
              const data = await masterPosition.acquireById(value)
              if (!data) {
                return Promise.reject(
                  'position_id tidak ditemukan'
                );
              }

              const filledPosition = await employeePosition.acquireByPositionId(value)
              if (filledPosition) {
                return Promise.reject(
                  'position_id sudah terisi'
                );
              }
            }
          }),
      ]

    default:
      break;
  }
}