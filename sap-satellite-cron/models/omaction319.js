'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OmAction3 extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  OmAction3.init({
    action_date: DataTypes.STRING,
    action_end_date: DataTypes.STRING,
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
    org_start_date: DataTypes.STRING,
    org_end_date: DataTypes.STRING,
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
    doc_number: DataTypes.STRING,
    doc_status: DataTypes.STRING,
    doc_type: DataTypes.STRING,
    tanggal_efektif_sk: DataTypes.STRING,
    change_on: DataTypes.STRING,
    created_by: DataTypes.STRING,
    updated_by: DataTypes.STRING,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  }, {
    sequelize,
    modelName: "OmAction319",
    tableName: "om_action_3_19",
    schema: process.env.NODE_ENV,
    createdAt: "created_at",
    updatedAt: "updated_at",
  });
  return OmAction3;
};