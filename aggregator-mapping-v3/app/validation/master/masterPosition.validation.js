const { body, param } = require('express-validator')

const { checkChildOrgData } = require('../../services/organizationHierarchy.service')

const organizationHierarchy = require('../../repositories/organizationHierarchy.repository')
const masterCompany = require('../../repositories/master/masterCompany.repository')
const masterJob = require('../../repositories/master/masterJob.repository')
const masterPersonalArea = require('../../repositories/master/masterPersonalArea.repository')
const masterPersonalSubArea = require('../../repositories/master/masterPersonalSubArea.repository')
const masterPosition = require('../../repositories/master/masterPosition.repository')
const employee = require('../../repositories/employee.repository')

exports.validate = (method) => {
  switch (method) {
    case 'create':
      return [
        // name
        body('name').not().isEmpty().withMessage('name wajib diisi')
          .bail()
          .isString().withMessage('name harus bertipe string').bail()
          .isLength({ max: 100 }).withMessage('name maksimal 100 karakter'),

        // org_id
        body('org_id').not().isEmpty().withMessage('org_id wajib diisi')
          .custom(async (value, { req }) => {
            const data = await organizationHierarchy.acquireById(value)
            if (!data) {
              return Promise.reject(
                'org_id tidak ditemukan'
              );
            }

            if (req.body.departemen_id) {
              const dataChild = await checkChildOrgData(req.body.departemen_id, value)
              const dataDepartemen = await organizationHierarchy.acquireById(req.body.departemen_id)
              if (!dataChild) {
                return Promise.reject(
                  `org_id ${value} tidak terdaftar dalam departemen ${dataDepartemen.name} - ${req.body.departemen_id}`
                );
              }
            }
          }),

        // active
        body('active').not().isEmpty().withMessage('active wajib diisi')
          .bail().isBoolean().withMessage('active harus bertipe boolean'),

        // company_id
        body('company_id').not().isEmpty().withMessage('company_id wajib diisi')
          .bail().
          isInt().withMessage('company_id harus bertipe integer')
          .custom(async (value, { req }) => {
            const data = await masterCompany.acquireById(value)
            if (!data) {
              return Promise.reject(
                'company_id tidak ditemukan'
              );
            }
          }),

        // unit_kerja_id
        body('unit_kerja_id').not().isEmpty().withMessage('unit_kerja_id wajib diisi').bail()
          .custom(async (value, { req }) => {
            if (value) {
              const data = await organizationHierarchy.acquireById(value)
              if (!data) {
                return Promise.reject(
                  'unit_kerja_id tidak ditemukan'
                );
              }

              if (req.body.company_id) {
                const dataCompany = await masterCompany.acquireById(req.body.company_id)
                const TheHighestOrgInCompany = dataCompany.org_id
                const dataChild = await checkChildOrgData(TheHighestOrgInCompany, value)

                if (!dataChild) {
                  return Promise.reject(
                    `unit_kerja_id tidak terdaftar dalam company ${dataCompany.name}`
                  );
                }
              }

            }
          }),

        // direktorat_id
        body('direktorat_id').not().isEmpty().withMessage('direktorat_id wajib diisi').bail()
          .custom(async (value, { req }) => {
            if (value) {
              const data = await organizationHierarchy.acquireById(value)
              if (!data) {
                return Promise.reject(
                  'direktorat_id tidak ditemukan'
                );
              }
            }
          }),

        // departemen_id
        body('departemen_id').not().isEmpty().withMessage('departemen_id wajib diisi').bail()
          .custom(async (value, { req }) => {
            if (value) {
              const data = await organizationHierarchy.acquireById(value)
              if (!data) {
                return Promise.reject(
                  'departemen_id tidak ditemukan'
                );
              }

              // if (req.body.direktorat_id) {
              //   const dataChild = await checkChildOrgData(req.body.direktorat_id, value)
              //   const dataUnitDirektorat = await organizationHierarchy.acquireById(req.body.direktorat_id)
              //   if (!dataChild) {
              //     return Promise.reject(
              //       `depertemen_id ${value} tidak terdaftar dalam direktorat ${dataUnitDirektorat.name} - ${req.body.direktorat_id}`
              //     );
              //   }
              // }
            }
          }),

        // seksi_id
        body('seksi_id').not().isEmpty().withMessage('seksi_id wajib diisi').bail()
          .custom(async (value, { req }) => {
            if (value) {
              const data = await organizationHierarchy.acquireById(value)
              if (!data) {
                return Promise.reject(
                  'seksi_id tidak ditemukan'
                );
              }

              if (req.body.departemen_id) {
                const dataChild = await checkChildOrgData(req.body.departemen_id, value)
                const dataDepartemen = await organizationHierarchy.acquireById(req.body.departemen_id)
                if (!dataChild) {
                  return Promise.reject(
                    `seksi_id ${value} tidak terdaftar dalam departemen ${dataDepartemen.name} - ${req.body.departemen_id}`
                  );
                }
              }
            }
          }),

        // job_id
        body('job_id').not().isEmpty().withMessage('job_id wajib diisi')
          .bail().
          isInt().withMessage('job_id harus bertipe integer')
          .custom(async (value, { req }) => {
            if (value) {
              const data = await masterJob.acquireById(value)
              if (!data) {
                return Promise.reject(
                  'job_id tidak ditemukan'
                );
              }
            }
          }),

        // personal_area_id
        body('personal_area_id').optional({ nullable: true }).isInt().withMessage('personal_area_id harus bertipe integer')
          .custom(async (value, { req }) => {
            if (value) {
              const data = await masterPersonalArea.acquireById(value)
              if (!data) {
                return Promise.reject(
                  'personal_area_id tidak ditemukan'
                );
              }
            }
          }),

        // personal_sub_area_id
        body('personal_sub_area_id').optional({ nullable: true }).isInt().withMessage('personal_sub_area_id harus bertipe integer')
          .custom(async (value, { req }) => {
            if (value) {
              const data = await masterPersonalSubArea.acquireById(value)
              if (!data) {
                return Promise.reject(
                  'personal_sub_area_id tidak ditemukan'
                );
              }
            }
          }),

        // sk_position_no
        body('sk_position_no').optional({ nullable: true }).isLength({ min: 1, max: 20 }).withMessage('sk_position_no minimal 2 karakter dan maksimal 20 karakter'),

        // sk_position_date
        body('sk_position_date').optional({ nullable: true }).isDate().withMessage('sk_position_date harus bertipe format tanggal'),

        // start_date
        body('start_date').optional({ nullable: true }).isDate().withMessage('start_date harus bertipe format tanggal'),

        // grade
        body('grade').optional({ nullable: true }).isLength({ min: 1, max: 20 }).withMessage('grade minimal 2 karakter dan maksimal 20 karakter'),

        // level
        body('level').optional({ nullable: true }).isLength({ max: 10 }).withMessage('level maksimal 10 karakter'),

        // end_date
        body('end_date').optional({ nullable: true })
          .bail()
          .isDate().withMessage('end_date harus bertipe format tanggal'),

        // cluster_id
        body('cluster_id').not().isEmpty().withMessage('cluster_id wajib diisi')
          .bail().
          isInt().withMessage('cluster_id harus bertipe integer'),

        // sub_cluster_id
        body('sub_cluster_id').not().isEmpty().withMessage('sub_cluster_id wajib diisi')
          .bail().
          isInt().withMessage('sub_cluster_id harus bertipe integer'),

        // kelompok_jabatan
        body('kelompok_jabatan').optional({ nullable: true }).isIn(['Operasional', 'Non Operasional']).withMessage('kelompok_jabatan harus bertipe enum of Operasional and Non Operasional'),

        // konversi
        body('konversi').optional({ nullable: true }).isLength({ max: 10 }).withMessage('konversi maksimal 10 karakter'),
      ]
    case 'update':
      return [
        param('id').isInt().withMessage('id parameter harus bertipe an integer.').bail().
          custom(async (value) => {
            const dataPosition = await masterPosition.acquireById(value);

            if (!dataPosition) {
              return Promise.reject(
                'position tidak ditemukan!'
              )
            }

            if (dataPosition.is_sap) {
              return Promise.reject(
                'position created by SAP is prohibited to edit'
              )
            }

          }),
        // name
        body('name').optional({ nullable: true }).isString().withMessage('name harus bertipe string').bail()
          .isLength({ max: 100 }).withMessage('name maksimal 100 karakter'),

        // org_id
        body('org_id').optional({ nullable: true }).isInt().withMessage('org_id harus bertipe integer')
          .custom(async (value, { req }) => {
            if (value) {
              const data = await organizationHierarchy.acquireById(value)
              if (!data) {
                return Promise.reject(
                  'org_id tidak ditemukan'
                );
              }

              const dataPosition = await masterPosition.acquireById(req.params.id)
              const departemenId = req.body.departemen_id ? req.body.departemen_id : dataPosition?.departemen_id ? dataPosition.departemen_id : null;

              if (departemenId) {
                const dataChild = await checkChildOrgData(departemenId, value)
                const dataDepartemen = await organizationHierarchy.acquireById(departemenId)
                if (!dataChild) {
                  return Promise.reject(
                    `org_id ${value} tidak terdaftar dalam departemen id ${dataDepartemen.name} - ${departemenId}`
                  );
                }
              }
            }
          }),

        // active
        body('active').optional({ nullable: true }).isBoolean().withMessage('active harus bertipe boolean'),

        // company_id
        body('company_id').optional({ nullable: true }).isInt().withMessage('company_id harus bertipe integer')
          .custom(async (value, { req }) => {
            if (value) {
              const data = await masterCompany.acquireById(value)
              if (!data) {
                return Promise.reject(
                  'company_id tidak ditemukan'
                );
              }
            }
          }),

        // unit_kerja_id
        body('unit_kerja_id').optional({ nullable: true }).isInt().withMessage('unit_kerja_id harus bertipe integer')
          .custom(async (value, { req }) => {
            if (value) {
              const data = await organizationHierarchy.acquireById(value)
              if (!data) {
                return Promise.reject(
                  'unit_kerja_id tidak ditemukan'
                );
              }

              const dataPosition = await masterPosition.acquireById(req.params.id);
              const companyId = req.body.company_id ? req.body.company_id : dataPosition?.company_id ? dataPosition.company_id : null;
              const dataCompany = await masterCompany.acquireById(companyId)
              if (dataCompany) {
                const dataChild = await checkChildOrgData(dataCompany.org_id, value)
                if (!dataChild) {
                  return Promise.reject(
                    `unit_kerja_id ${value} tidak terdaftar dalam company ${dataCompany.name}`
                  );
                }
              }
            }
          }),

        // direktorat_id
        body('direktorat_id').optional({ nullable: true }).isInt().withMessage('direktorat_id harus bertipe integer')
          .custom(async (value, { req }) => {
            if (value) {
              const data = await organizationHierarchy.acquireById(value)
              if (!data) {
                return Promise.reject(
                  'direktorat_id tidak ditemukan'
                );
              }
            }
          }),

        // departemen_id
        body('departemen_id').optional({ nullable: true }).isInt().withMessage('departemen_id harus bertipe integer')
          .custom(async (value, { req }) => {
            if (value) {
              const data = await organizationHierarchy.acquireById(value)
              if (!data) {
                return Promise.reject(
                  'departemen_id tidak ditemukan'
                );
              }

              // const dataPosition = await masterPosition.acquireById(req.params.id)
              // const direktoratId = req.body.direktorat_id ? req.body.direktorat_id : dataPosition?.direktorat_id ? dataPosition.direktorat_id : null;

              // if (direktoratId) {
              //   const dataChild = await checkChildOrgData(direktoratId, value)
              //   if (!dataChild) {

              //     const dataDirektorat = await organizationHierarchy.acquireById(direktoratId)

              //     return Promise.reject(
              //       `departemen_id ${value} tidak terdaftar dalam unit kerja id ${dataDirektorat.name} - ${direktoratId}`
              //     );
              //   }
              // }
            }
          }),

        // seksi_id
        body('seksi_id').optional({ nullable: true }).isInt().withMessage('seksi_id harus bertipe integer')
          .custom(async (value, { req }) => {
            if (value) {
              const data = await organizationHierarchy.acquireById(value)
              if (!data) {
                return Promise.reject(
                  'seksi_id tidak ditemukan'
                );
              }

              const dataPosition = await masterPosition.acquireById(req.params.id)
              const departemenId = req.body.departemen_id ? req.body.departemen_id : dataPosition?.departemen_id ? dataPosition.departemen_id : null;

              if (departemenId) {
                const dataChild = await checkChildOrgData(departemenId, value)
                if (!dataChild) {
                  const dataDepartemen = await organizationHierarchy.acquireById(departemenId)
                  return Promise.reject(
                    `seksi_id ${value} tidak terdaftar dalam departemen id ${dataDepartemen.name} - ${departemenId}`
                  );
                }
              }
            }
          }),

        // job_id
        body('job_id').optional({ nullable: true }).isInt().withMessage('job_id harus bertipe integer')
          .custom(async (value, { req }) => {
            if (value) {
              const data = await masterJob.acquireById(value)
              if (!data) {
                return Promise.reject(
                  'job_id tidak ditemukan'
                );
              }
            }
          }),

        // personal_area_id
        body('personal_area_id').optional({ nullable: true }).isInt().withMessage('personal_area_id harus bertipe integer')
          .custom(async (value, { req }) => {
            if (value) {
              const data = await masterPersonalArea.acquireById(value)
              if (!data) {
                return Promise.reject(
                  'personal_area_id tidak ditemukan'
                );
              }
            }
          }),

        // personal_sub_area_id
        body('personal_sub_area_id').optional({ nullable: true }).isInt().withMessage('personal_sub_area_id harus bertipe integer')
          .custom(async (value, { req }) => {
            if (value) {
              const data = await masterPersonalSubArea.acquireById(value)
              if (!data) {
                return Promise.reject(
                  'personal_sub_area_id tidak ditemukan'
                );
              }
            }
          }),

        // sk_position_no
        body('sk_position_no').optional({ nullable: true }).isLength({ min: 1, max: 20 }).withMessage('sk_position_no minimal 2 karakter dan maksimal 20 karakter'),

        // sk_position_date
        body('sk_position_date').optional({ nullable: true }).isDate().withMessage('sk_position_date harus bertipe format tanggal'),

        // start_date
        body('start_date').optional({ nullable: true }).isDate().withMessage('start_date harus bertipe format tanggal'),

        // grade
        body('grade').optional({ nullable: true }).isLength({ min: 1, max: 20 }).withMessage('grade minimal 2 karakter dan maksimal 20 karakter'),

        // level
        body('level').optional({ nullable: true }).isLength({ max: 10 }).withMessage('level maksimal 10 karakter'),

        // end_date
        body('end_date').optional({ nullable: true }).isDate().withMessage('end_date harus bertipe format tanggal'),

        // cluster_id
        // sub_cluster_id

        // kelompok_jabatan
        body('kelompok_jabatan').optional({ nullable: true }).isIn(['Operasional', 'Non Operasional']).withMessage('kelompok_jabatan harus bertipe enum of Operasional and Non Operasional'),

        // konversi
        body('konversi').optional({ nullable: true }).isLength({ max: 10 }).withMessage('konversi maksimal 10 karakter'),

        // is_atasan
        body('is_atasan').optional({ nullable: true }).isBoolean().withMessage('is_atasan harus bertipe boolean')
      ]
    case 'update_jmclick':
      return [
        param('id').isInt().withMessage('id parameter harus bertipe an integer.').bail().
          custom(async (value) => {
            const dataPosition = await masterPosition.acquireById(value);

            if (!dataPosition) {
              return Promise.reject(
                'position tidak ditemukan!'
              )
            }

            if (dataPosition.is_sap) {
              return Promise.reject(
                'position created by SAP is prohibited to edit'
              )
            }

          }),
        param('employeeId').isInt().withMessage('employeeId parameter harus bertipe an integer.').bail().
          custom(async (value) => {
            const dataEmployee = await employee.acquireById(value);

            if (!dataEmployee) {
              return Promise.reject(
                'employee tidak ditemukan!'
              )
            }
          })
      ]
    default:
      break;
  }
}