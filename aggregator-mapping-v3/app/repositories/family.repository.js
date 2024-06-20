const {
  EmployeeFamily,
  MasterStatusKeluarga,
  Employee,
  MasterReligion,
  EmployeePosition,
  sequelize,
  MasterPosition,
  MasterCompany,
} = require("../../models");
const { Op, Transaction } = require("sequelize");
require("dotenv").config();

async function acquireAllData(filter = {}, employeeId = null) {
  let filterAll = {
    attributes: [
      "id",
      "employee_id",
      "name",
      [sequelize.col("status_keluarga.description"), "status"],
      "object_id",
      "attachment_ktp",
    ],
    include: [
      {
        model: MasterStatusKeluarga,
        as: "status_keluarga",
        attributes: [],
      },
    ],
    raw: true,
  };

  if (filter) {
    (filterAll.offset = filter.offset), (filterAll.limit = filter.limit);
  }

  if (employeeId) {
    filterAll.where = {
      employee_id: employeeId,
    };
  }

  return await EmployeeFamily.findAndCountAll(filterAll);
}

async function upsert(data) {
  return await EmployeeFamily.findOne({
    where: {
      [Op.and]: [
        {
          employee_id: data.employee_id,
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
    return EmployeeFamily.create(data);
  });
}

async function upsertMasal(data) {
  return await EmployeeFamily.findOne({
    where: {
      [Op.and]: [
        {
          employee_id: data.employee_id,
        },
      ],
    },
  }).then((obj) => {
    if (obj) {
      data.updated_by = "update-masal";
      return obj.update(data);
    }
    data.updated_by = "create-masal";
    return EmployeeFamily.create(data);
  });
}

async function acquireAllDataAlternate(employeeId = null) {
  let filterAll = {
    attributes: {
      exclude: [
        "created_at",
        "updated_at",
        "created_by",
        "updated_by",
        "family_status_id",
      ],
    },
    include: [
      {
        model: Employee,
        as: "employee_family",
        attributes: ["id", "name"],
        include: [
          {
            model: EmployeePosition,
            as: "position",
            attributes: ["npp"],
          },
        ],
      },
      {
        model: MasterStatusKeluarga,
        as: "status_keluarga",
        attributes: ["id", "description"],
      },
    ],
  };

  if (employeeId) {
    filterAll.where = {
      employee_id: employeeId,
    };
  }

  return await EmployeeFamily.findAll(filterAll);
}

async function acquireByEmployeeIdFamilyStatusIdObjectId(
  employeeId,
  familyStatusId,
  objectId
) {
  return await EmployeeFamily.findOne({
    where: {
      [Op.and]: [
        {
          employee_id: employeeId,
        },
        {
          family_status_id: familyStatusId,
        },
        {
          object_id: objectId,
        },
      ],
    },
  });
}

async function acquireById(id) {
  return await EmployeeFamily.findOne({
    // attributes: {
    //   exclude: ['created_at', 'updated_at', 'created_by', 'updated_by', 'family_status_id']
    // },
    attributes: ["id"],
    include: [
      {
        model: Employee,
        as: "employee_family",
        attributes: ["id", "name"],
        include: [
          {
            model: EmployeePosition,
            as: "position",
            attributes: [
              "npp",
              [
                sequelize.literal(
                  `"employee_family->position->position_detail->company_position"."kd_comp"`
                ),
                "kd_comp",
              ],
            ],
            include: [
              {
                model: MasterPosition,
                as: "position_detail",
                attributes: [],
                include: [
                  {
                    model: MasterCompany,
                    as: "company_position",
                    attributes: [],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        model: MasterStatusKeluarga,
        as: "status_keluarga",
        attributes: ["id", "description"],
      },
    ],
    where: {
      id: id,
    },
  });
}

async function remove(id) {
  return await EmployeeFamily.destroy({
    where: {
      id: id,
    },
  });
}

async function acquireByEmployeeId(id) {
  return await EmployeeFamily.findOne({
    where: {
      employee_id: id,
    },
  });
}

const acquireByEmployeeIdAndNatIdentifier = async (employeeId, natId) => {
  return await EmployeeFamily.findOne({
    where: {
      employee_id: employeeId,
      national_identifier: `${natId}`,
    },
  });
};

async function acquireByEmployeeIdFamilyStatusId(id, familyStatusId) {
  return await EmployeeFamily.findOne({
    where: {
      [Op.and]: [
        {
          employee_id: id,
        },
        {
          family_status_id: familyStatusId,
        },
      ],
    },
  });
}

async function acquireByEmployeeIdFamilyName(id, name) {
  return await Employee.findOne({
    where: {
      [Op.and]: [
        {
          id: id,
        },
        {
          name: name,
        },
      ],
    },
  });
}

async function acquireByEmployeeIdObjectId(id, objectId) {
  return await Employee.findOne({
    where: {
      [Op.and]: [
        {
          id: id,
        },
        {
          object_id: objectId,
        },
      ],
    },
  });
}

async function acquireByReligionId(id) {
  return await MasterReligion.findOne({
    where: {
      id: id,
    },
  });
}

async function acquireByMasterStatusKeluargaId(id) {
  return await MasterStatusKeluarga.findOne({
    where: {
      id: id,
    },
  });
}

async function generate(data) {
  return await EmployeeFamily.create(data);
}

const generateMass = async (data, employeeId) => {
  if (data["Opsi"] === "Tambah") {
    await EmployeeFamily.create({
      employee_id: employeeId,
      name: data["Nama Keluarga"],
      family_status_id: data["Status Keluarga ID"],
      national_identifier: data["No KTP"],
      place_of_birth: data["Tempat Lahir"],
      date_of_birth: excelSerialNumberToDate(data["Tanggal Lahir"]),
      gender: data["Jenis Kelamin"],
      object_id: data["Status Anak ke Berapa"],
      created_by: "MASS_UPLOAD",
    });
  } else {
    const dataExist = await EmployeeFamily.findOne({
      where: { employee_id: employeeId, national_identifier: data["No KTP"] },
    });

    if (dataExist) {
      // let isActive = (dataExist.family_status_id === 10 && dataExist.family_status_id === 13 && dataExist.family_status_id === 21) ? false : true;
      dataExist.employee_id = employeeId;
      dataExist.name = data["Nama Keluarga"];
      dataExist.family_status_id = data["Status Keluarga ID"];
      dataExist.national_identifier = data["No KTP"];
      dataExist.place_of_birth = data["Tempat Lahir"];
      dataExist.date_of_birth = excelSerialNumberToDate(data["Tanggal Lahir"]);
      dataExist.gender = data["Jenis Kelamin"];
      dataExist.object_id = data["Status Anak ke Berapa"];
      dataExist.updated_by = "MASS_UPLOAD";
      // dataExist.active = isActive;
      await dataExist.save();
    }
  }

  return data;
};

const excelSerialNumberToDate = (serialNumber) => {
  const excelStartDate = new Date(Date.UTC(1900, 0, 0));
  const excelDate = new Date(
    excelStartDate.getTime() + (serialNumber - 1) * 24 * 60 * 60 * 1000
  );

  const year = excelDate.getUTCFullYear();
  const month = excelDate.getUTCMonth() + 1;
  const day = excelDate.getUTCDate();

  return `${year}-${month.toString().padStart(2, "0")}-${day
    .toString()
    .padStart(2, "0")}`;
};

async function modernize(id, data) {
  return await EmployeeFamily.update(data, {
    where: {
      id: id,
    },
  });
}

async function updateFamilyByEmployeeId(id, data) {
  return await EmployeeFamily.update(data, {
    where: {
      employee_id: id,
    },
  });
}

const acquireByNationalIdentiifier = async (natId) => {
  return await EmployeeFamily.findOne({
    where: { national_identifier: natId },
  });
};

const acquireByMaritalStatusEverMarried = async (empId) => {
  return await EmployeeFamily.findOne({
    where: {
      employee_id: empId,
      family_status_id: {
        [Op.in]: [1, 10, 13],
      },
    },
  });
};

module.exports = {
  acquireByMaritalStatusEverMarried,
  acquireByNationalIdentiifier,
  acquireAllData,
  acquireById,
  remove,
  acquireByEmployeeId,
  acquireByReligionId,
  acquireByMasterStatusKeluargaId,
  generate,
  modernize,
  upsert,
  acquireAllDataAlternate,
  upsertMasal,
  acquireByEmployeeIdFamilyStatusId,
  acquireByEmployeeIdFamilyName,
  acquireByEmployeeIdFamilyStatusIdObjectId,
  acquireByEmployeeIdObjectId,
  updateFamilyByEmployeeId,
  generateMass,
  acquireByEmployeeIdAndNatIdentifier,
};
