const {MasterCountry, MasterProvince} = require('../../../models')
let moment = require('moment')

async function acquireAllData(filter = {}) {
    filter.attributes = {
        exclude: ['created_at', 'updated_at','created_by', 'updated_by']
    }
    return await MasterCountry.findAll(filter)
}

async function acquireById(id) {
    return await MasterCountry.findOne({
        where: {
            id: id
        },
        include: {
            model: MasterProvince,
            attributes: {
                exclude: ['created_at', 'updated_at','created_by', 'updated_by']
            }
        },
        attributes: {
            exclude: ['created_at', 'updated_at','created_by', 'updated_by']
        }
    })
}

async function acquireByCode(code) {
    return await MasterCountry.findOne({
        where: {
            code: code
        },
        attributes: {
            exclude: ['created_at', 'updated_at','created_by', 'updated_by']
        }
    })
}

async function generate(data) {
    return await MasterCountry.create(data)
}

async function modernize(id, data) {
    return await MasterCountry.update(
        data, 
        {
            where: {
                id: id
            }
        }
    )
}

async function remove(id) {
    return await MasterCountry.destroy({
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
    acquireByCode
}