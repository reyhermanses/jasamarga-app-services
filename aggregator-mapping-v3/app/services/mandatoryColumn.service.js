const repository = require("../repositories/mandatoryColumn.repository");
const employeerepository = require("../repositories/employee.repository");
const masterpositionrepository = require("../repositories/master/masterPosition.repository");
const organizationHierarchy = require("../repositories/organizationHierarchy.repository");

const getData = async (req) => {
  let data = await employeerepository.acquireDataJMArsip(req);
  data = data.map((obj) => ({
    ...obj,
    CntSubOrd: 0,
    MainRole: 3,
    LocationName: "Kantor Pusat JM",
    LocationId: 183,
    PositionNameAlias: null,
    is_ldap: obj.PayrollGroupId,
  }));

  const uniqueObjects = new Map();

  data.forEach(obj => {
    uniqueObjects.set(JSON.stringify(obj), obj);
  });

  // Step 2: Convert the unique objects back to an array
  const uniqueArray = Array.from(uniqueObjects.values());
  return uniqueArray
};

module.exports = {
  getData,
};
