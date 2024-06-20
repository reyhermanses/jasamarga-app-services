const {
  Employee,
  EmployeePosition,
  MasterPosition,
  OrganizationHierarchy,
  MasterCompany,
  MasterCluster,
  EmployeeFile,
  sequelize,
} = require("../../models");

const acquireData = async (unitId, companyId) => {
  let filter = {};

  if (unitId) {
    filter["$position.position_detail.unit_position.id$"] = unitId;
  }

  if (companyId) {
    filter["$company.id$"] = companyId;
  }

  return await Employee.findAll({
    where: filter,
    attributes: [
      "id",
      "name",
      [sequelize.col("position.npp"), "npp"],
      [
        sequelize.literal(`"position->position_detail->unit_position"."name"`),
        "unit_kerja",
      ],
      [
        sequelize.literal(`"position->position_detail->unit_position"."id"`),
        "unit_kerja_id",
      ],
      [sequelize.col("company.id"), "company_id"],
      [sequelize.col("company.kd_comp"), "kd_comp"],
      [
        sequelize.literal(
          `"position->position_detail->cluster_position"."name"`
        ),
        "cluster",
      ],
      [sequelize.literal(`"position->position_detail"."grade"`), "grade"],
      [
        sequelize.literal(
          `CASE WHEN "file"."url" IS NOT NULL THEN CONCAT('https://api-karyawan.jasamarga.co.id/api/v1/file?filename=',"file"."url") ELSE null END`
        ),
        "url_foto",
      ],
    ],
    include: [
      {
        model: EmployeePosition,
        as: "position",
        attributes: [],
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
                model: MasterCluster,
                as: "cluster_position",
                attributes: [],
              },
            ],
          },
        ],
      },
      {
        model: MasterCompany,
        as: "company",
        attributes: [],
      },
      {
        model: EmployeeFile,
        required: false,
        as: "file",
        where: {
          type: "Profile",
        },
        attributes: [],
      },
    ],
  });
};

const acquireByID = async (id) => {
  return await Employee.findOne({
    attributes: [
      "id",
      "name",
      [sequelize.col("position.npp"), "npp"],
      [
        sequelize.literal(`"position->position_detail->unit_position"."name"`),
        "unit_kerja",
      ],
      [sequelize.col("company.kd_comp"), "kd_comp"],
      [
        sequelize.literal(
          `"position->position_detail->cluster_position"."name"`
        ),
        "cluster",
      ],
      [sequelize.literal(`"position->position_detail"."grade"`), "grade"],
      [
        sequelize.literal(
          `CASE WHEN "file"."url" IS NOT NULL THEN CONCAT('https://api-karyawan.jasamarga.co.id/api/v1/file?filename=',"file"."url") ELSE null END`
        ),
        "url_foto",
      ],
    ],
    include: [
      {
        model: EmployeePosition,
        as: "position",
        attributes: [],
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
                model: MasterCluster,
                as: "cluster_position",
                attributes: [],
              },
            ],
          },
        ],
      },
      {
        model: MasterCompany,
        as: "company",
        attributes: [],
      },
      {
        model: EmployeeFile,
        required: false,
        as: "file",
        where: {
          type: "Profile",
        },
        attributes: [],
      },
    ],
    where: {
      is_pusat: true,
      employee_status: true,
      id: id,
    },
  });
};

module.exports = { acquireData, acquireByID };
