const {MasterEmployeeSubGroup, MasterEmployeeGroup} = require('../../../models')

async function acquireAllData(filter = {}) {
    filter.attributes = {
        exclude: ['created_at', 'updated_at','created_by', 'updated_by']
    }
    return await MasterEmployeeSubGroup.findAll(filter)
}

async function upsert(data) {
    return await MasterEmployeeSubGroup.findOne({
        where: {
            key: data.key
        }
    }).then((obj) => {
        if (obj) {
            data.updated_by = 'cron-db'
            return obj.update(data);
        }
        data.created_by = data.created_by,
        data.created_at = moment()
        data.updated_at = moment()
        return MasterEmployeeSubGroup.create(data);
    })
}

async function acquireById(id) {
    return await MasterEmployeeSubGroup.findOne({
        where: {
            id: id
        },
        attributes: {
            exclude: ['created_at', 'updated_at','created_by', 'updated_by']
        }
    })
}

async function acquireMasterEmployeeGroupById(id) {
    return await MasterEmployeeGroup.findOne({
        where: {
            id: id
        }
    })
}

async function generate(data) {
    return await MasterEmployeeSubGroup.create(data)
}

async function modernize(id, data) {
    return await MasterEmployeeSubGroup.update(
        data, 
        {
            where: {
                id: id
            }
        }
    )
}

async function remove(id) {
    return await MasterEmployeeSubGroup.destroy({
        where: {
            id: id
        }
    })
}

module.exports = {
    acquireAllData,
    acquireById,
    modernize,
    acquireMasterEmployeeGroupById,
    generate,
    remove,
    upsert
}