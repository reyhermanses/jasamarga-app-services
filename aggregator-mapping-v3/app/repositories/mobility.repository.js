const { HistoryJabatan, Employee, EmployeePosition, MasterPosition, OrganizationHierarchy, MasterCluster, MasterSubCluster, sequelize } = require('../../models')

const {
  Op
} = require('sequelize')

const generateHistoryJabatan = async (data, transaction) => {
  for (const obj of data) {
    await HistoryJabatan.create(obj, { transaction })
  }

  return data
}

const deactivateEmpStatus = async (empId, transaction) => {
  return await Employee.update({ employee_status: false }, {
    where: {
      id: empId,
    },
    transaction
  });
}

const acquireEmployeePosition = async (empId) => {
  const data = await EmployeePosition.findAll({
    attributes: [
      'employee_id',
      [sequelize.col('position_detail.name'), 'posisi'],
      [sequelize.col('position_detail.sk_position_no'), 'sk_posisi'],
      [sequelize.col('position_detail.sk_position_date'), 'sk_position_date'],
      [sequelize.col('position_detail.start_date'), 'awal_posisi'],
      [sequelize.col('position_detail.grade'), 'grade'],
      [sequelize.col('position_detail.level'), 'level'],
      [sequelize.col('position_detail.konversi'), 'konversi'],
      [sequelize.literal(`"position_detail->unit_position"."name"`), 'unit'],
      [sequelize.col('position_detail.company_id'), 'kd_comp'],
      [sequelize.literal(`"position_detail->cluster_position"."name"`), 'cluster'],
      [sequelize.literal(`"position_detail->sub_cluster_position"."name"`), 'sub_cluster'],
      [sequelize.col('position_detail.file_sk'), 'file_sk'],
      'is_main',
      'action',
      'npp',
      [sequelize.col('position_detail.id'), 'posisi_id']
    ],
    where: {
      employee_id: empId,
      is_main: true
    },
    include: [
      {
        model: MasterPosition,
        as: 'position_detail',
        attributes: [],
        include: [
          {
            model: OrganizationHierarchy,
            as: 'unit_position',
            attributes: []
          },
          {
            model: MasterCluster,
            as: 'cluster_position',
            attributes: []
          },
          {
            model: MasterSubCluster,
            as: 'sub_cluster_position',
            attributes: []
          }
        ]
      }
    ],
    raw: true
  })

  return data
}

const removeEmployeePosition = async (empId, transaction) => {
  return await EmployeePosition.destroy({
    where: {
      employee_id: empId,
      is_main: true
    },
    transaction
  })
}

const modernizeMasterPosition = async (id, data, transaction) => {
  return await MasterPosition.update(data, {
    where: {
      id: id,
    },
    transaction
  });
}

const acquireByIdMasterPosition = async (id) => {
  return await MasterPosition.findByPk(id)
}

const acquireLeader = async (orgId) => {
  return await OrganizationHierarchy.findOne({
    where: {
      id: orgId
    },
    attributes: [
      'id',
      'leader_id',
      'leader_position_id'
    ],
    include: [
      {
        model: OrganizationHierarchy,
        as: 'parent',
        attributes: [
          'leader_id',
          'leader_position_id'
        ]
      }
    ]
  })
}

const acquireMainPosition = async (empId) => {
  return await EmployeePosition.findOne({
    where: {
      [Op.and]: [
        {
          employee_id: empId,
        },
        {
          is_main: true
        }
      ]
    },
    raw: true
  })
}

const generateEmployeePosition = async (data, transaction) => {
  return await EmployeePosition.create(data, { transaction })
}

const removeMasterPosition = async (id, transaction) => {
  return await MasterPosition.destroy({
    where: {
      id: id,
    },
    transaction
  });
}

const acquireHistoryJabatan = async (id) => {
  return await HistoryJabatan.findOne({
    where: {
      employee_id: id
    }
  })
}

const acquireEmployeeCompanyAsalByID = async (empId) => {
  return await Employee.findByPk(empId, {
    attributes: ['id', 'company_id_asal', 'company_id_penugasan', 'is_penugasan']
  })
}

const modernizeEmployeeSubGroup = async (empId, transaction, subGroupId) => {
  return await Employee.update({ employee_sub_group_id: subGroupId }, {
    where: {
      id: empId,
    },
    transaction
  });
}

module.exports = {
  generateHistoryJabatan,
  acquireEmployeePosition,
  removeEmployeePosition,
  modernizeMasterPosition,
  acquireByIdMasterPosition,
  acquireLeader,
  acquireMainPosition,
  generateEmployeePosition,
  deactivateEmpStatus,
  removeMasterPosition,
  acquireHistoryJabatan,
  acquireEmployeeCompanyAsalByID,
  modernizeEmployeeSubGroup
}