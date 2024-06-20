const {MasterProvince, MasterCountry, MasterCity} = require('../../../models')
let moment = require('moment')

async function acquireAllData(filter = {}) {
    filter.attributes = {
        exclude: ['created_at', 'updated_at','created_by', 'updated_by']
    }
    return await MasterProvince.findAll(filter)
}

async function acquireById(id) {
    return await MasterProvince.findOne({
        where: {
            id: id
        },
        include: [
            { 
                model: MasterCity, 
                required: true,
                attributes: {
                    exclude: ['created_at', 'updated_at','created_by', 'updated_by']
                }
            },
            { 
                model: MasterCountry, 
                required: true,
                attributes: {
                    exclude: ['created_at', 'updated_at','created_by', 'updated_by']
                }
            },
          ],
          attributes: {
              exclude: ['created_at', 'updated_at','created_by', 'updated_by']
          }
    })
}

const acquiredByIDandCityID = async (id, cityId) => {
    return await MasterProvince.findOne({
        where: {
            [Op.and] : [
                {
                    id : id
                },
                {
                    
                }
            ]
        }
    })
}

async function acquireByDescription(desc) {
    return await MasterProvince.findOne({
        where: {
            description: desc
        }
    })
}

async function acquireCountryById(id) {
    return await MasterCountry.findOne({
        where: {
            id: id
        }
    })
}

async function generate(data) {
    return await MasterProvince.create(data)
}

async function modernize(id, data) {
    return await MasterProvince.update(
        data, 
        {
            where: {
                id: id
            }
        }
    )
}

async function remove(id) {
    return await MasterProvince.destroy({
        where: {
            id: id
        }
    })
}

module.exports = {
    acquireAllData,
    acquireById,
    acquireByDescription,
    generate,
    modernize,
    acquireCountryById,
    remove,
    acquiredByIDandCityID
}