const {
  Employee,
  EmployeeProfile,
  EmployeeEducation,
  EmployeeFile,
  sequelize,
  OrganizationHierarchy,
  HistoryJabatan,
  MasterPosition,
  EmployeePosition,
  EmployeeMasaKerja,
  MasterPersonalArea,
  MasterCompany,
  MasterCluster,
  MasterSubCluster,
  MasterJob,
  MasterJenjangPendidikan,
  MasterJurusanPendidikan,
  MasterInstansiPendidikan,
  MasterReligion,
  MasterCity,
  MasterProvince,
  MasterEmployeeGroup,
  MasterEmployeeSubGroup,
  UnitDirektoratRelation,
  MasterKelurahan,
  MasterKecamatan
} = require("../../models");

const {
  Op
} = require("sequelize");

const acquireByDepartement = async (depId) => {
  return await EmployeePosition.findOne({
    attributes: [
      [sequelize.fn("COUNT", "id"), "count_employee"]
    ],
    include: [{
      model: MasterPosition,
      as: 'position_detail',
      where: {
        departemen_id: depId,
      },
      attributes: []
    }],
    raw: true,
  });
};

const acquireAllTinyData = async (query = null) => {
  let filter = {
    where: {
      employee_status: true,
    },
    attributes: [
      'id',
      'name',
    ],
    include: [
      // [0]
      {
        model: EmployeePosition,
        as: "position",
        required: true,
        attributes: [
          'npp',
          [sequelize.literal(`"position->position_detail->company_position"."kd_comp"`), 'kd_comp'],
          ["is_main", 'main_position'],
          [sequelize.literal(`"position->position_detail"."name"`), 'jabatan'],
          [sequelize.literal(`"position->position_detail->unit_position"."name"`), 'unit_kerja'],
          [sequelize.literal(`"position->position_detail->departemen_position"."name"`), 'departemen'],
          [sequelize.literal(`"position->position_detail->direktorat_position"."name"`), 'direktorat'],
        ],
        include: [
          // [0][0]
          {
            model: MasterPosition,
            as: "position_detail",
            attributes: [],
            required: true,
            include: [
              // [0][0][0]
              {
                model: MasterCompany,
                as: "company_position",
                attributes: [],
              },
              // [0][0][1]
              {
                model: OrganizationHierarchy,
                as: "unit_position",
                attributes: [],
              },
              // [0][0][2]
              {
                model: MasterSubCluster,
                as: "sub_cluster_position",
                attributes: [],
              },
              // [0][0][3]
              {
                model: MasterCluster,
                as: "cluster_position",
                attributes: [],
              },
              // [0][0][4]
              {
                model: MasterJob,
                as: "job_position",
                attributes: [],
              },
              // [0][0][5]
              {
                model: OrganizationHierarchy,
                as: "org_position",
                attributes: [],
              },
              // [0][0][6]
              {
                model: OrganizationHierarchy,
                as: "direktorat_position",
                attributes: [],
              },
              // [0][0][7]
              {
                model: OrganizationHierarchy,
                as: "departemen_position",
                attributes: [],
              },
              // [0][0][8]
              {
                model: OrganizationHierarchy,
                as: "seksi_position",
                attributes: [],
              },
              // [0][0][9]
              {
                model: MasterPersonalArea,
                as: "personal_area_position",
                attributes: [],
              },
            ]
          }
        ]
      },
      // [1]
      {
        model: MasterEmployeeGroup,
        as: "group",
        attributes: [],
        required: false,
      },
    ],
  };

  if (Object.keys(query).length > 0) {
    let newQuery = query;
    let keys = Object.keys(newQuery);
    let values = Object.values(newQuery);
    let queryEmpPosition = []
    let queryEmployee = [];
    let queryCluster = [];
    let queryPosition = [];

    for (let i = 0; i < keys.length; i++) {
      let obj = {};
      let objCluster = {};
      let objEmpPosition = {};
      let objPosition = {};
      if (keys[i] == "nama") {
        obj["name"] = {
          [Op.iLike]: `%${values[i]}%`,
        };
        queryEmployee.push(obj);
      } else if (keys[i] == "employee_group") {
        filter.include[1].where = {
          description: query.employee_group
        };
        filter.include[1].required = true;
      } else if (keys[i] == "departemen_id") {
        objPosition["departemen_id"] = values[i]
        queryPosition.push(objPosition);
      } else if (keys[i] == "unit_kerja_id") {
        objPosition["unit_kerja_id"] = values[i]
        queryPosition.push(objPosition);
      } else if (keys[i] == "direktorat_id") {
        objPosition["direktorat_id"] = values[i]
        queryPosition.push(objPosition);
      } else if (keys[i] == "kd_comp") {
        filter.include[0].include[0].include[0].where = {
          kd_comp: {
            [Op.iLike]: `%${query.kd_comp}%`,
          },
        };
        filter.include[0].include[0].include[0].required = true;
      } else if (keys[i] == "unit_kerja") {
        filter.include[0].include[0].include[1].where = {
          name: {
            [Op.iLike]: `%${query.unit_kerja}%`,
          },
        };
        filter.include[0].include[0].include[1].required = true;
      } else if (keys[i] == "direktorat") {
        filter.include[0].include[0].include[6].where = {
          name: {
            [Op.iLike]: `%${query.direktorat}%`,
          },
        };
        filter.include[0].include[0].include[6].required = true;
      } else if (keys[i] == "grade") {
        filter.include[0].include[0].where = {
          grade: values[i].split(",")
        }
      } else if (keys[i] == "cluster") {
        objCluster["name"] = values[i].split(",")
        queryCluster.push(objCluster);
      } else if (keys[i] == "cluster_kode") {
        objCluster["kode"] = values[i].split(",")
        queryCluster.push(objCluster);
      } else {
        objEmpPosition[keys[i]] = values[i];
        queryEmpPosition.push(objEmpPosition);
      }
    }

    if (queryEmployee.length != 0) {
      filter.where = {
        [Op.and]: queryEmployee,
      };
    }

    if (queryEmpPosition.length != 0) {
      filter.include[0].where = {
        [Op.and]: queryEmpPosition,
      };
    }

    if (queryCluster.length != 0) {
      filter.include[0].include[0].include[3].where = {
        [Op.and]: queryCluster,
      };
    }

    if (queryPosition.length != 0) {
      filter.include[0].include[0].where = {
        [Op.and]: queryPosition,
      };
    }
  }

  return await Employee.findAll(filter);
};

const acquireMandatoryData = async (query = null) => {
  return await Employee.findAll(query)
}

const acquireAllData = async (query = null) => {
  let filter = {
    where: {
      employee_status: true,
    },
    attributes: [
      "id",
      "name",
      [sequelize.col("company_penugasan.kd_comp"), "kd_comp_penugasan"],
      [sequelize.literal(`"company"."kd_comp"`), 'kd_comp_asal'],
      "is_pusat",
      "date_of_entry",
      "is_penugasan",
      "employee_status",
      [sequelize.col("emp_masa_kerja.masa_kerja"), "masa_kerja"],
      [sequelize.col("emp_masa_kerja.mk_jabatan"), "masa_jabatan"],
      [sequelize.col("emp_masa_kerja.mk_grade"), "masa_grade"],
      [sequelize.col("emp_masa_kerja.mk_grade"), "mk_grade"],
      [sequelize.col("emp_masa_kerja.mk_unit"), "mk_unit"],
      [sequelize.col("file.url"), "url_image"],
      [sequelize.col("profile.front_title_education"), "front_title_education"],
      [sequelize.col("profile.end_title_education"), "end_title_education"],
      [sequelize.col("profile.gender"), "gender"],
      [sequelize.col("profile.no_kk"), "no_kk"],
      [sequelize.col("profile.npwp"), "npwp"],
      [sequelize.col("profile.status_npwp"), "status_npwp"],
      [
        sequelize.col("profile.last_education.jurusan_pendidikan.name"),
        "jurusan",
      ],
      [
        sequelize.col("profile.last_education.jurusan_pendidikan.name"),
        "jurusan",
      ],
      [
        sequelize.col("profile.last_education.jenjang_pendidikan.jenjang"),
        "jenjang",
      ],
      [
        sequelize.literal(
          `CASE WHEN "profile->last_education"."name" IS NOT NULL THEN "profile->last_education"."name" ELSE "profile->last_education->instansi_pendidikan"."name" END`
        ),
        "instansi_pendidikan",
      ],
      [sequelize.col("profile.email_perusahaan"), "email"],
      [sequelize.col("group.description"), "employee_group"],
      [sequelize.col("subgroup.subgroup"), "employee_sub_group"],
    ],
    include: [
      // [0]
      {
        model: EmployeeMasaKerja,
        as: "emp_masa_kerja",
        attributes: [],
      },
      // [1]
      {
        model: EmployeePosition,
        as: "position",
        required: true,
        attributes: [
          ["is_main", 'main_position'],
          "npp",
          [sequelize.literal(`"position->position_detail"."level"`), 'level'],
          [sequelize.literal(`"position->position_detail->company_position"."kd_comp"`), 'kd_comp'],
          [sequelize.literal(`"position->position_detail->company_position"."name"`), 'comp'],
          [sequelize.literal(`"position->position_detail->sub_cluster_position"."name"`), 'subcluster_name'],
          [sequelize.literal(`"position->position_detail->cluster_position"."kode"`), 'cluster_kode'],
          [sequelize.literal(`"position->position_detail->cluster_position"."name"`), 'cluster_name'],
          [sequelize.literal(`"position->position_detail"."grade"`), 'grade'],
          [sequelize.literal(`"position->position_detail"."id"`), 'position_id'],
          [sequelize.literal(`"position->position_detail->job_position"."name"`), 'jab'],
          [sequelize.literal(`"position->position_detail->job_position"."id"`), 'job_id'],
          [sequelize.literal(`"position->position_detail"."name"`), 'posisi'],
          [sequelize.literal(`"position->position_detail->unit_position"."id"`), 'unit_id'],
          [sequelize.literal(`"position->position_detail->org_position"."id"`), 'org_id'],
          [sequelize.literal(`"position->position_detail->org_position"."name"`), 'org'],
          [sequelize.literal(`"position->position_detail->direktorat_position"."id"`), 'direktorat_id'],
          [sequelize.literal(`"position->position_detail->direktorat_position"."name"`), 'direktorat_name'],
          [sequelize.literal(`"position->position_detail->unit_position"."id"`), 'unit_kerja_id'],
          [sequelize.literal(`"position->position_detail->unit_position"."name"`), 'unit_kerja'],
          [sequelize.literal(`"position->position_detail->departemen_position"."id"`), 'departemen_id'],
          [sequelize.literal(`"position->position_detail->departemen_position"."name"`), 'departemen'],
          [sequelize.literal(`"position->position_detail->seksi_position"."id"`), 'section_id'],
          [sequelize.literal(`"position->position_detail->personal_area_position"."description"`), 'personal_area_name'],
          [sequelize.literal(`"position->position_detail"."kelompok_jabatan"`), 'kelompok_jabatan'],
          [sequelize.literal(`"position->position_detail->position_subgroup"."id"`), 'fungsi_jabatan_id'],
          [sequelize.literal(`"position->position_detail->position_subgroup"."subgroup"`), 'fungsi_jabatan_name'],
          [sequelize.literal(`"position->position_detail->position_subgroup"."key"`), 'fungsi_jabatan_key'],
          [sequelize.literal(`"position->position_detail->relation_unit_direktorat"."direktorat_id"`), 'direktorat_pusat_id'],
          [sequelize.literal(`"position->position_detail->relation_unit_direktorat"."direktorat_name"`), 'direktorat_pusat_name'],
        ],
        order: [
          ['is_main', 'DESC']
          // You can add more columns and their order as needed
        ],
        include: [
          // [1][0]
          {
            model: MasterPosition,
            as: "position_detail",
            attributes: [],
            required: true,
            include: [
              // [1][0][0]
              {
                model: MasterCompany,
                as: "company_position",
                attributes: [],
              },
              // [1][0][1]
              {
                model: OrganizationHierarchy,
                as: "unit_position",
                attributes: [],
              },
              // [1][0][2]
              {
                model: MasterSubCluster,
                as: "sub_cluster_position",
                attributes: [],
              },
              // [1][0][3]
              {
                model: MasterCluster,
                as: "cluster_position",
                attributes: [],
              },
              // [1][0][4]
              {
                model: MasterJob,
                as: "job_position",
                attributes: [],
              },
              // [1][0][5]
              {
                model: OrganizationHierarchy,
                as: "org_position",
                attributes: [],
              },
              // [1][0][6]
              {
                model: OrganizationHierarchy,
                as: "direktorat_position",
                attributes: [],
              },
              // [1][0][7]
              {
                model: OrganizationHierarchy,
                as: "departemen_position",
                attributes: [],
              },
              // [1][0][8]
              {
                model: OrganizationHierarchy,
                as: "seksi_position",
                attributes: [],
              },
              // [1][0][9]
              {
                model: MasterPersonalArea,
                as: "personal_area_position",
                attributes: [],
              },
              // [1][0][10]
              {
                model: MasterEmployeeSubGroup,
                as: "position_subgroup",
                attributes: []
              },
              // [1][0][11]
              {
                model: UnitDirektoratRelation,
                as: 'relation_unit_direktorat',
                attributes: []
              }
            ]
          }
        ]
      },
      // [2]
      {
        model: EmployeeProfile,
        as: "profile",
        attributes: [
          "blood_type",
          "weight",
          "height",
          "marital_status",
          ["place_of_birth", "town_of_birth"],
          "date_of_birth",
          "telephone_no",
          "bpjs_kes_no",
          "bpjs_ket_no",
          "address_ktp",
          ["city_ktp_id", "cityid_ktp"],
          ["province_ktp_id", "provinceid_ktp"],
          "address_domicile",
          ["city_domicile_id", "cityid_domicile"],
          ["province_domicile_id", "provinceid_domicile"],
          [sequelize.literal(`"profile->domicile_kecamatan"."name"`), 'domicile_kecamatan_name'],
          [sequelize.literal(`"profile->domicile_kelurahan"."name"`), 'domicile_kelurahan_name'],
          [sequelize.literal(`"profile->ktp_kecamatan"."name"`), 'ktp_kecamatan_name'],
          [sequelize.literal(`"profile->ktp_kelurahan"."name"`), 'ktp_kelurahan_name'],
          "national_identifier",
          "rt",
          "rt_domicile",
          "rw",
          "rw_domicile",
          "kd_pos",
          "kd_pos_domicile"
        ],
        required: false,
        include: [
          // [2][0]
          {
            model: EmployeeEducation,
            as: "last_education",
            attributes: [],
            include: [
              // [2][0][0]
              {
                model: MasterJenjangPendidikan,
                as: "jenjang_pendidikan",
                attributes: ["jenjang"],
                required: false,
              },
              // [2][0][1]
              {
                model: MasterJurusanPendidikan,
                as: "jurusan_pendidikan",
                attributes: ["name"],
                required: false,
              },
              // [2][0][2]
              {
                model: MasterInstansiPendidikan,
                as: "instansi_pendidikan",
                attributes: ["name"],
                required: false,
              },
            ],
          },
          // [2][1]
          {
            model: MasterReligion,
            as: "profile_religion",
            attributes: ["religion"],
            required: false,
          },
          // [2][2]
          {
            model: MasterCity,
            as: "city_ktp",
            attributes: ["description"],
            required: false,
          },
          // [2][3]
          {
            model: MasterCity,
            as: "city_domicile",
            attributes: ["description"],
            required: false,
          },
          // [2][4]
          {
            model: MasterProvince,
            as: "province_ktp",
            attributes: ["description"],
            required: false,
          },
          // [2][5]
          {
            model: MasterProvince,
            as: "province_domicile",
            attributes: ["description"],
            required: false,
          },
          // [2][6]
          {
            model: MasterKelurahan,
            as: "ktp_kelurahan",
            attributes: [],
            required: false,
          },
          // [2][7]
          {
            model: MasterKelurahan,
            as: "domicile_kelurahan",
            attributes: [],
            required: false,
          },
          // [2][8]
          {
            model: MasterKecamatan,
            as: "ktp_kecamatan",
            attributes: [],
            required: false,
          },
          // [2][9]
          {
            model: MasterKecamatan,
            as: "domicile_kecamatan",
            attributes: [],
            required: false,
          }
        ],
      },
      // [3]
      {
        model: EmployeeFile,
        as: "file",
        where: {
          type: "Profile",
        },
        attributes: [],
        required: false,
      },
      // [4]
      {
        model: MasterEmployeeGroup,
        as: "group",
        attributes: ["description"],
        required: false,
      },
      // [5]
      {
        model: MasterEmployeeSubGroup,
        as: "subgroup",
        attributes: {
          exclude: ["created_at", "updated_at", "created_by", "updated_by"],
        },
        required: false,
      },
      // [6]
      {
        model: MasterCompany,
        as: 'company_penugasan',
        attributes: [],
        required: false
      },
      // [7]
      {
        model: MasterCompany,
        as: 'company',
        attributes: [],
      }
    ],
  };

  if (Object.keys(query).length > 0) {
    let newQuery = query;
    let keys = Object.keys(newQuery);
    let values = Object.values(newQuery);
    let queryEmpPosition = []
    let queryEmployee = [];
    let queryCluster = [];
    let queryPosition = [];

    for (let i = 0; i < keys.length; i++) {
      let obj = {};
      let objCluster = {};
      let objEmpPosition = {};
      let objPosition = {};
      if (keys[i] == "nama") {
        obj["name"] = {
          [Op.iLike]: `%${values[i]}%`,
        };
        queryEmployee.push(obj);
      } else if (keys[i] == "employee_status") {
        obj["employee_status"] = values[i];
        queryEmployee.push(obj)

        if (values[i] === 'false') {
          filter.include[1].required = false;
        }

      } else if (keys[i] == "employee_group") {
        filter.include[4].where = {
          description: query.employee_group
        };
        filter.include[4].required = true;
      } else if (keys[i] == "departemen_id") {
        objPosition["departemen_id"] = values[i]
        queryPosition.push(objPosition);
      } else if (keys[i] == "unit_kerja_id") {
        objPosition["unit_kerja_id"] = values[i]
        queryPosition.push(objPosition);
      } else if (keys[i] == "direktorat_id") {
        objPosition["direktorat_id"] = values[i]
        queryPosition.push(objPosition);
      } else if (keys[i] == "seksi_id") {
        objPosition["seksi_id"] = values[i]
        queryPosition.push(objPosition);
      } else if (keys[i] == "kd_comp") {
        filter.include[1].include[0].include[0].where = {
          kd_comp: {
            [Op.iLike]: `%${query.kd_comp}%`,
          },
        };
        filter.include[1].include[0].include[0].required = true;
      } else if (keys[i] == "kd_comp_asal") {
        filter.include[7].where = {
          kd_comp: {
            [Op.iLike]: `%${query.kd_comp_asal}%`,
          },
        };
        filter.include[7].required = true;
      } else if (keys[i] == "unit_kerja") {
        filter.include[1].include[0].include[1].where = {
          name: {
            [Op.iLike]: `%${query.unit_kerja}%`,
          },
        };
        filter.include[1].include[0].include[1].required = true;
      } else if (keys[i] == "direktorat") {
        filter.include[1].include[0].include[6].where = {
          name: {
            [Op.iLike]: `%${query.direktorat}%`,
          },
        };
        filter.include[1].include[0].include[6].required = true;
      } else if (keys[i] == "grade") {
        filter.include[1].include[0].where = {
          grade: values[i].split(",")
        }
      } else if (keys[i] == "cluster") {
        objCluster["name"] = values[i].split(",")
        queryCluster.push(objCluster);
      } else if (keys[i] == "cluster_kode") {
        objCluster["kode"] = values[i].split(",")
        queryCluster.push(objCluster);
      } else if (keys[i] == "company_id") {
        queryEmployee.push({
          [Op.or]: [
            {
              "company_id_asal": values[i]
            },
            {
              "company_id_penugasan": values[i]
            }
          ]
        })
      } else {
        objEmpPosition[keys[i]] = values[i];
        queryEmpPosition.push(objEmpPosition);
      }
    }

    if (queryEmployee.length != 0) {
      filter.where = {
        [Op.and]: queryEmployee,
      };
    }

    if (queryEmpPosition.length != 0) {
      filter.include[1].where = {
        [Op.and]: queryEmpPosition,
      };
    }

    if (queryCluster.length != 0) {
      filter.include[1].include[0].include[3].where = {
        [Op.and]: queryCluster,
      };
    }

    if (queryPosition.length != 0) {
      filter.include[1].include[0].where = {
        [Op.and]: queryPosition,
      };
    }
  }

  return await Employee.findAll(filter);
};

const acquireByIdentity = async (npp, kd_comp, position_id) => {
  return await EmployeePosition.findOne({
    attributes: [
      [sequelize.col("employee_position.id"), "id"],
      ["npp", "employee_number"],
      [sequelize.col("employee_position.name"), "person_name"],
      [sequelize.col("employee_position.is_pusat"), "is_pusat"],
      "atasan_id",
      "atasan_position_id",
      [sequelize.col("position_detail.org_id"), "org_id"],
      "atasan_ap_id",
      "atasan_ap_position_id",
      [sequelize.col("position_detail.grade"), "employee_position_kd_grade"],
      [
        sequelize.fn(
          "CONCAT",
          sequelize.col(`position_detail.grade`),
          ".",
          sequelize.col(`position_detail.level`)
        ),
        "employee_position_grade",
      ],
      "position_id",
      [sequelize.col("position_detail.unit_kerja_id"), "unit_kerja_id"],
      [sequelize.col("position_detail.name"), "position_name"],
      [sequelize.literal(`"position_detail->unit_position"."name"`), 'unit_kerja_name'],
    ],
    include: [{
      model: Employee,
      as: "employee_position",
      attributes: [],
      required: true,
    },
    {
      model: MasterPosition,
      as: "position_detail",
      attributes: [
        'id',
        'name',
        [sequelize.literal(`"position_detail->unit_position"."type_organization"`), 'type_organization'],
        [sequelize.literal(`"position_detail->org_position"."name"`), 'organization_name'],
      ],
      required: true,
      include: [{
        model: OrganizationHierarchy,
        as: "unit_position",
        required: false,
        attributes: [],
      },
      {
        model: OrganizationHierarchy,
        as: "org_position",
        required: false,
        attributes: [],
      },
      {
        model: MasterJob,
        as: "job_position",
        required: false,
        attributes: ['id', 'name']
      },
      {
        model: MasterCompany,
        as: "company_position",
        required: false,
        attributes: ['kd_comp', 'name']
      }
      ]
    }
    ],
    where: {
      [Op.and]: [{
        npp: npp
      },
      {
        position_id: position_id
      },
      ]
    }
  })
};

const acquireByAtasanId = async (id) => {
  return await EmployeePosition.findAll({
    attributes: [
      [sequelize.col("employee_position.id"), "id"],
      ['npp', 'employee_number'],
      [sequelize.col("employee_position.name"), "person_name"],
      'position_id',
      [sequelize.col("position_detail.name"), "position_name"],
      [sequelize.col("position_detail.unit_kerja_id"), "unit_kerja_id"],
      [sequelize.literal(`"position_detail->unit_position"."name"`), 'unit_kerja_name'],
      [sequelize.literal(`"position_detail->unit_position"."type_organization"`), 'unit_kerja_type_org'],
      [sequelize.col("position_detail.org_id"), "organization_id"],
      [sequelize.literal(`"position_detail->org_position"."name"`), 'organization_name'],
      [sequelize.col("position_detail.grade"), "kd_grade"],
      [
        sequelize.fn(
          "CONCAT",
          sequelize.col(`position_detail.grade`),
          ".",
          sequelize.col(`position_detail.level`)
        ),
        "grade",
      ],
      [sequelize.literal(`"position_detail->company_position"."kd_comp"`), 'kd_comp'],
      [sequelize.literal(`"position_detail->company_position"."name"`), 'comp'],
      [sequelize.literal(`"position_detail->job_position"."id"`), 'job_id'],
      [sequelize.literal(`"position_detail->job_position"."name"`), 'job_name'],
    ],
    where: {
      [Op.or]: [{
        atasan_id: id
      },
      {
        atasan_ap_id: id
      }
      ]
    },
    include: [{
      model: MasterPosition,
      as: 'position_detail',
      attributes: [],
      include: [{
        model: OrganizationHierarchy,
        as: 'unit_position',
        attributes: []
      },
      {
        model: OrganizationHierarchy,
        as: 'org_position',
        attributes: []
      },
      {
        model: MasterCompany,
        as: 'company_position',
        attributes: []
      },
      {
        model: MasterJob,
        as: 'job_position',
        attributes: []
      }
      ]
    },
    {
      model: Employee,
      as: 'employee_position',
      attributes: []
    },
    ]
  })
};

const acquireInactiveNPP = async (empId) => {
  return await HistoryJabatan.findOne({
    attributes: [
      'npp',
      ['is_main', 'main_position'],
      'level',
      'grade',
      'posisi',
      [sequelize.literal(`"company"."name"`), 'comp'],
      [sequelize.literal(`"company"."kd_comp"`), 'kd_comp'],
      [sequelize.literal(`"employee->group"."description"`), 'employee_group'],
      [sequelize.literal(`"employee->subgroup"."subgroup"`), 'kelompok_jabatan'],
    ],
    where: {
      employee_id: empId,
      is_main: true
    },
    include: [
      {
        model: MasterCompany,
        as: 'company',
        attributes: []
      },
      {
        model: Employee,
        as: 'employee',
        attributes: [],
        include: [
          {
            model: MasterEmployeeGroup,
            as: 'group',
            attributes: []
          },
          {
            model: MasterEmployeeSubGroup,
            as: 'subgroup',
            attributes: []
          }
        ]
      }
    ],
    order: [["akhir_posisi", "DESC"]],
    raw: true
  })
}

const acquireDataAtasan = async (id, position_id) => {
  return await EmployeePosition.findOne({
    where: {
      [Op.and]: [{
        employee_id: id
      },
      {
        position_id: position_id
      }
      ]
    },
    attributes: [
      'npp',
      'personnel_number',
      [sequelize.col("employee_position.name"), "person_name"],
      [sequelize.col("position_detail.grade"), "employee_position_kd_grade"],
      [sequelize.col("position_detail.name"), "position_name"],
      'position_id',
      [
        sequelize.fn(
          "CONCAT",
          sequelize.col(`position_detail.grade`),
          ".",
          sequelize.col(`position_detail.level`)
        ),
        "employee_position_grade",
      ],
    ],
    include: [{
      model: Employee,
      as: 'employee_position',
      attributes: []
    },
    {
      model: MasterPosition,
      as: 'position_detail',
      include: [
        {
          model: MasterCompany,
          as: 'company_position',
          attributes: [
            ["name", "comp"], "kd_comp"
          ]
        },
        {
          model: MasterJob,
          as: 'job_position',
          attributes: ['id', 'name']
        },
        {
          model: OrganizationHierarchy,
          as: 'unit_position',
          attributes: ['id', 'name']
        }
      ]
    }
    ]
  })
}

const acquireById = async (id) => {
  return await EmployeePosition.findOne({
    attributes: [
      ["npp", "person_number"],
      [sequelize.col("employee_position.name"), "person_name"],
      [sequelize.col("position_detail.grade"), "employee_position_kd_grade"],
      [
        sequelize.fn(
          "CONCAT",
          sequelize.col(`position_detail.grade`),
          ".",
          sequelize.col(`position_detail.level`)
        ),
        "employee_position_grade",
      ],
      "position_id",
      [sequelize.col("position_detail.name"), "position_name"],
      [sequelize.col("position_detail.unit_kerja_id"), "unit_kerja_id"],
      [sequelize.literal(`"position_detail->unit_position"."name"`), 'unit_kerja_name'],
      "atasan_id",
      "atasan_ap_id",
    ],
    include: [{
      model: Employee,
      as: "employee_position",
      attributes: [],
      required: true,
    },
    {
      model: MasterPosition,
      as: "position_detail",
      attributes: [],
      required: true,
      include: [{
        model: OrganizationHierarchy,
        as: "unit_position",
        required: false,
        attributes: [],
      },
      {
        model: MasterCompany,
        as: "company_position",
        required: false,
        attributes: ['kd_comp', 'name']
      }
      ]
    }
    ]
  })
};

const acquireEmployeeByID = async (id) => {
  return await Employee.findByPk(id, { attributes: ['name', 'employee_status'], raw: true });
}

const acquireMainPosition = async (id) => {
  return await EmployeePosition.findOne(
    {
      where: { employee_id: id, is_main: true },
      attributes: [
        'npp',
        [sequelize.literal(`"employee_position"."name"`), 'name'],
        [sequelize.literal(`"employee_position"."employee_status"`), 'employee_status'],
        [sequelize.literal(`"employee_position->subgroup"."subgroup"`), 'kelompok_jabatan'],
        [sequelize.literal(`"employee_position->subgroup"."subgroup"`), 'employee_subgroup'],
        [sequelize.literal(`"employee_position->group"."description"`), 'employee_group'],
      ],
      include: [
        {
          model: MasterPosition,
          as: 'position_detail',
          attributes: [],
        },
        {
          model: Employee,
          as: 'employee_position',
          attributes: [],
          include: [
            {
              model: MasterEmployeeSubGroup,
              as: 'subgroup',
              attributes: []
            },
            {
              model: MasterEmployeeGroup,
              as: 'group',
              attributes: []
            }
          ]
        }
      ],
      raw: true
    },
  )
}

module.exports = {
  acquireAllData,
  acquireByIdentity,
  acquireById,
  acquireByAtasanId,
  acquireAllTinyData,
  acquireByDepartement,
  acquireDataAtasan,
  acquireMandatoryData,
  acquireInactiveNPP,
  acquireEmployeeByID,
  acquireMainPosition
};