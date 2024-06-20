'use strict';
const {
  Model
} = require('sequelize');
require('dotenv').config();
module.exports = (sequelize, DataTypes) => {
  class EmployeeMasaKerja extends Model {
    static associate(models) {
      // define association here
      this.belongsTo(models.Employee, {
        foreignKey: 'employee_id',
        as: 'employee_masa_kerja'
      })
    }
  }
  EmployeeMasaKerja.init({
    employee_id: DataTypes.INTEGER,
    masa_kerja: DataTypes.STRING,
    mk_jabatan: DataTypes.STRING,
    mk_unit: DataTypes.STRING,
    mk_grade: DataTypes.STRING,
    created_by: DataTypes.STRING,
    updated_by: DataTypes.STRING,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'EmployeeMasaKerja',
    tableName: 'employee_masa_kerja',
    schema: process.env.NODE_ENV,
    createdAt: "created_at",
    updatedAt: "updated_at"
  });
  return EmployeeMasaKerja;
};