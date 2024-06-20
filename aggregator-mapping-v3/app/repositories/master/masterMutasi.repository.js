const {MasterMutasi} = require('../../../models')
let moment = require('moment')

async function acquireAllData(filter = {}) {
    filter.attributes = {
        exclude: ['created_at', 'updated_at','created_by', 'updated_by']
    }
    return await MasterMutasi.findAll(filter)
}

async function acquireById(id) {
    return await MasterMutasi.findOne({
        where: {
            id: id
        },
        attributes: {
            exclude: ['created_at', 'updated_at','created_by', 'updated_by']
        }
    })
}

async function modernize(id, data) {
    return await MasterMutasi.update(
        data, 
        {
            where: {
                id: id
            }
        }
    )
}

async function generate(data) {
    return await MasterMutasi.create(data)
}

async function remove(id) {
    return await MasterMutasi.destroy({
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