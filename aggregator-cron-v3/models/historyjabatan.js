"use strict";
const moment = require("moment");
const { Model } = require("sequelize");
require("dotenv").config();
module.exports = (sequelize, DataTypes) => {
  class HistoryJabatan extends Model {
    static associate(models) {
      this.belongsTo(models.Employee, {
        as: "employee",
        foreignKey: "employee_id",
      });
      this.belongsTo(models.MasterCompany, {
        as: "company",
        foreignKey: "kd_comp",
      });
    }
  }
  HistoryJabatan.init(
    {
      employee_id: DataTypes.INTEGER,
      angkatan: DataTypes.INTEGER,
      posisi: DataTypes.STRING,
      sk_posisi: DataTypes.STRING,
      awal_posisi: {
        type: DataTypes.DATE,
      },
      akhir_posisi: {
        type: DataTypes.DATE,
      },
      grade: DataTypes.STRING,
      level: DataTypes.STRING,
      konversi: DataTypes.STRING,
      unit: DataTypes.STRING,
      kd_comp: DataTypes.INTEGER,
      cluster: DataTypes.STRING(50),
      sub_cluster: DataTypes.STRING(50),
      file_sk: DataTypes.TEXT,
      sk_position_date: DataTypes.DATE,
      action: DataTypes.STRING,
      is_main: DataTypes.BOOLEAN,
      info: DataTypes.STRING,
      npp: DataTypes.STRING,
      personnel_number: DataTypes.STRING,
      created_by: DataTypes.STRING,
      updated_by: DataTypes.STRING,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "HistoryJabatan",
      tableName: "history_jabatan",
      schema: process.env.NODE_ENV,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return HistoryJabatan;
};
