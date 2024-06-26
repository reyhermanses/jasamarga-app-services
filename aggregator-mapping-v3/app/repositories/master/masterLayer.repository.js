const {MasterLayer} = require('../../../models')
let moment = require('moment')

async function acquireAllData(filter = {}) {
    filter.attributes = {
        exclude: ['created_at', 'updated_at','created_by', 'updated_by']
    }
    return await MasterLayer.findAll(filter)
}

async function acquireById(id) {
    return await MasterLayer.findOne({
        where: {
            id: id
        },
        attributes: {
            exclude: ['created_at', 'updated_at','created_by', 'updated_by']
        }
    })
}

async function modernize(id, data) {
    return await MasterLayer.update(
        data, 
        {
            where: {
                id: id
            }
        }
    )
}

async function generate(data) {
    return await MasterLayer.create(data)
}

async function remove(id) {
    return await MasterLayer.destroy({
        where: {
            id: id
        }
    })
}

module.exports = {
    acquireAllData,
    acquireById,
    generate,
    modernize
}