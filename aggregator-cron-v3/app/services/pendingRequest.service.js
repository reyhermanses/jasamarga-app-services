const moment = require("moment");

const repository = require("../repositories/pendingRequest.repository");
const { processCron } = require("../services/omAction.service");
const { modernize : modernizeOrg } = require("../repositories/organization.repository");

const runCron = async (req, res) => {
  let date = moment();

  if (req.query.changedate) {
    const dateString = req.query.changedate;
    const dateFormat = "YYYYMMDD";

    date = moment(dateString, dateFormat);
  }
  const data = await repository.acquireByPeriod(
    date.format("YYYYMMDD"),
    req.query.personnel_number
  );
  const result = await processCron(data, date.format("YYYYMMDD"), data);

  // jika ada data pending request yang dijalankan pada hari itu maka cek kolom is_memimpin = true
  if(data){
    for (const obj of data){
      // jika iya maka mengubah leader_id = emp_id dan org_leader_id = position_id
      if(obj.is_memimpin === true) {
        // update leader_id dan position_leader_id
        await modernizeOrg(obj.organisasi_key, {leader_id: obj.employee_id, leader_position_id: obj.position_key})
      }
    }
  }
  return result;
};

const getCurrentData = async () => {
  let date = moment().format("YYYYMMDD");

  const data = await repository.acquireCurrent(date);
  return data;
};

module.exports = { runCron, getCurrentData };
