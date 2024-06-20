'use strict';
const {
  Model
} = require('sequelize');
require('dotenv').config();
module.exports = (sequelize, DataTypes) => {
  class MasterEmployeeSubGroup extends Model {

    static associate(models) {
      this.belongsTo(models.MasterEmployeeGroup, {
        foreignKey: 'id'
      })

      this.hasMany(models.MasterGradeLevel, {
        foreignKey: 'subgroup_id'
      })
    }
  }
  MasterEmployeeSubGroup.init({
    key: DataTypes.STRING,
    subgroup: DataTypes.STRING,
    active: DataTypes.BOOLEAN,
    master_employee_group_id: DataTypes.INTEGER,
    created_by: DataTypes.STRING,
    updated_by: DataTypes.STRING,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'MasterEmployeeSubGroup',
    tableName: 'master_employee_subgroup',
    schema: process.env.NODE_ENV,
    createdAt: "created_at",
    updatedAt: "updated_at"
  });
  return MasterEmployeeSubGroup;
};