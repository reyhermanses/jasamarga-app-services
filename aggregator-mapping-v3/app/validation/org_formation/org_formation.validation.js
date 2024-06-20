const { body } = require('express-validator')
const masterJobRepository = require('../../repositories/master/masterJob.repository')
const orgRepository = require('../../repositories/organizationHierarchy.repository')

exports.validate = () => {
  return [
    body('data').not().isEmpty().withMessage('data wajib diisi')
      .bail().
      isArray().withMessage('data harus bertipe an array')
      .custom(async (value) => {
        for (const element of value) {


          if (!element.hasOwnProperty('job_id') || typeof element.job_id === 'object') {
            return Promise.reject(
              'job_id harus di isi'
            );
          }

          if (!element.hasOwnProperty('org_id')) {
            return Promise.reject(
              'org_id harus di isi'
            );
          }

          if (!element.hasOwnProperty('add_on')) {
            return Promise.reject(
              'add_on harus di isi'
            );
          }

          if (!Number.isInteger(element.add_on)) {
            return Promise.reject(
              'add_on harus bertipe integer'
            );
          }

          if (element.add_on < 0) {
            return Promise.reject('add_on wajib nilainya lebih besar atau sama dengan dari 0')
          }

          const dataJob = await masterJobRepository.acquireById(element.job_id)
          if (!dataJob) {
            return Promise.reject(
              `job_id ${element.job_id} tidak ditemukan`
            );
          }

          const dataOrg = await orgRepository.acquireById(element.org_id)
          if (!dataOrg) {
            return Promise.reject(
              `org_id ${element.org_id} tidak ditemukan`
            );
          }
        }
      })
  ]
}