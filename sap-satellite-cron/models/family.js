'use strict';
const {
  Model
} = require('sequelize');
require('dotenv').config();
module.exports = (sequelize, DataTypes) => {
  class Family extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Family.init({
    personnel_number: DataTypes.STRING,
    begin_date: DataTypes.STRING,
    end_date: DataTypes.STRING,
    object_id: DataTypes.STRING,
    kode_hubungan: DataTypes.STRING,
    nama_keluarga: DataTypes.STRING,
    jenis_kelamin: DataTypes.STRING,
    tanggal_lahir: DataTypes.STRING,
    tempat_lahir: DataTypes.STRING,
    dependent_tax_purpose: DataTypes.STRING,
    bpjs_dependent_type: DataTypes.STRING,
    no_bpjs: DataTypes.STRING,
    benefit_class: DataTypes.STRING,
    id_card_type: DataTypes.STRING,
    id_card_number: DataTypes.STRING,
    change_on: DataTypes.STRING,
    created_by: DataTypes.STRING,
    updated_by: DataTypes.STRING,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Family',
    tableName: 'family',
    schema: process.env.NODE_ENV,
    createdAt: "created_at",
    updatedAt: "updated_at"
  });
  return Family;
};