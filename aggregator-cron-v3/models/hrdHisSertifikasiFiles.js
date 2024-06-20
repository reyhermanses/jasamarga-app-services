"use strict";
const moment = require("moment");
const { Model } = require("sequelize");
require("dotenv").config();
module.exports = (sequelize, DataTypes) => {
  class HrdHisSertifikasiFiles extends Model {
    static associate(models) {
      // relasi ke tabel hrd_his_sertifikasi
      this.belongsTo(models.HrdHisSertifikasi, {
        as: "sertifikasi",
        foreignKey: "hrd_his_sertifikasi_id",
      });
    }
  }

  HrdHisSertifikasiFiles.init(
    {
      UUID : DataTypes.STRING,
      hrd_his_sertifikasi_id : DataTypes.INTEGER,
      url: DataTypes.TEXT,
      created_by: DataTypes.STRING,
      updated_by: DataTypes.STRING,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
      file_name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "HrdHisSertifikasiFiles",
      tableName: "hrd_his_sertifikasi_files",
      schema: process.env.NODE_ENV,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return HrdHisSertifikasiFiles;
};
