const {
  Employee,
  Payslip1,
  EmployeePosition,
  MasterPosition,
  SantunanDuka1,
  OrganizationHierarchy,
  MasterJob,
  MasterCompany,
  MasterEmployeeGroup,
  HistoryJabatan,
  sequelize,
} = require("../../models");

let axios = require("axios");
let moment = require("moment");

const { Op, and } = require("sequelize");

async function acquireDataSAP(nppOrPn, dateNow, type) {
  const response = await axios.post(
    `${process.env.SAP_URL}` +
      `?sap-client=120&mode=06&pernr=` +
      nppOrPn +
      `&payment_date=` +
      dateNow +
      `&payroll_type=` +
      type +
      `&changedate=` +
      dateNow,
    {},
    {
      auth: {
        username: `${process.env.SAP_USER}`,
        password: `${process.env.SAP_PASSWORD}`,
      },
    }
  );
  return response;
}

async function generate(data) {
  return await Payslip1.create(data);
}

async function insertOrUpdate(data) {
  data.updated_by = "aggregator-data";
  return await Payslip1.findOne({
    where: {
      [Op.and]: [
        {
          employee_id: data.employee_id,
        },
        {
          periode: data.periode,
        },
        {
          type: data.type,
        },
      ],
    },
  }).then((obj) => {
    if (obj) {
      data.updated_by = "aggregator-data";
      return obj.update(data);
    }
    return Payslip1.create(data);
  });
}

async function acquireAllDataPayslip1(filter = {}, query = null) {
  console.log(query);

  let filterAll = {
    attributes: ["id", "npp", "name", "company_id_asal"],
    include: [
      {
        model: Payslip1,
        as: "payslip1",
      },
    ],
  };

  if (filter) {
    filterAll.limit = filter.limit;
  }

  if (query) {
    // delete query["limit"]
    let keys = Object.keys(query);
    let values = Object.values(query);
    let queryFilter = [];
    let queryFilterPayslip = [];

    for (let i = 0; i < keys.length; i++) {
      if (keys[i] == "npp") {
        let obj = {};
        if (keys[i] == "npp") {
          obj[keys[i]] = {
            [Op.iLike]: `%${values[i]}%`,
          };
        }
        queryFilter.push(obj);
      } else {
        let obj = {};
        if (keys[i] == "periode") {
          obj[keys[i]] = values[i];
        }

        if (keys[i] == "type") {
          obj[keys[i]] = {
            [Op.iLike]: `%${values[i]}%`,
          };
        }

        queryFilterPayslip.push(obj);
      }
    }

    if (queryFilter.length != 0) {
      filterAll.where = {
        [Op.and]: queryFilter,
      };
    }

    if (queryFilterPayslip.length != 0) {
      filterAll.include[0].where = {
        [Op.and]: queryFilterPayslip,
      };
    }
  }

  return await Employee.findAll(filterAll);
}

async function acquiredAllData(filter = {}, query = null) {
  let filterAll = {
    attributes: {
      include: [
        "id",
        ["name", "name"],
        [
          sequelize.literal(
            `CASE WHEN "Employee"."employee_status" IS TRUE THEN 'Non Pensiun' ELSE 'Pensiun' END`
          ),
          "status",
        ],
        [
          sequelize.literal(
            `"employeePosition->position_detail->company_position"."kd_comp"`
          ),
          "kd_comp",
        ],
        [sequelize.literal(`"employeePosition"."npp"`), "npp"],
        [
          sequelize.literal(`"employeePosition"."personnel_number"`),
          "personnel_number",
        ],
        [
          sequelize.literal(
            `"employeePosition->position_detail->unit_position"."name"`
          ),
          "unit_kerja",
        ],
        [
          sequelize.literal(
            `"employeePosition->position_detail->company_position"."name"`
          ),
          "company",
        ],
        [
          sequelize.literal(
            `"employeePosition->position_detail"."personal_area_id"`
          ),
          "personal_area",
        ],
        [
          sequelize.literal(
            `"employeePosition->position_detail"."unit_kerja_id"`
          ),
          "unit_id",
        ],
        [
          sequelize.literal(`"employeePosition->position_detail"."grade"`),
          "grade",
        ],
        [sequelize.literal(`"employeePosition"."position_id"`), "position_id"],
        // [
        //   sequelize.literal(
        //     `CASE WHEN "history_jabatan"."posisi" IS NOT NULL THEN "history_jabatan"."posisi" ELSE "employeePosition->position_detail"."name" END`
        //   ),
        //   'position_name'
        // ],
        [
          sequelize.literal(`"employeePosition->position_detail"."name"`),
          "position_name",
        ],
        [sequelize.literal(`"group"."description"`), "employee_group"],
        // [
        //   // "history_jabatan"."employee_id" =
        //   sequelize.literal(
        //     `CASE WHEN "history_jabatan"."awal_posisi" <= '${mapDate}' AND "history_jabatan"."akhir_posisi" >= '${mapDate}' THEN "history_jabatan"."posisi" ELSE "employeePosition->position_detail"."name" END`
        //   ),
        //   'position_name_test'
        // ]
      ],
      exclude: [
        "created_at",
        "updated_at",
        "created_by",
        "updated_by",
        "company_id_asal",
        "employee_group_id",
        "employee_sub_group_id",
        "company_id_penugasan",
        "business_area_id",
        "date_of_entry",
        "is_rangkap_jabatan",
        "is_penugasan",
        "sap_emp_status",
        //   "employee_status",
        "is_pusat",
      ],
    },
    include: [
      {
        model: EmployeePosition,
        as: "employeePosition",
        required: true,
        include: [
          {
            model: MasterPosition,
            as: "position_detail",
            include: [
              {
                model: OrganizationHierarchy,
                as: "unit_position",
              },
              {
                model: OrganizationHierarchy,
                as: "departemen_position",
              },
              {
                model: MasterJob,
                as: "job_position",
              },
              {
                model: MasterCompany,
                as: "company_position",
                required: true,
              },
            ],
          },
        ],
      },
      {
        model: Payslip1,
        as: "payslip1",
        include: [
          {
            model: Employee,
            as: "employee",
            attributes: [],
          },
        ],
      },
      {
        model: MasterEmployeeGroup,
        as: "group",
        attributes: [],
      },
      {
        model: HistoryJabatan,
        as: "history_jabatan",
        required: false,
        // attributes: {
        //   include: [
        //     [
        //       sequelize.literal(
        //         `CASE WHEN "history_jabatan"."awal_posisi" < '${mapDate}' AND "history_jabatan"."akhir_posisi" > '${mapDate}' THEN true ELSE false END`
        //       ),
        //       'is_exist'
        //     ]
        //   ],
        //   exclude: ['created_at', 'updated_at', 'created_by', 'updated_by']
        // }
        // where: sequelize.where(
        //   sequelize.fn('date', sequelize.col('awal_posisi')),
        //   '<',
        // //   `"payslip1"."periode`
        //     // '2016-10-10'
        //     mapDate
        // )

        // where: {
        //   awal_posisi: {
        //     [Op.lte]: [
        //       sequelize.literal(`CAST("payslip1"."periode" as DATE)`),
        //       'periode'
        //     ]
        //     // [Op.lte]: moment([sequelize.literal(`"payslip1"."periode`), 'periode']).format('YYYY-MM-DD')
        //   },
        //   akhir_posisi: {
        //     [Op.gte]: mapDate
        //   }
        // }
      },
    ],
  };

  if (filter) {
    filterAll.limit = filter.limit;
  }

  /**
   * unit kerja id & personal id di master position
   * npp di employee position
   */

  if (query) {
    delete query["limit"];
    let keys = Object.keys(query);
    let values = Object.values(query);
    let queryFilter = [];
    let queryFilterPayslip = [];
    let queryFilterEmployeePosition = [];
    let queryFilterMasterPosition = [];

    for (let i = 0; i < keys.length; i++) {
      if (keys[i] == "npp") {
        let obj = {};
        if (keys[i] == "npp") {
          obj[keys[i]] = {
            [Op.iLike]: `%${values[i]}%`,
          };
        }
        queryFilterEmployeePosition.push(obj); //filter Employee
      } else if (keys[i] == "personal_area_id" || keys[i] == "unit_kerja_id") {
        let obj = {};
        if (keys[i] == "personal_area_id") {
          obj[keys[i]] = values[i];
        }
        if (keys[i] == "unit_kerja_id") {
          obj[keys[i]] = values[i];
        }
        queryFilterMasterPosition.push(obj);
      } else {
        if(keys[i] !== "kd_comp"){
          let obj = {};
          obj[keys[i]] = {
            [Op.iLike]: `%${values[i]}%`,
          };
          queryFilterPayslip.push(obj); //filter Payslip
        }
      }
    }

    if (queryFilterEmployeePosition.length != 0) {
      filterAll.include[0].where = {
        [Op.and]: queryFilterEmployeePosition,
      };
    } //employee position

    if (queryFilterMasterPosition.length != 0) {
      filterAll.include[0].include[0].where = {
        [Op.and]: queryFilterMasterPosition,
      };
    } //master position

    if (queryFilterPayslip.length != 0) {
      filterAll.include[1].where = {
        [Op.and]: queryFilterPayslip,
      };
    } //payslip
  }

  filterAll.include[0].attributes = [];
  filterAll.include[0].include[0].attributes = [];
  filterAll.include[0].include[0].include[0].attributes = [];
  filterAll.include[0].include[0].include[1].attributes = [];
  filterAll.include[0].include[0].include[2].attributes = [];
  filterAll.include[0].include[0].include[3].attributes = [];

  return await Employee.findAll(filterAll);
}

// async function acquiredAllData(filter = {}, query = null) {

//     let filterAll = {
//         attributes: ['id', 'name', 'company_id_asal', 'personnel_number', 'unit_kerja_id', 'personal_area_id', 'grade', 'position_id', 'employee_group_id'],
//         include: [{
//             model: Payslip1,
//             as: 'payslip1',
//         }]
//     };

//     if (filter) {
//         filterAll.limit = filter.limit
//     }

//     if (query) {
//         delete query["limit"]
//         let keys = Object.keys(query)
//         let values = Object.values(query)
//         let queryFilter = []
//         let queryFilterPayslip = []

//         // console.log(`test ${keys}`)

//         // return 'done'

//         for (let i = 0; i < keys.length; i++) {
//             if (keys[i] == 'npp' || keys[i] == 'personal_area_id' || keys[i] == 'unit_kerja_id') {
//                 let obj = {};
//                 if (keys[i] == 'personal_area_id') {
//                     obj[keys[i]] = values[i]
//                 }
//                 if (keys[i] == 'unit_kerja_id') {
//                     obj[keys[i]] = values[i]
//                 }
//                 if (keys[i] == 'npp') {
//                     obj[keys[i]] = {
//                         [Op.iLike]: `%${values[i]}%`
//                     }
//                 }
//                 queryFilter.push(obj) //filter Employee

//             } else {
//                 let obj = {};
//                 obj[keys[i]] = {
//                     [Op.iLike]: `%${values[i]}%`
//                 }
//                 queryFilterPayslip.push(obj) //filter Payslip
//             }
//         }

//         if (queryFilter.length != 0) {
//             filterAll.where = {
//                 [Op.and]: queryFilter
//             }
//         }

//         if (queryFilterPayslip.length != 0) {
//             filterAll.include[0].where = {
//                 [Op.and]: queryFilterPayslip
//             }
//         }
//     }

//     return await Employee.findAll(
//         filterAll
//     )
// }

async function acquireIfPayslipExist() {
  filterAll = {
    attributes: ["employee_id", "periode"],
  };

  return await Payslip1.findAll(filterAll);
}

async function upsert(data) {
  data.updated_by = "aggregator-data";
  return await Payslip1.update(data, {
    where: {
      [Op.and]: [
        {
          npp: data.npp,
        },
        {
          periode: data.periode,
        },
        {
          kd_comp: data.kd_comp,
        },
        {
          type: data.type,
        },
      ],
    },
  });
}

async function upsertTest(data) {
  // return data.is_publish
  console.log([data.npp, data.periode, data.kd_comp, data.type]);
}

async function acquiredByTypeNppPeriode(type, npp, periode) {
  let filterAll = {
    where: {
      [Op.and]: [
        {
          type: type,
        },
        {
          npp: npp,
        },
        {
          periode: periode,
        },
      ],
    },
  };

  return await Payslip1.findOne(filterAll);
}

module.exports = {
  acquireDataSAP,
  acquireAllDataPayslip1,
  acquiredAllData,
  upsert,
  upsertTest,
  acquireIfPayslipExist,
  generate,
  insertOrUpdate,
  acquiredByTypeNppPeriode,
};
