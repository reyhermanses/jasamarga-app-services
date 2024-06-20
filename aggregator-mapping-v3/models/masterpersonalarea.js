'use strict';
const {
  Model
} = require('sequelize');
require('dotenv').config();
module.exports = (sequelize, DataTypes) => {
  class MasterPersonalArea extends Model {
    static associate(models) {
      this.hasMany(models.MasterPersonalSubArea, {
        foreignKey: 'master_personal_area_id',
        as: 'personal_sub_area'
      })
    }
  }
  MasterPersonalArea.init({
    description: DataTypes.STRING,
    created_by: DataTypes.STRING,
    updated_by: DataTypes.STRING,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'MasterPersonalArea',
    tableName: 'master_personal_area',
    schema: process.env.NODE_ENV,
    createdAt: "created_at",
    updatedAt: "updated_at"
  });
  return MasterPersonalArea;
};