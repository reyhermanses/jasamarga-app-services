"use strict";
const { Model } = require("sequelize");
require("dotenv").config();
module.exports = (sequelize, DataTypes) => {
  class EmployeeEducation extends Model {
    static associate(models) {
      this.belongsTo(models.Employee, {
        foreignKey: "employee_id",
        as: "employee_education",
      });

      this.belongsTo(models.MasterCountry, {
        foreignKey: "country_id",
        as: "country_education",
      });

      this.belongsTo(models.MasterJenjangPendidikan, {
        foreignKey: "ref_jenjang_pendidikan_id",
        as: "jenjang_pendidikan",
      });

      this.belongsTo(models.MasterJurusanPendidikan, {
        foreignKey: "ref_jurusan_pendidikan_id",
        as: "jurusan_pendidikan",
      });

      this.belongsTo(models.MasterInstansiPendidikan, {
        foreignKey: "instansi_pendidikan_id",
        as: "instansi_pendidikan",
      });

      this.belongsTo(models.MasterFakultasPendidikan, {
        foreignKey: "fakultas_pendidikan_id",
        as: "fakultas_pendidikan",
      });

      this.belongsTo(models.MasterGelarPendidikan, {
        foreignKey: "gelar_pendidikan_id",
        as: "gelar_pendidikan",
      });
    }
  }
  EmployeeEducation.init(
    {
      employee_id: DataTypes.INTEGER,
      ref_jenjang_pendidikan_id: DataTypes.INTEGER,
      ref_jurusan_pendidikan_id: DataTypes.INTEGER,
      instansi_pendidikan_id: DataTypes.INTEGER,
      fakultas_pendidikan_id: DataTypes.INTEGER,
      gelar_pendidikan_id: DataTypes.INTEGER,
      name: DataTypes.STRING,
      address: DataTypes.STRING,
      country_id: DataTypes.INTEGER,
      start_date: DataTypes.DATE,
      graduate_date: DataTypes.DATE,
      title: DataTypes.STRING,
      no_ijazah: DataTypes.STRING,
      tanggal_ijazah: DataTypes.DATE,
      final_score: DataTypes.STRING,
      education_degree: DataTypes.STRING,
      created_by: DataTypes.STRING,
      updated_by: DataTypes.STRING,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
      changedate: DataTypes.STRING(10),
    },
    {
      sequelize,
      modelName: "EmployeeEducation",
      tableName: "employee_education",
      schema: process.env.NODE_ENV,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return EmployeeEducation;
};
