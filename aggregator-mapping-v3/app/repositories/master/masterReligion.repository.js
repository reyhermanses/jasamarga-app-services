const {MasterReligion} = require('../../../models')
let moment = require('moment')

async function acquireAllData(filter = {}) {
    filter.attributes = {
        exclude: ['created_at', 'updated_at','created_by', 'updated_by']
    }
    return await MasterReligion.findAll(filter)
}

async function acquireById(id) {
    return await MasterReligion.findOne({
        where: {
            id: id
        },
        attributes: {
            exclude: ['created_at', 'updated_at','created_by', 'updated_by']
        }
    })
}

async function generate(data) {
    return await MasterReligion.create(data)
}

async function modernize(id, data) {
    return await MasterReligion.update(
        data, 
        {
            where: {
                id: id
            }
        }
    )
}

async function remove(id) {
    return await MasterReligion.destroy({
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