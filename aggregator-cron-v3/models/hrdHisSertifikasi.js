"use strict";
const moment = require("moment");
const { Model } = require("sequelize");
require("dotenv").config();
module.exports = (sequelize, DataTypes) => {
  class HrdHisSertifikasi extends Model {
    static associate(models) {
      // relasi ke tabel employee
      this.belongsTo(models.Employee, {
        as: "employee",
        foreignKey: "employee_id",
      });

      // relasi ke tabel hrd_his_sertifikasi_files
      this.hasMany(models.HrdHisSertifikasiFiles, {
          foreignKey: "hrd_his_sertifikasi_id",
          as: "sertifikasi_files",
      });
    }
  }
  

  HrdHisSertifikasi.init(
    {
      employee_id: DataTypes.INTEGER,
      UUID : DataTypes.STRING,
      tahun : DataTypes.INTEGER,
      nm_sertifikasi : DataTypes.TEXT,
      nm_institusi : DataTypes.TEXT,
      tgl_ambil : DataTypes.DATE,
      tgl_habis_berlaku : DataTypes.DATE,
      tempat : DataTypes.STRING,
      created_by: DataTypes.STRING,
      updated_by: DataTypes.STRING,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "HrdHisSertifikasi",
      tableName: "hrd_his_sertifikasi",
      schema: process.env.NODE_ENV,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return HrdHisSertifikasi;
};
