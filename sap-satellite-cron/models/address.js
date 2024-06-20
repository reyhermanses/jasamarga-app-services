'use strict';
const {
  Model
} = require('sequelize');
require('dotenv').config();
module.exports = (sequelize, DataTypes) => {
  class Address extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Address.init({
    personnel_number: DataTypes.STRING,
    begin_date: DataTypes.STRING,
    end_date: DataTypes.STRING,
    address_type: DataTypes.STRING,
    alamat_karyawan: DataTypes.TEXT,
    kota_karyawan: DataTypes.STRING,
    provinsi_karyawan: DataTypes.STRING,
    kode_pos: DataTypes.STRING,
    district_kecamatan: DataTypes.STRING,
    kode_negara: DataTypes.STRING,
    telephone_number: DataTypes.STRING,
    no_rt: DataTypes.STRING,
    no_rw: DataTypes.STRING,
    change_on: DataTypes.STRING,
    created_by: DataTypes.STRING,
    updated_by: DataTypes.STRING,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'Address',
    tableName: 'address',
    schema: process.env.NODE_ENV,
    createdAt: "created_at",
    updatedAt: "updated_at"
  });
  return Address;
};