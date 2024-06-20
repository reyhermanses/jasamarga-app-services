'use strict';
const {
  Model
} = require('sequelize');
require('dotenv').config();
module.exports = (sequelize, DataTypes) => {
  class MasterEmployeeGroup extends Model {
    static associate(models) {
      this.hasMany(models.MasterEmployeeSubGroup, {
        foreignKey: 'master_employee_group_id',
        onDelete: 'CASCADE'
      })
    }
  }
  MasterEmployeeGroup.init({
    description: DataTypes.STRING,
    active: DataTypes.BOOLEAN,
    created_by: DataTypes.STRING,
    updated_by: DataTypes.STRING,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'MasterEmployeeGroup',
    tableName: 'master_employee_group',
    schema: process.env.NODE_ENV,
    createdAt: "created_at",
    updatedAt: "updated_at"
  });
  return MasterEmployeeGroup;
};