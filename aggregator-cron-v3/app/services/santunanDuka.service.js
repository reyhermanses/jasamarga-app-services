const repository = require("../repositories/santunanDuka.repository");
const repoEmployee = require("../repositories/omAction.repository");
const repoHistoryJabatan = require("../repositories/historyJabatan.repository");
const repoEmployeePosition = require("../repositories/employeePosition.repository");

require("dotenv").config();

let moment = require("moment");

const getDays = (year, month) => {
  return new Date(year, month, 0).getDate();
};

const serviceSap = async (query) => {
  try {
    let dateNow = [];

    let requiredDay = "04";

    let startDate = moment().startOf("month").format("YYYYMM") + requiredDay;

    if (query.start_date) {
      startDate = moment(query.start_date).format("YYYYMMDD");
    }


    let lastMonth = moment(startDate).subtract(1, "month");
    let currentMonth = moment(Date.now());

    let countDaysLastMonth =
      getDays(lastMonth.format("YYYY"), lastMonth.format("MM")) - requiredDay;
    let countDaysCurrentMonth = currentMonth.format("DD");

    let countDaysBetweenMonths =
      parseInt(countDaysLastMonth) + parseInt(countDaysCurrentMonth);

    for (let i = 1; i <= countDaysBetweenMonths; i++) {
      let dateMaps = moment(lastMonth).add(i, "days").format("YYYYMMDD");
      console.log(dateMaps);
      dateNow.push(dateMaps);
    }

    for (let dateCount = 0; dateCount < dateNow.length; dateCount++) {
      let insert = {};
      let resSantunanDuka = await repository.acquiredSap(dateNow[dateCount]);
      let resData = resSantunanDuka.data;
      let resEmployee;

      for (let i = 0; i < resData.length; i++) {
        // let resEmployee = await repoEmployee.acquireDatabase(resData[i].pernr);

        resEmployee = await repoEmployeePosition.acquireByPernr(
          resData[i].pernr
        )
        
        if(!resEmployee){
          resEmployee = await repoHistoryJabatan.acquireSantunanDuka(resData[i].pernr)
        }
        
        if (resEmployee !== null) {
          if (Object.keys(resEmployee).length > 0) {
            insert["employee_id"] = resEmployee.employee_id;
            insert["status"] = resData[i].status;
            insert["keydate"] = moment(dateNow[dateCount]).format("YYYYMM");
            insert["created_at"] = moment(dateNow[dateCount]).format(
              "YYYY-MM-DD"
            );
            insert["created_by"] = "aggregator-data";
            await repository.upsert(insert);
          } else console.log(`has no exist !`);
        } else {
          console.log("has no existing data in employee");
        }
      }
    }
  } catch (error) {
    console.log(error);
  }

  console.log("done");
  return "done";
};

async function checkIfSantunanDukaExist() {
  let exist = [];

  let data = await repository.acquireAllDataNoFilter();

  for (let i = 0; i < data.length; i++) {
    exist.push(`${data[i].employee_id}.${data[i].keydate}`);
  }

  return exist;
}

module.exports = {
  serviceSap,
  checkIfSantunanDukaExist,
};
