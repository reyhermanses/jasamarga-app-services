import {Model, DataTypes} from 'sequelize';
import sequelize from '../config/Sequelize'

import * as dotenv from 'dotenv';
dotenv.config();

class ResetPassword extends Model{
  public id!: number;
  public employee_id!: number;
  public username!:string;
  public random!:string;
  public expires!:Date;
  public is_use!: boolean;
  public created_by!: string;
  public updated_by!: string;
  public crated_at!:Date;
  public updated_at!:Date;
}

ResetPassword.init({
  id: { 
    type: DataTypes.NUMBER,
    autoIncrement: true,
    primaryKey:true 
  },
  employee_id: { type: DataTypes.NUMBER },
  username: { type: DataTypes.STRING},
  random: { type: DataTypes.STRING},
  expires: { type: DataTypes.DATE},
  is_use: { type: DataTypes.BOOLEAN},
  created_by: { type: DataTypes.STRING },
  updated_by: { type: DataTypes.STRING },
  created_at: { type: DataTypes.DATE},
  updated_at: { type: DataTypes.DATE}
},{
  sequelize,
  modelName: 'ResetPassword',
  tableName: 'reset_password',
  schema: process.env.NODE_ENV,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default ResetPassword