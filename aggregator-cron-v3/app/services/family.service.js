const repository = require('../repositories/family.repository')
const moment = require('moment')

const getData = async (req) => {
  // Ambil dengan dan tanpa req.query.changedate, jika tanpa req.query.changedate maka akan mengambil data kemarin
  let responseJson = await repository.acquireData(req.query.changedate)
  if (responseJson.data.length != 0) {
    let responseFiltered = responseJson.data

    if (typeof responseFiltered == 'string') {
      let removeBacklash = responseFiltered.replaceAll(/\\/g, '').toLowerCase()
      responseFiltered = JSON.parse(removeBacklash)
    }

    // Jalankan Manual dengan Personnel Number
    if (req.query.personnel_number) {
      var obj = responseFiltered.filter(row => {
        return row.personnel_number == req.query.personnel_number
      })
      if (obj.length == 0) {
        const error = new Error("Personnel Number not found");
        error.statusCode = 404;
        throw error;
      }
      responseFiltered = obj
    }

    await processCron(responseFiltered, req)
    return responseFiltered
  } else {
    return []
  }
}

const processCron = async (responseFiltered, req) => {
  let resultOfMapping = {
    succeed: {
      count: 0,
      data: [

      ]
    },
    failed: {
      count: 0,
      data: [

      ]
    }
  }

  for (let i = 0; i < responseFiltered.length; i++) {
    const element = responseFiltered[i];
    let search = await repository.acquireDataPusat(element.personnel_number)
    if (!search) {
      element.reason = 'employee not found'
      resultOfMapping.failed.data.push(element)
      resultOfMapping.failed.count++;
      continue;
    }

    const newElement = { ...element, employee_id: search.employee_id, object_id: element.object_id.length > 0 ? Number(element.object_id) : null };
    const dataExist = await repository.acquireDataSAPCondition(newElement)

    if (element.end_date == "99991231") {
      // changedate 99991231
      const dataUpsert = {
        employee_id: search.employee_id,
        name: newElement.nama_keluarga.toUpperCase(),
        place_of_birth: newElement.tempat_lahir,
        date_of_birth: moment(newElement.tanggal_lahir).format('YYYY-MM-DD'),
        gender: newElement.jenis_kelamin == '1' ? 'Laki-Laki' : 'Perempuan',
        start_date: moment(newElement.start).format('YYYY-MM-DD'),
        end_date: newElement.end_date == '99991231' ? moment() : moment(newElement.end_date).format('YYYY-MM-DD'),
        active: isSpecialNumber(parseInt(newElement.kode_hubungan)),
        changedate: req.query.changedate ? req.query.changedate : moment().add(-1, 'days').format('YYYYMMDD'),
        created_by: 'aggregator-cron',
        family_status_id: newElement.kode_hubungan,
        object_id: parseInt(newElement.object_id) ? parseInt(newElement.object_id) : null,
        dependent_tax_purpose: newElement.dependent_tax_purpose,
        bpjs_dependent_type: newElement.bpjs_dependent_type,
        no_bpjs: newElement.no_bpjs,
        benefit_class: newElement.benefit_class,
        id_card_type: newElement.id_card_type,
        id_card_number: newElement.id_card_number,
        national_identifier: newElement.id_card_type === 'KTP' ? newElement.id_card_number : ''
      }
      if (dataExist) {
        await dataExist.update({ ...dataUpsert, updated_by: 'cron-db' });
      } else {
        await repository.generate(dataUpsert);
      }
    } else {
      // changedate bukan 99991231
      if (dataExist) {
        await dataExist.destroy();
      }
    }

    resultOfMapping.succeed.data.push(newElement)
    resultOfMapping.succeed.count++

  }
  return resultOfMapping
}

const isSpecialNumber = (number) => {
  return number === 13 || number === 10 || number === 21 ? false : true;
}

module.exports = {
  getData
}