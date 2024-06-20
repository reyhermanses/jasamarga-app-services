"use strict";
const { Model } = require("sequelize");
require("dotenv").config();
module.exports = (sequelize, DataTypes) => {
  class PendingRequest extends Model {
    static associate(models) {
      this.belongsTo(models.Employee, {
        foreignKey: "employee_id",
        as: "pending_request_employee",
      });
    }
  }
  PendingRequest.init(
    {
      employee_id: DataTypes.NUMBER,
      period: DataTypes.DATE,
      issue_ctry: DataTypes.INTEGER,
      location: DataTypes.INTEGER,
      issue_date: DataTypes.INTEGER,
      personnel_number: DataTypes.INTEGER,
      valid_to: DataTypes.INTEGER,
      issue_place: DataTypes.INTEGER,
      doc_country: DataTypes.INTEGER,
      tanggal_efektif_sk: DataTypes.INTEGER,
      doc_number: DataTypes.INTEGER,
      valid_from: DataTypes.INTEGER,
      doc_type: DataTypes.INTEGER,
      subtype: DataTypes.INTEGER,
      doc_status: DataTypes.INTEGER,
      end_date: DataTypes.INTEGER,
      text_personal_subarea: DataTypes.INTEGER,
      text_employee_group: DataTypes.INTEGER,
      text_employee_subgroup: DataTypes.INTEGER,
      employee_group: DataTypes.INTEGER,
      action: DataTypes.INTEGER,
      emp_status: DataTypes.INTEGER,
      personal_area: DataTypes.INTEGER,
      personal_sub_area: DataTypes.INTEGER,
      name: DataTypes.INTEGER,
      begin_date: DataTypes.INTEGER,
      text_personal_area: DataTypes.INTEGER,
      employee_subgroup: DataTypes.INTEGER,
      organisasi_key: DataTypes.INTEGER,
      text_section: DataTypes.INTEGER,
      text_position_key: DataTypes.INTEGER,
      section: DataTypes.INTEGER,
      cost_center: DataTypes.INTEGER,
      text_organisasi_key: DataTypes.INTEGER,
      text_job_key: DataTypes.INTEGER,
      departement: DataTypes.INTEGER,
      position_key: DataTypes.INTEGER,
      job_key: DataTypes.INTEGER,
      change_on: DataTypes.INTEGER,
      pay_scale_area: DataTypes.INTEGER,
      subgrade: DataTypes.INTEGER,
      text_unit_kerja: DataTypes.INTEGER,
      grade: DataTypes.INTEGER,
      unit_kerja: DataTypes.INTEGER,
      kelompok_jabatan: DataTypes.INTEGER,
      text_departement: DataTypes.INTEGER,
      is_memimpin : DataTypes.BOOLEAN
    },
    {
      sequelize,
      modelName: "PendingRequest",
      tableName: "pending_requests",
      schema: process.env.NODE_ENV,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return PendingRequest;
};