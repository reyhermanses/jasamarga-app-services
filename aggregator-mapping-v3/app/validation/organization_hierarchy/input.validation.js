const { body, query } = require('express-validator')
const repository = require('../../repositories/organizationHierarchy.repository')

exports.validate = (method) => {
  switch (method) {
    case 'create':
      return [
        // id
        body('id')
          .custom(async (value, { req }) => {
            const isValid = await repository.acquireById(value)
            if (isValid) {
              return Promise.reject(
                'id sudah ada'
              );
            }
          }),
        // name
        body('name')
          .optional({
            nullable: true
          })
          .isLength({
            min: 2,
            max: 255
          }).withMessage('address minimal 2 karakter dan maksimal 255 karakter'),

        // parent_id
        body('parent_id')
          .custom(async (value, {
            req
          }) => {
            const isValid = await repository.acquireById(value)
            if (!isValid) {
              return Promise.reject(
                'parent_id tidak ditemukan'
              );
            }
          }).optional({
            nullable: true
          }),

        // type_organization
        body('type_organization').optional({
          nullable: true
        }).isBoolean().withMessage('type_organization harus bertipe boolean'),

        // active
        body('active').optional({
          nullable: true
        }).isBoolean().withMessage('active harus bertipe boolean'),
      ];
    case 'update':
      return [
        // name
        body('name')
          .optional({
            nullable: true
          })
          .isLength({
            min: 2,
            max: 255
          }).withMessage('address minimal 2 karakter dan maksimal 255 karakter'),

        // parent_id
        body('parent_id')
          .custom(async (value, {
            req
          }) => {
            const isValid = await repository.acquireById(value)
            if (!isValid) {
              return Promise.reject(
                'parent_id tidak ditemukan'
              );
            }
          }).optional({
            nullable: true
          }),

        // type_organization
        body('type_organization').optional({
          nullable: true
        }).isBoolean().withMessage('type_organization harus bertipe boolean'),

        // active
        body('active').optional({
          nullable: true
        }).isBoolean().withMessage('active harus bertipe boolean'),
      ]
    case 'filter': return [
      query('personal_area_id').not().isEmpty().withMessage('personal_area_id wajib diisi')
    ]
  }
}