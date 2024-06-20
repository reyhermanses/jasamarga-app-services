const {MasterJobFunction} = require('../../../models')
let moment = require('moment')

async function acquireAllData(filter = {}) {
    filter.attributes = {
        exclude: ['created_at', 'updated_at','created_by', 'updated_by']
    }
    return await MasterJobFunction.findAll(filter)
}

async function acquireById(id) {
    return await MasterJobFunction.findOne({
        where: {
            id: id
        },
        attributes: {
            exclude: ['created_at', 'updated_at','created_by', 'updated_by']
        }
    })
}

async function generate(data) {
    return await MasterJobFunction.create(data)
}

async function modernize(id, data) {
    return await MasterJobFunction.update(
        data, 
        {
            where: {
                id: id
            }
        }
    )
}

async function remove(id) {
    return await MasterJobFunction.destroy({
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
    remove
}