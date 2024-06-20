const {
    SantunanDuka1
} = require('../../models')

require('dotenv').config()


let axios = require('axios')
let moment = require('moment')

const {
    Op
} = require('sequelize')

async function acquiredSap(dateNow) {
    const response = await axios.post(
        `${process.env.SAP_URL}` + `?sap-client=120&mode=12&keydate=` + dateNow, {}, {
            auth: {
                username: `${process.env.SAP_USER}`,
                password: `${process.env.SAP_PASSWORD}`
            }
        }
    )
    return response
}

async function generate(data) {
    return await SantunanDuka1.create(data)
}

async function upsert(data) {
    return await SantunanDuka1.findOne({
        where: {
            [Op.and]: [{
                    employee_id: data.employee_id
                },
                {
                    keydate: data.keydate
                },
            ]
        }
    }).then((obj) => {
        if (obj) {
            data.updated_by = 'aggregator-data'
            return obj.update(data);
        }
        return SantunanDuka1.create(data);
    })
}

async function acquiredAllData(filter = {}, query = null) {

    filterAll = {
        attributes: ['employee_name', 'employee_number', 'periode_payslip', 'unit_kerja']
    }
    let periode = null;
    let year = null;
    let month = null;

    year = query.periode.substr(0, 4)
    month = query.periode.substr(4, 5)

    periode = `${month}-${year}`

    if (query) {
        if (query.periode) {
            filterAll.where = {
                periode_payslip: periode
            }
        }
    }

    return await SantunanDuka1.findAll(filterAll)
}

async function acquireAllDataNoFilter() {
    return await SantunanDuka1.findAll()
}

async function aqcuireByPeriode(tanggal) {
    filterAll = {
        attributes: ['employee_name', 'employee_number', 'periode_payslip', 'unit_kerja']
    }
    let periode = null;
    let year = null;
    let month = null;

    year = tanggal.substr(0, 4)
    month = tanggal.substr(4, 5)

    periode = `${month}-${year}`

    if (tanggal) {
        if (tanggal) {
            filterAll.where = {
                periode_payslip: periode
            }
        }
    }

    return await SantunanDuka1.findAll(filterAll)
}

module.exports = {
    acquiredAllData,
    aqcuireByPeriode,
    acquiredSap,
    generate,
    acquireAllDataNoFilter,
    upsert
}