const {MasterJob} = require('../../../models')
let moment = require('moment')

async function acquireAllData(filter = {}) {
    filter.attributes = {
        exclude: ['created_at', 'updated_at','created_by', 'updated_by']
    }
    return await MasterJob.findAll(filter)
}

async function acquireById(id) {
    return await MasterJob.findOne({
        where: {
            id: id
        },
        attributes: {
            exclude: ['created_at', 'updated_at','created_by', 'updated_by']
        }
    })
}

async function upsert(data) {
    return await MasterJob.findOne({
        where: {
            id: data.id
        }
    }).then((obj) => {
        if (obj) {
            data.updated_by = 'cron_db'
            return obj.update(data);
        }
        data.created_by = 'cron_db'
        return MasterJob.create(data);
    })
}

async function generate(data) {
    return await MasterJob.create(data)
}

async function modernize(id, data) {
    return await MasterJob.update(
        data, 
        {
            where: {
                id: id
            }
        }
    )
}

async function remove(id) {
    return await MasterJob.destroy({
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