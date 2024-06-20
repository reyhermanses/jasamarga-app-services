const { sapObjectRelation } = require('../../models')

const { Op } = require("sequelize");
const axios = require('axios')
const moment = require('moment');

async function acquireByChangeDate(changedate) {
    return await sapObjectRelation.findAll({
        where: {
            changedate: changedate
        },
        raw: true
    })
}

async function generate(data) {
    return await sapObjectRelation.create(data)
}

async function remove(changedate) {
    return await sapObjectRelation.destroy({
        where: {
            changedate: changedate
        }
    })
}

async function acquireDataSAP(changeDate = null) {
    const response = await axios.post(
        changeDate ? 
        `${process.env.SAP_URL}`+`?sap-client=120&sat-table=JM_OBJECT_RELATION&mode=05&changedate=`+changeDate :
        process.env.SAP_URL+`?sap-client=120&sat-table=JM_OBJECT_RELATION&mode=05&changedate=`+moment().add(-1, 'days').format('YYYYMMDD')
        , {}, {
            auth: {
              username: process.env.SAP_USER,
              password: process.env.SAP_PASSWORD
            }
        }
    )
    return response
}

async function acquireOneByObjectId(ot, toro, oi, subtype) {
    return await sapObjectRelation.findOne({
        where: {
            [Op.and]: [
                {
                    object_type: ot
                },
                {
                    type_of_related_object: toro
                },
                {
                    object_id: oi
                },
                {
                    subtype: subtype
                },
                {
                    end_date: '99991231'
                }
            ]
        },
        order: [
            ['changedate', 'DESC'],
        ],
        raw: true
    })
}

async function acquireOneByIdRelated(ot, toro, ioro, subtype) {
    return await sapObjectRelation.findOne({
        where: {
            [Op.and]: [
                {
                    object_type: ot
                },
                {
                    type_of_related_object: toro
                },
                {
                    id_of_related_object: ioro
                },
                {
                    subtype: subtype
                },
                {
                    end_date: '99991231'
                }
            ]
        },
        order: [
            ['changedate', 'DESC'],
        ],
        raw: true
    })
}

module.exports = {
    acquireByChangeDate,
    acquireOneByObjectId,
    acquireOneByIdRelated,
    acquireDataSAP,
    remove,
    generate
}