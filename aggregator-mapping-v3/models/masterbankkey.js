'use strict';
const {
  Model
} = require('sequelize');
require('dotenv').config();
module.exports = (sequelize, DataTypes) => {
  class MasterBankKey extends Model {
    static associate(models) {
    
    }
  }
  MasterBankKey.init({
    bank_key: DataTypes.STRING,
    bank_name: DataTypes.STRING,
    created_by: DataTypes.STRING,
    updated_by: DataTypes.STRING,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'MasterBankKey',
    tableName: 'master_bank_key',
    schema: process.env.NODE_ENV,
    createdAt: "created_at",
    updatedAt: "updated_at"
  });
  return MasterBankKey;
};