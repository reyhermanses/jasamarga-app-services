const repository = require("../repositories/employee.repository");
const repositoryemployee = require("../repositories/employee.repository");
const repositoryEmployeePosition = require("../repositories/employeePosition.repository");
const repositoryMasterPosition = require("../repositories/master/masterPosition.repository");
const repositoryEmployeeProfile = require("../repositories/profile.repository");
const repositoryEmployeeFamily = require("../repositories/family.repository");
const repositoryEmployeeEducation = require("../repositories/education.repository");
const repositoryMasterReligion = require("../repositories/master/masterReligion.repository");
const repositoryMasterEmployeeGroup = require("../repositories/master/masterEmployeeGroup.repository");
const repositoryMasterCompany = require("../repositories/master/masterCompany.repository");
const repositoryOrgFormation = require("../repositories/orgFormation.repository");
const repositoryOrgHierarchy = require("../repositories/organizationHierarchy.repository");
const repositoryMasterInstansiPendidikan = require("../repositories/master/masterInstansiPendidikan.repository");
const repositoryMasterJenjangPendidikan = require("../repositories/master/masterJenjangPendidikan.repository");
const repositoryMasterJurusanPendidikan = require("../repositories/master/masterJurusanPendidikan.repository");
const repositoryMasterFakultasPendidkan = require("../repositories/master/MasterFakultasPendidikan.repository");
const repositoryMasterGelarPendidikan = require("../repositories/master/MasterGelarPendidikan.repository");
const repositoryprovinsi = require("../repositories/master/masterProvince.repository");
const repositorycity = require("../repositories/master/masterCity.repository");
const repositorykecamatan = require("../repositories/master/masterKecamatan.repository");
const repositorykelurahan = require("../repositories/master/masterKelurahan.repository");
const {
  validateDataPendidikan,
  validateDataFamily,
} = require("../validation/employee/mass.validation");

//SERVICES

//validation
const paramsValidator = require("../validation/params.validation");

const serviceMobility = require("../services/mobility.service");

// const { acquireAllData : acquireDataCluster } = require('../repositories/master/masterCluster.repository')
// const { acquireAllData : acquireDataSubCluster } = require('../repositories/master/masterSubCluster.repository')
const { upsert: upsertAuth } = require("../repositories/auth/auth.repository");
const {
  acquireAllData: acquireDataJob,
} = require("../repositories/master/masterJob.repository");
const {
  acquireAllData: acquireDataPosition,
  acquireById: acquireByIDPosition,
  acquireByIdTest: acquireByIDPositionTest,
  modernize: modernizeMasterPosition,
} = require("../repositories/master/masterPosition.repository");
const {
  acquireAllData: acquireDataEmployeeGroup,
} = require("../repositories/master/masterEmployeeGroup.repository");
const {
  acquireAllData: acquireDataEmployeeSubGroup,
} = require("../repositories/master/masterEmployeeSubGroup.repository");
const {
  acquireAllData: acquireDataCompany,
  acquireById: acquireCompById,
} = require("../repositories/master/masterCompany.repository");
const {
  acquireAllData: acquireDataBusinessArea,
} = require("../repositories/master/masterBusinessArea.repository");
const {
  acquireByEmployeeId: acquireDataFile,
} = require("../repositories/file.repository");
const { getAllData: getAlternate } = require("./employeeV2.service");

const moment = require("moment");
const momentPrecise = require("moment-precise-range-plugin");
const fs = require("fs");
const XLSX = require("xlsx");
require("dotenv").config();
const bcrypt = require("bcrypt");

const { sequelize } = require("../../models");

const Redis = require("../../config/redis");

async function getAllData(req) {
  let filter = {};
  if (req.query.page)
    filter.offset =
      req.query.page && req.query.page != 1
        ? (req.query.page - 1) * req.query.limit
        : 0;

  if (req.query.limit) filter.limit = req.query.limit ? req.query.limit : 0;

  if (
    Object.keys(req.query).length == 1 &&
    Object.keys(req.query)[0] == "type" &&
    req.query.type == "tiny"
  ) {
    const { reply } = await Redis.get("employee:tiny");
    if (reply) {
      return JSON.parse(reply);
    } else {
      const data = await repository.acquireAllData(
        filter,
        req.query,
        req.query.type
      );
      Redis.set("employee:tiny", JSON.stringify(data));
      return data;
    }
  } else if (Object.keys(req.query).length == 0) {
    const { reply } = await Redis.get("employee");
    if (reply) {
      return JSON.parse(reply);
    } else {
      const data = await repository.acquireAllData(
        filter,
        req.query,
        req.query.type
      );
      Redis.set("employee", JSON.stringify(data));
      return data;
    }
  } else {
    return await repository.acquireAllData(filter, req.query, req.query.type);
  }
}

async function getTemplateExcelData(req) {
  // let dataCluster
  // let dataSubCluster
  let dataJob;
  let dataPosition;
  let dataEmployeeGroup;
  let dataEmployeeSubGroup;
  let dataCompany;
  let dataBusinessArea;
  let dataOrg;
  let dataPersonalArea;
  let dataPersonalSubArea;

  await Promise.all([
    // dataCluster = await acquireDataCluster(),
    // dataSubCluster = await acquireDataSubCluster(),
    (dataJob = await acquireDataJob()),
    (dataPosition = await acquireDataPosition()),
    (dataEmployeeGroup = await acquireDataEmployeeGroup()),
    (dataEmployeeSubGroup = await acquireDataEmployeeSubGroup()),
    (dataCompany = await acquireDataCompany()),
    (dataBusinessArea = await acquireDataBusinessArea()),
    (dataOrg = await acquireDataOrg()),
    (dataPersonalArea = await acquireDataPersonalArea()),
    (dataPersonalSubArea = await acquireDataPersonalSubArea()),
  ]);
  // const rowCluster = JSON.parse(JSON.stringify(dataCluster))
  // const rowSubCluster = JSON.parse(JSON.stringify(dataSubCluster))
  const rowJob = JSON.parse(JSON.stringify(dataJob));
  const rowPosition = JSON.parse(JSON.stringify(dataPosition));
  const rowEmployeeGroup = JSON.parse(JSON.stringify(dataEmployeeGroup));
  const rowEmployeeSubGroup = JSON.parse(JSON.stringify(dataEmployeeSubGroup));
  const rowCompany = JSON.parse(JSON.stringify(dataCompany));
  const rowBusinessArea = JSON.parse(JSON.stringify(dataBusinessArea));
  const rowOrg = JSON.parse(JSON.stringify(dataOrg));
  const rowPersonalArea = JSON.parse(JSON.stringify(dataPersonalArea));
  const rowPersonalSubArea = JSON.parse(JSON.stringify(dataPersonalSubArea));

  const workbook = XLSX.utils.book_new();
  // blank employee
  const workSheetEmployee = XLSX.utils.json_to_sheet([
    {
      name: "",
      npp: "",
      personnel_number: "",
      atasan_npp: "",
      atasan_company_id: "",
      atasan_position_id: "",
      new_npp: "",
      is_pusat: "",
      start_date: "",
      end_date: "",
      employee_status: "",
      grade: "",
      job_id: "",
      employee_group_id: "",
      employee_sub_group_id: "",
      sap_emp_status: "",
      company_id_asal: "",
      company_id_penugasan: "",
      business_area_id: "",
      unit_kerja_id: "",
      kelompok_jabatan: "",
      org_id: "",
      departement_id: "",
      section_id: "",
      direktorat_id: "",
      action: "",
      atasan_ap_npp: "",
      atasan_ap_company_id: "",
      atasan_ap_position_id: "",
      sk_position_no: "",
      sk_position_date: "",
      personal_area_id: "",
      personal_sub_area_id: "",
      cost_center: "",
      level: "",
      konversi: "",
      date_of_entry: "",
      is_rangkap_jabatan: "",
      is_penugasan: "",
      ket_ap: "",
      mk_jabatan: "",
      created_by: "",
      updated_by: "",
      // cluster_id: '',
      // sub_cluster_id: '',
      is_pensiunan_jm: "",
    },
  ]);
  XLSX.utils.book_append_sheet(workbook, workSheetEmployee, "employee");

  // cluster
  // const workSheetCluster = XLSX.utils.json_to_sheet(rowCluster);
  // XLSX.utils.book_append_sheet(workbook, workSheetCluster, "cluster");

  // sub cluster
  // const workSheetSubCluster = XLSX.utils.json_to_sheet(rowSubCluster);
  // XLSX.utils.book_append_sheet(workbook, workSheetSubCluster, "sub cluster");

  // job
  const workSheetJob = XLSX.utils.json_to_sheet(rowJob);
  XLSX.utils.book_append_sheet(workbook, workSheetJob, "job");

  // position
  const workSheetPosition = XLSX.utils.json_to_sheet(rowPosition);
  XLSX.utils.book_append_sheet(workbook, workSheetPosition, "position");

  // employee group
  const workSheetEmployeeGroup = XLSX.utils.json_to_sheet(rowEmployeeGroup);
  XLSX.utils.book_append_sheet(
    workbook,
    workSheetEmployeeGroup,
    "employee group"
  );

  // employee sub group
  const workSheetEmployeeSubGroup =
    XLSX.utils.json_to_sheet(rowEmployeeSubGroup);
  XLSX.utils.book_append_sheet(
    workbook,
    workSheetEmployeeSubGroup,
    "employee sub group"
  );

  // company
  const workSheetCompany = XLSX.utils.json_to_sheet(rowCompany);
  XLSX.utils.book_append_sheet(workbook, workSheetCompany, "company");

  // business area
  const workSheetBusinessArea = XLSX.utils.json_to_sheet(rowBusinessArea);
  XLSX.utils.book_append_sheet(
    workbook,
    workSheetBusinessArea,
    "business area"
  );

  // org
  const workSheetOrg = XLSX.utils.json_to_sheet(rowOrg);
  XLSX.utils.book_append_sheet(workbook, workSheetOrg, "organization");

  // personal area
  const workPersonalArea = XLSX.utils.json_to_sheet(rowPersonalArea);
  XLSX.utils.book_append_sheet(workbook, workPersonalArea, "personal area");

  // personal sub area
  const workPersonalSubArea = XLSX.utils.json_to_sheet(rowPersonalSubArea);
  XLSX.utils.book_append_sheet(
    workbook,
    workPersonalSubArea,
    "personal sub area"
  );

  /* create an XLSX file and try to save to Master Aggregator.xlsx */
  XLSX.writeFile(workbook, "Master Aggregator.xlsx", {
    compression: true,
  });

  return 1;
}

// GET ALL GROUP ORG
async function getDataByUnit(req) {
  let data = await getDataOrg(req, "unit_position", true);
  return data;
}

async function getDataByUnitLearning(req) {
  let data = await getDataOrgLearning(req, "unit_position", true);
  return data;
}

async function getDataByDepartement(req) {
  let data = await getDataOrg(req, "departemen_position", true);
  return data;
}

async function getDataByCompany(req) {
  let data = JSON.parse(
    JSON.stringify(
      await repository.groupByCompany(req.query.name, req.query.kd_comp)
    )
  );
  return data;
}

async function getOneDataByCompany(id) {
  return await repository.acquireByCompanyId(id);
}

async function getDataByOrganization(req) {
  let data = await getDataOrg(req, "org_position", false);
  return data;
}

async function getDataByDirektorat(req) {
  let data = await getDataOrg(req, "direktorat_position", true);
  return data;
}

// GET ONE GROUP ORG
async function getOneDataByDirektorat(req) {
  return await repository.acquireByOrganizationId(req.params.id, "direktorat");
}

async function getOneDataByUnit(req) {
  return await repository.acquireByOrganizationId(req.params.id, "unit");
}

async function getOneDataByUnitLearning(req) {
  return await repository.acquireByOrganizationIdLearning(
    req.params.id,
    "unit"
  );
}

async function getOneDataByDepartement(req) {
  return await repository.acquireByOrganizationId(req.params.id, "departement");
}

async function getOneDataByOrganization(req) {
  return await repository.acquireByOrganizationId(req.params.id, "org");
}

async function getDataOrg(req, relation, required) {
  let data = JSON.parse(
    JSON.stringify(
      await repository.groupByOrg(
        req.query.name,
        req.query.unit_kerja_id,
        relation,
        required
      )
    )
  );
  return data;
}

async function getDataOrgLearning(req, relation, required) {
  let data = JSON.parse(
    JSON.stringify(
      await repository.groupByOrgLearning(req.query.name, relation, required)
    )
  );
  return data;
}

async function getHistoryJabatanById(id) {
  const dataKaryawan = await repository.acquireById(id);

  let dataHistoryJabatan = JSON.parse(
    JSON.stringify(await repository.acquireHistoryJabatanById(id))
  );
  dataHistoryJabatan.map((obj) => {
    obj.awal_posisi = moment(obj.awal_posisi).format("Do MMMM YYYY");
    obj.akhir_posisi =
      (obj.action === "pensiun" && obj.akhir_posisi === null) ||
        (obj.action === "terminate" && obj.akhir_posisi === null)
        ? "Sekarang"
        : moment(obj.akhir_posisi).format("Do MMMM YYYY");
    obj.position_id = null;
    obj.file_sk =
      obj.file_sk &&
      `${process.env.HOST}/api/v1/file/download?filename=${obj.file_sk}`;
    obj.tanggal_sk =
      obj.tanggal_sk !== null
        ? moment(obj.tanggal_sk).format("Do MMMM YYYY")
        : obj.tanggal_sk;
    obj.update_redirect = `/api/v1/history_jabatan/jm_click/${obj.id}`;
    return obj;
  });

  for (obj of dataKaryawan.position) {
    const dataObjectKaryawan = {
      awal_posisi: moment(obj.dataValues.start_date_Position).format(
        "Do MMMM YYYY"
      ),
      akhir_posisi: "Sekarang",
      position_id: obj.position_detail?.id,
      konversi: obj.position_detail.konversi,
      grade: obj.position_detail.grade,
      posisi: obj.position_detail.name,
      unit: obj.position_detail.unit_position.name,
      sk_posisi: obj.dataValues.sk_position_no,
      tanggal_sk: moment(obj.dataValues.sk_position_date).format(
        "Do MMMM YYYY"
      ),
      company_name: obj.position_detail.company_position.name,
      file_sk:
        obj.position_detail.file_sk &&
        `${process.env.HOST}/api/v1/file/download?filename=${obj.position_detail.file_sk}`,
      is_main: obj.is_main,
      action: obj.action ? obj.action : null,
      update_redirect: `/api/v1/master/position/jm_click/${obj.position_detail.id}/${dataKaryawan.id}`,
      npp: obj.dataValues.npp,
    };
    dataHistoryJabatan.unshift(dataObjectKaryawan);
  }
  return dataHistoryJabatan;
}

async function getOneById(id) {
  // employee core data
  const data = await repository.acquireById(id);
  if (!data) {
    return data;
  }

  const dataJson = JSON.parse(JSON.stringify(data));

  // employee file
  const dataFile = await acquireDataFile(dataJson.id);
  const dataFileJson = JSON.parse(JSON.stringify(dataFile)).map((obj) => {
    obj.url = `${process.env.HOST}/api/v1/file?filename=${obj.url}`;
    return obj;
  });

  const dataKtp = dataFileJson.findIndex((obj) => {
    return obj.type == "attachment_ktp";
  });

  const dataKK = dataFileJson.findIndex((obj) => {
    return obj.type == "attachment_kk";
  });

  const dataNPWP = dataFileJson.findIndex((obj) => {
    return obj.type == "attachment_npwp";
  });

  const dataProfile = dataFileJson.findIndex((obj) => {
    return obj.type == "Profile";
  });

  const dataBukuNikah = dataFileJson.findIndex((obj) => {
    return obj.type == "attachment_buku_nikah";
  });

  const dataBukuBpjsKet = dataFileJson.findIndex((obj) => {
    return obj.type == "attachment_bpjs_ket";
  });

  const dataBukuBpjsKes = dataFileJson.findIndex((obj) => {
    return obj.type == "attachment_bpjs_kes";
  });

  const dataPensiun = dataFileJson.findIndex((obj) => {
    return obj.type == "attachment_dana_pensiun";
  });
  return {
    ...dataJson,
    attachment_ktp: dataKtp == -1 ? null : dataFileJson[dataKtp].url,
    attachment_kk: dataKK == -1 ? null : dataFileJson[dataKK].url,
    attachment_npwp: dataNPWP == -1 ? null : dataFileJson[dataNPWP].url,
    image_url: dataProfile == -1 ? null : dataFileJson[dataProfile].url,
    attachment_buku_nikah:
      dataBukuNikah == -1 ? null : dataFileJson[dataBukuNikah].url,
    attachment_bpjs_kes:
      dataBukuBpjsKes == -1 ? null : dataFileJson[dataBukuBpjsKes].url,
    attachment_bpjs_ket:
      dataBukuBpjsKet == -1 ? null : dataFileJson[dataBukuBpjsKet].url,
    attachment_dana_pensiun:
      dataPensiun == -1 ? null : dataFileJson[dataPensiun].url,
  };
}

async function getDataHierarchy(dataExisting, req) {
  let data = [];
  if (req.query.position == "atasan") {
    for (obj of dataExisting.position) {
      const dataAtasan = await repository.acquireBawahanPeers(
        "atasan",
        obj.atasan_id
      );
      const dataAtasanAp = await repository.acquireBawahanPeers(
        "atasan",
        obj.atasan_ap_id
      );
      data.push(dataAtasan);
      if (dataAtasanAp) {
        data.push(dataAtasanAp);
      }
    }
  } else if (req.query.position == "bawahan") {
    data = await repository.acquireBawahanPeers(null, dataExisting.id);
  } else if (req.query.position == "peers") {
    for (obj of dataExisting.position) {
      let searchDataPeers = JSON.parse(
        JSON.stringify(
          await repository.acquireBawahanPeers(
            null,
            obj.atasan_id ?? obj.atasan_ap_id
          )
        )
      );
      data = data.concat(searchDataPeers);
    }
  }
  return data;
}

async function createData(data, transaction) {
  const insertedData = await repository.generate(data, transaction);
  const dataPosition = await acquireByIDPosition(data.position_id);

  dataPosition.sk_position_date = data.sk_position_date;
  dataPosition.sk_position_no = data.sk_position_no;
  dataPosition.start_date = data.start_date;
  dataPosition.end_date = data.end_date;
  await dataPosition.save({ transaction });

  const dataOrgHierarchy = await repositoryOrgHierarchy.acquireByLeaderPosition(
    data.position_id
  );

  let atasanId = dataPosition.org_position.leader_id;
  let atasanPositionId = dataPosition.org_position.leader_position_id;

  if (dataOrgHierarchy) {
    dataOrgHierarchy.leader_id = insertedData.dataValues.id;
    dataOrgHierarchy.updated_by = data.created_by;
    await dataOrgHierarchy.save({ transaction });

    atasanId = dataOrgHierarchy.parent.leader_id;
    atasanPositionId = dataOrgHierarchy.parent.leader_position_id;
  }

  await repositoryEmployeePosition.generate(
    {
      employee_id: insertedData.dataValues.id,
      npp: data.npp,
      personnel_number: data.personnel_number,
      position_id: data.position_id,
      atasan_id: atasanId,
      atasan_position_id: atasanPositionId,
      action: "initial data",
      cost_center: data.cost_center ? data.cost_center : null,
      ket_ap: data.ket_ap ? data.ket_ap : null,
      created_by: data.created_by,
      is_main: true,
    },
    transaction
  );

  Redis.del("employee");
  Redis.del("employee:tiny");
  Redis.del("employee-alternate");
  getAllData({
    query: {},
  });
  getAllData({
    query: {
      type: "tiny",
    },
  });
  getAlternate({});

  const company = await acquireCompById(data.company_id_asal);

  const nppAP = data.username
    ? data.username
    : `${company.nm_singkatan}${data.npp}`;

  await upsertAuth(
    {
      employee_id: insertedData.id,
      username: data.is_pusat ? data.npp : nppAP,
      password: bcrypt.hashSync("Welcome123!", 12),
      is_ldap: data.is_pusat,
      default_password: false,
    },
    transaction
  );

  const dataFormation = await repositoryOrgFormation.acquireByIdentity(
    dataPosition.org_id,
    dataPosition.job_id
  );

  if (dataFormation && dataFormation.unprocess > 0) {
    dataFormation.unprocess--;
    await dataFormation.save({ transaction });
  }

  return insertedData;
}

async function createDataMasal(data, transaction) {
  const insertedData = await repository.generate(data, transaction);
  const dataPosition = await acquireByIDPosition(data.position_id);

  dataPosition.dataValues.sk_position_no = data.sk_position_no;
  dataPosition.dataValues.start_date = data.start_date;
  dataPosition.dataValues.end_date = data.end_date;

  await dataPosition.save({ transaction });

  const dataOrgHierarchy = await repositoryOrgHierarchy.acquireByLeaderPosition(
    data.position_id
  );

  let atasanId = dataPosition.dataValues.org_position.leader_id;
  let atasanPositionId = dataPosition.dataValues.org_position.leader_position_id;

  if (dataOrgHierarchy) {
    dataOrgHierarchy.leader_id = insertedData.dataValues.id;
    dataOrgHierarchy.updated_by = data.created_by;
    await dataOrgHierarchy.save({ transaction });

    atasanId = dataOrgHierarchy.parent.leader_id;
    atasanPositionId = dataOrgHierarchy.parent.leader_position_id;
  }

  await repositoryEmployeePosition.generate(
    {
      employee_id: insertedData.dataValues.id,
      npp: data.npp,
      personnel_number: data.personnel_number,
      position_id: data.position_id,
      atasan_id: atasanId,
      atasan_position_id: atasanPositionId,
      action: "initial data",
      cost_center: data.cost_center ? data.cost_center : null,
      ket_ap: data.ket_ap ? data.ket_ap : null,
      created_by: data.created_by,
      is_main: true,
    },
    transaction
  );

  // Redis.del("employee");
  // Redis.del("employee:tiny");
  // Redis.del("employee-alternate");
  // getAllData({
  //   query: {},
  // });
  // getAllData({
  //   query: {
  //     type: "tiny",
  //   },
  // });
  // getAlternate({});

  const company = await acquireCompById(data.company_id_asal);

  const nppAP = data.username
    ? data.username
    : `${company.nm_singkatan}${data.npp}`;

  await upsertAuth(
    {
      employee_id: insertedData.dataValues.id,
      username: data.is_pusat ? data.npp : nppAP,
      password: bcrypt.hashSync("Welcome123!", 12),
      is_ldap: data.is_pusat,
      default_password: false,
    },
    transaction
  );

  const dataFormation = await repositoryOrgFormation.acquireByIdentity(
    dataPosition.dataValues.org_id,
    dataPosition.dataValues.job_id
  );

  if (dataFormation && dataFormation.unprocess > 0) {
    dataFormation.unprocess--;
    await dataFormation.save({ transaction });
  }

  return insertedData;
}

async function createmasuploadtest(req, transaction) { }

async function createMassData(req) {
  let validationIdentity = [];
  let validationFamily = [];
  let allCollection = [];
  let dpcollection = [];
  let gdcollection = [];
  let dicollection = [];
  let dkcollection = [];
  let acollection = [];
  let ptcollection = [];
  const workbook = XLSX.read(req.file.buffer);
  for (let wkIndex = 0; wkIndex < workbook.SheetNames.length; wkIndex++) {
    if (workbook.SheetNames[wkIndex] === "Data Pekerjaan") {
      const df = XLSX.utils.sheet_to_json(
        workbook.Sheets[workbook.SheetNames[wkIndex]]
      );
      for (let i = 0; i < df.length; i++) {
        const transaction = await sequelize.transaction();
        try {
          dpcollection.push(await upsertDataPekerjaan(df[i], i, transaction));
          await transaction.commit();
        } catch (error) {
          await transaction.rollback();
          console.log(error);
        }
      }
      allCollection.push({ DataPekerjaan: dpcollection });
    }

    if (workbook.SheetNames[wkIndex] === "General Data") {
      const df = XLSX.utils.sheet_to_json(
        workbook.Sheets[workbook.SheetNames[wkIndex]]
      );
      for (let i = 0; i < df.length; i++) {
        gdcollection.push(await upsertGeneralData(df[i], i));
      }
      allCollection.push({ GeneralData: gdcollection });
    }

    if (workbook.SheetNames[wkIndex] === "Data Identitas") {
      const df = XLSX.utils.sheet_to_json(
        workbook.Sheets[workbook.SheetNames[wkIndex]]
      );
      for (let i = 0; i < df.length; i++) {
        dicollection.push(await upsertDataIdentitas(df[i], i));
      }
      allCollection.push({ DataIdentitas: dicollection });
    }

    if (workbook.SheetNames[wkIndex] === "Alamat") {
      const df = XLSX.utils.sheet_to_json(
        workbook.Sheets[workbook.SheetNames[wkIndex]]
      );
      for (let i = 0; i < df.length; i++) {
        acollection.push(await upsertAlamat(df[i], i));
      }
      allCollection.push({ Alamat: acollection });
    }

    if (workbook.SheetNames[wkIndex] === "Data Keluarga") {
      const df = XLSX.utils.sheet_to_json(
        workbook.Sheets[workbook.SheetNames[wkIndex]]
      );

      for (const [index, value] of df.entries()) {
        const validation = await validateDataFamily(value, index);
        dkcollection.push(validation);

        if (validation.error.length === 0) {
          await repositoryEmployeeFamily.generateMass(
            value,
            validation.employeeId
          );
        }
      }
      allCollection.push({ DataKeluarga: dkcollection });
    }

    if (workbook.SheetNames[wkIndex] === "Pendidikan Terakhir") {
      console.log('start pendidikan terakhir')
      const df = XLSX.utils.sheet_to_json(
        workbook.Sheets[workbook.SheetNames[wkIndex]]
      );
      for (const [index, value] of df.entries()) {
        console.log('start validate pend')
        const validation = await validateDataPendidikan(value, index);
        console.log('end validate pend')
        ptcollection.push(validation);
        if (validation.error.length === 0) {
          console.log(' start cek instansi')
          const instansi = await repositoryMasterInstansiPendidikan.acquireById(
            value["Instansi Pendidikan ID"]
          );
          console.log(' end cek instansi')
          console.log("pendidikan");
          await repositoryEmployeeEducation.massGenerate(
            value,
            validation.employeeId,
            instansi.name
          );
        }
        console.log(validation.error)
      }
      allCollection.push({ PendidikanTerakhir: ptcollection });
    }
  }

  // console.log(allCollection);

  return allCollection;
}

function ExcelDateToJSDate(serial) {
  var utc_days = Math.floor(serial - 25569);
  var utc_value = utc_days * 86400;
  var date_info = new Date(utc_value * 1000);

  var fractional_day = serial - Math.floor(serial) + 0.0000001;

  var total_seconds = Math.floor(86400 * fractional_day);

  var seconds = total_seconds % 60;

  total_seconds -= seconds;

  var hours = Math.floor(total_seconds / (60 * 60));
  var minutes = Math.floor(total_seconds / 60) % 60;

  return new Date(
    date_info.getFullYear(),
    date_info.getMonth(),
    date_info.getDate(),
    hours,
    minutes,
    seconds
  );
}

function excelSerialNumberToDate(serialNumber) {
  const secondsInDay = 24 * 60 * 60; // Number of seconds in a day
  const millisecondsInDay = secondsInDay * 1000; // Number of milliseconds in a day

  // Adjust the serial number to account for the difference between Excel's base date and JavaScript's base date
  const excelBaseDate = new Date("1899-12-30"); // Excel's base date (December 30, 1899)
  const excelSerialOffset = excelBaseDate.getTime(); // Convert Excel's base date to milliseconds
  const excelSerialAdjusted =
    serialNumber * millisecondsInDay + excelSerialOffset;

  // Create a new Date object using the adjusted serial number
  const date = new Date(excelSerialAdjusted);

  return date;
}

const validDataIsNumber = async (t) => {
  if (typeof t === "number") return true;
  else return false;
};
const validDataIsText = async (t) => {
  if (typeof t === "string") return true;
  else return false;
};
const validDataIsUndefined = async (t) => {
  if (typeof t === "undefined") return true;
  else return false;
};
const validDataIsDate = async (t) => {
  if (moment(t, "YYYY-MM-DD", true).isValid()) return true;
  else return false;
};
const validDataIs16Digit = async (t, kolom) => {
  let str = String(t);
  switch (kolom) {
    case "nik": {
      if (str.length === 16) return true;
      else return false;
    }
    case "rt/rw": {
      if (str.length === 3) return true;
      else return false;
    }
  }
};
const validDataFloating = async (t) => {
  const regex = /^[+-]?\d+(\.\d+)?$/;
  if (regex.test(t)) return true;
  else return false;
};

const validDataEmail = async (t) => {
  const regex = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;
  if (regex.test(t)) return true;
  else return false;
};

const upsertDataPekerjaan = async (s, i, transaction) => {
  let collection = {};
  let status = false;
  let rows = {};
  let collectionData = [];
  collection["NPP"] = s["NPP"];
  collection["Jabatan ID"] = s["Jabatan ID"];
  collection["Nama"] = s["Nama"];
  collection["KD Comp ID"] = s["KD Comp ID"];
  collection["No. SK Jabatan"] = s["No. SK Jabatan"];
  collection["Tanggal SK Jabatan"] = moment(
    excelSerialNumberToDate(s["Tanggal SK Jabatan"])
  ).format("YYYY-MM-DD");
  collection["Tanggal TMT"] = moment(
    excelSerialNumberToDate(s["Tanggal TMT"])
  ).format("YYYY-MM-DD");
  collection["Employee Group ID"] = s["Employee Group ID"];
  collection["Opsi"] = s["Opsi"];
  collection["Sheet Name"] = "Data Pekerjaan";

  let npp = {
    name: "Npp",
    value: String(s["NPP"]),
  };

  let jabatanId = {
    name: "Jabatan ID",
    value: s["Jabatan ID"],
  };

  let nama = {
    name: "Nama",
    value: String(s["Nama"]),
  };

  let kdCompId = {
    name: "KD Comp ID",
    value: s["KD Comp ID"],
  };

  let noSkJabatan = {
    name: "No. Sk Jabatan",
    value: s["No. SK Jabatan"],
  };

  let tanggalSkJabatan = {
    name: "Tanggal Sk Jabatan",
    value: moment(excelSerialNumberToDate(s["Tanggal SK Jabatan"])).format(
      "YYYY-MM-DD"
    ),
  };

  let tanggalTmt = {
    name: "Tanggal Tmt",
    value: moment(excelSerialNumberToDate(s["Tanggal TMT"])).format(
      "YYYY-MM-DD"
    ),
  };

  let empGroupId = {
    name: "Employee Group ID",
    value: s["Employee Group ID"],
  };

  const regex = /^[a-zA-Z ]+$/;

  const resNpp = await paramsValidator.mappingStringValidation(npp);
  if (Object.keys(resNpp).length > 0) {
    status = true;
    collectionData.push(resNpp);
  }

  if (npp.value === "undefined") {
    status = true;
    collectionData.push({
      name: npp.name,
      value: npp.value,
      status: false,
      keterangan: "Npp tidak boleh kosong",
    });
  }

  if (nama.value === "undefined") {
    status = true;
    collectionData.push({
      name: nama.name,
      value: nama.value,
      status: false,
      keterangan: "Nama tidak boleh kosong",
    });
  } else {
    if (!regex.test(nama.value)) {
      status = true;
      collectionData.push({
        name: nama.name,
        status: false,
        value: `${nama.value}`,
        keterangan: "Nama hanya diperbolehkan berupa huruf",
      });
    }
  }

  var resJabId = {};
  if (
    s["Opsi"] !== "Pensiun" &&
    s["Opsi"] !== "Terminate" &&
    s["Opsi"] !== "Ubah"
  ) {
    resJabId = await paramsValidator.mappingNumberValidation(jabatanId);
    if (Object.keys(resJabId).length > 0) {
      status = true;
      collectionData.push(resJabId);
    }
  }

  const resKdCompId = await paramsValidator.mappingNumberValidation(kdCompId);
  if (Object.keys(resKdCompId).length > 0) {
    status = true;
    collectionData.push(resKdCompId);
  }

  const resNoSkJab = await paramsValidator.mappingUndefinedValidation(
    noSkJabatan
  );
  if (Object.keys(resNoSkJab).length > 0) {
    status = true;
    collectionData.push(resNoSkJab);
  }

  const resTglJab = await paramsValidator.mappingDateValidation(
    tanggalSkJabatan
  );
  if (Object.keys(resTglJab).length > 0) {
    status = true;
    collectionData.push(resTglJab);
  }

  const resTglTmt = await paramsValidator.mappingDateValidation(tanggalTmt);
  if (Object.keys(resTglTmt).length > 0) {
    status = true;
    collectionData.push(resTglTmt);
  }

  const resEmpGroupId = await paramsValidator.mappingNumberValidation(
    empGroupId
  );
  if (Object.keys(resEmpGroupId).length > 0) {
    status = true;
    collectionData.push(resEmpGroupId);
  }

  if (
    s["Opsi"] !== "Terminate" &&
    s["Opsi"] !== "Pensiun" &&
    s["Opsi"] !== "Ubah"
  ) {
    if (Object.keys(resJabId).length === 0) {
      const responseIfJabExist = await paramsValidator.checkIfJabatanIdExist(
        jabatanId
      );
      if (Object.keys(responseIfJabExist).length > 0) {
        status = true;
        collectionData.push(responseIfJabExist);
      }
    }
  }

  //check jab id terdaftar di company
  if (
    s["Opsi"] !== "Pensiun" &&
    s["Opsi"] !== "Terminate" &&
    s["Opsi"] !== "Ubah"
  ) {
    if (
      Object.keys(resKdCompId).length === 0 &&
      Object.keys(resJabId).length === 0
    ) {
      const resJabIDEqualKdCompId =
        await paramsValidator.validationJabatanIDEqualKdCompID(
          jabatanId,
          kdCompId
        );
      if (Object.keys(resJabIDEqualKdCompId).length > 0) {
        status = true;
        collectionData.push(resJabIDEqualKdCompId);
      }
    }
  }

  if (
    (Object.keys(resNpp).length === 0 &&
      Object.keys(resKdCompId).length === 0 &&
      s["Opsi"] === "Ubah") ||
    s["Opsi"] === "Terminate" ||
    s["Opsi"] === "Promosi" ||
    s["Opsi"] === "Demosi" ||
    s["Opsi"] === "Promosi" ||
    s["Opsi"] === "Rotasi"
  ) {
    console.log("check npp kd kom exist atau tidak");
    const respawn = await paramsValidator.validationNppKdCompNotExist(
      npp,
      kdCompId
    );
    if (!respawn) {
      status = true;
      collectionData.push(respawn);
    }
  }

  if (noSkJabatan.value === undefined) {
    status = true;
    collectionData.push({
      name: noSkJabatan.name,
      value: "",
      status: false,
      Keterangan: "No Sk Jabatan tidak boleh kosong",
    });
  }

  //validation master relasi
  if (Object.keys(resKdCompId).length === 0) {
    const responseRelasiCompany =
      await paramsValidator.mappingMasterRelasiValidation(kdCompId, "company");
    if (Object.keys(responseRelasiCompany).length > 0) {
      status = true;
      collectionData.push(responseRelasiCompany);
    }
  }

  //validation master employee group
  if (Object.keys(resEmpGroupId).length === 0) {
    const responseRelasiEmp =
      await paramsValidator.mappingMasterRelasiValidation(
        empGroupId,
        "empGroupID"
      );
    if (Object.keys(responseRelasiEmp).length > 0) {
      status = true;
      collectionData.push(responseRelasiEmp);
    }
  }

  if (s["Opsi"] === undefined) {
    status = true;
    collectionData.push({
      name: "Opsi",
      value: s["Opsi"],
      status: false,
      Keterangan: "Opsi tidak boleh kosong",
    });
  }

  if (
    s["Opsi"] !== "Initial Data" &&
    s["Opsi"] !== "Ubah" &&
    s["Opsi"] !== "Rotasi" &&
    s["Opsi"] !== "Promosi" &&
    s["Opsi"] !== "Demosi" &&
    s["Opsi"] !== "Terminate" &&
    s["Opsi"] !== "Pensiun"
  ) {
    status = true;
    collectionData.push({
      name: "Opsi",
      value: s["Opsi"],
      status: false,
      Keterangan:
        "Opsi hanya diperbolehkan unntuk initial data, ubah, rotasi, promosi, demosi, terminate, pensiun",
    });
  }

  if (!status) {
    collection["NPP"] = s["NPP"];
    collection["Jabatan ID"] = s["Jabatan ID"];
    collection["Nama"] = s["Nama"];
    collection["KD Comp ID"] = s["KD Comp ID"];
    collection["No. SK Jabatan"] = s["No. SK Jabatan"];
    collection["Tanggal SK Jabatan"] = moment(
      excelSerialNumberToDate(s["Tanggal SK Jabatan"])
    ).format("YYYY-MM-DD");
    collection["Tanggal TMT"] = moment(
      excelSerialNumberToDate(s["Tanggal TMT"])
    ).format("YYYY-MM-DD");
    collection["Employee Group ID"] = s["Employee Group ID"];
    collection["Opsi"] = s["Opsi"];
    collection["Sheet Name"] = "Data Pekerjaan";

    if (s["Opsi"] === "Initial Data") {
      var createemployeemasal = {
        name: s["Nama"].toUpperCase(),
        npp: s["NPP"],
        is_pusat: false,
        employee_status: true,
        sk_position_no: collection["No. SK Jabatan"],
        sk_position_date: collection["Tanggal SK Jabatan"],
        start_date: collection["Tanggal TMT"],
        end_date: moment(Date.now()).format("YYYY-MM-DD"),
        position_id: collection["Jabatan ID"],
        company_id_asal: collection["KD Comp ID"],
        employee_group_id: collection["Employee Group ID"],
        date_of_entry: moment(Date.now()).format("YYYY-MM-DD"),
        // konversi:
        created_by: "mass-upload",
      };

      // validationNppJabatanIDExist
      if (
        Object.keys(resNpp).length === 0 &&
        Object.keys(resKdCompId).length === 0
      ) {
        const resNppKdCompExist =
          await paramsValidator.validationNppKdCompExist(npp, kdCompId);
        if (Object.keys(resNppKdCompExist).length > 0) {
          status = true;
          collectionData.push(resNppKdCompExist);
        }
      }
      if (!status) {
        await createDataMasal(createemployeemasal);
      }
    } else if (s["Opsi"] === "Ubah") {
      const responseemployee = await repositoryemployee.acquireDataByNppKDComp(
        s["NPP"],
        s["KD Comp ID"]
      );
      if (
        Object.keys(resNpp).length === 0 &&
        Object.keys(resKdCompId).length === 0
      ) {
        const resNppKdcompNotExist =
          await paramsValidator.validationNppKdCompNotExist(npp, kdCompId);
        if (Object.keys(resNppKdcompNotExist).length > 0) {
          status = true;
          collectionData.push(resNppKdcompNotExist);
        }
      }
      if (!status) {
        var employee_id = responseemployee.id;
        var updateemployeemasal = {
          name: s["Nama"].toUpperCase(),
          company_id_asal: s["KD Comp ID"],
          employee_group_id: s["Employee Group ID"],
          is_pusat: false,
          employee_status: true,
          updated_by: "update-masal",
        };

        if (s["Jabatan ID"] !== undefined) {
          if (
            Object.keys(resKdCompId).length === 0 &&
            Object.keys(resJabId).length === 0
          ) {
            const resJabIDEqualKdCompId =
              await paramsValidator.validationJabatanIDEqualKdCompID(
                jabatanId,
                kdCompId
              );
            if (Object.keys(resJabIDEqualKdCompId).length > 0) {
              status = true;
              collectionData.push(resJabIDEqualKdCompId);
            }
          }

          if (!status) {
            const responsecreateemployeemasal = await repository.modernize(
              employee_id,
              updateemployeemasal
            );

            if (responsecreateemployeemasal) {
              var updateemployeepositionmasal = {
                position_id: s["Jabatan ID"],
                action: s["Opsi"],
                updated_by: "mass-upload",
              };

              const responseemployeepositionmasal =
                await repositoryEmployeePosition.updateMasalByEmployeeId(
                  employee_id,
                  updateemployeepositionmasal
                );
              if (responseemployeepositionmasal) {
                var paramsUpdateMasterPosition = {
                  sk_position_no: s["No. SK Jabatan"],
                  sk_position_date: moment(
                    excelSerialNumberToDate(s["Tanggal SK Jabatan"])
                  ).format("YYYY-MM-DD"),
                  start_date: moment(
                    excelSerialNumberToDate(s["Tanggal TMT"])
                  ).format("YYYY-MM-DD"),
                  updated_by: "mass-upload",
                };
                await repositoryMasterPosition.updateMasalByPositionId(
                  s["Jabatan ID"],
                  paramsUpdateMasterPosition
                );
              }
            }
          }
          // }
        } else {
          const repositoEmployeePosition =
            await repositoryEmployeePosition.acquireByNppIsMain(npp.value);
          let employeeId = repositoEmployeePosition.dataValues.employee_id;
          let masterPositionId =
            repositoEmployeePosition.dataValues.position_id;
          let updated_by = "upload-masal";

          const updateDataEmp = {
            name: s["Nama"].toUpperCase(),
            company_id_asal: kdCompId.value,
            employee_group_id: empGroupId.value,
            start_date: tanggalTmt.value,
            updated_by: updated_by,
            is_pusat: false,
            employee_status: true,
            updated_by: updated_by,
          };

          const updateDataEmpPos = {
            npp: npp.value,
            action: s["Opsi"],
            updated_by: updated_by,
          };

          const updateDataMasPos = {
            sk_position_no: noSkJabatan.value,
            sk_position_date: tanggalSkJabatan.value,
            start_date: tanggalTmt.value,
            updated_by: updated_by,
          };

          await repository.modernize(employeeId, updateDataEmp);

          await repositoryEmployeePosition.updateMasalByEmployeeId(
            employeeId,
            updateDataEmpPos
          );

          await repositoryMasterPosition.updateMasalByPositionId(
            masterPositionId,
            updateDataMasPos
          );
        }
      }
    } else if (s["Opsi"] === "Rotasi") {
      const responseemployee = await repositoryemployee.acquireDataByNppKDComp(
        s["NPP"],
        s["KD Comp ID"]
      );
      if (
        Object.keys(resNpp).length === 0 &&
        Object.keys(resKdCompId).length === 0
      ) {
        const resNppKdcompNotExist =
          await paramsValidator.validationNppKdCompNotExist(npp, kdCompId);
        if (Object.keys(resNppKdcompNotExist).length > 0) {
          status = true;
          collectionData.push(resNppKdcompNotExist);
        }
      }
      if (!status) {
        var generateMobility = {
          employee_id: responseemployee.id,
          no_sk: s["No. SK Jabatan"],
          tanggal_sk: moment(
            excelSerialNumberToDate(s["Tanggal SK Jabatan"])
          ).format("YYYY-MM-DD"),
          start_date: moment(excelSerialNumberToDate(s["Tanggal TMT"])).format(
            "YYYY-MM-DD"
          ),
          position_id: parseInt(s["Jabatan ID"]),
        };
        var responseservicemobility =
          await serviceMobility.generatePromosiRotasiDemosiData(
            generateMobility,
            "JM_CLICK",
            "rotasi",
            transaction
          );
        if (responseservicemobility) {
          status = false;
        } else {
          status = true;
          collectionData.push({
            Status: "Gagal",
            Keterangan: `Rotasi karyawan gagal`,
          });
        }
      }
    } else if (s["Opsi"] === "Promosi") {
      const responseemployee = await repositoryemployee.acquireDataByNppKDComp(
        s["NPP"],
        s["KD Comp ID"]
      );
      if (
        Object.keys(resNpp).length === 0 &&
        Object.keys(resKdCompId).length === 0
      ) {
        const resNppKdcompNotExist =
          await paramsValidator.validationNppKdCompNotExist(npp, kdCompId);
        if (Object.keys(resNppKdcompNotExist).length > 0) {
          status = true;
          collectionData.push(resNppKdcompNotExist);
        }
      }
      if (!status) {
        var generateMobility = {
          employee_id: responseemployee.id,
          no_sk: s["No. SK Jabatan"],
          tanggal_sk: moment(
            excelSerialNumberToDate(s["Tanggal SK Jabatan"])
          ).format("YYYY-MM-DD"),
          start_date: moment(excelSerialNumberToDate(s["Tanggal TMT"])).format(
            "YYYY-MM-DD"
          ),
          position_id: parseInt(s["Jabatan ID"]),
        };
        var responseservicemobility =
          await serviceMobility.generatePromosiRotasiDemosiData(
            generateMobility,
            "JM_CLICK",
            "promosi",
            transaction
          );
        if (responseservicemobility) {
          status = false;
        } else {
          status = true;
          collectionData.push({
            Status: "Gagal",
            Keterangan: `Promosi karyawan gagal`,
          });
        }
      }
    } else if (s["Opsi"] === "Demosi") {
      const responseemployee = await repositoryemployee.acquireDataByNppKDComp(
        s["NPP"],
        s["KD Comp ID"]
      );
      if (
        Object.keys(resNpp).length === 0 &&
        Object.keys(resKdCompId).length === 0
      ) {
        const resNppKdcompNotExist =
          await paramsValidator.validationNppKdCompNotExist(npp, kdCompId);
        if (Object.keys(resNppKdcompNotExist).length > 0) {
          status = true;
          collectionData.push(resNppKdcompNotExist);
        }
      }
      if (!status) {
        var generateMobility = {
          employee_id: responseemployee.id,
          no_sk: s["No. SK Jabatan"],
          tanggal_sk: moment(
            excelSerialNumberToDate(s["Tanggal SK Jabatan"])
          ).format("YYYY-MM-DD"),
          start_date: moment(excelSerialNumberToDate(s["Tanggal TMT"])).format(
            "YYYY-MM-DD"
          ),
          position_id: parseInt(s["Jabatan ID"]),
        };
        var responseservicemobility =
          await serviceMobility.generatePromosiRotasiDemosiData(
            generateMobility,
            "JM_CLICK",
            "demosi",
            transaction
          );
        if (responseservicemobility) {
          collectionData["Status"] = "Sukses";
          collectionData["Keterangan"] = `Demosi karyawan berhasil`;
        } else {
          collectionData["Status"] = "Gagal";
          collectionData["Keterangan"] = `Demosi karyawan gagal`;
        }
      }
    } else if (s["Opsi"] === "Pensiun") {
      const responseemployee = await repositoryemployee.acquireDataByNppKDComp(
        s["NPP"],
        s["KD Comp ID"]
      );
      if (
        Object.keys(resNpp).length === 0 &&
        Object.keys(resKdCompId).length === 0
      ) {
        const resNppKdcompNotExist =
          await paramsValidator.validationNppKdCompNotExist(npp, kdCompId);
        if (Object.keys(resNppKdcompNotExist).length > 0) {
          status = true;
          collectionData.push(resNppKdcompNotExist);
        }
      }
      if (!status) {
        var generateMobility = {
          employee_id: responseemployee.id,
          no_sk: s["No. SK Jabatan"],
          tanggal_sk: moment(
            excelSerialNumberToDate(s["Tanggal SK Jabatan"])
          ).format("YYYY-MM-DD"),
          jenis: "-",
          end_date: moment(Date.now()).format("YYYY-MM-DD"),
        };
        var responseservicemobility =
          await serviceMobility.generatePensiunTerminateData(
            generateMobility,
            "JM_CLICK",
            "pensiun",
            transaction
          );
        if (responseservicemobility) {
          collectionData["Status"] = "Sukses";
          collectionData["Keterangan"] = `Pensiun karyawan berhasil`;
        } else {
          collectionData["Status"] = "Gagal";
          collectionData["Keterangan"] = `Pensiun karyawan gagal`;
        }
      }
    } else if (s["Opsi"] === "Terminate") {
      const responseemployee = await repositoryemployee.acquireDataByNppKDComp(
        s["NPP"],
        s["KD Comp ID"]
      );
      if (
        Object.keys(resNpp).length === 0 &&
        Object.keys(resKdCompId).length === 0
      ) {
        const resNppKdcompNotExist =
          await paramsValidator.validationNppKdCompNotExist(npp, kdCompId);
        if (Object.keys(resNppKdcompNotExist).length > 0) {
          status = true;
          collectionData.push(resNppKdcompNotExist);
        }
      }
      if (!status) {
        var generateMobility = {
          employee_id: responseemployee.id,
          no_sk: s["No. SK Jabatan"],
          tanggal_sk: moment(
            excelSerialNumberToDate(s["Tanggal SK Jabatan"])
          ).format("YYYY-MM-DD"),
          jenis: "-",
          end_date: moment(Date.now()).format("YYYY-MM-DD"),
        };
        var responseservicemobility =
          await serviceMobility.generatePensiunTerminateData(
            generateMobility,
            "JM_CLICK",
            "terminate",
            transaction
          );
        if (responseservicemobility) {
          collectionData["Status"] = "Sukses";
          collectionData["Keterangan"] = `Terminate karyawan berhasil`;
        } else {
          collectionData["Status"] = "Gagal";
          collectionData["Keterangan"] = `Terminate karyawahn gagal`;
        }
      }
    }
  }

  console.log("data pekerjaan");

  return {
    number_rows: i + 1,
    error: collectionData,
    npp: s["NPP"],
    kd_comp: s["KD Comp ID"],
    jabatan_id: s["Jabatan ID"],
    nama: nama.value !== "undefined" ? nama.value.toLocaleUpperCase() : "",
    noSkJabatan: s["No. SK Jabatan"],
    tanggalSkJabatan: tanggalSkJabatan.value,
    tanggalTmt: tanggalTmt.value,
    employeeGroupId: s["Employee Group ID"],
    opsi: s["Opsi"],
    sheetName: "Data Pekerjaan",
    keterangan: `${!status ? `Success` : `Failure`}`,
  };
};

const upsertGeneralData = async (s, i) => {
  let collection = {};
  let collectionData = [];
  let status = false;

  let npp = {
    name: "NPP",
    value: String(s["NPP"]),
  };

  let kdCompId = {
    name: "KD Comp ID",
    value: s["KD Comp ID"],
  };

  let tempatLahir = {
    name: "Tempat Lahir",
    value: String(s["Tempat Lahir"]),
  };

  let tanggalLahir = {
    name: "Tanggal Lahir",
    value: moment(excelSerialNumberToDate(s["Tanggal Lahir"])).format(
      "YYYY-MM-DD"
    ),
  };

  let golonganDarah = {
    name: "Golongan Darah",
    value: s["Golongan Darah"] ? String(s["Golongan Darah"]) : undefined,
  };

  let jenisKelamin = {
    name: "Jenis Kelamin",
    value: String(s["Jenis Kelamin"]),
  };

  let agamaId = {
    name: "Agama ID",
    value: s["Agama ID"],
  };

  let tinggiBadan = {
    name: "Tinggi Badan (cm)",
    value: s["Tinggi Badan (cm)"],
  };

  let beratBadan = {
    name: "Berat Badan (kg)",
    value: s["Berat Badan (kg)"],
  };

  let gender = {
    name: "Gender",
    value: s["Jenis Kelamin"] === "Perempuan" ? false : true,
  };

  let noHp = {
    name: "No. Handphone",
    value: s["No. Handphone"],
  };

  let email = {
    name: "Email",
    value: String(s["Email"]).toLowerCase(),
  };

  let statusNikah = {
    name: "Status Pernikahan",
    value: String(s["Status Pernikahan"]),
  };

  let noKtp = {
    name: "No KTP",
    value: String(s["No KTP"]),
    isRequired: false,
    isLength: 16,
  };

  let maritalStatus = {
    name: "Marital Status",
    value: s["Status Pernikahan"],
  };

  let fb = {
    name: "Facebook",
    value: String(s["Facebook"]),
  };

  let twitter = {
    name: "Twitter",
    value: String(s["Twitter"]),
  };

  let insta = {
    name: "Instagram",
    value: String(s["Instagram"]),
  };

  if (s["Opsi"] === undefined) {
    status = true;
    collectionData.push({
      name: "Opsi",
      value: s["Opsi"],
      status: false,
      Keterangan: "Opsi tidak boleh kosong",
    });
  }

  if (
    s["Opsi"] !== "Tambah" &&
    s["Opsi"] !== "Ubah" &&
    s["Opsi"] !== undefined
  ) {
    status = true;
    collectionData.push({
      name: "Opsi",
      value: s["Opsi"],
      status: false,
      Keterangan: "Opsi hanya diperbolehkan unntuk tambah dan ubah",
    });
  }

  if (
    statusNikah.value !== "Nikah" &&
    statusNikah.value !== "Lajang" &&
    statusNikah.value !== "Duda" &&
    statusNikah.value !== "Janda"
  ) {
    status = true;
    collectionData.push({
      name: statusNikah.name,
      value: statusNikah.value,
      status: false,
      Keterangan:
        "Status lajang hanya diperbolehkan untuk Nikah, Lajang, Duda, Janda",
    });
  }

  var numeric = /[^0-9]/;
  if (numeric.test(noHp.value)) {
    status = true;
    collectionData.push({
      name: noHp.name,
      value: typeof noHp.value,
      status: false,
      Keterangan: `No telepon harus berupa angka`,
    });
  }

  var regEmail = /\S+@\S+\.\S+/;

  if (!regEmail.test(email.value)) {
    status = true;
    collectionData.push({
      name: email.name,
      value: typeof email.value,
      status: false,
      Keterangan: `Email harus berformat email`,
    });
  }

  const resNpp = await paramsValidator.mappingValidationRequired(npp);
  if (Object.keys(resNpp).length > 0) {
    status = true;
    collectionData.push(resNpp);
  }

  if (golonganDarah.value) {
    const resGolDarah = await paramsValidator.mappingStringValidation(
      golonganDarah
    );
    if (Object.keys(resGolDarah).length > 0) {
      status = true;
      collectionData.push(resGolDarah);
    }

    if (
      golonganDarah.value !== "A" &&
      golonganDarah.value !== "B" &&
      golonganDarah.value !== "AB" &&
      golonganDarah.value !== "O"
    ) {
      status = false;
      collectionData.push({
        name: golonganDarah.name,
        value: golonganDarah.value,
        status: false,
        Keterangan: `Golongan darah harus A, B, AB dan O `,
      });
    }
  } else {
    golonganDarah.value = "";
  }

  if (
    jenisKelamin.value !== "Laki-Laki" &&
    jenisKelamin.value !== "Perempuan"
  ) {
    collectionData.push({
      name: jenisKelamin.name,
      value: jenisKelamin.value,
      status: false,
      Keterangan: `Jenis kelamin harus Laki-Laki atau Perempuan`,
    });
  }

  if (npp.value === "undefined") {
    status = true;
    collectionData.push({
      name: npp.name,
      value: npp.value,
      status: false,
      Keterangan: `${npp.name} tidak boleh kosong`,
    });
  }

  const resKdCompId = await paramsValidator.mappingNumberValidation(kdCompId);
  if (Object.keys(resKdCompId).length > 0) {
    status = true;
    collectionData.push(resKdCompId);
  }

  const regexString = /^[a-zA-Z ]+$/;

  let isTempatLahirEmpty = false;

  if (tempatLahir.value === "undefined") {
    isTempatLahirEmpty = true;
    status = true;
    collectionData.push({
      name: tempatLahir.name,
      value: tempatLahir.value,
      status: false,
      Keterangan: `${tempatLahir.name} tidak boleh kosong`,
    });
  } else if (!regexString.test(tempatLahir.value)) {
    status = true;
    collectionData.push({
      name: tempatLahir.name,
      value: tempatLahir.value,
      status: false,
      Keterangan: `${tempatLahir.name} harus berupa huruf`,
    });
  }

  // const resTempatLahir = await paramsValidator.checkedRequiredUndefinedString(
  //   tempatLahir
  // );
  // if (Object.keys(resTempatLahir).length > 0) {
  //   status = true;
  //   collectionData.push(resTempatLahir);
  // }

  const resTanggalLahir = await paramsValidator.mappingDateValidation(
    tanggalLahir
  );
  if (Object.keys(resTanggalLahir).length > 0) {
    status = true;
    collectionData.push(resTanggalLahir);
  }

  const resJK = await paramsValidator.mappingValidationRequired(jenisKelamin);
  if (Object.keys(resJK).length > 0) {
    status = true;
    collectionData.push(resJK);
  }

  const resAgama = await paramsValidator.mappingNumberValidation(agamaId);
  if (Object.keys(resAgama).length > 0) {
    status = true;
    collectionData.push(resAgama);
  }

  if (tinggiBadan.value) {
    const resTinggiBadan = await paramsValidator.mappingNumberValidation(
      tinggiBadan
    );
    if (Object.keys(resTinggiBadan).length > 0) {
      status = true;
      collectionData.push(resTinggiBadan);
    }
  }

  if (beratBadan.value) {
    const resBB = await paramsValidator.mappingNumberValidation(beratBadan);
    if (Object.keys(resBB).length > 0) {
      status = true;
      collectionData.push(resBB);
    }
  }

  // if (!tinggiBadan) {
  //   const resTinggiBadan = await paramsValidator.mappingNumberValidation(
  //     tinggiBadan
  //   );
  //   if (Object.keys(resTinggiBadan).length > 0) {
  //     status = true;
  //     collectionData.push(resTinggiBadan);
  //   }
  // }

  // const resBB = await paramsValidator.mappingNumberValidation(beratBadan);
  // if (Object.keys(resBB).length > 0) {
  //   status = true;
  //   collectionData.push(resBB);
  // }

  // const resEmail = await paramsValidator.mappingEmailValidation(email);
  // if (Object.keys(resEmail).length > 0) {
  //   status = true;
  //   collectionData.push(resEmail);
  // }

  const resStatNikah = await paramsValidator.mappingStringValidation(
    statusNikah
  );
  if (Object.keys(resStatNikah).length > 0) {
    status = true;
    collectionData.push(resStatNikah);
  }

  const resLengthNoKtp = await paramsValidator.mappingLengthDigitValidation(
    noKtp
  );
  if (Object.keys(resLengthNoKtp).length > 0) {
    status = true;
    collectionData.push(resLengthNoKtp);
  }

  const res4rearNoKtp = await paramsValidator.mapping4rearDigitsValidation(
    noKtp
  );
  if (Object.keys(res4rearNoKtp).length > 0) {
    status = true;
    collectionData.push(res4rearNoKtp);
  }

  if (numeric.test(noKtp.value)) {
    status = true;
    collectionData.push({
      name: noKtp.name,
      value: noKtp.value,
      status: false,
      Keterangan: `${noKtp.name} harus berupa angka`,
    });
  }

  if (s["Opsi"] !== "Ubah") {
    if (
      Object.keys(resLengthNoKtp).length === 0 &&
      Object.keys(res4rearNoKtp).length === 0
    ) {
      const resExistingKtp = await paramsValidator.checkExistingKtp(noKtp);

      if (Object.keys(resExistingKtp).length > 0) {
        status = true;
        collectionData.push(resExistingKtp);
      }
    }
  }

  if (Object.keys(resKdCompId).length === 0) {
    const resCompany = await paramsValidator.mappingMasterRelasiValidation(
      kdCompId,
      "company"
    );

    if (Object.keys(resCompany).length > 0) {
      status = true;
      collectionData.push(resCompany);
    }
  }

  let dataAgama;

  if (Object.keys(resAgama).length === 0) {
    const resAgama = await paramsValidator.mappingMasterRelasiValidation(
      agamaId,
      "religionNotExist"
    );

    if (Object.keys(resAgama).length > 0) {
      status = true;
      collectionData.push(resAgama);
    } else {
      dataAgama = await paramsValidator.getAgama(agamaId);
    }
  }

  if (
    Object.keys(resNpp).length === 0 &&
    Object.keys(resKdCompId).length === 0
  ) {
    const resCompany = await paramsValidator.validationNppKdCompNotExist(
      npp,
      kdCompId
    );
    if (Object.keys(resCompany).length > 0) {
      status = true;
      collectionData.push(resCompany);
    }
  }

  let regexUsername = /(?:\w+:)?\/\/[^\/]+([^?#]+)/;

  if (regexUsername.test(fb.value)) {
    status = true;
    collectionData.push({
      name: fb.name,
      value: fb.value,
      status: false,
      Keterangan: `Username ${fb.value} tidak valid`,
    });
  }

  if (regexUsername.test(twitter.value)) {
    status = true;
    collectionData.push({
      name: twitter.name,
      value: twitter.value,
      status: false,
      Keterangan: `Username ${twitter.value} tidak valid`,
    });
  }

  if (regexUsername.test(insta.value)) {
    status = true;
    collectionData.push({
      name: insta.name,
      value: insta.value,
      status: false,
      Keterangan: `Username ${insta.value} tidak valid`,
    });
  }

  if (!status) {
    const responseemployeeposition =
      await repositoryemployee.acquireDataByNppKDComp(
        npp.value,
        kdCompId.value
      );
    if (s["Opsi"] === "Tambah") {
      const checkedProfileExist =
        await paramsValidator.mappingMasterRelasiValidation(
          {
            name: "NPP",
            value: responseemployeeposition.id,
          },
          "empProfileExist"
        );
      if (Object.keys(checkedProfileExist).length > 0) {
        status = true;
        collectionData.push({
          name: npp.name,
          status: false,
          value: npp.value,
          keterangan: `Npp ${npp.value} sudah terdaftar di employee profile`,
        });
      }

      if (!status) {
        var upsertemployeeprofilemasal = {
          employee_id: responseemployeeposition.id,
          place_of_birth: tempatLahir.value,
          date_of_birth: tanggalLahir.value,
          blood_type: golonganDarah.value,
          gender: gender.value,
          religion_id: agamaId.value,
          height: tinggiBadan.value,
          weight: beratBadan.value,
          telephone_no: String(noHp.value),
          email_perusahaan: email.value,
          marital_status: maritalStatus.value,
          national_identifier: noKtp.value,
          facebook: (await validDataIsUndefined(fb.value))
            ? ""
            : `https://www.facebook.com/${s["Facebook"]}`,
          twitter: (await validDataIsUndefined(twitter.value))
            ? ""
            : `https://www.twitter.com/${s["Twitter"]}`,
          instagram: (await validDataIsUndefined(insta.value))
            ? ""
            : `https://www.instagram.com/${s["Instagram"]}`,
          created_by: "mass-upload",
        };

        let responseemployeeprofile = await repositoryEmployeeProfile.generate(
          upsertemployeeprofilemasal
        );
        if (responseemployeeprofile) {
          collection["Status"] = "Sukses";
          collection["Keterangan"] = `General data berhasil dibuat`;
        } else {
          collection["Status"] = "Gagal";
          collection[
            "Keterangan"
          ] = `General data gagal dibuat, cek kembali row data`;
        }
      }
    } else if (s["Opsi"] === "Ubah") {
      const checkedProfileExist =
        await paramsValidator.mappingMasterRelasiValidation(
          {
            name: "NPP",
            value: responseemployeeposition.id,
          },
          "empProfileNotExist"
        );
      if (Object.keys(checkedProfileExist).length > 0) {
        status = true;
        collectionData.push(checkedProfileExist);
      }

      const getEmpData = await paramsValidator.getEmployeeByNppKdComp(
        npp.value,
        kdCompId.value
      );

      const isMarried = await paramsValidator.isMarried(getEmpData.id);

      if (maritalStatus.value == "Lajang") {
        status = true;
        if (isMarried.marital_status != maritalStatus.value) {
          collectionData.push({
            name: maritalStatus.name,
            value: maritalStatus.value,
            status: false,
            Keterangan: `${npp.value} marital status ${isMarried.marital_status} tidak bisa dirubah ke ${maritalStatus.value}`,
          });
        }
      }

      if (!status) {
        var employee_id = responseemployeeposition.id;
        var upsertemployeeprofilemasal = {
          place_of_birth: tempatLahir.value,
          date_of_birth: tanggalLahir.value,
          blood_type: golonganDarah.value,
          gender: gender.value,
          religion_id: agamaId.value,
          height: tinggiBadan.value,
          weight: beratBadan.value,
          telephone_no: String(noHp.value),
          email_perusahaan: email.value,
          marital_status: maritalStatus.value,
          national_identifier: noKtp.value,
          facebook: (await validDataIsUndefined(fb.value))
            ? ""
            : `https://www.facebook.com/${s["Facebook"]}`,
          twitter: (await validDataIsUndefined(twitter.value))
            ? ""
            : `https://www.twitter.com/${s["Twitter"]}`,
          instagram: (await validDataIsUndefined(insta.value))
            ? ""
            : `https://www.instagram.com/${s["Instagram"]}`,
          created_by: "mass-upload",
        };
        await repositoryEmployeeProfile.updateMasalByEmployeeId(
          employee_id,
          upsertemployeeprofilemasal
        );
      }
    } else {
      collection["Keterangan"] = "Tidak ada opsi";
    }
  }

  console.log("General Data");

  return {
    number_rows: i + 1,
    error: collectionData,
    npp: s["NPP"],
    kdCompId: s["KD Comp ID"],
    tempatLahir: s["Tempat Lahir"],
    tanggalLahir: s["Tanggal Lahir"],
    golonganDarah: golonganDarah.value,
    jenisKelamin: s["Jenis Kelamin"],
    agamaId: s["Agama Id"],
    agama: dataAgama == null ? "" : dataAgama.religion,
    tinggiBadan: s["Tinggi Badan (cm)"],
    beratBadan: s["Berat Badan"],
    noHandphone: s["No. Handphone"],
    email: s["Email"],
    statusPernikahan: s["Status Pernikahan"],
    noKtp: s["No KTP"],
    facebook: s["Facebook"],
    twitter: s["Twitter"],
    instagram: s["Instagram"],
    sheetName: "General Data",
    opsi: s["Opsi"],
    keterangan: `${!status ? `Success` : `Failure`}`,
  };
};

const upsertDataIdentitas = async (s, i) => {
  let status = false;
  let collectionData = [];
  let collection = {};
  collection["NPP"] = s["NPP"];
  collection["KD Comp ID"] = s["KD Comp ID"];
  collection["No. Kartu Keluarga"] = parseInt(s["No. Kartu Keluarga"]);
  collection["NPWP"] = parseInt(s["NPWP"]);
  collection["No. BPJS Ketenagakerjaan"] = parseInt(
    s["No. BPJS Ketenagakerjaan"]
  );
  collection["No. BPJS Kesehatan"] = parseInt(s["No. BPJS Kesehatan"]);
  collection["Dana Pensiun"] = parseInt(s["Dana Pensiun"]);
  collection["Sheet Name"] = "Data Identitas";
  collection["Opsti"] = "Ubah";

  let npp = {
    name: "NPP",
    value: String(s["NPP"]),
  };

  let kdCompId = {
    name: "KD Comp ID",
    value: await paramsValidator.convertUndifinedToString(s["KD Comp ID"]),
  };

  let noKartuKeluarga = {
    name: "No. Kartu Keluarga",
    value: await paramsValidator.convertUndifinedToString(
      s["No. Kartu Keluarga"]
    ),
    isLength: 16,
  };

  let npwp = {
    name: "NPWP",
    value: await paramsValidator.convertUndifinedToString(s["NPWP"]),
  };

  let noBpjsKetenagakerjaan = {
    name: "No. BPJS Ketenagakerjaan",
    value: await paramsValidator.convertUndifinedToString(
      s["No. BPJS Ketenagakerjaan"]
    ),
  };

  let noBpjsKesehatan = {
    name: "No. BPJS Kesehatan",
    value: await paramsValidator.convertUndifinedToString(
      s["No. BPJS Kesehatan"]
    ),
  };

  let danaPensiun = {
    name: "Dana Pensiun",
    value: await paramsValidator.convertUndifinedToString(s["Dana Pensiun"]),
  };

  let regexPattern = /^\d+$/;

  const resCheckedNpp = await paramsValidator.checkedRequiredUndefinedString(
    npp
  );
  if (Object.keys(resCheckedNpp).length > 0) {
    status = true;
    collectionData.push(resCheckedNpp);
  }

  if (npwp.value === undefined) {
    status = true;
    collectionData.push({
      name: npwp.name,
      value: npwp.value,
      status: false,
      keterangan: "NPWP tidak boleh kosong",
    });
  } else if (!regexPattern.test(npwp.value)) {
    status = true;
    collectionData.push({
      name: npwp.name,
      value: npwp.value,
      status: false,
      keterangan: "NPWP harus berupa angka",
    });
  }

  const resCheckedBpjsKet = await paramsValidator.mappingValidationRequired(
    noBpjsKesehatan
  );
  if (Object.keys(resCheckedBpjsKet).length > 0) {
    status = true;
    collectionData.push(resCheckedBpjsKet);
  }

  //regex angka

  const resCheckedBpjsKes = await paramsValidator.mappingValidationRequired(
    noBpjsKesehatan
  );
  if (Object.keys(resCheckedBpjsKes).length > 0) {
    status = true;
    collectionData.push(resCheckedBpjsKes);
  }

  const resCheckedKk = await paramsValidator.mappingValidationRequired(
    noKartuKeluarga
  );
  if (Object.keys(resCheckedKk).length > 0) {
    status = true;
    collectionData.push(resCheckedKk);
  }

  if (!regexPattern.test(noBpjsKesehatan.value)) {
    status = true;
    collectionData.push({
      name: noBpjsKesehatan.name,
      value: noBpjsKesehatan.value,
      status: false,
      keterangan: "No Bpjs Kesehatan harus berupa angka",
    });
  }

  if (!regexPattern.test(noBpjsKetenagakerjaan.value)) {
    status = true;
    collectionData.push({
      name: noBpjsKetenagakerjaan.name,
      value: noBpjsKetenagakerjaan.value,
      status: false,
      keterangan: "No Bpjs Ketenagakerjaan harus berupa angka",
    });
  }

  if (!regexPattern.test(noKartuKeluarga.value)) {
    status = true;
    collectionData.push({
      name: noKartuKeluarga.name,
      value: noKartuKeluarga.value,
      status: false,
      keterangan: "No Kartu Keluarga harus berupa angka",
    });
  }

  const resCheckedKdCompRequired =
    await paramsValidator.mappingValidationRequired(kdCompId);
  if (Object.keys(resCheckedKdCompRequired).length > 0) {
    status = true;
    collectionData.push(resCheckedKdCompRequired);
  }

  const resCheckedKdCompDigit = await paramsValidator.mappingNumberValidation(
    kdCompId
  );
  if (Object.keys(resCheckedKdCompDigit).length > 0) {
    status = true;
    collectionData.push(resCheckedKdCompDigit);
  }

  if (
    Object.keys(resCheckedKdCompRequired).length === 0 &&
    Object.keys(resCheckedKdCompDigit).length === 0
  ) {
    const resCheckedComp = await paramsValidator.mappingMasterRelasiValidation(
      kdCompId,
      "company"
    );

    if (Object.keys(resCheckedComp).length > 0) {
      status = true;
      collectionData.push(resCheckedComp);
    }
  }

  const resChecked16DigitKK =
    await paramsValidator.mappingLengthDigitValidation(noKartuKeluarga);

  if (Object.keys(resChecked16DigitKK).length > 0) {
    status = true;
    collectionData.push(resChecked16DigitKK);
  }

  const resChecked4RearKK = await paramsValidator.mapping4rearDigitsValidation(
    noKartuKeluarga
  );

  if (Object.keys(resChecked4RearKK).length > 0) {
    status = true;
    collectionData.push(resChecked4RearKK);
  }

  //check jika data identitas sudah kebentuk
  if (
    Object.keys(resCheckedNpp).length === 0 &&
    Object.keys(resCheckedKdCompRequired).length === 0 &&
    Object.keys(resCheckedKdCompDigit).length === 0
  ) {
    const resNppCompExist = await paramsValidator.validationNppKdCompNotExist(
      npp,
      kdCompId
    );
    if (Object.keys(resNppCompExist).length > 0) {
      status = true;
      collectionData.push(resNppCompExist);
    }
  }

  if (!status) {
    const responseemployeeposition =
      await repositoryemployee.acquireDataByNppKDComp(
        s["NPP"],
        s["KD Comp ID"]
      );

    const checkedProfileExist =
      await paramsValidator.mappingMasterRelasiValidation(
        {
          name: "Empmloyee ID",
          value: responseemployeeposition.id,
        },
        "empProfileNotExist"
      );
    if (Object.keys(checkedProfileExist).length > 0) {
      status = true;
      collectionData.push(checkedProfileExist);
    }
    if (!status) {
      employee_id = responseemployeeposition.id;
      var upsertemployeeprofilemasal = {
        no_kk: noKartuKeluarga.value,
        npwp: npwp.value,
        bpjs_ket_no: noBpjsKetenagakerjaan.value,
        bpjs_kes_no: noBpjsKesehatan.value,
        no_dana_pension: danaPensiun.value,
        updated_by: "mass-upload",
      };
      await repositoryEmployeeProfile.updateMasalByEmployeeId(
        employee_id,
        upsertemployeeprofilemasal
      );
    }
  }

  console.log("upsertDataIdentitas");

  return {
    number_rows: i + 1,
    error: collectionData,
    npp: npp.value,
    kdCompId: kdCompId.value,
    noKartuKeluarga: noKartuKeluarga.value,
    npwp: npwp.value,
    noBpjsKetenagakerjaan: noBpjsKetenagakerjaan.value,
    noBpjsKesehatan: noBpjsKesehatan["Jenis Kelamin"],
    dataPensiun: danaPensiun.value,
    sheetName: "Data Identitas",
    opsi: s["Opsi"],
    keterangan: `${!status ? `Success` : `Failure`}`,
  };
};

async function upsertDataKeluarga(s, i) {
  let status = false;
  let collectionData = [];
  let collection = {};
  collection["NPP"] = s["NPP"];
  collection["KD Comp ID"] = s["KD Comp ID"];
  collection["Nama Keluarga"] = s["Nama Keluarga"];
  collection["Status Keluarga I"] = s["Status Keluarga ID"];
  collection["No KTP"] = parseInt(s["No KTP"]);
  collection["Tempat Lahir"] = s["Tempat Lahir"];
  collection["Tanggal Lahir"] = moment(
    excelSerialNumberToDate(s["Tanggal Lahir"])
  ).format("YYYY-MM-DD");
  collection["Jenis Kelamin"] = s["Jenis Kelamin"];
  collection["Status Anak ke Berapa"] = parseInt(s["Status Anak ke Berapa"]);
  collection["Opsi"] = s["Opsi"];
  collection["Sheet Name"] = "Data Alamat";

  let npp = {
    name: "NPP",
    value: s["NPP"],
  };

  let kdCompId = {
    name: "KD Comp ID",
    value: s["KD Comp ID"],
  };

  let namaKeluarga = {
    name: "Nama Keluarga",
    value: await paramsValidator.convertUndifinedToString(s["Nama Keluarga"]),
  };

  let statusKeluargaId = {
    name: "Status Keluarga ID",
    value: await paramsValidator.convertUndifinedToString(
      s["Status Keluarga ID"]
    ),
  };

  let noKtp = {
    name: "No KTP",
    value: await paramsValidator.convertUndifinedToString(s["No KTP"]),
  };

  let tempatLahir = {
    name: "Tempat Lahir",
    value: await paramsValidator.convertUndifinedToString(s["Tempat Lahir"]),
  };

  let tanggalLahir = {
    name: "Tanggal Lahir",
    value: await paramsValidator.convertUndifinedToString(s["Tanggal Lahir"]),
  };

  let jenisKelamin = {
    name: "Jenis Kelamin",
    value: await paramsValidator.convertUndifinedToString(s["Jenis Kelamin"]),
  };

  let statusAnakKeBerapa = {
    name: "Status Anak ke Berapa",
    value: await paramsValidator.convertUndifinedToString(
      s["Status Anak ke Berapa"]
    ),
  };

  const checkedNppRequired = await paramsValidator.mappingValidationRequired(
    npp
  );
  if (Object.keys(checkedNppRequired).length > 0) {
    status = true;
    collectionData.push(checkedNppRequired);
  }

  if (npp.value === "undefined") {
    status = true;
    collectionData.push({
      Status: "Failure",
      Keterangan: "Npp tidak boleh kosong",
    });
  }

  return {
    number_rows: i + 1,
    error: collectionData,
    npp: npp.value,
    kdCompId: kdCompId.value,
    namaKeluarga: namaKeluarga.value,
    statusKeluargaId: statusKeluargaId.value,
    noKtp: noKtp.value,
    tempatLahir: tempatLahir.value,
    tanggalLahir: tanggalLahir.value,
    jenisKelamin: jenisKelamin.value,
    statusAnakKeBerapa: statusAnakKeBerapa.value,
    sheetName: "Data Keluarga",
    opsi: s["Opsi"],
    keterangan: `${!status ? `Success` : `Failure`}`,
  };
}

const upsertAlamat = async (s, i) => {
  let status = false;
  let collectionData = [];
  let collection = [];

  let npp = {
    name: "NPP",
    value: String(s["NPP"]),
  };

  let kdCompId = {
    name: "KD Comp ID",
    value: await paramsValidator.convertUndifinedToString(s["KD Comp ID"]),
  };

  let alamatKtp = {
    name: "Alamat KTP",
    value: await paramsValidator.convertUndifinedToString(s["Alamat KTP"]),
  };

  let rtKtp = {
    name: "RT KTP",
    value: await paramsValidator.convertUndifinedToString(s["RT KTP"]),
  };

  let rwKtp = {
    name: "RW KTP",
    value: await paramsValidator.convertUndifinedToString(s["RW KTP"]),
  };

  let provinsiKtpId = {
    name: "Provinsi KTP ID",
    value: await paramsValidator.convertUndifinedToString(s["Provinsi KTP ID"]),
  };

  let kabupatenKtpId = {
    name: "Kota/Kabupaten KTP ID",
    value: await paramsValidator.convertUndifinedToString(
      s["Kota/Kabupaten KTP ID"]
    ),
  };

  let kecamatanKtpId = {
    name: "Kecamatan KTP ID",
    value: await paramsValidator.convertUndifinedToString(
      s["Kecamatan KTP ID"]
    ),
  };

  let kelurahanKtpId = {
    name: "Desa/Kelurahan KTP ID",
    value: await paramsValidator.convertUndifinedToString(
      s["Desa/Kelurahan KTP ID"]
    ),
  };

  let kodePostKtp = {
    name: "Kode Pos KTP",
    value: await paramsValidator.convertUndifinedToString(s["Kode Pos KTP"]),
    isLength: 5,
  };

  let alamatDomisili = {
    name: "Alamat Domisili",
    value: await paramsValidator.convertUndifinedToString(s["Alamat Domisili"]),
  };

  let rtDomisili = {
    name: "RT Domisili",
    value: await paramsValidator.convertUndifinedToString(s["RT Domisili"]),
  };

  let rwDomisili = {
    name: "RW Domisili",
    value: await paramsValidator.convertUndifinedToString(s["RW Domisili"]),
  };

  let provinsiDomisiliId = {
    name: "Provinsi Domisili ID",
    value: await paramsValidator.convertUndifinedToString(
      s["Provinsi Domisili ID"]
    ),
  };

  let kabupatenDomisiliId = {
    name: "Kota/Kabupaten Domisili ID",
    value: await paramsValidator.convertUndifinedToString(
      s["Kota/Kabupaten Domisili ID"]
    ),
  };

  let kecamatanDomisiliId = {
    name: "Kecamatan Domisili ID",
    value: await paramsValidator.convertUndifinedToString(
      s["Kecamatan Domisili ID"]
    ),
  };

  let kelurahanDomisiliId = {
    name: "Desa/Kelurahan Domisili ID",
    value: await paramsValidator.convertUndifinedToString(
      s["Desa/Kelurahan Domisili ID"]
    ),
  };

  let kodePosDomisili = {
    name: "Kode Pos Domisili",
    value: await paramsValidator.convertUndifinedToString(
      s["Kode Pos Domisili"]
    ),
    isLength: 5,
  };

  //checked all might not to be empty
  const checkedNppRequired =
    await paramsValidator.checkedRequiredUndefinedString(npp);
  const checkedKdCompIDRequired =
    await paramsValidator.mappingValidationRequiredUndifined(kdCompId);
  const checkedProvinsiKtpIdRequired =
    await paramsValidator.mappingValidationRequiredUndifined(provinsiKtpId);
  const checkedKabupatenIdRequired =
    await paramsValidator.mappingValidationRequiredUndifined(kabupatenKtpId);
  const checkedKecamatanKtpIdRequired =
    await paramsValidator.mappingValidationRequiredUndifined(kecamatanKtpId);
  const checkedKelurahanKtpIdRequired =
    await paramsValidator.mappingValidationRequiredUndifined(kelurahanKtpId);
  const checkedProvinsiDomisiliIdRequired =
    await paramsValidator.mappingValidationRequiredUndifined(
      provinsiDomisiliId
    );
  const checkedKabupatenDomisiliRequired =
    await paramsValidator.mappingValidationRequiredUndifined(
      kabupatenDomisiliId
    );
  const checkedKelurahanDomisiliRequired =
    await paramsValidator.mappingValidationRequiredUndifined(
      kelurahanDomisiliId
    );
  const checkedKodePostRequired =
    await paramsValidator.mappingValidationRequiredUndifined(kodePosDomisili);

  const checkedKodePostKtpRequired =
    await paramsValidator.mappingValidationRequiredUndifined(kodePostKtp);
  const checkedRtDomisiliRequired =
    await paramsValidator.mappingValidationRequiredUndifined(rtDomisili);
  const checkedRwDomisiliRequired =
    await paramsValidator.mappingValidationRequiredUndifined(rwDomisili);
  const checkedKodePosDomisiliRequired =
    await paramsValidator.mappingValidationRequiredUndifined(kodePosDomisili);
  const checkedAlamatKtpRequired =
    await paramsValidator.mappingValidationRequiredUndifined(alamatKtp);
  const checkedAlamatDomsisilRequired =
    await paramsValidator.mappingValidationRequiredUndifined(alamatDomisili);

  const checkedRtKtpRequired =
    await paramsValidator.mappingValidationRequiredUndifined(rtKtp);

  const kodePosKtpLength = await paramsValidator.mappingLengthDigitValidation(
    kodePostKtp,
    5
  );

  if (Object.keys(kodePosKtpLength).length > 0) {
    status = true;
    collectionData.push(kodePosKtpLength);
  }

  const kodePosDomisiliLength =
    await paramsValidator.mappingLengthDigitValidation(kodePosDomisili, 5);

  if (Object.keys(kodePosDomisiliLength).length > 0) {
    status = true;
    collectionData.push(kodePosDomisiliLength);
  }

  if (Object.keys(checkedRtKtpRequired).length > 0) {
    status = true;
    collectionData.push(checkedRtKtpRequired);
  }

  if (Object.keys(checkedNppRequired).length > 0) {
    status = true;
    collectionData.push(checkedNppRequired);
  }

  if (Object.keys(checkedKdCompIDRequired).length > 0) {
    status = true;
    collectionData.push(checkedKdCompIDRequired);
  }

  if (Object.keys(checkedProvinsiKtpIdRequired).length > 0) {
    status = true;
    collectionData.push(checkedProvinsiKtpIdRequired);
  }

  if (Object.keys(checkedKabupatenIdRequired).length > 0) {
    status = true;
    collectionData.push(checkedKabupatenIdRequired);
  }

  if (Object.keys(checkedKecamatanKtpIdRequired).length > 0) {
    status = true;
    collectionData.push(checkedKecamatanKtpIdRequired);
  }

  if (Object.keys(checkedKelurahanKtpIdRequired).length > 0) {
    status = true;
    collectionData.push(checkedKelurahanKtpIdRequired);
  }

  if (Object.keys(checkedProvinsiDomisiliIdRequired).length > 0) {
    status = true;
    collectionData.push(checkedProvinsiDomisiliIdRequired);
  }

  if (Object.keys(checkedKabupatenDomisiliRequired).length > 0) {
    status = true;
    collectionData.push(checkedKabupatenDomisiliRequired);
  }

  if (Object.keys(checkedKelurahanDomisiliRequired).length > 0) {
    status = true;
    collectionData.push(checkedKelurahanDomisiliRequired);
  }

  if (Object.keys(checkedKodePostRequired).length > 0) {
    status = true;
    collectionData.push(checkedKodePostRequired);
  }

  if (Object.keys(checkedKodePostKtpRequired).length > 0) {
    status = true;
    collectionData.push(checkedKodePostKtpRequired);
  }

  if (Object.keys(checkedRtDomisiliRequired).length > 0) {
    status = true;
    collectionData.push(checkedRtDomisiliRequired);
  }

  if (Object.keys(checkedKodePosDomisiliRequired).length > 0) {
    status = true;
    collectionData.push(checkedKodePosDomisiliRequired);
  }

  if (Object.keys(checkedAlamatKtpRequired).length > 0) {
    status = true;
    collectionData.push(checkedAlamatKtpRequired);
  }

  if (Object.keys(checkedAlamatDomsisilRequired).length > 0) {
    status = true;
    collectionData.push(checkedAlamatDomsisilRequired);
  }

  if (Object.keys(checkedRwDomisiliRequired).length > 0) {
    status = true;
    collectionData.push(checkedRwDomisiliRequired);
  }

  //check all might to be number

  const checkedKdCompIDNumber = await paramsValidator.mappingNumberValidation(
    kdCompId
  );

  const checkedProvinsiKtpIdNumber =
    await paramsValidator.mappingNumberValidation(provinsiKtpId);
  const checkedKabupatenIdNumber =
    await paramsValidator.mappingNumberValidation(kabupatenKtpId);
  const checkedKecamatanKtpIdNumber =
    await paramsValidator.mappingNumberValidation(kecamatanKtpId);
  const checkedKelurahanKtpIdNumber =
    await paramsValidator.mappingNumberValidation(kelurahanKtpId);
  const checkedProvinsiDomisiliIdNumber =
    await paramsValidator.mappingNumberValidation(provinsiDomisiliId);

  const checkedKabupatenDomisiliNumber =
    await paramsValidator.mappingNumberValidation(kabupatenDomisiliId);
  const checkedKecamatanDomisiliNumber =
    await paramsValidator.mappingNumberValidation(kecamatanDomisiliId);
  const checkedKelurahanDomisiliNumber =
    await paramsValidator.mappingNumberValidation(kelurahanDomisiliId);

  const checkedKodePostNumber = await paramsValidator.mappingNumberValidation(
    kodePosDomisili
  );

  const checkedKodePostKtpNumber =
    await paramsValidator.mappingNumberValidation(kodePostKtp);

  const checkRwDomisili3digits = await paramsValidator.validationLengthDigit(
    rwDomisili.value,
    3
  );

  const checkedRwDomisiliNumber = await paramsValidator.mappingDigitOnly(
    rwDomisili
  );

  const checkedRTDomisiliNumber = await paramsValidator.mappingDigitOnly(
    rtDomisili
  );

  let regexNumber = /^\d+$/;

  if (!regexNumber.test(rtKtp.value)) {
    collectionData.push({
      name: rtKtp.name,
      value: rtKtp.value,
      tipeData: typeof rtKtp.value,
      status: false,
      keterangan: `${rtKtp.name} harus berupa angka`,
    });
  }

  if (!regexNumber.test(rwKtp.value)) {
    collectionData.push({
      name: rwKtp.name,
      value: rwKtp.value,
      tipeData: typeof rwKtp.value,
      status: false,
      keterangan: `${rwKtp.name} harus berupa angka`,
    });
  }

  if (!regexNumber.test(rwDomisili.value)) {
    collectionData.push({
      name: rwDomisili.name,
      value: rwDomisili.value,
      status: false,
      keterangan: "Rw domisili harus berupa angka",
    });
  }

  if (!regexNumber.test(rtDomisili.value)) {
    collectionData.push({
      name: rtDomisili.name,
      value: rtDomisili.value,
      status: false,
      keterangan: "Rt domisili harus berupa angka",
    });
  }

  if (!checkRwDomisili3digits) {
    status = true;
    collectionData.push({
      name: rwDomisili.name,
      value: rwDomisili.value,
      status: false,
      keterangan: "Rw domisili harus 3 angka",
    });
  }

  const checkRtDomisili3digits = await paramsValidator.validationLengthDigit(
    rtDomisili.value,
    3
  );

  if (!checkRtDomisili3digits) {
    status = true;
    collectionData.push({
      name: rtDomisili.name,
      value: rtDomisili.value,
      status: false,
      keterangan: "Rt domisili harus 3 angka",
    });
  }

  // rt rw ktp

  const checkRwKtp3digits = await paramsValidator.validationLengthDigit(
    rwKtp.value,
    3
  );

  if (!checkRwKtp3digits) {
    status = true;
    collectionData.push({
      name: rwKtp.name,
      value: rwKtp.value,
      status: false,
      keterangan: "Rw ktp harus 3 angka",
    });
  }

  const checkRtKtp3digits = await paramsValidator.validationLengthDigit(
    rtKtp.value,
    3
  );

  if (!checkRtKtp3digits) {
    status = true;
    collectionData.push({
      name: rtKtp.name,
      value: rtKtp.value,
      status: false,
      keterangan: "Rt ktp harus 3 angka",
    });
  }

  // end

  if (Object.keys(checkedKdCompIDNumber).length > 0) {
    status = true;
    collectionData.push(checkedKdCompIDNumber);
  }

  if (Object.keys(checkedProvinsiKtpIdNumber).length > 0) {
    status = true;
    collectionData.push(checkedProvinsiKtpIdNumber);
  }

  if (Object.keys(checkedKabupatenIdNumber).length > 0) {
    status = true;
    collectionData.push(checkedKabupatenIdNumber);
  }

  if (Object.keys(checkedKecamatanKtpIdNumber).length > 0) {
    status = true;
    collectionData.push(checkedKecamatanKtpIdNumber);
  }

  if (Object.keys(checkedKelurahanKtpIdNumber).length > 0) {
    status = true;
    collectionData.push(checkedKelurahanKtpIdNumber);
  }

  if (Object.keys(checkedProvinsiDomisiliIdNumber).length > 0) {
    status = true;
    collectionData.push(checkedProvinsiDomisiliIdNumber);
  }

  if (Object.keys(checkedKabupatenDomisiliNumber).length > 0) {
    status = true;
    collectionData.push(checkedKabupatenDomisiliNumber);
  }

  if (Object.keys(checkedKecamatanDomisiliNumber).length > 0) {
    status = true;
    collectionData.push(checkedKecamatanDomisiliNumber);
  }

  if (Object.keys(checkedKelurahanDomisiliNumber).length > 0) {
    status = true;
    collectionData.push(checkedKelurahanDomisiliNumber);
  }

  if (Object.keys(checkedKodePostNumber).length > 0) {
    status = true;
    collectionData.push(checkedKodePostNumber);
  }

  if (Object.keys(checkedKodePostKtpNumber).length > 0) {
    status = true;
    collectionData.push(checkedKodePostKtpNumber);
  }

  const checkifexistprovinsi = await paramsValidator.mappingValidationAlamat(
    provinsiKtpId.value !== undefined && regexNumber.test(provinsiKtpId.value)
      ? provinsiKtpId
      : { name: "Provinsi KTP ID ", value: 999999999 },
    "checkProvinsiKtpExisting"
  );
  const checkifexistcity = await paramsValidator.mappingValidationAlamat(
    kabupatenKtpId.value !== undefined && regexNumber.test(kabupatenKtpId.value)
      ? kabupatenKtpId
      : { name: "Kabupaten KTP ID", value: 999999999 },
    "checkCityKtpExist"
  );
  const checkifexistkecamatan = await paramsValidator.mappingValidationAlamat(
    kecamatanKtpId.value !== undefined && regexNumber.test(kecamatanKtpId.value)
      ? kecamatanKtpId
      : { name: "Kecamatan KTP ID", value: 999999999 },
    "checkKecamatanKtpExist"
  );
  const checkifexistkelurahan = await paramsValidator.mappingValidationAlamat(
    kelurahanKtpId.value !== undefined && regexNumber.test(kelurahanKtpId.value)
      ? kelurahanKtpId
      : { name: "Kelurahan KTP ID", value: 999999999 },
    "checkKelurahanKtpExist"
  );
  const checkifexistprovinsi2 = await paramsValidator.mappingValidationAlamat(
    provinsiDomisiliId.value !== undefined &&
      regexNumber.test(provinsiDomisiliId.value)
      ? provinsiDomisiliId
      : { name: "Provinsi Domisili ID", value: 999999999 },
    "checkProvinsiDomExist"
  );
  const checkifexistcity2 = await paramsValidator.mappingValidationAlamat(
    kabupatenDomisiliId.value !== undefined &&
      regexNumber.test(kabupatenDomisiliId.value)
      ? kabupatenDomisiliId
      : { name: "Kabupaten Domisil ID", value: 999999999 },
    "checkCityDomExist"
  );
  const checkifexistkecamatan2 = await paramsValidator.mappingValidationAlamat(
    kecamatanDomisiliId.value !== undefined &&
      regexNumber.test(kecamatanDomisiliId.value)
      ? kecamatanDomisiliId
      : { name: "Kecamatan Domisili ID", value: 999999999 },
    "checkKecamatanDomExist"
  );
  const checkifexistkelurahan2 = await paramsValidator.mappingValidationAlamat(
    kelurahanDomisiliId.value !== undefined &&
      regexNumber.test(kelurahanDomisiliId.value)
      ? kelurahanDomisiliId
      : { name: "Kelurahan Domisili ID", value: 999999999 },
    "checkKelurahanDomExist"
  );

  if (Object.keys(checkifexistprovinsi).length > 0) {
    status = true;
    collectionData.push(checkifexistprovinsi);
  }

  if (Object.keys(checkifexistcity).length > 0) {
    status = true;
    collectionData.push(checkifexistcity);
  }

  if (Object.keys(checkifexistkecamatan).length > 0) {
    status = true;
    collectionData.push(checkifexistkecamatan);
  }

  if (Object.keys(checkifexistkelurahan).length > 0) {
    status = true;
    collectionData.push(checkifexistkelurahan);
  }

  if (Object.keys(checkifexistprovinsi2).length > 0) {
    status = true;
    collectionData.push(checkifexistprovinsi2);
  }

  if (Object.keys(checkifexistcity2).length > 0) {
    status = true;
    collectionData.push(checkifexistcity2);
  }

  if (Object.keys(checkifexistkecamatan2).length > 0) {
    status = true;
    collectionData.push(checkifexistkecamatan2);
  }

  if (Object.keys(checkifexistkelurahan2).length > 0) {
    status = true;
    collectionData.push(checkifexistkelurahan2);
  }

  if (
    Object.keys(checkedNppRequired).length === 0 &&
    Object.keys(checkedKdCompIDRequired).length === 0 &&
    Object.keys(checkedKdCompIDNumber).length === 0
  ) {
    const resNppCompExist = await paramsValidator.validationNppKdCompNotExist(
      npp,
      kdCompId
    );
    if (Object.keys(resNppCompExist).length > 0) {
      status = true;
      collectionData.push(resNppCompExist);
    }
  }

  if (
    Object.keys(checkedKdCompIDRequired).length === 0 &&
    Object.keys(checkedKdCompIDNumber).length === 0
  ) {
    const resCompany = await paramsValidator.mappingMasterRelasiValidation(
      kdCompId,
      "company"
    );

    if (Object.keys(resCompany).length > 0) {
      status = true;
      collectionData.push(resCompany);
    }
  }

  if (!status) {
    const checkIfCityExistInProvince =
      await paramsValidator.mappingRelateWilayah(
        kabupatenKtpId,
        provinsiKtpId,
        "checkIfCityExistInProvince"
      );
    const checkIfKecamatanExistInCity =
      await paramsValidator.mappingRelateWilayah(
        kecamatanKtpId,
        kabupatenKtpId,
        "checkIfKecamatanExistInCity"
      );
    const checkIfKelurahanExistInKecamatan =
      await paramsValidator.mappingRelateWilayah(
        kelurahanKtpId,
        kecamatanKtpId,
        "checkIfKelurahanExistInKecamatan"
      );
    const checkIfCityExistInProvince2 =
      await paramsValidator.mappingRelateWilayah(
        kabupatenDomisiliId,
        provinsiDomisiliId,
        "checkIfCityExistInProvince2"
      );
    const checkIfKecamatanExistInCity2 =
      await paramsValidator.mappingRelateWilayah(
        kecamatanDomisiliId,
        kabupatenDomisiliId,
        "checkIfKecamatanExistInCity2"
      );
    const checkIfKelurahanExistInKecamatan2 =
      await paramsValidator.mappingRelateWilayah(
        kelurahanDomisiliId,
        kecamatanDomisiliId,
        "checkIfKelurahanExistInKecamatan2"
      );
    if (Object.keys(checkIfCityExistInProvince).length > 0) {
      status = true;
      collectionData.push(checkIfCityExistInProvince);
    }
    if (Object.keys(checkIfKecamatanExistInCity).length > 0) {
      status = true;
      collectionData.push(checkIfKecamatanExistInCity);
    }
    if (Object.keys(checkIfKelurahanExistInKecamatan).length > 0) {
      status = true;
      collectionData.push(checkIfKelurahanExistInKecamatan);
    }
    if (Object.keys(checkIfCityExistInProvince2).length > 0) {
      status = true;
      collectionData.push(checkIfCityExistInProvince2);
    }
    if (Object.keys(checkIfKecamatanExistInCity2).length > 0) {
      status = true;
      collectionData.push(checkIfKecamatanExistInCity2);
    }
    if (Object.keys(checkIfKelurahanExistInKecamatan2).length > 0) {
      status = true;
      collectionData.push(checkIfKelurahanExistInKecamatan2);
    }

    if (!status) {
      const responseemployeeposition =
        await repositoryemployee.acquireDataByNppKDComp(
          s["NPP"],
          s["KD Comp ID"]
        );
      const dataAlamat = {
        address_ktp: s["Alamat KTP"],
        rt: s["RT KTP"],
        rw: s["RW KTP"],
        province_ktp_id: s["Provinsi KTP ID"],
        city_ktp_id: s["Kota/Kabupaten KTP ID"],
        kecamatan_ktp_id: s["Kecamatan KTP ID"],
        kelurahan_ktp_id: s["Desa/Kelurahan KTP ID"],
        kd_pos: s["Kode Pos KTP"],
        address_domicile: s["Alamat Domisili"],
        rt_domicile: s["RT Domisili"],
        rw_domicile: s["RW Domisili"],
        province_domicile_id: s["Provinsi Domisili ID"],
        city_domicile_id: s["Kota/Kabupaten Domisili ID"],
        kecamatan_domicile_id: s["Kecamatan Domisili ID"],
        kelurahan_domicile_id: s["Desa/Kelurahan Domisili ID"],
        kd_pos_domicile: s["Kode Pos Domisili"],
      };
      var employeeId = responseemployeeposition.id;
      dataAlamat.updated_by = "mass-upload";
      const responseupdateemployeeprofile =
        await repositoryEmployeeProfile.updateMasalByEmployeeId(
          employeeId,
          dataAlamat
        );
      if (responseupdateemployeeprofile) {
        collection["Status"] = "Sukses";
        collection["Keterangan"] = `Data alamat berhasil diubah`;
      } else {
        collection["Status"] = "Gagal";
        collection["Keterangan"] = `Data alamat gagal diubah`;
      }
    }
  }

  console.log("upsert data alamat");

  return {
    number_rows: i + 1,
    error: collectionData,
    npp: npp.value,
    kdCompId: kdCompId.value,
    alamatKtp: alamatKtp.value,
    rtKtp: rtKtp.value,
    rwKtp: rwKtp.value,
    provinsiKtpId: provinsiKtpId.value,
    kabupatenKtpId: kabupatenKtpId.value,
    kecamatanKtpId: kecamatanKtpId.value,
    kelurahanKtpId: kelurahanKtpId.value,
    kodePostKtp: kodePostKtp.value,
    alamatDomisili: alamatDomisili.value,
    rtDomisili: rtDomisili.value,
    rwDomisili: rwDomisili.value,
    provinsiDomisiliId: provinsiDomisiliId.value,
    kabupatenDomisiliId: kabupatenDomisiliId.value,
    kecamatanDomisiliId: kecamatanDomisiliId.value,
    kelurahanDomisiliId: kelurahanDomisiliId.value,
    kodePosDomisili: kodePosDomisili.value,
    sheetName: "Alamat",
    opsi: s["Opsi"],
    keterangan: `${!status ? `Success` : `Failure`}`,
  };
};

const upsertDataPendidikan = async (s) => {
  let collection = {};
  collection["NPP"] = s["NPP"];
  collection["KD Comp ID"] = s["KD Comp ID"];
  collection["Instansi Pendidikan ID"] = s["Instansi Pendidikan ID"];
  collection["Jenjang Pendidikan ID"] = s["Jenjang Pendidikan ID"];
  collection["IPK"] = s["IPK"];
  collection["Jurusan Pendidikan ID"] = s["Jurusan Pendidikan ID"];
  collection["Fakultas Pendidikan ID"] = s["Fakultas Pendidikan ID"];
  collection["Tanggal Masuk"] = moment(
    excelSerialNumberToDate(s["Tanggal Masuk"])
  ).format("YYYY-MM-DD");
  collection["Tanggal Kelulusan"] = moment(
    excelSerialNumberToDate(s["Tanggal Kelulusan"])
  ).format("YYYY-MM-DD");
  collection["Nomor Ijazah"] = parseInt(s["Nomor Ijazah"]);
  collection["Gelar ID"] = s["Gelar ID"];
  collection["Sheet Name"] = "Data Pendidikan";

  const checkIfNumber =
    (await validDataIsNumber(collection["KD Comp ID"])) &&
    (await validDataIsNumber(collection["Instansi Pendidikan ID"])) &&
    (await validDataIsNumber(collection["Jurusan Pendidikan ID"])) &&
    (await validDataIsNumber(collection["Fakultas Pendidikan ID"])) &&
    (await validDataIsNumber(collection["Nomor Ijazah"])) &&
    (await validDataIsNumber(collection["Gelar ID"]));

  const checkIfText = await validDataIsText(collection["NPP"]);

  const checkIfDate =
    (await validDataIsDate(collection["Tanggal Masuk"])) &&
    (await validDataIsDate(collection["Tanggal Kelulusan"]));

  const checkIfFloating = await validDataFloating(collection["IPK"]);

  if (!checkIfNumber) {
    collection["Status"] = "Gagal";
    collection["Keterangan"] =
      "Pastikan semua ID dan Nomor berupa angka harus sesua";
  } else if (!checkIfText) {
    collection["Status"] = "Gagal";
    collection["Keterangan"] = "Pastikan NPP tersisi harus sesuai";
  } else if (!checkIfDate) {
    collection["Status"] = "Gagal";
    collection["Keterangan"] = "Pastikan Tanggal sharus sesuai";
  } else if (!checkIfFloating) {
    collection["Status"] = "Gagal";
    collection["Keterangan"] = "Pastikan IPK harus sesuai";
  } else {
    const responseemployeeposition =
      await repositoryemployee.acquireDataByNppKDComp(
        s["NPP"],
        s["KD Comp ID"]
      );
    let dataPendidikan = {
      instansi_pendidikan_id: s["Instansi Pendidikan ID"],
      ref_jenjang_pendidikan_id: s["Jenjang Pendidikan ID"],
      final_score: s["IPK"],
      ref_jurusan_pendidikan_id: s["Jurusan Pendidikan ID"],
      fakultas_pendidikan_id: s["Fakultas Pendidikan ID"],
      start_date: moment(excelSerialNumberToDate(s["Tanggal Masuk"])).format(
        "YYYY-MM-DD"
      ),
      graduate_date: moment(
        excelSerialNumberToDate(s["Tanggal Kelulusan"])
      ).format("YYYY-MM-DD"),
      no_ijazah: s["Nomor Ijazah"],
      gelar_pendidikan_id: s["Gelar ID"],
    };

    const checkifexistinstansi =
      await repositoryMasterInstansiPendidikan.acquireById(
        s["Instansi Pendidikan ID"]
      );
    const checkifexistjenjangpendidikan =
      await repositoryMasterJenjangPendidikan.acquireById(
        s["Jenjang Pendidikan ID"]
      );
    const checkifexistjurusanpendidikan =
      await repositoryMasterJurusanPendidikan.acquireById(
        s["Jurusan Pendidikan ID"]
      );
    const checkifexistfakultaspendidikan =
      await repositoryMasterFakultasPendidkan.acquireById(
        s["Fakultas Pendidikan ID"]
      );
    const checkifexistgelarpendidikan =
      await repositoryMasterGelarPendidikan.acquireById(s["Gelar ID"]);

    const validasiExistingId =
      checkifexistinstansi &&
      checkifexistjenjangpendidikan &&
      checkifexistjurusanpendidikan &&
      checkifexistfakultaspendidikan &&
      checkifexistgelarpendidikan;

    if (validasiExistingId) {
      if (s["Opsi"] === "Tambah") {
        if (responseemployeeposition) {
          dataPendidikan.employee_id = responseemployeeposition.id;
          dataPendidikan.created_by = "mass-upload";
          const responseemployeeeducation =
            await repositoryEmployeeEducation.acquireByEmployeeId(
              dataPendidikan.employee_id
            );
          if (!responseemployeeeducation) {
            const responseemployeeeducation =
              await repositoryEmployeeEducation.generate(dataPendidikan);
            if (responseemployeeeducation) {
              collection["Status"] = "Sukses";
              collection["Keterangan"] = `Data pendidikan berhasil ditambah`;
            } else {
              collection["Status"] = "Gagal";
              collection[
                "Keterangan"
              ] = `Data pendidikan gagal ditambah, cek row data pendidikan`;
            }
          } else {
            collection["Status"] = "Gagal";
            collection[
              "Keterangan"
            ] = `Data pendidikan gagal ditambah, data pendidikan sudah ada`;
          }
        } else {
          collection["Status"] = "Gagal";
          collection[
            "Keterangan"
          ] = `Data pendidikan gagal ditambah, data pendidikan belum terdaftar di employee`;
        }
      } else {
        if (responseemployeeposition) {
          dataPendidikan.updated_by = "mass-upload";
          const responseemployeeeducation =
            await repositoryEmployeeEducation.acquireByEmployeeId(employeeId);
          if (responseemployeeeducation) {
            const responseupdateemployeeeducation =
              await repositoryEmployeeEducation.updateByEmployeeId(
                employeeId,
                dataPendidikan
              );
            if (responseupdateemployeeeducation) {
              collection["Status"] = "Sukses";
              collection["Keterangan"] = `Data pendidikan berhasil diubah`;
            } else {
              collection["Status"] = "Gagal";
              collection["Keterangan"] = `Data pendidikan gagal diubah`;
            }
          } else {
            collection["Status"] = "Gagal";
            collection[
              "Keterangan"
            ] = `Data pendidikan gagal dibuat, row data pendidikan tidak ditemukan`;
          }
        } else {
          collection["Status"] = "Gagal";
          collection[
            "Keterangan"
          ] = `Data pendidikan gagal dibuat data belum terdaftar di employee`;
        }
      }
    } else {
      collection["Status"] = "Gagal";
      collection[
        "Keterangan"
      ] = `Data pendidikan gagal dibuat pastikan semua ID sudah terdaftar`;
    }
  }
  return collection;
};

async function updateData(id, data, username) {
  data.updated_by = username;
  const updatedData = await repository.modernize(id, data);
  await Redis.del("employee");
  await Redis.del("employee:tiny");
  await Redis.del("employee-alternate");
  getAllData({
    query: {},
  });
  getAllData({
    query: {
      type: "tiny",
    },
  });
  getAlternate({});
  return updatedData;
}

async function destroyData(id) {
  const data = await repository.remove(id);
  await Redis.del("employee");
  await Redis.del("employee:tiny");
  await Redis.del("employee-alternate");
  getAllData({
    query: {},
  });
  getAllData({
    query: {
      type: "tiny",
    },
  });
  getAlternate({});
  return data;
}

const getEmployeeLearning = async (req, res, next) => {
  let data = await repository.acquireEmployeeLearning(req);
  return data;
};

module.exports = {
  getAllData,
  getOneById,
  createData,
  updateData,
  destroyData,
  getDataByDirektorat,
  getDataByUnit,
  getDataByDepartement,
  getDataByOrganization,
  getDataByCompany,
  getOneDataByDepartement,
  getOneDataByDirektorat,
  getOneDataByOrganization,
  getOneDataByUnit,
  getHistoryJabatanById,
  getDataHierarchy,
  getDataByCompany,
  getOneDataByCompany,
  createMassData,
  createDataMasal,
  getTemplateExcelData,
  upsertDataPekerjaan,
  upsertGeneralData,
  upsertDataIdentitas,
  upsertDataKeluarga,
  upsertAlamat,
  upsertDataPendidikan,
  ExcelDateToJSDate,
  excelSerialNumberToDate,
  createmasuploadtest,
  validDataIsNumber,
  validDataIsUndefined,
  validDataIsDate,
  validDataIs16Digit,
  validDataIsText,
  validDataFloating,
  validDataEmail,
  getEmployeeLearning,
  getOneDataByUnitLearning,
  getDataByUnitLearning,
  getDataOrgLearning,
};
