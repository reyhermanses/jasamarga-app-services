const {
  UserAuth,
  Employee
} = require('../../../models')

const acquireByUsername = async (username) => {
  return await UserAuth.findOne({
    where: { username: username },
    include: [
      {
        model: Employee,
        as: 'employee'
      }
    ]
  })
}

const modernize = async (id, data) => {
  return await UserAuth.update(
    data,
    {
      where: {
        id: id
      }
    }
  )
}

async function upsert(data, transaction) {
  const checkData = await UserAuth.findOne({
    where: {
      employee_id: data.employee_id
    },
  })

  if (checkData) {
    checkData.updated_by = 'aggregator-migration'
    return await checkData.save({ transaction });
  }

  data.created_by = 'aggregator-migration'
  return await UserAuth.create(data, { transaction });
}

module.exports = {
  acquireByUsername,
  modernize,
  upsert
}