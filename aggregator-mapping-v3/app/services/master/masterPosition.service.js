const repository = require("../../repositories/master/masterPosition.repository");
const minioClient = require("../../../config/minio");
const employeePositionRepository = require("../../repositories/employeePosition.repository");
const orgRepository = require("../../repositories/organizationHierarchy.repository");
const companyRepository = require("../../repositories/master/masterCompany.repository");
const jobRepository = require("../../repositories/master/masterJob.repository");
const empSubGroupRepository = require("../../repositories/master/masterEmployeeSubGroup.repository");
const clusterRepository = require("../../repositories/master/masterCluster.repository");
const subClustRepository = require("../../repositories/master/masterSubCluster.repository");
const orgFormationRepository = require("../../repositories/orgFormation.repository");
const historyJabatanRepository = require("../../repositories/historyJabatan.repository");
const gradeRepository = require("../../repositories/master/masterGradeLevel.repository");
const organizationHierarchy = require("../../repositories/organizationHierarchy.repository");
const orgService = require("../../services/organizationHierarchy.service");
const {
  checkChildOrgData,
} = require("../../services/organizationHierarchy.service");

const path = require("path");
var Multer = require("multer");
const crypto = require("crypto");
const { Op, col, Transaction } = require("sequelize");
const XLSX = require("xlsx");

async function getAllData(query) {
  const keys = Object.keys(query);
  const checkKeys = keys.filter((obj) => {
    return (
      obj !== "name" &&
      obj !== "org_id" &&
      obj !== "active" &&
      obj !== "company_id" &&
      obj !== "unit_kerja_id" &&
      obj !== "direktorat_id" &&
      obj !== "departemen_id" &&
      obj !== "seksi_id" &&
      obj !== "job_id" &&
      obj !== "fungsi_jabatan" &&
      obj !== "personal_area_id" &&
      obj !== "personal_sub_area_id" &&
      obj !== "sk_position_no" &&
      obj !== "sk_position_date" &&
      obj !== "start_date" &&
      obj !== "grade" &&
      obj !== "level" &&
      obj !== "end_date" &&
      obj !== "cluster_id" &&
      obj !== "sub_cluster_id" &&
      obj !== "kelompok_jabatan" &&
      obj !== "konversi"
    );
  });

  if (checkKeys.length > 0) {
    const error = new Error("filter is invalid");
    error.statusCode = 422;
    throw error;
  }

  const updatedKeys = Object.keys(query);

  let params = [];
  for (obj of updatedKeys) {
    if (obj == "name") {
      params.push({
        [obj]: {
          [Op.iLike]: `%${query[obj]}%`,
        },
      });
    } else if (
      obj == "sk_position_date" ||
      obj == "start_date" ||
      obj == "end_date"
    ) {
      params.push({
        [obj]: {
          [Op.and]: {
            [Op.gte]: query[obj] + "T00:00:00.000Z",
            [Op.lte]: query[obj] + "T24:00:00.000Z",
          },
        },
      });
    } else {
      params.push({
        [obj]: query[obj],
      });
    }
  }
  return await repository.acquireAllData(params, {});
}

async function getOneById(id) {
  return await repository.acquireById(id);
}

async function getDataByOrgId(id) {
  return await repository.acquireByOrgId(id);
}

async function createData(data, transaction) {
  const checkJobAvailability = await repository.checkJobAvailability(
    data.job_id,
    data.org_id
  );

  if (!checkJobAvailability) {
    const error = new Error("Formasi Penuh");
    error.statusCode = 422;
    throw error;
  }
  const checkMasterPosition = await repository.acquireLastInputtedPosition(
    data.company_id
  );

  if (checkMasterPosition) {
    data.id = checkMasterPosition.id + 1;
  } else {
    data.id = parseInt(`${data.company_id}10000`);
  }

  const insertedData = await repository.generate(data, transaction);

  if (data.is_atasan) {
    const acquireOrg = await orgRepository.acquireById(data.org_id);

    if (acquireOrg.leader?.is_pusat) {
      const error = new Error("Organisasi Ditempati Karyawan Pusat");
      error.statusCode = 422;
      throw error;
    }

    await repository.modernizeOrg(
      data.org_id,
      {
        leader_position_id: data.id,
        leader_id: null,
      },
      transaction
    );
  }

  // update formasi jabatan
  const dataFormation = await repository.acquireJobFormation(
    data.job_id,
    data.org_id,
    transaction
  );

  if (dataFormation) {
    dataFormation.add_on > 0 ? dataFormation.add_on-- : 0;
    dataFormation.unprocess++;
    await dataFormation.save({ transaction });
  }

  return insertedData;
}

async function createDataMass(data) {
  const checkJobAvailability = await repository.checkJobAvailability(
    data.job_id,
    data.org_id
  );

  if (!checkJobAvailability) {
    // return false;
    // const error = new Error("Formasi Penuh");
    // error.statusCode = 422;
    // throw error;
    return [false, "Formasi Penuh"];
  }
  const checkMasterPosition = await repository.acquireLastInputtedPosition(
    data.company_id
  );

  if (checkMasterPosition) {
    data.id = checkMasterPosition.id + 1;
  } else {
    data.id = parseInt(`${data.company_id}10000`);
  }

  const insertedData = await repository.generate(data);

  if (data.is_atasan) {
    const acquireOrg = await orgRepository.acquireById(data.org_id);

    if (acquireOrg.leader?.is_pusat) {
      // const error = new Error("Organisasi Ditempati Karyawan Pusat");
      // error.statusCode = 422;
      // throw error;
      return [false, "Organisasi Ditempati Karyawan Pusat"];
    }

    await repository.modernizeOrg(data.org_id, {
      leader_position_id: data.id,
      leader_id: null,
    });
  }

  // update formasi jabatan
  const dataFormation = await repository.acquireJobFormation(
    data.job_id,
    data.org_id
  );

  if (dataFormation) {
    dataFormation.add_on > 0 ? dataFormation.add_on-- : 0;
    dataFormation.unprocess++;
    await dataFormation.save();
  }

  return insertedData;
}

async function updateData(
  currentData,
  id,
  data,
  username,
  hasEmployee,
  transaction
) {
  data.updated_by = username;

  const orgId = data.org_id ?? currentData.org_id;

  const jobId = data.job_id ?? currentData.job_id;

  if (data.job_id || data.org_id) {
    const checkJobAvailability = await repository.checkJobAvailability(
      jobId,
      orgId
    );

    if (!checkJobAvailability) {
      const error = new Error("Formasi Penuh");
      error.statusCode = 422;
      throw error;
    }

    // update formasi jabatan baru
    const dataFormation = await repository.acquireJobFormation(
      jobId,
      orgId,
      transaction
    );

    if (dataFormation) {
      dataFormation.add_on > 0 ? dataFormation.add_on-- : 0;
      if (!hasEmployee) {
        dataFormation.unprocess++;
      }
      await dataFormation.save({ transaction });
    }

    // update formasi jabatan lama
    const oldDataFormation = await repository.acquireJobFormation(
      currentData.job_id,
      currentData.org_id,
      transaction
    );

    if (oldDataFormation) {
      oldDataFormation.add_on++;
      await oldDataFormation.save({ transaction });
    }
  }

  // check value of req.body.is_atasan
  if (data.is_atasan === true) {
    const acquireOrg = await orgRepository.acquireById(orgId);

    if (acquireOrg.leader?.is_pusat) {
      const error = new Error("Organisasi Ditempati Karyawan Pusat");
      error.statusCode = 422;
      throw error;
    }

    let dataUpdate = { leader_position_id: id };

    if (hasEmployee) {
      dataUpdate = {
        leader_id: currentData.position_employee[0].employee_id,
        leader_position_id: id,
      };
    }

    await orgRepository.modernize(orgId, dataUpdate, transaction);
  } else if (data.is_atasan === false) {
    await orgRepository.modernize(
      orgId,
      { leader_id: null, leader_position_id: null },
      transaction
    );
  }

  return await repository.modernize(id, data, transaction);
}

async function destroyData(id, searchData, transaction) {
  // update formasi jabatan lama
  const oldDataFormation = await repository.acquireJobFormation(
    searchData.job_id,
    searchData.org_id,
    transaction
  );

  if (oldDataFormation) {
    oldDataFormation.add_on++;
    if (oldDataFormation.unprocess > 0) {
      oldDataFormation.unprocess--;
    }
    await oldDataFormation.save({ transaction });
  } else {
    const request = {
      org_id: searchData.org_id,
      job_id: searchData.job_id,
      add_on: 1,
    };
    await orgFormationRepository.generate(request, transaction);
  }
  return await repository.remove(id, transaction);
}

const validString = async (str) => {
  if (typeof str === "string") return true;
  return false;
};
const validNumber = async (num) => {
  if (typeof num === "number") return true;
  return false;
};
const validBool = async (bool) => {
  if (typeof bool === "boolean") return true;
  return false;
};

const validUndefined = async (undefined) => {
  if (typeof undefined === "undefined") return true;
  return false;
};

const mappingNumberValidation = async (data) => {
  let collection = {};
  if (!(await validNumber(data.value))) {
    collection = {
      name: data.name,
      value: (await validUndefined(data.value)) ? "" : data.value,
      tipedata: typeof data.value,
      status: false,
      keterangan: `${data.name} harus bertipe angka`,
    };
  }
  return collection;
};

const mappingStringValidation = async (data) => {
  let collection = {};
  if (!(await validString(data.value))) {
    collection = {
      name: data.name,
      value: (await validUndefined(data.value)) ? "" : data.value,
      tipedata: typeof data.value,
      status: false,
      keterangan: `${data.name} harus bertipe huruf`,
    };
  }
  return collection;
};

const mappingBoolValidation = async (data) => {
  let collection = {};
  if (!(await validBool(data.value))) {
    collection = {
      name: data.name,
      value: (await validUndefined(data.value)) ? "" : data.value,
      tipedata: typeof data.value,
      status: false,
      keterangan: `${data.name} harus diisi true or false`,
    };
  }
  return collection;
};

const mappingRelasiMasterValidation = async (data, name) => {
  let collection = {};
  switch (name) {
    case "company":
      const responseCompany = await companyRepository.acquireById(data.value);
      if (!responseCompany) {
        collection = {
          name: data.name,
          value: (await validUndefined(data.value)) ? "" : data.value,
          tipedata: typeof data.value,
          status: false,
          keterangan: `${data.name} tidak ditemukan di master kd comp`,
        };
      }
      break;
    case "unitKerja":
      const responseUnitKerja = await orgRepository.acquireById(data.value);
      if (!responseUnitKerja) {
        collection = {
          name: data.name,
          value: (await validUndefined(data.value)) ? "" : data.value,
          tipedata: typeof data.value,
          status: false,
          keterangan: `${data.name} tidak ditemukan di master org hieararchy`,
        };
      }
      break;
    case "departemen":
      const responseDep = await orgRepository.acquireById(data.value);
      if (!responseDep) {
        collection = {
          name: data.name,
          value: (await validUndefined(data.value)) ? "" : data.value,
          tipedata: typeof data.value,
          status: false,
          keterangan: `${data.name} tidak ditemukan di master org hieararchy`,
        };
      }
      break;
    case "seksi":
      const responseSeksi = await orgRepository.acquireById(data.value);
      if (!responseSeksi) {
        collection = {
          name: data.name,
          value: (await validUndefined(data.value)) ? "" : data.value,
          tipedata: typeof data.value,
          status: false,
          keterangan: `${data.name} tidak ditemukan di master org hieararchy`,
        };
      }
      break;
    case "direktorat":
      const responseDir = await orgRepository.acquireById(data.value);
      if (!responseDir) {
        collection = {
          name: data.name,
          value: (await validUndefined(data.value)) ? "" : data.value,
          tipedata: typeof data.value,
          status: false,
          keterangan: `${data.name} tidak ditemukan di master org hieararchy`,
        };
      }
      break;
    case "job":
      const responseJob = await jobRepository.acquireById(data.value);
      if (!responseJob) {
        collection = {
          name: data.name,
          value: (await validUndefined(data.value)) ? "" : data.value,
          tipedata: typeof data.value,
          status: false,
          keterangan: `${data.name} tidak ditemukan di master job`,
        };
      }
      break;
    case "fungsiJabatan":
      const responseFuncJabatan = await empSubGroupRepository.acquireById(
        data.value
      );
      if (!responseFuncJabatan) {
        collection = {
          name: data.name,
          value: (await validUndefined(data.value)) ? "" : data.value,
          tipedata: typeof data.value,
          status: false,
          keterangan: `${data.name} tidak ditemukan di master employee group`,
        };
      }
      break;
    case "cluster":
      const responseClust = await clusterRepository.acquireById(data.value);
      if (!responseClust) {
        collection = {
          name: data.name,
          value: (await validUndefined(data.value)) ? "" : data.value,
          tipedata: typeof data.value,
          status: false,
          keterangan: `${data.name} tidak ditemukan di master cluster`,
        };
      }
      break;
    case "subCluster":
      const responseSubClust = await subClustRepository.acquireById(data.value);
      if (!responseSubClust) {
        collection = {
          name: data.name,
          value: (await validUndefined(data.value)) ? "" : data.value,
          tipedata: typeof data.value,
          status: false,
          keterangan: `${data.name} tidak ditemukan di master sub cluster`,
        };
      }
      break;
    case "cluster&SubCluster":
      const SubCluster = await subClustRepository.acquireByIdClusterId(
        data.value.value,
        data.value2.value
      );
      if (!SubCluster) {
        collection = {
          name: data.name.name,
          value: (await validUndefined(data.value.value))
            ? ""
            : data.value.value,
          tipedata: typeof data.value.value,
          status: false,
          keterangan: `Cluster ID ${data.value2.value}  tidak ditemukan di master Sub Cluster ID ${data.value.value}`,
        };
      }
      break;
  }
  return collection;
};

const mappingOrgDepartement = async (depId, value) => {
  let collection = {};
  const dataChild = await checkChildOrgData(depId, value);
  const dataDepartemen = await organizationHierarchy.acquireById(depId);
  if (!dataChild) {
    collection = {
      name: "Seksi ID",
      // value: (await validUndefined(value)) ? "" : value,
      tipedata: typeof value,
      status: false,
      keterangan: `Seksi ID ${value} tidak terdaftar dalam departemen ${dataDepartemen.name} - ${depId}`,
    };
  }
  return collection;
};

const mappingCompUnit = async (companyId, unitKerjaId) => {
  let collection = {};
  const dataCompany = await companyRepository.acquireById(companyId);
  const TheHighestOrgInCompany = dataCompany.org_id;
  const dataChild = await checkChildOrgData(
    TheHighestOrgInCompany,
    unitKerjaId
  );
  if (!dataChild) {
    collection = {
      name: "Unit Kerja ID",
      // value: (await validUndefined(value)) ? "" : value,
      tipedata: typeof unitKerjaId,
      status: false,
      keterangan: `Unit Kerja ID tidak terdaftar dalam Company ${dataCompany.name}`,
    };
  }
  return collection;
};

const mappingDepartementUnitKerja = async (value, unitKerjaId) => {
  let collection = {};
  const dataChild = await checkChildOrgData(unitKerjaId, value);
  const dataUnitKerja = await organizationHierarchy.acquireById(unitKerjaId);
  if (!dataChild) {
    collection = {
      name: "Unit Kerja ID",
      // value: (await validUndefined(value)) ? "" : value,
      tipedata: typeof unitKerjaId,
      status: false,
      keterangan: `Departemen ID ${value} tidak terdaftar dalam unit kerja ${dataUnitKerja.name} - ${unitKerjaId}`,
    };
  }
  return collection;
};

const checkGradeLvlSublvlSubGId = async (grade, lvl, subLvl, subGroupId) => {
  let collection = {};
  let data = {
    grade: (await validUndefined(grade)) ? "" : grade,
    level: (await validUndefined(lvl)) ? "" : lvl,
    sublevel: (await validUndefined(subLvl)) ? "" : subLvl,
    subGroupId: (await validUndefined(subGroupId)) ? 0 : subGroupId,
  };
  const responseGrade = await gradeRepository.acquireByGradeLvlSublvlSubgroupId(
    data
  );
  if (responseGrade.length === 0) {
    collection = {
      name: data.name,
      value: (await validUndefined(data.value)) ? "" : data.value,
      tipedata: typeof data.value,
      status: false,
      keterangan: `${data.name} tidak ditemukan di master master grade level`,
    };
  }
  return collection;
};

// const mappingSeksiDepartemen = async (value, departemenId) => {
//   let collection = {};
//   const dataChild = await checkChildOrgData(departemenId, value);
//   const dataDepartemen = await organizationHierarchy.acquireById(departemenId);

//   if (!dataChild) {
//     collection = {
//       name: "Unit Kerja ID",
//       // value: (await validUndefined(value)) ? "" : value,
//       tipedata: typeof unitKerjaId,
//       status: false,
//       keterangan: `seksi_id ${value} tidak terdaftar dalam departemen ${dataDepartemen.name} - ${departemenId}`,
//     };
//   }
//   return collection;
// };

const checkGradePerItemLvlSublvlSubGId = async (
  grade,
  lvl,
  subLvl,
  subGroupId,
  kelompokJabatan
) => {
  let collection = [];
  // let checkLevel = false;
  // let checkSubgroupId = false;
  // let checkKelompokJabatan = false;
  let input = {
    grade: (await validUndefined(grade)) ? "" : String(grade),
    level: (await validUndefined(lvl)) ? "" : String(lvl),
    sublevel: (await validUndefined(subLvl)) ? "" : String(subLvl),
    subGroupId: (await validUndefined(subGroupId)) ? "" : parseInt(subGroupId),
    kelompokJabatan: (await validUndefined(kelompokJabatan))
      ? ""
      : String(kelompokJabatan),
  };

  // cek grade
  const checkgrade = await gradeRepository.acquireByGradeLvlSublvlSubgroupId({
    grade: input.grade,
  });

  if (!checkgrade) {
    collection.push({
      keterangan: `Grade ${input.grade} tidak ditemukan`,
    });
  }

  // level
  const checkLevel = await gradeRepository.acquireByGradeLvlSublvlSubgroupId({
    grade: input.grade,
    level: input.level,
  });

  if (!checkLevel) {
    collection.push({
      name: "Level",
      value: lvl,
      tipedata: typeof lvl,
      status: false,
      keterangan: `Level ${input.level} untuk grade ${input.grade} tidak ditemukan`,
    });
  }

  // sub level
  const checkSubLevel = await gradeRepository.acquireByGradeLvlSublvlSubgroupId(
    {
      grade: input.grade,
      level: input.level,
      sublevel: input.sublevel,
    }
  );

  if (!checkSubLevel) {
    collection.push({
      name: "Sub Level",
      value: subLvl,
      tipedata: typeof subLvl,
      status: false,
      keterangan: `Sub level ${input.sublevel} untuk level ${input.level} dan grade ${input.grade} tidak ditemukan`,
    });
  }

  // fungsi jabatan
  const checkFungsiJabatan =
    await gradeRepository.acquireByGradeLvlSublvlSubgroupId({
      grade: input.grade,
      level: input.level,
      // sublevel: input.sublevel,
      subgroup_id: parseInt(input.subGroupId),
    });

  if (!checkFungsiJabatan) {
    collection.push({
      name: "Fungsi Jabatan ID",
      value: subGroupId,
      tipedata: typeof subGroupId,
      status: false,
      keterangan: `Fungsi Jabatan ID ${input.subGroupId} untuk level ${input.level} dan grade ${input.grade} tidak ditemukan`,
    });
  }

  // fungsi jabatan
  if (
    input.kelompokJabatan !== "" &&
    input.kelompokJabatan === "Operasional" &&
    input.kelompokJabatan === "Non Operasional"
  ) {
    const checkKelompokJabatan =
      await gradeRepository.acquireByGradeLvlSublvlSubgroupId({
        grade: input.grade,
        level: input.level,
        // sublevel: input.sublevel,
        subgroup_id: input.subGroupId,
        kelompok_jabatan: input.kelompokJabatan,
      });

    if (!checkKelompokJabatan) {
      collection.push({
        name: "Kelompok Jabatan",
        value: kelompokJabatan,
        tipedata: typeof kelompokJabatan,
        status: false,
        keterangan: `Kelompok Jabatan ${input.kelompokJabatan} untuk fungsi jabatan ${input.subGroupId}, level ${input.level} dan grade ${input.grade} tidak ditemukan`,
      });
    }
  }
  return collection;
};

const checkMEGroup = (data) => { };

const createMassData = async (req, res, transaction) => {
  let collection = {};
  let jcollection = [];
  const options = { header: 1 };
  const workbook = XLSX.read(req.file.buffer);
  // const df = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
  // console.log(df.length);
  for (let wkIndex = 0; wkIndex < workbook.SheetNames.length; wkIndex++) {
    if (workbook.SheetNames[wkIndex] === "Jabatan") {
      const df = XLSX.utils.sheet_to_json(
        workbook.Sheets[workbook.SheetNames[wkIndex]]
      );
      for (let i = 0; i < df.length; i++) {
        jcollection.push(await mappingJabatanMasal(df[i], i));
      }
    }
  }
  return jcollection;
};

const transformKeysToCamelCase = (obj) => {
  const transformedObj = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const camelCaseKey = key.replace(/\s+/g, "");
      transformedObj[camelCaseKey] = obj[key];
    }
  }

  return transformedObj;
};

const mappingJabatanMasal = async (s, i) => {
  const camelCaseObject = transformKeysToCamelCase(s);
  let collection = [];
  let collectionData = {
    NumberRows: parseInt(i) + 1,
    Errors: [],
    ...camelCaseObject,
    SheetName: "Master Jabatan",
  };
  let status = false;
  let namaJabatan = {
    name: "Nama Jabatan",
    value: s["Nama Jabatan"],
  };
  let kdcompId = {
    name: "Kd Comp ID",
    value: s["KD Comp ID"],
  };
  let unitKerjaId = {
    name: "Unit Kerja ID",
    value: s["Unit Kerja ID"], //org
  };
  let departemenId = {
    name: "Departement ID",
    value: s["Department ID"], // org
  };
  let seksiId = {
    name: "Seksi ID",
    value: s["Seksi ID"], // org
  };
  let direktoratId = {
    name: "Direktorat ID",
    value: s["Direktorat ID"], // org
  };
  let jobId = {
    name: "Job ID",
    value: s["Job ID"],
  };
  let grade = {
    name: "Grade",
    value: s["Grade"],
  };
  let level = {
    name: "Level",
    value: s["Level"],
  };
  let subLevel = {
    name: "Sub Level",
    value: (await validUndefined(s["Sub Level"])) ? "" : s["Sub Level"],
  };
  let fungsiJabatanId = {
    name: "Fungsi Jabatan ID",
    value: s["Fungsi Jabatan ID"], // master employee group
  };
  let kelompokJabatan = {
    name: "Kelompok Jabatan",
    value: s["Kelompok Jabatan"],
  };
  let clusterId = {
    name: "Cluster ID",
    value: s["Cluster ID"],
  };
  let subClusterId = {
    name: "Sub Cluster ID",
    value: s["Sub Cluster ID"],
  };
  let isAtasan = {
    name: "Is Atasan",
    value: s["Is Atasan"],
  };

  const responseNJ = await mappingStringValidation(namaJabatan);
  if (Object.keys(responseNJ).length > 0) {
    status = true;
    collectionData.Errors.push({ "Nama Jabatan": responseNJ.keterangan });
  }
  const responsKDComp = await mappingNumberValidation(kdcompId);
  if (Object.keys(responsKDComp).length > 0) {
    status = true;
    collection.push(responsKDComp);
    collectionData.Errors.push({ "KD Comp ID": responsKDComp.keterangan });
  }
  const responsIsAtasan = await mappingBoolValidation(isAtasan);
  if (Object.keys(responsIsAtasan).length > 0) {
    status = true;
    collection.push(responsIsAtasan);
    collectionData.Errors.push({ "Is Atasan": responsIsAtasan.keterangan });
  }
  const responseUnitKerja = await mappingNumberValidation(unitKerjaId);
  if (Object.keys(responseUnitKerja).length > 0) {
    status = true;
    collection.push(responseUnitKerja);
    collectionData.Errors.push({
      "Unit Kerja ID": responseUnitKerja.keterangan,
    });
  }
  const responseDepartemen = await mappingNumberValidation(departemenId);
  if (Object.keys(responseDepartemen).length > 0) {
    status = true;
    collection.push(responseDepartemen);
    collectionData.Errors.push({
      "Departemen ID": responseDepartemen.keterangan,
    });
  }
  const responseSeksi = await mappingNumberValidation(seksiId);
  if (Object.keys(responseSeksi).length > 0) {
    status = true;
    collection.push(responseSeksi);
    collectionData.Errors.push({ "Seksi ID": responseSeksi.keterangan });
  }
  const responseDirektorat = await mappingNumberValidation(direktoratId);
  if (Object.keys(responseDirektorat).length > 0) {
    status = true;
    collection.push(responseDirektorat);
    collectionData.Errors.push({
      "Direktorat ID": responseDirektorat.keterangan,
    });
  }
  const responseJob = await mappingNumberValidation(jobId);
  if (Object.keys(responseJob).length > 0) {
    status = true;
    collection.push(responseJob);
    collectionData.Errors.push({ "Job ID": responseJob.keterangan });
  }
  const responseGrade = await mappingStringValidation(grade);
  if (Object.keys(responseGrade).length > 0) {
    status = true;
    collection.push(responseGrade);
    collectionData.Errors.push({ Grade: responseGrade.keterangan });
  }
  const responseLevel = await mappingNumberValidation(level);
  if (Object.keys(responseLevel).length > 0) {
    status = true;
    collection.push(responseLevel);
  }
  const responseFungsiJabatan = await mappingNumberValidation(fungsiJabatanId);
  if (Object.keys(responseFungsiJabatan).length > 0) {
    status = true;
    collection.push(responseFungsiJabatan);
    collectionData.Errors.push({
      "Fungsi Jabatan ID": responseFungsiJabatan.keterangan,
    });
  }

  const regexString = /^[a-zA-Z ]+$/;

  if (kelompokJabatan.value === undefined) {
    status = true;
    collectionData.Errors.push({
      "Kelompok Jabatan": "Kelompok Jabatan tidak boleh kosong",
    });
  } else {
    if (!regexString.test(kelompokJabatan.value)) {
      status = true;
      collectionData.Errors.push({
        "Kelompok Jabatan": "Kelompok Jabatan harus berupa huruf",
      });
    }

    if (
      kelompokJabatan.value !== "Operasional" &&
      kelompokJabatan.value !== "Non Operasional"
    ) {
      status = true;
      collectionData.Errors.push({
        "Kelompok Jabatan":
          "Kelompok Jabatan harus Operasional atau Non Operasional",
      });
    }
  }

  // level
  const responseLevelRequired = await mappingNumberValidation(level);
  if (Object.keys(responseLevelRequired).length > 0) {
    status = true;
    collectionData.Errors.push({
      Level: responseLevelRequired.keterangan,
    });
  }

  const responseCluster = await mappingNumberValidation(clusterId);
  if (Object.keys(responseCluster).length > 0) {
    status = true;
    collection.push(responseCluster);
    collectionData.Errors.push({ Cluster: responseCluster.keterangan });
  }
  const responseSubCluster = await mappingNumberValidation(subClusterId);
  if (Object.keys(responseSubCluster).length > 0) {
    status = true;
    collection.push(responseSubCluster);
    collectionData.Errors.push({
      "Sub Cluster": responseSubCluster.keterangan,
    });
  }

  //check relasi master
  let responseRelasiCompany;
  if (Object.keys(responsKDComp).length === 0) {
    responseRelasiCompany = await mappingRelasiMasterValidation(
      kdcompId,
      "company"
    );
    if (Object.keys(responseRelasiCompany).length > 0) {
      status = true;
      collection.push(responseRelasiCompany);
      collectionData.Errors.push({
        "KD Comp ID": responseRelasiCompany.keterangan,
      });
    }
  }

  let responseRelasiUnitK;
  if (Object.keys(responseUnitKerja).length === 0) {
    responseRelasiUnitK = await mappingRelasiMasterValidation(
      unitKerjaId,
      "unitKerja"
    );
    if (Object.keys(responseRelasiUnitK).length > 0) {
      status = true;
      collection.push(responseRelasiUnitK);
      collectionData.Errors.push({
        "Unit Kerja ID": responseRelasiUnitK.keterangan,
      });
    }
  }
  let responseRelasiDepart;

  if (Object.keys(responseDepartemen).length === 0) {
    responseRelasiDepart = await mappingRelasiMasterValidation(
      departemenId,
      "departemen"
    );
    if (Object.keys(responseRelasiDepart).length > 0) {
      status = true;
      collection.push(responseRelasiDepart);
      collectionData.Errors.push({
        "Departemen ID": responseRelasiDepart.keterangan,
      });
    }
  }

  let responseRelasiSeksi;

  if (Object.keys(responseSeksi).length === 0) {
    responseRelasiSeksi = await mappingRelasiMasterValidation(seksiId, "seksi");
    if (Object.keys(responseRelasiSeksi).length > 0) {
      status = true;
      collection.push(responseRelasiSeksi);
      collectionData.Errors.push({
        "Seksi ID": responseRelasiSeksi.keterangan,
      });
    }
  }

  if (Object.keys(responseDirektorat).length === 0) {
    const responseRelasiDir = await mappingRelasiMasterValidation(
      direktoratId,
      "direktorat"
    );
    if (Object.keys(responseRelasiDir).length > 0) {
      status = true;
      collection.push(responseRelasiDir);
      collectionData.Errors.push({ Direktorat: responseRelasiDir.keterangan });
    }
  }

  if (Object.keys(responseJob).length === 0) {
    const responseRelasiJob = await mappingRelasiMasterValidation(jobId, "job");
    if (Object.keys(responseRelasiJob).length > 0) {
      status = true;
      collection.push(responseRelasiJob);
      collectionData.Errors.push({ "Job ID": responseRelasiJob.keterangan });
    }
  }

  if (Object.keys(responseFungsiJabatan).length === 0) {
    const responseRelasiFuncJabatan = await mappingRelasiMasterValidation(
      fungsiJabatanId,
      "fungsiJabatan"
    );
    if (Object.keys(responseRelasiFuncJabatan).length > 0) {
      status = true;
      collection.push(responseRelasiFuncJabatan);
      collectionData.Errors.push({
        "Fungsi Jabatan": responseRelasiFuncJabatan.keterangan,
      });
    } else if (Object.keys(responseRelasiFuncJabatan).length === 0) {
      const responseCheckGradePerItemLvlSublvlSubGId =
        await checkGradePerItemLvlSublvlSubGId(
          grade.value,
          level.value,
          subLevel.value,
          fungsiJabatanId.value,
          kelompokJabatan.value
        );
      if (responseCheckGradePerItemLvlSublvlSubGId.length > 0) {
        status = true;
        for (
          let i = 0;
          i < responseCheckGradePerItemLvlSublvlSubGId.length;
          i++
        ) {
          collectionData.Errors.push({
            [responseCheckGradePerItemLvlSublvlSubGId[i].name]:
              responseCheckGradePerItemLvlSublvlSubGId[i].keterangan,
          });
        }
      }
    }
  }

  //check master cluster id di mastr sub cluster

  if (Object.keys(responseCluster).length === 0) {
    const responseRelasiClust = await mappingRelasiMasterValidation(
      clusterId,
      "cluster"
    );
    if (Object.keys(responseRelasiClust).length > 0) {
      status = true;
      collection.push(responseRelasiClust);
      collectionData.Errors.push({
        "Cluster ID": responseRelasiClust.keterangan,
      });
    }
  }

  if (Object.keys(responseSubCluster).length === 0) {
    const responseRelasiSubClust = await mappingRelasiMasterValidation(
      subClusterId,
      "subCluster"
    );
    if (Object.keys(responseRelasiSubClust).length > 0) {
      status = true;
      collection.push(responseRelasiSubClust);
      collectionData.Errors.push({
        "Sub Cluster ID": responseRelasiSubClust.keterangan,
      });
    }
  }

  if (
    Object.keys(responseCluster).length === 0 &&
    Object.keys(responseSubCluster).length === 0
  ) {
    let dataSubCluest = {
      name: "Sub Cluster ID",
      value: subClusterId,
      name2: "Cluster ID",
      value2: clusterId,
    };
    const responseRelasiClusterSubCluster = await mappingRelasiMasterValidation(
      dataSubCluest,
      "cluster&SubCluster"
    );

    if (Object.keys(responseRelasiClusterSubCluster).length > 0) {
      status = true;
      collection.push(responseRelasiClusterSubCluster);
      collectionData.Errors.push({
        "Cluster ID": responseRelasiClusterSubCluster.keterangan,
      });
    }
  }

  //mapping org dan departement
  if (
    Object.keys(responseDepartemen).length === 0 &&
    Object.keys(responseSeksi).length === 0 &&
    Object.keys(responseRelasiDepart).length === 0 &&
    Object.keys(responseRelasiSeksi).length === 0
  ) {
    const responseMappingOrgAndDepartement = await mappingOrgDepartement(
      departemenId.value,
      seksiId.value
    );

    if (Object.keys(responseMappingOrgAndDepartement).length > 0) {
      status = true;
      collectionData.Errors.push({
        "Seksi ID": responseMappingOrgAndDepartement.keterangan,
      });
    }
  }

  //mapping org dan departement
  if (
    Object.keys(responsKDComp).length === 0 &&
    Object.keys(responseUnitKerja).length === 0 &&
    Object.keys(responseRelasiCompany).length === 0 &&
    Object.keys(responseRelasiUnitK).length === 0
  ) {
    const responseMappingCompUnit = await mappingCompUnit(
      kdcompId.value,
      unitKerjaId.value
    );

    if (Object.keys(responseMappingCompUnit).length > 0) {
      status = true;
      collectionData.Errors.push({
        "Unit Kerja ID": responseMappingCompUnit.keterangan,
      });
    }
  }

  //mapping departement dan unitkerja
  // if (
  //   Object.keys(responseDepartemen).length === 0 &&
  //   Object.keys(responseUnitKerja).length === 0 &&
  //   Object.keys(responseRelasiDepart).length === 0 &&
  //   Object.keys(responseRelasiUnitK).length === 0
  // ) {
  //   const responseMappingDepartementUnitKerja =
  //     await mappingDepartementUnitKerja(departemenId.value, unitKerjaId.value);

  //   if (Object.keys(responseMappingDepartementUnitKerja).length > 0) {
  //     status = true;
  //     collectionData.Errors.push({
  //       "Departemen ID": responseMappingDepartementUnitKerja.keterangan,
  //     });
  //   }
  // }

  //disable 01/10/2024
  // if (!responseUnitKerja && !responseDirektorat) {
  //   const checkDirektorat = await orgService.checkChildOrgData(
  //     unitKerjaId.value,
  //     direktoratId.value
  //   );

  //   if (responseUnitKerja && responseDirektorat) {
  //     if (!checkDirektorat) {
  //       status = true;
  //       collectionData.Errors.push({
  //         "Direktorat ID": `Direktorat ID ${direktoratId.value} tidak terdaftar di Unit Kerja ID ${unitKerjaId.value}`,
  //       });
  //     }
  //   }
  // }

  //diable 01/10/2024
  // if (!responseDirektorat && !responseDepartemen) {
  //   const checkUnitKerja = await orgService.checkChildOrgData(
  //     direktoratId.value,
  //     departemenId.value
  //   );

  //   if (responseDepartemen && responseUnitKerja) {
  //     if (!checkUnitKerja) {
  //       status = true;
  //       collectionData.Errors.push({
  //         "Departement ID": `Departement ID ${departemenId.value} tidak terdaftar di Direktorat ID ${direktoratId.value}`,
  //       });
  //     }
  //   }
  // }

  const validData = status;
  if (!validData) {
    let dataJabatan = {
      name: s["Nama Jabatan"],
      company_id: s["KD Comp ID"],
      unit_kerja_id: s["Unit Kerja ID"],
      departemen_id: s["Department ID"],
      seksi_id: s["Seksi ID"],
      direktorat_id: s["Direktorat ID"],
      job_id: s["Job ID"],
      fungsi_jabatan: s["Fungsi Jabatan ID"],
      grade: s["Grade"],
      level: `${s["Level"]}${subLevel.value}`,
      kelompok_jabatan: s["Kelompok Jabatan"],
      cluster_id: s["Cluster ID"],
      sub_cluster_id: s["Sub Cluster ID"],
      org_id: s["Seksi ID"],
      is_atasan: s["Is Atasan"],
      active: true,
      created_by: "mass-upload",
    };

    const responseCreate = await createDataMass(dataJabatan);

    if (responseCreate.length > 0) {
      status = true;
      if (responseCreate[1] == "Formasi Penuh")
        collectionData.Errors.push({
          Jabatan: `Jabatan gagal dibuat formasi penuh`,
        });
      else
        collectionData.Errors.push({
          Jabatan: `Organisasi Ditempati Karyawan Pusat`,
        });
    } else {
      status = false;
    }
  }
  // console.log(status);
  collectionData.Status = `${status ? `Gagal` : `Sukses`}`;
  return collectionData;
};

const updateMasterPositionJmClickData = async (req, transaction) => {
  const { tipe, no_sk, tanggal_sk, start_date, end_date } = req.body;

  const currentPosition = await repository.acquireByEmployeePosition(
    req.params.id
  );
  let updateBody = {
    updated_by: req.api_key.name,
  };

  if (no_sk) {
    updateBody.sk_position_no = no_sk;
  }

  if (tanggal_sk) {
    updateBody.sk_position_date = tanggal_sk;
  }

  if (start_date) {
    updateBody.start_date = start_date;
  }

  if (end_date) {
    updateBody.end_date = end_date;
  }

  if (req.files.file_sk) {
    if (req.files.file_sk[0].mimetype !== "application/pdf") {
      const error = new Error("Only PDF files are allowed");
      error.statusCode = 422;
      throw error;
    }

    const fileName = crypto.randomBytes(64).toString("hex");
    minioClient.putObject(
      process.env.MINIO_BUCKET,
      `/file_sk/${fileName}${path.extname(req.files.file_sk[0].originalname)}`,
      req.files.file_sk[0].buffer,
      function (error, etag) {
        if (error) {
          throw new Error(
            `Something went wrong when uploading to Minio : ${error}`
          );
        }
      }
    );
    updateBody.file_sk = `/file_sk/${fileName}${path.extname(
      req.files.file_sk[0].originalname
    )}`;
  }

  await repository.modernize(req.params.id, updateBody, transaction);

  const dataEmployeePosition =
    await employeePositionRepository.acquireByEmployeeIdAndPositionId(
      req.params.employeeId,
      req.params.id
    );

  if (tipe) {
    dataEmployeePosition.updated_by = req.api_key.name;
    dataEmployeePosition.action = tipe;
    await dataEmployeePosition.save({ transaction });
    updateBody.action = tipe;
  }

  if (currentPosition.action === "rangkap" && end_date) {
    await historyJabatanRepository.generate(
      {
        ...currentPosition,
        akhir_posisi: end_date,
        created_by: req.api_key.name,
      },
      transaction
    );
    await dataEmployeePosition.destroy({ transaction });
  }

  return updateBody;
};

module.exports = {
  getAllData,
  getOneById,
  createData,
  createDataMass,
  updateData,
  destroyData,
  getDataByOrgId,
  updateMasterPositionJmClickData,
  createMassData,
  validString,
  validNumber,
  validBool,
  mappingJabatanMasal,
  validUndefined,
  mappingNumberValidation,
  mappingStringValidation,
  mappingBoolValidation,
  mappingRelasiMasterValidation,
  checkGradeLvlSublvlSubGId,
  checkMEGroup,
  checkGradePerItemLvlSublvlSubGId,
  mappingOrgDepartement,
  mappingCompUnit,
  mappingDepartementUnitKerja,
  // mappingSeksiDepartemen,
};
