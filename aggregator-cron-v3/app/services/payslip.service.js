const respository = require("../repositories/payslip.repository");
const employeeRepository = require("../repositories/omAction.repository");
const repoPayslip = require("../repositories/payslip.repository");
const repoBankDetail = require("../repositories/bank_detail.repository");
const repoBankName = require("../repositories/master/masterBankKey.repository");
const repoProfile = require("../repositories/employee_profile.repository")

const moment = require("moment");

const getData = async (req, res) => {

  const { date_now, npp } = req.body;

  let dateNow = date_now ? moment(date_now).format("YYYYMM") : "20231216";
  let type = "regular";
  // let dataNpp = npp | null
  let temp = {};

  const responseEmployee = await employeeRepository.acquireDataPayslip(npp);

  const emp = JSON.parse(JSON.stringify(responseEmployee));

  if (emp.length === 0) {
    const error = new Error("Data not Found");
    error.statusCode = 404;
    throw error;
  }

  for (let current = 0; current < emp.length; current++) {
    let nppOrPn = await checkNpp(
      emp[current].npp,
      emp[current].personnel_number
    );
    if (nppOrPn) {
      let responseJson = await repoPayslip.acquireDataSAP(
        nppOrPn,
        dateNow,
        type
      );

      let responseFiltered = responseJson.data;

      if (responseFiltered.length > 0) {
        for (let i = 0; i < responseFiltered.length; i++) {
          if (responseFiltered[i].description !== "") {
            key = responseFiltered[i].description.replace(/ /g, "_");
            key = key.replace(/\W/g, "_");
            key = key.replace(/[_]+/g, "_");
            if (key.length > 30) {
              let str = key.length - 30;
              let temp_count = key.length - str;
              temp[key.substring(0, temp_count).toLowerCase()] =
                key.toLowerCase() !== "periode"
                  ? responseFiltered[i].value.replace(/\W/g, "")
                  : responseFiltered[i].value;
            } else
              temp[key.toLowerCase()] =
                key.toLowerCase() !== "periode"
                  ? responseFiltered[i].value
                  : responseFiltered[i].value;
          } else console.log("has no data");
        }

        if (Object.keys(temp).length > 0) {
          let resBankDetail = await repoBankDetail.aquiredByEmployeeId(
            emp[current].id
          );

          if (resBankDetail !== null) {
            if (Object.values(resBankDetail).length > 0) {
              let bankName = await repoBankName.acquireByBankKey(
                resBankDetail.bank_key
              );
              temp["bank_account"] =
                resBankDetail.bank_key !== null ? resBankDetail.bank_key : null;
              temp["bank_name"] = bankName !== null ? bankName.bank_name : null;
            }
          }

          let employee_id = emp[current].id;

          //get current ptkp from employee profile
          const dataProfile = JSON.parse(JSON.stringify(await repoProfile.acquiredOne(employee_id)));

          temp["employee_id"] = employee_id;
          temp["periode"] = moment(dateNow).format("YYYYMM");
          temp["dpp_skjm_10"] = temp["10_dpp_skjm"] ? temp["10_dpp_skjm"] : 0;
          temp["dpc_skjm_90"] = temp["90_dpc_skjm"] ? temp["90_dpc_skjm"] : 0;
          temp["pay_type"] = 1;
          temp["type"] = type;
          temp["personnel_no"] = temp["personnel_no"];
          temp["npp"] = emp[current].npp;
          temp["kd_comp"] = emp[current].company_id_asal;
          temp["published"] = 0;
          temp["position_id"] = emp[current].position_id;
          temp["gaji_pokok_info"] = temp["gaji_pokok_info"];
          temp["tunj_pos_struk_tambahan"] = temp["tunj_pos_struk_tambahan"];
          temp["tunj_posisi_fungsional_tambaha"] =
            temp["tunj_pos_fungs_tambahan"];
          temp["status_ptkp"] = dataProfile ? dataProfile.status_npwp : '-';
          temp["rapel_tunjangan"] = temp["rapel_tunjangan"]

          if (employee_id !== null) {
            await repoPayslip.insertOrUpdate(temp);
          }
        }
      }
    }
  }
  return "done";
};

async function checkNpp(npp, personnel_no) {
  if (
    npp.startsWith("D") === true ||
    npp.startsWith("K") === true ||
    npp.startsWith("A") === true ||
    npp.startsWith("P") === true ||
    npp.startsWith("TPP") === true
  )
    return personnel_no;
  else return npp;
}

const getDataSAPOffcycle = async (req) => {

  let runDayPayslip = moment(Date.now()).format("DD");

  const { date_now, npp } = req;

  let dateNow = date_now ? moment(date_now).format("YYYYMMDD") : "20231216";
  let dataNpp = npp ? npp : ""
  let temp = {};

  let payrolType = ["offcycle", "off_cycle", "regular"];
  var key;


  // const emp = await repoEmp.acquireByKdCompPusatWithNppProvidePayslip(npp)
  const responseEmployee = await employeeRepository.acquireDataPayslip(npp);
  const emp = JSON.parse(JSON.stringify(responseEmployee));

  // for (let pt = 0; pt < payrolType.length; pt++) {

  for (let current = 0; current < emp.length; current++) {
    let nppOrPn = await checkNpp(
      emp[current].npp,
      emp[current].personnel_number
    );

    if (nppOrPn) {
      let responseJson = await repoPayslip.acquireDataSAP(
        nppOrPn,
        dateNow,
        payrolType[0]
      );

      let responseFiltered = responseJson.data;

      if (responseFiltered.length > 0) {
        for (let i = 0; i < responseFiltered.length; i++) {
          if (responseFiltered[i].description !== "") {
            key = responseFiltered[i].description.replace(/ /g, "_");
            key = key.replace(/\W/g, "_");
            key = key.replace(/[_]+/g, "_");
            if (key.length > 30) {
              let str = key.length - 30;
              let temp_count = key.length - str;
              temp[key.substring(0, temp_count).toLowerCase()] =
                key.toLowerCase() !== "periode"
                  ? responseFiltered[i].value.replace(/\W/g, "")
                  : responseFiltered[i].value;
            } else
              temp[key.toLowerCase()] =
                key.toLowerCase() !== "periode"
                  ? responseFiltered[i].value.replace(/\W/g, "")
                  : responseFiltered[i].value;
          } else console.log("has no data");
        }

        if (Object.keys(temp).length > 0) {
          let resBankDetail = await repoBankDetail.aquiredByEmployeeId(
            emp[current].id
          );

          if (resBankDetail !== null) {
            if (Object.values(resBankDetail).length > 0) {
              let bankName = await repoBankName.acquireByBankKey(
                resBankDetail.bank_key
              );
              temp["bank_account"] =
                resBankDetail.bank_key !== null ? resBankDetail.bank_key : null;
              temp["bank_name"] = bankName !== null ? bankName.bank_name : null;
            }
          }

          let employee_id = emp[current].id;
          temp["employee_id"] = employee_id;
          temp["periode"] = moment(dateNow).format("YYYYMM");
          temp["pay_type"] = 1;
          temp["type"] = payrolType[0];
          temp["personnel_no"] = temp["personnel_no"];
          temp["npp"] = emp[current].npp;
          temp["kd_comp"] = emp[current].company_id_asal;
          temp["published"] = 0;
          temp["rapel_tunjangan"] = temp["rapel_tunjangan"]

          if (employee_id !== null) {
            await repoPayslip.insertOrUpdate(temp);
            // console.log(temp);
          }
        }
      }
    }
    // }
  }
  return "done";
};

const getDataSAPDoubleOffcycle = async () => {
  let runDayPayslip = moment(Date.now()).format("DD");

  const { date_now, npp } = req.body;

  let dateNow = date_now ? moment(date_now).format("YYYYMM") : "20231216";
  let dataNpp = npp ? npp : ""

  let payrolType = ["offcycle", "off_cycle", "regular"];

  let stringDate = "20220421";

  let temp = {};
  let tempDataBank = [];
  var key;

  // const emp = await repoEmp.acquireByKdCompPusatWithNppProvidePayslip(npp)
  const responseEmployee = await employeeRepository.acquireDataPayslip(dataNpp);
  const emp = JSON.parse(JSON.stringify(responseEmployee));

  // for (let pt = 0; pt < payrolType.length; pt++) {

  for (let current = 0; current < emp.length; current++) {
    if (emp[current].npp === null) {
      let nppOrPn = await checkNpp(
        emp[current].npp,
        emp[current].personnel_number
      );

      let responseJson = await repoPayslip.acquireDataSAP(
        nppOrPn,
        dateNow,
        payrolType[0]
      );

      let responseFiltered = responseJson.data;

      if (responseFiltered.length > 0) {
        for (let i = 0; i < responseFiltered.length; i++) {
          if (responseFiltered[i].description !== "") {
            key = responseFiltered[i].description.replace(/ /g, "_");
            key = key.replace(/\W/g, "_");
            key = key.replace(/[_]+/g, "_");
            if (key.length > 30) {
              let str = key.length - 30;
              let temp_count = key.length - str;
              temp[key.substring(0, temp_count).toLowerCase()] =
                key.toLowerCase() !== "periode"
                  ? responseFiltered[i].value.replace(/\W/g, "")
                  : responseFiltered[i].value;
            } else
              temp[key.toLowerCase()] =
                key.toLowerCase() !== "periode"
                  ? responseFiltered[i].value.replace(/\W/g, "")
                  : responseFiltered[i].value;
          } else console.log("has no data");
        }

        if (Object.keys(temp).length > 0) {
          let resBankDetail = await repoBankDetail.aquiredByEmployeeId(
            emp[current].id
          );

          if (resBankDetail !== null) {
            if (Object.values(resBankDetail).length > 0) {
              console.log("aman 3");
              let bankName = await repoBankName.acquireByBankKey(
                resBankDetail.bank_key
              );
              temp["bank_account"] =
                resBankDetail.bank_key !== null ? resBankDetail.bank_key : null;
              temp["bank_name"] = bankName !== null ? bankName.bank_name : null;
            }
          }

          let employee_id = emp[current].id;
          temp["employee_id"] = employee_id;
          temp["periode"] = moment(stringDate).format("YYYYMM");
          temp["insert_date"] = moment(stringDate).format("YYYYMMDD");
          temp["pay_type"] = 1;
          temp["type"] = payrolType[0];
          temp["personnel_no"] = temp["personnel_no"];
          temp["npp"] = emp[current].npp;
          temp["kd_comp"] = emp[current].company_id_asal;
          temp["published"] = 0;

          if (employee_id !== null) {
            console.log("ada");
            await repoPayslip.insertOrUpdateDoubleOffcycle(temp);
          }
        }
      }
    }
    // }
  }
  console.log("done");
  return "done";
};

const mappingNpp = async (npp, personnel_no) => {
  console.log(npp);
  if (
    npp.startsWith("D") === true ||
    npp.startsWith("K") === true ||
    npp.startsWith("A") === true ||
    npp.startsWith("P") === true ||
    npp.startsWith("TPP") === true
  )
    return personnel_no;
  else return npp;
};

const checkIfPayslipExist = async () => {
  let exist = [];
  const data = await repoPayslip.acquireIfPayslipExist();

  for (let i = 0; i < data.length; i++) {
    exist.push('"' + data[i].employee_id + '"."' + data[i].periode + '"');
  }

  return exist;
};

module.exports = {
  getData,
  getDataSAPOffcycle,
  getDataSAPDoubleOffcycle,
  mappingNpp,
};
