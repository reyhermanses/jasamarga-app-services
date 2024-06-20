const {
    EmployeeSkills,
    sequelize
} = require('../../models')

const acquireAllData = async (query) => {
    let filter = {
        attributes: {
            exclude: ['created_at', 'updated_at', 'created_by', 'updated_by']
        }
    }
    if(query.employee_id) {
        filter.where = {
            employee_id: query.employee_id
        }
    }
    return await EmployeeSkills.findAll(filter)
}

const generate = async (data) => {
    return await EmployeeSkills.create(data)
}

const acquireById = async (id) => {
    return await EmployeeSkills.findOne({
        where: {
            id: id
        }
    })
}

async function modernize(id, data) {
    return await EmployeeSkills.update(
        data, 
        {
            where: {
                id: id
            }
        }
    )
}

async function remove(id) {
    return await EmployeeSkills.destroy({
        where: {
            id: id
        }
    })
}

module.exports = {
    acquireAllData,
    generate,
    acquireById,
    modernize,
    remove
}