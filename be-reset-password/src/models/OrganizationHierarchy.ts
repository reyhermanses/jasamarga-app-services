import { Model, DataTypes } from "sequelize";
import sequelize from "../config/Sequelize";
import Profile from "./Profile";
import MasterCompany from "./MasterCompany";

import * as dotenv from "dotenv";
dotenv.config();

class OrganizationHierarchy extends Model {
  static associate(models: any) {
    // this.hasOne(models.MasterCompany, {
    //   as: "company",
    //   sourceKey: "company_id_asal",
    //   foreignKey: "id", // Add a foreign key to the UserAuth model referencing the Employee model
    // });
    // this.hasOne(models.Profile, {
    //   as: "profile",
    //   foreignKey: "employee_id", // Add a foreign key to the UserAuth model referencing the Employee model
    // });
  }

  public id!: number;
  public name!: string;
  public parent_id!: number;
  public type_organization!: string;
  public active!: boolean;
  public relation!: string;
  public leader_id!: string;
  public leader_position_id!: number;
  public personal_area_id!: number;
  public fungsi_organisasi!: string;
  public keterangan_ap!: string;
  public singkatan!: string;
  public created_by!: string;
  public updated_by!: string;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

OrganizationHierarchy.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    type_organization: {
      type: DataTypes.STRING,
    },
    active: {
      type: DataTypes.BOOLEAN,
    },
    relation: {
      type: DataTypes.STRING,
    },
    leader_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    leader_position_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    personal_area_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    fungsi_organisasi: {
      type: DataTypes.STRING,
    },
    keterangan_ap: {
      type: DataTypes.STRING,
    },
    singkatan: {
      type: DataTypes.STRING,
    },
    created_by: { type: DataTypes.STRING },
    updated_by: { type: DataTypes.STRING },
  },
  {
    sequelize,
    modelName: "OrganizationHierarchy",
    tableName: "organization_hierarchy",
    schema: process.env.NODE_ENV,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default OrganizationHierarchy;
