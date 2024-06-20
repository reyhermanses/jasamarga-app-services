const {
  EmployeeEducation,
  Employee,
  MasterCountry,
  MasterJenjangPendidikan,
  MasterJurusanPendidikan,
  MasterInstansiPendidikan,
  MasterGelarPendidikan,
  MasterFakultasPendidikan,
  sequelize,
} = require("../../models");
require("dotenv").config();
const {
  Op
} = require("sequelize");

async function acquireAllData(filter = {}, empId = null) {
  let filterAll = {
    attributes: {
      include: [
        [
          sequelize.col("jenjang_pendidikan.jenjang"),
          "ref_jenjang_pendidikan_text",
        ],
        [
          sequelize.col("jurusan_pendidikan.name"),
          "ref_jurusan_pendidikan_text",
        ],
        [sequelize.col("instansi_pendidikan.name"), "instansi_pendidikan_text"],
        [sequelize.col("gelar_pendidikan.name"), "gelar_pendidikan_text"],
        [sequelize.col("fakultas_pendidikan.name"), "fakultas_pendidikan_text"],
      ],
      exclude: ["created_at", "updated_at", "created_by", "updated_by"],
    },
    include: [{
      model: MasterJenjangPendidikan,
      as: "jenjang_pendidikan",
      attributes: [],
    },
    {
      model: MasterJurusanPendidikan,
      as: "jurusan_pendidikan",
      attributes: [],
    },
    {
      model: MasterInstansiPendidikan,
      as: "instansi_pendidikan",
      attributes: [],
    },
    {
      model: MasterFakultasPendidikan,
      as: "fakultas_pendidikan",
      attributes: [],
    },
    {
      model: MasterGelarPendidikan,
      as: "gelar_pendidikan",
      attributes: [],
    },
    ],
  };

  if (filter) {
    (filterAll.offset = filter.offset), (filterAll.limit = filter.limit);
  }

  if (empId) {
    filterAll.where = {
      employee_id: empId,
    };

    filterAll.order = [
      ["graduate_date", "ASC"]
    ];
  }

  const acquireData = await EmployeeEducation.findAndCountAll(filterAll);
  return acquireData;
}

async function acquireDataByEmployeeIdJenjangPendidikan(data) {
  return await EmployeeEducation.findOne({
    where: {
      employee_id: data.employee_id,
    },
    include: [{
      model: Employee,
      as: "employee_education",
      attributes: ["id", "name"],
    },
    {
      model: MasterJenjangPendidikan,
      as: "jenjang_pendidikan",
      attributes: ["id", "jenjang"],
      where: {
        id: data.ref_jenjang_pendidikan_id
      }
    },
    ],
  });
}

async function acquireById(id) {
  return await EmployeeEducation.findOne({
    where: {
      id: id,
    },
    include: [{
      model: Employee,
      as: "employee_education",
      attributes: ["id", "name"],
    },
    {
      model: MasterCountry,
      as: "country_education",
      attributes: ["id", "description"],
    },
    {
      model: MasterJenjangPendidikan,
      as: "jenjang_pendidikan",
      attributes: ["id", "jenjang"],
    },
    {
      model: MasterJurusanPendidikan,
      as: "jurusan_pendidikan",
      attributes: ["id", "name"],
    },
    {
      model: MasterInstansiPendidikan,
      as: "instansi_pendidikan",
      attributes: ["id", "name", "active"],
    },
    {
      model: MasterFakultasPendidikan,
      as: "fakultas_pendidikan",
      attributes: ["id", "name", "active"],
    },
    {
      model: MasterGelarPendidikan,
      as: "gelar_pendidikan",
      attributes: ["id", "name", "active"],
    },
    ],
  });
}

async function generate(data) {
  return await EmployeeEducation.create(data);
}

async function upsert(data) {
  return await EmployeeEducation.findOne({
    where: {
      [Op.and]: [{
        employee_id: data.employee_id,
      },
      {
        changedate: data.changedate,
      },
      {
        name: data.name,
      },
      ],
    },
  }).then((obj) => {
    if (obj) {
      data.updated_by = "cron-db";
      return obj.update(data);
    }
    return EmployeeEducation.create(data);
  });
}

async function upsertMasal(data) {
  return await EmployeeEducation.findOne({
    where: {
      [Op.and]: [{
        employee_id: data.employee_id,
      }],
    },
  }).then((obj) => {
    if (obj) {
      data.updated_by = "update-masal";
      return obj.update(data);
    }
    data.created_by = "create-masal";
    return EmployeeEducation.create(data);
  });
}

async function modernize(id, data) {
  return await EmployeeEducation.update(data, {
    where: {
      id: id,
    },
  });
}

async function updateByEmployeeId(id, data) {
  return await EmployeeEducation.update(data, {
    where: {
      employee_id: id,
    },
  });
}

async function acquireByEmployeeId(id) {
  return await EmployeeEducation.findOne({
    where: {
      employee_id: id,
    },
  });
}

async function acquireByEmployeePersonnel(personnelNumber) {
  return await Employee.findOne({
    where: {
      personnel_number: personnelNumber,
    },
  });
}

async function acquireByJenjangPendidikanId(id) {
  return await MasterJenjangPendidikan.findOne({
    where: {
      id: id,
    },
  });
}

async function acquireByJurusanPendidikanId(id) {
  return await MasterJurusanPendidikan.findOne({
    where: {
      id: id,
    },
  });
}

async function acquireByCountryId(id) {
  return await MasterCountry.findOne({
    where: {
      id: id,
    },
  });
}

async function remove(id) {
  return await EmployeeEducation.destroy({
    where: {
      id: id,
    },
  });
}

const massGenerate = async (data, employeeId, instansiName) => {
  if (data['Opsi'] === 'Tambah') {
    await EmployeeEducation.create({
      employee_id: employeeId,
      instansi_pendidikan_id: data['Instansi Pendidikan ID'],
      ref_jenjang_pendidikan_id: data['Jenjang Pendidikan ID'],
      name: instansiName,
      final_score: data['IPK'],
      ref_jurusan_pendidikan_id: data['Jurusan Pendidikan ID'],
      fakultas_pendidikan_id: data['Fakultas Pendidikan ID'],
      start_date: excelSerialNumberToDate(data['Tanggal Masuk']),
      graduate_date: excelSerialNumberToDate(data['Tanggal Kelulusan']),
      no_ijazah: data['Nomor Ijazah'],
      gelar_pendidikan_id: data['Gelar ID'],
      created_by: 'MASS_UPLOAD'
    })
  } else {
    const dataExist = await EmployeeEducation.findOne({ where: { employee_id: employeeId, ref_jenjang_pendidikan_id: data['Jenjang Pendidikan ID'] } })

    if (dataExist) {
      dataExist.instansi_pendidikan_id = data['Instansi Pendidikan ID']
      dataExist.ref_jenjang_pendidikan_id = data['Jenjang Pendidikan ID']
      dataExist.name = instansiName
      dataExist.final_score = data['IPK']
      dataExist.ref_jurusan_pendidikan_id = data['Jurusan Pendidikan ID']
      dataExist.fakultas_pendidikan_id = data['Fakultas Pendidikan ID']
      dataExist.start_date = excelSerialNumberToDate(data['Tanggal Masuk'])
      dataExist.graduate_date = excelSerialNumberToDate(data['Tanggal Kelulusan'])
      dataExist.no_ijazah = data['Nomor Ijazah']
      dataExist.gelar_pendidikan_id = data['Gelar ID']
      dataExist.updated_by = 'MASS_UPLOAD'
      await dataExist.save()
    }
  }

  return data
}

const excelSerialNumberToDate = (serialNumber) => {
  const excelStartDate = new Date(Date.UTC(1900, 0, 0));
  const excelDate = new Date(excelStartDate.getTime() + (serialNumber - 1) * 24 * 60 * 60 * 1000);

  const year = excelDate.getUTCFullYear();
  const month = excelDate.getUTCMonth() + 1;
  const day = excelDate.getUTCDate();

  return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
}

module.exports = {
  acquireAllData,
  acquireById,
  generate,
  acquireByEmployeeId,
  acquireByJenjangPendidikanId,
  acquireByJurusanPendidikanId,
  acquireByCountryId,
  modernize,
  remove,
  acquireByEmployeePersonnel,
  upsert,
  upsertMasal,
  updateByEmployeeId,
  acquireDataByEmployeeIdJenjangPendidikan,
  massGenerate
};