'use strict';
const {
  Model
} = require('sequelize');
require('dotenv').config();
module.exports = (sequelize, DataTypes) => {
  class Approver extends Model {
    static associate(models) {
    }
  }
  Approver.init({
    personnel_number: DataTypes.STRING,
    complete_name: DataTypes.STRING,
    start_date: DataTypes.STRING,
    org_unit: DataTypes.STRING,
    org_unit_text: DataTypes.STRING,
    department: DataTypes.STRING,
    department_text: DataTypes.STRING,
    position: DataTypes.STRING,
    position_name: DataTypes.STRING,
    personnel_num_approver: DataTypes.STRING,
    name_approver: DataTypes.STRING,
    position_appr: DataTypes.STRING,
    position_name_appr: DataTypes.STRING,
    change_on: DataTypes.STRING,
    created_by: DataTypes.STRING,
    updated_by: DataTypes.STRING,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    org_approver: DataTypes.STRING,
    org_text_approver: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Approver',
    tableName: 'approver',
    schema: process.env.NODE_ENV,
    createdAt: "created_at",
    updatedAt: "updated_at"
  });
  return Approver;
};