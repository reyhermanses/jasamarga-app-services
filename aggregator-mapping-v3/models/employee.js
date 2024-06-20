"use strict";
const { Model } = require("sequelize");
require("dotenv").config();
module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    static associate(models) {
      this.hasMany(models.Payslip1, {
        as: "payslip1",
        foreignKey: "employee_id",
      }); //payslip
      this.hasMany(models.SantunanDuka, {
        as: "santunanDuka",
        foreignKey: "employee_id",
      }); //santunanduka
      this.hasMany(models.Espt, {
        as: "espt",
        foreignKey: "employee_id",
      }); //spt

      this.belongsTo(models.MasterCompany, {
        foreignKey: "company_id_asal",
        as: "company",
      });

      this.belongsTo(models.MasterCompany, {
        foreignKey: "company_id_penugasan",
        as: "company_penugasan",
      });

      this.belongsTo(models.MasterBusinessArea, {
        foreignKey: "business_area_id",
        as: "business",
      });

      this.belongsTo(models.MasterEmployeeGroup, {
        foreignKey: "employee_group_id",
        as: "group",
      });

      this.belongsTo(models.MasterEmployeeSubGroup, {
        foreignKey: "employee_sub_group_id",
        as: "subgroup",
      });

      this.hasMany(models.HistoryJabatan, {
        foreignKey: "employee_id",
        as: "history_jabatan",
      });

      this.hasOne(models.HistoryJabatan, {
        foreignKey: "employee_id",
        as: "history_jabatan_has_one",
      });

      this.hasOne(models.EmployeeMasaKerja, {
        foreignKey: "employee_id",
        as: "emp_masa_kerja",
      });

      this.hasOne(models.EmployeeProfile, {
        foreignKey: "employee_id",
        as: "profile",
      });

      this.hasMany(models.EmployeeFile, {
        foreignKey: "employee_id",
        as: "file",
      });

      this.hasMany(models.EmployeeEducation, {
        foreignKey: "employee_id",
        as: "education",
      });

      this.hasMany(models.EmployeePosition, {
        foreignKey: "employee_id",
        as: "position",
      });

      this.hasOne(models.EmployeePosition, {
        foreignKey: "employee_id",
        as: "employeePosition",
      });
    }
  }
  Employee.init(
    {
      name: DataTypes.STRING,
      employee_status: DataTypes.BOOLEAN,
      is_pusat: DataTypes.BOOLEAN,
      sap_emp_status: DataTypes.BOOLEAN,
      company_id_asal: DataTypes.INTEGER,
      employee_group_id: DataTypes.INTEGER,
      employee_sub_group_id: DataTypes.INTEGER,
      company_id_penugasan: DataTypes.INTEGER,
      start_date: DataTypes.DATE,
      end_date: DataTypes.DATE,
      business_area_id: DataTypes.STRING,
      date_of_entry: DataTypes.DATE,
      is_rangkap_jabatan: DataTypes.BOOLEAN,
      is_penugasan: DataTypes.BOOLEAN,
      created_by: DataTypes.STRING,
      updated_by: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Employee",
      tableName: "employee",
      schema: process.env.NODE_ENV,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return Employee;
};
