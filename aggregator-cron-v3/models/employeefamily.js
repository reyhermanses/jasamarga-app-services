"use strict";
const moment = require("moment");
const { Model } = require("sequelize");
require("dotenv").config();
module.exports = (sequelize, DataTypes) => {
  class EmployeeFamily extends Model {
    static associate(models) {
      this.belongsTo(models.Employee, {
        foreignKey: "employee_id",
        as: "employee_family",
      });
      this.belongsTo(models.MasterStatusKeluarga, {
        foreignKey: "family_status_id",
        as: "status_keluarga",
      });
    }
  }
  EmployeeFamily.init(
    {
      employee_id: DataTypes.INTEGER,
      family_status_id: DataTypes.INTEGER,
      name: DataTypes.STRING,
      place_of_birth: DataTypes.STRING,
      date_of_birth: {
        type: DataTypes.DATE,
        get: function () {
          let date = this.getDataValue("date_of_birth")
            ? moment(this.getDataValue("date_of_birth")).format("YYYY-MM-DD")
            : this.getDataValue("date_of_birth");
          return date;
        },
      },
      religion_id: DataTypes.INTEGER,
      gender: DataTypes.STRING,
      blood_type: DataTypes.STRING,
      job: DataTypes.STRING,
      national_identifier: DataTypes.STRING,
      object_id: DataTypes.INTEGER,
      paspor_no: DataTypes.STRING,
      place_of_death: DataTypes.STRING,
      date_of_death: {
        type: DataTypes.DATE,
        get: function () {
          let date = this.getDataValue("date_of_death")
            ? moment(this.getDataValue("date_of_death")).format("YYYY-MM-DD")
            : this.getDataValue("date_of_death");
          return date;
        },
      },
      attachment_nikah: DataTypes.STRING,
      attachment_akta: DataTypes.STRING,
      start_date: DataTypes.DATE,
      end_date: DataTypes.DATE,
      active: DataTypes.BOOLEAN,
      object_id: DataTypes.INTEGER,
      changedate: DataTypes.STRING,
      created_by: DataTypes.STRING,
      updated_by: DataTypes.STRING,
      attachment_ktp: DataTypes.STRING,
      dependent_tax_purpose: DataTypes.STRING,
      bpjs_dependent_type: DataTypes.STRING,
      no_bpjs: DataTypes.STRING,
      benefit_class: DataTypes.STRING,
      id_card_type: DataTypes.STRING,
      id_card_number: DataTypes.STRING
    },
    {
      sequelize,
      modelName: "EmployeeFamily",
      tableName: "employee_family",
      schema: process.env.NODE_ENV,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return EmployeeFamily;
};
