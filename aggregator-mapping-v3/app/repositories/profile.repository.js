const {
  EmployeeProfile,
  MasterProvince,
  MasterCity,
  MasterReligion,
  EmployeeEducation,
  MasterKecamatan,
  MasterKelurahan,
  Employee,
  EmployeePosition,
} = require("../../models");

const { Op } = require("sequelize");
require("dotenv").config();

async function upsert(data) {
  return await EmployeeProfile.findOne({
    where: {
      [Op.and]: [
        {
          employee_id: data.employee_id,
        },
      ],
    },
  }).then((obj) => {
    if (obj) {
      data.updated_by = "cron-db";
      return obj.update(data);
    } else {
      return EmployeeProfile.create(data);
    }
  });
}

async function upsertMasal(data) {
  return await EmployeeProfile.findOne({
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
    } else {
      data.created_by = "create-masal";
      return EmployeeProfile.create(data);
    }
  });
}

async function acquireAllData(employeeId = null) {
  let filterAll = {
    attributes: {
      exclude: ["created_at", "updated_at", "created_by", "updated_by"],
    },
    include: [
      {
        model: Employee,
        as: 'employee',
        attributes: ['name']
      },
      {
        model: MasterProvince,
        as: "province_ktp",
        attributes: ["id", "description"],
      },
      {
        model: MasterProvince,
        as: "province_domicile",
        attributes: ["id", "description"],
      },
      {
        model: MasterCity,
        as: "city_ktp",
        attributes: ["id", "description"],
      },
      {
        model: MasterCity,
        as: "city_domicile",
        attributes: ["id", "description"],
      },
      {
        model: MasterReligion,
        as: "profile_religion",
        attributes: ["id", "religion"],
      },
      {
        model: EmployeeEducation,
        as: "last_education",
        attributes: [],
      },
      {
        model: MasterKelurahan,
        as: "ktp_kelurahan",
        attributes: ["id", "name"],
      },
      {
        model: MasterKelurahan,
        as: "domicile_kelurahan",
        attributes: ["id", "name"],
      },
      {
        model: MasterKecamatan,
        as: "ktp_kecamatan",
        attributes: ["id", "name"],
      },
      {
        model: MasterKecamatan,
        as: "domicile_kecamatan",
        attributes: ["id", "name"],
      },
    ],
  };

  if (employeeId) {
    filterAll.where = {
      employee_id: employeeId,
    };
  }

  return await EmployeeProfile.findAll(filterAll);
}

async function acquireById(id) {
  return await acquireOne(id, false);
}

async function acquireByIDandKTP(id, ktp) {
  return await EmployeeProfile.findOne({
    where: {
      [Op.and]: [{ employee_id: id }, { national_identifier: ktp }],
    },
  });
}

// const acquireIsMarried = async () => {
//   return await EmployeeProfile.findOne(
//     where: {}
//   )
// }

async function acquireByIdMassUpload(id) {
  return await EmployeeProfile.findOne({
    where: {
      employee_id: id,
    },
  });
}

async function acquireOneByEmployeeId(id) {
  return await EmployeeProfile.findOne({
    where: {
      employee_id: id,
    },
  });
}

async function acquireOne(id, searchEmployee) {
  let dataSearch = {
    attributes: {
      exclude: ["created_at", "updated_at", "created_by", "updated_by"],
    },
    include: [
      {
        model: MasterProvince,
        as: "province_ktp",
        attributes: ["id", "description"],
      },
      {
        model: MasterProvince,
        as: "province_domicile",
        attributes: ["id", "description"],
      },
      {
        model: MasterCity,
        as: "city_ktp",
        attributes: ["id", "description"],
      },
      {
        model: MasterCity,
        as: "city_domicile",
        attributes: ["id", "description"],
      },
      {
        model: MasterReligion,
        as: "profile_religion",
        attributes: ["id", "religion"],
      },
      {
        model: EmployeeEducation,
        as: "last_education",
        attributes: [],
      },
      {
        model: MasterKelurahan,
        as: "ktp_kelurahan",
        attributes: ["id", "name"],
      },
      {
        model: MasterKelurahan,
        as: "domicile_kelurahan",
        attributes: ["id", "name"],
      },
      {
        model: MasterKecamatan,
        as: "ktp_kecamatan",
        attributes: ["id", "name"],
      },
      {
        model: MasterKecamatan,
        as: "domicile_kecamatan",
        attributes: ["id", "name"],
      },
    ],
  };

  if (searchEmployee) {
    dataSearch.where = {
      employee_id: id,
    };
  } else {
    dataSearch.where = {
      id: id,
    };
  }

  return await EmployeeProfile.findOne(dataSearch);
}

async function remove(id) {
  return await EmployeeProfile.destroy({
    where: {
      id: id,
    },
  });
}

async function generate(data) {
  return await EmployeeProfile.create(data);
}

async function modernize(id, data) {
  return await EmployeeProfile.update(data, {
    where: {
      id: id,
    },
  });
}

async function updateMasalByEmployeeId(id, data) {
  return await EmployeeProfile.update(data, {
    where: {
      employee_id: id,
    },
  });
}

const acquireByNationalIdentifier = async (natIdentifier) => {
  return await EmployeeProfile.findOne({
    where: {
      national_identifier: natIdentifier,
    },
    attributes: ["national_identifier"],
    include: [
      {
        model: Employee,
        as: "employee",
        where: {
          employee_status: true,
        },
      },
    ],
  });
};

const acquireByNoKK = async (noKK) => {
  return await EmployeeProfile.findOne({
    where: {
      no_kk: noKK,
    },
    attributes: ["no_kk"],
    include: [
      {
        model: Employee,
        as: "employee",
        where: {
          employee_status: true,
        },
      },
    ],
  });
};

module.exports = {
  acquireAllData,
  acquireOneByEmployeeId,
  acquireById,
  remove,
  generate,
  modernize,
  upsert,
  upsertMasal,
  updateMasalByEmployeeId,
  acquireByIdMassUpload,
  acquireByNationalIdentifier,
  acquireByIDandKTP,
  acquireByNoKK,
  // acquireIsMarried
};
