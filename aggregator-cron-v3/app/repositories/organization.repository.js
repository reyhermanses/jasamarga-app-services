const axios = require("axios");
const moment = require("moment");
require('dotenv').config()

const { OrganizationHierarchy, EmployeePosition } = require("../../models")

const acquireData = async (changeDate = null) => {
  const response = await axios.post(
    changeDate ?
      `${process.env.SAP_URL}` +
      `&sat-table=JM_HIERARCHY_ORG&mode=18&changedate=` +
      changeDate :
      process.env.SAP_URL +
      `&sat-table=JM_HIERARCHY_ORG&mode=18&changedate=` +
      moment().add(-1, "days").format("YYYYMMDD"), {}, {
    auth: {
      username: process.env.SAP_USER,
      password: process.env.SAP_PASSWORD,
    },
  }
  );
  return response;
}

const acquireOrgById = async (id) => {
  return await OrganizationHierarchy.findByPk(id)
}

const acquireLeaderPosition = async (positionId) => {
  return await EmployeePosition.findOne({ where: { position_id: positionId } })
}

const generateOrg = async (data) => {
  return await OrganizationHierarchy.create(data)
}

const removeByLeaderId = async (leaderId) => {
  return await OrganizationHierarchy.delete
}

const modernize = async (id, data) => {
  return await OrganizationHierarchy.update(data, {
    where: {
      id: id,
    },
    returning: true,
  });
};

module.exports = {
  acquireData,
  acquireOrgById,
  generateOrg,
  acquireLeaderPosition,
  modernize
}