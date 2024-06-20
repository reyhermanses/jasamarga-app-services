'use strict';
const {
  Model
} = require('sequelize');
require('dotenv').config();
module.exports = (sequelize, DataTypes) => {
  class MasterPersonalSubArea extends Model {
    static associate(models) {
      this.belongsTo(models.MasterPersonalArea, {
        foreignKey: 'master_personal_area_id'
      })
    }
  }
  MasterPersonalSubArea.init({
    description: DataTypes.STRING,
    created_by: DataTypes.STRING,
    updated_by: DataTypes.STRING,
    master_personal_area_id: DataTypes.INTEGER,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'MasterPersonalSubArea',
    tableName: 'master_personal_sub_area',
    schema: process.env.NODE_ENV,
    createdAt: "created_at",
    updatedAt: "updated_at"
  });
  return MasterPersonalSubArea;
};