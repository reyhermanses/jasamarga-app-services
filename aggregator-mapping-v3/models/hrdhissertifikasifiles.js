"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class HRDHISSertifikasiFiles extends Model {
    static associate(models) {
      this.belongsTo(models.HRDHISSertifikasi, {
        foreignKey: "hrd_his_sertifikasi_id",
        as: "sertifikasi_id",
      });
    }
  }
  HRDHISSertifikasiFiles.init(
    {
      UUID: DataTypes.STRING,
      hrd_his_sertifikasi_id: DataTypes.INTEGER,
      url: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "HRDHISSertifikasiFiles",
      tableName: "hrd_his_sertifikasi_files",
      schema: process.env.NODE_ENV,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return HRDHISSertifikasiFiles;
};
