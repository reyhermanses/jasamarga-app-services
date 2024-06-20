const repository = require('../repositories/profile.repository')
let moment = require('moment');

// PROSES DATA KESELURUHAN
const getData = async (req) => {
  const personalData = await getPersonalData(req.query.changedate ? req.query.changedate : null, req.query.personnel_number)
  const personalID = await getPersonalID(req.query.changedate ? req.query.changedate : null, req.query.personnel_number)
  const BPJSKes = await getBPJS(req.query.changedate ? req.query.changedate : null, req.query.personnel_number, 'JM_BPJS_KES')
  const BPJSTK = await getBPJS(req.query.changedate ? req.query.changedate : null, req.query.personnel_number, 'JM_BPJS_TK')
  const tax = await getTax(req.query.changedate ? req.query.changedate : null, req.query.personnel_number)
  const address = await getAddress(req.query.changedate ? req.query.changedate : null, req.query.personnel_number)
  return {
    personal_data: personalData,
    personal_id: personalID,
    BPJS_kesehatan: BPJSKes,
    BPJS_TK: BPJSTK,
    tax: tax,
    address: address
  }
}

const getDataPersonalData = async (req) => {
  return await getPersonalData(req.query.changedate ? req.query.changedate : null, req.query.personnel_number)
}

const getDataPersonalID = async (req) => {
  return await getPersonalID(req.query.changedate ? req.query.changedate : null, req.query.personnel_number)
}

const getDataBPJSKes = async (req) => {
  return await getBPJS(req.query.changedate ? req.query.changedate : null, req.query.personnel_number, 'JM_BPJS_KES')
}

const getDataBPJSTK = async (req) => {
  return await getBPJS(req.query.changedate ? req.query.changedate : null, req.query.personnel_number, 'JM_BPJS_TK')
}

const getDataTax = async (req) => {
  return await getTax(req.query.changedate ? req.query.changedate : null, req.query.personnel_number)
}

const getDataAddress = async (req) => {
  return await getAddress(req.query.changedate ? req.query.changedate : null, req.query.personnel_number)
}

// -------- PENGAMBILAN DATA ADDRESS --------
const getAddress = async (changeDate = null, persNumber = null) => {
  let responseJson = await repository.acquireData(changeDate, 'JM_ADDRESS')
  const clean = await cleansingData(responseJson, persNumber)
  if (clean.length > 0) {
    const result = await processAddress(clean, changeDate)
    return result
  }
  return []
}

const processAddress = async (responseFiltered, changedate) => {
  const result = []
  for (element of responseFiltered) {
    const search = await repository.acquireDataPusat(element.personnel_number)

    if (search) {
      let data = {
        employee_id: search.employee_id,
        npwp: element.tax_id,
        changedate: changedate ? changedate : moment().add(-1, 'days').format('YYYYMMDD'),
        created_by: 'aggregator-cron'
      }

      const dataCity = await repository.acquireCityByDescription(element.kota_karyawan)
      const dataProvince = await repository.acquireProvinceByID(parseInt(element.provinsi_karyawan))
      const dataKecamatan = await repository.acquireKecamatanByName(element.district_kecamatan)
      const dataKelurahan = await repository.acquireKelurahanByName(element.desa_kelurahan)

      if (element.address_type == '1') {
        // alamat KTP
        data.address_ktp = element.alamat_karyawan
        data.city_ktp_id = dataCity ? dataCity.id : null
        data.province_ktp_id = dataProvince ? dataProvince.id : null
        data.kd_pos = element.kode_pos
        data.kecamatan_ktp_id = dataKecamatan?.id
        data.kelurahan_ktp_id = dataKelurahan?.id
        // tidak ada data district / kecamatan di database
        // tidak ada data country di database
        data.kd_pos = element.kode_pos
        data.telephone_no = element.telephone_number
        data.rt = element.no_rt
        data.rw = element.no_rw
      } else if (element.address_type == '3') {
        // alamat domisili
        data.address_domicile = element.alamat_karyawan
        data.city_domicile_id = dataCity ? dataCity.id : null
        data.province_domicile_id = dataProvince ? dataProvince.id : null
        data.kecamatan_domicile_id = dataKecamatan?.id
        data.kelurahan_domicile_id = dataKelurahan?.id
        // tidak ada data district / kecamatan di database
        // tidak ada data country di database
        data.kd_pos_domicile = element.kode_pos
        data.telephone_no = element.telephone_number
        data.rt_domicile = element.no_rt
        data.rw_domicile = element.no_rw
      }

      await repository.upsert(data)
      result.push({
        employee_number: element.personnel_number,
        action_profile: 'address',
        status: "success"
      })
    }
  }
  return result
}

// -------- PENGAMBILAN DATA TAX -------- 
const getTax = async (changeDate = null, persNumber = null) => {
  let responseJson = await repository.acquireData(changeDate, 'JM_TAX_ID')
  const clean = await cleansingData(responseJson, persNumber)

  if (clean.length > 0) {
    const result = await processTax(clean, changeDate)
    return result
  }
  return []
}

const processTax = async (responseFiltered, changedate) => {
  const result = []
  for (element of responseFiltered) {
    const search = await repository.acquireDataPusat(element.personnel_number)

    if (search) {
      let data = {
        employee_id: search.employee_id,
        npwp: element.tax_id,
        changedate: changedate ? changedate : moment().add(-1, 'days').format('YYYYMMDD'),
        created_by: 'aggregator-cron'
      }

      await repository.upsert(data)
      result.push({
        employee_number: element.personnel_number,
        action_profile: 'tax_id',
        status: "success"
      })
    }
  }
  return result
}

// -------- PENGAMBILAN DATA BPJS -------- 
const getBPJS = async (changeDate = null, persNumber = null, folderName) => {
  let responseJson = await repository.acquireData(changeDate, folderName)
  const clean = await cleansingData(responseJson, persNumber)

  if (clean.length > 0) {
    const result = await processBPJS(clean, changeDate, folderName)
    return result
  }
  return []
}

const processBPJS = async (responseFiltered, changedate, folderName) => {
  const result = []
  for (element of responseFiltered) {
    const search = await repository.acquireDataPusat(element.personnel_number)

    if (search) {
      let data = {
        employee_id: search.employee_id,
        changedate: changedate ? changedate : moment().add(-1, 'days').format('YYYYMMDD'),
        created_by: 'aggregator-cron'
      }

      if (folderName == 'JM_BPJS_KES') {
        data.bpjs_kes_no = element.bpjs_id
      } else {
        data.bpjs_ket_no = element.jamsostek_id
      }

      await repository.upsert(data)
      result.push({
        employee_number: element.personnel_number,
        action_profile: folderName,
        status: "success"
      })
    }
  }

  return result
}

// -------- PENGAMBILAN DATA PERSONAL ID -------- 
const getPersonalID = async (changeDate = null, persNumber = null) => {
  let responseJson = await repository.acquireData(changeDate, 'JM_PERSONAL_ID')
  let clean = await cleansingData(responseJson, persNumber)
  if (clean.length > 0) {
    const selectType = clean.filter(row => {
      let allowedType = row.type_identitas == '01' || row.type_identitas == '11' || row.type_identitas == '10'
      return allowedType
    })
    clean = selectType

    const result = await processPersonalID(clean, changeDate)
    return result
  }
  return []
}

const processPersonalID = async (responseFiltered, changedate) => {
  const result = []
  for (element of responseFiltered) {
    const search = await repository.acquireDataPusat(element.personnel_number)

    if (search) {
      let data = {
        employee_id: search.employee_id,
        changedate: changedate ? changedate : moment().add(-1, 'days').format('YYYYMMDD'),
        created_by: 'aggregator-cron'
      }

      if (element.type_identitas == '01') {
        data.national_identifier = element.no_identitas
      }

      if (element.type_identitas == '10') {
        data.no_kk = element.no_identitas
      }

      await repository.upsert(data)
      result.push({
        employee_number: element.personnel_number,
        action_profile: "personal_id",
        status: "success"
      })
    }
  }
  return result
}

// -------- PENGAMBILAN DATA PERSONAL DATA -------- 
const getPersonalData = async (changeDate = null, persNumber = null) => {
  const responseJson = await repository.acquireData(changeDate, 'JM_PERSONAL_DATA')
  const clean = await cleansingData(responseJson, persNumber)
  if (clean.length > 0) {
    return await processPersonalData(clean, changeDate)
  }
  return []
}

const processPersonalData = async (responseFiltered, changedate) => {
  const result = []
  for (element of responseFiltered) {
    const search = await repository.acquireDataPusat(element.personnel_number)

    if (search) {
      let data = {
        employee_id: search.employee_id,
        name: element.name,
        changedate: changedate ? changedate : moment().add(-1, 'days').format('YYYYMMDD'),
        created_by: 'aggregator-cron',
        gender: element.jenis_kelamin = "1" ? true : false,
        religion_id: parseInt(element.agama),
        front_title_education: element.pre_title,
        end_title_education: element.post_title,
        place_of_birth: element.tempat_lahir,
        date_of_birth: moment(element.tanggal_lahir).format('YYYY-MM-DD')
      }

      switch (element.status_pernikahan) {
        case '0':
          data.marital_status = 'Lajang'
          break;
        case '1':
          data.marital_status = 'Nikah'
          break;
        case '2':
          data.marital_status = 'Janda'
          break;
        case '3':
          data.marital_status = 'Duda'
          break;
        default:
          data.marital_status = 'Lajang'
          break;
      }
      await repository.upsert(data)
      result.push({
        employee_number: element.personnel_number,
        action_profile: "personal_data",
        status: "success"
      })
    }
  }
  return result
}

const cleansingData = async (responseJson, persNumber = null) => {
  if (responseJson.data.length != 0) {
    let responseFiltered = responseJson.data

    if (typeof responseFiltered == 'string') {
      let removeBacklash = responseFiltered.replaceAll(/\\/g, '').replaceAll(/'/g, '')
      responseFiltered = JSON.parse(removeBacklash)
    }
    if (persNumber) {
      var obj = responseFiltered.filter(row => {
        return row.personnel_number == persNumber
      })
      if (obj.length == 0) {
        throw new Error('Personnel Number not found')
      }
      responseFiltered = obj
    }

    return responseFiltered
  }
  return []
}

module.exports = {
  getData,
  getDataPersonalData,
  getDataPersonalID,
  getDataBPJSKes,
  getDataBPJSTK,
  getDataTax,
  getDataAddress
}