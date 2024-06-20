const {MasterPersonalSubArea, MasterPersonalArea} = require('../../../models')
let moment = require('moment')

async function acquireAllData(filter = {}) {
    filter.attributes = {
        exclude: ['created_at', 'updated_at','created_by', 'updated_by']
    }
    return await MasterPersonalSubArea.findAll(filter)
}

async function upsert(data) {
    return await MasterPersonalSubArea.findOne({
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
        return MasterPersonalSubArea.create(data);
    })
}

async function acquireById(id) {
    return await MasterPersonalSubArea.findOne({
        where: {
            id: id
        },
        include: {
            model: MasterPersonalArea,
            attributes: {
                exclude: ['created_at', 'updated_at','created_by', 'updated_by']
            }
        },
        attributes: {
            exclude: ['created_at', 'updated_at','created_by', 'updated_by']
        }
    })
}

async function acquirePersonalAreaById(id) {
    return await MasterPersonalArea.findOne({
        where: {
            id: id
        }
    })
}

async function generate(data) {
    return await MasterPersonalSubArea.create(data)
}

async function modernize(id, data) {
    return await MasterPersonalSubArea.update(
        data, 
        {
            where: {
                id: id
            }
        }
    )
}

async function remove(id) {
    return await MasterPersonalSubArea.destroy({
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
    acquirePersonalAreaById,
    upsert
}