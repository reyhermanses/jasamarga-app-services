const {
  MasterGelarPendidikan,
  MasterFakultasPendidikan,
  MasterJurusanPendidikan,
  MasterJenjangPendidikan,
  MasterInstansiPendidikan,
  MasterKelurahan,
  MasterKecamatan,
  MasterCity,
  MasterProvince,
  MasterReligion,
  MasterSubCluster,
  MasterGradeLevel,
  MasterCluster,
  MasterJob,
  MasterEmployeeGroup,
  MasterPosition,
  EmployeePosition,
  MasterCompany,
  OrganizationHierarchy,
  MasterStatusKeluarga,
  MasterEmployeeSubGroup,
  MasterPersonalArea,
  MasterPersonalSubArea,
  Employee,
  sequelize,
} = require("../../models");

const { Op, Sequelize } = require("sequelize");

const acquireJob = async () => {
  return await MasterJob.findAll({
    attributes: {
      exclude: [
        "created_at",
        "updated_at",
        "created_by",
        "updated_by",
        "active",
      ],
    },
    where: {
      active: true,
    },
    raw: true,
  });
};

const acquireFungsiJabatan = async () => {
  return await MasterEmployeeSubGroup.findAll({
    attributes: [[sequelize.fn("max", sequelize.col("MasterEmployeeSubGroup.id")), "id"], "subgroup"],
    group: ["MasterEmployeeSubGroup.subgroup"],
    include: [
      {
        model: MasterGradeLevel,
        required: true,
        attributes: []
      }
    ],
    order: [[sequelize.fn("max", sequelize.col("MasterEmployeeSubGroup.id")), "ASC"]],
    raw: true,
  });
};

const acquireReligion = async () => {
  return await MasterReligion.findAll({
    attributes: [
      ["id", "AGAMA ID"],
      ["religion", "AGAMA"],
    ],
    raw: true,
  });
};

const acquireOrganisasi = async () => {
  return await OrganizationHierarchy.findAll({
    attributes: [
      ["id", "ORGANISASI ID"],
      ["name", "NAMA ORGANISASI"],
      [sequelize.col("parent.id"), "PARENT ORGANISASI ID"],
      [sequelize.col("parent.name"), "NAMA PARENT"],
    ],
    include: [
      {
        model: OrganizationHierarchy,
        as: "parent",
        attributes: [],
      },
    ],
    raw: true,
  });
};

const acquireCompanies = async (filter = null) => {
  let filterAll = {
    attributes: [
      ["id", "KD_COMP ID"],
      ["name", "NAMA COMPANY"],
      ["kd_comp", "KD_COMP"],
      ["nm_singkatan", "NAMA SINGKATAN"],
    ],
    raw: true,
  };

  if (filter) {
    filterAll.where = {
      id: filter,
    };
  }

  return await MasterCompany.findAll(filterAll);
};

const acquireEmployeeGroup = async () => {
  return await MasterEmployeeGroup.findAll({
    attributes: [
      ["id", "EMPLOYEE GROUP ID"],
      ["description", "EMPLOYEE GROUP"],
    ],
    raw: true,
  });
};

const acquirePositions = async (filter = null) => {
  const filterAll = {
    attributes: [
      ["id", "JABATAN ID"],
      ["name", "NAMA JABATAN"],
      [sequelize.col("company_position.kd_comp"), "KD_COMP"],
      [sequelize.col("unit_position.name"), "UNIT KERJA"],
      [sequelize.col("direktorat_position.name"), "DIREKTORAT"],
      [sequelize.col("departemen_position.name"), "DEPARTEMEN"],
      [sequelize.col("seksi_position.name"), "SEKSI"],
      [sequelize.col("job_position.name"), "JOB"],
      ["grade", "GRADE"],
      ["level", "LEVEL"],
      [sequelize.col("cluster_position.name"), "CLUSTER"],
      [sequelize.col("sub_cluster_position.name"), "SUB CLUSTER"],
      ["kelompok_jabatan", "KELOMPOK JABATAN"],
    ],
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
        model: OrganizationHierarchy,
        as: "direktorat_position",
        attributes: [],
      },
      {
        model: EmployeePosition,
        as: "position_employee",
        attributes: [],
        required: false,
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
  };

  if (filter) {
    filterAll.where = {
      company_id: filter,
      "$position_employee.id$": { [Op.is]: null },
    };
  } else {
    filterAll.where = {
      company_id: {
        [Op.not]: 1
      },
      "$position_employee.id$": { [Op.is]: null },
    };
  }

  return await MasterPosition.findAll(filterAll);
};

const acquirePositionsBlankJmClick = async (filter = null) => {
  const filterAll = {
    attributes: {
      include: [
        [sequelize.col(`org_position.name`), 'org_name'],
        [sequelize.col(`unit_position.name`), 'unit_name'],
        [sequelize.col(`company_position.name`), 'company_name'],
        [sequelize.col(`direktorat_position.name`), 'direktorat_name'],
        [sequelize.col(`departemen_position.name`), 'departemen_name'],
        [sequelize.col(`seksi_position.name`), 'seksi_name'],
        [sequelize.col(`job_position.name`), 'job_name'],
        [sequelize.col(`personal_area_position.description`), 'personal_area_name'],
        [sequelize.col(`personal_sub_area_position.description`), 'personal_sub_area_name'],
        [sequelize.col(`cluster_position.name`), 'cluster_name'],
        [sequelize.col(`sub_cluster_position.name`), 'sub_cluster_name'],
        [sequelize.literal(`"org_position->leader"."id"`), 'leader_id'],
        [sequelize.literal(`"org_position->leader"."name"`), 'leader_name'],
        [sequelize.literal(`"org_position->leader_position"."id"`), 'leader_position_id'],
        [sequelize.literal(`"org_position->leader_position"."name"`), 'leader_position_name'],
        [sequelize.literal(`"position_subgroup"."subgroup"`), 'fungsi_jabatan_name'],
        [
          sequelize.literal(`
            CASE
              WHEN "position_org_leader"."leader_position_id" IS NOT NULL THEN TRUE ELSE FALSE END
          `), 'is_atasan'
        ],
        [
          sequelize.literal(`
            CASE
              WHEN LENGTH(CAST("MasterPosition".id AS VARCHAR(8))) = 8 AND SUBSTRING(CAST("MasterPosition".id AS VARCHAR(8)), 1, 2) IN ('30', '31') THEN true
              ELSE false
            END
          `),
          'is_sap',
        ]
      ],
      exclude: ['created_at', 'updated_at', 'created_by', 'updated_by']
    },
    include: [
      {
        model: OrganizationHierarchy,
        as: 'org_position',
        attributes: [],
        include: [
          {
            model: Employee,
            as: 'leader',
            attributes: [],
            include: [
              {
                model: EmployeePosition,
                as: 'position',
                attributes: []
              }
            ]
          },
          {
            model: MasterPosition,
            as: 'leader_position',
            attributes: []
          }
        ]
      },
      {
        model: OrganizationHierarchy,
        as: 'position_org_leader',
        attributes: []
      },
      {
        model: OrganizationHierarchy,
        as: 'unit_position',
        attributes: []
      },
      {
        model: MasterCompany,
        as: 'company_position',
        attributes: []
      },
      {
        model: OrganizationHierarchy,
        as: 'direktorat_position',
        attributes: []
      },
      {
        model: OrganizationHierarchy,
        as: 'departemen_position',
        attributes: []
      },
      {
        model: OrganizationHierarchy,
        as: 'seksi_position',
        attributes: []
      },
      {
        model: MasterJob,
        as: 'job_position',
        attributes: []
      },
      {
        model: MasterPersonalArea,
        as: 'personal_area_position',
        attributes: []
      },
      {
        model: MasterPersonalSubArea,
        as: 'personal_sub_area_position',
        attributes: []
      },
      {
        model: MasterCluster,
        as: 'cluster_position',
        attributes: []
      },
      {
        model: MasterSubCluster,
        as: 'sub_cluster_position',
        attributes: []
      },
      {
        model: MasterEmployeeSubGroup,
        as: 'position_subgroup',
        attributes: []
      },
      {
        model: EmployeePosition,
        as: "position_employee",
        attributes: [],
        required: false,
      },
    ],
  };

  if (filter) {
    filterAll.where = {
      company_id: filter,
      "$position_employee.id$": { [Op.is]: null },
    };
  } else {
    filterAll.where = {
      company_id: {
        [Op.not]: 1
      },
      "$position_employee.id$": { [Op.is]: null },
    };
  }

  return await MasterPosition.findAll(filterAll);
};

const acquireMasterKeluarga = async () => {
  return await MasterStatusKeluarga.findAll({
    attributes: [
      ["id", "STATUS KELUARGA ID"],
      ["description", "STATUS KELUARGA"],
    ],
    raw: true,
  });
};

const acquireMasterProvince = async () => {
  return await MasterProvince.findAll({
    attributes: [
      ["id", "PROVINSI ID"],
      ["description", "PROVINSI"],
    ],
    raw: true,
  });
};

const acquireMasterCity = async () => {
  return await MasterCity.findAll({
    attributes: [
      ["id", "KOTA ID"],
      [sequelize.col("MasterProvince.description"), "PROVINSI"],
      ["description", "KOTA / KABUPATEN"],
    ],
    include: [
      {
        model: MasterProvince,
        attributes: [],
      },
    ],
    raw: true,
  });
};

const acquireMasterKecamatan = async () => {
  return await MasterKecamatan.findAll({
    attributes: [
      ["id", "KECAMATAN ID"],
      [sequelize.col("master_city.description"), "KOTA / KABUPATEN"],
      ["name", "KECAMATAN"],
    ],
    include: [
      {
        model: MasterCity,
        as: "master_city",
        attributes: [],
      },
    ],
    raw: true,
  });
};

const acquireMasterKelurahan = async () => {
  return await MasterKelurahan.findAll({
    attributes: [
      ["id", "KELURAHAN ID"],
      [sequelize.col("master_kecamatan.name"), "KECAMATAN"],
      ["name", "KELURAHAN"],
    ],
    include: [
      {
        model: MasterKecamatan,
        as: "master_kecamatan",
        attributes: [],
      },
    ],
    raw: true,
  });
};

const acquireInstansiPendidikan = async () => {
  return await MasterInstansiPendidikan.findAll({
    attributes: [
      ["id", "INSTANSI ID"],
      ["name", "INSTANSI PENDIDIKAN"],
    ],
    raw: true,
  });
};

const acquireJenjangPendidikan = async () => {
  return await MasterJenjangPendidikan.findAll({
    attributes: [
      ["id", "JENJANG PENDIDIKAN ID"],
      ["jenjang", "JENJANG PENDIDIKAN"],
    ],
    raw: true,
  });
};

const acquireJurusanPendidikan = async () => {
  return await MasterJurusanPendidikan.findAll({
    attributes: [
      ["id", "JURUSAN ID"],
      ["name", "JURUSAN PENDIDIKAN"],
    ],
    raw: true,
  });
};

const acquireFakultasPendidikan = async () => {
  return await MasterFakultasPendidikan.findAll({
    attributes: [
      ["id", "FAKULTAS ID"],
      ["name", "FAKULTAS PENDIDIKAN"],
    ],
    raw: true,
  });
};

const acquireGelarPendidikan = async () => {
  return await MasterGelarPendidikan.findAll({
    attributes: [
      ["id", "GELAR ID"],
      ["name", "GELAR PENDIDIKAN"],
      ["type", "TIPE"],
      ["gelar", "SINGKATAN GELAR"],
    ],
    raw: true,
  });
};

const acquireCluster = async () => {
  return await MasterCluster.findAll({ raw: true });
};

const acquireSubCluster = async () => {
  return await MasterSubCluster.findAll({ raw: true });
};

module.exports = {
  acquireJob,
  acquirePositions,
  acquireCompanies,
  acquireEmployeeGroup,
  acquireReligion,
  acquireMasterKeluarga,
  acquireMasterProvince,
  acquireMasterCity,
  acquireMasterKecamatan,
  acquireMasterKelurahan,
  acquireInstansiPendidikan,
  acquireJenjangPendidikan,
  acquireJurusanPendidikan,
  acquireFakultasPendidikan,
  acquireGelarPendidikan,
  acquirePositionsBlankJmClick,
  acquireOrganisasi,
  acquireFungsiJabatan,
  acquireCluster,
  acquireSubCluster,
};
