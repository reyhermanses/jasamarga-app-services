const {
  MasterPosition,
  OrganizationHierarchy,
  MasterCompany,
  Employee,
  MasterJob,
  MasterPersonalArea,
  MasterPersonalSubArea,
  MasterCluster,
  EmployeePosition,
  MasterSubCluster,
  MasterEmployeeSubGroup,
  OrgFormationJob,
  OrgFormation,
  sequelize,
} = require("../../../models");

let moment = require("moment");
const { Op } = require("sequelize");

const acquireLastStartDate = async (empId) => {
  return await EmployeePosition.findOne({
    attributes: [[sequelize.col(`position_detail.start_date`), "start_date"]],
    include: [
      {
        model: MasterPosition,
        as: "position_detail",
        attributes: [],
      },
    ],
    where: {
      employee_id: empId,
    },
    order: [["start_date", "DESC"]],
    limit: 1,
  });
};

const acquireExistingDataonEmployee = async (id) => {
  return await MasterPosition.findOne({
    where: {
      id: id,
    },
    include: [
      {
        model: EmployeePosition,
        as: "position_employee",
      },
    ],
  });
};

async function acquireAllData(query = [], filter = {}) {
  filter.attributes = {
    include: [
      [sequelize.col(`org_position.name`), "org_name"],
      [sequelize.col(`unit_position.name`), "unit_name"],
      [sequelize.col(`company_position.name`), "company_name"],
      [sequelize.col(`direktorat_position.name`), "direktorat_name"],
      [sequelize.col(`departemen_position.name`), "departemen_name"],
      [sequelize.col(`seksi_position.name`), "seksi_name"],
      [sequelize.col(`job_position.name`), "job_name"],
      [
        sequelize.col(`personal_area_position.description`),
        "personal_area_name",
      ],
      [
        sequelize.col(`personal_sub_area_position.description`),
        "personal_sub_area_name",
      ],
      [sequelize.col(`cluster_position.name`), "cluster_name"],
      [sequelize.col(`sub_cluster_position.name`), "sub_cluster_name"],
      [sequelize.literal(`"org_position->leader"."id"`), "leader_id"],
      [sequelize.literal(`"org_position->leader"."name"`), "leader_name"],
      [
        sequelize.literal(`"org_position->leader_position"."id"`),
        "leader_position_id",
      ],
      [
        sequelize.literal(`"org_position->leader_position"."name"`),
        "leader_position_name",
      ],
      [
        sequelize.literal(`"position_subgroup"."subgroup"`),
        "fungsi_jabatan_name",
      ],
      [
        sequelize.literal(`
          CASE
            WHEN "position_org_leader"."leader_position_id" IS NOT NULL THEN TRUE ELSE FALSE END
        `),
        "is_atasan",
      ],
      [
        sequelize.literal(`
          CASE
            WHEN LENGTH(CAST("MasterPosition".id AS VARCHAR(8))) = 8 AND SUBSTRING(CAST("MasterPosition".id AS VARCHAR(8)), 1, 2) IN ('30', '31') THEN true
            ELSE false
          END
        `),
        "is_sap",
      ],
    ],
    exclude: ["created_at", "updated_at", "created_by", "updated_by"],
  };

  if (query.length > 0) {
    filter.where = {
      [Op.and]: query,
    };
  }

  filter.include = [
    {
      model: OrganizationHierarchy,
      as: "org_position",
      attributes: [],
      include: [
        {
          model: Employee,
          as: "leader",
          attributes: [],
          include: [
            {
              model: EmployeePosition,
              as: "position",
              attributes: [],
            },
          ],
        },
        {
          model: MasterPosition,
          as: "leader_position",
          attributes: [],
        },
      ],
    },
    {
      model: OrganizationHierarchy,
      as: "position_org_leader",
      attributes: [],
    },
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
    {
      model: OrganizationHierarchy,
      as: "direktorat_position",
      attributes: [],
    },
    {
      model: OrganizationHierarchy,
      as: "departemen_position",
      attributes: [],
    },
    {
      model: OrganizationHierarchy,
      as: "seksi_position",
      attributes: [],
    },
    {
      model: MasterJob,
      as: "job_position",
      attributes: [],
    },
    {
      model: MasterPersonalArea,
      as: "personal_area_position",
      attributes: [],
    },
    {
      model: MasterPersonalSubArea,
      as: "personal_sub_area_position",
      attributes: [],
    },
    {
      model: MasterCluster,
      as: "cluster_position",
      attributes: [],
    },
    {
      model: MasterSubCluster,
      as: "sub_cluster_position",
      attributes: [],
    },
    {
      model: MasterEmployeeSubGroup,
      as: "position_subgroup",
      attributes: [],
    },
  ];
  return await MasterPosition.findAll(filter);
}

async function acquireByIdTest(id) {
  return await MasterPosition.findOne({
    where: {
      id: id,
    }
  });
}

async function acquireById(id) {
  return await MasterPosition.findOne({
    where: {
      id: id,
    },
    include: [
      {
        model: OrganizationHierarchy,
        attributes: {
          include: [
            [sequelize.literal(`"org_position->leader"."name"`), "leader_name"],
            [
              sequelize.literal(`"org_position->leader_position"."name"`),
              "leader_position_name",
            ],
            [
              sequelize.literal(
                `"org_position->leader_position->unit_position"."name"`
              ),
              "leader_unit_name",
            ],
            [
              sequelize.literal(
                `"org_position->leader_position->company_position"."name"`
              ),
              "leader_company_name",
            ],
            [
              sequelize.literal(
                `"org_position->leader_position->company_position"."kd_comp"`
              ),
              "leader_kdcomp_name",
            ],
            [
              sequelize.literal(
                `"org_position->leader_position->position_employee"."npp"`
              ),
              "leader_npp",
            ],
            [
              sequelize.literal(`
                CASE
                  WHEN "position_org_leader"."leader_position_id" IS NOT NULL THEN TRUE ELSE FALSE END
              `),
              "is_atasan",
            ],
            [
              sequelize.literal(`
                CASE
                  WHEN LENGTH(CAST("MasterPosition".id AS VARCHAR(8))) = 8 AND SUBSTRING(CAST("MasterPosition".id AS VARCHAR(8)), 1, 2) IN ('30', '31') THEN true
                  ELSE false
                END
              `),
              "is_sap",
            ],
          ],
          exclude: ["created_at", "updated_at", "created_by", "updated_by"],
        },
        as: "org_position",
        include: [
          {
            model: Employee,
            as: "leader",
            attributes: [],
          },
          {
            model: MasterPosition,
            as: "leader_position",
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
              {
                model: EmployeePosition,
                as: "position_employee",
                attributes: [],
              },
            ],
          },
        ],
      },
      {
        model: OrganizationHierarchy,
        as: "position_org_leader",
        attributes: [],
      },
      {
        model: EmployeePosition,
        as: "position_employee",
        attributes: ["id", "employee_id"],
      },
    ],
    attributes: {
      exclude: ["created_at", "updated_at", "created_by", "updated_by"],
    },
  });
}

async function acquireOrgById(id) {
  return await OrganizationHierarchy.findOne({
    where: {
      id: id,
    },
  });
}

async function acquireByOrgId(id) {
  return await MasterPosition.findAll({
    where: { org_id: id },
    attributes: {
      exclude: ["created_at", "updated_at", "created_by", "updated_by"],
    },
  });
}

async function generate(data, transaction) {
  return await MasterPosition.create(data, { transaction });
}

async function generateMasal(data) {
  return await MasterPosition.create(data);
}

const acquireLastInputtedPosition = async (companyId) => {
  return await MasterPosition.findOne({
    where: {
      company_id: companyId,
    },
    limit: 1,
    order: [["id", "DESC"]],
    raw: true,
  });
};

async function upsert(data) {
  return await MasterPosition.findOne({
    where: {
      id: data.id,
    },
  }).then((obj) => {
    if (obj) {
      data.updated_by = "cron-db";
      return obj.update(data);
    }
    (data.created_by = data.created_by), (data.created_at = moment());
    data.updated_at = moment();
    return MasterPosition.create(data);
  });
}

async function upsertMasal(data) {
  return await MasterPosition.findOne({
    where: {
      [Op.and]: [
        {
          id: data.position_id,
        },
      ],
    },
  }).then((obj) => {
    if (obj) {
      data.updated_by = data.updated_by;
      return obj.update(data);
    }
    (data.created_by = data.created_by), (data.created_at = moment());
    data.updated_at = moment();
    return MasterPosition.create(data);
  });
}

async function updateMasalByPositionId(position_id, data) {
  return await MasterPosition.update(data, {
    where: {
      id: position_id,
    },
  });
}

async function modernize(id, data, transaction) {
  return await MasterPosition.update(data, {
    where: {
      id: id,
    },
    transaction,
  });
}

async function modernizeOrg(id, data, transaction) {
  return await OrganizationHierarchy.update(data, {
    where: {
      id: id,
    },
    transaction,
  });
}

async function remove(id, transaction) {
  return await MasterPosition.destroy({
    where: {
      id: id,
    },
    transaction,
  });
}

const acquireJobFormation = async (jobId, orgId, transaction) => {
  return await OrgFormation.findOne({
    where: {
      job_id: jobId,
      org_id: orgId,
    },
    transaction,
  });
};

const checkJobAvailability = async (jobId, orgId) => {
  let data = await OrgFormationJob.findOne({
    attributes: {
      exclude: ["id"],
    },
    where: {
      job_id: jobId,
      org_id: orgId,
    },
  });

  if (!data) {
    data = await OrgFormation.findOne({
      where: {
        job_id: jobId,
        org_id: orgId,
      },
    });
  }

  if (!data || data.add_on === 0) {
    return false;
  }

  const countAvailability =
    parseInt(data.all_job) +
    (data.add_on ? parseInt(data.add_on) : 0) -
    (parseInt(data.filled_job) +
      (data.unprocess ? parseInt(data.unprocess) : 0));
  if (countAvailability === 0) {
    return false;
  }
  return true;
};

const checkIsLeader = async (positionId) => {
  return await OrganizationHierarchy.findOne({
    where: {
      leader_position_id: positionId,
    },
  });
};

const acquireByEmployeePosition = async (positionId) => {
  return await EmployeePosition.findOne({
    attributes: [
      [sequelize.literal(`"employee_id"`), "employee_id"],
      [sequelize.literal(`"position_detail"."name"`), "posisi"],
      [sequelize.literal(`"position_detail"."sk_position_no"`), "sk_posisi"],
      [sequelize.literal(`"position_detail"."start_date"`), "awal_posisi"],
      [sequelize.literal(`"position_detail"."grade"`), "grade"],
      [sequelize.literal(`"position_detail"."level"`), "level"],
      [sequelize.literal(`"position_detail"."konversi"`), "konversi"],
      [sequelize.literal(`"position_detail->unit_position"."name"`), "unit"],
      [
        sequelize.literal(`"position_detail->company_position"."id"`),
        "kd_comp",
      ],
      [
        sequelize.literal(`"position_detail->cluster_position"."name"`),
        "cluster",
      ],
      [
        sequelize.literal(`"position_detail->sub_cluster_position"."name"`),
        "sub_cluster",
      ],
      [sequelize.literal(`"position_detail"."file_sk"`), "file_sk"],
      [sequelize.literal(`"action"`), "action"],
      [sequelize.literal(`"is_main"`), "is_main"],
      [sequelize.literal(`"npp"`), "npp"],
    ],
    where: {
      position_id: positionId,
    },
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
          {
            model: MasterSubCluster,
            as: "sub_cluster_position",
            attributes: [],
          },
        ],
      },
    ],
    raw: true,
  });
};

const checkJobAvailabilityForMobility = async (jobId, orgId) => {
  const data = await OrgFormationJob.findOne({
    attributes: {
      exclude: ["id"],
    },
    where: {
      job_id: jobId,
      org_id: orgId,
    },
  });

  const countAvailability = parseInt(data.all_job) - parseInt(data.filled_job);
  if (countAvailability === 0) {
    return false;
  }
  return true;
};

module.exports = {
  acquireAllData,
  acquireById,
  generate,
  modernize,
  acquireOrgById,
  remove,
  acquireByOrgId,
  upsert,
  acquireLastInputtedPosition,
  upsertMasal,
  updateMasalByPositionId,
  checkJobAvailability,
  acquireJobFormation,
  modernizeOrg,
  checkJobAvailabilityForMobility,
  acquireExistingDataonEmployee,
  checkIsLeader,
  acquireByEmployeePosition,
  acquireLastStartDate,
  generateMasal,
  acquireByIdTest
};
