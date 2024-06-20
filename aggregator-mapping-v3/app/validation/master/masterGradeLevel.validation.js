const repoSubgroup = require('../../repositories/master/masterEmployeeSubGroup.repository')
const {
  body
} = require('express-validator')

exports.validate = (method) => {

  switch (method) {
    case 'create':
      return [
        body('grade').not().isEmpty().withMessage('grade wajib diisi'),
        body('level').not().isEmpty().withMessage('level wajib diisi'),
        body('sublevel').not().isEmpty().withMessage('sublevel wajib diisi'),
        body('subgroup_id').not().isEmpty().withMessage('subgroup_id wajib diisi')
          .bail().custom(async (value, {
            req
          }) => {
            let dataSubgroup = await repoSubgroup.acquireById(value)
            if (!dataSubgroup) {
              return Promise.reject('subgroup_id tidak ditemukan')
            }
          })
      ]
    case 'update':
      return [
        body('subgroup_id').optional({ nullable: true }).custom(async (value, {
          req
        }) => {
          let dataSubgroup = await repoSubgroup.acquireById(value)
          if (!dataSubgroup) {
            return Promise.reject('subgroup_id tidak ditemukan')
          }
        })
      ]
    default:
      break;
  }
}