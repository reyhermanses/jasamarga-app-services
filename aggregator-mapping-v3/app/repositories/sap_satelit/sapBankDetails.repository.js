const {
    SapBankDetails,
} = require('../../../models');

let axios = require('axios')
let moment = require('moment')

const {
    Op,
    and
} = require('sequelize')

async function acquiredAllData() {
    filterAll = {
        // limit: 20,
        // offset: 20
    }
    return SapBankDetails.findAll(filterAll)
}

module.exports = {
    acquiredAllData,
}