'use strict';
const {
  Model
} = require('sequelize');
require("dotenv").config();
module.exports = (sequelize, DataTypes) => {
  class Org extends Model {
    static associate(models) {
      // define association here
    }
  }
  Org.init({
    start_date: DataTypes.STRING,
    end_date: DataTypes.STRING,
    object_type: DataTypes.STRING,
    object_id: DataTypes.STRING,
    object_name: DataTypes.STRING,
    subtype: DataTypes.STRING,
    subtype_text: DataTypes.STRING,
    type_of_related_object: DataTypes.STRING,
    object_sobid: DataTypes.STRING,
    object_sobid_name: DataTypes.STRING,
    change_on: DataTypes.STRING
  }, {
    sequelize,
    modelName: "Org",
    tableName: "org",
    schema: process.env.NODE_ENV,
    createdAt: "created_at",
    updatedAt: "updated_at",
  });
  return Org;
};