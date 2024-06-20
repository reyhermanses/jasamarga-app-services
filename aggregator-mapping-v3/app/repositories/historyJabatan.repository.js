const {
  HistoryJabatan,
  MasterCompany,
  Employee,
  EmployeePosition,
} = require("../../models");
const { Op, QueryTypes } = require("sequelize");
const moment = require("moment");

async function acquireById(id) {
  return await HistoryJabatan.findOne({
    where: {
      id: id,
    },
  });
}

async function acquireIntialWorkPeriod(empId) {
  return await HistoryJabatan.findOne({
    where: {
      employee_id: empId,
    },
    order: [["awal_posisi", "ASC"]],
  });
}

async function acquireFinalWorkPeriod(empId) {
  return await HistoryJabatan.findOne({
    where: {
      employee_id: empId,
    },
    order: [["akhir_posisi", "DESC"]],
  });
}

async function acquireBetweenAwalAkhirDate(id, currentDate) {
  var mappingDateAkhirPosition = moment(Date.now()).subtract(1, "d");
  var latestDate = mappingDateAkhirPosition.format("YYYY-MM-DD");
  let filterAll = {
    where: {
      employee_id: id,
      awal_posisi: {
        [Op.lte]: currentDate,
      },
      akhir_posisi: {
        [Op.gte]: currentDate,
      },
    },
  };
  return await HistoryJabatan.findOne(filterAll);
}

async function acquireUnitPeriod(empId, unit) {
  return await HistoryJabatan.findOne({
    where: {
      [Op.and]: [
        {
          employee_id: empId,
        },
        {
          unit: unit,
        },
      ],
    },
    order: [["awal_posisi", "ASC"]],
  });
}

async function acquireGradePeriod(empId, grade) {
  return await HistoryJabatan.findOne({
    where: {
      [Op.and]: [
        {
          employee_id: empId,
        },
        {
          konversi: grade,
        },
      ],
    },
    order: [["awal_posisi", "ASC"]],
  });
}

async function acquireEmployeeById(id) {
  return await Employee.findOne({
    where: {
      id: id,
    },
  });
}

async function acquireCompanyById(id) {
  return await MasterCompany.findOne({
    where: {
      id: id,
    },
  });
}

async function generate(data, transaction) {
  return await HistoryJabatan.create(data, { transaction });
}

async function remove(id) {
  return await HistoryJabatan.destroy({
    where: {
      id: id,
    },
  });
}

async function modernize(id, data) {
  return await HistoryJabatan.update(data, {
    where: {
      id: id,
    },
  });
}

async function acquireAllData(filter = {}, empId = null) {
  let filterAll = {
    attributes: [
      "id",
      "awal_posisi",
      "akhir_posisi",
      "konversi",
      "posisi",
      "unit",
      "sk_posisi",
    ],
    include: [
      {
        // [0]
        model: Employee,
        as: "employee",
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
        model: MasterCompany,
        as: "company",
        attributes: ["id", "name", "kd_comp"],
      },
    ],
    order: [["akhir_posisi", "DESC"]],
  };

  if (filter) {
    (filterAll.offset = filter.offset), (filterAll.limit = filter.limit);
  }

  if (empId) {
    filterAll.where = {
      employee_id: empId,
    };
  }

  return await HistoryJabatan.findAll(filterAll);
}

const acquireSantunanDuka = async (id) => {
  return await HistoryJabatan.findOne({
    where: {
      personnel_number : id,
    },
    include: [
      {
        model: Employee,
        as: "employee",
      },
    ],
  });
};

const acquireByEmployeeId = async (empId) => {
  return await HistoryJabatan.findOne({
    where: {
      employee_id: empId
    }
  })
}

module.exports = {
  acquireAllData,
  acquireEmployeeById,
  acquireCompanyById,
  generate,
  modernize,
  acquireById,
  acquireIntialWorkPeriod,
  acquireUnitPeriod,
  acquireGradePeriod,
  acquireFinalWorkPeriod,
  remove,
  acquireBetweenAwalAkhirDate,
  acquireSantunanDuka,
  acquireByEmployeeId
};
