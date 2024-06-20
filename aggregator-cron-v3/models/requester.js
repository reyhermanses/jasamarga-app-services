'use strict';
const {
  Model
} = require('sequelize');
require('dotenv').config();
module.exports = (sequelize, DataTypes) => {
  class Requester extends Model {
    static associate(models) {
    }
  }
  Requester.init({
    name: DataTypes.STRING,
    key: DataTypes.STRING,
    role: DataTypes.ENUM('Admin', 'Non-Admin'),
    created_by: DataTypes.STRING,
    updated_by: DataTypes.STRING,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'Requester',
    tableName: 'requester',
    schema: process.env.NODE_ENV,
    createdAt: "created_at",
    updatedAt: "updated_at"
  });
  return Requester;
};