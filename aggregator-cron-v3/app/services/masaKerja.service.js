const repository = require("../repositories/masaKerja.repository");
const moment = require("moment");
moment.locale("id"); // default the locale to Indonesian
require("moment-precise-range-plugin");

const countMasaKerja = async (empId) => {
  const dataEmployee = await repository.acquireAllEmployee(empId);
  if (empId) {
    const data = await processData(JSON.parse(JSON.stringify(dataEmployee)));
    return data;
  } else {
    processData(JSON.parse(JSON.stringify(dataEmployee)));
    return dataEmployee;
  }
};

const processData = async (data) => {
  console.log("START");
  for (obj of data) {
    // ITERASI TIAP DATA
    const defaultMasaKerja = await countExistingPosition(obj.employee_id);

    // --------------- HITUNG MK GRADE ---------------
    const mkGrade = await repository.acquireGradePeriod(
      obj.employee_id,
      obj.konversi
    );
    let diffTimeGrade;

    if (mkGrade) {
      const awalPosisi = new Date(mkGrade.awal_posisi);
      diffTimeGrade = moment(moment()).diff(
        awalPosisi.getFullYear() == 9999 ? new Date() : new Date(awalPosisi)
      );
    } else {
      diffTimeGrade = defaultMasaKerja;
    }
    // CONCLUSION PERHITUNGAN MK GRADE
    const durationGrade = moment.duration(diffTimeGrade);
    obj.mk_grade = `${durationGrade.years()} tahun ${durationGrade.months()} bulan`;

    // --------------- HITUNG MK UNIT ---------------
    const mkUnit = await repository.acquireUnitPeriod(
      obj.employee_id,
      obj.unit_name
    );
    let diffTimeUnit;
    if (mkUnit) {
      const awalPosisi = new Date(mkUnit.awal_posisi);
      diffTimeUnit = moment(moment()).diff(
        awalPosisi.getFullYear() == 9999 ? new Date() : new Date(awalPosisi)
      );
    } else {
      diffTimeUnit = defaultMasaKerja;
    }

    // CONCLUSION PERHITUNGAN MK UNIT
    const durationUnit = moment.duration(diffTimeUnit);
    obj.mk_unit = `${durationUnit.years()} tahun ${durationUnit.months()} bulan`;

    //  --------------- HITUNG MK UTAMA  ---------------
    const masaKerja = await repository.acquireIntialWorkPeriod(obj.employee_id);
    let diffTimeMasaKerja;
    if (masaKerja && !obj.date_of_entry) {
      const awalPosisi = new Date(masaKerja.awal_posisi);
      diffTimeMasaKerja = moment(moment()).diff(
        awalPosisi.getFullYear() == 9999 ? new Date() : new Date(awalPosisi)
      );
    } else {
      const date_of_entry = moment(obj.date_of_entry).format('YYYY-MM-DD');
      diffTimeMasaKerja = moment(moment()).diff(new Date(date_of_entry));
    }

    // CONCLUSION PERHITUNGAN MK UTAMA
    const durationMasaKerja = moment.duration(diffTimeMasaKerja);
    obj.masa_kerja = `${durationMasaKerja.years()} tahun ${durationMasaKerja.months()} bulan`;

    //  --------------- HITUNG MK JABATAN ---------------
    let diffTimeJabatan;
    if (obj.sk_position_date != null) {
      const awalPosisi = new Date(obj.sk_position_date);
      diffTimeJabatan = moment(moment()).diff(
        awalPosisi.getFullYear() == 9999 ? new Date() : new Date(awalPosisi)
      );
    }

    // CONCLUSION PERHITUNGAN MK UTAMA
    const durationJabatan = moment.duration(diffTimeJabatan);
    obj.mk_jabatan = `${durationJabatan.years()} tahun ${durationJabatan.months()} bulan`;
    await repository.upsert({
      employee_id: obj.employee_id,
      mk_jabatan: obj.sk_position_date != null ? obj.mk_jabatan : null,
      masa_kerja: obj.masa_kerja,
      mk_unit: obj.mk_unit,
      mk_grade: obj.mk_grade,
    });
  }
  console.log("DONE");
  return data;
};

const countExistingPosition = async (empId) => {
  const lastWork = await repository.acquireLastWorkPeriod(empId);
  if (lastWork) {
    const akhirPosisi = new Date(lastWork.akhir_posisi);
    return moment(moment()).diff(
      akhirPosisi.getFullYear() == 9999
        ? new Date()
        : new Date(lastWork.akhir_posisi)
    );
  } else {
    if (obj.date_of_entry != null) {
      const dateOfEntry = new Date(obj.date_of_entry);
      return moment(moment()).diff(
        dateOfEntry.getFullYear() == 9999 ? new Date() : new Date(dateOfEntry)
      );
    }
  }
};

module.exports = {
  countMasaKerja,
};
