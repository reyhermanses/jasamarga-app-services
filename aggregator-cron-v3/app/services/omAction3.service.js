const repository = require('../repositories/omAction3.repository')

const moment = require('moment');

const getData = async (req, transaction) => {
  // Ambil dengan dan tanpa req.query.changedate, jika tanpa req.query.changedate maka akan mengambil data kemarin
  let responseOmAction3 = await repository.acquireData(req.query.changedate ? req.query.changedate : null);

  if (responseOmAction3.data.length > 0) {
    let responseFiltered = responseOmAction3.data;

    // 1. CLEANSING DATA
    // a. bersihkan karakter mengganggu
    if (typeof responseFiltered == "string") {
      const removeBacklash = responseFiltered.replaceAll(/\\/g, "");
      responseFiltered = JSON.parse(removeBacklash);
    }

    // b. jika dipilih spesifik personnel number, ambil data terkait pers.number tsb saja dari data
    if (req.query.personnel_number) {
      const obj = responseFiltered.filter(row => {
        return row.personnel_number == req.query.personnel_number
      })

      if (obj.length == 0) {
        const error = new Error("Personnel Number not found");
        error.statusCode = 404;
        throw error;
      }

      responseFiltered = obj;
    }

    // c. hapus duplikasi
    const uniqueArray = responseFiltered.filter((value, index) => {
      const _value = JSON.stringify(value);
      return (
        index ===
        responseFiltered.findIndex((obj) => {
          return JSON.stringify(obj) === _value;
        })
      );
    });

    // d. ambil action_end_date yang 99991231 saja
    const newUnique = uniqueArray.filter((obj) => {
      return obj.action_end_date == "99991231";
    });

    const data = await processCron(newUnique, req.query.changedate, transaction)
    return data
  }
  return {}
}

const processCron = async (data, changedate, transaction) => {
  const processed = []
  for (const item of data) {
    const action = item.action.toLowerCase()
    console.log(item)
    // klasifikasi berdasarkan action
    switch (action) {
      case 'rotasi':
        processed.push(await processRotasiPromosi(item, changedate, action, transaction))
        break;
      case 'promosi':
        processed.push(await processRotasiPromosi(item, changedate, action, transaction))
        break;
      case 'pensiun':
        processed.push(await processPensiunTerminate(item, changedate, action, transaction))
        break;
      case 'terminate':
        processed.push(await processPensiunTerminate(item, changedate, action, transaction))
        break;
      case 'initial data':
        processed.push(await processInitialData(item, action, transaction))
        break;
      case 'cuti sakit':
        break;
      default:
        break;
    }
  }
  return data
}

// PROSES KARYAWAN BARU ( INITIAL DATA )
const processInitialData = async (item, action, transaction) => {
  const data = await repository.acquireDatabase(item.personnel_number)
  const newNpp = await generateNewNPP(item.personnel_number)

  /*
  1. CEK DATA POSISI LALU UPDATE DATA TERBARU
  2. BUAT DATA BARU EMPLOYEE [JIKA BELUM ADA]
  3. HUBUNGKAN EMPLOYEE POSITION DENGAN MASTER_POSITION
  5. UPSERT AUTH
  */
  await upsertDataPosition(item, transaction)
  const dataSubGroup = await repository.acquireSubGroupByKey(item.employee_subgroup)

  // tambahkan data employee baru
  if (!data) {
    const dataEmployee = {
      name: item.name,
      employee_status: true,
      is_pusat: true,
      company_id_asal: 1,
      employee_group_id: item.employee_group,
      employee_sub_group_id: dataSubGroup.id,
      created_by: 'aggregator-cron'
    }

    const newEmployee = await repository.generateEmployee(dataEmployee, transaction)

    // hubungkan employee position -> master_position [BARU]
    await repository.upsertEmployeePosition({
      employee_id: newEmployee.id,
      npp: newNpp,
      personnel_number: item.personnel_number,
      position_id: item.position_key,
      cost_center: item.cost_center,
      is_main: true
    }, transaction)

    // update or insert data auth untuk keperluan login
    await repository.upsertAuth({
      employee_id: newEmployee.id,
      username: newNpp,
      is_ldap: true,
    }, transaction)
  } else {
    // hubungkan employee position -> master_position [BARU]
    await repository.upsertEmployeePosition({
      employee_id: data.id,
      npp: newNpp,
      personnel_number: item.personnel_number,
      position_id: item.position_key,
      cost_center: item.cost_center,
      is_main: true
    }, transaction)

    // update or insert data auth untuk keperluan login
    await repository.upsertAuth({
      employee_id: data.id,
      username: newNpp,
      is_ldap: true,
    }, transaction)
  }

  return {
    employee_number: item.personnel_number,
    name: data.name,
    action: action,
    status: "success"
  }
}

// PROSES KARYAWAN PENSIUN
const processPensiunTerminate = async (item, changedate, action, transaction) => {
  const data = await repository.acquireDatabase(item.personnel_number)

  // 1. NON AKTIFKAN KARYAWAN
  // 2. BUAT HISTORY JABATAN
  await createDataHistoryJabatan(data, changedate, item, action, transaction)
  await repository.modernizeEmployee(data.id, {
    employee_status: false
  }, transaction)

  return {
    employee_number: item.personnel_number,
    name: data.name,
    action: action,
    status: "success"
  }
}

// PROSES KARYAWAN ROTASI / PROMOSI
const processRotasiPromosi = async (item, changedate, action, transaction) => {
  const data = await repository.acquireDatabase(item.personnel_number)
  const newNpp = await generateNewNPP(item.personnel_number)

  /*
  1. CEK DATA POSISI LALU UPDATE DATA TERBARU
  2. HUBUNGKAN EMPLOYEE POSITION DENGAN MASTER_POSITION
  3. GENERATE HISTORY JABATAN (JIKA SK TIDAK SAMA)
  4. UPSERT AUTH
  */

  await upsertDataPosition(item, transaction)

  const skPositionNo = data.position[0].position_detail.sk_position_no

  // kondisi jika harus generate history jabatan (sk_posiiton_number document != sk_position_number sekarang)
  if (item.doc_number !== skPositionNo) {
    console.log('harusnya ke eksekusi');
    await createDataHistoryJabatan(data, changedate, item, action, transaction)
  }

  // hubungkan employee position -> master_position
  await repository.upsertEmployeePosition({
    employee_id: data.id,
    npp: newNpp,
    personnel_number: item.personnel_number,
    position_id: item.position_key,
    cost_center: item.cost_center,
    is_main: true
  }, transaction)

  // update or insert data auth untuk keperluan login
  await repository.upsertAuth({
    employee_id: data.id,
    username: newNpp,
    is_ldap: true,
  }, transaction)

  return {
    employee_number: item.personnel_number,
    name: data.name,
    action: action,
    status: "success"
  }
}

const generateNewNPP = async (persNumber) => {
  let newNpp = "";
  switch (persNumber.substring(0, 1)) {
    case "9":
      newNpp = `D${persNumber.substring(4, 8)}`;
      break;
    case "8":
      newNpp = `K${persNumber.substring(4, 8)}`;
      break;
    case "6":
      newNpp = `TPP${persNumber.substring(6, 8)}`;
      break;
    case "7":
      newNpp = `A${persNumber.substring(4, 8)}`;
      break;
    case "5":
      newNpp = `P${persNumber.substring(4, 8)}`;
      break;
    default:
      newNpp = persNumber.substring(3, 8);
      break;
  }
  return newNpp
}

const upsertDataPosition = async (item, transaction) => {
  const dataUnit = await repository.acquireDataOrganization(item.unit_kerja)
  const splittedPosDate = item.tanggal_efektif_sk.split(".");
  const newPosition = {
    id: item.position_key,
    name: item.text_position_key,
    company_id: 1,
    unit_kerja_id: item.unit_kerja,
    departemen_id: item.departement,
    seksi_id: item.section,
    direktorat_id: dataUnit.parent_id,
    job_id: item.job_key,
    personal_area_id: item.personal_area,
    personal_sub_area_id: item.personal_sub_area,
    sk_position_no: item.doc_number,
    sk_position_date: moment(
      `${splittedPosDate[2]}${splittedPosDate[1]}${splittedPosDate[0]}`
    ).format("YYYY-MM-DD"),
    start_date: item.start_date = moment(
      `${splittedPosDate[2]}${splittedPosDate[1]}${splittedPosDate[0]}`
    ).format("YYYY-MM-DD"),
    grade: item.grade,
    level: item.subgrade,
    kelompok_jabatan: item.kelompok_jabatan == "14" || item.kelompok_jabatan == "21"
      ? "Operasional"
      : "Non Operasional",
    org_id: item.organisasi_key,
    active: true
  }

  return await repository.upsertPosition(newPosition, transaction)
}

const createDataHistoryJabatan = async (dataEmployee, changedate, item, action, transaction) => {
  const newHistoryJabatan = {
    employee_id: dataEmployee.id ?? null,
    angkatan: 1,
    posisi: dataEmployee.position[0].name ?? null,
    sk_posisi: dataEmployee.position[0].position_detail.sk_position_no ?? null,
    awal_posisi: dataEmployee.position[0].position_detail.sk_position_date ?? null,
    akhir_posisi: item != null ? moment(item.tanggal_efektif_sk, 'DD.MM.YYYY').add(-1, "days") : (changedate
      ? moment(changedate).format("YYYY-MM-DD")
      : moment().add(-1, "days").format("YYYY-MM-DD")),
    grade: dataEmployee.position[0].position_detail.grade ?? null,
    level: dataEmployee.position[0].position_detail.level ?? null,
    konversi: dataEmployee.position[0].position_detail.konversi ?? null,
    unit: dataEmployee.position[0].position_detail.unit_position?.name ?? null,
    kd_comp: dataEmployee.position[0].position_detail.company_id ?? null,
    file_sk: dataEmployee.position[0].position_detail.file_sk ?? null,
    sk_position_date: dataEmployee.position[0].position_detail.sk_position_date ?? null,
    action: action,
    is_main: dataEmployee.position[0].is_main,
    npp: dataEmployee.position[0].npp,
    created_by: "aggregator-cron",
  }
  return await repository.generateHistoryJabatan(newHistoryJabatan, transaction)
}

module.exports = {
  getData
}