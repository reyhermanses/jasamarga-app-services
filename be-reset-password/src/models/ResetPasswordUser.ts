import { Model, DataTypes } from "sequelize";
import sequelize from "../config/Sequelize";
import ResetPasswordRole from "./ResetPasswordRole";

import * as dotenv from "dotenv";

dotenv.config();

class ResetPasswordUser extends Model {
  static associate(models: any) {
    this.hasMany(models.ResetPasswordRole, {
      as: "roles",
      foreignKey: "rpu_id", // Add a foreign key to the UserAuth model referencing the Employee model
    });
  }

  public id!: number;
  public employee_id!: string;
  public username!: string;
  public is_login!: boolean;
  public is_active!: boolean;
  public created_by!: string;
  public updated_by!: string;
  public crated_at!: Date;
  public updated_at!: Date;
}

ResetPasswordUser.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    employee_id: { type: DataTypes.INTEGER },
    username: { type: DataTypes.STRING },
    is_login: { type: DataTypes.BOOLEAN },
    is_active: { type: DataTypes.BOOLEAN },
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

ResetPasswordUser.associate({ ResetPasswordRole });

export default ResetPasswordUser;
