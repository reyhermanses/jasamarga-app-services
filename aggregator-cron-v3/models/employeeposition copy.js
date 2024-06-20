"use strict";
const { Model } = require("sequelize");
require("dotenv").config();
module.exports = (sequelize, DataTypes) => {
  class EmployeePosition extends Model {
    static associate(models) {
      this.belongsTo(models.Employee, {
        foreignKey: "employee_id",
        as: "employee_position",
      });

      this.belongsTo(models.Employee, {
        foreignKey: "atasan_id",
        as: "atasan",
      });

      this.belongsTo(models.EmployeePosition, {
        foreignKey: "atasan_id",
        targetKey: "employee_id",
        as: "test_atasan",
      });

      this.belongsTo(models.EmployeePosition, {
        foreignKey: "atasan_ap_id",
        targetKey: "employee_id",
        as: "test_atasan_ap",
      });

      this.belongsTo(models.Employee, {
        foreignKey: "atasan_ap_id",
        as: "atasan_ap",
      });

      this.belongsTo(models.MasterPosition, {
        foreignKey: "atasan_position_id",
        as: "atasan_position",
      });

      this.belongsTo(models.MasterPosition, {
        foreignKey: "atasan_ap_position_id",
        as: "atasan_ap_position",
      });

      this.belongsTo(models.MasterPosition, {
        foreignKey: "position_id",
        as: "position_detail",
      });
    }
  }
  EmployeePosition.init(
    {
      employee_id: DataTypes.INTEGER,
      npp: DataTypes.INTEGER,
      personnel_number: DataTypes.STRING,
      new_npp: DataTypes.STRING,
      position_id: DataTypes.INTEGER,
      atasan_id: DataTypes.INTEGER,
      atasan_position_id: DataTypes.INTEGER,
      action: DataTypes.STRING,
      atasan_ap_id: DataTypes.INTEGER,
      atasan_ap_position_id: DataTypes.INTEGER,
      cost_center: DataTypes.STRING,
      ket_ap: DataTypes.STRING,
      is_main: DataTypes.BOOLEAN,
      created_by: DataTypes.STRING,
      updated_by: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "EmployeePosition",
      tableName: "employee_position",
      schema: process.env.NODE_ENV,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return EmployeePosition;
};
