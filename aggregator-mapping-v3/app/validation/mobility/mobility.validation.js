const { body } = require('express-validator')
const moment = require('moment');

const { acquireById: getEmployeeById } = require('../../repositories/employee.repository')
const { acquireById: getPositionById, acquireExistingDataonEmployee, acquireLastStartDate } = require('../../repositories/master/masterPosition.repository')
const { acquireById: getSubgroupById } = require('../../repositories/master/masterEmployeeSubGroup.repository')

exports.validate = (method) => {
  switch (method) {
    case 'promosi-demosi-rotasi':
      return [
        body('employee_id')
          .custom(async (value, { req }) => {
            if (!value) {
              return Promise.reject('employee_id wajib diisi')
            }
            const dataEmployee = await getEmployeeById(value)
            if (!dataEmployee) {
              return Promise.reject(
                'employee_id tidak ditemukan'
              );
            }
            if (dataEmployee.is_pusat) {
              return Promise.reject(
                'karyawan pusat tidak boleh dilakukan mobility'
              );
            }

          }),
        body('no_sk').not().isEmpty().withMessage('no_sk wajib diisi'),
        body('tanggal_sk').not().isEmpty().withMessage('tanggal_sk wajib diisi')
          .bail()
          .isDate()
          .withMessage("tanggal_sk harus bertipe tanggal"),
        body('start_date').not().isEmpty().withMessage('start_date wajib diisi')
          .bail()
          .isDate()
          .withMessage("start_date harus bertipe tanggal")
          .bail()
          .custom(async (value, { req }) => {
            if (req.body.employee_id) {
              const lastStartDate = await acquireLastStartDate(req.body.employee_id)
              if (new Date(value) <= lastStartDate.dataValues.start_date) {
                return Promise.reject(
                  `start_date harus lebih besar dari start_date saat ini yaitu ${moment(lastStartDate.dataValues.start_date).format('D MMMM YYYY')}`
                );
              }
            }
          }),
        body('position_id').not().isEmpty().withMessage('position_id wajib diisi')
          .bail()
          .isInt()
          .withMessage("position_id harus bertipe integer")
          .bail()
          .custom(async (value, { req }) => {
            const dataPosition = await getPositionById(value)
            if (!dataPosition) {
              return Promise.reject(
                'position_id tidak ditemukan'
              );
            }

            const exist = await acquireExistingDataonEmployee(value)
            if (exist.position_employee.length > 0) {
              return Promise.reject(
                'position_id sudah terisi'
              );
            }
          }),
        body('subgroup_id').optional({ nullable: true })
          .bail()
          .isInt()
          .withMessage("subgroup_id harus bertipe integer")
          .bail()
          .custom(async (value, { req }) => {
            const dataSubgroup = await getSubgroupById(value)
            if (!dataSubgroup) {
              return Promise.reject(
                'subgroup_id tidak ditemukan'
              );
            }
          })
      ];
    case 'rangkap':
      return [
        body('employee_id')
          .custom(async (value, { req }) => {
            if (!value) {
              return Promise.reject('employee_id wajib diisi')
            }
            const dataEmployee = await getEmployeeById(value)
            if (!dataEmployee) {
              return Promise.reject(
                'employee_id tidak ditemukan'
              );
            }
            if (dataEmployee.is_pusat) {
              return Promise.reject(
                'karyawan pusat tidak boleh dilakukan mobility'
              );
            }

          }),
        body('no_sk').not().isEmpty().withMessage('no_sk wajib diisi'),
        body('tanggal_sk').not().isEmpty().withMessage('tanggal_sk wajib diisi')
          .bail()
          .isDate()
          .withMessage("tanggal_sk harus bertipe tanggal"),
        body('start_date').not().isEmpty().withMessage('start_date wajib diisi')
          .bail()
          .isDate()
          .withMessage("start_date harus bertipe tanggal")
          .bail()
          .custom(async (value, { req }) => {
            if (req.body.employee_id) {
              const lastStartDate = await acquireLastStartDate(req.body.employee_id)
              if (new Date(value) < lastStartDate.dataValues.start_date) {
                return Promise.reject(
                  `start_date minimal tidak boleh kurang dari start_date saat ini yaitu ${moment(lastStartDate.dataValues.start_date).format('D MMMM YYYY')}`
                );
              }
            }
          }),
        body('position_id').not().isEmpty().withMessage('position_id wajib diisi')
          .bail()
          .isInt()
          .withMessage("position_id harus bertipe integer")
          .bail()
          .custom(async (value, { req }) => {
            const dataPosition = await getPositionById(value)
            if (!dataPosition) {
              return Promise.reject(
                'position_id tidak ditemukan'
              );
            }

            const exist = await acquireExistingDataonEmployee(value)
            if (exist.position_employee.length > 0) {
              return Promise.reject(
                'position_id sudah terisi'
              );
            }
          }),
        body('subgroup_id').optional({ nullable: true })
          .bail()
          .isInt()
          .withMessage("subgroup_id harus bertipe integer")
          .bail()
          .custom(async (value, { req }) => {
            const dataSubgroup = await getSubgroupById(value)
            if (!dataSubgroup) {
              return Promise.reject(
                'subgroup_id tidak ditemukan'
              );
            }
          })
      ];
    case 'terminate-promosi':
      return [
        body('employee_id')
          .custom(async (value, { req }) => {
            if (!value) {
              return Promise.reject('employee_id wajib diisi')
            }
            const dataEmployee = await getEmployeeById(value)
            if (!dataEmployee) {
              return Promise.reject(
                'employee_id tidak ditemukan'
              );
            }

            if (dataEmployee.is_pusat) {
              return Promise.reject(
                'karyawan pusat tidak boleh dilakukan mobility'
              );
            }

          }),
        body('no_sk').not().isEmpty().withMessage('no_sk wajib diisi'),
        body('tanggal_sk').not().isEmpty().withMessage('tanggal_sk wajib diisi')
          .bail()
          .isDate()
          .withMessage("tanggal_sk harus bertipe tanggal"),
        body('end_date').not().isEmpty().withMessage('end_date wajib diisi')
          .bail()
          .isDate()
          .withMessage("end_date harus bertipe tanggal"),
        body('jenis').not().isEmpty().withMessage('jenis wajib diisi'),
      ]
  }
}