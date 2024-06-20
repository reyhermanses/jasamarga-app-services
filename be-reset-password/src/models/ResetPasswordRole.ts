import { Model, DataTypes } from "sequelize";
import sequelize from "../config/Sequelize";

import * as dotenv from "dotenv";

dotenv.config();

class ResetPasswordRole extends Model {
  public id!: number;
  public rpmr_id!: number;
  public rpu_id!: number;
  public created_by!: string;
  public updated_by!: string;
  public crated_at!: Date;
  public updated_at!: Date;
}

ResetPasswordRole.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    rpmr_id: { type: DataTypes.INTEGER },
    rpu_id: { type: DataTypes.INTEGER },
    created_by: { type: DataTypes.STRING },
    updated_by: { type: DataTypes.STRING },
    created_at: { type: DataTypes.DATE },
    updated_at: { type: DataTypes.DATE },
  },
  {
    sequelize,
    modelName: "ResetPasswordUser",
    tableName: "reset_password_user",
    schema: process.env.NODE_ENV,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default ResetPasswordRole;
