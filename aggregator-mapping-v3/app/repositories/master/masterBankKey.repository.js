const {
    MasterBankKey
} = require('../../../models')
let moment = require('moment')

async function acquireAllData(filter = {}) {
    filter.attributes = {
        exclude: ['created_at', 'updated_at', 'created_by', 'updated_by']
    }
    return await MasterBankKey.findAll(filter)
}

async function acquireById(id) {
    return await MasterBankKey.findOne({
        where: {
            id: id
        },
        attributes: {
            exclude: ['created_at', 'updated_at', 'created_by', 'updated_by']
        }
    })
}

async function acquireByBankKey(id) {
    return await MasterBankKey.findOne({
        where: {
            bank_key: id
        },
        attributes: {
            exclude: ['created_at', 'updated_at', 'created_by', 'updated_by']
        }
    })
}

async function generate(data) {
    return await MasterBankKey.create(data)
}

async function modernize(id, data) {
    return await MasterBankKey.update(
        data, {
            where: {
                id: id
            }
        }
    )
}

async function remove(id) {
    return await MasterBankKey.destroy({
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
    acquireByBankKey
}