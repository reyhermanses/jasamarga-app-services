import { Model, DataTypes } from "sequelize";
import sequelize from "../config/Sequelize";

import * as dotenv from "dotenv";
import EmployeePosition from "./EmployeePosition";
import OrganizationHierarchy from "./OrganizationHierarchy";
// import OrganizationHierarchy from "./OrganizationHierarchy";
dotenv.config();

class MasterPosition extends Model {
  static associate(models: any) {
    this.hasOne(models.EmployeePosition, {
      as: "position",
      foreignKey: "position_id",
    });
    this.belongsTo(models.OrganizationHierarchy, {
      as: "unit",
      foreignKey: "unit_kerja_id",
    });
  }

  public id!: number;
  public name!: string;
  public org_id!: number;
  public active!: boolean;
  public company_id!: number;
  public unit_kerja_id!: number;
  public direktorat_id!: number;
  public departemen_id!: number;
  public seksi_id!: string;
  public job_id!: string;
  public fungsi_jabatan!: string;
  public personal_area_id!: number;
  public personal_sub_area_id!: number;
  public sk_position_no!: string;
  public sk_position_date!: Date;
  public start_date!: Date;
  public grade!: string;
  public level!: string;
  public end_date!: Date;
  public cluster_id!: number;
  public sub_cluster_id!: number;
  public kelompok_jabtan!: string;
  public konversi!: string;
  public grade_level_id!: number;
  public file_sk!: string;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

MasterPosition.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    org_id: {
      type: DataTypes.INTEGER,
    },
    active: {
      type: DataTypes.BOOLEAN,
    },
    company_id: {
      type: DataTypes.INTEGER,
    },
    unit_kerja_id: {
      type: DataTypes.INTEGER,
    },
    direktorat_id: {
      type: DataTypes.INTEGER,
    },
    departemen_id: {
      type: DataTypes.INTEGER,
    },
    seksi_id: {
      type: DataTypes.INTEGER,
    },
    job_id: {
      type: DataTypes.INTEGER,
    },
    fungsi_jabatan: {
      type: DataTypes.STRING,
    },
    personal_area_id: {
      type: DataTypes.INTEGER,
    },
    personal_sub_area_id: {
      type: DataTypes.INTEGER,
    },
    sk_position_no: {
      type: DataTypes.STRING,
    },
    sk_position_date: {
      type: DataTypes.DATE,
    },
    start_date: {
      type: DataTypes.DATE,
    },
    grade: {
      type: DataTypes.STRING,
    },
    level: {
      type: DataTypes.STRING,
    },
    end_date: {
      type: DataTypes.DATE,
    },
    cluster_id: {
      type: DataTypes.INTEGER,
    },
    sub_cluster_id: {
      type: DataTypes.INTEGER,
    },
    kelompok_jabatan: {
      type: DataTypes.STRING,
    },
    konversi: {
      type: DataTypes.STRING,
    },
    grade_level_id: {
      type: DataTypes.INTEGER,
    },
    file_sk: {
      type: DataTypes.STRING,
    },
    created_by: { type: DataTypes.STRING },
    updated_by: { type: DataTypes.STRING },
  },
  {
    sequelize,
    modelName: "MasterPosition",
    tableName: "master_position",
    schema: process.env.NODE_ENV,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

MasterPosition.associate({
  EmployeePosition,
  OrganizationHierarchy,
});

export default MasterPosition;
