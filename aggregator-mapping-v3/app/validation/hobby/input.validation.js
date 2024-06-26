const { body } = require('express-validator')
const repository = require('../../repositories/education.repository')

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
            const dataEmployee = await repository.acquireByEmployeeId(value)
            if (!dataEmployee) {
              return Promise.reject(
                'employee_id tidak ditemukan'
              );
            }
          }),
        // hobby
        body('hobby').not().isEmpty().withMessage('hobby wajib diisi')
          .bail().
          isLength({ min: 2, max: 100 }).withMessage('hobby minimal 2 karakter dan maksimal 100 karakter'),
      ]
    case 'update':
      return [
        // employee_id
        body('employee_id')
          .custom(async (value, { req }) => {
            if (!value) {
              return Promise.reject('employee_id wajib diisi')
            }
            const dataEmployee = await repository.acquireByEmployeeId(value)
            if (!dataEmployee) {
              return Promise.reject(
                'employee_id tidak ditemukan'
              );
            }
          }).optional({ nullable: true }),
        // hobby
        body('hobby').optional({ nullable: true }).isLength({ min: 2, max: 100 }).withMessage('hobby minimal 2 karakter dan maksimal 100 karakter')
      ]

    default:
      break;
  }
}