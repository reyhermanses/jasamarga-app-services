'use strict';
const {
  Model
} = require('sequelize');
require("dotenv").config();
module.exports = (sequelize, DataTypes) => {
  class OmAction extends Model {
    static associate(models) {
    }
  }
  OmAction.init({
    begin_date: DataTypes.STRING,
    end_date: DataTypes.STRING,
    personnel_number: DataTypes.STRING,
    name: DataTypes.STRING,
    action: DataTypes.STRING,
    emp_status: DataTypes.STRING,
    personal_area: DataTypes.STRING,
    text_personal_area: DataTypes.STRING,
    employee_group: DataTypes.STRING,
    text_employee_group: DataTypes.STRING,
    employee_subgroup: DataTypes.STRING,
    text_employee_subgroup: DataTypes.STRING,
    personal_sub_area: DataTypes.STRING,
    text_personal_subarea: DataTypes.STRING,
    cost_center: DataTypes.STRING,
    organisasi_key: DataTypes.STRING,
    text_organisasi_key: DataTypes.STRING,
    position_key: DataTypes.STRING,
    text_position_key: DataTypes.STRING,
    job_key: DataTypes.STRING,
    text_job_key: DataTypes.STRING,
    section: DataTypes.STRING,
    text_section: DataTypes.STRING,
    departement: DataTypes.STRING,
    text_departement: DataTypes.STRING,
    unit_kerja: DataTypes.STRING,
    text_unit_kerja: DataTypes.STRING,
    kelompok_jabatan: DataTypes.STRING,
    pay_scale_area: DataTypes.STRING,
    grade: DataTypes.STRING,
    subgrade: DataTypes.STRING,
    change_on: DataTypes.STRING,
    created_by: DataTypes.STRING,
    updated_by: DataTypes.STRING,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  }, {
    sequelize,
    modelName: "OmAction",
    tableName: "om_action",
    schema: process.env.NODE_ENV,
    createdAt: "created_at",
    updatedAt: "updated_at",
  });
  return OmAction;
};