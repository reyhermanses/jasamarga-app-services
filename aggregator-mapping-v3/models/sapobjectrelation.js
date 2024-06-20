'use strict';
const {
  Model
} = require('sequelize');
require('dotenv').config();
module.exports = (sequelize, DataTypes) => {
  class sapObjectRelation extends Model {
    static associate(models) {
      // define association here
    }
  }
  sapObjectRelation.init({
    object_type: DataTypes.STRING,
    object_id: DataTypes.STRING,
    start_date: DataTypes.STRING,
    end_date: DataTypes.STRING,
    subtype: DataTypes.STRING,
    type_of_related_object: DataTypes.STRING,
    id_of_related_object: DataTypes.STRING,
    changedate: DataTypes.STRING,
    syn_status: DataTypes.BOOLEAN,
    opera: DataTypes.STRING,
    insert_date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'sapObjectRelation',
    tableName: 'sap_object_relation',
    schema: process.env.NODE_ENV,
    createdAt: "created_at",
    updatedAt: "updated_at"
  });
  return sapObjectRelation;
};