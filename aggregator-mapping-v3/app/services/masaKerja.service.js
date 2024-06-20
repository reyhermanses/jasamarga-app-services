const repository = require('../repositories/masaKerja.repository')
const employeeeRepository = require('../repositories/employee.repository')
const historyJabatan = require('../repositories/historyJabatan.repository')

const moment = require('moment')
moment.locale('id'); // default the locale to Indonesian
var localMoment = moment();

async function syncData() {
  const dataEmployee = await employeeeRepository.acquireSyncMasaKerja()
  const dataEmployeeJSON = JSON.parse(JSON.stringify(dataEmployee))
  // processData(dataEmployeeJSON)
  return dataEmployeeJSON
}

async function processData(dataEmployeeJSON) {
  console.log('start')
  for (obj of dataEmployeeJSON) {
    console.log(obj)
    var mapObj = {
      year: "tahun",
      years: "tahun",
      month: "bulan",
      months: "bulan",
      days: "hari",
      day: "hari",
      hours: "jam",
      hour: "jam"
    };

    // masa kerja grade
    const mkGrade = await historyJabatan.acquireGradePeriod(obj.id, obj.grade)
    if (mkGrade) {
      const mk = moment.preciseDiff(new moment(mkGrade.awal_posisi), moment().format("YYYY-MM-DD"))
      obj.mk_grade = mk.replaceAll(/years|year|months|month|days|day|hours|hour/gi, function (matched) {
        return mapObj[matched];
      });
    } else {
      const lastGrade = await historyJabatan.acquireFinalWorkPeriod(obj.id)
      if (lastGrade) {
        const mk = moment.preciseDiff(new moment(lastGrade.akhir_posisi), moment().format("YYYY-MM-DD"))
        obj.mk_grade = mk.replaceAll(/years|year|months|month|days|day|hours|hour/gi, function (matched) {
          return mapObj[matched];
        });
      } else {
        if (obj.date_of_entry != null) {
          const mk = moment.preciseDiff(new moment(obj.date_of_entry), moment().format("YYYY-MM-DD"))
          obj.mk_grade = mk.replaceAll(/years|year|months|month|days|day|hours|hour/gi, function (matched) {
            return mapObj[matched];
          });
        }
      }
    }

    // masa kerja unit
    const mkUnit = await historyJabatan.acquireUnitPeriod(obj.id, obj.unit.name)
    if (mkUnit) {
      const mk = moment.preciseDiff(new moment(mkUnit.awal_posisi), moment().format("YYYY-MM-DD"))
      obj.mk_unit = mk.replaceAll(/years|year|months|month|days|day|hours|hour/gi, function (matched) {
        return mapObj[matched];
      });
    } else {
      const lastUnit = await historyJabatan.acquireFinalWorkPeriod(obj.id)
      if (lastUnit) {
        const mk = moment.preciseDiff(new moment(lastUnit.akhir_posisi), moment().format("YYYY-MM-DD"))
        obj.mk_unit = mk.replaceAll(/years|year|months|month|days|day|hours|hour/gi, function (matched) {
          return mapObj[matched];
        });
      } else {
        if (obj.date_of_entry != null) {
          const mk = moment.preciseDiff(new moment(obj.date_of_entry), moment().format("YYYY-MM-DD"))
          obj.mk_unit = mk.replaceAll(/years|year|months|month|days|day|hours|hour/gi, function (matched) {
            return mapObj[matched];
          });
        }
      }
    }

    // masa kerja
    const masaKerja = await historyJabatan.acquireIntialWorkPeriod(obj.id)
    if (masaKerja) {
      const mk = moment.preciseDiff(new moment(masaKerja.awal_posisi), moment().format("YYYY-MM-DD"))
      obj.masa_kerja = mk.replaceAll(/years|year|months|month|days|day|hours|hour/gi, function (matched) {
        return mapObj[matched];
      });
    } else {
      const lastKerja = await historyJabatan.acquireFinalWorkPeriod(obj.id)
      if (lastKerja) {
        const mk = moment.preciseDiff(new moment(lastKerja.akhir_posisi), moment().format("YYYY-MM-DD"))
        obj.masa_kerja = mk.replaceAll(/years|year|months|month|days|day|hours|hour/gi, function (matched) {
          return mapObj[matched];
        });
      } else {
        if (obj.date_of_entry != null) {
          const mk = moment.preciseDiff(new moment(obj.date_of_entry), moment().format("YYYY-MM-DD"))
          obj.masa_kerja = mk.replaceAll(/years|year|months|month|days|day|hours|hour/gi, function (matched) {
            return mapObj[matched];
          });
        }
      }
    }

    // masa kerja jabatan
    if (obj.sk_position_date != null) {
      const mkJabatan = moment.preciseDiff(new moment(obj.sk_position_date), moment().format("YYYY-MM-DD"));
      obj.mk_jabatan = mkJabatan.replaceAll(/years|year|months|month|days|day|hours|hour/gi, function (matched) {
        return mapObj[matched];
      });
    }
    await repository.upsert({
      employee_id: obj.id,
      mk_jabatan: obj.sk_position_date != null ? obj.mk_jabatan : null,
      masa_kerja: obj.masa_kerja,
      mk_unit: obj.mk_unit,
      mk_grade: obj.mk_grade
    })
  }
  console.log('done')
  return dataEmployeeJSON
}

async function getAllData(req) {
  let filter = {}

  if (req.query.limit) {
    filter.limit = req.query.limit ? req.query.limit : 0
  } else {
    filter.limit = 20
  }

  if (req.query.page) {
    filter.offset = (req.query.page && req.query.page != 1) ? (req.query.page - 1) * filter.limit : 0
  }

  return await repository.acquireAllData(filter, req.query.employee_id)
}

module.exports = {
  syncData,
  getAllData
}