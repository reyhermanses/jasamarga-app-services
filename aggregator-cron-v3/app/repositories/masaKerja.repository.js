const {
  Employee,
  EmployeePosition,
  EmployeeMasaKerja,
  MasterPosition,
  sequelize,
  HistoryJabatan,
  OrganizationHierarchy,
} = require("../../models");

const { Op } = require("sequelize");

const acquireAllEmployee = async (empId) => {
  let params = {
    is_main: true,
  };

  if (empId) {
    params.employee_id = empId;
  }

  return await EmployeePosition.findAll({
    attributes: [
      "employee_id",
      [sequelize.col("employee_position.date_of_entry"), "date_of_entry"],
      [sequelize.col("position_detail.grade"), "grade"],
      [sequelize.col("position_detail.konversi"), "konversi"],
      [sequelize.col("position_detail.sk_position_date"), "sk_position_date"],
      [sequelize.col("position_detail.start_date"), "start_date"],
      [sequelize.col("position_detail.start_date"), "start_date"],
      [
        sequelize.literal(`"position_detail->unit_position"."name"`),
        "unit_name",
      ],
    ],
    where: params,
    include: [
      {
        model: Employee,
        as: "employee_position",
        attributes: [],
        where: {
          employee_status: true,
        },
      },
      {
        model: MasterPosition,
        as: "position_detail",
        attributes: [],
        where: {
          grade: {
            [Op.ne]: null,
          },
        },
        include: [
          {
            model: OrganizationHierarchy,
            as: "unit_position",
            attributes: [],
          },
        ],
      },
    ],
  });
};

const acquireGradePeriod = async (empId, konversi) => {
  return await HistoryJabatan.findOne({
    where: {
      [Op.and]: [
        {
          employee_id: empId,
        },
        {
          konversi: konversi,
        },
      ],
    },
    order: [["awal_posisi", "ASC"]],
  });
};

const acquireLastWorkPeriod = async (empId) => {
  return await HistoryJabatan.findOne({
    where: {
      employee_id: empId,
    },
    order: [["akhir_posisi", "DESC"]],
  });
};

const acquireUnitPeriod = async (empId, unit) => {
  const allHistoryJabatan = await HistoryJabatan.findAll({
    where: { employee_id: empId },
    order: [["awal_posisi", "DESC"]],
  });

  let result = null; // jabatan unit yang diambil

  if (allHistoryJabatan) {
    for (const obj of allHistoryJabatan) {
      if (obj.unit !== unit) {
        break;
      } else {
        result = obj
      }
    }
    return result;
  }
  return null;
};

const acquireIntialWorkPeriod = async (empId) => {
  return await HistoryJabatan.findOne({
    where: {
      employee_id: empId,
    },
    order: [["awal_posisi", "ASC"]],
  });
};

const upsert = async (data) => {
  return await EmployeeMasaKerja.findOne({
    where: {
      employee_id: data.employee_id,
    },
  }).then((obj) => {
    if (obj) {
      data.updated_by = "aggregator-cron";
      return obj.update(data);
    }
    data.created_by = "aggregator-cron";
    return EmployeeMasaKerja.create(data);
  });
};

module.exports = {
  acquireAllEmployee,
  acquireGradePeriod,
  acquireLastWorkPeriod,
  acquireUnitPeriod,
  acquireIntialWorkPeriod,
  upsert,
};
