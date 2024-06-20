import { Model, DataTypes } from "sequelize";
import sequelize from "../config/Sequelize";

import * as dotenv from "dotenv";
dotenv.config();

class Profile extends Model {
  public id!: number;
  public email_perusahaan!: string;
  public email_pribadi!: string;
}

Profile.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email_perusahaan: {
      type: DataTypes.STRING,
    },
    email_pribadi: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "Profile",
    tableName: "employee_profile",
    schema: process.env.NODE_ENV,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default Profile;
