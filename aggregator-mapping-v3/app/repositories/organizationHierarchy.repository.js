const {
  OrganizationHierarchy,
  MasterPosition,
  Employee,
  EmployeePosition,
  CountEmployeeUnit,
  MasterJob,
  OrgFormationJob,
  OrgFormation,
  MasterCompany,
  sequelize,
} = require("../../models");
const { Op } = require("sequelize");

const deleteLeader = async (empId, transaction) => {
  return await OrganizationHierarchy.update(
    { leader_id: null, leader_position_id: null },
    {
      where: { leader_id: empId },
      transaction,
    }
  );
};

async function acquireAllData(filter = {}, name = null, parentId = null) {
  filter.include = [
    {
      model: Employee,
      as: "leader",
      attributes: [],
    },
    {
      model: MasterPosition,
      as: "leader_position",
      attributes: [],
    },
  ];

  filter.attributes = {
    include: [
      [sequelize.col("leader.name"), "leader_name"],
      [sequelize.col("leader_position.name"), "leader_position_name"],
    ],
    exclude: ["created_at", "updated_at", "created_by", "updated_by"],
  };

  filter.where = {}

  if (name) {
    filter.where.name = {
      [Op.iLike]: `%${name}%`
    };
  }

  if (parentId) {
    filter.where.parent_id = parentId
  }

  return await OrganizationHierarchy.findAll(filter);
}

async function acquireCount(query) {
  let keys = Object.keys(query);
  let queryFilter = [];

  let filter = {
    attributes: [
      ["id", "unit_kerja_id"],
      "unit_kerja",
      ["parent_id", "direktorat_id"],
      [sequelize.col("parent.name"), "direktorat_name"],
      ["count_karyawan", "total"],
    ],
    include: [
      {
        model: OrganizationHierarchy,
        as: "parent",
        attributes: [],
      },
    ],
    raw: true,
  };

  if (keys.length > 0) {
    if (query.direktorat_id) {
      queryFilter.push({
        parent_id: query.direktorat_id,
      });
    }

    if (query.unit_kerja_id) {
      queryFilter.push({
        id: query.unit_kerja_id,
      });
    }
  }

  if (queryFilter.length > 0) {
    filter.where = {
      [Op.and]: queryFilter,
    };
  }

  return await CountEmployeeUnit.findAll(filter);
}

async function modernize(id, data, transaction) {
  return await OrganizationHierarchy.update(data, {
    where: {
      id: id,
    },
    transaction,
  });
}

async function upsert(data) {
  return await OrganizationHierarchy.findOne({
    where: {
      id: data.id,
    },
  }).then((obj) => {
    if (obj) {
      data.updated_by = "cron_db";
      return obj.update(data);
    }
    data.created_by = "cron_db";
    return OrganizationHierarchy.create(data);
  });
}

const acquireByLeaderPosition = async (leaderPositionId) => {
  return await OrganizationHierarchy.findOne({
    where: {
      leader_position_id: leaderPositionId,
    },
    include: [
      {
        model: OrganizationHierarchy,
        as: "parent",
      },
    ],
  });
};

async function acquireGroupByPosition() {
  let getData = {
    attributes: {
      include: [
        [
          sequelize.fn("COUNT", sequelize.col(`position_org.id`)),
          "count_position",
        ],
      ],
      exclude: ["created_at", "updated_at", "created_by", "updated_by"],
    },
    include: [
      {
        model: MasterPosition,
        as: "position_org",
        attributes: [],
        required: true,
      },
    ],
    group: ["OrganizationHierarchy.id"],
  };

  return await OrganizationHierarchy.findAll(getData);
}

async function acquireById(id) {
  return await OrganizationHierarchy.findOne({
    where: {
      id: id,
    },
    attributes: {
      exclude: ["created_at", "updated_at", "created_by", "updated_by"],
    },
    include: [
      {
        model: OrganizationHierarchy,
        as: "parent",
        attributes: {
          exclude: ["created_at", "updated_at", "created_by", "updated_by"],
        },
      },
      {
        model: OrganizationHierarchy,
        as: "children",
        attributes: {
          exclude: ["created_at", "updated_at", "created_by", "updated_by"],
        },
      },
      {
        model: Employee,
        as: "leader",
        attributes: [
          "id",
          "name",
          "is_pusat",
          [sequelize.literal(`"leader->position"."npp"`), "npp"],
          [sequelize.literal(`"leader->company"."kd_comp"`), "kd_comp"],
        ],
        include: [
          {
            model: EmployeePosition,
            as: 'position',
            attributes: []
          },
          {
            model: MasterCompany,
            as: 'company',
            attributes: []
          }
        ]
      },
      {
        model: MasterPosition,
        as: "leader_position",
        attributes: ["id", "name"],
      },
    ],
  });
}

const acquireSeksiFormation = async (id) => {
  const allData = await MasterPosition.findAll({
    attributes: [
      [sequelize.fn("MAX", sequelize.col(`job_position.name`)), "job_name"],
      [sequelize.col(`job_position.id`), "job_id"],
      [sequelize.fn("COUNT", sequelize.col(`job_position.id`)), "all_job"],
      [sequelize.fn("COUNT", sequelize.col(`job_position.id`)), "formasi"],
      [
        sequelize.fn("COUNT", sequelize.col(`position_employee.id`)),
        "filled_job",
      ],
    ],
    where: {
      seksi_id: id,
    },
    include: [
      {
        model: EmployeePosition,
        as: "position_employee",
        required: false,
        attributes: [],
      },
      {
        model: MasterJob,
        as: "job_position",
        required: true,
        attributes: [],
      },
    ],
    group: [sequelize.literal(`"job_position"."id"`)],
    raw: true,
  });

  allData.forEach(async (obj) => {
    obj.posisi = await MasterPosition.findAll({
      where: {
        seksi_id: id,
        job_id: obj.job_id,
      },
      attributes: [
        "id",
        "name",
        [
          sequelize.literal(`"position_employee->employee_position"."id"`),
          "employee_id",
        ],
        [
          sequelize.literal(`"position_employee->employee_position"."name"`),
          "employee_name",
        ],
        [sequelize.literal(`"position_employee"."npp"`), "employee_npp"],
      ],
      include: [
        {
          model: EmployeePosition,
          as: "position_employee",
          attributes: [],
          include: [
            {
              model: Employee,
              as: "employee_position",
              attributes: [],
            },
          ],
        },
      ],
      raw: true,
    });
  });
  return allData;
};

const acquireUnitKerjaFormation = async (id) => {
  const allData = await MasterPosition.findAll({
    attributes: [
      [sequelize.fn("MAX", sequelize.col(`job_position.name`)), "job_name"],
      [sequelize.col(`job_position.id`), "job_id"],
      [sequelize.fn("COUNT", sequelize.col(`job_position.id`)), "all_job"],
      [sequelize.fn("COUNT", sequelize.col(`job_position.id`)), "formasi"],
      [
        sequelize.fn("COUNT", sequelize.col(`position_employee.id`)),
        "filled_job",
      ],
    ],
    where: {
      unit_kerja_id: id,
    },
    include: [
      {
        model: EmployeePosition,
        as: "position_employee",
        required: false,
        attributes: [],
      },
      {
        model: MasterJob,
        as: "job_position",
        required: true,
        attributes: [],
      },
    ],
    group: [sequelize.literal(`"job_position"."id"`)],
    raw: true,
  });

  allData.forEach(async (obj) => {
    obj.posisi = await MasterPosition.findAll({
      where: {
        unit_kerja_id: id,
        job_id: obj.job_id,
      },
      attributes: [
        "id",
        "name",
        [
          sequelize.literal(`"position_employee->employee_position"."id"`),
          "employee_id",
        ],
        [
          sequelize.literal(`"position_employee->employee_position"."name"`),
          "employee_name",
        ],
        [sequelize.literal(`"position_employee"."npp"`), "employee_npp"],
      ],
      include: [
        {
          model: EmployeePosition,
          as: "position_employee",
          attributes: [],
          include: [
            {
              model: Employee,
              as: "employee_position",
              attributes: [],
            },
          ],
        },
      ],
      raw: true,
    });
  });

  return allData;
};

const acquireDepartemenFormation = async (id) => {
  const allData = await MasterPosition.findAll({
    attributes: [
      [sequelize.fn("MAX", sequelize.col(`job_position.name`)), "job_name"],
      [sequelize.col(`job_position.id`), "job_id"],
      [sequelize.fn("COUNT", sequelize.col(`job_position.id`)), "all_job"],
      [sequelize.fn("COUNT", sequelize.col(`job_position.id`)), "formasi"],
      [
        sequelize.fn("COUNT", sequelize.col(`position_employee.id`)),
        "filled_job",
      ],
    ],
    where: {
      departemen_id: id,
    },
    include: [
      {
        model: EmployeePosition,
        as: "position_employee",
        required: false,
        attributes: [],
      },
      {
        model: MasterJob,
        as: "job_position",
        required: true,
        attributes: [],
      },
    ],
    group: [sequelize.literal(`"job_position"."id"`)],
    raw: true,
  });

  allData.forEach(async (obj) => {
    obj.posisi = await MasterPosition.findAll({
      where: {
        departemen_id: id,
        job_id: obj.job_id,
      },
      attributes: [
        "id",
        "name",
        [
          sequelize.literal(`"position_employee->employee_position"."id"`),
          "employee_id",
        ],
        [
          sequelize.literal(`"position_employee->employee_position"."name"`),
          "employee_name",
        ],
        [sequelize.literal(`"position_employee"."npp"`), "employee_npp"],
      ],
      include: [
        {
          model: EmployeePosition,
          as: "position_employee",
          attributes: [],
          include: [
            {
              model: Employee,
              as: "employee_position",
              attributes: [],
            },
          ],
        },
      ],
      raw: true,
    });
  });

  return allData;
};

const acquireDirektoratFormation = async (id) => {
  const allData = await MasterPosition.findAll({
    attributes: [
      [sequelize.fn("MAX", sequelize.col(`job_position.name`)), "job_name"],
      [sequelize.col(`job_position.id`), "job_id"],
      [sequelize.fn("COUNT", sequelize.col(`job_position.id`)), "all_job"],
      [sequelize.fn("COUNT", sequelize.col(`job_position.id`)), "formasi"],
      [
        sequelize.fn("COUNT", sequelize.col(`position_employee.id`)),
        "filled_job",
      ],
    ],
    where: {
      direktorat_id: id,
    },
    include: [
      {
        model: EmployeePosition,
        as: "position_employee",
        required: false,
        attributes: [],
      },
      {
        model: MasterJob,
        as: "job_position",
        required: true,
        attributes: [],
      },
    ],
    group: [sequelize.literal(`"job_position"."id"`)],
    raw: true,
  });

  allData.forEach(async (obj) => {
    obj.posisi = await MasterPosition.findAll({
      where: {
        direktorat_id: id,
        job_id: obj.job_id,
      },
      attributes: [
        "id",
        "name",
        [
          sequelize.literal(`"position_employee->employee_position"."id"`),
          "employee_id",
        ],
        [
          sequelize.literal(`"position_employee->employee_position"."name"`),
          "employee_name",
        ],
        [sequelize.literal(`"position_employee"."npp"`), "employee_npp"],
      ],
      include: [
        {
          model: EmployeePosition,
          as: "position_employee",
          attributes: [],
          include: [
            {
              model: Employee,
              as: "employee_position",
              attributes: [],
            },
          ],
        },
      ],
      raw: true,
    });
  });

  return allData;
};

const acquireOrgFormation = async (id) => {
  const allData = await MasterPosition.findAll({
    attributes: [
      [sequelize.fn("MAX", sequelize.col(`job_position.name`)), "job_name"],
      [sequelize.col(`job_position.id`), "job_id"],
      [sequelize.fn("COUNT", sequelize.col(`job_position.id`)), "all_job"],
      [sequelize.fn("COUNT", sequelize.col(`job_position.id`)), "formasi"],
      [
        sequelize.fn("COUNT", sequelize.col(`position_employee.id`)),
        "filled_job",
      ],
    ],
    where: {
      org_id: id,
    },
    include: [
      {
        model: EmployeePosition,
        as: "position_employee",
        required: false,
        attributes: [],
      },
      {
        model: MasterJob,
        as: "job_position",
        required: true,
        attributes: [],
      },
    ],
    group: [sequelize.literal(`"job_position"."id"`)],
    raw: true,
  });

  allData.forEach(async (obj) => {
    obj.posisi = await MasterPosition.findAll({
      where: {
        org_id: id,
        job_id: obj.job_id,
      },
      attributes: [
        "id",
        "name",
        [
          sequelize.literal(`"position_employee->employee_position"."id"`),
          "employee_id",
        ],
        [
          sequelize.literal(`"position_employee->employee_position"."name"`),
          "employee_name",
        ],
        [sequelize.literal(`"position_employee"."npp"`), "employee_npp"],
      ],
      include: [
        {
          model: EmployeePosition,
          as: "position_employee",
          attributes: [],
          include: [
            {
              model: Employee,
              as: "employee_position",
              attributes: [],
            },
          ],
        },
      ],
      raw: true,
    });
  });

  return allData;
};

const acquireFilledPosition = async (relation, id) => {
  let allData;

  switch (relation) {
    case "seksi":
      allData = await acquireSeksiFormation(id);
      break;
    case "unit_kerja":
      allData = await acquireUnitKerjaFormation(id);
      break;
    case "departemen":
      allData = await acquireDepartemenFormation(id);
      break;
    case "direktorat":
      allData = await acquireDirektoratFormation(id);
      break;
    case "organization":
      allData = await acquireOrgFormation(id);
      break;
    default:
      allData = await MasterPosition.findAll({
        attributes: [
          [sequelize.fn("MAX", sequelize.col(`job_position.name`)), "job_name"],
          [sequelize.col(`job_position.id`), "job_id"],
          [sequelize.fn("COUNT", sequelize.col(`job_position.id`)), "all_job"],
          [
            sequelize.fn("COUNT", sequelize.col(`position_employee.id`)),
            "filled_job",
          ],
        ],
        where: {
          org_id: id,
        },
        include: [
          {
            model: EmployeePosition,
            as: "position_employee",
            required: false,
            attributes: [],
          },
          {
            model: MasterJob,
            as: "job_position",
            required: true,
            attributes: [],
          },
        ],
        group: [sequelize.literal(`"job_position"."id"`)],
        raw: true,
      });
      break;
  }

  for (const obj of allData) {
    const addOns = await OrgFormationJob.findOne({
      attributes: {
        exclude: ["id"],
      },
      where: {
        org_id: id,
        job_id: obj.job_id,
      },
      raw: true,
    });

    if (addOns && addOns.add_on) {
      obj.formasi = (
        parseInt(obj.all_job) + parseInt(addOns.add_on)
      ).toString();
    }
  }

  const arrayOfJob = allData.map((obj) => obj.job_id);
  const defineData = await OrgFormation.findAll({
    attributes: [
      [sequelize.col("formation_job.name"), "job_name"],
      "job_id",
      [sequelize.literal("'0'"), "all_job"],
      [sequelize.literal("CAST(add_on AS TEXT)"), "formasi"],
      [sequelize.literal("'0'"), "filled_job"],
    ],
    where: {
      org_id: id,
      job_id: {
        [Op.notIn]: arrayOfJob,
      },
    },
    include: [
      {
        model: MasterJob,
        as: "formation_job",
        attributes: [],
      },
    ],
    raw: true,
  });

  if (defineData.length > 0) {
    defineData.forEach((obj) => {
      obj.posisi = [];
      allData.push(obj);
    });
  }
  return allData;
};

const acquireFormation = async (id) => {
  const data = await OrganizationHierarchy.findByPk(id, {
    attributes: [
      "id",
      "name",
      "relation",
      "fungsi_organisasi",
      "keterangan_ap",
    ],
  });
  if (!data) {
    return data;
  }

  data.dataValues.job = await acquireFilledPosition("organization", data.id);

  const childrenData = await data.getChildren();
  if (childrenData.length === 0) {
    data.dataValues.subRows = [];
    return data;
  }
  const childPromises = childrenData.map((child) => acquireFormation(child.id));
  const children = await Promise.all(childPromises);
  data.dataValues.subRows = children;
  return data;
};

const acquireInitialFormation = async (id) => {
  return await OrganizationHierarchy.findAll({
    where: {
      parent_id: id,
    },
    raw: true,
  });
};

const acquireFormationByPersonalArea = async (persArea) => {
  let filter = {
    where: {
      personal_area_id: persArea,
    },
  };

  if (persArea == 1000) {
    filter = {
      where: {
        personal_area_id: 1000,
        id: {
          [Op.ne]: 40000000, // Not equal to 40000000
        },
      },
    };
  }
  return await OrganizationHierarchy.findAll(filter);
};

const acquireFilterFormation = async (filter) => {
  let data = await OrganizationHierarchy.findAll({
    where: filter,
    attributes: [
      "id",
      "name",
      "parent_id",
      "fungsi_organisasi",
      "keterangan_ap",
      "relation",
    ],
    raw: true,
  });

  if (filter.id) {
    for (const child of data) {
      const allDataFlat = await getAllDataRecursively(child.id);
      data = allDataFlat;
    }
  }

  return data;
};

async function getAllDataRecursively(organizationId, data = []) {
  // Find the organization with the given ID in the database
  const organization = await OrganizationHierarchy.findByPk(organizationId, {
    attributes: [
      "id",
      "name",
      "parent_id",
      "fungsi_organisasi",
      "keterangan_ap",
      "relation",
    ],
  });

  if (!organization) {
    // Organization not found, stop the recursion
    return data;
  }

  // Add the organization data to the array
  data.push(organization.toJSON());

  // Fetch all children of the current organization
  const children = await organization.getChildren();

  // If the organization has children, continue fetching data for the children
  for (const child of children) {
    await getAllDataRecursively(child.id, data);
  }

  return data;
}

module.exports = {
  acquireAllData,
  acquireById,
  acquireGroupByPosition,
  upsert,
  acquireCount,
  modernize,
  acquireFormation,
  acquireInitialFormation,
  acquireFilledPosition,
  acquireFilterFormation,
  acquireByLeaderPosition,
  deleteLeader,
  acquireFormationByPersonalArea,
};
