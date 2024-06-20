const repoEspt = require("../repositories/espt.repository");
const repoEmp = require("../repositories/employee.repository");
const repoCompany = require("../repositories/master/masterCompany.repository");
const repoEmpPosition = require("../repositories/employeePosition.repository");
const repoHisotryJab = require("../repositories/historyJabatan.repository")

require("dotenv").config();
let moment = require("moment");
const { Op } = require("sequelize");

async function serviceSap() {
  let now = moment("2023-12-31").format("YYYYMMDD");
  let dateNow = "20221231";

  let result = [];
  let resEmp = await repoEmp.acquireByKdCompPusat();
  for (let i = 0; i < resEmp.length; i++) {
    let response = await repoEspt.acquiredSap(now, resEmp[i].personnel_number);
    let data = response.data;
    let res = JSON.parse(JSON.stringify(data));
    result.push(res[0]);
    res.forEach(async (value) => {
      value.employee_id = resEmp[i].id;
      value.jumlah1 = value.jumlah1 ? value.jumlah1 : 0;
      value.jumlah2 = value.jumlah2 ? value.jumlah2 : 0;
      value.jumlah3 = value.jumlah3 ? value.jumlah3 : 0;
      value.jumlah4 = value.jumlah4 ? value.jumlah4 : 0;
      value.jumlah5 = value.jumlah5 ? value.jumlah5 : 0;
      value.jumlah6 = value.jumlah6 ? value.jumlah6 : 0;
      value.jumlah7 = value.jumlah7 ? value.jumlah7 : 0;
      value.jumlah8 = value.jumlah8 ? value.jumlah8 : 0;
      value.jumlah9 = value.jumlah9 ? value.jumlah9 : 0;
      value.jumlah10 = value.jumlah10 ? value.jumlah10 : 0;
      value.jumlah11 = value.jumlah11 ? value.jumlah11 : 0;
      value.jumlah12 = value.jumlah12 ? value.jumlah12 : 0;
      value.jumlah13 = value.jumlah13 ? value.jumlah13 : 0;
      value.jumlah14 = value.jumlah14 ? value.jumlah14 : 0;
      value.jumlah15 = value.jumlah15 ? value.jumlah15 : 0;
      value.jumlah16 = value.jumlah16 ? value.jumlah16 : 0;
      value.jumlah17 = value.jumlah17 ? value.jumlah17 : 0;
      value.jumlah18 = value.jumlah18 ? value.jumlah18 : 0;
      value.jumlah19 = value.jumlah19 ? value.jumlah19 : 0;
      value.jumlah20 = value.jumlah20 ? value.jumlah20 : 0;
      value.jumlah21 = value.jumlah21 ? value.jumlah21 : 0;
      value.jumlah22 = value.jumlah22 ? value.jumlah22 : 0;
      await repoEspt.upsert(value);
    });
  }
  return result;
}

async function getAllDataEspt(req) {
  let maps = [];
  let maps2 = [];
  let position;

  if(req.query.is_pensiun === "true"){
    const data = await  repoEspt.esptPensiun(req.query);
    // console.log(data)
    const newData = data.map(item => {
      // Create a new object with the existing properties and add a new property
      return {
        unit_kerja: '',
        kd_comp: 'JSMR',
        payroll_area: '',
        ...item.get({ plain: true }), // Convert the Sequelize instance to a plain JavaScript object
      };
    });

    return newData
  }

  return await repoEspt.esptPusat(req.query);
}

const getEsptEmp = async () => {

}


module.exports = {
  serviceSap,
  getAllDataEspt,
};
