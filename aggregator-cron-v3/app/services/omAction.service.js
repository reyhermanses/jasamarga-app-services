const repository = require("../repositories/omAction.repository");
const documentService = require("../services/document.service");
const {
  upsert: upsertPendingRequest,
} = require("../repositories/pendingRequest.repository");
const {
  getData: acquireDataSAPApprover,
} = require("../services/approver.service");

const moment = require("moment");
const moment2 = require('moment-timezone');

// Fungsi untuk mengonversi tanggal ke zona waktu Jakarta
function convertToJakartaTime(userInputDate) {
  // Konversi tanggal ke zona waktu Jakarta
  const jakartaDate = moment.tz(userInputDate, "Asia/Jakarta").toDate();
  
  // Set the time to 07:00:00 while keeping the date in Jakarta timezone
  jakartaDate.setHours(7, 0, 0, 0);
  
  return jakartaDate;
}

const getData = async (req) => {
  // Ambil dengan dan tanpa req.query.changedate, jika tanpa req.query.changedate maka akan mengambil data kemarin
  let responseOmAction = await repository.acquireData(
    req.query.changedate ? req.query.changedate : null
  );
  if (responseOmAction.data.length != 0) {
    let responseFiltered = responseOmAction.data;

    // 1. CLEANSING DATA
    // a. bersihkan karakter mengganggu
    if (typeof responseFiltered == "string") {
      const removeBacklash = responseFiltered.replaceAll(/\\/g, "");
      responseFiltered = JSON.parse(removeBacklash);
    }

    // b. jika dipilih spesifik personnel number, ambil data terkait pers.number tsb saja dari data
    if (req.query.personnel_number) {
      const obj = responseFiltered.filter((row) => {
        return row.personnel_number == req.query.personnel_number;
      });

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

    // d. ambil end_date yang 99991231 saja
    const newUnique = uniqueArray.filter((obj) => {
      return obj.end_date == "99991231";
    });
    const dataDocument = await documentService.getData(
      req.query.changedate ? req.query.changedate : null
    );

    // cleansing data om_action 99999999 & 00000000
    const finalData = newUnique.map((obj) => {
      for (const key in obj) {
        if (
          obj[key] === "99999999" ||
          obj[key] === "00000000" ||
          obj[key] === ""
        ) {
          delete obj[key];
        }
      }
      return obj;
    });
    const data = await processCron(
      finalData,
      req.query.changedate,
      dataDocument
    );
    return data;
  } else {
    return [];
  }
};

const processCron = async (data, changedate, dataDocument) => {
  const processed = [];
  for (const item of data) {
    const today = moment();
    const document = dataDocument.filter((dataDocument) => {
      return dataDocument.personnel_number === item.personnel_number;
    });
    const action = item.action.toLowerCase();

    // cek tanggal sk
    const dataEmployee = await repository.acquireDatabase(
      item.personnel_number
    );
    if (document.length > 0) {
      const dateString = document[0].tanggal_efektif_sk;
      const date = moment(dateString, "DD.MM.YYYY");
      const pastOrToday = date.isSameOrBefore(today);

      if (!pastOrToday) {
        await upsertPendingRequest({
          ...item,
          ...document[0],
          personnel_number: item.personnel_number,
          period: date,
          employee_id: dataEmployee?.id,
        });
        continue;
      }
    }

    // cek job
    if (item.job_key) {
      await repository.upsertJob({ id: item.job_key, name: item.text_job_key });
    }

    // cek subgroup
    if (item.employee_subgroup) {
      await repository.upsertSubGroup({
        id: item.employee_subgroup,
        subgroup: item.text_employee_subgroup,
        master_employee_group_id: item.employee_group ?? undefined,
      });
    }

    // kosongkan posisi jika dia memimpin suatu organisasi
    if (
      dataEmployee &&
      (item.organisasi_key != dataEmployee.position[0].position_detail.org_id || item.action == 'Pensiun' || item.action == 'terminate')
    ) {
      await repository.modernizeLeaderOrganization(dataEmployee.id);
    }

    // klasifikasi berdasarkan action
    switch (action) {
      case "rotasi":
        processed.push(
          await processRotasiPromosi(
            item,
            document.length > 0 ? document[0] : null,
            action
          )
        );
        break;
      case "demosi":
        processed.push(
          await processRotasiPromosi(
            item,
            document.length > 0 ? document[0] : null,
            action
          )
        );
        break;
      case "istirahat panjang":
        processed.push(
          await processRotasiPromosi(
            item,
            document.length > 0 ? document[0] : null,
            action
          )
        );
        break;
      case "cuti sakit":
        processed.push(
          await processRotasiPromosi(
            item,
            document.length > 0 ? document[0] : null,
            action
          )
        );
        break;
      case "kembali dari cuti sakit":
        processed.push(
          await processRotasiPromosi(
            item,
            document.length > 0 ? document[0] : null,
            action
          )
        );
        break;
      case "promosi":
        processed.push(
          await processRotasiPromosi(
            item,
            document.length > 0 ? document[0] : null,
            action
          )
        );
        break;
      case "pensiun":
        processed.push(await processPensiunTerminate(item, changedate, action));
        break;
      case "terminate":
        processed.push(await processPensiunTerminate(item, changedate, action));
        break;
      case "initial data":
        processed.push(await processInitialData(item, document, action));
        break;
      default:
        break;
    }
  }
  return processed;
};

// PROSES KARYAWAN BARU ( INITIAL DATA )
const processInitialData = async (item, document, action) => {
  const data = await repository.acquireDatabase(item.personnel_number);
  const dataPosition = await repository.acquirePosition(item.position_key);
  const newNpp = await generateNewNPP(item.personnel_number);

  /*
    1. CEK DATA POSISI LALU UPDATE DATA TERBARU
    2. BUAT DATA BARU EMPLOYEE [JIKA BELUM ADA]
    3. HUBUNGKAN EMPLOYEE POSITION DENGAN MASTER_POSITION
    5. UPSERT AUTH
    */

  // jika posisi belum ditambahkan sebelumnya
  if (!dataPosition && document.length === 0) {
    await generateDataPosition(item, null);
  }

  if (!dataPosition && document.length > 0) {
    await generateDataPosition(item, document);
  }

  const dataSubGroup = await repository.acquireSubGroupByKey(
    item.employee_subgroup
  );

  // tambahkan data employee baru
  if (!data) {
    const dataEmployee = {
      name: item.name,
      employee_status: true,
      is_pusat: true,
      date_of_entry: moment(item.begin_date, "YYYYMMDD").format("YYYY-MM-DD"),
      start_date: moment(item.begin_date, "YYYYMMDD").format("YYYY-MM-DD"),
      company_id_asal: 1,
      employee_group_id: item.employee_group,
      employee_sub_group_id: dataSubGroup.id,
      created_by: "aggregator-cron-om-action",
    };
    const newEmployee = await repository.generateEmployee(dataEmployee);

    // hubungkan employee position -> master_position [BARU]
    await repository.upsertEmployeePosition({
      employee_id: newEmployee.id,
      npp: newNpp,
      personnel_number: item.personnel_number,
      position_id: item.position_key,
      cost_center: item.cost_center,
      is_main: true,
      action,
    });

    // update or insert data auth untuk keperluan login
    await repository.upsertAuth({
      employee_id: newEmployee.id,
      username: newNpp,
      is_ldap: true,
      default_password: false,
    });
  } else {
    // hubungkan employee position -> master_position [JIKA DATA KARYAWAN SUDAH ADA]
    await repository.upsertEmployeePosition({
      employee_id: data.id,
      npp: newNpp,
      personnel_number: item.personnel_number,
      position_id: item.position_key,
      cost_center: item.cost_center,
      is_main: true,
      action,
    });

    // update or insert data auth untuk keperluan login
    await repository.upsertAuth({
      employee_id: data.id,
      username: newNpp,
      is_ldap: true,
    });
  }

  return {
    employee_number: item.personnel_number,
    name: item.name,
    action: action,
    status: "success",
  };
};

// PROSES KARYAWAN PENSIUN
const processPensiunTerminate = async (item, changedate, action) => {
  const data = await repository.acquireDatabase(item.personnel_number);

  // 1. NON AKTIFKAN KARYAWAN
  // 2. BUAT HISTORY JABATAN
  // 3. HAPUS EMPLOYEE POSITION
  if (data) {
    await createDataHistoryJabatan(data, changedate, null, action);
    await repository.modernizeEmployee(data.id, {
      employee_status: false,
    });
    await repository.removeEmployeePosition(data.id);
  }

  return {
    employee_number: item.personnel_number,
    name: item.name,
    action: action,
    status: "success",
  };
};

// PROSES KARYAWAN ROTASI
const processRotasiPromosi = async (item, document, action) => {
  const data = await repository.acquireDatabase(item.personnel_number);
  const newNpp = await generateNewNPP(item.personnel_number);
  await generateDataPosition(item, document);
  // hubungkan employee position -> master_position
  await repository.upsertEmployeePosition({
    employee_id: data.id,
    npp: newNpp,
    personnel_number: item.personnel_number,
    position_id: item.position_key,
    cost_center: item.cost_center,
    is_main: true,
    action,
  });

  if (item.employee_group) {
    await repository.modernizeEmployee(data.id, {
      employee_group_id: item.employee_group,
    });
  }

  if (item.employee_subgroup) {
    await repository.modernizeEmployee(data.id, {
      employee_sub_group_id: item.employee_subgroup,
    });
  }

  // jika data document ada isinya
  if (document != null) {
    /*
    1. CEK DATA POSISI LALU UPDATE DATA TERBARU
    2. GENERATE HISTORY JABATAN (JIKA SK TIDAK SAMA)
    3. UPSERT AUTH
    */
    const skPositionNo = data.position[0].position_detail.sk_position_no;

    // kondisi jika harus generate history jabatan (sk_posiiton_number document != sk_position_number sekarang)
    if (document.doc_number !== skPositionNo) {
      await createDataHistoryJabatan(data, item.changedate, document, action);
    }

    // update or insert data auth untuk keperluan login
    await repository.upsertAuth({
      employee_id: data.id,
      username: newNpp,
      is_ldap: true,
    });

    return {
      employee_number: item.personnel_number,
      name: item.name,
      action: action,
      status: "success",
    };
  } else {
    return {
      employee_number: item.personnel_number,
      name: item.name,
      action: action,
      status: "success with no document provided",
    };
  }
};

const generateDataPosition = async (item, document) => {
  if (Array.isArray(document)) {
    document = document[0];
  }
  const dataDirektorat = item.unit_kerja
    ? await repository.acquireDirektorat(item.unit_kerja)
    : undefined;
  const splittedPosDate = document
    ? document.tanggal_efektif_sk.split(".")
    : null;
  let newPosition = {
    id: item.position_key,
    name: item.text_position_key ?? undefined,
    company_id: 1,
    unit_kerja_id: item.unit_kerja ?? undefined,
    departemen_id: item.departement ?? undefined,
    seksi_id: item.section ?? undefined,
    direktorat_id: dataDirektorat?.direktorat_id ?? undefined,
    job_id: item.job_key ?? undefined,
    fungsi_jabatan: item.employee_subgroup ?? undefined,
    personal_area_id: item.personal_area ?? undefined,
    personal_sub_area_id: item.personal_sub_area ?? undefined,
    grade: item.grade ?? undefined,
    level: item.subgrade ?? undefined,
    konversi: item.grade ?? undefined,
    kelompok_jabatan: item.kelompok_jabatan
      ? item.kelompok_jabatan == "14" || item.kelompok_jabatan == "21"
        ? "Operasional"
        : "Non Operasional"
      : undefined,
    org_id: item.organisasi_key ?? undefined,
    active: true,
  };

  if (document) {
    newPosition.sk_position_no = document?.doc_number;
    newPosition.sk_position_date = splittedPosDate
      ? moment(
          `${splittedPosDate[2]}${splittedPosDate[1]}${splittedPosDate[0]}`
        ).format("YYYY-MM-DD")
      : null;
    newPosition.start_date = splittedPosDate
      ? moment(
          `${splittedPosDate[2]}${splittedPosDate[1]}${splittedPosDate[0]}`
        ).format("YYYY-MM-DD")
      : null;
  }
  await repository.upsertPosition(newPosition.id, newPosition);
};

const createDataHistoryJabatan = async (
  dataEmployee,
  changedate,
  doc = null,
  action
) => {
  const newHistoryJabatan = {
    employee_id: dataEmployee?.id ?? null,
    angkatan: 1,
    posisi: dataEmployee?.position[0].position_detail.name ?? null,
    sk_posisi: dataEmployee?.position[0].position_detail.sk_position_no ?? null,
    awal_posisi:
      dataEmployee?.position[0].position_detail.sk_position_date ?? null,
    akhir_posisi:
      doc != null
        ? moment(doc.tanggal_efektif_sk, "DD.MM.YYYY").add(-1, "days")
        : changedate
        ? moment(changedate).format("YYYY-MM-DD")
        : moment().add(-1, "days").format("YYYY-MM-DD"),
    grade: dataEmployee?.position[0].position_detail.grade ?? null,
    level: dataEmployee?.position[0].position_detail.level ?? null,
    konversi: dataEmployee?.position[0].position_detail.konversi ?? null,
    unit: dataEmployee?.position[0].position_detail.unit_position?.name ?? null,
    kd_comp: dataEmployee?.position[0].position_detail.company_id ?? null,
    file_sk: dataEmployee?.position[0].position_detail.file_sk ?? null,
    sk_position_date:
      dataEmployee?.position[0].position_detail.sk_position_date ?? null,
    action: action,
    is_main: dataEmployee?.position[0].is_main,
    npp: dataEmployee?.position[0].npp,
    personnel_number: dataEmployee?.position[0].personnel_number,
    created_by: "aggregator-cron-om-action",
  };

  // convert to Indonesia timezone (GMT+07)
  const date1 = convertToJakartaTime(newHistoryJabatan.awal_posisi);
  const date2 = convertToJakartaTime(newHistoryJabatan.akhir_posisi);

  newHistoryJabatan.awal_posisi = date1;
  newHistoryJabatan.akhir_posisi = date2;
  newHistoryJabatan.sk_position_date = date1;

  await repository.generateHistoryJabatan(newHistoryJabatan);
};

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
  return newNpp;
};

module.exports = {
  getData,
  processCron,
};
