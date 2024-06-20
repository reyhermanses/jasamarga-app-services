const {
  EmployeeMasaKerja,
  Employee,
  sequelize,
  EmployeePosition,
  MasterPosition,
  MasterCompany
} = require('../../models')

async function upsert(data) {
  return await EmployeeMasaKerja.findOne({
    where: {
      employee_id: data.employee_id
    }
  }).then((obj) => {
    if (obj) {
      data.updated_by = 'aggregator-data'
      return obj.update(data);
    }
    data.created_by = 'aggregator-data'
    return EmployeeMasaKerja.create(data);
  })
}

async function acquireAllData(filter = {}, empId = null) {
  let filterAll = {
    attributes: {
      exclude: ['created_by', 'updated_by', 'created_at', 'updated_at']
    },
    include: [
      {
        model: Employee,
        as: 'employee_masa_kerja',
        attributes: [
          ['name', 'employee_name']
        ],
        include: [
          {
            model: EmployeePosition,
            as: 'position',
            attributes: [
              'is_main',
              ['npp', 'employee_npp'],
              [sequelize.literal(`"employee_masa_kerja->position->position_detail->company_position"."kd_comp"`), 'employee_kd_comp']
            ],
            include: [
              {
                model: MasterPosition,
                as: 'position_detail',
                attributes: [],
                include: [
                  {
                    model: MasterCompany,
                    as: 'company_position',
                    attributes: []
                  }
                ]
              }
            ]
          }
        ],
      }
    ],
  }

  if (filter) {
    filterAll.offset = filter.offset,
      filterAll.limit = filter.limit
  }

  if (empId) {
    filterAll.where = {
      employee_id: empId
    }
  }

  return await EmployeeMasaKerja.findAll(filterAll)
}

module.exports = {
  upsert,
  acquireAllData
}