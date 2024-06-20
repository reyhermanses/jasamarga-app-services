const repository = require('../repositories/sapObjectRelation.repository')
const { modernize: updatePosition } = require('../repositories/master/masterPosition.repository')
const { upsert: updateOrg } = require('../repositories/organizationHierarchy.repository')

const moment = require('moment');

async function getDataByChangedate(req) {
    const data = await repository.acquireByChangeDate(req.params.changedate)
    return data
}

async function getDataSAP(req) {
    const dataSAP = await repository.acquireDataSAP(req.query.changedate)
    const dataExisted = await repository.acquireByChangeDate(req.query.changedate ? req.query.changedate : moment().add(-1, 'days').format('YYYYMMDD'))
    if(dataExisted.length > 0) {
        await repository.remove(req.query.changedate ? req.query.changedate : moment().add(-1, 'days').format('YYYYMMDD'))   
    }

    let responseFiltered = dataSAP.data
    if(typeof responseFiltered == 'string') {
        let removeBacklash = responseFiltered.replaceAll(/\\/g, '').toLowerCase()
        responseFiltered = JSON.parse(removeBacklash)
    }

    // hapus duplikasi
    const uniqueArray = responseFiltered.filter((value, index) => {
        const _value = JSON.stringify(value);
        return index === responseFiltered.findIndex(obj => {
            return JSON.stringify(obj) === _value;
        });
    });

    uniqueArray.forEach(async (obj, index) => {
        await repository.generate({
            ...obj,
            changedate: req.query.changedate ? req.query.changedate : moment().add(-1, 'days').format('YYYYMMDD'),
            syn_status: true,
            insert_date: req.query.changedate ? moment(req.query.changedate).format('YYYY-MM-DD') : moment().add(-1, 'days')
        })
    })

    return uniqueArray
}

async function syncDataAtasan(changedate = null) {
    const dataSAP = await repository.acquireByChangeDate(changedate ? changedate : moment().add(-1, 'days').format('YYYYMMDD'))
    const filteredDataSAP = dataSAP.filter(obj => {
        return obj.end_date == '99991231'
    })
    return filteredDataSAP
}

module.exports = {
    getDataByChangedate,
    syncDataAtasan,
    getDataSAP
}