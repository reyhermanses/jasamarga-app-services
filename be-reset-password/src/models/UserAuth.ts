import {Model, DataTypes} from 'sequelize';
import sequelize from '../config/Sequelize'
import Employee from './Employee';

import * as dotenv from 'dotenv';
dotenv.config();

class UserAuth extends Model {
  static associate(models: any) {
    this.belongsTo(models.Employee, {
      foreignKey: 'employee_id',
      as: 'employee',
    });
  }
  
  public id!: number;
  public employee_id!: number;
  public username!: string;
  public password!: string;
  public password_expires!: Date;
  public is_ldap!: boolean;
  public is_mobile!: boolean;
  public token!: string;
  public token_firebase!: string;
  public last_login!: Date;
  public default_password!: string;
  public login_by!: string;
  public created_by!: string;
  public updated_by!: string;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

UserAuth.init({
  id:{
  type: DataTypes.INTEGER,
  autoIncrement: true,
  primaryKey:true
  },
  employee_id:{
    type: DataTypes.INTEGER,
  },
  username:{
    type: DataTypes.STRING
  },
  password:{
    type: DataTypes.STRING
  },
  is_ldap:{
    type: DataTypes.BOOLEAN
  },
  is_mobile:{
    type: DataTypes.BOOLEAN
  },
  token: {
    type: DataTypes.STRING
  },
  token_firebase: {
    type: DataTypes.STRING
  },
  last_login:{
    type: DataTypes.DATE
  },
  default_password: {
    type: DataTypes.STRING
  },
  created_at: {type: DataTypes.DATE},
  updated_at:{type: DataTypes.DATE}
},{
  sequelize,
  modelName: 'UserAuth',
  tableName: 'user_auth',
  schema: process.env.NODE_ENV,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

UserAuth.associate({ Employee });

export default UserAuth;