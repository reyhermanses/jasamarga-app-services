import { Model, DataTypes } from "sequelize";
import sequelize from "../config/Sequelize";

import * as dotenv from "dotenv";

dotenv.config();

class ResetPasswordMasterRole extends Model {
  public id!: number;
  public name!: string;
  public feature!: string;
  public code!: string;
  public description!: string;
  public created_by!: string;
  public updated_by!: string;
  public crated_at!: Date;
  public updated_at!: Date;
}

ResetPasswordMasterRole.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING },
    feature: { type: DataTypes.STRING },
    code: { type: DataTypes.STRING },
    description: { type: DataTypes.STRING },
    created_by: { type: DataTypes.STRING },
    updated_by: { type: DataTypes.STRING },
    created_at: { type: DataTypes.DATE },
    updated_at: { type: DataTypes.DATE },
  },
  {
    sequelize,
    modelName: "ResetPasswordMasterRole",
    tableName: "reset_password_master_role",
    schema: process.env.NODE_ENV,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default ResetPasswordMasterRole;
