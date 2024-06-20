const {MasterStatusKeluarga} = require('../../../models')
let moment = require('moment')

async function acquireAllData(filter = {}) {
    filter.attributes = {
        exclude: ['created_at', 'updated_at','created_by', 'updated_by']
    }
    return await MasterStatusKeluarga.findAll(filter)
}

async function acquireById(id) {
    return await MasterStatusKeluarga.findOne({
        where: {
            id: id
        },
        attributes: {
            exclude: ['created_at', 'updated_at','created_by', 'updated_by']
        }
    })
}

async function modernize(id, data) {
    return await MasterStatusKeluarga.update(
        data, 
        {
            where: {
                id: id
            }
        }
    )
}

async function generate(data) {
    return await MasterStatusKeluarga.create(data)
}

async function remove(id) {
    return await MasterStatusKeluarga.destroy({
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