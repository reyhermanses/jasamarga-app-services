'use strict';
const {
  Model
} = require('sequelize');
require('dotenv').config();
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
    }
  }
  User.init({
  ID: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  V_USERNAME: DataTypes.STRING,
  C_PASSWORD: DataTypes.STRING,
  C_STATUS_ID: DataTypes.INTEGER,
  V_TOKEN: DataTypes.STRING,
  C_EXPIRES: DataTypes.INTEGER,
  D_LAST_LOGIN: DataTypes.DATE,
  D_CREATED_DATE: DataTypes.DATE,
  V_CREATED_BY: DataTypes.STRING,
  D_UPDATED_DATE: DataTypes.DATE,
  V_UPDATED_BY: DataTypes.STRING,
  TOKEN_FIREBASE: DataTypes.STRING,
  KD_COMP: DataTypes.STRING,
  NPP: DataTypes.STRING,
  IS_MOBILE: DataTypes.INTEGER,
  IS_LDAP: DataTypes.INTEGER,
  PASSWORD: DataTypes.STRING
  }, {
    sequelize,
    freezeTableName: true,
    modelName: 'User',
    tableName: 'USERS',
    schema: 'public',
    timestamps: false
  });
  return User;
};