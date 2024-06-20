const { OrgFormation, OrgFormationJob } = require('../../models')

const generate = async (data, transaction) => {
  return await OrgFormation.create({
    org_id: data.org_id,
    job_id: data.job_id,
    add_on: data.add_on
  }, { transaction })
}

const modernizeOrGenerate = async (updatedData, requester, transaction) => {
  const data = await OrgFormation.findOne({
    where: {
      org_id: updatedData.org_id,
      job_id: updatedData.job_id
    }
  })

  if (!data) {
    const { status: available, dataAvailability: numberAvalability } = await checkCurrentAvailability(updatedData)
    if (!available) {
      const error = new Error(`Data Tidak Boleh Kurang Dari ${numberAvalability} Formasi`);
      error.statusCode = 422;
      throw error;
    }

    updatedData.add_on = updatedData.add_on - numberAvalability

    if (updatedData.add_on > 0) {
      OrgFormation.create({
        ...updatedData,
        created_by: requester
      })
    }
  } else {
    const { status: available, dataAvailability: numberAvalability } = await checkCurrentAvailability(updatedData)
    if (!available) {
      const error = new Error(`Data Tidak Boleh Kurang Dari ${numberAvalability} Formasi`);
      error.statusCode = 422;
      throw error;
    }

    data.add_on = updatedData.add_on - numberAvalability
    data.updated_by = requester

    if (updatedData.add_on === 0) {
      await data.destroy({ transaction })
    }

    await data.save({ transaction })
  }
  return updatedData
}

const acquireByIdentity = async (orgId, jobId) => {
  return await OrgFormation.findOne({
    where: {
      org_id: orgId,
      job_id: jobId
    }
  })
}

const checkCurrentAvailability = async (data) => {
  const checkData = await OrgFormationJob.findOne({
    attributes: {
      exclude: ['id']
    },
    where: {
      job_id: data.job_id,
      org_id: data.org_id
    }
  })

  if (!checkData) {
    return { status: true, dataAvailability: 0 }
  } else {
    let dataAvailability = parseInt(checkData.all_job)
    if (data.add_on < dataAvailability) {
      return { status: false, dataAvailability }
    }
    return { status: true, dataAvailability }
  }
}

module.exports = {
  modernizeOrGenerate,
  acquireByIdentity,
  generate
}