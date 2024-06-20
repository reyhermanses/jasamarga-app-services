const { EmployeeProfile } = require("../../models");

require("dotenv").config();

let axios = require("axios");

const acquiredOne = async (empId) => {
  return await EmployeeProfile.findOne({
    where:{
      employee_id: empId
    }
  })
}

const updatePtkpJmlTanggungan= async () => {}

module.exports = {
  acquiredOne,
  updatePtkpJmlTanggungan
}