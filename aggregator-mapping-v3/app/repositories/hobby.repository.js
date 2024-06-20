const {
  Employee,
  EmployeeHobby,
  sequelize,
  EmployeePosition,
  MasterPosition,
  MasterCompany
} = require('../../models')

async function acquireAllData(filter = {}, empId = null) {
  let filterAll = {
    attributes: {
      exclude: ['created_at', 'updated_at', 'created_by', 'updated_by']
    },
    include: [
      {
        model: Employee,
        as: 'employee_hobby',
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
              [sequelize.literal(`"employee_hobby->position->position_detail->company_position"."kd_comp"`), 'employee_kd_comp']
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
        ]
      }
    ]
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
  return await EmployeeHobby.findAndCountAll(filterAll)
}

async function acquireById(id) {
  return await EmployeeHobby.findOne({
    where: {
      id: id
    }
  })
}

async function generate(data) {
  return await EmployeeHobby.create(data)
}

async function modernize(id, data) {
  return await EmployeeHobby.update(
    data,
    {
      where: {
        id: id
      }
    }
  )
}

async function remove(id) {
  return await EmployeeHobby.destroy({
    where: {
      id: id
    }
  })
}

module.exports = {
  acquireAllData,
  generate,
  modernize,
  acquireById,
  remove
}