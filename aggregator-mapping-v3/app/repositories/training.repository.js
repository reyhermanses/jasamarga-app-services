const {
  Employee,
  EmployeeTraining,
  sequelize,
  EmployeePosition,
  MasterPosition,
  MasterCompany,
  OrganizationHierarchy,
} = require("../../models");
const { Op, where } = require("sequelize");

async function acquireAllData(
  filter = {},
  empId = null,
  nama_pelatihan = null,
  tahun_pelatihan = null,
  grade_emp = null,
) {
  let filterAll = {
    attributes: {
      exclude: ["created_at", "updated_at", "created_by", "updated_by"],
    },
    include: [
      {
        model: Employee,
        as: "employee_training",
        attributes: [["name", "employee_name"]],
        include: [
          {
            model: EmployeePosition,
            as: "position",
            attributes: [
              "is_main",
              ["npp", "employee_npp"],
              [
                sequelize.literal(
                  `"employee_training->position->position_detail->company_position"."kd_comp"`
                ),
                "employee_kd_comp",
              ],
              [
                sequelize.literal(
                  `"employee_training->position->position_detail->unit_position"."name"`
                ),
                "unit_kerja",
              ],
              [
                sequelize.literal(
                  `"employee_training->position->position_detail"."unit_kerja_id"`
                ),
                "unit_id",
              ],
              [
                sequelize.literal(
                  `"employee_training->position->position_detail"."grade"`
                ),
                "grade",
              ],
              [
                sequelize.literal(
                  `"employee_training->position->position_detail"."name"`
                ),
                "position_name",
              ],
              "position_id",
            ],
            include: [
              {
                model: MasterPosition,
                as: "position_detail",
                attributes: [],
                include: [
                  {
                    model: OrganizationHierarchy,
                    as: "unit_position",
                    attributes: [],
                  },
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
    ],
  };

  if (filter) {
    if (!filter.offset) {
      filterAll.offset = filter.offset;
    }
    if (!filter.limit) {
      filterAll.limit = filter.limit;
    }
  }

  if (empId) {
    filterAll.where = {
      employee_id: empId,
    };
  }

  if (nama_pelatihan) {
    // Append the condition using the Op.like operator
    if (!filterAll.where) {
      filterAll.where = {};
    }
    filterAll.where.pelatihan = {
      [Op.iLike]: `%${nama_pelatihan}%`,
    };
  }

  if (tahun_pelatihan) {
    // Append the condition using the Op.like operator
    if (!filterAll.where) {
      filterAll.where = {};
    }
    filterAll.where.tahun = {
      [Op.in]: [tahun_pelatihan],
    };
  }

  try {
    const result = await EmployeeTraining.findAndCountAll(filterAll);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }

  // return await EmployeeTraining.findAndCountAll(filterAll);
}

async function generate(data) {
  return await EmployeeTraining.create(data);
}

async function acquireById(id) {
  return await EmployeeTraining.findOne({
    where: {
      id: id,
    },
  });
}

async function modernize(id, data) {
  return await EmployeeTraining.update(data, {
    where: {
      id: id,
    },
  });
}

async function remove(id) {
  return await EmployeeTraining.destroy({
    where: {
      id: id,
    },
  });
}

module.exports = {
  acquireAllData,
  generate,
  acquireById,
  modernize,
  remove,
};
