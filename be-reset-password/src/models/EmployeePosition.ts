import { Model, DataTypes } from "sequelize";
import sequelize from "../config/Sequelize";

import * as dotenv from "dotenv";
import UserAuth from "./UserAuth";
import MasterPosition from "./MasterPosition";
dotenv.config();

class EmployeePosition extends Model {
  static associate(models: any) {
    this.hasOne(models.UserAuth, {
      as: "user_auth",
      sourceKey: "employee_id",
      foreignKey: "employee_id",
    });

    // this.belongsTo(models.MasterPosition, {
    //   as: "position_detail",
    //   foreignKey: "position_id",
    // });
  }

  public id!: number;
  public employee_id!: number;
  public npp!: string;
  public personnel_number!: string;
  public new_npp!: string;
  public position_id!: number;
  public atasan_id!: number;
  public atasan_position_id!: number;
  public action!: string;
  public atasan_ap_id!: number;
  public atasan_ap_position_id!: number;
  public cost_center!: string;
  public ket_ap!: string;
  public is_main!: boolean;
  public created_by!: string;
  public updated_by!: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

EmployeePosition.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    employee_id: {
      type: DataTypes.INTEGER,
    },
    npp: {
      type: DataTypes.STRING,
    },
    personnel_number: {
      type: DataTypes.STRING,
    },
    new_npp: {
      type: DataTypes.STRING,
    },
    position_id: {
      type: DataTypes.INTEGER,
    },
    atasan_id: {
      type: DataTypes.INTEGER,
    },
    atasan_position_id: {
      type: DataTypes.INTEGER,
    },
    action: {
      type: DataTypes.STRING,
    },
    atasan_ap_id: {
      type: DataTypes.INTEGER,
    },
    atasan_ap_position_id: {
      type: DataTypes.INTEGER,
    },
    cost_center: {
      type: DataTypes.STRING,
    },
    ket_ap: { type: DataTypes.STRING },
    is_main: { type: DataTypes.BOOLEAN },
    created_by: { type: DataTypes.STRING },
    updated_by: { type: DataTypes.STRING },
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

EmployeePosition.associate({ UserAuth });

export default EmployeePosition;
