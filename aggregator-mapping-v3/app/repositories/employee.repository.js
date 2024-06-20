const {
  Employee,
  EmployeeProfile,
  sequelize,
  Espt,
  OrganizationHierarchy,
  MasterPosition,
  MasterEmployeeGroup,
  EmployeeMasaKerja,
  EmployeePosition,
  MasterEmployeeSubGroup,
  MasterPersonalArea,
  MasterCompany,
  MasterJob,
  MasterBusinessArea,
  HistoryJabatan,
  EmployeeFile,
  MasterPersonalSubArea,
  MasterCluster,
  MasterSubCluster,
} = require("../../models");

const { Op, where } = require("sequelize");
const axios = require("axios");
const moment = require("moment");

async function acquireByIdentityAndComp(PersonnelNumb, comp) {
  return await Employee.findOne({
    where: {
      [Op.and]: [
        {
          personnel_number: PersonnelNumb,
        },
        {
          company_id_asal: comp,
        },
      ],
    },
  });
}

const acquireByNPPAndKdCompId = async (nppValue, companyId) => {
  return await Employee.findOne({
    attributes: ["id"],
    include: [
      {
        model: EmployeePosition,
        as: "position",
        separate: true,
        attributes: [],
        where: {
          npp: `${nppValue}`,
          // npp: nppValue
        },
      },
    ],
    where: {
      company_id_asal: companyId,
    },
    raw: true,
  });
};

const acquireByNppAndKdCompId2 = async (nppValue, companyId) => {
  const data = await EmployeePosition.findOne({
    where: {
      npp: nppValue,
    },
    attributes: ["id"],
    include: [
      {
        model: Employee,
        as: "employee_position",
        attributes: [],
        where: {
          company_id_asal: companyId,
        },
      },
    ],
  });
  // console.log(data);
  return data;
}

async function acquireByKdCompPusat() {

  return await Employee.findAll({
    attributes: [
      "id",
      [sequelize.literal(`"position"."personnel_number"`), "personnel_number"],
      [sequelize.literal(`"position"."npp"`), "npp"],
    ],
    where: {
      company_id_asal: 1,
      employee_status: true,
    },
    include: [
      {
        model: EmployeePosition,
        as: "position",
        attributes: [],
        where: {
          personnel_number: {
            [Op.not]: null,
          },
        },
      },
    ],
    raw: true,
  });
}

const acquireByKdCompPusatProvidePayslip = async (npp) => {
  let filterAll = {
    // offset: 10,
    // limit: 10,
    attributes: [
      "id",
      "company_id_asal",
      [sequelize.col("position.npp"), "npp"],
      [sequelize.col("position.personnel_number"), "personnel_number"],
      [sequelize.col("position.position_id"), "position_id"],
    ],
    where: {
      [Op.and]: [
        {
          company_id_asal: 1,
        },
        {
          employee_status: true,
        },
      ],
    },
    include: [
      {
        model: EmployeePosition,
        as: "position",
      },
    ],
  };

  if (npp) {
    filterAll.include[0].where = {
      npp: npp,
    };
  }

  return await Employee.findAll(filterAll);
};

async function acquireByKdCompPusatWithNppProvidePayslip(npp) {
  return await Employee.findAll({
    // offset: 10,
    // limit: 20,
    where: {
      [Op.and]: [
        {
          company_id_asal: 1,
        },
        {
          npp: npp,
        },
        {
          employee_status: true,
        },
      ],
    },
  });
}

const acquireEsptPensiun = async (query) => {
  let filterAll = {
    attributes: [
      [sequelize.literal(`"history_jabatan_has_one"."npp"`), "npp"],
      [sequelize.literal(`"history_jabatan_has_one->espt"."nik"`), "nik"],
      [sequelize.literal(`"history_jabatan_has_one->espt"."nama"`), "nama"],
      [sequelize.literal(`"history_jabatan_has_one->espt"."alamat"`), "alamat"],
      [sequelize.literal(`"history_jabatan_has_one->espt"."jenis_kelamin"`), "jenis_kelamin"],
      [sequelize.literal(`"history_jabatan_has_one->espt"."masa_pajak"`), "masa_pajak"],
      [sequelize.literal(`"history_jabatan_has_one->espt"."tahun_pajak"`), "tahun_pajak"],
      [sequelize.literal(`"history_jabatan_has_one->espt"."pembetulan"`), "pembetulan"],
      [sequelize.literal(`"history_jabatan_has_one->espt"."seq_no"`), "seq_no"],
      [sequelize.literal(`"history_jabatan_has_one->espt"."masa_perolehan_awal"`), "masa_perolehan_awal"],
      [sequelize.literal(`"history_jabatan_has_one->espt"."masa_perolehan_akhir"`), "masa_perolehan_akhir"],
      [sequelize.literal(`"history_jabatan_has_one->espt"."npwp"`), "npwp"],
      [sequelize.literal(`"history_jabatan_has_one->espt"."status_ptkp"`), "status_ptkp"],
      [sequelize.literal(`"history_jabatan_has_one->espt"."position"`), "position"],
      [sequelize.literal(`"history_jabatan_has_one->espt"."jml_tanggungan"`), "jml_tanggungan"],
      [sequelize.literal(`"history_jabatan_has_one->espt"."wp_luarnegeri"`), "wp_luarnegeri"],
      [sequelize.literal(`"history_jabatan_has_one->espt"."kode_negara"`), "kode_negara"],
      [sequelize.literal(`"history_jabatan_has_one->espt"."kode_pajak"`), "kode_pajak"],
      [sequelize.literal(`"history_jabatan_has_one->espt"."status_pindah"`), "status_pindah"],
      [sequelize.literal(`"history_jabatan_has_one->espt"."npwp_pemotong"`), "npwp_pemotong"],
      [sequelize.literal(`"history_jabatan_has_one->espt"."nama_pemotong"`), "nama_pemotong"],
      [sequelize.literal(`"history_jabatan_has_one->espt"."tgl_bukti_potong"`), "tgl_bukti_potong"],
      [sequelize.literal(`"history_jabatan_has_one->espt"."spt_no"`), "spt_no"],
      [sequelize.literal(`"history_jabatan_has_one->espt"."alamat"`), "alamat"],
      [sequelize.literal(`"history_jabatan_has_one->espt"."jumlah1"`), "jumlah1"],
      [sequelize.literal(`"history_jabatan_has_one->espt"."jumlah2"`), "jumlah2"],
      [sequelize.literal(`"history_jabatan_has_one->espt"."jumlah3"`), "jumlah3"],
      [sequelize.literal(`"history_jabatan_has_one->espt"."jumlah4"`), "jumlah4"],
      [sequelize.literal(`"history_jabatan_has_one->espt"."jumlah5"`), "jumlah5"],
      [sequelize.literal(`"history_jabatan_has_one->espt"."jumlah6"`), "jumlah6"],
      [sequelize.literal(`"history_jabatan_has_one->espt"."jumlah7"`), "jumlah7"],
      [sequelize.literal(`"history_jabatan_has_one->espt"."jumlah8"`), "jumlah8"],
      [sequelize.literal(`"history_jabatan_has_one->espt"."jumlah9"`), "jumlah9"],
      [sequelize.literal(`"history_jabatan_has_one->espt"."jumlah10"`), "jumlah10"],
      [sequelize.literal(`"history_jabatan_has_one->espt"."jumlah11"`), "jumlah11"],
      [sequelize.literal(`"history_jabatan_has_one->espt"."jumlah12"`), "jumlah12"],
      [sequelize.literal(`"history_jabatan_has_one->espt"."jumlah13"`), "jumlah13"],
      [sequelize.literal(`"history_jabatan_has_one->espt"."jumlah14"`), "jumlah14"],
      [sequelize.literal(`"history_jabatan_has_one->espt"."jumlah15"`), "jumlah15"],
      [sequelize.literal(`"history_jabatan_has_one->espt"."jumlah16"`), "jumlah16"],
      [sequelize.literal(`"history_jabatan_has_one->espt"."jumlah17"`), "jumlah17"],
      [sequelize.literal(`"history_jabatan_has_one->espt"."jumlah18"`), "jumlah18"],
      [sequelize.literal(`"history_jabatan_has_one->espt"."jumlah19"`), "jumlah19"],
      [sequelize.literal(`"history_jabatan_has_one->espt"."jumlah20"`), "jumlah20"],
      [sequelize.literal(`"history_jabatan_has_one->espt"."jumlah21"`), "jumlah21"],
      [sequelize.literal(`"history_jabatan_has_one->espt"."jumlah22"`), "jumlah22"],
      [sequelize.literal(`"history_jabatan_has_one->espt"."is_pensiun"`), "is_pensiun"],
    ],
    include: [
      {
        model: HistoryJabatan,
        as: "history_jabatan_has_one",
        required: true,
        attributes: [],
        include: [
          {
            model: Espt,
            as: "espt",
            required: true,
            attributes: []
          }
        ]
      }
    ]
  }

  let filterEspt = []

  if (query) {
    let obj = {}
    if (query.tahun_pajak) {
      obj.tahun_pajak = query.tahun_pajak
    }

    if (query.is_pensiun) {
      obj.is_pensiun = query.is_pensiun
    }
    filterEspt.push(obj)
  }

  if (filterEspt.length > 0) {
    filterAll.include[0].include[0].where = {
      [Op.or]: filterEspt
    }
  }


  // if(query.is_pensiun) {
  //   filterAll.include[0].include[0].where = {
  //     is_pensiun: true
  //   }
  // }

  return await Employee.findAll(filterAll);
}

const acquireEspt = async (query) => {

  // return await sequelize.query("select ep.npp as npp, mpa.description as payroll_area, mc.name as company, mp.name as unit_kerja   from employee e join employee_position ep on e.id = ep.employee_id join master_position mp on ep.position_id = mp.id join master_personal_area mpa on mp.personal_area_id = mpa.id join espt e2 on e.id = e2.employee_id join master_company mc on e.company_id_asal = mc.id and e2.tahun_pajak = '2023' and e.employee_status = true and e.is_pusat = true ")

  let filterAll = {
    // attributes: [],
    attributes: [
      // [sequelize.literal(`"position"."npp"`), "npp"],
      // [sequelize.literal(`"company"."name"`), "company_name"],
      // [sequelize.literal(`"position->position_detail"."name"`), "unit_kerja"],
      // [sequelize.literal(`"position->position_detail->personal_area_position"."description"`), "payroll_area"],
      [sequelize.literal(`"espt"."nik"`), "nik"],
      [sequelize.literal(`"espt"."nama"`), "nama"],
      [sequelize.literal(`"espt"."alamat"`), "alamat"],
      [sequelize.literal(`"espt"."jenis_kelamin"`), "jenis_kelamin"],
      [sequelize.literal(`"espt"."masa_pajak"`), "masa_pajak"],
      [sequelize.literal(`"espt"."tahun_pajak"`), "tahun_pajak"],
      [sequelize.literal(`"espt"."pembetulan"`), "pembetulan"],
      [sequelize.literal(`"espt"."seq_no"`), "seq_no"],
      [sequelize.literal(`"espt"."masa_perolehan_awal"`), "masa_perolehan_awal"],
      [sequelize.literal(`"espt"."masa_perolehan_akhir"`), "masa_perolehan_akhir"],
      [sequelize.literal(`"espt"."npwp"`), "npwp"],
      [sequelize.literal(`"espt"."status_ptkp"`), "status_ptkp"],
      [sequelize.literal(`"espt"."position"`), "position"],
      [sequelize.literal(`"espt"."jml_tanggungan"`), "jml_tanggungan"],
      [sequelize.literal(`"espt"."wp_luarnegeri"`), "wp_luarnegeri"],
      [sequelize.literal(`"espt"."kode_negara"`), "kode_negara"],
      [sequelize.literal(`"espt"."kode_pajak"`), "kode_pajak"],
      [sequelize.literal(`"espt"."status_pindah"`), "status_pindah"],
      [sequelize.literal(`"espt"."npwp_pemotong"`), "npwp_pemotong"],
      [sequelize.literal(`"espt"."nama_pemotong"`), "nama_pemotong"],
      [sequelize.literal(`"espt"."tgl_bukti_potong"`), "tgl_bukti_potong"],
      [sequelize.literal(`"espt"."spt_no"`), "spt_no"],
      [sequelize.literal(`"espt"."alamat"`), "alamat"],
      [sequelize.literal(`"espt"."jumlah1"`), "jumlah1"],
      [sequelize.literal(`"espt"."jumlah2"`), "jumlah2"],
      [sequelize.literal(`"espt"."jumlah3"`), "jumlah3"],
      [sequelize.literal(`"espt"."jumlah4"`), "jumlah4"],
      [sequelize.literal(`"espt"."jumlah5"`), "jumlah5"],
      [sequelize.literal(`"espt"."jumlah6"`), "jumlah6"],
      [sequelize.literal(`"espt"."jumlah7"`), "jumlah7"],
      [sequelize.literal(`"espt"."jumlah8"`), "jumlah8"],
      [sequelize.literal(`"espt"."jumlah9"`), "jumlah9"],
      [sequelize.literal(`"espt"."jumlah10"`), "jumlah10"],
      [sequelize.literal(`"espt"."jumlah11"`), "jumlah11"],
      [sequelize.literal(`"espt"."jumlah12"`), "jumlah12"],
      [sequelize.literal(`"espt"."jumlah13"`), "jumlah13"],
      [sequelize.literal(`"espt"."jumlah14"`), "jumlah14"],
      [sequelize.literal(`"espt"."jumlah15"`), "jumlah15"],
      [sequelize.literal(`"espt"."jumlah16"`), "jumlah16"],
      [sequelize.literal(`"espt"."jumlah17"`), "jumlah17"],
      [sequelize.literal(`"espt"."jumlah18"`), "jumlah18"],
      [sequelize.literal(`"espt"."jumlah19"`), "jumlah19"],
      [sequelize.literal(`"espt"."jumlah20"`), "jumlah20"],
      [sequelize.literal(`"espt"."jumlah21"`), "jumlah21"],
      [sequelize.literal(`"espt"."jumlah22"`), "jumlah22"],
      [sequelize.literal(`"espt"."is_pensiun"`), "is_pensiun"],
    ],
    where: {
      [Op.and]: [
        {
          employee_status: true
        },
        {
          is_pusat: true
        }
      ]
    },
    include: [
      // {
      //   model: EmployeePosition,
      //   as: "position",
      //   required: true,
      //   attributes: [],
      //   include: [
      //     {
      //       model: MasterPosition,
      //       as: "position_detail",
      //       attributes: [],
      //       required: true,
      //       include: [
      //         {
      //           model : MasterPersonalArea,
      //           as: 'personal_area_position'
      //         }
      //       ]
      //     },
      //     // {
      //     //   model: Espt,
      //     //   attributes: [],
      //     //   as: "espt_emp_pos",
      //     // }
      //   ]
      // },
      {
        model: MasterCompany,
        as: "company",
        attributes: [],
      },
      {
        model: Espt,
        as: "espt",
        where: {
          tahun_pajak: '2023'
        }
      }
    ],
  };


  // if (query) {

  //   let filteMasterPosition = [];

  //   if (query.npp) {
  //     console.log('npp')
  //     filterAll.include[0].where = {
  //       npp: query.npp,
  //     };
  //   }

  //   if (query.kd_comp) {
  //     console.log('kd_comp')
  //     filterAll.include[1].where = {
  //       kd_comp: query.kd_comp,
  //     };
  //   }

  //   // if (query.tahun_pajak) {
  //   //   filterAll.include[0].include[1].where = {
  //   //     tahun_pajak: query.tahun_pajak,
  //   //   };
  //   // }

  //   if(query.unit_kerja_id || query.personal_area_id){
  //     let obj = {};
  //     if(query.unit_kerja_id){
  //       console.log('unit_kerja_id')
  //       obj['unit_kerja_id'] = query.unit_kerja_id
  //     }

  //     if(query.personal_area_id){
  //       console.log('personal_area_id')
  //       obj['personal_area_id'] = query.personal_area_id;
  //     }
  //     filteMasterPosition.push(obj);
  //   }

  //   if(filteMasterPosition.length > 0){
  //     filterAll.include[0].include[0].where = {
  //       [Op.and] : filteMasterPosition
  //     }
  //   }

  //   // if(query.is_pensiun){
  //   //   filterAll.include[2].where = {
  //   //     is_pensiun: query.is_pensiun,
  //   //   };
  //   // }
  // }


  return await Employee.findAll(filterAll);
};

const acquireByKdCompPusatPernr = async (pernr) => {
  return await Employee.findOne({
    // offset: 10,
    // limit: 20,
    include: [
      {
        model: EmployeePosition,
        as: "position",
      },
    ],
  });
};

async function acquireByPersonnelPusat(PersonnelNumb) {
  return await Employee.findOne({
    where: {
      [Op.and]: [
        {
          personnel_number: PersonnelNumb,
        },
        {
          company_id_asal: 1,
        },
      ],
    },
    include: [
      {
        model: MasterPosition,
        as: "position",
        attributes: ["id", "name"],
      },
      {
        model: OrganizationHierarchy,
        as: "unit",
        attributes: ["id", "name"],
      },
      // {
      //     model: MasterCluster,
      //     as: 'cluster',
      //     attributes: ['id', 'name']
      // },
      // {
      //     model: MasterSubCluster,
      //     as: 'sub_cluster',
      //     attributes: ['id', 'name']
      // },
    ],
  });
}

async function acquireSyncMasaKerja() {
  return await Employee.findAll({
    attributes: [
      "id",
      "name",
      // "start_date",
      // "grade",
      // "sk_position_date",
      // "date_of_entry",
    ],
    include: [
      {
        model: EmployeePosition,
        as: "position",
        attributes: [
          [sequelize.literal(`"position_detail"."start_date"`), "start_date"],
        ],
        where: {
          is_main: true,
        },
        limit: 1,
        include: [
          {
            model: MasterPosition,
            as: "position_detail",
            attributes: [],
          },
        ],
      },
    ],
    where: {
      employee_status: true,
    },
  });
}

async function acquireAllData(filter = {}, query = null, type = null) {
  let filterAll = {
    attributes: [
      "id",
      "name",
      "is_pusat",
      "employee_status",
      "employee_group_id",
      "sap_emp_status",
      "company_id_asal",
      "company_id_penugasan",
      "employee_sub_group_id",
      "business_area_id",
      "date_of_entry",
      "is_rangkap_jabatan",
      "is_penugasan",
      [sequelize.col("emp_masa_kerja.mk_jabatan"), "mk_jabatan"],
    ],
    where: {
      employee_status: true,
    },
    include: [
      // [0]
      {
        model: EmployeePosition,
        as: "position",
        duplicating: false,
        attributes: [
          "is_main",
          "position_id",
          "npp",
          "personnel_number",
          "atasan_id",
          "atasan_position_id",
          "new_npp",
          [
            sequelize.literal(`"position->position_detail"."start_date"`),
            "start_date",
          ],
          [
            sequelize.literal(`"position->position_detail"."end_date"`),
            "end_date",
          ],
          [sequelize.literal(`"position->position_detail"."grade"`), "grade"],
          [sequelize.literal(`"position->position_detail"."job_id"`), "job_id"],
          [
            sequelize.literal(`"position->position_detail"."unit_kerja_id"`),
            "unit_kerja_id",
          ],
          [
            sequelize.literal(`"position->position_detail"."kelompok_jabatan"`),
            "kelompok_jabatan",
          ],
          [sequelize.literal(`"position->position_detail"."org_id"`), "org_id"],
          [
            sequelize.literal(`"position->position_detail"."departemen_id"`),
            "departement_id",
          ],
          [
            sequelize.literal(`"position->position_detail"."seksi_id"`),
            "section_id",
          ],
          [
            sequelize.literal(`"position->position_detail"."direktorat_id"`),
            "direktorat_id",
          ],
          "action",
          "atasan_ap_id",
          "atasan_ap_position_id",
          [
            sequelize.literal(`"position->position_detail"."sk_position_no"`),
            "sk_position_no",
          ],
          [
            sequelize.literal(`"position->position_detail"."sk_position_date"`),
            "sk_position_date",
          ],
          [
            sequelize.literal(`"position->position_detail"."personal_area_id"`),
            "personal_area_id",
          ],
          [
            sequelize.literal(
              `"position->position_detail"."personal_sub_area_id"`
            ),
            "personal_sub_area_id",
          ],
          "cost_center",
          [sequelize.literal(`"position->position_detail"."level"`), "level"],
          "ket_ap",
          [
            sequelize.literal(`"position->position_detail"."cluster_id"`),
            "cluster_id",
          ],
          [
            sequelize.literal(`"position->position_detail"."sub_cluster_id"`),
            "sub_cluster_id",
          ],
        ],
        required: true,
        include: [
          // [0][0]
          {
            model: MasterPosition,
            as: "position_detail",
            attributes: ["id", "name"],
            required: true,
            include: [
              // [0][0][0]
              {
                model: OrganizationHierarchy,
                as: "unit_position",
                attributes: ["id", "name"],
                required: false,
              },
              // [0][0][1]
              {
                model: OrganizationHierarchy,
                as: "org_position",
                attributes: ["id", "name"],
                required: false,
              },
              // [0][0][2]
              {
                model: OrganizationHierarchy,
                as: "departemen_position",
                attributes: ["id", "name"],
                required: false,
              },
              // [0][0][3]
              {
                model: OrganizationHierarchy,
                as: "direktorat_position",
                attributes: ["id", "name"],
                required: false,
              },
              // [0][0][4]
              {
                model: OrganizationHierarchy,
                as: "seksi_position",
                attributes: ["id", "name"],
                required: false,
              },
              // [0][0][5]
              {
                model: MasterPersonalArea,
                as: "personal_area_position",
                attributes: ["id", "description"],
                required: false,
              },
              // [0][0][6]
              {
                model: MasterCompany,
                as: "company_position",
                attributes: ["id", "name", "kd_comp"],
                required: false,
              },
            ],
          },
        ],
      },
      // [1]
      {
        model: EmployeeMasaKerja,
        as: "emp_masa_kerja",
        attributes: ["masa_kerja", "mk_jabatan", "mk_unit", "mk_grade"],
      },
      // [2]
      {
        model: EmployeeProfile,
        as: "profile",
        attributes: ["gender"],
      },
      // [3]
      {
        model: MasterCompany,
        as: "company",
        attributes: [],
      },
    ],
  };

  if (type == "tiny") {
    filterAll.attributes = ["id", "name"];

    filterAll.include[0].attributes = [
      "npp",
      [
        sequelize.literal(
          `"position->position_detail->company_position"."kd_comp"`
        ),
        "kd_comp",
      ],
    ];

    filterAll.include[0].include[0].include[0].attributes = [];
    filterAll.include[0].include[0].include[1].attributes = [];
    filterAll.include[0].include[0].include[2].attributes = [];
    filterAll.include[0].include[0].include[3].attributes = [];
    filterAll.include[0].include[0].include[4].attributes = [];
    filterAll.include[0].include[0].include[5].attributes = [];
    filterAll.include[0].include[0].include[6].attributes = [];
    filterAll.include[0].include[0].attributes = [];
    filterAll.include[1].attributes = [];
    filterAll.include[2].attributes = [];
  }

  if (filter) {
    filterAll.offset = filter.offset;
    filterAll.limit = filter.limit;
  }

  if (query) {
    delete query["type"];
    delete query["limit"];
    delete query["page"];
    let newQuery = query;
    let keys = Object.keys(newQuery);
    let values = Object.values(newQuery);
    let queryEmpPosition = [];
    let queryEmployee = [];

    for (let i = 0; i < keys.length; i++) {
      let obj = {};
      let objEmpPosition = {};

      if (keys[i] == "name") {
        obj["name"] = {
          [Op.iLike]: `%${values[i]}%`,
        };
        queryEmployee.push(obj);
      } else if (keys[i] == "npp") {
        objEmpPosition[keys[i]] = values[i];
        queryEmpPosition.push(objEmpPosition);
      } else if (keys[i] == "kd_comp") {
        filterAll.include[0].include[0].include[6].where = {
          kd_comp: query.kd_comp,
        };
        filterAll.include[0].include[0].include[6].required = true;
      } else if (keys[i] == "personal_area_id") {
        filterAll.include[0].include[0].where = {
          personal_area_id: query.personal_area_id,
        };
        filterAll.include[0].include[0].required = true;
      } else if (keys[i] == "kd_comp_asal") {
        filterAll.include[3].where = {
          kd_comp: query.kd_comp_asal,
        };
        filterAll.include[3].required = true;
      }
    }

    if (queryEmployee.length != 0) {
      filterAll.where = {
        [Op.and]: queryEmployee,
      };
    }

    if (queryEmpPosition.length != 0) {
      filterAll.include[0].where = {
        [Op.and]: queryEmpPosition,
      };
    }
  }

  return await Employee.findAll(filterAll);
}

async function groupByCompany(name = null, kdComp = null) {
  let getData = {
    attributes: [
      [sequelize.literal(`"position_detail->company_position"."id"`), "id"],
      [sequelize.literal(`"position_detail->company_position"."name"`), "name"],
      [
        sequelize.literal(`"position_detail->company_position"."kd_comp"`),
        "kd_comp",
      ],
      [
        sequelize.literal(`"position_detail->company_position"."active"`),
        "active",
      ],
      [
        sequelize.literal(`"position_detail->company_position"."nm_singkatan"`),
        "nm_singkatan",
      ],
      [
        sequelize.fn("COUNT", sequelize.col(`EmployeePosition.id`)),
        "count_employee",
      ],
    ],
    include: [
      // [0]
      {
        model: MasterPosition,
        as: "position_detail",
        attributes: [],
        required: true,
        include: [
          // [0][0]
          {
            model: MasterCompany,
            as: "company_position",
            attributes: [],
            required: true,
          },
        ],
      },
    ],
    group: [`position_detail->company_position.id`],
    raw: true,
  };

  let filter = [];

  if (name) {
    filter.push({
      name: name,
    });
  }

  if (kdComp) {
    filter.push({
      kd_comp: kdComp,
    });
  }

  if (filter.length > 0) {
    getData.include[0].include[0].where = {
      [Op.and]: filter,
    };

    getData.include[0].include[0].required = true;
  }

  return await EmployeePosition.findAll(getData);
}

async function groupByOrg(name = null, unit_kerja_id, relation, required) {
  let getData = {
    attributes: [
      [sequelize.fn("MAX", sequelize.literal(`"${relation}"."id"`)), "id"],
      [sequelize.literal(`"${relation}"."name"`), "name"],
      [
        sequelize.fn("MAX", sequelize.literal(`"company_position"."kd_comp"`)),
        "kd_comp",
      ],
      [sequelize.literal(`"${relation}"."parent_id"`), "parent_id"],
      [
        sequelize.literal(`"${relation}"."type_organization"`),
        "type_organization",
      ],
      [sequelize.literal(`"${relation}"."active"`), "active"],
      [
        sequelize.fn("COUNT", sequelize.col(`position_employee` + `.id`)),
        "count_employee",
      ],
    ],
    include: [
      // [0]
      {
        model: OrganizationHierarchy,
        as: relation,
        attributes: [],
        required: required,
      },
      {
        model: EmployeePosition,
        as: "position_employee",
        attributes: [],
        required: true,
      },
      {
        model: MasterCompany,
        as: "company_position",
        attributes: [],
      },
    ],
    group: [`${relation}.id`],
    raw: true,
  };

  if (name) {
    getData.include[0].where = {
      name: {
        [Op.iLike]: `%${name}%`,
      },
    };
  }

  if (unit_kerja_id || relation === "departement") {
    getData.where = { unit_kerja_id: unit_kerja_id };
  }

  return await MasterPosition.findAll(getData);
}

async function groupByOrgLearning(name = null, relation, required) {
  let getData = {
    attributes: [
      [sequelize.fn("MAX", sequelize.literal(`"${relation}"."id"`)), "id"],
      [sequelize.literal(`"${relation}"."name"`), "name"],
      // [
      //   sequelize.fn("MAX", sequelize.literal(`"company_position"."kd_comp"`)),
      //   "kd_comp",
      // ],
      // [sequelize.literal(`"${relation}"."parent_id"`), "parent_id"],
      // [
      //   sequelize.literal(`"${relation}"."type_organization"`),
      //   "type_organization",
      // ],
      // [sequelize.literal(`"${relation}"."active"`), "active"],
      // [
      //   sequelize.fn("COUNT", sequelize.col(`position_employee` + `.id`)),
      //   "count_employee",
      // ],
    ],
    include: [
      // [0]
      {
        model: OrganizationHierarchy,
        as: relation,
        attributes: [],
        required: required,
      },
      {
        model: EmployeePosition,
        as: "position_employee",
        attributes: [],
        required: true,
      },
      {
        model: MasterCompany,
        as: "company_position",
        attributes: [],
      },
    ],
    group: [`${relation}.id`],
    raw: true,
  };

  if (name) {
    getData.include[0].where = {
      name: {
        [Op.iLike]: `%${name}%`,
      },
    };
  }
  return await MasterPosition.findAll(getData);
}

async function acquireByOrganizationId(id, relation) {
  let filter = {
    attributes: [
      [sequelize.col("employee_position.id"), "id"],
      [sequelize.col("employee_position.name"), "name"],
      "npp",
      [sequelize.col("position_detail.name"), "position_name"],
    ],
    include: [
      {
        model: Employee,
        as: "employee_position",
        attributes: [],
      },
      // [1]
      {
        model: MasterPosition,
        as: "position_detail",
        attributes: [],
      },
    ],
  };

  if (relation == "direktorat") {
    filter.include[1].where = {
      direktorat_id: id,
    };
  }

  if (relation == "unit") {
    filter.include[1].where = {
      unit_kerja_id: id,
    };
  }

  if (relation == "departement") {
    filter.include[1].where = {
      departemen_id: id,
    };

    // if (unit_kerja_id) {
    //   console.log(unit_kerja_id);
    //   filter.include[1].where = {
    //     unit_kerja_id: unit_kerja_id,
    //   };
    // }
  }

  if (relation == "org") {
    filter.include[1].where = {
      org_id: id,
    };
  }

  return await EmployeePosition.findAll(filter);
}

async function acquireByOrganizationIdLearning(id, relation) {
  let filter = {
    attributes: [
      [sequelize.col("employee_position.id"), "id"],
      [sequelize.col("employee_position.name"), "name"],
      // "npp",
      // [sequelize.col("position_detail.name"), "position_name"],
    ],
    include: [
      {
        model: Employee,
        as: "employee_position",
        attributes: [],
      },
      // [1]
      {
        model: MasterPosition,
        as: "position_detail",
        attributes: [],
      },
    ],
  };

  if (relation == "direktorat") {
    filter.include[1].where = {
      direktorat_id: id,
    };
  }

  if (relation == "unit") {
    filter.include[1].where = {
      unit_kerja_id: id,
    };
  }

  if (relation == "departement") {
    filter.include[1].where = {
      departemen_id: id,
    };
  }

  if (relation == "org") {
    filter.include[1].where = {
      org_id: id,
    };
  }

  return await EmployeePosition.findAll(filter);
}

async function acquireOrgById(id) {
  return await OrganizationHierarchy.findOne({
    where: {
      id: id,
    },
  });
}

async function upsert(data) {
  return await Employee.findOne({
    where: {
      [Op.and]: [
        {
          name: data.name,
        },
        {
          company_id_asal: data.company_id_asal,
        },
      ],
    },
  }).then((obj) => {
    if (obj) {
      data.updated_by = "aggregator-data";
      return obj.update(data);
    }
    return Employee.create(data);
  });
}

async function upsertMasal(id, data) {
  return await Employee.findOne({
    where: {
      [Op.and]: [
        {
          id: id,
        },
        {
          company_id_asal: data.company_id_asal,
        },
      ],
    },
  }).then((obj) => {
    if (obj) {
      data.updated_by = "update-masal";
      return obj.update(data);
    }
    return Employee.create(data);
  });
}

async function acquireCompanyById(id) {
  return await MasterCompany.findOne({
    where: {
      id: id,
    },
  });
}

async function acquireByCompanyId(id) {
  return await Employee.findAll({
    attributes: ["id", "name"],
    where: {
      company_id_asal: id,
    },
    include: [
      {
        model: EmployeePosition,
        as: "position",
        attributes: [
          "npp",
          [
            sequelize.literal(`"position->position_detail"."name"`),
            "position_name",
          ],
        ],
        include: [
          {
            model: MasterPosition,
            as: "position_detail",
            attributes: [],
          },
        ],
      },
    ],
  });
}

async function acquireBusinessById(id) {
  return await MasterBusinessArea.findOne({
    where: {
      id: id,
    },
  });
}

// async function acquireClusterById(id) {
//     return await MasterCluster.findOne({
//         where: {
//             id: id
//         }
//     })
// }

// async function acquireSubclusterById(id) {
//     return await MasterSubCluster.findOne({
//         where: {
//             id: id
//         }
//     })
// }

async function acquirePositionById(id) {
  return await MasterPosition.findOne({
    where: {
      id: id,
    },
  });
}

async function acquireJobById(id) {
  return await MasterJob.findOne({
    where: {
      id: id,
    },
  });
}

async function acquireGroupById(id) {
  return await MasterEmployeeGroup.findOne({
    where: {
      id: id,
    },
  });
}

async function acquireSubGroupById(id) {
  return await MasterEmployeeSubGroup.findOne({
    where: {
      id: id,
    },
  });
}

async function acquireHistoryJabatanById(id) {
  let filterAll = {
    where: {
      employee_id: id,
    },
    attributes: [
      "id",
      "awal_posisi",
      "akhir_posisi",
      "konversi",
      "grade",
      "posisi",
      "unit",
      "sk_posisi",
      ["sk_position_date", "tanggal_sk"],
      [sequelize.col("company.name"), "company_name"],
      "action",
      "file_sk",
      "is_main",
      "npp",
    ],
    include: [
      {
        model: MasterCompany,
        as: "company",
        attributes: [],
      },
    ],
    order: [["akhir_posisi", "DESC"]],
  };
  return await HistoryJabatan.findAll(filterAll);
}

async function acquireBawahanPeers(position = null, id) {
  let filter = {
    attributes: ["id", "name", "is_pusat"],
    where: {
      employee_status: true,
    },
    include: [
      {
        model: EmployeePosition,
        as: "position",
        where: {
          [Op.or]: [
            {
              atasan_id: id,
            },
            {
              atasan_ap_id: id,
            },
          ],
        },
        attributes: [
          "npp",
          "atasan_id",
          "atasan_position_id",
          "personnel_number",
          "atasan_ap_id",
          [
            sequelize.fn(
              "CONCAT",
              sequelize.literal(`"position->position_detail"."grade"`),
              ".",
              sequelize.literal(`"position->position_detail"."level"`)
            ),
            "grade",
          ],
          [
            sequelize.literal(
              `"position->position_detail->company_position"."kd_comp"`
            ),
            "kd_comp",
          ],
          [sequelize.literal(`"position->position_detail"."id"`), "kd_posisi"],
          [sequelize.literal(`"position->position_detail"."name"`), "posisi"],
          [
            sequelize.literal(
              `"position->position_detail->unit_position"."id"`
            ),
            "kd_unit",
          ],
          [
            sequelize.literal(
              `"position->position_detail->unit_position"."name"`
            ),
            "unit_kerja",
          ],
          [
            sequelize.literal(`"position->position_detail->job_position"."id"`),
            "kd_jab",
          ],
          [
            sequelize.literal(
              `"position->position_detail->job_position"."name"`
            ),
            "jab",
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
              {
                model: OrganizationHierarchy,
                as: "unit_position",
                attributes: [],
              },
              {
                model: MasterJob,
                as: "job_position",
                attributes: [],
              },
            ],
          },
        ],
      },
    ],
  };

  if (position == "atasan") {
    filter = {
      attributes: ["id", "name"],
      where: {
        id: id,
      },
      include: [
        {
          model: EmployeePosition,
          as: "position",
          attributes: [
            "atasan_id",
            "npp",
            [
              sequelize.literal(
                `"position->position_detail->company_position"."kd_comp"`
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
    };
    return await Employee.findOne(filter);
  } else {
    return await Employee.findAll(filter);
  }
}

const acquireSantunanDukaById = async (id) => {
  let filterAll = [];

  return await Employee.findOne({
    where: { id: id },
    include: [
      {
        model: EmployeePosition,
        as: "position",
        include: [
          {
            model: MasterPosition,
            as: "position_detail",
            include: [
              {
                model: OrganizationHierarchy,
                as: "unit_position",
              },
            ],
          },
        ],
      },
      {
        model: HistoryJabatan,
        as: "history_jabatan",
      },
      {
        model: MasterCompany,
        as: "company",
      },
    ],
  });
};

const santunanDukaEmployeeInActive = async (id) => {
  return await Employee.findOne({
    where: { id: id },
    include: [
      {
        model: HistoryJabatan,
        as: "history_jabatan",
      },
      {
        model: MasterCompany,
        as: "company",
      },
    ],
  });
};

const santunanDukaEmployeeActive = async (id) => {
  return await Employee.findOne({
    where: { id: id },
    include: [
      {
        model: EmployeePosition,
        as: "position",
        include: [
          {
            model: MasterPosition,
            as: "position_detail",
            include: [
              {
                model: OrganizationHierarchy,
                as: "unit_position",
              },
            ],
          },
        ],
      },
      {
        model: MasterCompany,
        as: "company",
      },
    ],
  });
};

async function acquireById(id) {
  return await Employee.findOne({
    attributes: {
      exclude: ["created_at", "updated_at", "created_by", "updated_by"],
    },
    where: {
      id: id,
    },
    include: [
      {
        model: MasterEmployeeGroup,
        as: "group",
        attributes: ["id", "description"],
      },
      {
        model: MasterEmployeeSubGroup,
        as: "subgroup",
        attributes: ["id", "key", "subgroup"],
      },
      {
        model: EmployeePosition,
        as: "position",
        attributes: [
          "is_main",
          "atasan_id",
          "atasan_ap_id",
          "npp",
          "action",
          [sequelize.col("npp"), "npp"],
          [
            sequelize.literal(
              `"position->position_detail->company_position"."name"`
            ),
            "company_name",
          ],
          [sequelize.literal(`"position->position_detail"."level"`), "level"],
          [
            sequelize.literal(
              `"position->position_detail->cluster_position"."name"`
            ),
            "cluster",
          ],
          [
            sequelize.literal(
              `"position->position_detail->sub_cluster_position"."name"`
            ),
            "sub_cluster",
          ],
          [
            sequelize.literal(
              `"position->position_detail->job_position"."name"`
            ),
            "job",
          ],
          [
            sequelize.literal(`"position->position_detail"."kelompok_jabatan"`),
            "kelompok_jabatan",
          ],
          [
            sequelize.literal(`"position->position_detail"."sk_position_date"`),
            "sk_position_date",
          ],
          [
            sequelize.literal(`"position->position_detail"."sk_position_no"`),
            "sk_position_no",
          ],
          [
            sequelize.literal(`"position->position_detail"."start_date"`),
            "start_date_Position",
          ],
          [
            sequelize.literal(
              `"position->position_detail->company_position"."kd_comp"`
            ),
            "company_code",
          ],
          [
            sequelize.literal(
              `CASE WHEN "position"."atasan_id" IS NOT NULL THEN "position->atasan"."name" ELSE "position->atasan_ap"."name" END`
            ),
            "penilai_name",
          ],
          [
            sequelize.literal(
              `CASE WHEN "position"."atasan_position_id" IS NOT NULL THEN "position->atasan->position"."npp" ELSE "position->atasan_ap->position"."npp" END`
            ),
            "penilai_npp",
          ],
        ],
        include: [
          {
            model: Employee,
            as: "atasan",
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
            model: Employee,
            as: "atasan_ap",
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
            as: "position_detail",
            attributes: ["id", "name", "konversi", "grade", "file_sk"],
            include: [
              {
                model: MasterCompany,
                as: "company_position",
                attributes: ["id", "name"],
              },
              {
                model: OrganizationHierarchy,
                as: "seksi_position",
                attributes: ["id", "name"],
              },
              {
                model: OrganizationHierarchy,
                as: "departemen_position",
                attributes: ["id", "name"],
              },
              {
                model: OrganizationHierarchy,
                as: "unit_position",
                attributes: ["id", "name"],
              },
              {
                model: OrganizationHierarchy,
                as: "direktorat_position",
                attributes: ["id", "name"],
              },
              {
                model: OrganizationHierarchy,
                as: "direktorat_position",
                attributes: ["id", "name"],
              },
              {
                model: MasterPersonalArea,
                as: "personal_area_position",
                attributes: {
                  exclude: [
                    "created_at",
                    "updated_at",
                    "created_by",
                    "updated_by",
                  ],
                },
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
                model: MasterJob,
                as: "job_position",
                attributes: [],
              },
            ],
          },
        ],
      },
    ],
    order: [[sequelize.literal(`"position"."is_main"`), "ASC"]],
  });
}

const acquireDataByNppKDComp = async (NPP, kd_comp_id) => {
  const data = await Employee.findOne({
    where: {
      company_id_asal: kd_comp_id,
    },
    include: [
      {
        model: EmployeePosition,
        as: "position",
        required: true,
        where: {
          npp: NPP,
        },
      },
    ],
  });

  return data;
};

const acquireDataByNppKDComp2 = async (NPP, kd_comp_id) => {
  const data = await EmployeePosition.findOne({
    where: {
      npp: NPP,
    },
    attributes: ["employee_id"],
    include: [
      {
        model: Employee,
        as: "employee_position",
        attributes: [],
        where: {
          company_id_asal: kd_comp_id,
        },
      },
    ],
  });
  // console.log(data);
  return data;
};

const acquireLoginDataTemporary = async (auth, dataFile) => {
  // cek employee
  const dataEmployee = await Employee.findByPk(auth.employee_id, {
    include: [
      {
        model: MasterCompany,
        as: "company",
      },
      {
        model: MasterCompany,
        as: "company_penugasan",
      },
      {
        model: MasterEmployeeGroup,
        as: "group",
      },
    ],
  });

  // cek employee_position
  const dataEmployeePosition = await EmployeePosition.findOne({
    where: {
      employee_id: auth.employee_id,
      is_main: true,
    },
    include: [
      {
        model: MasterPosition,
        as: "position_detail",
        include: [
          {
            model: MasterCluster,
            as: "cluster_position",
          },
          {
            model: MasterSubCluster,
            as: "sub_cluster_position",
          },
          {
            model: MasterPersonalArea,
            as: "personal_area_position",
          },
          {
            model: MasterPersonalSubArea,
            as: "personal_sub_area_position",
          },
          {
            model: MasterCompany,
            as: "company_position",
          },
          {
            model: MasterEmployeeSubGroup,
            as: "position_subgroup",
          },
          {
            model: MasterJob,
            as: "job_position",
          },
          {
            model: OrganizationHierarchy,
            as: "unit_position",
          },
          {
            model: OrganizationHierarchy,
            as: "org_position",
            include: [
              {
                model: OrganizationHierarchy,
                as: "parent",
                include: [
                  {
                    model: OrganizationHierarchy,
                    as: "parent",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  });

  // check atasan
  const atasanId =
    dataEmployeePosition.atasan_id ?? dataEmployeePosition.atasan_ap_id;
  const dataAtasan = await EmployeePosition.findOne({
    where: {
      employee_id: atasanId,
    },
  });

  // check profile
  const dataProfile = await EmployeeProfile.findOne({
    where: {
      employee_id: auth.employee_id,
    },
    raw: true,
  });

  return {
    id: dataEmployee.id,
    employee_status: dataEmployee.employee_status,
    username: dataEmployeePosition?.npp,
    v_username: auth.username,
    role: null,
    multi_role: [],
    employee_number: null,
    kd_comp: dataEmployeePosition?.position_detail?.company_position?.kd_comp,
    kd_comp_asal: dataEmployee.company.kd_comp,
    kd_unit: dataEmployeePosition?.position_detail?.unit_kerja_id,
    kd_comp_penugasan: null,
    kelompok_jabatan: dataEmployeePosition?.position_detail?.kelompok_jabatan,
    latitude: null,
    longtitude: null,
    batas_checkin: null,
    batas_checkout: null,
    mulai_overtime: null,
    UNIQ_CODE: null,
    nm: dataEmployee.name,
    employee: {
      id: dataEmployee.id,
      person_name: dataEmployee.name,
      employee_number: dataEmployeePosition?.npp,
      national_identifier: dataProfile?.national_identifier,
      profile_id: dataProfile?.id ?? null,
      sex: dataProfile?.gender,
      original_date_of_hire: dataEmployee.start_date,
      npwp: dataProfile?.npwp,
      status_npwp: dataProfile?.status_npwp,
      emp_status: dataEmployee.sap_emp_status,
      url_image:
        dataFile?.url &&
        `${process.env.HOST}/api/v1/file?filename=${dataFile.url}`,
      person_number_sap: dataEmployeePosition?.npp,
      fungsi_jabatan:
        dataEmployeePosition?.position_detail?.position_subgroup?.subgroup,
      front_title_education: dataProfile?.front_title_education,
      end_title_education: dataProfile?.end_title_education,
      rangkap_jabatan: dataEmployee.is_rangkap_jabatan,
      sk_phk_no: null,
      sk_phk_date: null,
      phk_out_date: null,
      ket_phk: null,
      place_of_birth: dataProfile?.place_of_birth,
    },
    employee_position: {
      employee_position_id: "",
      employee_id: dataEmployee.id,
      npp: dataEmployeePosition?.npp ?? null,
      position_id: dataEmployeePosition?.position_id ?? null,
      name: dataEmployeePosition?.position_detail?.name ?? null,
      active: dataEmployee.employee_status,
      sk_position_no:
        dataEmployeePosition?.position_detail?.sk_position_no ?? null,
      start_date: dataEmployeePosition?.position_detail?.start_date ?? null,
      start_date: dataEmployeePosition?.position_detail?.end_date ?? null,
      org_id: dataEmployeePosition?.position_detail?.org_id ?? null,
      org_name:
        dataEmployeePosition?.position_detail?.org_position?.name ?? null,
      org_id_parent:
        dataEmployeePosition?.position_detail?.org_position?.parent?.id ?? null,
      org_parent_name:
        dataEmployeePosition?.position_detail?.org_position?.parent?.name ??
        null,
      org_grand_parent:
        dataEmployeePosition?.position_detail?.org_position?.parent?.parent
          ?.id ?? null,
      org_grand_parent_name:
        dataEmployeePosition?.position_detail?.org_position?.parent?.parent
          ?.name ?? null,
      unit_kerja_id:
        dataEmployeePosition?.position_detail?.unit_kerja_id ?? null,
      unit_kerja:
        dataEmployeePosition?.position_detail?.unit_position?.name ?? null,
      unit_kerja_type_org:
        dataEmployeePosition?.position_detail?.unit_position
          ?.fungsi_organisasi ?? null,
      location_id: null,
      location_name: null,
      business_area: null,
      company_code_asal: dataEmployee.company?.kd_comp ?? null,
      company_code_penugasan: dataEmployee.company_penugasan?.kd_comp ?? null,
      grade: dataEmployeePosition?.position_detail?.grade ?? null,
      subgrade: dataEmployeePosition?.position_detail?.level ?? null,
      layer: null,
      job_id: dataEmployeePosition?.position_detail?.job_position?.id ?? null,
      job_name:
        dataEmployeePosition?.position_detail?.job_position?.name ?? null,
      job_type: "",
      employee_group: dataEmployee.group?.description ?? null,
      person_number_approver: dataAtasan?.personnel_number ?? null,
      personal_area:
        dataEmployeePosition.position_detail.personal_area_position
          ?.description ?? null,
      personal_sub_area:
        dataEmployeePosition.position_detail.personal_sub_area_position
          ?.description ?? null,
      cluster_kode:
        dataEmployeePosition.position_detail.cluster_position?.kode ?? null,
      subcluster_code:
        dataEmployeePosition.position_detail.sub_cluster_position?.kode ?? null,
      subcluster_name:
        dataEmployeePosition.position_detail.sub_cluster_position?.name ?? null,
      subcluster_fungsi:
        dataEmployeePosition.position_detail.sub_cluster_position?.fungsi ??
        null,
      company_name:
        dataEmployeePosition.position_detail.company_position.name ?? null,
      kd_grade: dataEmployeePosition.position_detail.grade ?? null,
    },
  };
};

const acquireByIdLogin = async (id) => {
  return await Employee.findOne({
    where: {
      id: id,
    },
    include: [
      {
        model: EmployeePosition,
        as: "position",
        attributes: [
          [sequelize.literal(`"position"."npp"`), "npp"],
          [sequelize.literal(`"position"."npp"`), "user"],
          [sequelize.literal(`"position"."npp"`), "username"],
          [
            sequelize.literal(`"position"."personnel_number"`),
            "personnel_number",
          ],
          [
            sequelize.literal(
              `"position->position_detail->company_position"."kd_comp"`
            ),
            "kd_comp",
          ],
          [
            sequelize.literal(
              `"position->position_detail->company_position"."id"`
            ),
            "company_id",
          ],
          [
            sequelize.literal(
              `"position->position_detail->unit_position"."id"`
            ),
            "kdunit",
          ],
          [
            sequelize.literal(
              `"position->position_detail->unit_position"."name"`
            ),
            "unit",
          ],
          [
            sequelize.literal(`"position->position_detail"."id"`),
            "position_id",
          ],
          [
            sequelize.literal(`"position->position_detail"."kelompok_jabatan"`),
            "kelompok_jabatan",
          ],
          [
            sequelize.literal(
              `"position->position_detail->unit_position"."id"`
            ),
            "unit_kerja_id",
          ],
          [
            sequelize.fn(
              "CONCAT",
              sequelize.literal(`"position"."npp"`),
              sequelize.literal(
                `"position->position_detail->company_position"."kd_comp"`
              )
            ),
            "userid",
          ],
          [
            sequelize.literal(`"position->position_detail"."name"`),
            "position_name",
          ],
          [sequelize.literal(`"position->position_detail"."grade"`), "grade"],
          [sequelize.literal(`"position->position_detail"."active"`), "active"],
          [
            sequelize.literal(`"position->position_detail"."sk_position_no"`),
            "sk_position_no",
          ],
          [
            sequelize.literal(`"position->position_detail"."start_date"`),
            "start_date",
          ],
          [
            sequelize.literal(`"position->position_detail"."end_date"`),
            "end_date",
          ],
          [
            sequelize.literal(
              `"position->position_detail->org_position"."name"`
            ),
            "org_name",
          ],
          [
            sequelize.literal(
              `"position->position_detail->org_position"."parent_id"`
            ),
            "org_parent_id",
          ],
          [
            sequelize.literal(
              `"position->position_detail->org_position->parent"."name"`
            ),
            "org_parent_name",
          ],
          [
            sequelize.literal(
              `"position->position_detail->org_position->parent->parent"."id"`
            ),
            "org_grand_parent",
          ],
          [
            sequelize.literal(
              `"position->position_detail->org_position->parent->parent"."name"`
            ),
            "org_grand_parent_name",
          ],
          [
            sequelize.literal(
              `"position->position_detail->unit_position"."type_organization"`
            ),
            "type_organization",
          ],
          [
            sequelize.literal(`"position->position_detail->job_position"."id"`),
            "job_id",
          ],
          [
            sequelize.literal(
              `"position->position_detail->job_position"."name"`
            ),
            "job_name",
          ],
          [
            sequelize.literal(
              `CASE WHEN "position"."atasan_id" IS NOT NULL THEN "position->atasan"."name" ELSE "position->atasan_ap"."name" END`
            ),
            "penilai_name",
          ],
          [
            sequelize.literal(
              `CASE WHEN "position"."atasan_position_id" IS NOT NULL THEN "position->atasan->position"."npp" ELSE "position->atasan_ap->position"."npp" END`
            ),
            "penilai_npp",
          ],
          [
            sequelize.literal(
              `"position->position_detail->personal_area_position"."description"`
            ),
            "personal_area",
          ],
          [
            sequelize.literal(
              `"position->position_detail->personal_sub_area_position"."description"`
            ),
            "personal_sub_area",
          ],
          [
            sequelize.literal(
              `"position->position_detail->cluster_position"."kode"`
            ),
            "cluster_kode",
          ],
          [
            sequelize.literal(
              `"position->position_detail->sub_cluster_position"."kode"`
            ),
            "subcluster_code",
          ],
          [
            sequelize.literal(
              `"position->position_detail->sub_cluster_position"."name"`
            ),
            "subcluster_name",
          ],
          [
            sequelize.literal(
              `"position->position_detail->sub_cluster_position"."fungsi"`
            ),
            "subcluster_fungsi",
          ],
          [
            sequelize.literal(
              `"position->position_detail->company_position"."name"`
            ),
            "company_name",
          ],
          [
            sequelize.literal(`"position->position_detail"."grade"`),
            "kd_grade",
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
              {
                model: OrganizationHierarchy,
                as: "unit_position",
                attributes: [],
              },
              {
                model: OrganizationHierarchy,
                as: "org_position",
                attributes: [],
                include: [
                  {
                    model: OrganizationHierarchy,
                    as: "parent",
                    attributes: [],
                    include: [
                      {
                        model: OrganizationHierarchy,
                        as: "parent",
                        attributes: [],
                      },
                    ],
                  },
                ],
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
            ],
          },
          {
            model: Employee,
            as: "atasan",
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
            model: Employee,
            as: "atasan_ap",
            attributes: [],
            include: [
              {
                model: EmployeePosition,
                as: "position",
                attributes: [],
              },
            ],
          },
        ],
      },
      {
        model: EmployeeProfile,
        as: "profile",
      },
      {
        model: EmployeeFile,
        as: "file",
      },
      {
        model: MasterCompany,
        as: "company_penugasan",
      },
      {
        model: MasterCompany,
        as: "company",
      },
      {
        model: MasterEmployeeGroup,
        as: "group",
      },
      {
        model: MasterBusinessArea,
        as: "business",
      },
    ],
  });
};

async function acquireByPersonnel(personnelNumber) {
  return await Employee.findOne({
    where: {
      personnel_number: personnelNumber,
    },
  });
}

async function generate(data, transaction) {
  return await Employee.create(data, { transaction });
}

async function modernize(id, data) {
  return await Employee.update(data, {
    where: {
      id: id,
    },
  });
}

async function remove(id) {
  return await Employee.destroy({
    where: {
      id: id,
    },
  });
}

const acquireDataJMArsip = async (req) => {
  let params = {
    attributes: [
      [sequelize.literal(`"position"."personnel_number"`), "PersonNumber"],
      ["name", "PersonName"],
      [sequelize.literal(`"position"."npp"`), "EmployeeNumber"],
      [
        sequelize.literal(
          `CASE WHEN "Employee"."employee_status" IS TRUE THEN 'Aktif' ELSE 'Non Aktif' END `
        ),
        "EmployeeStatus",
      ],
      [sequelize.literal(`"company"."kd_comp"`), "kode_comp"],
      [
        sequelize.literal(`"position->position_detail->job_position"."id"`),
        "JobId",
      ],
      [
        sequelize.literal(`"position->position_detail->job_position"."name"`),
        "JobName",
      ],
      [
        sequelize.literal(`"position->position_detail"."id"`),
        "RecentPositionId",
      ],
      [sequelize.literal(`"position->position_detail"."name"`), "PositionName"],
      [
        sequelize.literal(
          `CASE WHEN "position"."atasan_id" IS NOT NULL THEN "position->test_atasan->employee_position"."name" ELSE "position->test_atasan_ap->employee_position"."name" END`
        ),
        "ApproverName",
      ],
      [
        sequelize.literal(
          `CASE WHEN "position"."atasan_id" IS NOT NULL THEN "position->test_atasan"."npp" ELSE "position->test_atasan_ap"."npp" END`
        ),
        "ApproverNPP",
      ],
      [
        sequelize.literal(
          `CASE WHEN "position"."atasan_id" IS NOT NULL THEN "position->test_atasan->employee_position"."name" ELSE "position->test_atasan_ap->employee_position"."name" END`
        ),
        "PositionNameAtasan",
      ],
      [
        sequelize.literal(`"position->position_detail->org_position"."id"`),
        "OrganizationId",
      ],
      [
        sequelize.literal(`"position->position_detail->org_position"."name"`),
        "OrgName",
      ],
      [
        sequelize.literal(
          `"position->position_detail->org_position->parent"."id"`
        ),
        "OrgIdParent",
      ],
      [
        sequelize.literal(
          `"position->position_detail->org_position->parent"."name"`
        ),
        "OrgParentName",
      ],
      [
        sequelize.literal(
          `"position->position_detail->org_position->parent"."id"`
        ),
        "OrgGrandParent",
      ],
      [
        sequelize.literal(
          `"position->position_detail->org_position->parent->parent"."name"`
        ),
        "OrgGrandParentName",
      ],
      [
        sequelize.literal(`"position->position_detail->unit_position"."name"`),
        "UnitKerja",
      ],
      [
        sequelize.literal(`"position->position_detail->unit_position"."id"`),
        "UnitKerjaId",
      ],
      [
        sequelize.fn(
          "CONCAT",
          sequelize.literal(`"position->position_detail"."grade"`),
          ".",
          sequelize.literal(`"position->position_detail"."level"`)
        ),
        "Golongan",
      ],
      [sequelize.literal(`"profile"."email_perusahaan"`), "EmailAddress"],
      [sequelize.literal(`"group"."description"`), "EmployeeGroup"],
      [
        sequelize.literal(`"position->position_detail"."personal_area_id"`),
        "PersonalArea",
      ],
      [
        sequelize.literal(
          `CASE WHEN "position"."atasan_id" IS NOT NULL THEN "position"."atasan_position_id" ELSE "position"."atasan_ap_position_id" END`
        ),
        "PositionIdAtasan",
      ],
      ["is_pusat", "PayrollGroupId"],
      ["employee_sub_group_id", "EmployeeSubgroup"],
      [
        sequelize.literal(`"position->position_detail"."personal_sub_area_id"`),
        "PersonalSubArea",
      ],
      [sequelize.literal(`"business"."description"`), "BusinessArea"],
      [
        sequelize.literal(`"position->position_detail"."kelompok_jabatan"`),
        "JobType",
      ],
    ],
    include: [
      {
        model: EmployeePosition,
        as: "position",
        attributes: [],
        where: {
          personnel_number: { [Op.not]: null },
          action: {
            [Op.or]: [
              {
                [Op.not]: "RANGKAP",
              },
              null,
            ],
          },
        },
        include: [
          {
            model: EmployeePosition,
            as: "test_atasan",
            attributes: [],
            include: [
              {
                model: MasterPosition,
                as: "position_detail",
                attributes: [],
              },
              {
                model: Employee,
                as: "employee_position",
                attributes: [],
              },
            ],
          },
          {
            model: EmployeePosition,
            as: "test_atasan_ap",
            attributes: [],
            include: [
              {
                model: MasterPosition,
                as: "position_detail",
                attributes: [],
              },
              {
                model: Employee,
                as: "employee_position",
                attributes: [],
              },
            ],
          },
          {
            model: MasterPosition,
            as: "position_detail",
            attributes: [],
            include: [
              {
                model: MasterJob,
                as: "job_position",
                attributes: [],
              },
              {
                model: OrganizationHierarchy,
                as: "org_position",
                attributes: [],
                include: [
                  {
                    model: OrganizationHierarchy,
                    as: "parent",
                    attributes: [],
                    include: [
                      {
                        model: OrganizationHierarchy,
                        as: "parent",
                        attributes: [],
                      },
                    ],
                  },
                ],
              },
              {
                model: OrganizationHierarchy,
                as: "unit_position",
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
        model: EmployeeProfile,
        as: "profile",
        attributes: [],
      },
      {
        model: MasterEmployeeGroup,
        as: "group",
        attributes: [],
      },
      {
        model: MasterBusinessArea,
        as: "business",
        attributes: [],
      },
    ],
    where: {},
    raw: true,
  };

  if (req.query.company_id) {
    params.where.company_id_asal = req.query.company_id;
  }

  if (req.query.employee_status) {
    params.where.employee_status = req.query.employee_status;
  }

  return await Employee.findAll(params);
};

const acquireMandatoryData = async (query = null) => {
  let filterAll = {
    include: [
      {
        model: EmployeePosition,
        as: "position",
        include: [
          {
            model: MasterPosition,
            as: "position_detail",
            include: [
              {
                model: MasterJob,
                as: "job_position",
              },
              {
                model: OrganizationHierarchy,
                as: "org_position",
              },
              {
                model: MasterPersonalArea,
                as: "personal_area_position",
              },
              {
                model: MasterPersonalSubArea,
                as: "personal_sub_area_position",
              },
            ],
          },
        ],
      },
      {
        model: MasterEmployeeGroup,
        as: "group",
      },
      {
        model: MasterEmployeeSubGroup,
        as: "subgroup",
      },
      {
        model: EmployeeProfile,
        as: "profile",
      },
    ],
  };

  return await Employee.findAll(filterAll);
};

const acquireEmployee = async (req, reFs) => {
  let filterAll = {
    attributes: ["id", "name", ["employee_status", "employee_status"]],
    include: [
      // [0]
      {
        required: true,
        model: EmployeePosition,
        attributes: [
          // [sequelize.col(`"Employee->EmployeePosition"."id"`), "test_id"],
          "id",
          ["employee_id", "employee_id"],
          ["position_id", "position_id"],
          ["npp", "npp"],
        ],
        as: "position",
        include: [
          // [0]
          {
            required: true,
            attributes: [
              "id",
              ["name", "name"],
              ["company_id", "company_id"],
              ["level", "level"],
              ["grade", "grade"],
              ["unit_kerja_id", "unit_kerja_id"],
            ],
            model: MasterPosition,
            as: "position_detail",
            include: [
              // [0]
              {
                attributes: ["id", "name", "kd_comp", "nm_singkatan"],
                model: MasterCompany,
                as: "company_position",
              },
              // [1]
              {
                attributes: ["id", "name"],
                model: OrganizationHierarchy,
                as: "unit_position",
              },
            ],
          },
        ],
      },
      {
        attributes: [
          "id",
          ["national_identifier", "national_identifier"],
          ["gender", "gender"],
          ["npwp", "npwp"],
          ["email_perusahaan", "email_perusahaan"],
          ["employee_id", "employee_id"],
        ],
        model: EmployeeProfile,
        as: "profile",
      },
      {
        attributes: [
          "id",
          ["employee_id", "employee_id"],
          ["url", "url"],
          ["type", "type"],
        ],
        model: EmployeeFile,
        as: "file",
      },
    ],
  };

  if (req.query.company_id) {
    filterAll.where = {
      company_id_asal: req.query.company_id,
    };
  }

  if (req.query.npp) {
    filterAll.include[0].where = {
      npp: req.query.npp,
    };
  }

  if (req.query.kd_comp) {
    filterAll.include[0].include[0].include[0].where = {
      kd_comp: req.query.kd_comp,
    };
    filterAll.include[0].include[0].include[0].required = true;
  }

  if (req.query.unit_id) {
    filterAll.include[0].include[0].where = {
      unit_kerja_id: req.query.unit_id,
    };
    filterAll.include[0].include[0].required = true;
  }

  return await Employee.findAll(filterAll);
};

const acquireEmployeeLearning = async (req, reFs) => {
  let filterAll = {
    attributes: ["id", "name", ["employee_status", "employee_status"], [sequelize.literal(`"group"."description"`), "employee_group"]],
    include: [
      // [0]
      {
        required: true,
        model: EmployeePosition,
        attributes: [
          // [sequelize.col(`"Employee->EmployeePosition"."id"`), "test_id"],
          "id",
          ["employee_id", "employee_id"],
          ["position_id", "position_id"],
          ["npp", "npp"],
        ],
        as: "position",
        include: [
          // [0]
          {
            required: true,
            attributes: [
              "id",
              ["name", "name"],
              ["company_id", "company_id"],
              ["level", "level"],
              ["grade", "grade"],
              ["unit_kerja_id", "unit_kerja_id"],
            ],
            model: MasterPosition,
            as: "position_detail",
            include: [
              // [0]
              {
                attributes: ["id", "name", "kd_comp", "nm_singkatan"],
                model: MasterCompany,
                as: "company_position",
              },
              // [1]
              {
                attributes: ["id", "name"],
                model: OrganizationHierarchy,
                as: "unit_position",
              },
            ],
          },
        ],
      },
      {
        attributes: [
          "id",
          ["national_identifier", "national_identifier"],
          ["gender", "gender"],
          ["npwp", "npwp"],
          ["email_perusahaan", "email_perusahaan"],
          ["employee_id", "employee_id"],
        ],
        model: EmployeeProfile,
        as: "profile",
      },
      {
        attributes: [
          "id",
          ["employee_id", "employee_id"],
          ["url", "url"],
          ["type", "type"],
        ],
        model: EmployeeFile,
        as: "file",
      },
      {
        model: MasterEmployeeGroup,
        as: "group"
      },
    ],
  };

  if (req.query.company_id) {
    filterAll.where = {
      company_id_asal: req.query.company_id,
    };
  }

  if (req.query.npp) {
    filterAll.include[0].where = {
      npp: req.query.npp,
    };
  }

  if (req.query.kd_comp) {
    filterAll.include[0].include[0].include[0].where = {
      kd_comp: req.query.kd_comp,
    };
    filterAll.include[0].include[0].include[0].required = true;
  }

  if (req.query.unit_id) {
    filterAll.include[0].include[0].where = {
      unit_kerja_id: req.query.unit_id,
    };
    filterAll.include[0].include[0].required = true;
  }

  return await Employee.findAll(filterAll);
};

module.exports = {
  acquireAllData,
  groupByOrg,
  acquireById,
  generate,
  modernize,
  remove,
  acquireOrgById,
  acquirePositionById,
  acquireJobById,
  acquireGroupById,
  acquireSubGroupById,
  acquireCompanyById,
  acquireBusinessById,
  groupByCompany,
  acquireHistoryJabatanById,
  acquireBawahanPeers,
  acquireByCompanyId,
  acquireByOrganizationId,
  acquireByIdLogin,
  // acquireClusterById,
  // acquireSubclusterById,
  acquireByPersonnel,
  upsert,
  acquireSyncMasaKerja,
  acquireByPersonnelPusat,
  acquireByKdCompPusat,
  acquireByKdCompPusatWithNppProvidePayslip,
  acquireByKdCompPusatProvidePayslip,
  acquireByIdentityAndComp,
  acquireByKdCompPusatPernr,
  acquireMandatoryData,
  upsertMasal,
  acquireDataByNppKDComp,
  acquireLoginDataTemporary,
  acquireByNPPAndKdCompId,
  acquireSantunanDukaById,
  acquireEmployee,
  acquireEmployeeLearning,
  acquireByOrganizationIdLearning,
  groupByOrgLearning,
  acquireDataByNppKDComp2,
  santunanDukaEmployeeActive,
  santunanDukaEmployeeInActive,
  acquireEspt,
  acquireDataJMArsip,
  acquireEsptPensiun,
  acquireByNppAndKdCompId2
};
