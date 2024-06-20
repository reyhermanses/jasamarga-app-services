import { Model, DataTypes } from "sequelize";
import sequelize from "../config/Sequelize";

import * as dotenv from "dotenv";

dotenv.config();

class MasterCompany extends Model {
  // static associate(models: any) {}

  public id!: number;
  public org_id!: number;
  public name!: string;
  public active!: boolean;
  public nm_singkatan!: string;
  public created_by!: string;
  public updated_by!: string;
}

MasterCompany.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    org_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
    },
    nm_singkatan: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created_by: { type: DataTypes.STRING },
    updated_by: { type: DataTypes.STRING },
  },
  {
    sequelize,
    modelName: "MasterCompany",
    tableName: "master_company",
    schema: process.env.NODE_ENV,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default MasterCompany;
