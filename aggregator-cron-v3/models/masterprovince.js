'use strict';
const {
  Model
} = require('sequelize');
require('dotenv').config();
module.exports = (sequelize, DataTypes) => {
  class MasterProvince extends Model {
    static associate(models) {
      this.belongsTo(models.MasterCountry, {
        foreignKey: 'country_id'
      })
      this.hasMany(models.MasterCity, {
        foreignKey: 'province_id'
      })
    }
  }
  MasterProvince.init({
    description: DataTypes.STRING,
    country_id: DataTypes.INTEGER,
    active: DataTypes.BOOLEAN,
    created_by: DataTypes.STRING,
    updated_by: DataTypes.STRING,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'MasterProvince',
    tableName: 'master_province',
    schema: process.env.NODE_ENV,
    createdAt: "created_at",
    updatedAt: "updated_at"
  });
  return MasterProvince;
};