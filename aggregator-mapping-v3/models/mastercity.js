'use strict';
const {
  Model
} = require('sequelize');
require('dotenv').config();
module.exports = (sequelize, DataTypes) => {
  class MasterCity extends Model {
    static associate(models) {
      this.belongsTo(models.MasterProvince, {
        foreignKey: 'province_id'
      })
    }
  }
  MasterCity.init({
    description: DataTypes.STRING,
    province_id: DataTypes.INTEGER,
    active: DataTypes.BOOLEAN,
    created_by: DataTypes.STRING,
    updated_by: DataTypes.STRING,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'MasterCity',
    tableName: 'master_city',
    schema: process.env.NODE_ENV,
    createdAt: "created_at",
    updatedAt: "updated_at"
  });
  return MasterCity;
};