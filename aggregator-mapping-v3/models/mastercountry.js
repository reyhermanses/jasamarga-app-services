'use strict';
const {
  Model
} = require('sequelize');
require('dotenv').config();
module.exports = (sequelize, DataTypes) => {
  class MasterCountry extends Model {
    static associate(models) {
      this.hasMany(models.MasterProvince, {
        foreignKey: 'country_id'
      })
    }
  }
  MasterCountry.init({
    description: DataTypes.STRING,
    active: DataTypes.BOOLEAN,
    created_by: DataTypes.STRING,
    updated_by: DataTypes.STRING,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    code: DataTypes.STRING(10)
  }, {
    sequelize,
    modelName: 'MasterCountry',
    tableName: 'master_country',
    schema: process.env.NODE_ENV,
    createdAt: "created_at",
    updatedAt: "updated_at"
  });
  return MasterCountry;
};