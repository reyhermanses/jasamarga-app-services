const {MasterEmployeeGroup, MasterEmployeeSubGroup} = require('../../../models')
let moment = require('moment')

async function acquireAllData(filter = {}) {
    filter.attributes = {
        exclude: ['created_at', 'updated_at','created_by', 'updated_by']
    }
    return await MasterEmployeeGroup.findAll(filter)
}

async function upsert(data) {
    return await MasterEmployeeGroup.findOne({
        where: {
            id: data.id
        }
    }).then((obj) => {
        if (obj) {
            data.updated_by = 'cron-db'
            return obj.update(data);
        }
        data.created_by = data.created_by,
        data.created_at = moment()
        data.updated_at = moment()
        return MasterEmployeeGroup.create(data);
    })
}

async function acquireById(id) {
    return await MasterEmployeeGroup.findOne({
        where: {
            id: id
        },
        include: {
            model: MasterEmployeeSubGroup,
            attributes: {
                exclude: ['created_at', 'updated_at','created_by', 'updated_by']
            }
        },
        attributes: {
            exclude: ['created_at', 'updated_at','created_by', 'updated_by']
        }
    })
}

async function modernize(id, data) {
    return await MasterEmployeeGroup.update(
        data, 
        {
            where: {
                id: id
            }
        }
    )
}

async function generate(data) {
    return await MasterEmployeeGroup.create(data)
}

async function remove(id) {
    return await MasterEmployeeGroup.destroy({
        where: {
            id: id
        }
    })
}

module.exports = {
    acquireAllData,
    acquireById,
    generate,
    modernize,
    remove,
    upsert
}