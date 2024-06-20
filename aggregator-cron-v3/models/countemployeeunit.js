'use strict';
const {
  Model
} = require('sequelize');
require('dotenv').config();
module.exports = (sequelize, DataTypes) => {
  class CountEmployeeUnit extends Model {
    static associate(models) {
      this.belongsTo(models.OrganizationHierarchy, { as: 'parent', foreignKey: 'parent_id' });
    }
  }
  CountEmployeeUnit.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    count_karyawan: DataTypes.INTEGER,
    unit_kerja: DataTypes.STRING,
    parent_id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'CountEmployeeUnit',
    freezeTableName: true,
    tableName: 'count_employee_unit',
    schema: process.env.NODE_ENV,
    timestamps: false
  });
  return CountEmployeeUnit;
};