const {MasterJurusanPendidikan} = require('../../../models')
let moment = require('moment')

async function acquireAllData(filter = {}) {
    filter.attributes = {
        exclude: ['created_at', 'updated_at','created_by', 'updated_by']
    }
    return await MasterJurusanPendidikan.findAll(filter)
}

async function acquireById(id) {
    return await MasterJurusanPendidikan.findOne({
        where: {
            id: id
        },
        attributes: {
            exclude: ['created_at', 'updated_at','created_by', 'updated_by']
        }
    })
}

async function generate(data) {
    return await MasterJurusanPendidikan.create(data)
}

async function modernize(id, data) {
    return await MasterJurusanPendidikan.update(
        data, 
        {
            where: {
                id: id
            }
        }
    )
}

async function remove(id) {
    return await MasterJurusanPendidikan.destroy({
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