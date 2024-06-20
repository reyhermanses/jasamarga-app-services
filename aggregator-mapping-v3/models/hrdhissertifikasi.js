"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class HRDHISSertifikasi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  HRDHISSertifikasi.init(
    {
      employee_id: DataTypes.INTEGER,
      UUID: DataTypes.STRING,
      tahun: DataTypes.INTEGER,
      nm_sertifikasi: DataTypes.STRING,
      nm_institusi: DataTypes.STRING,
      tgl_ambil: DataTypes.DATE,
      tgl_habis_berlaku: DataTypes.DATE,
      tempat: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "HRDHISSertifikasi",
      tableName: "hrd_his_sertifikasi",
      schema: process.env.NODE_ENV,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return HRDHISSertifikasi;
};
