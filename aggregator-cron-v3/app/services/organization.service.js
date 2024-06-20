const repository = require('../repositories/organization.repository')

const getData = async (req, action) => {
  // Ambil dengan dan tanpa req.query.changedate, jika tanpa req.query.changedate maka akan mengambil data kemarin
  let responseOrg = await repository.acquireData(req.query.changedate ? req.query.changedate : null)
  if (responseOrg.data.length != 0) {
    let responseFiltered = responseOrg.data;
    if (typeof responseFiltered === 'string') {
      const removeBacklash = responseFiltered.replaceAll(/\\/g, '');
      responseFiltered = JSON.parse(removeBacklash);
    }

    if (req.query.object_id) {
      const obj = responseFiltered.filter(row => {
        return row.object_id == req.query.object_id
      })

      if (obj.length == 0) {
        const error = new Error("organization not found");
        error.statusCode = 404;
        throw error;
      }

      responseFiltered = obj;
    }

    let result = []
    if (action === 'org_only') {
      result = await processOrg(responseFiltered)
    } else if (action === 'ubah_leader') {
      result = await processLeader(responseFiltered)
    }
    return result
  }
  return []
}

const processLeader = async (data) => {
  let result = []
  for (obj of data) {
    if (obj.subtype === 'B012') {
      const existingOrg = await repository.acquireOrgById(obj.object_id)
      const checkPosition = await repository.acquireLeaderPosition(obj.object_sobid)

      if (!checkPosition) {
        existingOrg.leader_id = null
        existingOrg.leader_position_id = null
        result.push({ result: `organisasi ${obj.object_id} - ${obj.object_name} tidak dipimpin karyawan ${obj.object_sobid} - ${obj.object_sobid_name}` })
      } else {
        existingOrg.leader_id = checkPosition.employee_id
        existingOrg.leader_position_id = checkPosition.position_id
        result.push({ result: `organisasi ${obj.object_id} - ${obj.object_name} dipimpin karyawan ${checkPosition.npp} - ${obj.object_sobid_name}` })
      }
      existingOrg.name = obj.object_name
      await existingOrg.save()
    }
  }
  return result
}

const processOrg = async (data) => {
  let result = []
  for (obj of data) {
    if (obj.object_type === 'O' && obj.type_of_related_object === 'O') {
      // A002
      let existingOrg = await repository.acquireOrgById(obj.object_id)
      let orgId = obj.object_id
      let orgName = obj.object_name
      let parentId = obj.object_sobid

      // B002
      if (obj.subtype === 'B002') {
        existingOrg = await repository.acquireOrgById(obj.object_sobid)
        orgId = obj.object_sobid
        orgName = obj.object_sobid_name
        parentId = obj.object_id
      }

      if (!existingOrg) {
        await repository.generateOrg({
          id: orgId,
          name: orgName,
          parent_id: parentId,
          created_by: 'aggregator-cron'
        })
      } else {
        await existingOrg.update({
          name: orgName,
          parent_id: parentId,
          updated_by: 'aggregator-cron'
        })
      }
    }
    result.push(obj)
  }
  return result
}



module.exports = {
  getData
}