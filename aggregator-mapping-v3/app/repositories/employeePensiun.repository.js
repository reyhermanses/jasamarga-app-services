const {
    EmployeePensiun
} = require('../../models')

require('dotenv').config()


let axios = require('axios')
let moment = require('moment')


const {
    Op
} = require('sequelize')


async function acquireDataByPernr(pernr) {
    return await EmployeePensiun.findOne({
        where: {
            [Op.and]: [{
                personnel_number: pernr
            }]
        }
    })
}

module.exports = {
    acquireDataByPernr
}