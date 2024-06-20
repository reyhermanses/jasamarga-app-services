const {
  Espt,
  Employee,
  EmployeePosition,
  MasterPersonalArea,
  MasterPosition,
  MasterCompany,
  OrganizationHierarchy,
  HistoryJabatan,
  sequelize
} = require("../../models");

require("dotenv").config();

let axios = require("axios");

const { Op } = require("sequelize");

async function acquiredSap(dateNow, npp) {
  const response = await axios.post(
    `${process.env.SAP_URL}` +
      `?sap-client=120&mode=07&changedate=` +
      dateNow +
      `&pernr=` +
      npp,
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

async function upsert(data) {
  return await Espt.findOne({
    where: {
      employee_id: data.employee_id,
      tahun_pajak: data.tahun_pajak,
    },
  }).then((obj) => {
    if (obj) {
      data.updated_by = "aggregator-data";
      console.log("updated");
      return obj.update(data);
    }
    console.log("created");
    data.created_by = "aggregator-data";
    return Espt.create(data);
  });
}

async function acquiredAllDataEspt(npp = null, kd_comp = null) {
  let filterAll = {
    attributes: ["id", "npp", "name", "company_id_asal"],
    include: [
      {
        model: Espt,
        as: "espt",
      },
    ],
  };

  let where = {
    [Op.and]: [
      {
        npp: npp,
      },
      {
        company_id_asal: kd_comp,
      },
    ],
  };


  filterAll.where = where;


  return Employee.findOne(filterAll);
}

const acquireAllEspt = async (query) => {
  let filterAll = {
    include: [
      {
        model: Employee,
        as: "employee",
        include: [
          {
            model: EmployeePosition,
            as: "position",
          },
          {
            model: MasterCompany,
            as: "company",
          },
        ],
      },
    ],
  };

  if (query) {
    // console.log("ada");
    if (query.npp) {
      filterAll.include[0].include[0].where = {
        npp: query.npp,
      };
    }

    // if (query.kd_comp) {
    //   filterAll.include[0].include[1].where = {
    //     kd_comp: query.kd_comp,
    //   };
    // }
  }

  console.log(JSON.stringify(filterAll));

  return await Espt.findAll(filterAll);
};

async function acquireTahunPajakEmployeeId(tahun_pajak, employee_id) {
  let filterAll = {
    where: {
      [Op.and]: [
        {
          tahun_pajak: tahun_pajak,
        },
        {
          employee_id: employee_id,
        },
      ],
    },
  };

  return await Espt.findOne(filterAll);
}

const esptPensiun = async (query) => {
  let filterAll = {
    attributes: [
    // [sequelize.literal(`DISTINCT "history_jabatan"."npp"`), "npp"], 
    // [sequelize.literal(`"history_jabatan->position->position_detail->personal_area_position"."description"`), "payroll_area"],
    [sequelize.literal(`"employee->history_jabatan->company"."name"`), "company_name"],
    // [sequelize.literal(`"employee->history_jabatan->company"."kd_comp"`), "kd_comp"],
    // [sequelize.literal(`"employee->history_jabatan"."unit"`), "unit_kerja"],
    [sequelize.literal(`"employee->history_jabatan"."npp"`), "npp"],
     "nik",
     "nama",
     "alamat",
     "jenis_kelamin",
     "masa_pajak",
     "tahun_pajak",
     "pembetulan",
     "seq_no",
     "masa_perolehan_awal",
     "masa_perolehan_akhir",
     "npwp",
     "status_ptkp",
     "position",
     "jml_tanggungan",
     "wp_luarnegeri",
     "kode_negara",
     "kode_pajak",
     "status_pindah",
     "npwp_pemotong",
     "nama_pemotong",
     "tgl_bukti_potong",
     "spt_no",
     "alamat",
     "jumlah1",
     "jumlah2",
     "jumlah3",
     "jumlah4",
     "jumlah5",
     "jumlah6",
     "jumlah7",
     "jumlah8",
     "jumlah9",
     "jumlah10",
     "jumlah11",
     "jumlah12",
     "jumlah13",
     "jumlah14",
     "jumlah15",
     "jumlah16",
     "jumlah17",
     "jumlah18",
     "jumlah19",
     "jumlah20",
     "jumlah21",
     "jumlah22",
     "is_pensiun",
    ],
    include: [ 
      {
        model: Employee,
        attributes: [],
        required: true,
        as: "employee",
        include: [
          {
            model: HistoryJabatan,
            as: "history_jabatan",
            required: true,
            attributes: [],
            include: [
              {
                model: MasterCompany,
                as: "company",
                attributes: []
              }
            ],
          }
        ]
      }
    ],
    distinct: true
  }
  let filterEspt = []

  if(query){

    if(query.kd_comp){
      filterAll.include[0].include[0].where = {
        kd_comp: query.kd_comp
      }
    }


    let obj = {}
    if(query.tahun_pajak){
      obj.tahun_pajak = query.tahun_pajak
    }
    
    if(query.is_pensiun){
      obj.is_pensiun = query.is_pensiun
    }

    filterEspt.push(obj)

    if(query.npp){
      console.log(query.npp)
      filterAll.include[0].include[0].where = {
        npp: query.npp
      }
    }
    
  }

  if(filterEspt.length > 0 ){
    filterAll.where = {
      [Op.or]: filterEspt
    }
  }
  
  return await Espt.findAll(filterAll)
}

const esptPusat = async (query) => {

  let filterAll = {
    attributes: [
    [sequelize.literal(`"employee->position->position_detail->personal_area_position"."description"`), "payroll_area"],
    [sequelize.literal(`"employee->company"."name"`), "company_name"],
    [sequelize.literal(`"employee->company"."kd_comp"`), "kd_comp"],
    [sequelize.literal(`"employee->position->position_detail->unit_position"."name"`), "unit_kerja"],
    [sequelize.literal(`"employee->position"."npp"`), "npp"],
     "nik",
     "nama",
     "alamat",
     "jenis_kelamin",
     "masa_pajak",
     "tahun_pajak",
     "pembetulan",
     "seq_no",
     "masa_perolehan_awal",
     "masa_perolehan_akhir",
     "npwp",
     "status_ptkp",
     "position",
     "jml_tanggungan",
     "wp_luarnegeri",
     "kode_negara",
     "kode_pajak",
     "status_pindah",
     "npwp_pemotong",
     "nama_pemotong",
     "tgl_bukti_potong",
     "spt_no",
     "alamat",
     "jumlah1",
     "jumlah2",
     "jumlah3",
     "jumlah4",
     "jumlah5",
     "jumlah6",
     "jumlah7",
     "jumlah8",
     "jumlah9",
     "jumlah10",
     "jumlah11",
     "jumlah12",
     "jumlah13",
     "jumlah14",
     "jumlah15",
     "jumlah16",
     "jumlah17",
     "jumlah18",
     "jumlah19",
     "jumlah20",
     "jumlah21",
     "jumlah22",
     "is_pensiun",
    ],
    include: [ 
      {
        model: Employee,//include[0]
        as: 'employee',
        attributes: [],
        required:true,
        where: {
          is_pusat: true,
          employee_status: true
        },
        include: [ 
          {
            model: MasterCompany,//include[0]
            as: "company",
            attributes: []
          },
          {
            model: EmployeePosition,//include[1]
            as: "position",
            required: true,
            attributes: [],
            include: [
              {
                model: MasterPosition, //include[0]
                as: "position_detail",
                required: true,
                attributes: [],
                include: [
                  {
                    model: MasterPersonalArea, //include[0]
                    as: "personal_area_position",
                    attributes: [],
                  },
                  {
                    model: OrganizationHierarchy,
                    as: "unit_position",
                    attributes: []
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }

  if(query){
    let filteMasterPosition = [];
    let filterEspt = [];
    let obj1 = {}


    if(query.npp){
      filterAll.include[0].include[1].where = {
        npp: query.npp
      }
    }

    if(query.kd_comp){
      filterAll.include[0].include[0].where = {
        kd_comp: query.kd_comp
      }
    }


    if(query.tahun_pajak || query.is_pensiun){
      if(query.tahun_pajak){
        obj1.tahun_pajak = query.tahun_pajak
      }
      
      if(query.is_pensiun){
        obj1.is_pensiun = query.is_pensiun
      }
      filterEspt.push(obj1)
    }


    if(query.unit_kerja_id || query.personal_area_id){
      let obj = {};
      if(query.unit_kerja_id){
        obj['unit_kerja_id'] = query.unit_kerja_id
      }

      if(query.personal_area_id){
        obj['personal_area_id'] = query.personal_area_id;
      }  
      filteMasterPosition.push(obj);        
    }
    
    if(filteMasterPosition.length > 0){
      filterAll.include[0].include[1].include[0].where = {
        [Op.and] : filteMasterPosition
      }
    }

    if(filterEspt.length > 0 ){
      filterAll.where = {
        [Op.or]: filterEspt
      }
    }    
  }
  return await Espt.findAll(filterAll)
}

module.exports = {
  acquiredSap,
  acquiredAllDataEspt,
  upsert,
  acquireTahunPajakEmployeeId,
  acquireAllEspt,
  esptPusat,
  esptPensiun
};
