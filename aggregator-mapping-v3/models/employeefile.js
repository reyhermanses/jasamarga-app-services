'use strict';
const {
  Model
} = require('sequelize');
require('dotenv').config();
module.exports = (sequelize, DataTypes) => {
  class EmployeeFile extends Model {
    static associate(models) {
      // define association here
      this.belongsTo(models.Employee, {
        foreignKey: 'employee_id',
        as: 'employee_file'
      })
    }
  }
  EmployeeFile.init({
    employee_id: DataTypes.INTEGER,
    url: DataTypes.TEXT,
    active: DataTypes.BOOLEAN,
    type: DataTypes.STRING,
    created_by: DataTypes.STRING,
    updated_by: DataTypes.STRING,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'EmployeeFile',
    tableName: 'employee_file',
    schema: process.env.NODE_ENV,
    createdAt: "created_at",
    updatedAt: "updated_at"
  });
  return EmployeeFile;
};