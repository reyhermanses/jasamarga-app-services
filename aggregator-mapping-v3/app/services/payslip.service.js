const repoEmp = require("../repositories/employee.repository");
const repoCompany = require("../repositories/master/masterCompany.repository");
const repoOrgHier = require("../repositories/organizationHierarchy.repository");
const repoPayslip = require("../repositories/payslip.repository");
const repoSantunanDuka = require("../repositories/santunanDuka.repository");
const repoBankName = require("../repositories/master/masterBankKey.repository");
const repoSapBankDetails = require("../repositories/sap_satelit/sapBankDetails.repository");
const repoOrgHierarchy = require("../repositories/organizationHierarchy.repository");
const repoBankDetail = require("../repositories/bank_detail.repository");
const repoMasterPosition = require("../repositories/master/masterPosition.repository");
const repoEmployeeGroup = require("../repositories/master/masterEmployeeGroup.repository");
const repoHistoryJabatan = require("../repositories/historyJabatan.repository");
const repoEspt = require("../repositories/espt.repository");

require("dotenv").config();

let moment = require("moment");

let fs = require("fs");

const { Op, or } = require("sequelize");

const { sequelize } = require("../../models");

async function getDataSAPV3() {
  // let runDayPayslip = moment(Date.now()).format('MM')
  let runDayPayslip = 16;

  // if (runDayPayslip == 16) {

  let setDate = "20240116";
  let setCurrentDate = Date.now();

  let dateNow = moment(setDate).format("YYYYMM");
  let temp = {};
  let tempDataBank = [];
  var key;
  var npp = "";
  var type = "regular";

  const emp = await repoEmp.acquireByKdCompPusatProvidePayslip(npp);

  for (let current = 0; current < emp.length; current++) {
    let nppOrPn = await checkNpp(
      emp[current].dataValues.npp,
      emp[current].dataValues.personnel_number
    );
    console.log(`npp : ${nppOrPn}`);
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
            emp[current].dataValues.id
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

          let employee_id = emp[current].dataValues.id;
          temp["employee_id"] = employee_id;
          temp["periode"] = moment(dateNow).format("YYYYMM");
          temp["dpp_skjm_10"] = temp["10_dpp_skjm"] ? temp["10_dpp_skjm"] : 0;
          temp["dpc_skjm_90"] = temp["90_dpc_skjm"] ? temp["90_dpc_skjm"] : 0;
          temp["pay_type"] = 1;
          temp["type"] = type;
          temp["personnel_no"] = temp["personnel_no"];
          temp["npp"] = emp[current].dataValues.npp;
          temp["kd_comp"] = emp[current].dataValues.company_id_asal;
          temp["published"] = 0;
          temp["position_id"] = emp[current].dataValues.position_id;
          temp["gaji_pokok_info"] = temp["gaji_pokok_info"];
          temp["tunj_pos_struk_tambahan"] = temp["tunj_pos_struk_tambahan"];
          temp["tunj_posisi_fungsional_tambaha"] =
          temp["tunj_pos_fungs_tambahan"];

          if (employee_id !== null) {
            await repoPayslip.insertOrUpdate(temp);
          }
        }
      }
    }
  }

  //}

  return "done";
}

async function getDataSAP() {
  // let runDayPayslip = moment(Date.now()).format('MM')
  let runDayPayslip = 16;

  // if (runDayPayslip == 16) {

  let setDate = "20221016";
  let setCurrentDate = Date.now();

  let dateNow = moment(setDate).format("YYYYMM");
  let temp = {};
  let tempDataBank = [];
  var key;
  var npp = "D0014";
  var type = "regular";

  // const emp = await repoEmp.acquireByKdCompPusatWithNppProvidePayslip(npp)

  const emp = await repoEmp.acquireByKdCompPusatProvidePayslip(10691);

  for (let current = 0; current < emp.length; current++) {
    let nppOrPn = await checkNpp(
      emp[current].npp,
      emp[current].personnel_number
    );

    let responseJson = await repoPayslip.acquireDataSAP(nppOrPn, dateNow, type);

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

        if (employee_id !== null) {
          await repoPayslip.insertOrUpdate(temp);
        }
      }
    }
  }
  //}

  return "done";
}

async function getDataSAPOffcycle() {
  let runDayPayslip = moment(Date.now()).format("DD");

  let payrolType = ["offcycle", "off_cycle", "regular"];

  let stringDate = "20231231";

  let dateNow = moment(stringDate).format("YYYYMM");

  let temp = {};
  let tempDataBank = [];
  var key;
  var npp = "10691";

  const emp = await repoEmp.acquireByKdCompPusat();
  for (let current = 0; current < emp.length; current++) {
    let nppOrPn = await checkNpp(
      emp[current].npp,
      emp[current].personnel_number
    );

    let responseJson = await repoPayslip.acquireDataSAP(
      nppOrPn,
      stringDate,
      payrolType[1]
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
        temp["periode"] = moment(dateNow).format("YYYYMM");
        temp["pay_type"] = 1;
        temp["type"] = payrolType[0];
        temp["personnel_no"] = temp["personnel_no"];
        temp["npp"] = emp[current].npp;
        temp["kd_comp"] = emp[current].company_id_asal;
        temp["published"] = 0;

        if (employee_id !== null) {
          // if (temp['gaji_pokok_utuh'] !== 0) {
          await repoPayslip.insertOrUpdate(temp);
          // } else {
          // await repoPayslip.insertOrUpdate(temp)
          // }
        }
      }
    }
    // }
  }
  return "done";
}

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

async function checkIfPayslipExist() {
  let exist = [];
  const data = await repoPayslip.acquireIfPayslipExist();

  for (let i = 0; i < data.length; i++) {
    exist.push('"' + data[i].employee_id + '"."' + data[i].periode + '"');
  }

  return exist;
}

async function getAllDataPayslip1(req) {
  let filter = {};
  let returnArr = [];
  let resAll = [];

  if (req.query.limit) {
    filter.limit = req.query.limit ? req.query.limit : 0;
  }

  let collection = [];

  const resPayslip = await repoPayslip.acquiredAllData(filter, req.query);

  let employee = [];
  let dataEmp = [];
  for (let i = 0; i < resPayslip.length; i++) {
    for (let j = 0; j < resPayslip[i].payslip1.length; j++) {
      //history jabatan
      let requiredDay = moment(Date.now()).format("DD");
      let tahunPajak = moment(Date.now()).format("YYYY");
      let month = moment(Date.now()).format("MM");
      let payslip = [];

      if (requiredDay > 28) {
        let tempDate = new Date(tahunPajak, month, 0);
        let convertDay = moment(tempDate).format("DD");
        requiredDay = convertDay;
      }

      let mapDate =
        moment(resPayslip[i].payslip1[j].periode).format("YYYY-MM-") +
        requiredDay;

      let history_jabatan;

      if (typeof mapDate === "Date") {
        history_jabatan = await repoHistoryJabatan.acquireBetweenAwalAkhirDate(
          resPayslip[i].id,
          mapDate
        );
      }

      // end history jabatan

      //mapping payslip

      payslip.push(resPayslip[i].payslip1[j]);
      let newPayslip = JSON.parse(JSON.stringify(payslip));
      newPayslip.map((obj) => {
        obj.info_reimbursment_kesehatan_aso =
          resPayslip[i].payslip1[j].tunj_kesehatan_aso;
      });

      //end mapping payslip

      // start santunan duka
      let employee_santunan_duka = [];
      const santunan_duka = await repoSantunanDuka.aqcuireByPeriode(
        resPayslip[i].payslip1[j].periode
      );

      if (santunan_duka) {
        for (let x = 0; x < santunan_duka.length; x++) {
          let sd = santunan_duka[x];
          let personnel_number = null;
          let unit_kerja = null;
          let npp = null;

          dataEmp = await repoEmp.santunanDukaEmployeeActive(sd.employee_id);

          if(dataEmp.position.length > 0) {
            dataEmp = await repoEmp.santunanDukaEmployeeActive(sd.employee_id);
            personnel_number = dataEmp.position[0]?.personnel_number;
            unit_kerja = dataEmp.position[0]?.position_detail.name;
            npp = dataEmp.position[0]?.npp;
          }else{
            dataEmp = await repoEmp.santunanDukaEmployeeInActive(
              sd.employee_id
            );
            if(dataEmp){
              personnel_number = dataEmp.history_jabatan[0]?.personnel_number;
              unit_kerja = dataEmp.history_jabatan[0]?.unit;
              npp = dataEmp.history_jabatan[0]?.npp;
            }
          }

          if (dataEmp) {
            let pushEmp = {
              employee_id: sd.employee_id,
              employee_name: dataEmp.name,
              employee_npp: npp,
              employee_kd_comp: dataEmp.company.kd_comp,
              employee_personnel_number: personnel_number,
              employee_unit_kerja: unit_kerja,
              employee_company: dataEmp.company.name,
              employee_status: sd.status,
              key_date: sd.keydate,
            };
            employee_santunan_duka.push(pushEmp);
          }
        }
      }

      // end santunan duka

      if (
        resPayslip[i].payslip1[j].gaji_pokok_info != null ||
        resPayslip[i].payslip1[j].gaji_pokok_info != 0
      ) {
        for (let index = 0; index < newPayslip.length; index++) {
          if (
            parseInt(resPayslip[i].payslip1[j].gaji_pokok_info) !== 0 ||
            resPayslip[i].payslip1[j].gaji_pokok_info !== null
          ) {
            let type = "regular";
            if (resPayslip[i].employee_status == true) {
              newPayslip[index]["rapel_berkala_april"] =
                resPayslip[i].payslip1[j].gaji_pokok_utuh -
                resPayslip[i].payslip1[j].gaji_pokok_info;
            } else {
              let setDate = new Date();

              let startDate = moment(setDate).startOf("month").format("YYYYMM");

              let monthMinusOne = moment(startDate).subtract(1, "month");

              let lastMonth =
                moment(setDate).format("YYYY") +
                moment(monthMinusOne).format("MM");

              let pensiunPayslip = await repoPayslip.acquiredByTypeNppPeriode(
                type,
                resPayslip[i].dataValues.npp,
                lastMonth
              );  

              if (
                pensiunPayslip &&
                pensiunPayslip.hasOwnProperty("gaji_pokok_utuh")
              ) {
                newPayslip[index]["rapel_berkala_april"] =
                  resPayslip[i].payslip1[j].gaji_pokok_utuh -
                  pensiunPayslip.gaji_pokok_utuh;
              }
            }
          }
        }
      }

      //espt
      let statusPtkp = "";
      let jmlTanggunganPtkp = "";

      let resEspt = await repoEspt.acquireTahunPajakEmployeeId(
        tahunPajak,
        resPayslip[i].id
      );

      if (resEspt?.length > 0) {
        statusPtkp = resEspt?.status_ptkp;
        jmlTanggunganPtkp = resEspt?.jml_tanggungan;
      } else {
        tahunPajak = tahunPajak - 1;
        let resEspt2 = await repoEspt.acquireTahunPajakEmployeeId(
          tahunPajak,
          resPayslip[i].id
        );
        statusPtkp = resEspt2?.status_ptkp;
        jmlTanggunganPtkp = resEspt2?.jml_tanggungan;
      }

      employee = {
        name: resPayslip[i].dataValues.name,
        npp: resPayslip[i].dataValues.npp,
        kd_comp: resPayslip[i].dataValues.kd_comp,
        personnel_number: resPayslip[i].dataValues.personnel_number,
        unit_kerja: history_jabatan
          ? history_jabatan.unit
          : resPayslip[i].dataValues.unit_kerja,
        company: resPayslip[i].dataValues.company,
        personal_area: resPayslip[i].dataValues.personal_area,
        unit_id: resPayslip[i].dataValues.unit_id,
        grade: resPayslip[i].dataValues.grade,
        position_id: resPayslip[i].dataValues.position_id,
        position_name: history_jabatan
          ? history_jabatan.posisi
          : resPayslip[i].dataValues.position_name,
        employee_group: resPayslip[i].dataValues.employee_group,
        status_ptkp: statusPtkp,
        jml_tanggungan_ptkp: jmlTanggunganPtkp,
        status: resPayslip[i].dataValues.status,
        santunan_duka: employee_santunan_duka,
        // newPayslip: [resPayslip[i].payslip1[j]],
        newPayslip,
      };
      collection.push(employee);
    }
  }
  return collection;
}

async function serviceUpdateIsPublish(req) {
  const t = await sequelize.transaction();
  try {
    const input = req.body;
    for (obj of input) {
      await repoPayslip.upsert(obj);
      console.log(obj);
    }
    await t.commit();
    return true;
  } catch (error) {
    await t.rollback();
    console.log(error);
  }
}

async function serviceProcess(responseJson) {
  return responseJson;
}

module.exports = {
  getDataSAP,
  getDataSAPOffcycle,
  getAllDataPayslip1,
  serviceUpdateIsPublish,
  checkIfPayslipExist,
  getDataSAPV3,
  checkNpp,
};
