const repository = require('../repositories/approver.repository')
const orgHierarchyRepository = require('../repositories/organization.repository')

const getData = async (req) => {
  // Ambil dengan dan tanpa req.query.changedate, jika tanpa req.query.changedate maka akan mengambil data kemarin
  let responseApprover = await repository.acquireData(req.query.changedate ? req.query.changedate : null);
  if (responseApprover.data.length != 0) {
    let responseFiltered = responseApprover.data;
    if (typeof responseFiltered === 'string') {
      const removeBacklash = responseFiltered.replaceAll(/\\/g, '');
      responseFiltered = JSON.parse(removeBacklash);
    }

    // b. jika dipilih spesifik personnel number, ambil data terkait pers.number tsb saja dari data
    if (req.query.personnel_number) {
      const obj = responseFiltered.filter(row => {
        return row.personnel_number == req.query.personnel_number
      })

      if (obj.length == 0) {
        const error = new Error("Personnel Number not found");
        error.statusCode = 404;
        throw error;
      }

      responseFiltered = obj;
    }

    const result = await processApprover(responseFiltered)
    return result
  } else {
    return []
  }
}

const processApprover = async (data) => {
  let dataTotal = []
  const orgData = []
  const result = {
    dataTotal,
    orgData
  }
  for (obj of data) {
    // set atasan-bawah
    const atasan = await repository.acquireDataPusat(obj.personnel_num_approver)
    const orgLeader = await orgHierarchyRepository.acquireOrgById(obj.org_approver)

    // tambah logic 
    // logic 1 : check table pending_request apakah ada data orang x disitu berdasarkan personnal_number
    const checkPendingRequest = await repository.checkPendingRequest(obj.personnel_num_approver, obj.change_on);
    // update is memimpin = true
    if(checkPendingRequest){
      checkPendingRequest.is_memimpin = true;
      await checkPendingRequest.save();
    }

    /* jika organisasi terdaftar di database */
    if (orgLeader) {
      await orgLeader.update({
        leader_id: atasan.employee_id,
        leader_position_id: atasan.position_id,
        updated_by: `aggregator-cron-approver ${obj.change_on}`
      })

      dataTotal.push({
        atasan_number: obj.personnel_num_approver,
        org_id: obj.org_approver,
        status: "success"
      })
    }
  }
  return result
}

module.exports = {
  getData
}