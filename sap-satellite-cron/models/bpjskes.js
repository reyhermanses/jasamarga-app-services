'use strict';
const {
  Model
} = require('sequelize');
require('dotenv').config();
module.exports = (sequelize, DataTypes) => {
  class BpjsKes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  BpjsKes.init({
    personnel_number: DataTypes.STRING,
    begin_date: DataTypes.STRING,
    end_date: DataTypes.STRING,
    bpjs_id: DataTypes.STRING,
    change_on: DataTypes.STRING,
    created_by: DataTypes.STRING,
    updated_by: DataTypes.STRING,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'BpjsKes',
    tableName: 'bpjs_kes',
    schema: process.env.NODE_ENV,
    createdAt: "created_at",
    updatedAt: "updated_at"
  });
  return BpjsKes;
};