'use strict';
const {
  Model
} = require('sequelize');
require('dotenv').config();
module.exports = (sequelize, DataTypes) => {
  class Document extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Document.init({
    personnel_number: DataTypes.STRING,
    subtype: DataTypes.STRING,
    valid_from: DataTypes.STRING,
    valid_to: DataTypes.STRING,
    doc_type: DataTypes.STRING,
    doc_country: DataTypes.STRING,
    doc_number: DataTypes.STRING,
    issue_date: DataTypes.STRING,
    issue_place: DataTypes.STRING,
    issue_ctry: DataTypes.STRING,
    doc_status: DataTypes.STRING,
    location: DataTypes.STRING,
    tanggal_efektif_sk: DataTypes.STRING,
    change_on: DataTypes.STRING,
    created_by: DataTypes.STRING,
    updated_by: DataTypes.STRING,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'Document',
    tableName: 'document',
    schema: process.env.NODE_ENV,
    createdAt: "created_at",
    updatedAt: "updated_at"
  });
  return Document;
};