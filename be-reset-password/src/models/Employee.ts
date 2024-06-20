import { Model, DataTypes } from "sequelize";
import sequelize from "../config/Sequelize";
import Profile from "./Profile";
import MasterCompany from "./MasterCompany";
import EmployeePosition from "./EmployeePosition";

import * as dotenv from "dotenv";
dotenv.config();

class Employee extends Model {
  static associate(models: any) {
    this.hasOne(models.MasterCompany, {
      as: "company",
      sourceKey: "company_id_asal",
      foreignKey: "id", // Add a foreign key to the UserAuth model referencing the Employee model
    });
    this.hasOne(models.Profile, {
      as: "profile",
      foreignKey: "employee_id", // Add a foreign key to the UserAuth model referencing the Employee model
    });
  }

  public id!: number;
  public name!: string;
  public employee_status!: boolean;
  public start_date!: Date;
  public end_date!: Date;
  public employee_group_id!: number;
  public employee_sub_group_id!: number;
  public sap_emp_status!: boolean;
  public company_id_asal!: number;
  public business_area_id!: number;
  public date_of_entry!: Date;
  public is_rangkap_jabatan!: boolean;
  public is_penugasan!: boolean;
  public created_by!: string;
  public updated_by!: string;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Employee.init(
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
    employee_status: {
      type: DataTypes.BOOLEAN,
    },
    start_date: {
      type: DataTypes.DATE,
    },
    end_date: {
      type: DataTypes.DATE,
    },
    employee_group_id: {
      type: DataTypes.INTEGER,
    },
    employee_sub_group_id: {
      type: DataTypes.INTEGER,
    },
    sap_emp_status: {
      type: DataTypes.BOOLEAN,
    },
    company_id_asal: {
      type: DataTypes.INTEGER,
    },
    business_area_id: {
      type: DataTypes.INTEGER,
    },
    date_of_entry: {
      type: DataTypes.DATE,
    },
    is_rangkap_jabatan: {
      type: DataTypes.BOOLEAN,
    },
    is_penugasan: {
      type: DataTypes.BOOLEAN,
    },
    created_by: { type: DataTypes.STRING },
    updated_by: { type: DataTypes.STRING },
  },
  {
    sequelize,
    modelName: "Employee",
    tableName: "employee",
    schema: process.env.NODE_ENV,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

Employee.associate({ Profile, MasterCompany });

export default Employee;
